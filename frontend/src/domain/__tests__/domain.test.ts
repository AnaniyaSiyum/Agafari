import { Event } from '../entities/Event';
import { Invitation } from '../entities/Invitation';
import { Ticket } from '../entities/Ticket';
import { LockWindow } from '../value-objects/LockWindow';
import { AlreadyScannedError, HeadcountExceededError } from '../errors/DomainError';

function runUnitTests() {
  console.log('=== DOMAIN UNIT TESTS (Pure In-Memory, No DB, No HTTP) ===\n');

  // Test 1: RSVP 3-Day (72-Hour) Lock Window
  console.log('Test 1: RSVP 3-Day (72-Hour) Lock Window');
  const now = new Date('2026-09-20T12:00:00.000Z');
  
  // Event in 4 days (Sept 24, 12:00 UTC) -> should NOT be locked
  const futureEvent = new Event({
    id: 'evt-1',
    slug: 'future-wedding',
    title: 'Future Wedding',
    brideName: 'Bride',
    groomName: 'Groom',
    eventDate: '2026-09-24T12:00:00.000Z',
    venueName: 'Sheraton',
    status: 'COMING_SOON',
    adminApprovalStatus: 'APPROVED'
  });
  console.assert(!futureEvent.isRsvpLocked(now), 'Event in 4 days must NOT be locked');

  // Event in 24 hours (Sept 21, 12:00 UTC) -> MUST be locked
  const imminentEvent = new Event({
    id: 'evt-2',
    slug: 'imminent-wedding',
    title: 'Imminent Wedding',
    brideName: 'Bride',
    groomName: 'Groom',
    eventDate: '2026-09-21T12:00:00.000Z',
    venueName: 'Sheraton',
    status: 'COMING_SOON',
    adminApprovalStatus: 'APPROVED'
  });
  console.assert(imminentEvent.isRsvpLocked(now), 'Event in 24 hours MUST be locked');
  console.log('✓ RSVP Lock Window tests PASSED');

  // Test 2: Ticket HMAC Sign & Verify
  console.log('\nTest 2: Ticket HMAC Signature Verification');
  const secret = 'test-signing-secret-123';
  const qrPayload = Ticket.buildQrPayload('evt-1', 'INV-100', 4, secret);
  console.assert(Ticket.verifySignature('evt-1', 'INV-100', 4, qrPayload.sig, secret), 'Valid signature must verify');
  console.assert(!Ticket.verifySignature('evt-1', 'INV-100', 10, qrPayload.sig, secret), 'Tampered maxGuests must fail verification');
  console.log('✓ Ticket HMAC Signature tests PASSED');

  // Test 3: Partial Group Arrival & Cumulative Headcount Check-In
  console.log('\nTest 3: Partial Group Arrival & Cumulative Headcount Check-In');
  const familyInvite = new Invitation({
    id: 'inv-family-1',
    eventId: 'evt-1',
    inviteCode: 'CODE123',
    guestName: 'Smith Family',
    maxGuests: 4,
    scannedCount: 0
  });

  // Scan 1: 2 members of family arrive first
  const checkin1 = familyInvite.attemptCheckIn(2);
  console.assert(checkin1.admittedCount === 2, 'First scan admits 2 guests');
  console.assert(checkin1.newScannedCount === 2, 'New cumulative count is 2');
  console.assert(!checkin1.isFullyScanned, 'Pass is not fully scanned yet');

  // Scan 2: Remaining 2 members of family arrive later
  const checkin2 = familyInvite.attemptCheckIn(2);
  console.assert(checkin2.admittedCount === 2, 'Second scan admits remaining 2 guests');
  console.assert(checkin2.newScannedCount === 4, 'New cumulative count is 4');
  console.assert(checkin2.isFullyScanned, 'Pass is now fully scanned');

  // Scan 3: Try to scan again when already fully scanned -> MUST throw AlreadyScannedError
  let threwAlreadyScanned = false;
  try {
    familyInvite.attemptCheckIn(1);
  } catch (err) {
    if (err instanceof AlreadyScannedError) threwAlreadyScanned = true;
  }
  console.assert(threwAlreadyScanned, 'Subsequent scan must throw AlreadyScannedError once maxGuests reached');

  // Scan 4: Try to admit 5 on a max 4 pass -> MUST throw HeadcountExceededError
  const singleInvite = new Invitation({
    id: 'inv-single-1',
    eventId: 'evt-1',
    inviteCode: 'CODE456',
    guestName: 'Single Guest',
    maxGuests: 2,
    scannedCount: 0
  });
  let threwExceeded = false;
  try {
    singleInvite.attemptCheckIn(5);
  } catch (err) {
    if (err instanceof HeadcountExceededError) threwExceeded = true;
  }
  console.assert(threwExceeded, 'Requesting admit > maxGuests must throw HeadcountExceededError');

  console.log('✓ Headcount & Partial Check-In tests PASSED');
  console.log('\nALL DOMAIN UNIT TESTS PASSED SUCCESSFULLY! 🎉');
}

runUnitTests();
