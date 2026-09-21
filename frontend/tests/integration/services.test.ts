/**
 * Integration Test Suite for all 6 Application Services:
 * 1. RsvpService
 * 2. CheckInService
 * 3. TemplateService
 * 4. ModerationService
 * 5. OrganizerService
 * 6. EventService
 *
 * Run: npx tsx tests/integration/services.test.ts
 */

import { Event } from '../../src/domain/entities/Event';
import { Invitation } from '../../src/domain/entities/Invitation';
import { Ticket } from '../../src/domain/entities/Ticket';
import { RsvpService } from '../../src/application/services/RsvpService';
import { CheckInService } from '../../src/application/services/CheckInService';
import { TemplateService } from '../../src/application/services/TemplateService';
import { ModerationService } from '../../src/application/services/ModerationService';
import { OrganizerService } from '../../src/application/services/OrganizerService';
import { EventService } from '../../src/application/services/EventService';
import {
  NotFoundError,
  RsvpLockedError,
  InvalidQrSignatureError,
  OrganizerHasActiveEventsError,
} from '../../src/domain/errors/DomainError';

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

async function assertRejects<E>(fn: () => Promise<unknown>, ErrorClass: new (...a: any[]) => E, label: string): Promise<void> {
  try {
    await fn();
    failed++;
    console.error(`  ✗ FAIL: ${label} — expected async rejection but succeeded`);
  } catch (err) {
    if (err instanceof ErrorClass) {
      passed++;
      console.log(`  ✓ ${label}`);
    } else {
      failed++;
      console.error(`  ✗ FAIL: ${label} — rejected with wrong type: ${(err as any)?.constructor?.name}`);
    }
  }
}

// Memory repositories for fast service integration tests

class MemoryEventRepo {
  public events: Map<string, Event> = new Map();

  async findById(id: string) { return this.events.get(id) || null; }
  async findBySlug(slug: string) {
    for (const e of this.events.values()) {
      if (e.slug === slug) return e;
    }
    return null;
  }
  async findAll() { return Array.from(this.events.values()); }
  async countActiveByOrganizerId(orgId: string) {
    let count = 0;
    for (const e of this.events.values()) {
      if (e.organizerId === orgId && (e.status === 'LIVE' || e.status === 'COMING_SOON')) count++;
    }
    return count;
  }
  async updateTemplate(id: string, templateId: string | null, json: string | null, lockAt: string | null, lockBy: string | null) {
    const e = this.events.get(id);
    if (!e) return null;
    e.props.templateId = templateId;
    e.props.templateCustomizationJson = json;
    e.props.templateLockedAt = lockAt;
    e.props.templateLockedBy = lockBy;
    return e;
  }
  async delete(id: string) { return this.events.delete(id); }
}

class MemoryInvitationRepo {
  public invitations: Map<string, Invitation> = new Map();
  public scanLogs: any[] = [];

  async findByInviteCode(eventId: string, code: string) {
    for (const inv of this.invitations.values()) {
      if (inv.eventId === eventId && inv.inviteCode.toLowerCase() === code.toLowerCase()) return inv;
    }
    return null;
  }
  async updateRsvp(id: string, status: 'ATTENDING' | 'DECLINED' | 'PENDING', headcount: number) {
    const inv = this.invitations.get(id);
    if (inv) {
      inv.props.rsvpStatus = status;
      inv.props.attendingHeadcount = headcount;
    }
  }
  async atomicCheckIn(invitationId: string, admitCount: number, staffId: string) {
    const inv = this.invitations.get(invitationId);
    if (!inv) throw new Error('Not found');
    const admitted = Math.min(admitCount, inv.maxGuests);
    return { admitted };
  }



  logScanAsync(id: string | null, staffId: string, result: string, count: number, at?: string) {
    this.scanLogs.push({ id, staffId, result, count, at });
  }
}

class MemoryMediaRepo {
  public assets: Map<string, any> = new Map();
  public comments: Map<string, any> = new Map();

  async findCommentsScoped(mediaId: string, _orgId?: string) {
    return Array.from(this.comments.values()).filter(c => c.mediaId === mediaId);
  }
  async updateCommentStatusScoped(commentId: string, status: string, _orgId?: string) {
    const c = this.comments.get(commentId);
    if (!c) return false;
    c.status = status;
    return true;
  }
  async updateStatusScoped(id: string, status: string, _orgId?: string) {
    const m = this.assets.get(id);
    if (!m) return false;
    m.status = status;
    return true;
  }
  async deleteScoped(id: string, _orgId?: string) { return this.assets.delete(id); }
}

class MemoryWishRepo {
  public wishes: Map<string, any> = new Map();

  async updateStatusScoped(id: string, status: string, _orgId?: string) {
    const w = this.wishes.get(id);
    if (!w) return false;
    w.status = status;
    return true;
  }
  async deleteScoped(id: string, _orgId?: string) { return this.wishes.delete(id); }
}

class MemoryUserRepo {
  public users: Map<string, any> = new Map();

  async findById(id: string) { return this.users.get(id) || null; }
  async deleteOrganizerAccount(id: string) { return this.users.delete(id); }
}

