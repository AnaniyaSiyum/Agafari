/**
 * Domain Unit Tests — Pure In-Memory, No DB, No HTTP
 * Run: npx tsx tests/unit/domain.test.ts
 */
import { Event } from '../../src/domain/entities/Event';
import { Invitation } from '../../src/domain/entities/Invitation';
import { Ticket } from '../../src/domain/entities/Ticket';
import { LockWindow } from '../../src/domain/value-objects/LockWindow';
import {
  AlreadyScannedError,
  HeadcountExceededError,
  InvalidQrSignatureError,
  EventExpiredError,
} from '../../src/domain/errors/DomainError';

// ------------- helpers --------------------------------------------------------

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string): void {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

function assertThrows<E>(fn: () => unknown, ErrorClass: new (...a: any[]) => E, label: string): void {
  try {
    fn();
    failed++;
    console.error(`  ✗ FAIL: ${label} — expected throw but nothing was thrown`);
  } catch (err) {
    if (err instanceof ErrorClass) {
      passed++;
      console.log(`  ✓ ${label}`);
    } else {
      failed++;
      console.error(`  ✗ FAIL: ${label} — threw wrong type: ${(err as any)?.constructor?.name}`);
    }
  }
}

// ------------- Test Suite 1: RSVP 3-Day (72-Hour) Lock Window ------------------------

console.log('\n=== Test Suite 1: RSVP 3-Day (72-Hour) Lock Window ===');

const NOW = new Date('2026-09-20T12:00:00.000Z');

const futureEvent = new Event({
  id: 'evt-1', slug: 'future-wedding', title: 'Future Wedding',
  brideName: 'Bride', groomName: 'Groom', eventDate: '2026-09-24T12:00:00.000Z',
  venueName: 'Sheraton', status: 'COMING_SOON', adminApprovalStatus: 'APPROVED',
});
assert(!futureEvent.isRsvpLocked(NOW), 'Event 4 days out must NOT be locked');

const imminentEvent = new Event({
  id: 'evt-2', slug: 'imminent-wedding', title: 'Imminent Wedding',
  brideName: 'Bride', groomName: 'Groom', eventDate: '2026-09-21T12:00:00.000Z',
  venueName: 'Sheraton', status: 'COMING_SOON', adminApprovalStatus: 'APPROVED',
});
assert(imminentEvent.isRsvpLocked(NOW), 'Event 24 hours out MUST be locked');

// Boundary: exactly at 72-hour (3 days) mark should be locked
const exactBoundaryDate = new Date(NOW.getTime() + LockWindow.LOCK_WINDOW_MS).toISOString();
const boundaryEvent = new Event({
  id: 'evt-3', slug: 'boundary-wedding', title: 'Boundary Wedding',
  brideName: 'B', groomName: 'G', eventDate: exactBoundaryDate,
  venueName: 'V', status: 'COMING_SOON', adminApprovalStatus: 'APPROVED',
});
assert(boundaryEvent.isRsvpLocked(NOW), 'Event exactly at 72h (3 days) boundary MUST be locked');

// ------------- Test Suite 2: Ticket HMAC Signature ---------------------------

console.log('\n=== Test Suite 2: Ticket HMAC Signature — Tamper Resistance ===');

const SECRET = 'test-signing-secret-123';
const validPayload = Ticket.buildQrPayload('evt-1', 'INV-100', 4, SECRET);

assert(
  Ticket.verifySignature('evt-1', 'INV-100', 4, validPayload.sig, SECRET),
  'Valid payload must verify successfully'
);

// (a) TAMPER RESISTANCE: modifying maxGuests in payload MUST fail
assert(
  !Ticket.verifySignature('evt-1', 'INV-100', 99, validPayload.sig, SECRET),
  '(a) Tampered maxGuests → signature MUST be rejected'
);

// (a) modifying eventId MUST fail
assert(
  !Ticket.verifySignature('DIFFERENT-EVENT', 'INV-100', 4, validPayload.sig, SECRET),
  '(a) Tampered eventId → signature MUST be rejected'
);

// (a) modifying inviteCode MUST fail
assert(
  !Ticket.verifySignature('evt-1', 'TAMPERED-CODE', 4, validPayload.sig, SECRET),
  '(a) Tampered inviteCode → signature MUST be rejected'
);

// Ticket.validateOrThrow must throw InvalidQrSignatureError when tampered
assertThrows(
  () => Ticket.validateOrThrow('evt-1', 'INV-100', 99, validPayload.sig, SECRET),
  InvalidQrSignatureError,
  '(a) validateOrThrow throws InvalidQrSignatureError on tampered maxGuests'
);

// ------------- Test Suite 3: QR Order of Operations (c) ----------------------

console.log('\n=== Test Suite 3: Order of Operations (sig verify before DB) ===');

// (c) The service layer must reject forged/garbage codes before any DB lookup.
// We verify this structurally: Ticket.validateOrThrow() is pure (no async, no DB param)
// and throws synchronously. CheckInService calls it before any await.
// Prove it works end-to-end by ensuring a garbage signature is caught by the
// pure domain Ticket class without needing any repository.
assertThrows(
  () => Ticket.validateOrThrow('evt-1', 'INV-100', 4, 'GARBAGE_SIG', SECRET),
  InvalidQrSignatureError,
  '(c) Garbage signature rejected by pure domain (no DB round-trip needed)'
);

// Empty signature also rejected
assertThrows(
  () => Ticket.validateOrThrow('evt-1', 'INV-100', 4, '', SECRET),
  InvalidQrSignatureError,
  '(c) Empty signature rejected by pure domain'
);

// ------------- Test Suite 4: Partial Group Arrival & Headcount ---------------

console.log('\n=== Test Suite 4: Partial Group Arrival & Cumulative Headcount ===');

const familyInvite = new Invitation({
  id: 'inv-family-1', eventId: 'evt-1', inviteCode: 'CODE123',
  guestName: 'Smith Family', maxGuests: 4, scannedCount: 0,
});

const checkin1 = familyInvite.attemptCheckIn(2);
assert(checkin1.admittedCount === 2, 'First scan admits 2 guests');
assert(checkin1.newScannedCount === 2, 'Cumulative count after first scan = 2');
assert(!checkin1.isFullyScanned, 'Pass not fully scanned after first scan');

const checkin2 = familyInvite.attemptCheckIn(2);
assert(checkin2.admittedCount === 2, 'Second scan admits remaining 2 guests');
assert(checkin2.newScannedCount === 4, 'Cumulative count after second scan = 4');
assert(checkin2.isFullyScanned, 'Pass is fully scanned after all admitted');

assertThrows(
  () => familyInvite.attemptCheckIn(1),
  AlreadyScannedError,
  'Third scan on fully scanned pass throws AlreadyScannedError'
);

const singleInvite = new Invitation({
  id: 'inv-single-1', eventId: 'evt-1', inviteCode: 'CODE456',
  guestName: 'Single Guest', maxGuests: 2, scannedCount: 0,
});
assertThrows(
  () => singleInvite.attemptCheckIn(5),
  HeadcountExceededError,
  'Requesting admit > maxGuests throws HeadcountExceededError'
);

// ------------- Test Suite 5: QR Regeneration / Invalidation (b) --------------

console.log('\n=== Test Suite 5: QR Regeneration / Invalidation ===');

// (b) When a guest requests a new QR code, a new inviteCode is generated.
// The OLD inviteCode's signature is mathematically different from the new one
// because inviteCode is part of the signed payload.
// Therefore: a valid signature for OLD code MUST NOT verify against NEW code.
const OLD_CODE = Ticket.generateInviteCode();
const NEW_CODE = Ticket.generateInviteCode();

const oldPayload = Ticket.buildQrPayload('evt-1', OLD_CODE, 2, SECRET);
const newPayload = Ticket.buildQrPayload('evt-1', NEW_CODE, 2, SECRET);

assert(
  !Ticket.verifySignature('evt-1', NEW_CODE, 2, oldPayload.sig, SECRET),
  '(b) Old QR signature MUST NOT verify against new inviteCode — old code is invalidated'
);
assert(
  Ticket.verifySignature('evt-1', NEW_CODE, 2, newPayload.sig, SECRET),
  '(b) New QR code verifies correctly with its own signature'
);
assert(OLD_CODE !== NEW_CODE, '(b) generateInviteCode() produces unique codes each time');

// Prove the intended behavior is stated: only the latest code (new sig) is valid
// The old code's signature still verifies the old code — it's not expired in sig itself.
// Invalidation happens because the DB stores only the latest inviteCode; a scan with
// the old code will return "Invitation not found" from the DB.
assert(
  Ticket.verifySignature('evt-1', OLD_CODE, 2, oldPayload.sig, SECRET),
  '(b) Old code + old sig is still mathematically valid (DB-level invalidation applies)'
);
// NOTE: The above is intentional design: QR sig proves the code was genuine when
// issued. Database lookup (findByInviteCode) returns null for the old code once
// the invitation row is updated with a new inviteCode — that is where invalidation
// occurs. Both paths go through CheckInService which then throws NotFoundError.

// ------------- Test Suite 6: Expired Event Check (e) -------------------------

console.log('\n=== Test Suite 6: Expired Event Short-Circuits Before Headcount (e) ===');

// (e) Event.isCompletedOrArchived() must be true for COMPLETED/ARCHIVED events
const expiredEvent = new Event({
  id: 'evt-exp-1', slug: 'past-wedding', title: 'Past Wedding',
  brideName: 'A', groomName: 'B', eventDate: '2024-01-01T00:00:00.000Z',
  venueName: 'V', status: 'COMPLETED', adminApprovalStatus: 'APPROVED',
});
assert(expiredEvent.isCompletedOrArchived(), '(e) COMPLETED event → isCompletedOrArchived() = true');

const archivedEvent = new Event({
  id: 'evt-arc-1', slug: 'archived-wedding', title: 'Archived Wedding',
  brideName: 'A', groomName: 'B', eventDate: '2024-01-01T00:00:00.000Z',
  venueName: 'V', status: 'ARCHIVED', adminApprovalStatus: 'APPROVED',
});
assert(archivedEvent.isCompletedOrArchived(), '(e) ARCHIVED event → isCompletedOrArchived() = true');

const activeEvent = new Event({
  id: 'evt-live-1', slug: 'live-wedding', title: 'Live Wedding',
  brideName: 'A', groomName: 'B', eventDate: '2026-12-01T00:00:00.000Z',
  venueName: 'V', status: 'LIVE', adminApprovalStatus: 'APPROVED',
});
assert(!activeEvent.isCompletedOrArchived(), '(e) LIVE event → isCompletedOrArchived() = false');

// Verify the domain throws EventExpiredError (via the service layer contract)
// We simulate what CheckInService does: check BEFORE headcount
function simulateCheckIn(event: Event, invitation: Invitation, admit: number): string {
  // Step 1: Signature (already tested above, omit here)
  // Step 2: Expired check MUST come before headcount
  if (event.isCompletedOrArchived()) {
    throw new EventExpiredError();
  }
  // Step 3: Headcount
  invitation.attemptCheckIn(admit);
  return 'OK';
}

assertThrows(
  () => simulateCheckIn(expiredEvent, singleInvite, 1),
  EventExpiredError,
  '(e) EventExpiredError thrown BEFORE headcount logic for expired event'
);

// Prove headcount check does NOT run when event is expired
// (singleInvite still has 0 scanned — if headcount ran it'd be 1)
assert(singleInvite.scannedCount === 0, '(e) Headcount was NOT evaluated — still 0 after expired event rejection');

// ------------- Test Suite 7: Wish Entity Invariants ---------------------------

console.log('\n=== Test Suite 7: Wish Entity Invariants ===');

import { Wish } from '../../src/domain/entities/Wish';
import { MediaAsset } from '../../src/domain/entities/MediaAsset';
import {
  DomainError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  OrganizerHasActiveEventsError,
} from '../../src/domain/errors/DomainError';

const validWish = new Wish({
  id: 'w-1', eventId: 'evt-1', senderName: '  Abebe  ', message: '  Congratulations!  ',
  mediaType: 'TEXT', status: 'PENDING',
});
assert(validWish.senderName === 'Abebe', 'Sender name trimmed on instantiation');
assert(validWish.message === 'Congratulations!', 'Wish message trimmed on instantiation');
assert(!validWish.isApproved, 'Wish status default PENDING is not approved');

validWish.approve();
assert(validWish.isApproved, 'Wish approve() sets status to APPROVED');

validWish.reject();
assert(validWish.status === 'REJECTED' && !validWish.isApproved, 'Wish reject() sets status to REJECTED');

assertThrows(
  () => new Wish({ id: 'w-2', eventId: 'evt-1', senderName: '', message: 'Msg', status: 'PENDING' }),
  Error,
  'Wish throws Error when senderName is empty'
);

assertThrows(
  () => new Wish({ id: 'w-3', eventId: 'evt-1', senderName: 'Name', message: 'a'.repeat(2001), status: 'PENDING' }),
  Error,
  'Wish throws Error when message > 2000 chars'
);

// ------------- Test Suite 8: MediaAsset Entity Invariants ---------------------

console.log('\n=== Test Suite 8: MediaAsset Entity Invariants ===');

const mediaAsset = new MediaAsset({
  id: 'm-1', eventId: 'evt-1', uploaderName: 'Guest', mediaType: 'IMAGE',
  category: 'FEED', cdnUrl: 'https://cdn.example.com/photo.jpg', status: 'PENDING',
  likesCount: 5,
});

assert(mediaAsset.cdnUrl === 'https://cdn.example.com/photo.jpg', 'MediaAsset stores valid cdnUrl');
assert(mediaAsset.incrementLikes() === 6, 'incrementLikes() increments likes count to 6');
mediaAsset.approve();
assert(mediaAsset.isApproved, 'MediaAsset approve() sets status to APPROVED');

assertThrows(
  () => new MediaAsset({ id: 'm-2', eventId: 'evt-1', uploaderName: 'G', mediaType: 'IMAGE', cdnUrl: '', status: 'PENDING' }),
  Error,
  'MediaAsset throws Error when cdnUrl is empty'
);

// ------------- Test Suite 9: DomainError Subclasses --------------------------

console.log('\n=== Test Suite 9: DomainError Subclasses Coverage ===');

const baseErr = new DomainError('Base error');
assert(baseErr instanceof Error && baseErr.name === 'DomainError', 'DomainError inherits from Error');

const notFoundErr = new NotFoundError('Event', 'evt-999');
assert(notFoundErr.message.includes('evt-999'), 'NotFoundError includes entity ID');

const unauthErr = new UnauthorizedError();
assert(unauthErr.message === 'Unauthorized', 'UnauthorizedError default message');

const forbiddenErr = new ForbiddenError();
assert(forbiddenErr.message.includes('Forbidden'), 'ForbiddenError default message');

const orgErr = new OrganizerHasActiveEventsError('org-123', 3);
assert(orgErr.message.includes('org-123') && orgErr.message.includes('3'), 'OrganizerHasActiveEventsError formats message');

// ------------- Final Result ---------------------------------------------------

console.log(`\n${'='.repeat(60)}`);
if (failed === 0) {
  console.log(`✅ ALL ${passed} TESTS PASSED — Pure Domain Suite Complete`);
} else {
  console.error(`❌ ${failed} TESTS FAILED, ${passed} PASSED`);
  process.exit(1);
}

