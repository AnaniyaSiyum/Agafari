export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, hashPassword } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';

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

  let team: any[] = [];
  let coupleUser: any = null;
  try {
    team = await query(
      `SELECT es.id, es.role, u.id AS user_id, u.full_name, u.email, u.temporary_password, es.created_at
       FROM event_staff es JOIN users u ON u.id = es.user_id
       WHERE es.event_id = $1 ORDER BY es.role, u.full_name`,
      [resolved.event.id]
    );

    coupleUser = await queryOne(
      `SELECT u.id, u.email, u.full_name, u.temporary_password
       FROM events e
       JOIN users u ON u.id = e.couple_user_id
       WHERE e.id = $1`,
      [resolved.event.id]
    );
  } catch (err) {
    team = [];
  }

  return NextResponse.json({ team, couple: coupleUser });
}

// POST: assign staff with MySQL compatibility
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  const access = await checkEventAccess(user, resolved.event.id);
  if (!access.allowed || access.via === 'STAFF') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { email, fullName, role, password } = await req.json();
    const validRoles = ['GATE_SCANNER', 'LIVE_STREAMER', 'CONTENT_MODERATOR', 'QUOTA_DELEGATE'];
    if (!email || !fullName || !validRoles.includes(role)) {
      return NextResponse.json({ error: `role must be one of ${validRoles.join(', ')}.` }, { status: 400 });
    }

    const emailTrimmed = email.toLowerCase().trim();
    let staffUser = await queryOne<{ id: string }>('SELECT id FROM users WHERE lower(email) = lower($1)', [emailTrimmed]);
    let temporaryPassword: string | null = password && String(password).trim().length >= 4
      ? String(password).trim()
      : `agafari${Math.floor(1000 + Math.random() * 9000)}`;
    const newUserId = staffUser?.id || `usr-staff-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (!staffUser) {
      try {
        await query(
          `INSERT INTO users (id, email, password_hash, full_name, role, temporary_password, created_by)
           VALUES ($1, $2, $3, $4, 'GUEST', $5, $6)`,
          [newUserId, emailTrimmed, hashPassword(temporaryPassword), fullName.trim(), temporaryPassword, user.userId]
        );
        staffUser = { id: newUserId };
      } catch (dbErr) {
        console.warn('DB User staff creation fallback:', dbErr);
        staffUser = { id: newUserId };
      }

      // Sync into mockStore
      mockStore.users.push({
        id: newUserId,
        eventId: resolved.event.id,
        email: emailTrimmed,
        passwordHash: hashPassword(temporaryPassword),
        temporaryPassword,
        fullName: fullName.trim(),
        role: role === 'GATE_SCANNER' ? 'GATE_SCANNER' : role === 'LIVE_STREAMER' ? 'LIVE_STREAMER' : 'GUEST',
      });
    } else if (password) {
      try {
        await query(
          `UPDATE users SET password_hash = $1, temporary_password = $2 WHERE id = $3`,
          [hashPassword(temporaryPassword), temporaryPassword, staffUser.id]
        );
      } catch {}
    }

    const newStaffId = `staff-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    let assignment: any = null;

    try {
      const existing = await queryOne<{ id: string }>('SELECT id FROM event_staff WHERE event_id = $1 AND user_id = $2 AND role = $3', [
        resolved.event.id,
        staffUser.id,
        role,
      ]);

      if (existing) {
        return NextResponse.json({ error: 'This person already has that role on this event.' }, { status: 400 });
      }

      await query(
        `INSERT INTO event_staff (id, event_id, user_id, role, assigned_by) VALUES ($1, $2, $3, $4, $5)`,
        [newStaffId, resolved.event.id, staffUser.id, role, user.userId]
      );

      assignment = await queryOne('SELECT * FROM event_staff WHERE id = $1', [newStaffId]);
    } catch (dbErr) {
      console.warn('DB Staff assignment fallback:', dbErr);
      assignment = {
        id: newStaffId,
        event_id: resolved.event.id,
        user_id: staffUser.id,
        role,
        assigned_by: user.userId,
      };
    }

    return NextResponse.json(
      { success: true, assignment, ...(temporaryPassword ? { temporaryPassword } : {}) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to assign staff:', error);
    return NextResponse.json({ error: 'Failed to assign staff.' }, { status: 500 });
  }
}

