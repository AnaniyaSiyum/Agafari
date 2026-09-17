export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { query, queryOne } from '@/lib/db';
import { Ticket } from '@/domain/entities/Ticket';
import { CheckInService } from '@/application/services/CheckInService';
import { MySqlEventRepository } from '@/infrastructure/persistence/MySqlEventRepository';
import { MySqlInvitationRepository } from '@/infrastructure/persistence/MySqlInvitationRepository';
import { DomainError } from '@/domain/errors/DomainError';

const SIGNING_SECRET = process.env.TICKET_SIGNING_SECRET || 'fallback-signing-secret-agafari-2026';

const checkInService = new CheckInService(
  new MySqlEventRepository(),
  new MySqlInvitationRepository()
);

async function resolveEventOrRespond(slug: string) {
  const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE slug = $1', [slug]);
  if (!event) return { error: NextResponse.json({ error: 'Event not found.' }, { status: 404 }) } as const;
  return { event } as const;
}

// GET: list invitations for this event or resolve public invitation by code
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(req.url);
  const codeParam = searchParams.get('code');

  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  // Public lookup for guest invitation links & QR passes (no auth token required)
  if (codeParam) {
    const raw = await queryOne<any>(
      `SELECT id, event_id, invite_code, invite_type, guest_name, guest_phone, max_guests, table_number,
              rsvp_status, rsvp_updated_at, rsvp_locked_at, attending_headcount,
              is_scanned, scanned_count, scanned_at, qr_code_url, created_at
       FROM invitations
       WHERE event_id = $1 AND LOWER(invite_code) = LOWER($2)`,
      [resolved.event.id, codeParam.trim()]
    );

    if (!raw) {
      return NextResponse.json({ error: 'Invitation not found for this code.' }, { status: 404 });
    }

    const invitation = {
      id: raw.id,
      eventId: raw.event_id,
      inviteCode: raw.invite_code,
      invite_code: raw.invite_code,
      inviteType: raw.invite_type,
      invite_type: raw.invite_type,
      guestName: raw.guest_name,
      guest_name: raw.guest_name,
      guestPhone: raw.guest_phone || '',
      guest_phone: raw.guest_phone || '',
      maxGuests: Number(raw.max_guests || 1),
      max_guests: Number(raw.max_guests || 1),
      tableNumber: raw.table_number || '',
      rsvpStatus: raw.rsvp_status || 'PENDING',
      rsvp_status: raw.rsvp_status || 'PENDING',
      attendingHeadcount: Number(raw.attending_headcount || 0),
      isScanned: Boolean(raw.is_scanned),
      is_scanned: Boolean(raw.is_scanned),
      scannedCount: Number(raw.scanned_count || 0),
      scannedAt: raw.scanned_at,
      qrCodeUrl: raw.qr_code_url,
      qr_code_url: raw.qr_code_url,
      createdAt: raw.created_at,
    };

    return NextResponse.json({ success: true, invitation });
  }

  // Dashboard lookup: check user auth if present, but proceed to return invitations
  const user = getAuthUser(req);
  if (user) {
    const access = await checkEventAccess(user, resolved.event.id);
    if (!access.allowed && user.role !== 'SYSTEM_ADMIN') {
      return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });
    }
  }

  const rawRows = await query<any>(
    `SELECT id, invite_code, invite_type, guest_name, guest_phone, max_guests, table_number,
            rsvp_status, rsvp_updated_at, rsvp_locked_at, attending_headcount,
            is_scanned, scanned_count, scanned_at, qr_code_url, created_at
     FROM invitations
     WHERE event_id = $1
     ORDER BY created_at DESC`,
    [resolved.event.id]
  );

  const invitations = rawRows.map((raw: any) => ({
    id: raw.id,
    inviteCode: raw.invite_code,
    invite_code: raw.invite_code,
    inviteType: raw.invite_type,
    invite_type: raw.invite_type,
    guestName: raw.guest_name,
    guest_name: raw.guest_name,
    guestPhone: raw.guest_phone || '',
    guest_phone: raw.guest_phone || '',
    maxGuests: Number(raw.max_guests || 1),
    max_guests: Number(raw.max_guests || 1),
    tableNumber: raw.table_number || '',
    rsvpStatus: raw.rsvp_status || 'PENDING',
    rsvp_status: raw.rsvp_status || 'PENDING',
    attendingHeadcount: Number(raw.attending_headcount || 0),
    isScanned: Boolean(raw.is_scanned),
    is_scanned: Boolean(raw.is_scanned),
    scannedCount: Number(raw.scanned_count || 0),
    scannedAt: raw.scanned_at,
    qrCodeUrl: raw.qr_code_url,
    qr_code_url: raw.qr_code_url,
    createdAt: raw.created_at,
  }));

  return NextResponse.json({ invitations });
}

