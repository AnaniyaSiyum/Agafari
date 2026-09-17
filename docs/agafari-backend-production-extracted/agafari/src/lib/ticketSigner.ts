import { createHmac, randomBytes } from 'crypto';

const TICKET_SECRET = process.env.TICKET_SIGNING_SECRET;
if (!TICKET_SECRET) {
  throw new Error('TICKET_SIGNING_SECRET environment variable is required.');
}

/** A short, URL-safe random code — this is what goes in the invite link and QR. */
export function generateInviteCode(): string {
  return randomBytes(9).toString('base64url'); // 12 chars, ~72 bits of entropy
}

/**
 * Signs (eventId, inviteCode, maxGuests) so the gate scanner app can verify a
 * QR pass is genuine *offline*, without a database round-trip — it only needs
 * this shared secret, not a live connection. The DB is still the source of
 * truth for "already scanned," which requires either connectivity or the
 * scanner's local IndexedDB cache (see README for the offline-sync flow).
 */
export function signTicket(eventId: string, inviteCode: string, maxGuests: number): string {
  const payload = `${eventId}|${inviteCode}|${maxGuests}`;
  return createHmac('sha256', TICKET_SECRET as string).update(payload).digest('base64url');
}

export function verifyTicketSignature(
  eventId: string,
  inviteCode: string,
  maxGuests: number,
  signature: string
): boolean {
  const expected = signTicket(eventId, inviteCode, maxGuests);
  // Constant-time-ish comparison is unnecessary here (signature isn't a secret
  // itself, just tamper-evidence), but length check first avoids a cheap
  // mismatch-length exception path.
  return expected.length === signature.length && expected === signature;
}

/** Encodes what actually goes into the QR image: the scanner decodes this JSON. */
export function buildQrPayload(eventId: string, inviteCode: string, maxGuests: number) {
  return {
    eventId,
    inviteCode,
    maxGuests,
    sig: signTicket(eventId, inviteCode, maxGuests),
  };
}
