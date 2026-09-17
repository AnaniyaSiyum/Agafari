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
  venueMapUrl: string;
  dressCode: string;
  welcomeMessage: string;
  coverImageUrl: string;
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  coupleCredentials?: {
    email: string;
    temporaryPassword?: string;
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
  eventId: string | null;
  email: string;
  passwordHash: string;
  temporaryPassword?: string;
  fullName: string;
  role: 'SYSTEM_ADMIN' | 'EVENT_ORGANIZER' | 'BRIDE_GROOM' | 'LIVE_STREAMER' | 'GATE_SCANNER' | 'GUEST';
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
const mockEvents: EventData[] = [
  {
    id: 'evt-adeday-123456',
    slug: 'adeday-and-adisu-mtrnab92',
    title: 'adeday & adisu Wedding',
    brideName: 'adeday',
    groomName: 'adisu',
    eventDate: '2026-09-20T14:00:00.000Z',
    startTime: '14:00',
    venueName: 'Sheraton Addis Luxury Ballroom',
    venueAddress: 'Taitu Street, Addis Ababa, Ethiopia',
    venueMapUrl: 'https://maps.google.com/?q=Sheraton+Addis',
    dressCode: 'Formal Black Tie & Habesha Kemis',
    welcomeMessage: 'We are overjoyed to welcome you to our special day!',
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    status: 'COMING_SOON',
    adminApprovalStatus: 'APPROVED'
  }
];

const mockUsers: UserRecord[] = [
  {
    id: 'usr-admin-1',
    eventId: null,
    email: 'admin@hamelmal.com',
    passwordHash: hashPassword('admin123'),
    temporaryPassword: 'admin123',
    fullName: 'System Super Admin',
    role: 'SYSTEM_ADMIN',
  },
];

const mockWishes: WishData[] = [];

const mockMediaAssets: MediaAssetData[] = [];

const mockInvitations: InvitationData[] = [];

export const mockStore = {
  events: mockEvents,
  users: mockUsers,
  wishes: mockWishes,
  mediaAssets: mockMediaAssets,
  invitations: mockInvitations,
};
