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
    id: 'evt-kebkab-101',
    slug: 'bethlehem-and-yonas',
    title: 'Bethlehem & Yonas Traditional & Holy Wedding',
    brideName: 'Bethlehem',
    groomName: 'Yonas',
    eventDate: '2026-11-12T14:00:00.000Z',
    startTime: '13:30',
    venueName: 'Haile Grand Ballroom, Addis Ababa',
    venueAddress: 'CMC Road, Near Sunshine, Addis Ababa, Ethiopia',
    venueMapUrl: 'https://maps.google.com/?q=Haile+Grand+Addis+Ababa',
    dressCode: 'Traditional Gondar Habesha Kemis & Royal Kaba',
    welcomeMessage: 'እንኳን ወደ ቤተልሄምና ዮናስ የጋብቻ በዓል በሰላም መጣችሁ! (Welcome to our holy matrimony celebration!)',
    coverImageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200',
    status: 'COMING_SOON',
    adminApprovalStatus: 'APPROVED',
    organizerId: 'org-kebkab',
    credentials: {
      couple: { fullName: 'Bethlehem & Yonas', email: 'couple@kebkab-wedding.com', temporaryPassword: 'couple123', role: 'BRIDE_GROOM' },
      organizer: { fullName: 'Kebkab Wedding & Events Coordinator', email: 'kebkab@agafari.com', temporaryPassword: 'org123', role: 'EVENT_ORGANIZER' },
      streamer: { fullName: 'Kebkab Live Stream Crew', email: 'streamer@kebkab-wedding.com', temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
      scanner: { fullName: 'Kebkab Gate Security Scanner', email: 'scanner@kebkab-wedding.com', temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
      moderator: { fullName: 'Kebkab Social & Media Moderator', email: 'moderator@kebkab-wedding.com', temporaryPassword: 'mod123', role: 'MODERATOR' }
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
      couple: { fullName: 'Sara & Dawit', email: 'couple@matrimony.com', temporaryPassword: 'couple123', role: 'BRIDE_GROOM' },
      organizer: { fullName: 'Matrimony Event Planners', email: 'matrimony@agafari.com', temporaryPassword: 'org123', role: 'EVENT_ORGANIZER' },
      streamer: { fullName: 'Matrimony Stream Studio', email: 'streamer@matrimony.com', temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
      scanner: { fullName: 'Matrimony Gate Scanner', email: 'scanner@matrimony.com', temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
      moderator: { fullName: 'Matrimony Feed Moderator', email: 'moderator@matrimony.com', temporaryPassword: 'mod123', role: 'MODERATOR' }
    }
  },
  {
    id: 'evt-natnael-selam-1',
    slug: 'natnael-selam',
    title: 'Natnael & Selam Grand Wedding',
    brideName: 'Selam',
    groomName: 'Natnael',
    eventDate: '2026-10-25T14:00:00.000Z',
    startTime: '14:30',
    venueName: 'Hilton Addis Grand Ballroom',
    venueAddress: 'Menelik II Avenue, Addis Ababa, Ethiopia',
    venueMapUrl: 'https://maps.google.com/?q=Hilton+Addis+Ababa',
    dressCode: 'Formal Black Tie & Habesha Kemis',
    welcomeMessage: 'We are thrilled to celebrate our love and unity with our beloved family and friends!',
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    status: 'COMING_SOON',
    adminApprovalStatus: 'APPROVED',
    organizerId: 'agafari-matrimony',
    credentials: {
      couple: { fullName: 'Natnael & Selam', email: 'couple@natnael-selam.com', temporaryPassword: 'couple123', role: 'BRIDE_GROOM' },
      organizer: { fullName: 'Agafari Luxury Event Production', email: 'organizer@agafari.com', temporaryPassword: 'org123', role: 'EVENT_ORGANIZER' },
      streamer: { fullName: 'Natnael & Selam Stream Crew', email: 'streamer@natnael-selam.com', temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
      scanner: { fullName: 'Gate Entrance Scanner A', email: 'scanner@natnael-selam.com', temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
      moderator: { fullName: 'Natnael & Selam Feed Moderator', email: 'moderator@natnael-selam.com', temporaryPassword: 'mod123', role: 'MODERATOR' }
    }
  },
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
      couple: { fullName: 'Adeday & Adisu', email: 'couple@agafari.com', temporaryPassword: 'couple123', role: 'BRIDE_GROOM' },
      organizer: { fullName: 'Agafari Luxury Event Production', email: 'organizer@agafari.com', temporaryPassword: 'org123', role: 'EVENT_ORGANIZER' },
      streamer: { fullName: 'Live Streamer Crew', email: 'streamer@agafari.com', temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
      scanner: { fullName: 'Gate QR Security Scanner', email: 'scanner@agafari.com', temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
      moderator: { fullName: 'Content Moderator', email: 'moderator@agafari.com', temporaryPassword: 'mod123', role: 'MODERATOR' }
    }
  }
];

const mockUsers: UserRecord[] = [
  // 1. THE ONLY SINGLE SYSTEM / PLATFORM ADMIN
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
  // 2. EVENT ORGANIZERS (Multiple separate agencies)
  {
    id: 'usr-kebkab-1',
    eventId: 'evt-kebkab-101',
    email: 'kebkab@agafari.com',
    passwordHash: hashPassword('org123'),
    temporaryPassword: 'org123',
    fullName: 'Kebkab Wedding & Events Coordinator',
    companyName: 'Kebkab Events',
    description: 'Renowned traditional and luxury Ethiopian wedding planners and event coordination agency.',
    organizerId: 'org-kebkab',
    role: 'EVENT_ORGANIZER',
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
    eventId: 'evt-natnael-selam-1',
    email: 'organizer@agafari.com',
    passwordHash: hashPassword('org123'),
    temporaryPassword: 'org123',
    fullName: 'Agafari Luxury Event Production',
    companyName: 'Agafari Luxury Event Production',
    description: 'Official certified event management partner. Specializing in full-service luxury weddings, guest registration, and live broadcast production.',
    organizerId: 'org-usr-org-1',
    role: 'EVENT_ORGANIZER',
  },

  // 3. EVENT-SPECIFIC COUPLES (One for each wedding)
  {
    id: 'usr-couple-kebkab',
    eventId: 'evt-kebkab-101',
    email: 'couple@kebkab-wedding.com',
    passwordHash: hashPassword('couple123'),
    temporaryPassword: 'couple123',
    fullName: 'Bethlehem & Yonas',
    companyName: 'Bethlehem & Yonas Wedding',
    role: 'BRIDE_GROOM',
  },
  {
    id: 'usr-couple-matrimony',
    eventId: 'evt-matrimony-789012',
    email: 'couple@matrimony.com',
    passwordHash: hashPassword('couple123'),
    temporaryPassword: 'couple123',
    fullName: 'Sara & Dawit',
    companyName: 'Sara & Dawit Wedding',
    role: 'BRIDE_GROOM',
  },
  {
    id: 'usr-couple-natnael',
    eventId: 'evt-natnael-selam-1',
    email: 'couple@natnael-selam.com',
    passwordHash: hashPassword('couple123'),
    temporaryPassword: 'couple123',
    fullName: 'Natnael & Selam',
    companyName: 'Natnael & Selam Wedding',
    role: 'BRIDE_GROOM',
  },

  // 4. EVENT-SPECIFIC GATE SCANNERS (Different for each event)
  {
    id: 'usr-scanner-kebkab',
    eventId: 'evt-kebkab-101',
    email: 'scanner@kebkab-wedding.com',
    passwordHash: hashPassword('scan123'),
    temporaryPassword: 'scan123',
    fullName: 'Gate Scanner - Bethlehem & Yonas Wedding',
    role: 'GATE_SCANNER',
  },
  {
    id: 'usr-scanner-matrimony',
    eventId: 'evt-matrimony-789012',
    email: 'scanner@matrimony.com',
    passwordHash: hashPassword('scan123'),
    temporaryPassword: 'scan123',
    fullName: 'Gate Scanner - Sara & Dawit Matrimony',
    role: 'GATE_SCANNER',
  },
  {
    id: 'usr-scanner-natnael',
    eventId: 'evt-natnael-selam-1',
    email: 'scanner@natnael-selam.com',
    passwordHash: hashPassword('scan123'),
    temporaryPassword: 'scan123',
    fullName: 'Gate Scanner - Natnael & Selam Wedding',
    role: 'GATE_SCANNER',
  },

  // 5. EVENT-SPECIFIC MEDIA MODERATORS (For each event)
  {
    id: 'usr-moderator-kebkab',
    eventId: 'evt-kebkab-101',
    email: 'moderator@kebkab-wedding.com',
    passwordHash: hashPassword('mod123'),
    temporaryPassword: 'mod123',
    fullName: 'Media Moderator - Bethlehem & Yonas Wedding',
    role: 'MODERATOR',
  },
  {
    id: 'usr-moderator-matrimony',
    eventId: 'evt-matrimony-789012',
    email: 'moderator@matrimony.com',
    passwordHash: hashPassword('mod123'),
    temporaryPassword: 'mod123',
    fullName: 'Media Moderator - Sara & Dawit Matrimony',
    role: 'MODERATOR',
  },
  {
    id: 'usr-moderator-natnael',
    eventId: 'evt-natnael-selam-1',
    email: 'moderator@natnael-selam.com',
    passwordHash: hashPassword('mod123'),
    temporaryPassword: 'mod123',
    fullName: 'Media Moderator - Natnael & Selam Wedding',
    role: 'MODERATOR',
  },

  // 6. EVENT-SPECIFIC LIVE STREAMERS (For each event)
  {
    id: 'usr-streamer-kebkab',
    eventId: 'evt-kebkab-101',
    email: 'streamer@kebkab-wedding.com',
    passwordHash: hashPassword('stream123'),
    temporaryPassword: 'stream123',
    fullName: 'Live Broadcast Crew - Bethlehem & Yonas',
    role: 'LIVE_STREAMER',
  },
  {
    id: 'usr-streamer-matrimony',
    eventId: 'evt-matrimony-789012',
    email: 'streamer@matrimony.com',
    passwordHash: hashPassword('stream123'),
    temporaryPassword: 'stream123',
    fullName: 'Live Broadcast Crew - Sara & Dawit',
    role: 'LIVE_STREAMER',
  },
  {
    id: 'usr-streamer-natnael',
    eventId: 'evt-natnael-selam-1',
    email: 'streamer@natnael-selam.com',
    passwordHash: hashPassword('stream123'),
    temporaryPassword: 'stream123',
    fullName: 'Live Broadcast Crew - Natnael & Selam',
    role: 'LIVE_STREAMER',
  }
];

// Distinct, realistic Invitations per event
const mockInvitations: InvitationData[] = [
  // Bethlehem & Yonas (Kebkab) Guests
  {
    id: 'inv-kebkab-1',
    eventId: 'evt-kebkab-101',
    inviteCode: 'KB-AB71',
    guestName: 'Abebe Bikila & Family',
    guestPhone: '+251 91 122 3344',
    maxGuests: 4,
    tableNumber: 'Royal Table 1',
    rsvpStatus: 'ATTENDING',
    attendingHeadcount: 4,
    scannedCount: 4,
    isScanned: true,
    scannedAt: '2026-11-12T13:45:00.000Z',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KB-AB71',
    createdAt: '2026-10-01T10:00:00.000Z'
  },
  {
    id: 'inv-kebkab-2',
    eventId: 'evt-kebkab-101',
    inviteCode: 'KB-AL92',
    guestName: 'Almaz Ayana',
    guestPhone: '+251 91 233 4455',
    maxGuests: 2,
    tableNumber: 'Table 2',
    rsvpStatus: 'ATTENDING',
    attendingHeadcount: 2,
    scannedCount: 0,
    isScanned: false,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KB-AL92',
    createdAt: '2026-10-01T10:05:00.000Z'
  },
  {
    id: 'inv-kebkab-3',
    eventId: 'evt-kebkab-101',
    inviteCode: 'KB-KN44',
    guestName: 'Kenenisa Bekele',
    guestPhone: '+251 91 344 5566',
    maxGuests: 2,
    tableNumber: 'Table 3',
    rsvpStatus: 'PENDING',
    attendingHeadcount: 0,
    scannedCount: 0,
    isScanned: false,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KB-KN44',
    createdAt: '2026-10-02T11:00:00.000Z'
  },

  // Sara & Dawit (Matrimony) Guests
  {
    id: 'inv-mat-1',
    eventId: 'evt-matrimony-789012',
    inviteCode: 'MT-ER55',
    guestName: 'Dr. Ermias Kebede',
    guestPhone: '+251 91 455 6677',
    maxGuests: 2,
    tableNumber: 'VIP Palace A',
    rsvpStatus: 'ATTENDING',
    attendingHeadcount: 2,
    scannedCount: 2,
    isScanned: true,
    scannedAt: '2026-10-18T14:10:00.000Z',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MT-ER55',
    createdAt: '2026-09-15T09:00:00.000Z'
  },
  {
    id: 'inv-mat-2',
    eventId: 'evt-matrimony-789012',
    inviteCode: 'MT-AS88',
    guestName: 'Aster Aweke',
    guestPhone: '+251 91 566 7788',
    maxGuests: 3,
    tableNumber: 'VIP Palace B',
    rsvpStatus: 'ATTENDING',
    attendingHeadcount: 3,
    scannedCount: 0,
    isScanned: false,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MT-AS88',
    createdAt: '2026-09-15T09:30:00.000Z'
  },

  // Natnael & Selam (Agafari) Guests
  {
    id: 'inv-nat-1',
    eventId: 'evt-natnael-selam-1',
    inviteCode: 'NS-SB01',
    guestName: 'Solomon Bogale',
    guestPhone: '+251 91 677 8899',
    maxGuests: 2,
    tableNumber: 'Table 1 - Family VIP',
    rsvpStatus: 'ATTENDING',
    attendingHeadcount: 2,
    scannedCount: 2,
    isScanned: true,
    scannedAt: '2026-10-25T14:40:00.000Z',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NS-SB01',
    createdAt: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'inv-nat-2',
    eventId: 'evt-natnael-selam-1',
    inviteCode: 'NS-GZ02',
    guestName: 'Genet Zewde',
    guestPhone: '+251 91 788 9900',
    maxGuests: 4,
    tableNumber: 'Table 4',
    rsvpStatus: 'ATTENDING',
    attendingHeadcount: 4,
    scannedCount: 0,
    isScanned: false,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NS-GZ02',
    createdAt: '2026-09-21T14:15:00.000Z'
  }
];

// Distinct Wishes per event
const mockWishes: WishData[] = [
  // Bethlehem & Yonas Wishes
  {
    id: 'wsh-kebkab-1',
    eventId: 'evt-kebkab-101',
    senderName: 'Tewodros Kassahun',
    message: 'እንኳን ለዚህ ክቡር ቀን አደረሳችሁ! ትዳራችሁን የሰላም እና የፍቅር ያድርግላችሁ። እጅግ በጣም ደስ ብሎኛል!',
    mediaType: 'TEXT',
    status: 'APPROVED',
    createdAt: '2026-11-12T15:00:00.000Z'
  },
  {
    id: 'wsh-kebkab-2',
    eventId: 'evt-kebkab-101',
    senderName: 'Helen Berhe',
    message: 'Wishing beautiful Bethlehem and Yonas a lifetime filled with joyful laughter and abundant blessings!',
    mediaType: 'TEXT',
    status: 'APPROVED',
    createdAt: '2026-11-12T15:30:00.000Z'
  },

  // Sara & Dawit Wishes
  {
    id: 'wsh-mat-1',
    eventId: 'evt-matrimony-789012',
    senderName: 'Bishop Abba Melketsedek',
    message: 'እግዚአብሔር ጋብቻችሁን የተባረከ፣ ልጆቻችሁን እንደ ወይራ ቡቃያ ያድርግላችሁ። አሜን።',
    mediaType: 'TEXT',
    status: 'APPROVED',
    createdAt: '2026-10-18T14:45:00.000Z'
  },

  // Natnael & Selam Wishes
  {
    id: 'wsh-nat-1',
    eventId: 'evt-natnael-selam-1',
    senderName: 'Mahlet Gebregziabher',
    message: 'Congratulations Natnael & Selam! You two are an inspiration. May your love grow deeper each day!',
    mediaType: 'TEXT',
    status: 'APPROVED',
    createdAt: '2026-10-25T15:10:00.000Z'
  }
];

// Distinct Media Assets per event
const mockMediaAssets: MediaAssetData[] = [
  // Bethlehem & Yonas Media
  {
    id: 'med-kebkab-1',
    eventId: 'evt-kebkab-101',
    uploaderName: 'Official Photography Crew',
    mediaType: 'IMAGE',
    category: 'LIVE',
    cdnUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    caption: 'Bethlehem & Yonas grand entrance in royal Ethiopian attire',
    status: 'APPROVED',
    viewsCount: 42,
    likesCount: 19,
    createdAt: '2026-11-12T16:00:00.000Z'
  },

  // Sara & Dawit Media
  {
    id: 'med-mat-1',
    eventId: 'evt-matrimony-789012',
    uploaderName: 'Matrimony Live Broadcast',
    mediaType: 'IMAGE',
    category: 'LIVE',
    cdnUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
    caption: 'The sacred holy crown blessing ceremony',
    status: 'APPROVED',
    viewsCount: 65,
    likesCount: 38,
    createdAt: '2026-10-18T15:30:00.000Z'
  },

  // Natnael & Selam Media
  {
    id: 'med-nat-1',
    eventId: 'evt-natnael-selam-1',
    uploaderName: 'VIP Table Guest',
    mediaType: 'IMAGE',
    category: 'WISHES',
    cdnUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
    caption: 'First dance celebration with family and friends',
    status: 'APPROVED',
    viewsCount: 88,
    likesCount: 52,
    createdAt: '2026-10-25T16:20:00.000Z'
  }
];

export const mockStore = {
  events: mockEvents,
  users: mockUsers,
  wishes: mockWishes,
  mediaAssets: mockMediaAssets,
  invitations: mockInvitations,
};

