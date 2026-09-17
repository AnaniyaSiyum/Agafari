import { AuthTokenPayload } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export type EventAccess =
  | { allowed: true; via: 'SYSTEM_ADMIN' | 'ORGANIZER_OWNER' | 'COUPLE' | 'STAFF'; staffId?: string }
  | { allowed: false };

/**
 * Checks whether `user` may act on `eventId`, optionally restricted to one or
 * more event_staff roles (e.g. only GATE_SCANNER may hit the scan endpoint).
 * Centralizing this avoids re-deriving "does this user own/staff this event"
 * with slightly different logic in every route.
 */
export async function checkEventAccess(
  user: AuthTokenPayload,
  eventId: string,
  allowedStaffRoles?: Array<'GATE_SCANNER' | 'LIVE_STREAMER' | 'CONTENT_MODERATOR' | 'QUOTA_DELEGATE'>
): Promise<EventAccess> {
  if (user.role === 'SYSTEM_ADMIN') return { allowed: true, via: 'SYSTEM_ADMIN' };

  const event = await queryOne<{ id: string; organizer_id: string | null; couple_user_id: string | null }>(
    'SELECT e.id, e.organizer_id, e.couple_user_id FROM events e WHERE e.id = $1',
    [eventId]
  );
  if (!event) return { allowed: false };

  if (user.role === 'EVENT_ORGANIZER' && event.organizer_id) {
    const owns = await queryOne(
      'SELECT 1 FROM organizers WHERE id = $1 AND owner_user_id = $2',
      [event.organizer_id, user.userId]
    );
    if (owns) return { allowed: true, via: 'ORGANIZER_OWNER' };
  }

  if (user.role === 'BRIDE_GROOM' && event.couple_user_id === user.userId) {
    return { allowed: true, via: 'COUPLE' };
  }

  let staffRow = null;
  if (allowedStaffRoles && allowedStaffRoles.length > 0) {
    const placeholders = allowedStaffRoles.map((_, i) => `$${i + 3}`).join(',');
    staffRow = await queryOne<{ id: string; role: string }>(
      `SELECT id, role FROM event_staff WHERE event_id = $1 AND user_id = $2 AND role IN (${placeholders})`,
      [eventId, user.userId, ...allowedStaffRoles]
    );
  } else {
    staffRow = await queryOne<{ id: string; role: string }>(
      `SELECT id, role FROM event_staff WHERE event_id = $1 AND user_id = $2`,
      [eventId, user.userId]
    );
  }
  if (staffRow) return { allowed: true, via: 'STAFF', staffId: staffRow.id };

  return { allowed: false };
}

