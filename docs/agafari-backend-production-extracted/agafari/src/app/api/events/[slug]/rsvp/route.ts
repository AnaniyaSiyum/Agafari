export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';

// POST: guest submits or updates their RSVP via invite_code.
// Locked once invitations.rsvp_locked_at is set (by the scheduled job below) —
// this is the actual enforcement point for "can't change your mind within 2 days."
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { inviteCode, attendanceStatus, attendingCount, songRecommendation, dietaryNotes, guestName, guestPhone } =
      await req.json();

    if (!attendanceStatus) {
      return NextResponse.json({ error: 'attendanceStatus is required.' }, { status: 400 });
    }

    const event = await queryOne<{ id: string }>('SELECT id FROM events WHERE slug = $1', [params.slug]);
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    let invitationId: string | null = null;

    if (inviteCode) {
      const invitation = await queryOne<{ id: string; rsvp_locked_at: string | null }>(
        'SELECT id, rsvp_locked_at FROM invitations WHERE invite_code = $1 AND event_id = $2',
        [inviteCode, event.id]
      );
      if (!invitation) {
        return NextResponse.json({ error: 'Invitation not found for this event.' }, { status: 404 });
      }
      if (invitation.rsvp_locked_at) {
        return NextResponse.json(
          { error: 'RSVP changes are closed — this is within 2 days of the wedding.' },
          { status: 409 }
        );
      }

      await query(
        `UPDATE invitations SET rsvp_status = $1, attending_headcount = $2, rsvp_updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [attendanceStatus, attendingCount ?? 1, invitation.id]
      );
      invitationId = invitation.id;
    }

    // Always log the instant RSVP submission itself (audit trail / analytics),
    // and this is also where the singer/zemari recommendation is captured.
    const rsvp = await queryOne(
      `INSERT INTO rsvps (event_id, invitation_id, invite_code, guest_name, guest_phone,
                           attendance_status, attending_count, song_recommendation, dietary_notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        event.id, invitationId, inviteCode ?? null, guestName ?? 'Guest', guestPhone ?? null,
        attendanceStatus, attendingCount ?? 1, songRecommendation ?? null, dietaryNotes ?? null,
      ]
    );

    return NextResponse.json({ success: true, rsvp });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit RSVP.' }, { status: 500 });
  }
}
