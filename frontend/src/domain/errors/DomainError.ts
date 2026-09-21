export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} with ID '${id}' was not found.`);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Forbidden access to this resource.') {
    super(message);
  }
}

export class RsvpLockedError extends DomainError {
  constructor(message: string = 'RSVP changes are closed — this wedding is within 3 days (72 hours) of the event date.') {
    super(message);
  }
}

export class AlreadyScannedError extends DomainError {
  constructor(message: string = 'Pass has already reached its maximum scanned headcount limit.') {
    super(message);
  }
}

export class HeadcountExceededError extends DomainError {
  constructor(maxGuests: number, requested: number) {
    super(`Pass allows max ${maxGuests} guests, but ${requested} requested.`);
  }
}

export class OrganizerHasActiveEventsError extends DomainError {
  constructor(organizerId: string, activeEventCount: number) {
    super(`Cannot delete organizer '${organizerId}' because they manage ${activeEventCount} active wedding event(s). Reassign or delete these events first.`);
  }
}

export class InvalidQrSignatureError extends DomainError {
  constructor() {
    super('QR ticket signature does not match — forged or corrupted pass.');
  }
}

export class EventExpiredError extends DomainError {
  constructor() {
    super('Event has passed or is archived — check-in is closed.');
  }
}
