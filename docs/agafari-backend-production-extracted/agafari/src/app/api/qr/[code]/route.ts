export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkEventAccess } from '@/lib/eventScope';
import { verifyTicketSignature } from '@/lib/ticketSigner';
import { queryOne, withTransaction } from '@/lib/db';

/**
 * POST body from the scanner app (works for both a live scan and a batch of
 * offline-queued scans being reconciled — call this once per scan either way,
 * the scanner's own queue handles the batching/retry client-side):
 *   { eventId, inviteCode, maxGuests, sig, admitCount, clientScannedAt }
 *
 * `sig` lets the scanner show an instant [VALID]/[INVALID] locally (it only
 * needs TICKET_SIGNING_SECRET-derived math, done client-side against a cached
 * copy at pre-event sync). This endpoint is the server-side source of truth
 * for "already scanned," which the client can't know for certain offline.
 */
export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { eventId, inviteCode, maxGuests, sig, admitCount, clientScannedAt } = await req.json();
    if (!eventId || !inviteCode || maxGuests === undefined || !sig) {
      return NextResponse.json({ error: 'eventId, inviteCode, maxGuests, and sig are required.' }, { status: 400 });
    }

    const access = await checkEventAccess(user, eventId, ['GATE_SCANNER']);
    if (!access.allowed) return NextResponse.json({ error: 'Forbidden — not a gate scanner for this event.' }, { status: 403 });

    if (!verifyTicketSignature(eventId, inviteCode, maxGuests, sig)) {
      await logScan(null, access.staffId, 'INVALID', 0, clientScannedAt);
      return NextResponse.json({ result: 'INVALID', message: 'QR signature does not match — forged or corrupted pass.' });
    }

    const outcome = await withTransaction(async (client) => {
      // Row lock so two gates scanning the same guest at the same instant can't both "win."
      const invitation = (
        await client.query(
          `SELECT id, guest_name, max_guests, is_scanned, scanned_count, scanned_at
           FROM invitations WHERE invite_code = $1 AND event_id = $2 FOR UPDATE`,
          [inviteCode, eventId]
        )
      ).rows[0];

      if (!invitation) return { result: 'INVALID' as const, message: 'No invitation found for this code.' };

      if (invitation.is_scanned) {
        return {
          result: 'ALREADY_SCANNED' as const,
          message: `Already checked in at ${invitation.scanned_at}.`,
          guestName: invitation.guest_name,
        };
      }

      const requestedAdmit = admitCount ?? invitation.max_guests;
      if (requestedAdmit > invitation.max_guests) {
        return {
          result: 'HEADCOUNT_EXCEEDED' as const,
          message: `Pass allows max ${invitation.max_guests}, requested ${requestedAdmit}.`,
          guestName: invitation.guest_name,
          maxGuests: invitation.max_guests,
        };
      }

      await client.query(
        `UPDATE invitations SET is_scanned = TRUE, scanned_count = $1, scanned_at = CURRENT_TIMESTAMP, scanned_by = $2
         WHERE id = $3`,
        [requestedAdmit, user.userId, invitation.id]
      );

      return {
        result: 'VALID' as const,
        message: 'Checked in.',
        guestName: invitation.guest_name,
        admitted: requestedAdmit,
        invitationId: invitation.id as string,
      };
    });

    await logScan(
      'invitationId' in outcome ? outcome.invitationId : null,
      access.staffId,
      outcome.result,
      'admitted' in outcome ? outcome.admitted : 0,
      clientScannedAt
    );

    return NextResponse.json(outcome);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Scan processing failed.' }, { status: 500 });
  }
}

async function logScan(
  invitationId: string | null,
  staffId: string | undefined,
  result: string,
  headcountAdmitted: number,
  clientScannedAt?: string
) {
  if (!invitationId) return; // no matching invitation to attach the log to (INVALID with unknown code)
  await queryOne(
    `INSERT INTO gate_scan_logs (invitation_id, event_staff_id, result, headcount_admitted, client_scanned_at)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [invitationId, staffId ?? null, result, headcountAdmitted, clientScannedAt ?? null]
  );
}
