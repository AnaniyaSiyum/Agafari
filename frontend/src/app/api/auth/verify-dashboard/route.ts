export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  generateToken,
  resolveUserDashboardUrl,
  logAuditAction,
  setAuthCookie,
  verifyPassword,
  ROLE_PERMISSIONS,
  UserRole,
} from '@/lib/auth';
import { timingSafeVerifyPassword } from '@/lib/passwords';
import { queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';
import { findStoredUser } from '@/lib/userStore';
import {
  checkAuthBruteForce,
  recordAuthFailure,
  recordAuthSuccess,
  buildRateLimitResponse,
  getClientIp,
} from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ipAddress = getClientIp(req);

  try {
    const body = await req.json();
    const dashboardType = (body.dashboardType || '').trim().toLowerCase();
    const slug = (body.slug || '').trim().toLowerCase();
    const organizerSlug = (body.organizerSlug || '').trim().toLowerCase();
    const identifier = (body.identifier || body.email || body.username || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    // Strict Brute-Force Rate Limiting (Max 5 attempts / 15 min per IP and identifier)
    const bruteCheck = checkAuthBruteForce(ipAddress, identifier);
    if (!bruteCheck.allowed) {
      await logAuditAction({
        actorId: null,
        targetUserId: null,
        action: 'DASHBOARD_VERIFY_RATE_LIMITED',
        ipAddress,
        details: { attempts: bruteCheck.attempts, retryAfterSeconds: bruteCheck.retryAfterSeconds },
      });
      return buildRateLimitResponse(
        bruteCheck.retryAfterSeconds,
        `Too many failed verification attempts. Please wait ${bruteCheck.retryAfterSeconds} seconds before retrying.`,
        5,
        0
      );
    }

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Credentials (username/email and password) are required.' },
        { status: 400 }
      );
    }

    let userRole: UserRole | null = null;
    let userId = '';
    let userEmail = identifier;
    let userName = '';
    let tenantId: string | undefined = undefined;

    // 1. Validate credentials against Database users table
    try {
      const dbUser = await queryOne<any>(
        `SELECT u.id, u.email, u.full_name, u.role, u.password_hash, u.temporary_password, u.is_active, o.id AS tenant_id, o.business_name
         FROM users u
         LEFT JOIN organizers o ON o.owner_user_id = u.id
         WHERE (
           LOWER(u.email) = $1 
           OR LOWER(u.full_name) = $1
           OR LOWER(u.id) = $1
           OR LOWER(u.id) = LOWER(REPLACE($1, 'org-', ''))
           OR LOWER(o.id) = $1
           OR LOWER(o.id) = LOWER(REPLACE($1, 'org-', ''))
           OR LOWER(o.business_name) = $1
         ) AND u.is_active = TRUE`,
        [identifier]
      );

      const isDbPasswordValid =
        (await timingSafeVerifyPassword(password, dbUser?.password_hash)) ||
        (dbUser?.temporary_password && dbUser.temporary_password === password);

      if (dbUser && isDbPasswordValid) {
          userRole = (dbUser.role as UserRole) || 'EVENT_ORGANIZER';
          userId = dbUser.id;
          userEmail = dbUser.email;
          userName = dbUser.full_name || dbUser.email;
          tenantId = dbUser.tenant_id || `org-${dbUser.id}`;

          // If assigned in event_staff, resolve their event-level role
          try {
            const staffRec = await queryOne<any>(
              `SELECT es.role as staff_role, es.event_id, e.slug as event_slug
               FROM event_staff es
               JOIN events e ON e.id = es.event_id
               WHERE es.user_id = $1
               ORDER BY es.created_at DESC LIMIT 1`,
              [dbUser.id]
            );
            if (staffRec) {
              userRole = staffRec.staff_role as UserRole;
              tenantId = staffRec.event_id;
            }
          } catch (e) {}
        }
    } catch (e) {
      console.warn('DB verify lookup fallback:', e);
    }

    // 2. Validate credentials against persistent user store (persists across server restarts)
    if (!userRole) {
      const storedUser = findStoredUser(identifier);
      if (storedUser) {
        const isPasswordValid =
          (storedUser.passwordHash && verifyPassword(password, storedUser.passwordHash)) ||
          storedUser.temporaryPassword === password;

        if (isPasswordValid) {
          userRole = storedUser.role || 'EVENT_ORGANIZER';
          userId = storedUser.id;
          userEmail = storedUser.email;
          userName = storedUser.fullName || storedUser.email;
          tenantId = storedUser.organizerId || `org-${storedUser.id}`;
        }
      }
    }

    // 2b. Validate against Database event_staff and events
    if (!userRole) {
      try {
        const dbStaff = await queryOne<any>(
          `SELECT u.id, u.email, u.full_name, u.password_hash, u.temporary_password, es.role as staff_role, es.event_id, e.slug as event_slug
           FROM users u
           JOIN event_staff es ON es.user_id = u.id
           JOIN events e ON e.id = es.event_id
           WHERE LOWER(u.email) = $1 OR LOWER(u.id) = $1 LIMIT 1`,
          [identifier]
        );
        if (dbStaff) {
          const isValid =
            (dbStaff.password_hash && verifyPassword(password, dbStaff.password_hash)) ||
            (dbStaff.temporary_password && dbStaff.temporary_password === password);
          if (isValid) {
            userRole = dbStaff.staff_role as UserRole;
            userId = dbStaff.id;
            userEmail = dbStaff.email;
            userName = dbStaff.full_name || dbStaff.email;
            tenantId = dbStaff.event_id;
          }
        }
      } catch (e) {}
    }

    // 3. Validate credentials against mockStore.users
    if (!userRole) {
      const mockUser = mockStore.users.find(
        (u) =>
          (u.email || '').toLowerCase() === identifier ||
          (u.fullName || '').toLowerCase() === identifier ||
          (u.companyName || '').toLowerCase() === identifier ||
          (u.id || '').toLowerCase() === identifier ||
          (u.organizerId || '').toLowerCase() === identifier ||
          `org-${(u.id || '').toLowerCase()}` === identifier ||
          (u.id || '').toLowerCase().replace(/^org-/, '').replace(/^usr-/, '') === identifier.replace(/^org-/, '').replace(/^usr-/, '')
      );

      if (mockUser) {
        const isPasswordValid =
          (mockUser.passwordHash && verifyPassword(password, mockUser.passwordHash)) ||
          mockUser.temporaryPassword === password;

        if (isPasswordValid) {
          userRole = (mockUser.role as UserRole) || 'EVENT_ORGANIZER';
          userId = mockUser.id;
          userEmail = mockUser.email;
          userName = mockUser.fullName || mockUser.email;
          tenantId = mockUser.organizerId || `org-${mockUser.id}`;
        }
      }
    }

    // 3b. Search event-level credentials in mockStore.events (e.g. couple, streamer, scanner)
    if (!userRole) {
      for (const evt of mockStore.events) {
        const creds = evt.credentials;
        if (!creds) continue;

        // A. Couple / Bride & Groom
        if (
          creds.couple &&
          creds.couple.email?.toLowerCase() === identifier &&
          creds.couple.temporaryPassword === password
        ) {
          userRole = 'BRIDE_GROOM';
          userId = `usr-couple-${evt.id}`;
          userEmail = creds.couple.email;
          userName = creds.couple.fullName || 'Bride & Groom';
          tenantId = evt.organizerId || 'event';
          break;
        }

        // B. Event Organizer
        const evtOrg = String(evt.organizerId || (evt as any).organizer_id || '').toLowerCase();
        const matchesOrg =
          (organizerSlug && (evtOrg === organizerSlug || evtOrg.replace(/^org-/, '') === organizerSlug.replace(/^org-/, ''))) ||
          evtOrg === identifier ||
          evtOrg.replace(/^org-/, '') === identifier.replace(/^org-/, '') ||
          (creds.organizer && creds.organizer.email?.toLowerCase() === identifier);

        if (
          creds.organizer &&
          matchesOrg &&
          creds.organizer.temporaryPassword === password
        ) {
          userRole = 'EVENT_ORGANIZER';
          userId = `usr-org-${evt.id}`;
          userEmail = creds.organizer.email;
          userName = creds.organizer.fullName || 'Event Organizer';
          tenantId = evt.organizerId || `org-${evt.id}`;
          break;
        }

        // C. Live Streamer Crew
        if (
          creds.streamer &&
          creds.streamer.email?.toLowerCase() === identifier &&
          creds.streamer.temporaryPassword === password
        ) {
          userRole = 'LIVE_STREAMER';
          userId = `usr-streamer-${evt.id}`;
          userEmail = creds.streamer.email;
          userName = creds.streamer.fullName || 'Live Streamer Crew';
          tenantId = evt.organizerId || 'event';
          break;
        }

        // D. Gate Scanner
        if (
          creds.scanner &&
          creds.scanner.email?.toLowerCase() === identifier &&
          creds.scanner.temporaryPassword === password
        ) {
          userRole = 'GATE_SCANNER';
          userId = `usr-scanner-${evt.id}`;
          userEmail = creds.scanner.email;
          userName = creds.scanner.fullName || 'Gate QR Scanner';
          tenantId = evt.organizerId || 'event';
          break;
        }

        // E. Content Moderator
        if (
          creds.moderator &&
          creds.moderator.email?.toLowerCase() === identifier &&
          creds.moderator.temporaryPassword === password
        ) {
          userRole = 'MODERATOR';
          userId = `usr-moderator-${evt.id}`;
          userEmail = creds.moderator.email;
          userName = creds.moderator.fullName || 'Content Moderator';
          tenantId = evt.organizerId || 'event';
          break;
        }
      }
    }

    // Account Enumeration Defense: Uniform Error Response
    if (!userRole) {
      recordAuthFailure(ipAddress, identifier);
      await logAuditAction({
        actorId: null,
        targetUserId: null,
        action: 'DASHBOARD_VERIFY_FAILED',
        ipAddress,
        details: { identifier, dashboardType, slug },
      });

      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Credentials verified: Reset failed attempts for this identifier & IP
    recordAuthSuccess(ipAddress, identifier);

    // Determine target redirect URL strictly using unified isolated dashboard resolver
    const redirectUrl = await resolveUserDashboardUrl({
      role: userRole,
      userId,
      email: userEmail,
      tenantId,
      slug: slug || undefined,
    });

    const permissions = ROLE_PERMISSIONS[userRole] || [];

    const token = generateToken({
      userId,
      email: userEmail,
      role: userRole,
      tenantId: tenantId || `org-${userId}`,
      permissions,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Dashboard credentials verified and unlocked.',
      dashboardId: `${dashboardType}:${slug || 'default'}`,
      role: userRole,
      redirectUrl,
      token,
      user: {
        id: userId,
        email: userEmail,
        fullName: userName,
        role: userRole,
        tenantId: tenantId || `org-${userId}`,
        organizerId: tenantId || `org-${userId}`,
        permissions,
      },
    });

    // Set HttpOnly session cookie
    setAuthCookie(response, token);

    await logAuditAction({
      actorId: userId,
      targetUserId: userId,
      action: 'DASHBOARD_VERIFY_SUCCESS',
      ipAddress,
      details: { role: userRole, redirectUrl, slug },
    });

    return response;
  } catch (error) {
    console.error('Failed to verify dashboard credentials:', error);
    return NextResponse.json(
      { error: 'Internal server error during dashboard verification.' },
      { status: 500 }
    );
  }
}
