import { Headcount } from '../value-objects/Headcount';

export interface InvitationProps {
  id: string;
  eventId: string;
  inviteCode: string;
  inviteType?: 'CARD' | 'LINK';
  guestName: string;
  guestPhone?: string | null;
  maxGuests: number;
  tableNumber?: string | null;
  rsvpStatus?: 'ATTENDING' | 'DECLINED' | 'PENDING';
  attendingHeadcount?: number;
  rsvpLockedAt?: string | null;
  isScanned?: boolean;
  scannedCount?: number;
  scannedAt?: string | null;
  qrCodeUrl?: string | null;
}

export class Invitation {
  public props: InvitationProps;

  constructor(props: InvitationProps) {
    this.props = {
      ...props,
      maxGuests: Math.max(1, props.maxGuests || 1),
      scannedCount: Math.max(0, props.scannedCount || 0),
    };
  }

  public get id(): string { return this.props.id; }
  public get eventId(): string { return this.props.eventId; }
  public get inviteCode(): string { return this.props.inviteCode; }
  public get guestName(): string { return this.props.guestName; }
  public get maxGuests(): number { return this.props.maxGuests; }
  public get scannedCount(): number { return this.props.scannedCount || 0; }
  public get isScanned(): boolean { return (this.props.scannedCount || 0) >= this.props.maxGuests; }

  public getHeadcount(): Headcount {
    return new Headcount(this.props.maxGuests, this.props.scannedCount || 0);
  }

  /**
   * Attempts check-in for cumulative partial headcount.
   */
  public attemptCheckIn(requestedAdmit?: number): { newScannedCount: number; admittedCount: number; isFullyScanned: boolean } {
    const headcount = this.getHeadcount();
    const result = headcount.evaluateAdmit(requestedAdmit);
    
    this.props.scannedCount = result.newScannedCount;
    this.props.isScanned = result.newScannedCount >= this.props.maxGuests;
    
    return {
      newScannedCount: result.newScannedCount,
      admittedCount: result.admittedCount,
      isFullyScanned: this.props.isScanned,
    };
  }
}
