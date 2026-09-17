export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { generateInviteCode, buildQrPayload } from '@/lib/ticketSigner';
import { query, queryOne, withTransaction } from '@/lib/db';

async function resolveEventOrRespond(slug: string) {
  const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE slug = $1', [slug]);
  if (!event) return { error: NextResponse.json({ error: 'Event not found.' }, { status: 404 }) } as const;
  return { event } as const;
}

// GET: list invitations for this event — organizer/couple/admin see everything;
// a QUOTA_DELEGATE sees only the guests they've personally entered against
// their own allocation. (Guests use /api/qr/[code] instead, not this route.)
//
// FIXED: this used to call checkEventAccess(user, eventId) with no staff-role
// restriction at all — and an omitted restriction there means *any* staff role
// passes, not none. That let a GATE_SCANNER or LIVE_STREAMER list and create
// guest invitations, which was never the intent (flagged in the Phase 3d
// README rather than silently patched at the time; fixing it now). Restricting
// to ['QUOTA_DELEGATE'] closes that while still letting admin/organizer/couple
// through via their own branches in checkEventAccess, which run regardless of
// the staff-role list.
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  const access = await checkEventAccess(user, resolved.event.id, ['QUOTA_DELEGATE']);
  if (!access.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let quotaGroupId: string | null = null;
  if (access.via === 'STAFF') {
    const myQuota = await queryOne<{ id: string; allocated_quota: number; used_quota: number }>(
      'SELECT id, allocated_quota, used_quota FROM quota_groups WHERE event_id = $1 AND delegate_user_id = $2',
      [resolved.event.id, user.userId]
    );
    if (!myQuota) return NextResponse.json({ error: 'No quota allocation found for you on this event.' }, { status: 403 });
    quotaGroupId = myQuota.id;
  }

  const invitations = await query(
    `SELECT id, invite_code, invite_type, guest_name, guest_phone, max_guests, table_number,
            rsvp_status, rsvp_updated_at, rsvp_locked_at, attending_headcount,
            is_scanned, scanned_count, scanned_at, qr_code_url, quota_group_id, created_at
     FROM invitations
     WHERE event_id = $1 AND ($2::uuid IS NULL OR quota_group_id = $2)
     ORDER BY created_at DESC`,
    [resolved.event.id, quotaGroupId]
  );

  return NextResponse.json({ invitations });
}

// POST: create one invitation (single guest/family unit).
// - admin/organizer/couple: unrestricted, may optionally tag it to a
//   quotaGroupId to count it against a delegate's cap on their behalf.
// - a QUOTA_DELEGATE (staff): can only add against their own allocation, and
//   is capped at allocated_quota — enforced with a row lock so two rapid
//   submissions can't both slip through over the limit.
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  const access = await checkEventAccess(user, resolved.event.id, ['QUOTA_DELEGATE']);
  if (!access.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { guestName, guestPhone, maxGuests, tableNumber, inviteType, quotaGroupId } = await req.json();
    if (!guestName) return NextResponse.json({ error: 'guestName is required.' }, { status: 400 });

    const inviteCode = generateInviteCode();
    const qrPayload = buildQrPayload(resolved.event.id, inviteCode, maxGuests ?? 1);
    const qrCodeUrl = `${process.env.PUBLIC_APP_URL ?? ''}/scan?d=${encodeURIComponent(JSON.stringify(qrPayload))}`;

    const insertInvitation = async (client: import('pg').PoolClient, effectiveQuotaGroupId: string | null) => {
      const row = (
        await client.query(
          `INSERT INTO invitations (event_id, invite_code, invite_type, guest_name, guest_phone, max_guests, table_number, qr_code_url, quota_group_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
          [
            resolved.event.id, inviteCode, inviteType ?? 'LINK', guestName.trim(),
            guestPhone ?? null, maxGuests ?? 1, tableNumber ?? null, qrCodeUrl, effectiveQuotaGroupId,
          ]
        )
      ).rows[0];
      return row;
    };

    if (access.via === 'STAFF') {
      // Quota delegate: must have their own allocation, and must stay under it.
      const invitation = await withTransaction(async (client) => {
        const quota = (
          await client.query(
            'SELECT id, allocated_quota, used_quota FROM quota_groups WHERE event_id = $1 AND delegate_user_id = $2 FOR UPDATE',
            [resolved.event.id, user.userId]
          )
        ).rows[0];
        if (!quota) throw new Error('NO_QUOTA');
        if (quota.used_quota >= quota.allocated_quota) throw new Error('QUOTA_EXHAUSTED');

        const row = await insertInvitation(client, quota.id);
        await client.query('UPDATE quota_groups SET used_quota = used_quota + 1 WHERE id = $1', [quota.id]);
        return row;
      }).catch((err) => {
        if (err.message === 'NO_QUOTA' || err.message === 'QUOTA_EXHAUSTED') throw err;
        throw err;
      });

      return NextResponse.json({ success: true, invitation }, { status: 201 });
    }

    // Admin/organizer/couple path — optionally against a named delegate's quota.
    if (quotaGroupId) {
      const invitation = await withTransaction(async (client) => {
        const quota = (
          await client.query(
            'SELECT id, allocated_quota, used_quota FROM quota_groups WHERE id = $1 AND event_id = $2 FOR UPDATE',
            [quotaGroupId, resolved.event.id]
          )
        ).rows[0];
        if (!quota) throw new Error('QUOTA_NOT_FOUND');
        if (quota.used_quota >= quota.allocated_quota) throw new Error('QUOTA_EXHAUSTED');

        const row = await insertInvitation(client, quota.id);
        await client.query('UPDATE quota_groups SET used_quota = used_quota + 1 WHERE id = $1', [quota.id]);
        return row;
      });
      return NextResponse.json({ success: true, invitation }, { status: 201 });
    }

    const invitation = await withTransaction(async (client) => insertInvitation(client, null));
    return NextResponse.json({ success: true, invitation }, { status: 201 });
  } catch (error: any) {
    if (error?.message === 'NO_QUOTA') {
      return NextResponse.json({ error: 'You have no quota allocation on this event yet.' }, { status: 403 });
    }
    if (error?.message === 'QUOTA_EXHAUSTED') {
      return NextResponse.json({ error: 'Quota fully used — no seats left to allocate.' }, { status: 409 });
    }
    if (error?.message === 'QUOTA_NOT_FOUND') {
      return NextResponse.json({ error: 'quotaGroupId not found for this event.' }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Failed to create invitation.' }, { status: 500 });
  }
}
