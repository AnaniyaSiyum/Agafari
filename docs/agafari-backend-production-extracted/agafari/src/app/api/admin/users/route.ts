export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, hashPassword, sanitizeUser, UserRole } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

// GET: list accounts — never returns password_hash or any plaintext password
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  const users = await query('SELECT id, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC');
  return NextResponse.json({ users });
}

// These are the only values `users.role` (user_role_enum) actually accepts.
// CONTENT_MODERATOR and QUOTA_DELEGATE are per-event staff roles (staff_role_enum,
// i.e. event_staff.role) — they were never valid here, but nothing checked
// that before, so passing one crashed the INSERT with a Postgres invalid-enum
// error instead of a clean 400. See the same fix in api/events/[slug]/team/route.ts,
// which is the correct endpoint for those two roles (it assigns event_staff
// directly, scoped to one event, rather than a global account role).
const GLOBAL_ROLES: UserRole[] = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'BRIDE_GROOM', 'LIVE_STREAMER', 'GATE_SCANNER', 'GUEST'];

// POST: create an account. If role is a per-event staff role (GATE_SCANNER/LIVE_STREAMER),
// also pass eventId to assign them via event_staff in the same call.
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const { email, password, fullName, role, eventId } = await req.json();
    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: 'Email, password, full name, and role are required.' }, { status: 400 });
    }
    if (!GLOBAL_ROLES.includes(role)) {
      return NextResponse.json(
        {
          error: `role must be one of ${GLOBAL_ROLES.join(', ')}. For CONTENT_MODERATOR or QUOTA_DELEGATE, use POST /api/events/[slug]/team instead — those are per-event assignments, not global account roles.`,
        },
        { status: 400 }
      );
    }

    const existing = await queryOne('SELECT id FROM users WHERE lower(email) = lower($1)', [email.trim()]);
    if (existing) {
      return NextResponse.json({ error: `An account with email '${email}' already exists.` }, { status: 400 });
    }

    const newUser = await queryOne(
      `INSERT INTO users (email, password_hash, full_name, role, created_by)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, email, full_name, role`,
      [email.toLowerCase().trim(), hashPassword(password), fullName.trim(), role as UserRole, auth.user.userId]
    );

    if ((role === 'GATE_SCANNER' || role === 'LIVE_STREAMER') && eventId && newUser) {
      await query(
        `INSERT INTO event_staff (event_id, user_id, role, assigned_by) VALUES ($1,$2,$3,$4)
         ON CONFLICT (event_id, user_id, role) DO NOTHING`,
        [eventId, newUser.id, role, auth.user.userId]
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Account created successfully with role '${role}'.`,
        // Returned once, at creation, and never again on subsequent GETs.
        user: { ...newUser, temporaryPassword: password },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user account.' }, { status: 500 });
  }
}

// PATCH: reset password or change role/name
export async function PATCH(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const { userId, newPassword, fullName, role } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    if (role && !GLOBAL_ROLES.includes(role)) {
      return NextResponse.json({ error: `role must be one of ${GLOBAL_ROLES.join(', ')}.` }, { status: 400 });
    }

    const updated = await queryOne(
      `UPDATE users SET
         password_hash = COALESCE($2, password_hash),
         full_name = COALESCE($3, full_name),
         role = COALESCE($4, role)
       WHERE id = $1 RETURNING id, email, full_name, role`,
      [userId, newPassword ? hashPassword(newPassword) : null, fullName?.trim() ?? null, role ?? null]
    );
    if (!updated) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    return NextResponse.json({ success: true, user: sanitizeUser(updated) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user account.' }, { status: 500 });
  }
}

// DELETE: remove an account
export async function DELETE(req: NextRequest) {
  const auth = requireRole(req, ['SYSTEM_ADMIN']);
  if (!auth.ok) return auth.response;

  const userId = new URL(req.url).searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId is required.' }, { status: 400 });

  const deleted = await queryOne('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
  if (!deleted) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  return NextResponse.json({ success: true, message: 'User account deleted successfully.' });
}
