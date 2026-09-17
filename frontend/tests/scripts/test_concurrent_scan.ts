/**
 * Integration test: Concurrent Partial-Arrival QR Check-In
 *
 * Verifies that 3 simultaneous scan requests on a 4-guest pass:
 *   - Exactly admit (up to) 4 total guests
 *   - Do NOT double-admit due to a race condition
 *   - Use FOR UPDATE row locking (tested via the repository layer)
 *
 * Runs against a REAL MySQL database. Set environment variables in .env or inline:
 *   MYSQL_HOST / MYSQL_PORT / MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE
 *   TICKET_SIGNING_SECRET
 *
 * Usage:
 *   npm run test:concurrent-scan
 *   (or: npx tsx tests/scripts/test_concurrent_scan.ts)
 *
 * Note: Run from the project root so .env is found automatically by Next.js env loading.
 */

import { Ticket } from '../../src/domain/entities/Ticket';
import { MySqlEventRepository } from '../../src/infrastructure/persistence/MySqlEventRepository';
import { MySqlInvitationRepository } from '../../src/infrastructure/persistence/MySqlInvitationRepository';
import { CheckInService } from '../../src/application/services/CheckInService';
import { query } from '../../src/lib/db';

const SIGNING_SECRET = process.env.TICKET_SIGNING_SECRET || 'test-secret-concurrent-scan';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function seedTestData(eventId: string, invId: string, inviteCode: string): Promise<void> {
  // Insert a minimal event row
  await query(
    `INSERT INTO events
       (id, slug, title, bride_name, groom_name, event_date, venue_name, status, admin_approval_status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON DUPLICATE KEY UPDATE id = id`,
    [
      eventId,
      `test-slug-${eventId}`,
      'Concurrent Scan Test Event',
      'Bride',
      'Groom',
      new Date(Date.now() + 7 * 24 * 3600_000).toISOString(),
      'Test Venue',
      'LIVE',
      'APPROVED',
    ]
  );

  // Insert a 4-guest invitation with scanned_count = 0
  await query(
    `INSERT INTO invitations
       (id, event_id, invite_code, guest_name, max_guests, scanned_count, is_scanned)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON DUPLICATE KEY UPDATE id = id`,
    [invId, eventId, inviteCode, 'Test Family', 4, 0, false]
  );
}

async function cleanupTestData(eventId: string, invId: string): Promise<void> {
  await query('DELETE FROM invitations WHERE id = $1', [invId]);
  await query('DELETE FROM events WHERE id = $1', [eventId]);
}

// ── main test ─────────────────────────────────────────────────────────────────

async function runConcurrentScanTest(): Promise<void> {
  console.log('=== Concurrent Partial-Arrival Check-In Integration Test ===\n');

  const eventId = makeId('evt-concurrent');
  const invId = makeId('inv-concurrent');
  const inviteCode = Ticket.generateInviteCode();

  const eventRepo = new MySqlEventRepository();
  const invRepo = new MySqlInvitationRepository();
  const checkInService = new CheckInService(eventRepo, invRepo);

  const buildInput = (admitCount: number) => ({
    eventId,
    inviteCode,
    maxGuests: 4,
    sig: Ticket.signPayload(eventId, inviteCode, 4, SIGNING_SECRET),
    admitCount,
    staffUserId: 'staff-test-001',
    signingSecret: SIGNING_SECRET,
  });

  console.log(`  Event ID    : ${eventId}`);
  console.log(`  Invitation  : ${invId} (maxGuests=4, starting scannedCount=0)`);
  console.log(`  Invite Code : ${inviteCode}\n`);

  try {
    await seedTestData(eventId, invId, inviteCode);
    console.log('  ✓ Test data seeded');

    // Fire 3 concurrent scan requests each trying to admit 2 guests
    // (total attempted = 6, but max = 4)
    const scanResults = await Promise.allSettled([
      checkInService.performCheckIn(buildInput(2)),
      checkInService.performCheckIn(buildInput(2)),
      checkInService.performCheckIn(buildInput(2)),
    ]);

    let totalAdmitted = 0;
    let successCount = 0;
    let rejectedCount = 0;

    for (const r of scanResults) {
      if (r.status === 'fulfilled') {
        successCount++;
        totalAdmitted += r.value.admitted;
        console.log(`  SCAN result: admitted=${r.value.admitted}, message="${r.value.message}"`);
      } else {
        rejectedCount++;
        console.log(`  SCAN rejected: ${r.reason?.constructor?.name}: ${r.reason?.message}`);
      }
    }

    console.log(`\n  Succeeded: ${successCount}, Rejected: ${rejectedCount}`);
    console.log(`  Total admitted: ${totalAdmitted} (must be ≤ 4)\n`);

    // Assertions
    let passed = 0;
    let failed = 0;

    function assert(cond: boolean, msg: string) {
      if (cond) { passed++; console.log(`  ✓ ${msg}`); }
      else { failed++; console.error(`  ✗ FAIL: ${msg}`); }
    }

    assert(totalAdmitted <= 4, `Total admitted (${totalAdmitted}) must not exceed maxGuests (4)`);
    assert(totalAdmitted > 0, `At least one scan must succeed`);
    assert(rejectedCount + successCount === 3, `All 3 concurrent requests accounted for`);

    // Final DB check
    const rows = await query<{ scanned_count: number; is_scanned: number }>(
      'SELECT scanned_count, is_scanned FROM invitations WHERE id = $1',
      [invId]
    );
    const dbRow = rows[0];
    assert(
      Number(dbRow?.scanned_count) === totalAdmitted,
      `DB scanned_count (${dbRow?.scanned_count}) equals total admitted (${totalAdmitted})`
    );
    assert(
      Number(dbRow?.scanned_count) <= 4,
      `DB scanned_count does not exceed maxGuests`
    );

    console.log(`\n${'='.repeat(60)}`);
    if (failed === 0) {
      console.log(`✅ ALL ${passed} ASSERTIONS PASSED — Concurrent scan safe`);
    } else {
      console.error(`❌ ${failed} ASSERTIONS FAILED, ${passed} PASSED`);
      process.exitCode = 1;
    }

  } finally {
    await cleanupTestData(eventId, invId);
    console.log('\n  ✓ Test data cleaned up');
    process.exit(process.exitCode ?? 0);
  }
}

runConcurrentScanTest().catch((err) => {
  console.error('Fatal error running concurrent scan test:', err);
  process.exit(1);
});
