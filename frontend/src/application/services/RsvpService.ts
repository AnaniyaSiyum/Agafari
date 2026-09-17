import { IEventRepository } from '../repositories/IEventRepository';
import { IInvitationRepository } from '../repositories/IInvitationRepository';
import { NotFoundError, RsvpLockedError } from '../../domain/errors/DomainError';

export interface SubmitRsvpInput {
  slug: string;
  inviteCode?: string;
  attendanceStatus: 'ATTENDING' | 'DECLINED' | 'PENDING';
  attendingCount?: number;
  songRecommendation?: string;
  dietaryNotes?: string;
  guestName?: string;
  guestPhone?: string;
}

export class RsvpService {
  constructor(
    private eventRepo: IEventRepository,
    private invitationRepo: IInvitationRepository
  ) {}

  public async submitRsvp(input: SubmitRsvpInput) {
    const event = await this.eventRepo.findBySlug(input.slug);
    if (!event) {
      throw new NotFoundError('Event', input.slug);
    }

    // Single source of truth 48-hour lock check
    if (event.isRsvpLocked()) {
      throw new RsvpLockedError();
    }

    let invitation = null;
    if (input.inviteCode) {
      invitation = await this.invitationRepo.findByInviteCode(event.id, input.inviteCode);
      if (!invitation) {
        throw new NotFoundError('Invitation', input.inviteCode);
      }
      
      const headcount = input.attendingCount ?? 1;
      await this.invitationRepo.updateRsvp(invitation.id, input.attendanceStatus, headcount);
    }

    return {
      success: true,
      eventId: event.id,
      invitationId: invitation?.id || null,
      rsvpStatus: input.attendanceStatus,
    };
  }

  public async lockEligibleRsvps(): Promise<number> {
    const events = await this.eventRepo.findAll();
    let lockedCount = 0;
    
    for (const event of events) {
      if (event.isRsvpLocked()) {
        lockedCount++;
      }
    }
    return lockedCount;
  }
}
