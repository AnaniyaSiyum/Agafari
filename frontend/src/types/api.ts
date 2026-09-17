/**
 * Shared TypeScript types/interfaces that are not owned by a single domain entity.
 * Import from here instead of duplicating across routes and components.
 */

/** API response shape for a gate scan result. */
export interface ScanOutcome {
  result: 'VALID' | 'ALREADY_SCANNED' | 'INVALID' | 'EVENT_EXPIRED' | 'NOT_FOUND';
  message: string;
  guestName?: string;
  admitted?: number;
  remaining?: number;
  invitationId?: string;
}

/** Minimal event summary used in admin and organizer listings. */
export interface EventSummary {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  status: string;
  adminApprovalStatus: string;
  organizerBusinessName?: string | null;
  isIndividual: boolean;
}

/** Invitation row shape returned by the invitations API. */
export interface InvitationSummary {
  id: string;
  inviteCode: string;
  guestName: string;
  guestPhone: string;
  maxGuests: number;
  tableNumber?: string;
  rsvpStatus: 'ATTENDING' | 'DECLINED' | 'PENDING';
  attendingHeadcount: number;
  isScanned: boolean;
  scannedCount: number;
  qrCodeUrl?: string;
}
