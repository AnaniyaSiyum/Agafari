export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, hashPassword } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';

async function resolveEventOrRespond(slug: string) {
  const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE LOWER(slug) = LOWER($1)', [slug]);
  if (!event) return { error: NextResponse.json({ error: 'Event not found.' }, { status: 404 }) } as const;
  return { event } as const;
}

// GET: list everyone staffing this event
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  const access = await checkEventAccess(user, resolved.event.id);
  if (!access.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const team = await query(
    `SELECT es.id, es.role, u.id AS user_id, u.full_name, u.email, es.created_at
     FROM event_staff es JOIN users u ON u.id = es.user_id
     WHERE es.event_id = $1 ORDER BY es.role, u.full_name`,
    [resolved.event.id]
  );

  return NextResponse.json({ team });
}

// POST: assign staff. If email doesn't exist yet, creates the account and returns
// a one-time temporary password — same "show once, never again" rule as elsewhere.
//
// FIXED BUG: this used to do
//   INSERT INTO users (..., role, ...) VALUES (..., $4, ...)   -- $4 = the staff role
// but `users.role` is `user_role_enum`, which only has SYSTEM_ADMIN, EVENT_ORGANIZER,
// BRIDE_GROOM, LIVE_STREAMER, GATE_SCANNER, GUEST — it does NOT include
// CONTENT_MODERATOR or QUOTA_DELEGATE (those only exist on `staff_role_enum`,
// i.e. on `event_staff.role`, which is a separate column). Assigning either of
// those two roles to a brand-new email crashed with a Postgres invalid-enum-value
// error every time — the content-moderator and quota-delegate dashboards were
// therefore impossible to staff via this route. Fixed by giving new staff
// accounts the generic 'GUEST' global role; the real job lives on `event_staff.role`,
// exactly like a GATE_SCANNER or LIVE_STREAMER's global role is separate from
// what they can actually do (this route just happened to get away with
// reusing the same string for those two by coincidence, since they *are*
// valid enum members on both types).
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  // Only organizer/couple/admin may assign staff — not staff assigning staff.
  const access = await checkEventAccess(user, resolved.event.id);
  if (!access.allowed || access.via === 'STAFF') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { email, fullName, role } = await req.json();
    const validRoles = ['GATE_SCANNER', 'LIVE_STREAMER', 'CONTENT_MODERATOR', 'QUOTA_DELEGATE'];
    if (!email || !fullName || !validRoles.includes(role)) {
      return NextResponse.json({ error: `role must be one of ${validRoles.join(', ')}.` }, { status: 400 });
    }

    let staffUser = await queryOne<{ id: string }>('SELECT id FROM users WHERE lower(email) = lower($1)', [email.trim()]);
    let temporaryPassword: string | null = null;

    if (!staffUser) {
      temporaryPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;
      staffUser = await queryOne(
        `INSERT INTO users (email, password_hash, full_name, role, created_by)
         VALUES ($1,$2,$3,'GUEST',$4) RETURNING id`,
        [email.toLowerCase().trim(), hashPassword(temporaryPassword), fullName.trim(), user.userId]
      );
    }

    const assignment = await queryOne(
      `INSERT INTO event_staff (event_id, user_id, role, assigned_by) VALUES ($1,$2,$3,$4)
       ON CONFLICT (event_id, user_id, role) DO NOTHING RETURNING *`,
      [resolved.event.id, staffUser!.id, role, user.userId]
    );

    if (!assignment) {
      return NextResponse.json({ error: 'This person already has that role on this event.' }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, assignment, ...(temporaryPassword ? { temporaryPassword } : {}) },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to assign staff.' }, { status: 500 });
  }
}

// DELETE: remove a staff assignment (?assignmentId=)
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  const access = await checkEventAccess(user, resolved.event.id);
  if (!access.allowed || access.via === 'STAFF') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const assignmentId = new URL(req.url).searchParams.get('assignmentId');
  if (!assignmentId) return NextResponse.json({ error: 'assignmentId is required.' }, { status: 400 });

  const deleted = await queryOne(
    'DELETE FROM event_staff WHERE id = $1 AND event_id = $2 RETURNING id',
    [assignmentId, resolved.event.id]
  );
  if (!deleted) return NextResponse.json({ error: 'Assignment not found.' }, { status: 404 });

  return NextResponse.json({ success: true });
}
