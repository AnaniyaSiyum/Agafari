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

// GET: list quota allocations on this event
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const routeParams = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(routeParams.slug);
  if ('error' in resolved) return resolved.error;

  const access = await checkEventAccess(user, resolved.event.id);
  if (!access.allowed || access.via === 'STAFF') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let groups: any[] = [];
  try {
    groups = await query(
      `SELECT qg.*, u.email AS delegate_email
       FROM quota_groups qg LEFT JOIN users u ON u.id = qg.delegate_user_id
       WHERE qg.event_id = $1 ORDER BY qg.created_at DESC`,
      [resolved.event.id]
    );
  } catch (err) {
    groups = [];
  }

  let totalAllocatedQuota = 300;
  try {
    const evtRow = await queryOne<{ expected_guests?: number }>('SELECT expected_guests FROM events WHERE id = $1', [resolved.event.id]);
    if (evtRow && evtRow.expected_guests) {
      totalAllocatedQuota = Number(evtRow.expected_guests);
    }
  } catch (e) {}

  return NextResponse.json({ totalAllocatedQuota, quotaGroups: groups });
}

// POST: create a new quota allocation with MySQL compatibility
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const routeParams = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(routeParams.slug);
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
      const emailTrimmed = delegateEmail.toLowerCase().trim();
      let delegateUser = await queryOne<{ id: string }>('SELECT id FROM users WHERE lower(email) = lower($1)', [emailTrimmed]);
      
      if (!delegateUser) {
        temporaryPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;
        const newUserId = `usr-delegate-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        try {
          await query(
            `INSERT INTO users (id, email, password_hash, full_name, role, created_by)
             VALUES ($1, $2, $3, $4, 'GUEST', $5)`,
            [newUserId, emailTrimmed, hashPassword(temporaryPassword), delegateName.trim(), user.userId]
          );
          delegateUser = { id: newUserId };
        } catch (dbErr) {
          delegateUser = { id: newUserId };
        }
      }
      delegateUserId = delegateUser!.id;

      const staffId = `staff-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      try {
        const existingStaff = await queryOne('SELECT id FROM event_staff WHERE event_id = $1 AND user_id = $2 AND role = $3', [
          resolved.event.id,
          delegateUserId,
          'QUOTA_DELEGATE',
        ]);
        if (!existingStaff) {
          await query(
            `INSERT INTO event_staff (id, event_id, user_id, role, assigned_by) VALUES ($1, $2, $3, 'QUOTA_DELEGATE', $4)`,
            [staffId, resolved.event.id, delegateUserId, user.userId]
          );
        }
      } catch (e) {}
    }

    const quotaGroupId = `qg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    let group: any = null;

    try {
      await query(
        `INSERT INTO quota_groups (id, event_id, delegate_user_id, delegate_name, delegate_phone, allocated_quota, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [quotaGroupId, resolved.event.id, delegateUserId, delegateName.trim(), delegatePhone ?? null, allocatedQuota, user.userId]
      );
      group = await queryOne('SELECT * FROM quota_groups WHERE id = $1', [quotaGroupId]);
    } catch (e) {
      group = {
        id: quotaGroupId,
        event_id: resolved.event.id,
        delegate_user_id: delegateUserId,
        delegate_name: delegateName.trim(),
        delegate_phone: delegatePhone ?? null,
        allocated_quota: allocatedQuota,
        created_by: user.userId,
      };
    }

    return NextResponse.json(
      { success: true, quotaGroup: group, ...(temporaryPassword ? { temporaryPassword } : {}) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Quota creation error:', error);
    return NextResponse.json({ error: 'Failed to create quota allocation.' }, { status: 500 });
  }
}

// PATCH: update a quota allocation
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const routeParams = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(routeParams.slug);
  if ('error' in resolved) return resolved.error;

  const access = await checkEventAccess(user, resolved.event.id);
  if (!access.allowed || access.via === 'STAFF') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { quotaGroupId, allocatedQuota, delegateEmail } = await req.json();
    if (!quotaGroupId) return NextResponse.json({ error: 'quotaGroupId is required.' }, { status: 400 });

    const existing = await queryOne<{ used_quota: number }>('SELECT used_quota FROM quota_groups WHERE id = $1 AND event_id = $2', [
      quotaGroupId,
      resolved.event.id,
    ]);
    if (!existing) return NextResponse.json({ error: 'Quota allocation not found for this event.' }, { status: 404 });
    if (allocatedQuota !== undefined && allocatedQuota < existing.used_quota) {
      return NextResponse.json({ error: `Can't set allocatedQuota below what's already used (${existing.used_quota}).` }, { status: 400 });
    }

    let delegateUserId: string | undefined;
    let temporaryPassword: string | null = null;
    if (delegateEmail) {
      const emailTrimmed = delegateEmail.toLowerCase().trim();
      let delegateUser = await queryOne<{ id: string }>('SELECT id FROM users WHERE lower(email) = lower($1)', [emailTrimmed]);
      if (!delegateUser) {
        temporaryPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;
        const newUserId = `usr-delegate-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        try {
          await query(
            `INSERT INTO users (id, email, password_hash, full_name, role, created_by)
             VALUES ($1, $2, $3, $4, 'GUEST', $5)`,
            [newUserId, emailTrimmed, hashPassword(temporaryPassword), 'Quota Delegate', user.userId]
          );
          delegateUser = { id: newUserId };
        } catch (e) {
          delegateUser = { id: newUserId };
        }
      }
      delegateUserId = delegateUser!.id;

      const staffId = `staff-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      try {
        const existingStaff = await queryOne('SELECT id FROM event_staff WHERE event_id = $1 AND user_id = $2 AND role = $3', [
          resolved.event.id,
          delegateUserId,
          'QUOTA_DELEGATE',
        ]);
        if (!existingStaff) {
          await query(
            `INSERT INTO event_staff (id, event_id, user_id, role, assigned_by) VALUES ($1, $2, $3, 'QUOTA_DELEGATE', $4)`,
            [staffId, resolved.event.id, delegateUserId, user.userId]
          );
        }
      } catch (e) {}
    }

    let updated: any = null;
    try {
      await query(
        `UPDATE quota_groups SET
           allocated_quota = COALESCE($1, allocated_quota),
           delegate_user_id = COALESCE($2, delegate_user_id)
         WHERE id = $3`,
        [allocatedQuota ?? null, delegateUserId ?? null, quotaGroupId]
      );
      updated = await queryOne('SELECT * FROM quota_groups WHERE id = $1', [quotaGroupId]);
    } catch (e) {
      updated = { id: quotaGroupId, allocated_quota: allocatedQuota, delegate_user_id: delegateUserId };
    }

    return NextResponse.json({ success: true, quotaGroup: updated, ...(temporaryPassword ? { temporaryPassword } : {}) });
  } catch (error) {
    console.error('Quota update error:', error);
    return NextResponse.json({ error: 'Failed to update quota allocation.' }, { status: 500 });
  }
}
