import { LockWindow } from '../value-objects/LockWindow';

export interface EventProps {
  id: string;
  slug: string;
  title: string;
  managedBy?: 'ORGANIZER' | 'ADMIN' | 'INDIVIDUAL';
  organizerId?: string | null;
  coupleUserId?: string | null;
  templateId?: string | null;
  templateCustomizationJson?: string | null;
  brideName: string;
  groomName: string;
  eventDate: string;
  venueName: string;
  venueAddress?: string | null;
  dressCode?: string | null;
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  isLive?: boolean;
  templateLockedAt?: string | null;
  templateLockedBy?: string | null;
}

export class Event {
  public readonly props: EventProps;

  constructor(props: EventProps) {
    this.props = props;
  }

  public get id(): string { return this.props.id; }
  public get slug(): string { return this.props.slug; }
  public get title(): string { return this.props.title; }
  public get organizerId(): string | null | undefined { return this.props.organizerId; }
  public get eventDate(): string { return this.props.eventDate; }
  public get status(): string { return this.props.status; }

  public isIndividual(): boolean {
    return !this.props.organizerId || this.props.managedBy === 'ADMIN' || this.props.managedBy === 'INDIVIDUAL';
  }

  public isRsvpLocked(now: Date = new Date()): boolean {
    return LockWindow.isLocked(this.props.eventDate, now);
  }

  public isCompletedOrArchived(): boolean {
    return this.props.status === 'COMPLETED' || this.props.status === 'ARCHIVED';
  }
}