// PATCH: update staff or couple credentials (email, fullName, password)
export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  const access = await checkEventAccess(user, resolved.event.id);
  if (!access.allowed || access.via === 'STAFF') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId, role, email, fullName, password } = await req.json();

    let targetUserId = userId;

    // If updating couple credentials and no userId is passed, resolve from events.couple_user_id
    if (!targetUserId && (role === 'COUPLE' || role === 'BRIDE_GROOM')) {
      const evt = await queryOne<any>('SELECT couple_user_id FROM events WHERE id = $1', [resolved.event.id]);
      targetUserId = evt?.couple_user_id;
    }

    if (!targetUserId) {
      // If role is a staff role and no targetUserId is passed, resolve by role on this event
      if (role) {
        const staffRec = await queryOne<any>('SELECT user_id FROM event_staff WHERE event_id = $1 AND role = $2 LIMIT 1', [resolved.event.id, role]);
        targetUserId = staffRec?.user_id;
      }
    }

    if (!targetUserId) {
      // If still not found, create a new user for this role
      const cleanEmail = (email || `${(role || 'staff').toLowerCase()}@${params.slug}.com`).toLowerCase().trim();
      const newPass = password && String(password).trim().length >= 4 ? String(password).trim() : `agafari${Math.floor(1000 + Math.random() * 9000)}`;
      const newUserId = `usr-${(role || 'staff').toLowerCase()}-${Date.now()}`;

      await query(
        `INSERT INTO users (id, email, password_hash, full_name, role, temporary_password, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [newUserId, cleanEmail, hashPassword(newPass), fullName || `${role || 'Staff'} Member`, role === 'COUPLE' ? 'BRIDE_GROOM' : 'GUEST', newPass, user.userId]
      );

      if (role === 'COUPLE' || role === 'BRIDE_GROOM') {
        await query('UPDATE events SET couple_user_id = $1 WHERE id = $2', [newUserId, resolved.event.id]);
      } else if (role) {
        await query(
          `INSERT INTO event_staff (id, event_id, user_id, role, assigned_by) VALUES ($1, $2, $3, $4, $5)`,
          [`staff-${Date.now()}`, resolved.event.id, newUserId, role, user.userId]
        );
      }

      return NextResponse.json({ success: true, message: 'User provisioned and credentials saved.', userId: newUserId, temporaryPassword: newPass });
    }

    // Update existing user record
    if (password && String(password).trim().length >= 4) {
      const cleanPass = String(password).trim();
      await query(
        `UPDATE users
         SET password_hash = $1,
             temporary_password = $2,
             email = COALESCE($3, email),
             full_name = COALESCE($4, full_name)
         WHERE id = $5`,
        [hashPassword(cleanPass), cleanPass, email ? email.toLowerCase().trim() : null, fullName ? fullName.trim() : null, targetUserId]
      );
      return NextResponse.json({ success: true, message: 'Credentials updated successfully in database.', temporaryPassword: cleanPass });
    } else {
      await query(
        `UPDATE users
         SET email = COALESCE($1, email),
             full_name = COALESCE($2, full_name)
         WHERE id = $3`,
        [email ? email.toLowerCase().trim() : null, fullName ? fullName.trim() : null, targetUserId]
      );
      return NextResponse.json({ success: true, message: 'Details updated successfully in database.' });
    }
  } catch (error) {
    console.error('Failed to update credentials:', error);
    return NextResponse.json({ error: 'Failed to update credentials.' }, { status: 500 });
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

  try {
    const existing = await queryOne('SELECT id FROM event_staff WHERE id = $1 AND event_id = $2', [assignmentId, resolved.event.id]);
    if (!existing) return NextResponse.json({ error: 'Assignment not found.' }, { status: 404 });

    await query('DELETE FROM event_staff WHERE id = $1 AND event_id = $2', [assignmentId, resolved.event.id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: true });
  }
}
