// =============================================================================
// AGAFARI (አጋፋሪ) WEDDING CELEBRATION PLATFORM
// Standard TypeScript Database Schema (Drizzle / Relational PostgreSQL)
// =============================================================================

export interface EventEntity {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string; // ISO Timestamp
  startTime?: string;
  secondEventDate?: string;
  venueName: string;
  venueAddress?: string;
  venueMapUrl?: string;
  dressCode?: string;
  welcomeMessage?: string;
  coverImageUrl?: string;
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  youtubeVideoId?: string;
  isLive: boolean;
  thankYouMessage?: string;
  thankYouImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserEntity {
  id: string;
  eventId?: string | null;
  email: string;
  passwordHash: string;
  temporaryPassword?: string;
  fullName: string;
  role: 'SYSTEM_ADMIN' | 'EVENT_ORGANIZER' | 'BRIDE_GROOM' | 'LIVE_STREAMER' | 'GATE_SCANNER' | 'MODERATOR' | 'GUEST';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationEntity {
  id: string;
  eventId: string;
  inviteCode: string;
  inviteType: 'CARD' | 'LINK';
  guestName: string;
  guestPhone?: string;
  maxGuests: number;
  tableNumber?: string;
  rsvpStatus: 'ATTENDING' | 'MAYBE' | 'DECLINED' | 'PENDING';
  attendingHeadcount: number;
  isScanned: boolean;
  scannedCount: number;
  scannedAt?: string;
  scannedBy?: string;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface RsvpEntity {
  id: string;
  eventId: string;
  invitationId?: string;
  inviteCode?: string;
  guestName: string;
  guestPhone?: string;
  attendanceStatus: 'ATTENDING' | 'MAYBE' | 'DECLINED';
  attendingCount: number;
  songRecommendation?: string;
  dietaryNotes?: string;
  createdAt: string;
}

export interface WishEntity {
  id: string;
  eventId: string;
  senderName: string;
  message: string;
  mediaType: 'IMAGE' | 'VIDEO';
  videoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isFeatured: boolean;
  createdAt: string;
}

export interface MediaAssetEntity {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  category: 'WISHES' | 'BTS' | 'LIVE';
  cdnUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  viewsCount: number;
  likesCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface MediaCommentEntity {
  id: string;
  mediaId: string;
  senderName: string;
  comment: string;
  createdAt: string;
}

export interface MezmurItemEntity {
  id: string;
  eventId: string;
  title: string;
  artist: string;
  category: 'MEZMUR' | 'TRADITIONAL' | 'DANCE' | 'SLOW';
  orderIndex: number;
  createdAt: string;
}
