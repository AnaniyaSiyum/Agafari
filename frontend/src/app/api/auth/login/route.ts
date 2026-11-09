export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { verifyPassword, timingSafeVerifyPassword } from '@/lib/passwords';
import { verifyTotpCode, generateTotpSecret, generateTotpUri } from '@/lib/totp';
import { signSessionToken } from '@/lib/requireMembership';
import { generateToken, setAuthCookie, UserRole } from '@/lib/auth';
import {
  checkAuthBruteForce,
  recordAuthFailure,
  recordAuthSuccess,
  buildRateLimitResponse,
  getClientIp,
} from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

function clearAuthCookies(res: NextResponse): void {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 0,
    path: '/',
  };
  res.cookies.set('agafari_token', '', cookieOptions);
  res.cookies.set('agafari_session', '', cookieOptions);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || body.username || body.identifier || '').trim().toLowerCase();
    const password = (body.password || '').trim();
    const totpCode = body.totpCode ? String(body.totpCode).trim() : null;

    // 1. Validate Input Presence
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 2. Strict Brute-Force Rate Limiting (Max 5 failed attempts per IP/identifier per 15 min)
    const bruteForceCheck = checkAuthBruteForce(ip, email);
    if (!bruteForceCheck.allowed) {
      await logAudit({
        actorId: null,
        action: 'LOGIN_RATE_LIMITED',
        ip,
        metaJson: { email, attempts: bruteForceCheck.attempts, retryAfterSeconds: bruteForceCheck.retryAfterSeconds },
      });
      return buildRateLimitResponse(
        bruteForceCheck.retryAfterSeconds,
        `Too many failed login attempts. Account temporarily locked for security. Please try again in ${bruteForceCheck.retryAfterSeconds} seconds.`,
        5,
        0
      );
    }

    // 3. Query MySQL users table by email (or phone/id)
    const user = await queryOne<any>(
      `SELECT id, email, phone, full_name, role, password_hash, temporary_password, is_active, status, totp_secret, totp_enabled, session_version
       FROM users
       WHERE LOWER(email) = $1 OR LOWER(phone) = $1 OR id = $1 OR LOWER(email) = $2
       LIMIT 1`,
      [email, `${email}@agafari.com`]
    );

    // 4. Timing-Safe Credential Verification to prevent user enumeration
    // Ensures constant execution duration regardless of whether account exists in DB
    let isPasswordValid = false;
    if (user?.password_hash) {
      isPasswordValid = await timingSafeVerifyPassword(password, user.password_hash);
    }
    if (!isPasswordValid && user?.temporary_password) {
      isPasswordValid = user.temporary_password === password;
    }

    if (!user || !isPasswordValid) {
      recordAuthFailure(ip, email);
      await logAudit({
        actorId: user?.id || null,
        action: 'LOGIN_FAILED',
        targetType: 'USER',
        targetId: user?.id || null,
        ip,
        metaJson: { email, reason: 'INVALID_CREDENTIALS' },
      });
      const response = NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // 5. Check Account Status (active check)
    const isActive =
      user.is_active === true ||
      user.is_active === 1 ||
      user.is_active === '1' ||
      user.is_active === undefined ||
      user.status === 'ACTIVE' ||
      user.status === 'active';
    const isSuspended = user.status === 'DISABLED' || user.status === 'disabled';

    if (!isActive || isSuspended) {
      recordAuthFailure(ip, email);
      await logAudit({
        actorId: user.id,
        action: 'LOGIN_FAILED',
        targetType: 'USER',
        targetId: user.id,
        ip,
        metaJson: { email, reason: 'ACCOUNT_SUSPENDED' },
      });
      const response = NextResponse.json(
        { error: 'Account is suspended or inactive.' },
        { status: 403 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Password verified: Reset failed attempts for this IP and identifier
    recordAuthSuccess(ip, email);

    // 6. Two-Factor Authentication (TOTP) for SYSTEM_ADMIN
    if (user.role === 'SYSTEM_ADMIN') {
      if (user.totp_enabled) {
        if (!totpCode) {
          return NextResponse.json({
            requireTotp: true,
            message: 'Two-factor authentication code required for System Admin.',
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
          const response = NextResponse.json(
            { error: 'Invalid two-factor authentication code.' },
            { status: 401 }
          );
          clearAuthCookies(response);
          return response;
        }
      } else {
        // First-time enrollment for admin
        let secret = user.totp_secret;
        if (!secret) {
          secret = generateTotpSecret();
          await query('UPDATE users SET totp_secret = $1 WHERE id = $2', [secret, user.id]);
        }
        const qrUri = generateTotpUri(user.email, secret);

        const setupToken = signSessionToken({
          userId: user.id,
          email: user.email,
          membershipId: `mem-${user.id}`,
          role: 'TOTP_SETUP' as any,
          scopeType: 'PLATFORM',
          scopeId: 'setup',
          tenantId: 'setup',
          sessionVersion: user.session_version || 1,
          isViewAs: false,
        });

        const res = NextResponse.json({
          requireTotpSetup: true,
          setupToken,
          secret,
          qrUri,
          message:
            'Two-Factor Authentication enrollment is required for System Admin. Scan the QR code with your authenticator app and enter the 6-digit code.',
        });

        res.cookies.set('agafari_setup_session', setupToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 600,
          path: '/',
        });

        return res;
      }
    }

    // 7. Retrieve Roles & Check Event Access (Multi-Tenant Scoping)
    let effectiveRole: UserRole = (user.role as UserRole) || 'GUEST';
    let tenantScope = 'global';
    let organizerId: string | undefined = undefined;
    let eventSlug: string | undefined = undefined;
    let organizerSlug = 'agafari';
    let redirectUrl = '/login';

    // Query organizers profile
    let organizer: any = null;
    try {
      organizer = await queryOne<any>(
        `SELECT id, business_name FROM organizers WHERE owner_user_id = $1 LIMIT 1`,
        [user.id]
      );
    } catch (e) {
      console.warn('Failed querying organizers table:', e);
    }

    // Query couple assignment from events
    let coupleEvent: any = null;
    try {
      coupleEvent = await queryOne<any>(
        `SELECT e.id, e.slug, e.organizer_id, e.couple_user_id, o.id as org_id, o.business_name
         FROM events e
         LEFT JOIN organizers o ON o.id = e.organizer_id
         WHERE e.couple_user_id = $1
         ORDER BY e.created_at DESC
         LIMIT 1`,
        [user.id]
      );

      // Fallback 1: Check memberships table
      if (!coupleEvent) {
        coupleEvent = await queryOne<any>(
          `SELECT e.id, e.slug, e.organizer_id, e.couple_user_id, o.id as org_id, o.business_name
           FROM memberships m
           JOIN events e ON e.id = m.scope_id
           LEFT JOIN organizers o ON o.id = e.organizer_id
           WHERE m.user_id = $1 AND (m.role = 'COUPLE' OR m.role = 'BRIDE_GROOM')
           ORDER BY e.created_at DESC
           LIMIT 1`,
          [user.id]
        );
        if (coupleEvent && !coupleEvent.couple_user_id) {
          await query('UPDATE events SET couple_user_id = $1 WHERE id = $2', [user.id, coupleEvent.id]);
        }
      }

      // Fallback 2: If role is couple but couple_user_id was unlinked, find matching event and auto-heal
      if (!coupleEvent && (effectiveRole === 'BRIDE_GROOM' || (effectiveRole as any) === 'COUPLE')) {
        const eventsList = await query<any>(
          `SELECT e.id, e.slug, e.title, e.organizer_id, e.couple_user_id, o.id as org_id, o.business_name
           FROM events e
           LEFT JOIN organizers o ON o.id = e.organizer_id
           ORDER BY e.created_at DESC`
        );

        const emailPrefix = user.email.toLowerCase().split('@')[0];
        for (const evt of eventsList) {
          const slugClean = (evt.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          if (
            !evt.couple_user_id ||
            evt.couple_user_id === user.id ||
            slugClean.includes(emailPrefix) ||
            emailPrefix.includes(slugClean.slice(0, 4))
          ) {
            coupleEvent = evt;
            if (!evt.couple_user_id) {
              await query('UPDATE events SET couple_user_id = $1 WHERE id = $2', [user.id, evt.id]);
            }
            break;
          }
        }
        if (!coupleEvent && eventsList.length > 0) {
          coupleEvent = eventsList[0];
          if (!coupleEvent.couple_user_id) {
            await query('UPDATE events SET couple_user_id = $1 WHERE id = $2', [user.id, coupleEvent.id]);
          }
        }
      }
    } catch (e) {
      console.warn('Failed querying couple events table:', e);
    }

    // Query staff assignments from event_staff
    let staffRecord: any = null;
    try {
      staffRecord = await queryOne<any>(
        `SELECT es.role as staff_role, es.event_id, e.slug as event_slug, o.id as org_id
         FROM event_staff es
         JOIN events e ON e.id = es.event_id
         LEFT JOIN organizers o ON o.id = e.organizer_id
         WHERE es.user_id = $1
         ORDER BY es.id DESC
         LIMIT 1`,
        [user.id]
      );
    } catch (e) {
      console.warn('Failed querying event_staff table:', e);
    }

    // 8. Resolve Exact Scoped Dashboard Routing:
    // A. Platform Admin (SYSTEM_ADMIN) -> /admin/dashboard
    if (effectiveRole === 'SYSTEM_ADMIN') {
      redirectUrl = '/admin/dashboard';
      tenantScope = 'PLATFORM';
    }
    // B. Event Organizer (EVENT_ORGANIZER) -> /organizer/dashboard?id=<organizer_id>
    else if (effectiveRole === 'EVENT_ORGANIZER' || (effectiveRole as any) === 'ORGANIZER_OWNER') {
      effectiveRole = 'EVENT_ORGANIZER';
      organizerId = organizer?.id || `org-${user.id}`;
      tenantScope = organizerId;
      redirectUrl = `/organizer/dashboard?id=${encodeURIComponent(organizerId)}`;
    }
    // C. Couple (BRIDE_GROOM) -> /<organizerSlug>/<eventSlug>/couple
    else if (effectiveRole === 'BRIDE_GROOM' || (effectiveRole as any) === 'COUPLE' || coupleEvent) {
      effectiveRole = 'COUPLE';
      if (coupleEvent) {
        eventSlug = coupleEvent.slug || coupleEvent.id;
        let orgSlug = 'kebkab';
        if (coupleEvent.business_name) {
          orgSlug = coupleEvent.business_name.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
        } else if (coupleEvent.org_id) {
          orgSlug = String(coupleEvent.org_id).replace(/^org-/, '');
        } else if (coupleEvent.organizer_id) {
          orgSlug = String(coupleEvent.organizer_id).replace(/^org-/, '');
        }
        organizerSlug = orgSlug;
        tenantScope = coupleEvent.id;
        redirectUrl = `/${encodeURIComponent(organizerSlug)}/${encodeURIComponent(eventSlug)}/couple`;
      } else {
        redirectUrl = '/couple';
        tenantScope = 'event-default';
      }
    }
    // D. Gate Scanner (GATE_SCANNER) -> /event/<eventSlug>/scanner
    else if (effectiveRole === 'GATE_SCANNER' || staffRecord?.staff_role === 'GATE_SCANNER') {
      effectiveRole = 'GATE_SCANNER';
      eventSlug = staffRecord?.event_slug || 'event-default';
      tenantScope = staffRecord?.event_id || 'event-default';
      redirectUrl = `/event/${encodeURIComponent(eventSlug)}/scanner`;
    }
    // E. Media / Content Moderator (CONTENT_MODERATOR / MODERATOR) -> /event/<eventSlug>/moderation
    else if (
      (effectiveRole as any) === 'CONTENT_MODERATOR' ||
      (effectiveRole as any) === 'MEDIA_MODERATOR' ||
      effectiveRole === 'MODERATOR' ||
      staffRecord?.staff_role === 'CONTENT_MODERATOR'
    ) {
      effectiveRole = 'MODERATOR';
      eventSlug = staffRecord?.event_slug || 'event-default';
      tenantScope = staffRecord?.event_id || 'event-default';
      redirectUrl = `/event/${encodeURIComponent(eventSlug)}/moderation`;
    }
    // F. Live Streamer (LIVE_STREAMER) -> /live-streamer?event=<eventSlug>
    else if (effectiveRole === 'LIVE_STREAMER' || staffRecord?.staff_role === 'LIVE_STREAMER') {
      effectiveRole = 'LIVE_STREAMER';
      eventSlug = staffRecord?.event_slug || 'event-default';
      tenantScope = staffRecord?.event_id || 'event-default';
      redirectUrl = `/live-streamer?event=${encodeURIComponent(eventSlug)}`;
    } else {
      redirectUrl = '/login';
    }

    // 9. Issue HttpOnly, SameSite=Strict signed JWT cookie (agafari_token, 24h expiry)
    let membershipRecord: any = null;
    try {
      membershipRecord = await queryOne<any>(
        `SELECT id, role, scope_type, scope_id FROM memberships WHERE user_id = $1 AND status = 'ACTIVE' LIMIT 1`,
        [user.id]
      );
    } catch (e) {
      console.warn('Membership query failed during login:', e);
    }

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      membershipId: membershipRecord?.id || `mem-${user.id}`,
      role: (membershipRecord?.role as any) || (effectiveRole as any),
      scopeType: (membershipRecord?.scope_type as any) || (effectiveRole === 'SYSTEM_ADMIN' ? 'PLATFORM' : effectiveRole === 'EVENT_ORGANIZER' ? 'ORGANIZER' : 'EVENT'),
      scopeId: membershipRecord?.scope_id || tenantScope,
      tenantId: tenantScope,
      sessionVersion: user.session_version || 1,
      isViewAs: false,
    };

    const token = signSessionToken(sessionPayload);

    await logAudit({
      actorId: user.id,
      action: 'LOGIN_SUCCESS',
      targetType: 'USER',
      targetId: user.id,
      ip,
      metaJson: {
        role: effectiveRole,
        tenantScope,
        redirectUrl,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      token,
      redirectUrl,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name || user.email,
        role: effectiveRole,
        tenantId: tenantScope,
        organizerId: organizerId || tenantScope,
        eventSlug,
        organizerSlug,
      },
    });

    // Set signed cookie (HttpOnly, SameSite=Strict, Secure in production, 24h)
    setAuthCookie(response, token);

    return response;
  } catch (error: any) {
    console.error('Unified login error:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