// POST: create one invitation (single guest/family unit).
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  const user = getAuthUser(req);
  if (user) {
    const access = await checkEventAccess(user, resolved.event.id);
    if (!access.allowed && user.role !== 'SYSTEM_ADMIN') {
      return NextResponse.json({ error: 'Forbidden for this event.' }, { status: 403 });
    }
  }

  try {
    const { guestName, guestPhone, maxGuests, tableNumber, inviteType } = await req.json();
    if (!guestName) return NextResponse.json({ error: 'guestName is required.' }, { status: 400 });

    // Use domain Ticket class — single source of truth for QR generation
    const inviteCode = Ticket.generateInviteCode();
    const qrPayload = Ticket.buildQrPayload(resolved.event.id, inviteCode, maxGuests ?? 1, SIGNING_SECRET);
    const qrCodeUrl = `${process.env.PUBLIC_APP_URL ?? ''}/scan?d=${encodeURIComponent(JSON.stringify(qrPayload))}`;
    const inviteId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    await query(
      `INSERT INTO invitations (id, event_id, invite_code, invite_type, guest_name, guest_phone, max_guests, table_number, qr_code_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        inviteId, resolved.event.id, inviteCode, inviteType ?? 'LINK', guestName.trim(),
        guestPhone ?? null, maxGuests ?? 1, tableNumber ?? null, qrCodeUrl,
      ]
    );

    const invitation = await queryOne('SELECT * FROM invitations WHERE id = $1', [inviteId]);

    return NextResponse.json({ success: true, invitation }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create invitation:', error);
    return NextResponse.json({ error: 'Failed to create invitation.' }, { status: 500 });
  }
}

// PATCH: check in a guest by inviteCode (used by GateScanner component).
// Routes through CheckInService — same domain path as the dedicated /api/qr/[code] endpoint.
export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const resolved = await resolveEventOrRespond(params.slug);
  if ('error' in resolved) return resolved.error;

  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const access = await checkEventAccess(user, resolved.event.id, ['GATE_SCANNER']);
  if (!access.allowed) return NextResponse.json({ error: 'Forbidden — not a gate scanner for this event.' }, { status: 403 });

  try {
    const { inviteCode, checkInCount, maxGuests, sig } = await req.json();
    if (!inviteCode) return NextResponse.json({ error: 'inviteCode is required.' }, { status: 400 });

    // If a full QR payload with sig is supplied, route through CheckInService directly
    if (sig && maxGuests !== undefined) {
      const outcome = await checkInService.performCheckIn({
        eventId: resolved.event.id,
        inviteCode: inviteCode.trim(),
        maxGuests: Number(maxGuests),
        sig,
        admitCount: checkInCount ? Number(checkInCount) : undefined,
        staffUserId: user.userId,
        signingSecret: SIGNING_SECRET,
      });
      return NextResponse.json(outcome);
    }

    // Legacy path (no sig): look up the invitation from DB and build signed payload on the fly
    const row = await queryOne<any>(
      `SELECT id, max_guests, scanned_count, is_scanned, guest_name, table_number, invite_code
       FROM invitations WHERE event_id = $1 AND LOWER(invite_code) = LOWER($2)`,
      [resolved.event.id, inviteCode.trim()]
    );
    if (!row) return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 });

    const builtSig = Ticket.signPayload(resolved.event.id, row.invite_code, Number(row.max_guests), SIGNING_SECRET);
    const outcome = await checkInService.performCheckIn({
      eventId: resolved.event.id,
      inviteCode: row.invite_code,
      maxGuests: Number(row.max_guests),
      sig: builtSig,
      admitCount: checkInCount ? Number(checkInCount) : undefined,
      staffUserId: user.userId,
      signingSecret: SIGNING_SECRET,
    });
    return NextResponse.json({ ...outcome, invitation: { guestName: row.guest_name, tableNumber: row.table_number, maxGuests: row.max_guests, scannedCount: outcome.admitted } });
  } catch (error: any) {
    if (error instanceof DomainError) {
      return NextResponse.json(
        { result: error.name.replace('Error','').toUpperCase(), message: error.message, invitation: null },
        { status: error.name === 'AlreadyScannedError' ? 409 : 400 }
      );
    }
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Check-in failed.' }, { status: 500 });
  }
}

