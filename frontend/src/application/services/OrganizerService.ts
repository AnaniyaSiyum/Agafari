import { IUserRepository } from '../repositories/IUserRepository';
import { IEventRepository } from '../repositories/IEventRepository';
import { OrganizerHasActiveEventsError, NotFoundError } from '../../domain/errors/DomainError';

export class OrganizerService {
  constructor(
    private userRepo: IUserRepository,
    private eventRepo: IEventRepository
  ) {}

  public async deleteOrganizer(organizerUserId: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepo.findById(organizerUserId);
    if (!user) {
      throw new NotFoundError('User/Organizer', organizerUserId);
    }

    const rawOrgId = user.organizerId || organizerUserId.replace(/^usr-/, 'org-');
    
    // Check if organizer manages any active wedding events
    const activeEventsCount = await this.eventRepo.countActiveByOrganizerId(rawOrgId);
    if (activeEventsCount > 0) {
      throw new OrganizerHasActiveEventsError(rawOrgId, activeEventsCount);
    }

    await this.userRepo.deleteOrganizerAccount(organizerUserId);
    return {
      success: true,
      message: `Organizer agency '${user.companyName || user.fullName}' deleted successfully.`,
    };
  }
}
