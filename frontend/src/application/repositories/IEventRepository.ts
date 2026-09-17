import { Event } from '../../domain/entities/Event';

export interface IEventRepository {
  findBySlug(slug: string): Promise<Event | null>;
  findById(id: string): Promise<Event | null>;
  findAll(): Promise<Event[]>;
  findByOrganizerId(organizerId: string): Promise<Event[]>;
  countActiveByOrganizerId(organizerId: string): Promise<number>;
  save(event: Event): Promise<Event>;
  updateTemplate(eventId: string, templateId: string | null, customizationJson: string | null, lockAt: string | null, lockBy: string | null): Promise<Event>;
  delete(id: string): Promise<boolean>;
}
