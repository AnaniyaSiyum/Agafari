export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { verifyPassword } from '@/lib/passwords';
import { verifyTotpCode, generateTotpSecret, generateTotpUri } from '@/lib/totp';
import { signSessionToken } from '@/lib/requireMembership';
import { isRateLimited, recordFailedLogin, resetFailedLogins, getRateLimitKey } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import { AppRole, UserMembership } from '@/types/auth';

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

function resolveRoleDashboard(role: string, scopeId: string): string {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return '/admin';
    case 'ORGANIZER_OWNER':
    case 'EVENT_ORGANIZER':
      return '/organizer';
    case 'COUPLE':
    case 'BRIDE_GROOM':
      return scopeId && scopeId !== 'event-default' ? `/couple/${scopeId}` : '/couple';
    case 'GATE_SCANNER':
      return `/event/${scopeId}/scanner`;
    case 'MEDIA_MODERATOR':
    case 'MODERATOR':
      return `/event/${scopeId}/moderation`;
    case 'LIVE_STREAMER':
      return `/event/${scopeId}/live-streamer`;
    default:
      return '/login';
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const body = await req.json().catch(() => ({}));
    const identifier = (body.username || body.email || body.identifier || '').trim().toLowerCase();
    const password = (body.password || '').trim();
    const totpCode = body.totpCode ? String(body.totpCode).trim() : null;
    const requestedMembershipId = body.membershipId ? String(body.membershipId).trim() : null;

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Username/Email and Password are required.' }, { status: 400 });
    }

    const rateLimitKey = getRateLimitKey(ip, identifier);
    const rateCheck = isRateLimited(rateLimitKey);

    if (rateCheck.limited) {
      await logAudit({
        actorId: null,
        action: 'LOGIN_RATE_LIMITED',
        ip,
        metaJson: { identifier, attempts: rateCheck.attempts },
      });
      return NextResponse.json(
        {
          error: 'Too many failed login attempts. Please complete CAPTCHA or wait before retrying.',
          rateLimited: true,
          requireCaptcha: true,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // 1. Look up user by email or phone or id
    const user = await queryOne<any>(
      `SELECT id, email, phone, full_name, role, password_hash, status, totp_secret, totp_enabled, session_version
       FROM users
       WHERE LOWER(email) = $1 OR LOWER(phone) = $1 OR id = $1
       LIMIT 1`,
      [identifier]
    );

    // Uniform failure defense: non-existent, pending, disabled, or missing password_hash
    if (!user || (user.status && user.status !== 'ACTIVE' && user.status !== 'active') || !user.password_hash) {
      recordFailedLogin(rateLimitKey);
      await logAudit({
        actorId: null,
        action: 'LOGIN_FAILED',
        ip,
        metaJson: { identifier, reason: !user ? 'USER_NOT_FOUND' : user.status },
      });
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Ensure status is explicitly ACTIVE if previously unset
    if (!user.status) {
      try {
        await query('UPDATE users SET status = $1 WHERE id = $2', ['ACTIVE', user.id]);
        user.status = 'ACTIVE';
      } catch (e) {}
    }

    // 2. Verify password hash
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      recordFailedLogin(rateLimitKey);
      await logAudit({
        actorId: user.id,
        action: 'LOGIN_FAILED',
        targetType: 'USER',
        targetId: user.id,
        ip,
        metaJson: { identifier, reason: 'BAD_PASSWORD' },
      });
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Password verified: reset failed attempts
    resetFailedLogins(rateLimitKey);

    // 3. Load active, non-expired memberships
    const allMemberships = await query<any>(
      `SELECT id, user_id, role, scope_type, scope_id, status, expires_at
       FROM memberships
       WHERE user_id = $1 AND status = 'ACTIVE'
       ORDER BY created_at ASC`,
      [user.id]
    );

    const now = new Date();
    let activeMemberships: UserMembership[] = allMemberships
      .filter((m) => !m.expires_at || new Date(m.expires_at) >= now)
      .map((m) => ({
        id: m.id,
        userId: m.user_id,
        role: m.role,
        scopeType: m.scope_type,
        scopeId: m.scope_id,
        status: m.status,
        expiresAt: m.expires_at,
      }));

    // Auto-reconciliation: If user exists with valid credentials but lacks membership record, heal automatically
    if (activeMemberships.length === 0) {
      const userRole = user.role || 'EVENT_ORGANIZER';
      const isOrganizer = userRole === 'EVENT_ORGANIZER' || userRole === 'ORGANIZER_OWNER';
      const isCouple = userRole === 'BRIDE_GROOM' || userRole === 'COUPLE';
      const isStreamer = userRole === 'LIVE_STREAMER' || userRole === 'MEDIA_MODERATOR';
      const isScanner = userRole === 'GATE_SCANNER';
      const isAdmin = userRole === 'SYSTEM_ADMIN';

      const memRole = isOrganizer ? 'ORGANIZER_OWNER' : (isCouple ? 'COUPLE' : (isStreamer ? 'MEDIA_MODERATOR' : (isScanner ? 'GATE_SCANNER' : (isAdmin ? 'SYSTEM_ADMIN' : 'ORGANIZER_OWNER'))));
      const scopeType = isAdmin ? 'PLATFORM' : (isOrganizer ? 'ORGANIZER' : 'EVENT');
      let scopeId = isAdmin ? 'global' : (isOrganizer ? `org-${user.id}` : 'event-default');

      try {
        if (isCouple) {
          const evt = await queryOne<any>(
            `SELECT e.id, e.slug 
             FROM events e 
             LEFT JOIN users u ON u.id = e.couple_user_id 
             WHERE e.couple_user_id = $1 OR LOWER(u.email) = LOWER($2) 
             LIMIT 1`,
            [user.id, user.email]
          );
          if (evt) scopeId = evt.slug || evt.id;
        } else if (isOrganizer) {
          const org = await queryOne<any>(
            `SELECT id FROM organizers WHERE owner_user_id = $1 OR id = $2 LIMIT 1`,
            [user.id, `org-${user.id}`]
          );
          if (org) scopeId = org.id;
        }
      } catch (e) {}

      const memId = `mem-${user.id}`;
      try {
        await query(
          `INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
           VALUES ($1, $2, $3, $4, $5, 'ACTIVE')
           ON DUPLICATE KEY UPDATE status = 'ACTIVE', role = $3, scope_id = $5`,
          [memId, user.id, memRole, scopeType, scopeId]
        );
      } catch (e) {}

      activeMemberships = [{
        id: memId,
        userId: user.id,
        role: memRole,
        scopeType,
        scopeId,
        status: 'ACTIVE',
      }];
    }

    if (activeMemberships.length === 0) {
      return NextResponse.json({ error: 'No active access.' }, { status: 403 });
    }

    // 4. Two-Factor Authentication (TOTP) for SYSTEM_ADMIN
    const isAdmin = activeMemberships.some((m) => m.role === 'SYSTEM_ADMIN');
    if (isAdmin) {
      if (user.totp_enabled) {
        if (!totpCode) {
          return NextResponse.json({
            requireTotp: true,
            message: 'Two-factor authentication code required.',
          });
        }

        const isTotpValid = verifyTotpCode(user.totp_secret, totpCode);
        if (!isTotpValid) {
          await logAudit({
            actorId: user.id,
            action: 'TOTP_FAILED',
            targetType: 'USER',
            targetId: user.id,
            ip,
          });
          return NextResponse.json({ error: 'Invalid two-factor authentication code.' }, { status: 401 });
        }
      } else {
        // Admin first-time TOTP setup
        if (totpCode) {
          const isTotpValid = verifyTotpCode(user.totp_secret, totpCode);
          if (!isTotpValid) {
            return NextResponse.json({ error: 'Invalid two-factor authentication code.' }, { status: 401 });
          }
          await query('UPDATE users SET totp_enabled = TRUE WHERE id = $1', [user.id]);
        } else {
          let secret = user.totp_secret;
          if (!secret) {
            secret = generateTotpSecret();
            await query('UPDATE users SET totp_secret = $1 WHERE id = $2', [secret, user.id]);
          }
          const qrUri = generateTotpUri(user.email, secret);
          return NextResponse.json({
            requireTotpSetup: true,
            secret,
            qrUri,
            message: 'Please set up 2FA in your authenticator app and enter the 6-digit code.',
          });
        }
      }
    }

    // 5. Select active membership
    let selectedMembership: UserMembership = activeMemberships[0];

    if (activeMemberships.length > 1) {
      if (requestedMembershipId) {
        const found = activeMemberships.find((m) => m.id === requestedMembershipId);
        if (found) {
          selectedMembership = found;
        } else {
          return NextResponse.json({ error: 'Requested membership not found or inactive.' }, { status: 403 });
        }
      } else {
        return NextResponse.json({
          requireSelectAccess: true,
          memberships: activeMemberships,
          redirectUrl: '/select-access',
        });
      }
    }

    const userRole = (selectedMembership.role === 'ORGANIZER_OWNER' || selectedMembership.role === 'EVENT_ORGANIZER')
      ? 'EVENT_ORGANIZER'
      : selectedMembership.role;

    // If scopeId is unassigned or 'event-default', dynamically resolve associated event for couples and staff
    if (
      !selectedMembership.scopeId ||
      selectedMembership.scopeId === 'event-default' ||
      userRole === 'COUPLE' ||
      userRole === 'BRIDE_GROOM'
    ) {
      try {
        const evt = await queryOne<any>(
          `SELECT e.id, e.slug 
           FROM events e 
           LEFT JOIN users u ON u.id = e.couple_user_id 
           LEFT JOIN event_staff es ON es.event_id = e.id
           WHERE e.couple_user_id = $1 
              OR LOWER(u.email) = LOWER($2) 
              OR es.user_id = $1
           ORDER BY e.created_at DESC 
           LIMIT 1`,
          [user.id, user.email]
        );
        if (evt && (evt.slug || evt.id)) {
          const resolvedSlug = evt.slug || evt.id;
          selectedMembership.scopeId = resolvedSlug;
          try {
            await query('UPDATE memberships SET scope_id = $1 WHERE id = $2', [
              resolvedSlug,
              selectedMembership.id,
            ]);
          } catch (e) {}
        }
      } catch (e) {}
    }

    // 6. Issue signed session token in httpOnly, Secure cookie
    const sessionToken = signSessionToken({
      userId: user.id,
      email: user.email,
      membershipId: selectedMembership.id,
      role: userRole,
      scopeType: selectedMembership.scopeType,
      scopeId: selectedMembership.scopeId,
      tenantId: selectedMembership.scopeId || user.id,
      sessionVersion: user.session_version || 1,
      isViewAs: false,
    });

    const redirectUrl = resolveRoleDashboard(userRole, selectedMembership.scopeId);

    await logAudit({
      actorId: user.id,
      action: 'LOGIN_SUCCESS',
      targetType: 'USER',
      targetId: user.id,
      ip,
      metaJson: {
        role: userRole,
        scopeType: selectedMembership.scopeType,
        scopeId: selectedMembership.scopeId,
        redirectUrl,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name || user.email,
        role: userRole,
        membershipRole: selectedMembership.role,
        scopeId: selectedMembership.scopeId,
        eventSlug: selectedMembership.scopeId && selectedMembership.scopeId !== 'event-default' ? selectedMembership.scopeId : undefined,
        slug: selectedMembership.scopeId && selectedMembership.scopeId !== 'event-default' ? selectedMembership.scopeId : undefined,
        organizerId: selectedMembership.scopeId || user.id,
        tenantId: selectedMembership.scopeId || user.id,
      },
      redirectUrl,
    });

    // Set signed httpOnly cookie
    response.cookies.set('agafari_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 * 7, // 7 days
    });

    response.cookies.set('agafari_token', sessionToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Unified login error:', error);
    return NextResponse.json({ error: 'An unexpected authentication error occurred.' }, { status: 500 });
  }
}