async function runIntegrationSuite() {
  console.log('=== Integration Suite 1: RsvpService ===');
  const eventRepo = new MemoryEventRepo();
  const inviteRepo = new MemoryInvitationRepo();
  const rsvpService = new RsvpService(eventRepo as any, inviteRepo as any);

  const futureEvt = new Event({
    id: 'e-100', slug: 'sarah-and-john', title: 'Sarah & John',
    brideName: 'Sarah', groomName: 'John', eventDate: '2028-10-10T12:00:00Z',
    venueName: 'Hilton', status: 'COMING_SOON', adminApprovalStatus: 'APPROVED',
  });
  eventRepo.events.set(futureEvt.id, futureEvt);

  const inv1 = new Invitation({
    id: 'inv-1', eventId: 'e-100', inviteCode: 'RSVP123', guestName: 'Alice', maxGuests: 2,
  });
  inviteRepo.invitations.set(inv1.id, inv1);

  const res1 = await rsvpService.submitRsvp({
    slug: 'sarah-and-john', inviteCode: 'RSVP123', attendanceStatus: 'ATTENDING', attendingCount: 2,
  });
  assert(res1.success && res1.invitationId === 'inv-1', 'RsvpService submits valid RSVP');

  await assertRejects(
    () => rsvpService.submitRsvp({ slug: 'non-existent', attendanceStatus: 'ATTENDING' }),
    NotFoundError,
    'RsvpService throws NotFoundError for unknown slug'
  );

  console.log('\n=== Integration Suite 2: CheckInService ===');
  const checkInService = new CheckInService(eventRepo as any, inviteRepo as any);
  const SECRET = 'sec-123';
  const validSig = Ticket.signPayload('e-100', 'RSVP123', 2, SECRET);

  const scanRes = await checkInService.performCheckIn({
    eventId: 'e-100', inviteCode: 'RSVP123', maxGuests: 2, sig: validSig,
    staffUserId: 'staff-1', signingSecret: SECRET,
  });
  assert(scanRes?.result === 'VALID' && scanRes?.admitted === 2, 'CheckInService performs valid check-in');




  await assertRejects(
    () => checkInService.performCheckIn({
      eventId: 'e-100', inviteCode: 'RSVP123', maxGuests: 2, sig: 'BAD_SIG',
      staffUserId: 'staff-1', signingSecret: SECRET,
    }),
    InvalidQrSignatureError,
    'CheckInService rejects invalid signature'
  );

  console.log('\n=== Integration Suite 3: TemplateService ===');
  const templateService = new TemplateService(eventRepo as any);

  const updatedEvt = await templateService.updateTemplate({
    slug: 'sarah-and-john', templateId: 'template-v2', userId: 'org-1', userRole: 'EVENT_ORGANIZER',
  });
  assert(updatedEvt?.props.templateId === 'template-v2', 'TemplateService updates template ID');

  console.log('\n=== Integration Suite 4: ModerationService ===');
  const mediaRepo = new MemoryMediaRepo();
  const wishRepo = new MemoryWishRepo();
  const modService = new ModerationService(mediaRepo as any, wishRepo as any);

  wishRepo.wishes.set('w-1', { id: 'w-1', status: 'PENDING' });
  const modRes = await modService.updateWishStatus('w-1', 'APPROVED');
  assert(modRes.success && wishRepo.wishes.get('w-1').status === 'APPROVED', 'ModerationService approves wish');

  console.log('\n=== Integration Suite 5: OrganizerService ===');
  const userRepo = new MemoryUserRepo();
  const orgService = new OrganizerService(userRepo as any, eventRepo as any);

  userRepo.users.set('usr-org-1', { id: 'usr-org-1', fullName: 'Agency One', organizerId: 'org-1' });
  
  // Has active event e-100
  const activeEvt = new Event({
    id: 'e-active', slug: 'active-evt', title: 'Active', brideName: 'A', groomName: 'B',
    eventDate: '2028-01-01T00:00:00Z', venueName: 'V', status: 'LIVE', adminApprovalStatus: 'APPROVED',
    organizerId: 'org-1',
  });
  eventRepo.events.set(activeEvt.id, activeEvt);

  await assertRejects(
    () => orgService.deleteOrganizer('usr-org-1'),
    OrganizerHasActiveEventsError,
    'OrganizerService blocks deletion when organizer has active events'
  );

  console.log('\n=== Integration Suite 6: EventService ===');
  const eventService = new EventService(eventRepo as any);
  const fetched = await eventService.getEventBySlug('sarah-and-john');
  assert(fetched.slug === 'sarah-and-john', 'EventService fetches event by slug');

  const delRes = await eventService.deleteEvent('e-100');
  assert(delRes.success, 'EventService deletes event');

  console.log(`\n${'='.repeat(60)}`);
  if (failed === 0) {
    console.log(`✅ ALL ${passed} SERVICE INTEGRATION TESTS PASSED`);
  } else {
    console.error(`❌ ${failed} INTEGRATION TESTS FAILED, ${passed} PASSED`);
    process.exit(1);
  }
}

runIntegrationSuite();
