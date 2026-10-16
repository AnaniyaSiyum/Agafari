import { AuthTokenPayload } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';

export type EventAccess =
  | { allowed: true; via: 'SYSTEM_ADMIN' | 'ORGANIZER_OWNER' | 'COUPLE' | 'STAFF'; staffId?: string }
  | { allowed: false };

/**
 * Checks whether `user` may act on `eventId`, optionally restricted to one or
 * more event_staff roles (e.g. only GATE_SCANNER may hit the scan endpoint).
 * Enforces strict multi-tenant data isolation:
 * - SYSTEM_ADMIN has platform-wide access.
 * - EVENT_ORGANIZER can ONLY access events owned by their specific agency.
 * - BRIDE_GROOM can ONLY access their own assigned wedding.
 * - STAFF (Scanner / Streamer / Moderator) can ONLY access their assigned event.
 */
export async function checkEventAccess(
  user: AuthTokenPayload,
  eventId: string,
  allowedStaffRoles?: Array<'GATE_SCANNER' | 'LIVE_STREAMER' | 'CONTENT_MODERATOR' | 'QUOTA_DELEGATE'>
): Promise<EventAccess> {
  if (user.role === 'SYSTEM_ADMIN') return { allowed: true, via: 'SYSTEM_ADMIN' };

  const cleanUserId = (user.userId || '').replace(/^usr-/, '').replace(/^org-/, '');
  const userTenant = (user.tenantId || '').replace(/^org-/, '');
  const userEmail = (user.email || '').toLowerCase();

  // 1. Database Multi-Tenant Access Verification
  try {
    const event = await queryOne<{ id: string; slug: string; organizer_id: string | null; couple_user_id: string | null }>(
      'SELECT e.id, e.slug, e.organizer_id, e.couple_user_id FROM events e WHERE e.id = $1 OR e.slug = $1',
      [eventId]
    );

    if (event) {
      if (user.role === 'ORGANIZER_OWNER' || (user.role as any) === 'EVENT_ORGANIZER') {
        const owns = await queryOne(
          'SELECT 1 FROM organizers WHERE id = $1 AND owner_user_id = $2',
          [event.organizer_id, user.userId]
        );
        const isOwner = owns || (event.organizer_id && (event.organizer_id === user.tenantId || event.organizer_id === user.userId));
        if (isOwner) {
          return { allowed: true, via: 'ORGANIZER_OWNER' };
        }
        return { allowed: false };
      }

      if (user.role === 'COUPLE' || (user.role as any) === 'BRIDE_GROOM') {
        if (event.couple_user_id === user.userId) {
          return { allowed: true, via: 'COUPLE' };
        }
        const coupleUser = await queryOne<{ email: string }>(
          'SELECT email FROM users WHERE id = $1',
          [event.couple_user_id]
        );
        if (coupleUser && coupleUser.email.toLowerCase() === userEmail) {
          return { allowed: true, via: 'COUPLE' };
        }
        return { allowed: false };
      }
    }
  } catch (e) {
    console.warn('DB checkEventAccess fallback:', e);
  }

  // 2. MockStore Multi-Tenant Access Verification (Runtime Dev Fallback)
  const mockEvt = mockStore.events.find((e: any) => e.id === eventId || e.slug === eventId);
  if (mockEvt) {
    if (user.role === 'ORGANIZER_OWNER' || (user.role as any) === 'EVENT_ORGANIZER') {
      const eOrg = String(mockEvt.organizerId || (mockEvt as any).organizer_id || '');
      const eEmail = (mockEvt.credentials?.organizer?.email || '').toLowerCase();
      if ((eOrg && (eOrg === user.tenantId || eOrg === user.userId)) || (eEmail && eEmail === userEmail)) {
        return { allowed: true, via: 'ORGANIZER_OWNER' };
      }
      return { allowed: false };
    }

    if (user.role === 'COUPLE' || (user.role as any) === 'BRIDE_GROOM') {
      const coupleEmail = (mockEvt.credentials?.couple?.email || mockEvt.coupleCredentials?.email || '').toLowerCase();
      if (coupleEmail === userEmail || mockEvt.id === user.userId || (mockEvt as any).couple_user_id === user.userId) {
        return { allowed: true, via: 'COUPLE' };
      }
      return { allowed: false };
    }

    if (user.role === 'GATE_SCANNER') {
      const scannerEmail = (mockEvt.credentials?.scanner?.email || '').toLowerCase();
      if (scannerEmail === userEmail) {
        return { allowed: true, via: 'STAFF' };
      }
    }

    if (user.role === 'LIVE_STREAMER') {
      const streamerEmail = (mockEvt.credentials?.streamer?.email || '').toLowerCase();
      if (streamerEmail === userEmail) {
        return { allowed: true, via: 'STAFF' };
      }
    }

    if (user.role === 'MODERATOR') {
      const modEmail = (mockEvt.credentials?.moderator?.email || '').toLowerCase();
      if (modEmail === userEmail) {
        return { allowed: true, via: 'STAFF' };
      }
    }
  }

  // 3. Database Event Staff Record Verification
  let staffRow = null;
  try {
    if (allowedStaffRoles && allowedStaffRoles.length > 0) {
      const placeholders = allowedStaffRoles.map((_, i) => `$${i + 3}`).join(',');
      staffRow = await queryOne<{ id: string; role: string }>(
        `SELECT id, role FROM event_staff WHERE (event_id = $1 OR event_id = (SELECT id FROM events WHERE slug = $1)) AND user_id = $2 AND role IN (${placeholders})`,
        [eventId, user.userId, ...allowedStaffRoles]
      );
    } else {
      staffRow = await queryOne<{ id: string; role: string }>(
        `SELECT id, role FROM event_staff WHERE (event_id = $1 OR event_id = (SELECT id FROM events WHERE slug = $1)) AND user_id = $2`,
        [eventId, user.userId]
      );
    }
  } catch (e) {}

  if (staffRow) return { allowed: true, via: 'STAFF', staffId: staffRow.id };

  return { allowed: false };
}

