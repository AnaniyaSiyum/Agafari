/**
 * Composition Root — single place that wires concrete infrastructure
 * classes to application service interfaces.
 *
 * Rules:
 * - This is the ONLY file outside src/infrastructure/ that may import
 *   concrete MySQL repository classes.
 * - All application services are instantiated here once and exported.
 * - Routes import from here, not from the concrete repositories directly.
 */

import { MySqlEventRepository } from '../persistence/MySqlEventRepository';
import { MySqlInvitationRepository } from '../persistence/MySqlInvitationRepository';
import { MySqlWishRepository } from '../persistence/MySqlWishRepository';
import { MySqlMediaRepository } from '../persistence/MySqlMediaRepository';
import { MySqlUserRepository } from '../persistence/MySqlUserRepository';

import { CheckInService } from '../../application/services/CheckInService';
import { RsvpService } from '../../application/services/RsvpService';
import { TemplateService } from '../../application/services/TemplateService';
import { ModerationService } from '../../application/services/ModerationService';
import { OrganizerService } from '../../application/services/OrganizerService';
import { EventService } from '../../application/services/EventService';

// Repositories (one instance each, shared across services)
const eventRepo = new MySqlEventRepository();
const invitationRepo = new MySqlInvitationRepository();
const wishRepo = new MySqlWishRepository();
const mediaRepo = new MySqlMediaRepository();
const userRepo = new MySqlUserRepository();

// Application services (exported for use in route handlers)
export const checkInService = new CheckInService(eventRepo, invitationRepo);
export const rsvpService = new RsvpService(eventRepo, invitationRepo);
export const templateService = new TemplateService(eventRepo);
export const moderationService = new ModerationService(mediaRepo, wishRepo);
export const organizerService = new OrganizerService(userRepo, eventRepo);
export const eventService = new EventService(eventRepo);
