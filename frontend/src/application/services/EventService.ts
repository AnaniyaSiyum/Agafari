import { IEventRepository } from '../repositories/IEventRepository';
import { NotFoundError } from '../../domain/errors/DomainError';

export class EventService {
  constructor(private eventRepo: IEventRepository) {}

  public async getAllEvents() {
    return await this.eventRepo.findAll();
  }

  public async getEventBySlug(slug: string) {
    const event = await this.eventRepo.findBySlug(slug);
    if (!event) {
      throw new NotFoundError('Event', slug);
    }
    return event;
  }

  public async deleteEvent(eventId: string) {
    const deleted = await this.eventRepo.delete(eventId);
    if (!deleted) {
      throw new NotFoundError('Event', eventId);
    }
    return { success: true };
  }
}
