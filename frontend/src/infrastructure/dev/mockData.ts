import { hashPassword, UserRole } from '../../lib/auth';

export interface MezmurItem {
  id: string;
  title: string;
  artist: string;
  category: 'MEZMUR' | 'TRADITIONAL' | 'DANCE' | 'SLOW';
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string; // ISO String
  startTime?: string; // e.g. 14:00
  secondEventDate?: string; // e.g. Melse / Reception Date
  venueName: string;
  venueAddress: string;
  venueMapUrl?: string;
  dressCode?: string;
  welcomeMessage?: string;
  coverImageUrl?: string;
  backgroundAudioUrl?: string;
  couplePhotoUrl?: string;
  loveStory?: string;
  programs?: any[];
  additionalLocations?: any[];
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  organizerId?: string;
  coupleCredentials?: {
    email: string;
    temporaryPassword?: string;
  };
  credentials?: {
    [key: string]: any;
    couple?: { fullName?: string; email?: string; temporaryPassword?: string; role?: string };
    organizer?: { fullName?: string; email?: string; temporaryPassword?: string; role?: string };
    streamer?: { fullName?: string; email?: string; temporaryPassword?: string; role?: string };
    scanner?: { fullName?: string; email?: string; temporaryPassword?: string; role?: string };
    moderator?: { fullName?: string; email?: string; temporaryPassword?: string; role?: string };
  };
  youtubeStreamUrl?: string;
  youtubeVideoId?: string;
  isLive?: boolean;
  backgroundMusicUrl?: string;
  backgroundMusicTitle?: string;
  mezmurPlaylist?: MezmurItem[];
  thankYouMessage?: string;
  thankYouImageUrl?: string;
}

export interface UserRecord {
  id: string;
  eventId?: string | null;
  email: string;
  passwordHash: string;
  temporaryPassword?: string;
  fullName: string;
  companyName?: string;
  description?: string;
  organizerId?: string;
  role: 'SYSTEM_ADMIN' | 'EVENT_ORGANIZER' | 'BRIDE_GROOM' | 'LIVE_STREAMER' | 'GATE_SCANNER' | 'MODERATOR' | 'GUEST';
}

export interface WishData {
  id: string;
  eventId: string;
  senderName: string;
  message: string;
  mediaType?: 'TEXT' | 'VIDEO';
  videoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface MediaAssetData {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  category?: 'WISHES' | 'BTS' | 'LIVE';
  cdnUrl: string;
  thumbnailUrl?: string;
  caption: string;
  viewsCount?: number;
  likesCount?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface InvitationData {
  id: string;
  eventId: string;
  inviteCode: string;
  inviteType?: 'CARD' | 'LINK';
  rsvpStatus?: 'ATTENDING' | 'DECLINED' | 'PENDING';
  attendingHeadcount?: number;
  guestName: string;
  guestPhone: string;
  maxGuests: number;
  tableNumber?: string;
  scannedCount: number;
  isScanned: boolean;
  scannedAt?: string;
  qrCodeUrl: string;
  createdAt: string;
}

// Global in-memory storage for local runtime persistence
const mockEvents: EventData[] = [];

const mockUsers: UserRecord[] = [
  // THE ONLY SINGLE SYSTEM / PLATFORM ADMIN
  {
    id: 'usr-admin-1',
    eventId: null,
    email: 'admin@agafari.com',
    passwordHash: hashPassword('admin123'),
    temporaryPassword: 'admin123',
    fullName: 'System Platform Admin',
    companyName: 'Agafari Ecosystem Headquarters',
    role: 'SYSTEM_ADMIN',
  },
];

const mockInvitations: InvitationData[] = [];
const mockWishes: WishData[] = [];
const mockMediaAssets: MediaAssetData[] = [];

export const mockStore = {
  events: mockEvents,
  users: mockUsers,
  wishes: mockWishes,
  mediaAssets: mockMediaAssets,
  invitations: mockInvitations,
};
