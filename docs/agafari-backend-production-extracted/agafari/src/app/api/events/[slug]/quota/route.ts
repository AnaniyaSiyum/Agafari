export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, hashPassword } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';

async function resolveEventOrRespond(slug: string) {
  const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE slug = $1', [slug]);
  if (!event) return { error: NextResponse.json({ error: 'Event not found.' }, { status: 404 }) } as const;
  return { event } as const;
}

// GET: every quota allocation on this event, with usage — the "who gets how
// many seats to fill themselves" view for the organizer/couple/admin.
// Not for delegates themselves: a delegate sees their own remaining quota via
// GET /api/events/[slug]/invitations instead, scoped to just their guests.
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  const access = await checkEventAccess(user, resolved.event.id);
  if (!access.allowed || access.via === 'STAFF') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const groups = await query(
    `SELECT qg.*, u.email AS delegate_email
     FROM quota_groups qg LEFT JOIN users u ON u.id = qg.delegate_user_id
     WHERE qg.event_id = $1 ORDER BY qg.created_at DESC`,
    [resolved.event.id]
  );
  return NextResponse.json({ quotaGroups: groups });
}

// POST: create a new allocation. If delegateEmail is given and no account
// exists yet, creates one (role 'GUEST' globally, QUOTA_DELEGATE only via
// event_staff — same pattern as /api/events/[slug]/team) and returns a
// one-time temporary password. If delegateEmail is omitted, the allocation is
// created unlinked — useful for reserving seats before you know who's
// managing them; link it later with PATCH.
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
    const { delegateName, delegatePhone, delegateEmail, allocatedQuota } = await req.json();
    if (!delegateName?.trim() || !allocatedQuota || allocatedQuota <= 0) {
      return NextResponse.json({ error: 'delegateName and a positive allocatedQuota are required.' }, { status: 400 });
    }

    let delegateUserId: string | null = null;
    let temporaryPassword: string | null = null;

    if (delegateEmail) {
      let delegateUser = await queryOne<{ id: string }>('SELECT id FROM users WHERE lower(email) = lower($1)', [delegateEmail.trim()]);
      if (!delegateUser) {
        temporaryPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;
        delegateUser = await queryOne(
          `INSERT INTO users (email, password_hash, full_name, role, created_by)
           VALUES ($1,$2,$3,'GUEST',$4) RETURNING id`,
          [delegateEmail.toLowerCase().trim(), hashPassword(temporaryPassword), delegateName.trim(), user.userId]
        );
      }
      delegateUserId = delegateUser!.id;
      await query(
        `INSERT INTO event_staff (event_id, user_id, role, assigned_by) VALUES ($1,$2,'QUOTA_DELEGATE',$3)
         ON CONFLICT (event_id, user_id, role) DO NOTHING`,
        [resolved.event.id, delegateUserId, user.userId]
      );
    }

    const group = await queryOne(
      `INSERT INTO quota_groups (event_id, delegate_user_id, delegate_name, delegate_phone, allocated_quota, created_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [resolved.event.id, delegateUserId, delegateName.trim(), delegatePhone ?? null, allocatedQuota, user.userId]
    );

    return NextResponse.json(
      { success: true, quotaGroup: group, ...(temporaryPassword ? { temporaryPassword } : {}) },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create quota allocation.' }, { status: 500 });
  }
}

// PATCH { quotaGroupId, allocatedQuota?, delegateEmail? }
// Raise/lower a cap (can't go below what's already used), or link a
// previously-unlinked allocation to a delegate's account after the fact.
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
    const { quotaGroupId, allocatedQuota, delegateEmail } = await req.json();
    if (!quotaGroupId) return NextResponse.json({ error: 'quotaGroupId is required.' }, { status: 400 });

    const existing = await queryOne<{ used_quota: number }>('SELECT used_quota FROM quota_groups WHERE id = $1 AND event_id = $2', [
      quotaGroupId, resolved.event.id,
    ]);
    if (!existing) return NextResponse.json({ error: 'Quota allocation not found for this event.' }, { status: 404 });
    if (allocatedQuota !== undefined && allocatedQuota < existing.used_quota) {
      return NextResponse.json({ error: `Can't set allocatedQuota below what's already used (${existing.used_quota}).` }, { status: 400 });
    }

    let delegateUserId: string | undefined;
    let temporaryPassword: string | null = null;
    if (delegateEmail) {
      let delegateUser = await queryOne<{ id: string }>('SELECT id FROM users WHERE lower(email) = lower($1)', [delegateEmail.trim()]);
      if (!delegateUser) {
        temporaryPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;
        delegateUser = await queryOne(
          `INSERT INTO users (email, password_hash, full_name, role, created_by)
           VALUES ($1,$2,$3,'GUEST',$4) RETURNING id`,
          [delegateEmail.toLowerCase().trim(), hashPassword(temporaryPassword), 'Quota Delegate', user.userId]
        );
      }
      delegateUserId = delegateUser!.id;
      await query(
        `INSERT INTO event_staff (event_id, user_id, role, assigned_by) VALUES ($1,$2,'QUOTA_DELEGATE',$3)
         ON CONFLICT (event_id, user_id, role) DO NOTHING`,
        [resolved.event.id, delegateUserId, user.userId]
      );
    }

    const updated = await queryOne(
      `UPDATE quota_groups SET
         allocated_quota = COALESCE($1, allocated_quota),
         delegate_user_id = COALESCE($2, delegate_user_id)
       WHERE id = $3 RETURNING *`,
      [allocatedQuota ?? null, delegateUserId ?? null, quotaGroupId]
    );

    return NextResponse.json({ success: true, quotaGroup: updated, ...(temporaryPassword ? { temporaryPassword } : {}) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update quota allocation.' }, { status: 500 });
  }
}
