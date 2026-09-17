import { IEventRepository } from '../repositories/IEventRepository';
import { IInvitationRepository } from '../repositories/IInvitationRepository';
import { Ticket } from '../../domain/entities/Ticket';
import {
  NotFoundError,
  InvalidQrSignatureError,
  EventExpiredError,
  AlreadyScannedError,
  HeadcountExceededError,
} from '../../domain/errors/DomainError';

export interface PerformCheckInInput {
  eventId: string;
  inviteCode: string;
  maxGuests: number;
  sig: string;
  admitCount?: number;
  clientScannedAt?: string;
  staffUserId: string;
  signingSecret: string;
}

export class CheckInService {
  constructor(
    private eventRepo: IEventRepository,
    private invitationRepo: IInvitationRepository
  ) {}

  public async performCheckIn(input: PerformCheckInInput) {
    // 1. Signature verification BEFORE database lookup (reject forged codes cheaply)
    const isSigValid = Ticket.verifySignature(
      input.eventId,
      input.inviteCode,
      input.maxGuests,
      input.sig,
      input.signingSecret
    );

    if (!isSigValid) {
      // Async logging outside transaction
      this.invitationRepo.logScanAsync(null, input.staffUserId, 'INVALID', 0, input.clientScannedAt);
      throw new InvalidQrSignatureError();
    }

    // 2. Verify event exists and is not expired/archived (Part C Finding C.1)
    const event = await this.eventRepo.findById(input.eventId);
    if (!event) {
      throw new NotFoundError('Event', input.eventId);
    }
    if (event.isCompletedOrArchived()) {
      throw new EventExpiredError();
    }

    // 3. Find invitation by code
    const invitation = await this.invitationRepo.findByInviteCode(input.eventId, input.inviteCode);
    if (!invitation) {
      throw new NotFoundError('Invitation', input.inviteCode);
    }

    // 4. Domain headcount evaluation (Part B Finding 3.1: Partial Group Arrival)
    const requestedAdmit = input.admitCount && input.admitCount > 0 ? input.admitCount : input.maxGuests;
    
    // Evaluates headcount invariants via domain entity
    invitation.attemptCheckIn(requestedAdmit);

    // 5. Execute atomic DB update (with FOR UPDATE row lock)
    const { admitted } = await this.invitationRepo.atomicCheckIn(
      invitation.id,
      requestedAdmit,
      input.staffUserId
    );

    // 6. Log scan asynchronously OUTSIDE transaction lock (Part B Finding 4.2)
    this.invitationRepo.logScanAsync(
      invitation.id,
      input.staffUserId,
      'VALID',
      admitted,
      input.clientScannedAt
    );

    return {
      result: 'VALID' as const,
      message: `Checked in ${admitted} guest(s).`,
      guestName: invitation.guestName,
      admitted,
      remaining: invitation.maxGuests - (invitation.scannedCount + admitted),
      invitationId: invitation.id,
    };
  }
}
