import { Invitation } from '../../domain/entities/Invitation';

export interface IInvitationRepository {
  findById(id: string): Promise<Invitation | null>;
  findByInviteCode(eventId: string, inviteCode: string): Promise<Invitation | null>;
  findByEventId(eventId: string): Promise<Invitation[]>;
  save(invitation: Invitation): Promise<Invitation>;
  updateRsvp(invitationId: string, status: string, headcount: number): Promise<void>;
  atomicCheckIn(invitationId: string, admitCount: number, staffUserId: string): Promise<{ invitation: Invitation; admitted: number }>;
  logScanAsync(invitationId: string | null, staffId: string | undefined, result: string, headcountAdmitted: number, clientScannedAt?: string): Promise<void>;
}
