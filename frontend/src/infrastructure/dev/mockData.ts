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
const mockEvents: EventData[] = [
  {
    id: 'evt-adeday-123456',
    slug: 'adeday-and-adisu-mtrnab92',
    title: 'Adeday & Adisu Wedding',
    brideName: 'Adeday',
    groomName: 'Adisu',
    eventDate: '2026-09-20T14:00:00.000Z',
    startTime: '14:00',
    venueName: 'Sheraton Addis Luxury Ballroom',
    venueAddress: 'Taitu Street, Addis Ababa, Ethiopia',
    venueMapUrl: 'https://maps.google.com/?q=Sheraton+Addis',
    dressCode: 'Formal Black Tie & Habesha Kemis',
    welcomeMessage: 'We are overjoyed to welcome you to our special day!',
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    status: 'COMING_SOON',
    adminApprovalStatus: 'APPROVED',
    organizerId: 'org-usr-org-1',
    credentials: {
      couple: { fullName: 'Adeday & Adisu', email: 'couple@agafari.com', temporaryPassword: 'agafari2026', role: 'BRIDE_GROOM' },
      organizer: { fullName: 'Agafari Luxury Event Production', email: 'organizer@agafari.com', temporaryPassword: 'org123', role: 'EVENT_ORGANIZER' },
      streamer: { fullName: 'Live Streamer Crew', email: 'streamer@agafari.com', temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
      scanner: { fullName: 'Gate QR Security Scanner', email: 'scanner@agafari.com', temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
      moderator: { fullName: 'Content Moderator', email: 'moderator@agafari.com', temporaryPassword: 'mod123', role: 'MODERATOR' }
    }
  },
  {
    id: 'evt-matrimony-789012',
    slug: 'sara-and-dawit-matrimony-2026',
    title: 'Sara & Dawit Holy Matrimony',
    brideName: 'Sara',
    groomName: 'Dawit',
    eventDate: '2026-10-18T14:00:00.000Z',
    startTime: '14:00',
    venueName: 'Skylight Hotel Grand Palace Ballroom',
    venueAddress: 'Bole Airport Road, Addis Ababa, Ethiopia',
    venueMapUrl: 'https://maps.google.com/?q=Ethiopian+Skylight+Hotel',
    dressCode: 'Royal Habesha Cultural Attire',
    welcomeMessage: 'Welcome to our sacred union and joyful matrimony celebration!',
    coverImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200',
    status: 'COMING_SOON',
    adminApprovalStatus: 'APPROVED',
    organizerId: 'org-matrimony-1',
    credentials: {
      couple: { fullName: 'Sara & Dawit', email: 'couple@matrimony.com', temporaryPassword: 'agafari2026', role: 'BRIDE_GROOM' },
      organizer: { fullName: 'Matrimony Event Planners', email: 'matrimony@agafari.com', temporaryPassword: 'org123', role: 'EVENT_ORGANIZER' },
      streamer: { fullName: 'Matrimony Stream Studio', email: 'streamer@matrimony.com', temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
      scanner: { fullName: 'Matrimony Gate Scanner', email: 'scanner@matrimony.com', temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
      moderator: { fullName: 'Matrimony Moderator', email: 'moderator@matrimony.com', temporaryPassword: 'mod123', role: 'MODERATOR' }
    }
  }
];

const mockUsers: UserRecord[] = [
  {
    id: 'usr-admin-1',
    eventId: null,
    email: 'admin@agafari.com',
    passwordHash: hashPassword('admin123'),
    temporaryPassword: 'admin123',
    fullName: 'System Super Admin',
    companyName: 'Agafari Headquarters',
    role: 'SYSTEM_ADMIN',
  },
  {
    id: 'usr-matrimony-1',
    eventId: 'evt-matrimony-789012',
    email: 'matrimony@agafari.com',
    passwordHash: hashPassword('org123'),
    temporaryPassword: 'org123',
    fullName: 'Matrimony Event Planners',
    companyName: 'Matrimony Event Planners',
    description: 'Premier wedding and holy matrimony coordination agency.',
    organizerId: 'org-matrimony-1',
    role: 'EVENT_ORGANIZER',
  },
  {
    id: 'usr-org-1',
    eventId: 'evt-adeday-123456',
    email: 'organizer@agafari.com',
    passwordHash: hashPassword('org123'),
    temporaryPassword: 'org123',
    fullName: 'Agafari Luxury Event Production',
    companyName: 'Agafari Luxury Event Production',
    description: 'Official certified event management partner. Specializing in full-service luxury weddings, guest registration, and live broadcast production.',
    organizerId: 'org-usr-org-1',
    role: 'EVENT_ORGANIZER',
  },
  {
    id: 'usr-1790347886383-736',
    eventId: null,
    email: 'abe@gmail.com',
    passwordHash: hashPassword('agafari2026'),
    temporaryPassword: 'agafari2026',
    fullName: 'abe',
    companyName: 'Abe Event Organizer Agency',
    description: 'Certified Event Organizer Agency.',
    organizerId: 'org-usr-1790347886383-736',
    role: 'EVENT_ORGANIZER',
  },
  {
    id: 'usr-org-2',
    eventId: null,
    email: 'royal@agafari.com',
    passwordHash: hashPassword('org123'),
    temporaryPassword: 'org123',
    fullName: 'Ethiopian Royal Wedding Planners',
    companyName: 'Ethiopian Royal Wedding Planners',
    description: 'Certified premium event agency specializing in high-profile traditional Ethiopian weddings, VIP guest management, and stage design.',
    organizerId: 'org-usr-org-2',
    role: 'EVENT_ORGANIZER',
  },
  {
    id: 'usr-org-3',
    eventId: null,
    email: 'agency@kanaevents.com',
    passwordHash: hashPassword('org123'),
    temporaryPassword: 'org123',
    fullName: 'Kana Events & Wedding Production',
    companyName: 'Kana Events & Wedding Production',
    description: 'Full-service event production studio managing venue setup, guest seating charts, live video streaming, and digital invitations.',
    organizerId: 'org-usr-org-3',
    role: 'EVENT_ORGANIZER',
  },
  {
    id: 'usr-org-4',
    eventId: null,
    email: 'contact@habeshaelite.com',
    passwordHash: hashPassword('org123'),
    temporaryPassword: 'org123',
    fullName: 'Habesha Elite Wedding Coordinators',
    companyName: 'Habesha Elite Wedding Coordinators',
    description: 'Bespoke Ethiopian wedding planning agency offering gate QR scanning, live broadcast management, and guest wish moderation.',
    organizerId: 'org-usr-org-4',
    role: 'EVENT_ORGANIZER',
  },
  {
    id: 'usr-couple-1',
    eventId: 'evt-adeday-123456',
    email: 'couple@agafari.com',
    passwordHash: hashPassword('agafari2026'),
    temporaryPassword: 'agafari2026',
    fullName: 'Adeday & Adisu',
    companyName: 'Adeday & Adisu Wedding',
    role: 'BRIDE_GROOM',
  },
  {
    id: 'usr-couple-matrimony',
    eventId: 'evt-matrimony-789012',
    email: 'couple@matrimony.com',
    passwordHash: hashPassword('agafari2026'),
    temporaryPassword: 'agafari2026',
    fullName: 'Sara & Dawit',
    companyName: 'Sara & Dawit Wedding',
    role: 'BRIDE_GROOM',
  },
  {
    id: 'usr-streamer-1',
    eventId: 'evt-adeday-123456',
    email: 'streamer@agafari.com',
    passwordHash: hashPassword('stream123'),
    temporaryPassword: 'stream123',
    fullName: 'Live Broadcast Crew',
    role: 'LIVE_STREAMER',
  },
  {
    id: 'usr-streamer-matrimony',
    eventId: 'evt-matrimony-789012',
    email: 'streamer@matrimony.com',
    passwordHash: hashPassword('stream123'),
    temporaryPassword: 'stream123',
    fullName: 'Matrimony Live Broadcast Crew',
    role: 'LIVE_STREAMER',
  },
  {
    id: 'usr-scanner-1',
    eventId: 'evt-adeday-123456',
    email: 'scanner@agafari.com',
    passwordHash: hashPassword('scan123'),
    temporaryPassword: 'scan123',
    fullName: 'Gate QR Security Scanner',
    role: 'GATE_SCANNER',
  },
  {
    id: 'usr-scanner-matrimony',
    eventId: 'evt-matrimony-789012',
    email: 'scanner@matrimony.com',
    passwordHash: hashPassword('scan123'),
    temporaryPassword: 'scan123',
    fullName: 'Matrimony Gate Security Scanner',
    role: 'GATE_SCANNER',
  }
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
