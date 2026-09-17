import { IEventRepository } from '../repositories/IEventRepository';
import { NotFoundError, ForbiddenError } from '../../domain/errors/DomainError';

export interface UpdateTemplateInput {
  slug: string;
  templateId?: string;
  customization?: Record<string, any>;
  lock?: boolean;
  userId: string;
  userRole: string;
}

export class TemplateService {
  constructor(private eventRepo: IEventRepository) {}

  public async updateTemplate(input: UpdateTemplateInput) {
    const event = await this.eventRepo.findBySlug(input.slug);
    if (!event) {
      throw new NotFoundError('Event', input.slug);
    }

    const isOrganizerOrAdmin = input.userRole === 'EVENT_ORGANIZER' || input.userRole === 'SYSTEM_ADMIN';
    
    // Check lock
    if (event.props.templateLockedAt && !isOrganizerOrAdmin) {
      throw new ForbiddenError('The template is locked by your organizer. Contact them to make further changes.');
    }

    // Part B Finding 3.3: Reset or validate customization on template switch
    let customizationJson: string | null = null;
    if (input.templateId && input.templateId !== event.props.templateId) {
      // Template is changing: if customization is provided, use it; otherwise reset to template defaults
      const defaultCustomization = input.customization || {
        primaryColor: '#D4AF37',
        fontFamily: 'Playfair Display',
        headerBannerUrl: null,
      };
      customizationJson = JSON.stringify(defaultCustomization);
    } else if (input.customization) {
      customizationJson = JSON.stringify(input.customization);
    }

    const lockAt = input.lock !== undefined && isOrganizerOrAdmin ? (input.lock ? new Date().toISOString() : null) : null;
    const lockBy = input.lock !== undefined && isOrganizerOrAdmin ? (input.lock ? input.userId : null) : null;

    const updated = await this.eventRepo.updateTemplate(
      event.id,
      input.templateId ?? null,
      customizationJson,
      lockAt,
      lockBy
    );

    return updated;
  }
}
