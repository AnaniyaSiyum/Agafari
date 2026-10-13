'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Calendar,
  Users,
  Video,
  Plus,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  LogOut,
  Search,
  Check,
  X,
  Sparkles,
  Layers,
  KeyRound,
  FileText,
  Briefcase,
  ScanLine,
  Radio,
  Clock,
  MapPin,
  Send,
  Copy,
  ChevronLeft,
  Settings,
  Heart,
  Save,
  MessageSquare,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Building2,
  Smartphone,
  Shield,
  Camera,
  Tv,
  Trash2,
  BookOpen,
  Music,
  Volume2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';
import InvitationCardModal from '@/components/InvitationCardModal';
import { inspectImageFile, IMAGE_SPECS, ImageInspectionResult } from '@/lib/imageInspector';
import DashboardSecurityGate from '@/components/DashboardSecurityGate';

interface RoleCredential {
  fullName: string;
  email: string;
  temporaryPassword?: string;
  role: string;
}

interface ProgramItem {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
}

export interface StoryCardItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  image?: string;
}

interface LoveStoryData {
  headline: string;
  firstMetDate?: string;
  firstMetStory?: string;
  proposalDate?: string;
  proposalStory?: string;
  storyCards?: StoryCardItem[];
}

interface AdditionalLocation {
  id: string;
  label: string;
  description: string;
  mapUrl?: string;
}

interface EventData {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  startTime?: string;
  venueName: string;
  venueAddress?: string;
  venueMapUrl?: string;
  dressCode?: string;
  welcomeMessage?: string;
  coverImageUrl?: string;
  couplePhotoUrl?: string;
  backgroundAudioUrl?: string;
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  isLive?: boolean;
  youtubeVideoId?: string;
  loveStory?: LoveStoryData;
  programs?: ProgramItem[];
  additionalLocations?: AdditionalLocation[];
  credentials?: {
    couple: RoleCredential;
    organizer: RoleCredential;
    streamer: RoleCredential;
    scanner: RoleCredential;
    moderator?: RoleCredential;
  };
  coupleCredentials?: {
    email: string;
    temporaryPassword?: string;
  };
}

export default function DedicatedEventControlPage({
  params,
}: {
  params: { organizerSlug: string; eventSlug: string };
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { organizerSlug, eventSlug } = params;

  const [activeTab, setActiveTab] = useState<'ROLES' | 'DETAILS' | 'RSVPS' | 'MEDIA'>('ROLES');
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Password visibility & copied feedback
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Editable Event Details State
  const [formState, setFormState] = useState({
    title: '',
    brideName: '',
    groomName: '',
    eventDate: '',
    startTime: '14:00',
    venueName: '',
    venueAddress: '',
    venueMapUrl: '',
    dressCode: '',
    welcomeMessage: '',
    coverImageUrl: '',
    couplePhotoUrl: '',
    backgroundAudioUrl: '',
    youtubeVideoId: '',
    cardTheme: 'ROYAL_GOLD' as 'ROYAL_GOLD' | 'CHAMPAGNE_IVORY' | 'ROSE_GOLD' | 'EMERALD_GOLD',
    cardTemplate: 'CLASSIC_HORIZONTAL' as 'CLASSIC_HORIZONTAL' | 'ELEGANT_VERTICAL',
    customWording: 'Together with their families request the pleasure of your company',
    // Love Story fields
    loveStoryHeadline: 'Our Journey to Forever',
    firstMetDate: '2024-05-12',
    firstMetStory: '',
    proposalDate: '2025-12-25',
    proposalStory: ''
  });

  const [cardModalOpen, setCardModalOpen] = useState(false);

  // Additional locations state
  const [additionalLocations, setAdditionalLocations] = useState<AdditionalLocation[]>([]);

  // Couple Love Story cards state
  const [storyCards, setStoryCards] = useState<StoryCardItem[]>([
    {
      id: 'sc_1',
      badge: 'THE BEGINNING',
      title: 'A Chance Encounter & First Meeting',
      subtitle: 'THE BEGINNING OF US',
      date: '2024-05-12',
      description: 'adeday and adisu first crossed paths on a sunny afternoon. What began as a simple coffee conversation turned into hours of deep dialogue about faith, family traditions, and their shared vision for the future.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800'
    },
    {
      id: 'sc_2',
      badge: 'THE PROPOSAL',
      title: 'Under the Stars Proposal',
      subtitle: 'THE ROMANTIC PROPOSAL',
      date: '2025-12-25',
      description: 'During a weekend getaway, adisu surprised adeday with a romantic proposal. With music playing, he got down on one knee and proposed. adeday joyfully answered YES!',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800'
    }
  ]);

  // Programs schedule list state
  const [programs, setPrograms] = useState<ProgramItem[]>([
    {
      id: 'p1',
      time: '10:00 AM',
      title: 'Holy Matrimony & Blessing',
      location: 'Holy Trinity Cathedral',
      description: 'Sacred church wedding ceremony, prayer of blessing, and exchange of rings.'
    },
    {
      id: 'p2',
      time: '04:00 PM',
      title: 'Grand Wedding Reception',
      location: 'Ballroom',
      description: 'Grand entrance of the couple, champagne toast, multi-course dinner banquet, and couple dance.'
    },
    {
      id: 'p3',
      time: '08:00 PM',
      title: 'Melse & Cultural Celebration',
      location: 'Traditional Cultural Hall',
      description: 'Ethio-Eritrean traditional attire celebration, kebero music performance, and cutting of the Himbasha.'
    }
  ]);

  // Real guests & media assets for this wedding
  const [guests, setGuests] = useState<any[]>([]);

  const [mediaAssets, setMediaAssets] = useState<any[]>([]);

  const handleUpdateMediaStatus = async (mediaId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setMediaAssets((prev) =>
      prev.map((item) => (item.id === mediaId ? { ...item, status: newStatus } : item))
    );

    try {
      await fetch('/api/organizer/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event?.id,
          mediaId,
          status: newStatus,
          action: newStatus === 'APPROVED' ? 'approve' : 'reject'
        }),
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteMediaAsset = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media asset permanently?')) return;
    setMediaAssets((prev) => prev.filter((item) => item.id !== mediaId));
    try {
      await fetch(`/api/organizer/media?mediaId=${mediaId}&eventId=${event?.id || ''}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete media asset:', err);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventSlug]);

  async function fetchEventDetails() {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventSlug}`);
      if (res.ok) {
        const data = await res.json();
        if (data.event) {
          const evt = data.event;
          
          // Strict Multi-Tenant Isolation Check:
          const userStr = typeof window !== 'undefined' ? localStorage.getItem('agafari_user') : null;
          let userObj: any = null;
          if (userStr) {
            try { userObj = JSON.parse(userStr); } catch (e) {}
          }
          if (userObj && userObj.role === 'EVENT_ORGANIZER') {
            const userOrg = String(userObj.organizerId || userObj.tenantId || userObj.id || '').toLowerCase().replace(/^org-/, '');
            const targetOrg = organizerSlug.toLowerCase().replace(/^org-/, '');
            const evtOrg = String(evt.organizerId || evt.organizer_id || '').toLowerCase().replace(/^org-/, '');
            if (userOrg && ((targetOrg && userOrg !== targetOrg) || (evtOrg && userOrg !== evtOrg))) {
              setAccessDenied(true);
              setLoading(false);
              return;
            }
          }

          const brideName = evt.brideName || evt.bride_name || 'Bride';
          const groomName = evt.groomName || evt.groom_name || 'Groom';
          
          setEvent(evt);
          setFormState({
            title: evt.title || `${brideName} & ${groomName}'s Wedding`,
            brideName,
            groomName,
            eventDate: evt.eventDate ? evt.eventDate.split('T')[0] : '2026-09-20',
            startTime: evt.startTime || '14:00',
            venueName: evt.venueName || evt.venue_name || 'Sheraton Addis Luxury Ballroom',
            venueAddress: evt.venueAddress || evt.venue_address || 'Taitu Street, Addis Ababa, Ethiopia',
            venueMapUrl: evt.venueMapUrl || evt.venue_map_url || 'https://maps.google.com/?q=Sheraton+Addis',
            dressCode: evt.dressCode || evt.dress_code || 'Formal Black Tie & Habesha Kemis',
            welcomeMessage: evt.welcomeMessage || evt.welcome_message || `We are overjoyed to welcome you to our wedding celebration!`,
            coverImageUrl: evt.coverImageUrl || evt.cover_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
            couplePhotoUrl: evt.couplePhotoUrl || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
            backgroundAudioUrl: evt.backgroundAudioUrl || evt.background_audio_url || evt.customization?.backgroundAudioUrl || (typeof window !== 'undefined' && eventSlug ? localStorage.getItem(`agafari_bg_audio_${eventSlug}`) : null) || '',
            youtubeVideoId: evt.youtubeVideoId || evt.youtube_video_id || '',
            loveStoryHeadline: evt.loveStory?.headline || 'Our Journey to Forever',
            firstMetDate: evt.loveStory?.firstMetDate || '2024-05-12',
            firstMetStory: evt.loveStory?.firstMetStory || `${brideName} and ${groomName} first crossed paths on a sunny afternoon in Addis Ababa. What began as a simple coffee conversation turned into hours of deep dialogue about faith, family traditions, and their shared vision for the future.`,
            proposalDate: evt.loveStory?.proposalDate || '2025-12-25',
            proposalStory: evt.loveStory?.proposalStory || `During a weekend retreat, ${groomName} surprised ${brideName} with a romantic candlelight dinner. With music playing, he got down on one knee and proposed. ${brideName} joyfully answered YES!`,
            cardTheme: evt.cardTheme || evt.card_theme || 'ROYAL_GOLD',
            cardTemplate: evt.cardTemplate || evt.card_template || 'CLASSIC_HORIZONTAL',
            customWording: evt.customWording || evt.custom_wording || 'Together with their families request the pleasure of your company',
          });

          if (evt.loveStory?.storyCards && Array.isArray(evt.loveStory.storyCards) && evt.loveStory.storyCards.length > 0) {
            setStoryCards(evt.loveStory.storyCards);
          } else if (evt.loveStory?.firstMetStory || evt.loveStory?.proposalStory) {
            const defaultCards: StoryCardItem[] = [];
            if (evt.loveStory.firstMetStory) {
              defaultCards.push({
                id: 'sc_1',
                badge: 'THE BEGINNING',
                title: 'A Chance Encounter & First Meeting',
                subtitle: 'THE BEGINNING OF US',
                date: evt.loveStory.firstMetDate || '2024-05-12',
                description: evt.loveStory.firstMetStory,
                image: evt.couplePhotoUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800'
              });
            }
            if (evt.loveStory.proposalStory) {
              defaultCards.push({
                id: 'sc_2',
                badge: 'THE PROPOSAL',
                title: 'Under the Stars Proposal',
                subtitle: 'THE ROMANTIC PROPOSAL',
                date: evt.loveStory.proposalDate || '2025-12-25',
                description: evt.loveStory.proposalStory,
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800'
              });
            }
            if (defaultCards.length > 0) setStoryCards(defaultCards);
          }

          if (evt.additionalLocations && Array.isArray(evt.additionalLocations)) {
            setAdditionalLocations(evt.additionalLocations);
          } else if (evt.customization?.additionalLocations && Array.isArray(evt.customization.additionalLocations)) {
            setAdditionalLocations(evt.customization.additionalLocations);
          }

          if (evt.programs && Array.isArray(evt.programs) && evt.programs.length > 0) {
            setPrograms(evt.programs);
          }

          // Fetch real media assets & invitations from database
          const [mediaRes, invRes] = await Promise.all([
            fetch(`/api/events/${eventSlug}/media?status=ALL`),
            fetch(`/api/events/${eventSlug}/invitations`)
          ]);

          if (invRes.ok) {
            const invData = await invRes.json();
            const rawInvites = invData.invitations || [];
            setGuests(rawInvites.map((i: any) => ({
              id: i.id,
              name: i.guest_name || i.guestName || 'VIP Guest',
              email: i.guest_phone || 'guest@agafari.com',
              code: i.invite_code || i.inviteCode || 'INV-000',
              status: i.rsvp_status || i.status || 'PENDING',
              vip: i.invite_type === 'CARD' || true,
              table: i.table_number || 'Table 1'
            })));
          } else {
            setGuests([]);
          }
          if (mediaRes.ok) {
            const mData = await mediaRes.json();
            const assets = mData.mediaAssets || mData.items || [];
            setMediaAssets(assets.map((m: any) => ({
              id: m.id,
              uploaderName: m.uploader_name || m.uploaderName || 'Guest',
              cdnUrl: m.cdn_url || m.cdnUrl,
              type: m.media_type || m.mediaType || 'IMAGE',
              category: m.category || 'WISHES',
              caption: m.caption || '',
              status: m.status || 'PENDING'
            })));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load event details:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveEventDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);

    const payload = {
      ...formState,
      title: `${formState.brideName} & ${formState.groomName}'s Wedding`,
      additionalLocations,
      loveStory: {
        headline: formState.loveStoryHeadline,
        firstMetDate: formState.firstMetDate,
        firstMetStory: formState.firstMetStory,
        proposalDate: formState.proposalDate,
        proposalStory: formState.proposalStory,
        storyCards
      },
      programs
    };

    if (formState.backgroundAudioUrl && typeof window !== 'undefined' && eventSlug) {
      localStorage.setItem(`agafari_bg_audio_${eventSlug}`, formState.backgroundAudioUrl);
    }

    try {
      const res = await fetch(`/api/events/${eventSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveMsg({ text: 'All wedding customizations saved! The guest invitation page has been dynamically updated.', type: 'success' });
        fetchEventDetails();
      } else {
        setSaveMsg({ text: 'Failed to update event details.', type: 'error' });
      }
    } catch (err) {
      setSaveMsg({ text: 'Network error updating event details.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddLocation = () => {
    const newLoc: AdditionalLocation = {
      id: 'loc_' + Date.now(),
      label: 'Church Ceremony / Secondary Venue',
      description: 'Sacred matrimony blessing service & reception gathering',
      mapUrl: ''
    };
    setAdditionalLocations([...additionalLocations, newLoc]);
  };

  const handleUpdateLocation = (id: string, field: keyof AdditionalLocation, value: string) => {
    setAdditionalLocations(additionalLocations.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleDeleteLocation = (id: string) => {
    setAdditionalLocations(additionalLocations.filter((l) => l.id !== id));
  };

  const handleAddStoryCard = () => {
    const newCard: StoryCardItem = {
      id: 'sc_' + Date.now(),
      badge: 'NEW CHAPTER',
      title: 'New Story Chapter',
      subtitle: 'SUBTITLE / TAGLINE',
      date: new Date().getFullYear().toString(),
      description: 'Write your story chapter description here...',
      image: ''
    };
    setStoryCards([...storyCards, newCard]);
  };

  const handleUpdateStoryCard = (id: string, field: keyof StoryCardItem, value: string) => {
    setStoryCards(storyCards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  // Image dimension inspection state tracking
  const [coverInspection, setCoverInspection] = useState<ImageInspectionResult | null>(null);
  const [coupleInspection, setCoupleInspection] = useState<ImageInspectionResult | null>(null);
  const [storyInspections, setStoryInspections] = useState<Record<string, ImageInspectionResult>>({});

  const handleDeleteStoryCard = (id: string) => {
    setStoryCards(storyCards.filter((c) => c.id !== id));
  };

  const handleCardImageUpload = async (id: string, file: File) => {
    const inspection = await inspectImageFile(file, 'STORY_CARD');
    setStoryInspections((prev) => ({ ...prev, [id]: inspection }));
    const compressed = await compressAndResizeImage(file, 1000, 700, 0.85);
    if (compressed) {
      handleUpdateStoryCard(id, 'image', compressed);
    }
  };

  const compressAndResizeImage = (file: File, maxWidth = 1200, maxHeight = 800, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          resolve('');
          return;
        }
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const inspection = await inspectImageFile(file, 'HERO_COVER');
      setCoverInspection(inspection);
      const compressed = await compressAndResizeImage(file, 1920, 1080, 0.85);
      if (compressed) {
        setFormState((prev) => ({ ...prev, coverImageUrl: compressed }));
      }
    }
  };

  const handleCouplePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const inspection = await inspectImageFile(file, 'COUPLE_PORTRAIT');
      setCoupleInspection(inspection);
      const compressed = await compressAndResizeImage(file, 800, 800, 0.85);
      if (compressed) {
        setFormState((prev) => ({ ...prev, couplePhotoUrl: compressed }));
      }
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('Audio file size must be less than 20MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const audioUrl = event.target?.result as string;
        if (audioUrl) {
          setFormState((prev) => ({ ...prev, backgroundAudioUrl: audioUrl }));
          if (typeof window !== 'undefined' && eventSlug) {
            localStorage.setItem(`agafari_bg_audio_${eventSlug}`, audioUrl);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleAddProgram = () => {
    const newItem: ProgramItem = {
      id: 'p_' + Date.now(),
      time: '06:00 PM',
      title: 'New Program Event',
      location: formState.venueName || 'Main Hall',
      description: 'Event description...'
    };
    setPrograms([...programs, newItem]);
  };

  const handleUpdateProgram = (id: string, field: keyof ProgramItem, value: string) => {
    setPrograms(programs.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter((p) => p.id !== id));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const toggleShowPassword = (key: string) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Derive Clean Agency Name from organizerSlug parameter
  const formattedAgencyName = organizerSlug
    .replace(/^org-/, '')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full mx-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto text-amber-600">
            <Crown className="w-8 h-8 animate-bounce text-amber-600" />
          </div>
          <p className="text-base font-bold text-slate-800 tracking-tight">{t('commandHub.loading')}</p>
          <p className="text-xs text-slate-400">Syncing role credentials & event controls</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="p-8 max-w-lg w-full rounded-3xl bg-slate-900 border border-rose-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-rose-400" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/40">
              ⛔ ACCESS DENIED: PRIVATE TENANT
            </span>
            <h2 className="font-serif font-bold text-2xl text-white pt-2">
              Isolated Agency Workspace
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              You do not have authorization to view or manage another event organizer's wedding workspace. For security and multi-tenant isolation, please return to your dedicated organizer dashboard.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href={`/login?redirect=${encodeURIComponent('/organizer/dashboard')}`}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span>Return to My Agency Dashboard →</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isApproved = event?.adminApprovalStatus === 'APPROVED' || (event as any)?.admin_approval_status === 'APPROVED';

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="p-8 max-w-lg w-full rounded-3xl bg-slate-900 border border-amber-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/40">
              🟡 {t('commandHub.pendingAdmin')}
            </span>
            <h2 className="font-serif font-bold text-2xl text-white pt-2">
              Wedding Request Awaiting Approval
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              The wedding request for <strong>{event?.brideName || 'Bride'} & {event?.groomName || 'Groom'}</strong> has been submitted to the System Super Admin.
              Page creation, couple credentials, and event controls will activate automatically once approved by the System Super Admin under Admin Approvals.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href={`/login?redirect=${encodeURIComponent(`/organizer/dashboard?id=${organizerSlug}`)}`}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('couplePortal.returnToDashboard')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const brideName = formState.brideName || 'Bride';
  const groomName = formState.groomName || 'Groom';
  const coupleEmail = event?.credentials?.couple?.email || event?.coupleCredentials?.email || `couple@${eventSlug}.com`;
  const couplePass = event?.credentials?.couple?.temporaryPassword || event?.coupleCredentials?.temporaryPassword || 'agafari2026';

  const streamerEmail = event?.credentials?.streamer?.email || `streamer@${eventSlug}.com`;
  const streamerPass = event?.credentials?.streamer?.temporaryPassword || 'stream123';

  const scannerEmail = event?.credentials?.scanner?.email || `scanner@${eventSlug}.com`;
  const scannerPass = event?.credentials?.scanner?.temporaryPassword || 'scan123';

  const moderatorEmail = event?.credentials?.moderator?.email || `moderator@${eventSlug}.com`;
  const moderatorPass = event?.credentials?.moderator?.temporaryPassword || 'mod123';

  return (
    <DashboardSecurityGate
      dashboardTitle={formState.title || `${formattedAgencyName} Agency — Event Control`}
      dashboardId={`organizer:${organizerSlug}:${eventSlug}`}
      dashboardType="organizer"
      slug={eventSlug}
      organizerSlug={organizerSlug}
      defaultEmail={event?.credentials?.organizer?.email || organizerSlug}
    >
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Mobile App Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all border border-slate-200/80 active:scale-95"
            title="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase tracking-wider text-[10px] border border-amber-200/60">
                {formattedAgencyName} Agency
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-mono text-[11px]">/{eventSlug}</span>
            </div>
            <h1 className="font-bold text-base sm:text-lg text-slate-900 mt-0.5 tracking-tight flex items-center gap-2">
              <span>{formState.title}</span>
              {event?.isLive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold border border-red-200 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  LIVE BROADCAST
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main App Workspace */}
      <main className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6 flex-1">
        
        {event?.adminApprovalStatus === 'PENDING' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 animate-pulse shrink-0" />
              <span>⏳ Licensing Approval Pending: This wedding request is awaiting System Admin review. Public pages & credentials will be activated upon approval.</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-bold text-[10px] shrink-0 uppercase tracking-wider">Pending Admin</span>
          </div>
        )}

        {event?.adminApprovalStatus === 'REJECTED' && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>🔴 Request Rejected: This wedding request was rejected by the System Admin and is not active on Agafari.</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-200 text-rose-950 font-bold text-[10px] shrink-0 uppercase tracking-wider">Rejected</span>
          </div>
        )}
        
        {/* Mobile App Segmented Control Tabs */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap sm:flex-nowrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('ROLES')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'ROLES'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>4-Role Portals</span>
          </button>

          <button
            onClick={() => setActiveTab('DETAILS')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'DETAILS'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Edit Wedding Details</span>
          </button>

          <button
            onClick={() => setActiveTab('RSVPS')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'RSVPS'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Guest RSVPs ({guests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MEDIA')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'MEDIA'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <span>Content Moderation ({mediaAssets.length})</span>
          </button>
        </div>

        {/* TAB 1: 4-ROLE EVENT COMMAND CENTER */}
        {activeTab === 'ROLES' && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/10 text-slate-950 font-bold text-[11px]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Role Access Hub</span>
                </div>
                <h2 className="font-bold text-xl sm:text-2xl tracking-tight text-slate-950">
                  User Roles & Credentials for {brideName} & {groomName}
                </h2>
                <p className="text-xs text-slate-900/80 max-w-xl font-medium">
                  Provision logins and instant access for Bride & Groom, Broadcast Crew, Gate Scanner Staff, and Content Moderator for this specific wedding.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/40">
                <Smartphone className="w-8 h-8 text-slate-950" />
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-900 uppercase">App Status</div>
                  <div className="text-xs font-black text-slate-950">4 Roles Active</div>
                </div>
              </div>
            </div>

            {/* 4 Role App Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Role 1: Bride & Groom */}
              <motion.div
                whileHover={{ y: -2 }}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                      <span>Bride & Groom Role</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Active Account
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mt-3">
                    {brideName} & {groomName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Full access to couple dashboard, guest list management, seating charts, and mezmur playlist controls.
                  </p>

                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px] font-sans font-semibold">Portal Login Email:</span>
                      <span className="font-bold text-slate-900">{coupleEmail}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px] font-sans font-semibold">Temporary Password:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {showPasswords['couple'] ? couplePass : '••••••••'}
                        </span>
                        <button onClick={() => toggleShowPassword('couple')} className="text-slate-400 hover:text-slate-700 p-1">
                          {showPasswords['couple'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`/${organizerSlug}/${eventSlug}/couple`)}`}
                    className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <span>Launch Couple Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleCopy(`Email: ${coupleEmail}\nPassword: ${couplePass}`, 'couple')}
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 active:scale-95"
                  >
                    {copiedKey === 'couple' ? 'Copied ✓' : 'Copy Credentials'}
                  </button>
                </div>
              </motion.div>

              {/* Role 2: Live Streamer Crew */}
              <motion.div
                whileHover={{ y: -2 }}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-bold border border-red-200 flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-red-600" />
                      <span>Live Streamer Crew</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Active Account
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mt-3">
                    Live Broadcast Camera Crew
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Direct YouTube broadcast integration studio for live streaming the celebration to guests worldwide.
                  </p>

                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px] font-sans font-semibold">Portal Login Email:</span>
                      <span className="font-bold text-slate-900">{streamerEmail}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px] font-sans font-semibold">Temporary Password:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {showPasswords['streamer'] ? streamerPass : '••••••••'}
                        </span>
                        <button onClick={() => toggleShowPassword('streamer')} className="text-slate-400 hover:text-slate-700 p-1">
                          {showPasswords['streamer'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`/${organizerSlug}/${eventSlug}/live-streamer`)}`}
                    className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <span>Launch Streamer Studio</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleCopy(`Streamer Studio: ${window.location.origin}/${organizerSlug}/${eventSlug}/live-streamer\nEmail: ${streamerEmail}\nPassword: ${streamerPass}`, 'streamer')}
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 active:scale-95"
                  >
                    {copiedKey === 'streamer' ? 'Copied ✓' : 'Copy Credentials'}
                  </button>
                </div>
              </motion.div>

              {/* Role 3: Gate Security Scanner */}
              <motion.div
                whileHover={{ y: -2 }}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 flex items-center gap-1.5">
                      <ScanLine className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Gate Security Scanner</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Active Account
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mt-3">
                    Door Registration Staff
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Camera QR barcode scanner app for fast guest verification and digital ticket validation at the entrance.
                  </p>

                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px] font-sans font-semibold">Portal Login Email:</span>
                      <span className="font-bold text-slate-900">{scannerEmail}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px] font-sans font-semibold">Temporary Password:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {showPasswords['scanner'] ? scannerPass : '••••••••'}
                        </span>
                        <button onClick={() => toggleShowPassword('scanner')} className="text-slate-400 hover:text-slate-700 p-1">
                          {showPasswords['scanner'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`/${organizerSlug}/${eventSlug}/scanner`)}`}
                    className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <span>Launch Scanner App</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleCopy(`Gate Scanner: ${window.location.origin}/${organizerSlug}/${eventSlug}/scanner\nEmail: ${scannerEmail}\nPassword: ${scannerPass}`, 'scanner')}
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 active:scale-95"
                  >
                    {copiedKey === 'scanner' ? 'Copied ✓' : 'Copy Credentials'}
                  </button>
                </div>
              </motion.div>

              {/* Role 4: Content Moderator */}
              <motion.div
                whileHover={{ y: -2 }}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[11px] font-bold border border-purple-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>Content Moderator</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Active Account
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mt-3">
                    Media Approval Officer
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Review and approve guest-uploaded photo and video wishes before public display on the wedding wall feed.
                  </p>

                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px] font-sans font-semibold">Portal Login Email:</span>
                      <span className="font-bold text-slate-900">{moderatorEmail}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px] font-sans font-semibold">Temporary Password:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {showPasswords['moderator'] ? moderatorPass : '••••••••'}
                        </span>
                        <button onClick={() => toggleShowPassword('moderator')} className="text-slate-400 hover:text-slate-700 p-1">
                          {showPasswords['moderator'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`/${organizerSlug}/${eventSlug}/moderation`)}`}
                    className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <span>Launch Moderation Hub</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleCopy(`Moderation Hub: ${window.location.origin}/${organizerSlug}/${eventSlug}/moderation\nEmail: ${moderatorEmail}\nPassword: ${moderatorPass}`, 'moderator')}
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 active:scale-95"
                  >
                    {copiedKey === 'moderator' ? 'Copied ✓' : 'Copy Credentials'}
                  </button>
                </div>
              </motion.div>

            </div>
          </div>
        )}

        {/* TAB 2: EDIT WEDDING DETAILS (FULL CUSTOMIZATION SUITE) */}
        {activeTab === 'DETAILS' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-bold text-xl text-slate-900 flex items-center gap-2 tracking-tight">
                  <Settings className="w-5 h-5 text-amber-500" />
                  Wedding Customization Engine ({brideName} & {groomName})
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter and update every distinct detail that sets this wedding apart. Saved changes instantly update the guest invitation page.
                </p>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 shrink-0">
                <span className="text-rose-600 font-black text-sm">*</span>
                <span>Essential Fields Required</span>
              </div>
            </div>

            {saveMsg && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                saveMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                {saveMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
                <span>{saveMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveEventDetails} className="space-y-6 text-xs">
              
              {/* SECTION 1: COUPLE PROFILES */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    1. Couple Profiles
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Fields marked with <strong className="text-rose-500">*</strong> are required</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Bride Name <span className="text-rose-500 font-black">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.brideName}
                      onChange={(e) => setFormState({ ...formState, brideName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-amber-500/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Groom Name <span className="text-rose-500 font-black">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.groomName}
                      onChange={(e) => setFormState({ ...formState, groomName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-amber-500/50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DATE, TIME & VENUE LOCATION */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    2. Date, Time & Primary Venue Information
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Wedding Date <span className="text-rose-500 font-black">*</span>
                    </label>
                    <input
                      type="date"
                      value={formState.eventDate}
                      onChange={(e) => setFormState({ ...formState, eventDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-amber-500/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Start Time <span className="text-rose-500 font-black">*</span>
                    </label>
                    <input
                      type="time"
                      value={formState.startTime}
                      onChange={(e) => setFormState({ ...formState, startTime: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-amber-500/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Primary Venue Name <span className="text-rose-500 font-black">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.venueName}
                      onChange={(e) => setFormState({ ...formState, venueName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-amber-500/50"
                      placeholder="e.g. Sheraton Addis Luxury Ballroom"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Google Maps Navigation Link</label>
                    <input
                      type="url"
                      value={formState.venueMapUrl}
                      onChange={(e) => setFormState({ ...formState, venueMapUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-mono focus:ring-2 focus:ring-amber-500/50"
                      placeholder="https://maps.google.com/?q=Sheraton+Addis"
                    />
                  </div>
                </div>

                {/* Additional Locations Manager */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-indigo-500" />
                        <span>Additional Wedding Locations ({additionalLocations.length})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">Add church ceremonies, reception halls, or Melse venues with descriptions.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLocation}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 hover:bg-amber-600 transition-all shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Additional Location</span>
                    </button>
                  </div>

                  {additionalLocations.length === 0 ? (
                    <div className="p-3.5 rounded-xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No additional locations added yet. Click "+ Add Additional Location" to add secondary event venues.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {additionalLocations.map((loc, idx) => (
                        <div key={loc.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-indigo-600">Location #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteLocation(loc.id)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                              title="Delete Location"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-600 font-bold text-[11px] mb-1">Venue Title / Name</label>
                              <input
                                type="text"
                                placeholder="e.g. St. Trinity Cathedral Ceremony"
                                value={loc.label}
                                onChange={(e) => handleUpdateLocation(loc.id, 'label', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-medium text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-600 font-bold text-[11px] mb-1">Google Maps Link (Optional)</label>
                              <input
                                type="url"
                                placeholder="https://maps.google.com/?q=..."
                                value={loc.mapUrl || ''}
                                onChange={(e) => handleUpdateLocation(loc.id, 'mapUrl', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-mono text-xs"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-slate-600 font-bold text-[11px] mb-1">Time & Venue Description</label>
                              <textarea
                                rows={2}
                                placeholder="e.g. Church wedding ceremony & prayer blessing starting at 10:00 AM"
                                value={loc.description}
                                onChange={(e) => handleUpdateLocation(loc.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: HERO COVER & COUPLE PHOTO UPLOAD FROM DEVICE */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Camera className="w-4 h-4 text-indigo-500" />
                  3. Direct Hero Cover & Couple Photo Upload
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Hero Cover Image Uploader */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                    <label className="block text-slate-800 font-bold text-xs flex items-center justify-between">
                      <span>Hero Cover Background Photo</span>
                      <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Device Upload</span>
                    </label>

                    {/* Specification Notice */}
                    <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-[11px] leading-tight space-y-0.5">
                      <span className="font-bold block text-indigo-950">📐 Recommended Size:</span>
                      <span>1920 × 1080 px (16:9 Landscape) • Max 10MB</span>
                    </div>

                    <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/30 transition-all cursor-pointer group text-center">
                      <Camera className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-xs font-bold text-slate-800">
                        {formState.coverImageUrl ? "Change Cover Photo" : "Upload Cover Photo from Device"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {formState.coverImageUrl ? "Click to choose a new cover photo" : "Click to choose image file from computer/phone"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Inspection Result Status */}
                    {coverInspection && (
                      coverInspection.isOptimal ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-emerald-950">{coverInspection.statusBadgeText}</span>
                            <p className="text-[11px] text-emerald-800 mt-0.5">Dimensions and aspect ratio match platform standards perfectly!</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 shadow-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-bold block text-amber-950">{coverInspection.statusBadgeText}</span>
                            <p className="text-[11px] leading-relaxed text-amber-800 font-medium">{coverInspection.warningMessage}</p>
                            <p className="text-[10px] text-amber-700 font-medium bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200/80 inline-block">
                              Note: Upload will still proceed successfully, but image may crop or stretch slightly on wide screens.
                            </p>
                          </div>
                        </div>
                      )
                    )}

                    {formState.coverImageUrl && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                        <img
                          src={formState.coverImageUrl}
                          alt="Cover Preview"
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200';
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[11px] font-bold bg-black/60 px-3 py-1 rounded-full">Device Image Selected ✓</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Couple Portrait Photo Uploader */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                    <label className="block text-slate-800 font-bold text-xs flex items-center justify-between">
                      <span>Couple Portrait Photo</span>
                      <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Device Upload</span>
                    </label>

                    {/* Specification Notice */}
                    <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-[11px] leading-tight space-y-0.5">
                      <span className="font-bold block text-indigo-950">📐 Recommended Size:</span>
                      <span>800 × 800 px (1:1) or 800 × 1000 px (4:5) • Max 5MB</span>
                    </div>

                    <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/30 transition-all cursor-pointer group text-center">
                      <Camera className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-xs font-bold text-slate-800">
                        {formState.couplePhotoUrl ? "Change Portrait Photo" : "Upload Portrait from Device"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {formState.couplePhotoUrl ? "Click to choose a new portrait photo" : "Click to choose image file from computer/phone"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCouplePhotoFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Inspection Result Status */}
                    {coupleInspection && (
                      coupleInspection.isOptimal ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-emerald-950">{coupleInspection.statusBadgeText}</span>
                            <p className="text-[11px] text-emerald-800 mt-0.5">Dimensions and aspect ratio match platform standards perfectly!</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 shadow-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-bold block text-amber-950">{coupleInspection.statusBadgeText}</span>
                            <p className="text-[11px] leading-relaxed text-amber-800 font-medium">{coupleInspection.warningMessage}</p>
                            <p className="text-[10px] text-amber-700 font-medium bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200/80 inline-block">
                              Note: Upload will still proceed successfully, but image may crop or stretch slightly on some screen sizes.
                            </p>
                          </div>
                        </div>
                      )
                    )}

                    {formState.couplePhotoUrl && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                        <img
                          src={formState.couplePhotoUrl}
                          alt="Portrait Preview"
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800';
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[11px] font-bold bg-black/60 px-3 py-1 rounded-full">Device Image Selected ✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: COUPLE LOVE STORY & HISTORIES */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    4. Couple Love Story & History Cards ({storyCards.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddStoryCard}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add New Story Card</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-xs uppercase tracking-wider">Main Story Headline / Title</label>
                    <input
                      type="text"
                      value={formState.loveStoryHeadline}
                      onChange={(e) => setFormState({ ...formState, loveStoryHeadline: e.target.value })}
                      placeholder="e.g. Our Journey to Forever"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  {/* Dynamic Story Cards List */}
                  <div className="space-y-4 pt-2">
                    {storyCards.map((card, idx) => (
                      <div key={card.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative group">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-xs text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                            Story Card #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteStoryCard(card.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Card</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-600 font-bold mb-1">Badge / Tag</label>
                            <input
                              type="text"
                              value={card.badge}
                              onChange={(e) => handleUpdateStoryCard(card.id, 'badge', e.target.value)}
                              placeholder="e.g. THE BEGINNING"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-600 font-bold mb-1">Card Title</label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => handleUpdateStoryCard(card.id, 'title', e.target.value)}
                              placeholder="e.g. A Chance Encounter & First Meeting"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-600 font-bold mb-1">Date / Year</label>
                            <input
                              type="text"
                              value={card.date}
                              onChange={(e) => handleUpdateStoryCard(card.id, 'date', e.target.value)}
                              placeholder="e.g. 2024 or 2024-05-12"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="sm:col-span-2">
                            <label className="block text-slate-600 font-bold mb-1">Subtitle / Tagline</label>
                            <input
                              type="text"
                              value={card.subtitle}
                              onChange={(e) => handleUpdateStoryCard(card.id, 'subtitle', e.target.value)}
                              placeholder="e.g. THE BEGINNING OF US"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-600 font-bold mb-1">Card Photo Image</label>
                            <div className="text-[10px] text-purple-700 bg-purple-50/80 px-2 py-0.5 rounded border border-purple-200 mb-1.5 font-medium">
                              📐 Specs: 800 × 600 px (4:3) • Max 5MB
                            </div>
                            <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-100/50 text-purple-700 font-bold text-xs cursor-pointer transition-all">
                              <Camera className="w-4 h-4" />
                              <span>{card.image ? 'Change Cover Photo' : 'Upload Image'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleCardImageUpload(card.id, file);
                                }}
                                className="hidden"
                              />
                            </label>
                            {storyInspections[card.id] && (
                              storyInspections[card.id].isOptimal ? (
                                <p className="text-[10px] text-emerald-700 font-bold mt-1">
                                  {storyInspections[card.id].statusBadgeText}
                                </p>
                              ) : (
                                <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-[10px] mt-1 space-y-0.5">
                                  <span className="font-bold block">{storyInspections[card.id].statusBadgeText}</span>
                                  <p className="text-amber-800">{storyInspections[card.id].warningMessage}</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-bold mb-1 text-xs">Card Story Description</label>
                          <textarea
                            rows={2}
                            value={card.description}
                            onChange={(e) => handleUpdateStoryCard(card.id, 'description', e.target.value)}
                            placeholder="Write story chapter details here..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-xs"
                          />
                        </div>

                        {card.image && (
                          <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32 bg-slate-100">
                            <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 5: EVENT PROGRAM SCHEDULE EDITOR */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    5. Event Schedule & Programs ({programs.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddProgram}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1 hover:bg-slate-800 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Program Event</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {programs.map((item, idx) => (
                    <div key={item.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-amber-700">Event #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteProgram(item.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Time (e.g. 10:00 AM)"
                          value={item.time}
                          onChange={(e) => handleUpdateProgram(item.id, 'time', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-mono text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Event Title"
                          value={item.title}
                          onChange={(e) => handleUpdateProgram(item.id, 'title', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-bold text-xs sm:col-span-2"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Location / Venue"
                          value={item.location}
                          onChange={(e) => handleUpdateProgram(item.id, 'location', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Short Description"
                          value={item.description}
                          onChange={(e) => handleUpdateProgram(item.id, 'description', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: DRESS CODE & WELCOME MESSAGE */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Tv className="w-4 h-4 text-amber-500" />
                  6. Dress Code & Welcome Message
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Dress Code Protocol</label>
                    <input
                      type="text"
                      value={formState.dressCode}
                      onChange={(e) => setFormState({ ...formState, dressCode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Welcome Message to Guests</label>
                    <textarea
                      rows={3}
                      value={formState.welcomeMessage}
                      onChange={(e) => setFormState({ ...formState, welcomeMessage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 7: COMING SOON BACKGROUND AUDIO & ENTRANCE MEZMUR */}
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-amber-600" />
                    <span>7. Coming Soon Background Audio & Entrance Mezmur</span>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900">
                    Plays on Public Celebration Page
                  </span>
                </h3>

                <p className="text-xs text-slate-600">
                  Upload an audio file (.mp3, .wav, .m4a) from your device or paste a direct web audio link. This audio will be automatically played when guests visit the Coming Soon celebration page.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Option A: Upload Audio File */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      Option A: Upload Audio File (.mp3, .wav, .m4a)
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileUpload}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400">Supported formats: MP3, WAV, AAC, M4A (Max 20MB)</p>
                  </div>

                  {/* Option B: Direct Audio URL */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-amber-500" />
                      Option B: Direct Audio URL / Web Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/mezmur.mp3"
                      value={formState.backgroundAudioUrl}
                      onChange={(e) => setFormState({ ...formState, backgroundAudioUrl: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500/50"
                    />
                    <p className="text-[11px] text-slate-400">Paste direct link to any hosted mp3 file</p>
                  </div>
                </div>

                {/* Audio Preview Player */}
                {formState.backgroundAudioUrl && (
                  <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-slate-800">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-amber-400">Active Background Audio Track</div>
                        <div className="text-[11px] text-slate-300 truncate max-w-xs">
                          {formState.backgroundAudioUrl.startsWith('data:') ? 'Custom Uploaded Device Audio File' : formState.backgroundAudioUrl}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <audio controls src={formState.backgroundAudioUrl} className="h-9 max-w-[240px]" />
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, backgroundAudioUrl: '' })}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-all"
                        title="Remove Audio"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 8: BRANDED INVITATION CARD DESIGN & STYLING CONTROLS */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white border border-amber-500/40 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-amber-400 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-400" />
                      8. Branded Wedding Invitation Card Design & Customization Engine
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Choose between 2 invitation templates, upload the couple's photo, set wedding time & location, and customize wording.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCardModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Live Preview & Test Card (.PNG)</span>
                  </button>
                </div>

                {/* STEP 1: CHOOSE CARD DESIGN TEMPLATE */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    1. Choose Invitation Card Design Template (2 Premium Types)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Template 1 */}
                    <div
                      onClick={() => setFormState({ ...formState, cardTemplate: 'CLASSIC_HORIZONTAL' })}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        formState.cardTemplate === 'CLASSIC_HORIZONTAL'
                          ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50 shadow-md'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">Template 1: Royal Horizontal Pass</span>
                          {formState.cardTemplate === 'CLASSIC_HORIZONTAL' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">SELECTED</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Landscape 3:2 layout featuring dual QR gate pass seal, foil border accents, event details column, and photo header.
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Aspect Ratio: 3:2 (Landscape)</span>
                        <span className="text-amber-400 font-bold">Classic Luxury</span>
                      </div>
                    </div>

                    {/* Template 2 */}
                    <div
                      onClick={() => setFormState({ ...formState, cardTemplate: 'ELEGANT_VERTICAL' })}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        formState.cardTemplate === 'ELEGANT_VERTICAL'
                          ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50 shadow-md'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">Template 2: Romantic Floral Portrait</span>
                          {formState.cardTemplate === 'ELEGANT_VERTICAL' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">SELECTED</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Vertical 2:3 portrait design with champagne parchment background, golden rose filigree, arch-framed couple portrait, script typography, date/time row, and QR pass stamp.
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Aspect Ratio: 2:3 (Portrait)</span>
                        <span className="text-amber-400 font-bold">Romantic Floral</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 2: COUPLE PHOTO UPLOAD */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-400" />
                    2. Upload Official Couple Photo for Invitation Card
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="sm:col-span-2 space-y-2">
                      <p className="text-[11px] text-slate-400">
                        Upload a high-resolution photo of the couple. This photo will be featured inside the invitation card frame.
                      </p>
                      <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs cursor-pointer transition-all">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>{formState.couplePhotoUrl ? 'Change Couple Photo Image' : 'Choose Image File from Device'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                const base64 = evt.target?.result as string;
                                if (base64) setFormState({ ...formState, couplePhotoUrl: base64 });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {formState.couplePhotoUrl && (
                      <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-amber-400/70 shadow-lg mx-auto sm:mx-0">
                        <img src={formState.couplePhotoUrl} alt="Couple Photo Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-amber-300 text-[9px] text-center font-bold py-0.5">
                          Card Photo Preview
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* STEP 3: WEDDING ESSENTIALS & LOCATION INPUTS */}
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    3. Wedding Details, Starting Time & Venue Location
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Bride's Name</label>
                      <input
                        type="text"
                        value={formState.brideName}
                        onChange={(e) => setFormState({ ...formState, brideName: e.target.value })}
                        placeholder="e.g. Nayla"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-medium focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Groom's Name</label>
                      <input
                        type="text"
                        value={formState.groomName}
                        onChange={(e) => setFormState({ ...formState, groomName: e.target.value })}
                        placeholder="e.g. Deny"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-medium focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Wedding Date</label>
                      <input
                        type="date"
                        value={formState.eventDate}
                        onChange={(e) => setFormState({ ...formState, eventDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-medium focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Wedding Starting Time</label>
                      <input
                        type="text"
                        value={formState.startTime}
                        onChange={(e) => setFormState({ ...formState, startTime: e.target.value })}
                        placeholder="e.g. 10:00 AM or 14:00"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-medium focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Primary Venue / Location Name</label>
                      <input
                        type="text"
                        value={formState.venueName}
                        onChange={(e) => setFormState({ ...formState, venueName: e.target.value })}
                        placeholder="e.g. Sheraton Addis Luxury Ballroom"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-medium focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Venue Address & City</label>
                      <input
                        type="text"
                        value={formState.venueAddress}
                        onChange={(e) => setFormState({ ...formState, venueAddress: e.target.value })}
                        placeholder="e.g. Taitu Street, Addis Ababa, Ethiopia"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-medium focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 4: PALETTE & FORMAL WORDING */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
                  {/* Card Theme Palette Picker */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Card Theme Palette & Foil Accents
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'ROYAL_GOLD', label: 'Royal Velvet & Gold', color: 'bg-stone-900 border-amber-500 text-amber-300' },
                        { id: 'CHAMPAGNE_IVORY', label: 'Champagne Ivory & Gold', color: 'bg-amber-50 border-amber-600 text-amber-900' },
                        { id: 'ROSE_GOLD', label: 'Rose Gold & Blush', color: 'bg-rose-950 border-rose-400 text-rose-200' },
                        { id: 'EMERALD_GOLD', label: 'Emerald Luxury & Gold', color: 'bg-emerald-950 border-emerald-400 text-emerald-200' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormState({ ...formState, cardTheme: t.id as any })}
                          className={`p-3 rounded-xl border-2 text-left font-bold transition-all cursor-pointer ${t.color} ${
                            formState.cardTheme === t.id ? 'ring-2 ring-amber-400 scale-[1.02] shadow-md' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px]">{t.label}</span>
                            {formState.cardTheme === t.id && <Check className="w-4 h-4 shrink-0" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Invitation Subtitle Wording */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Custom Formal Invitation Statement Wording
                    </label>
                    <textarea
                      rows={4}
                      value={formState.customWording}
                      onChange={(e) => setFormState({ ...formState, customWording: e.target.value })}
                      placeholder="e.g. Together with their families request the pleasure of your company at their wedding celebration"
                      className="w-full px-4 py-3 rounded-xl border border-amber-500/40 bg-black text-white text-xs font-serif leading-relaxed focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>


              {/* SAVE BUTTON */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-10 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 hover:brightness-110 flex items-center gap-2.5 transition-all active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Saving Customizations...' : 'Save All Wedding Customizations'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: GUEST RSVPS */}
        {activeTab === 'RSVPS' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-xl text-slate-900 tracking-tight">
                  Guest RSVP Management ({brideName} & {groomName})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track RSVPs, table assignments, and guest attendance status ({guests.length} total)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                {guests.filter(g => g.status === 'ATTENDING').length} Attending
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Guest Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Invite Code</th>
                    <th className="py-3.5 px-4">RSVP Status</th>
                    <th className="py-3.5 px-4">Table</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {guests.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span>{g.name}</span>
                        {g.vip && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-extrabold">VIP</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{g.email}</td>
                      <td className="py-3.5 px-4 font-mono text-amber-700 font-bold">{g.code}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          g.status === 'ATTENDING'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : g.status === 'DECLINED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {g.status === 'ATTENDING' ? '✓ Attending' : g.status === 'DECLINED' ? '✕ Declined' : '⏳ Pending RSVP'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{g.table}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CONTENT MODERATION */}
        {activeTab === 'MEDIA' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div>
              <h2 className="font-bold text-xl text-slate-900 tracking-tight">
                Guest Uploaded Photos & Video Moderation
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Moderate photos and wish videos submitted by guests before showing on live feed.
              </p>
            </div>

            {mediaAssets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-serif text-sm bg-slate-50 rounded-2xl border border-slate-200">
                No photos or wish videos submitted by guests yet for this wedding.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {mediaAssets.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 shadow-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-full h-44 bg-slate-900 rounded-xl overflow-hidden border border-slate-200 relative">
                        {m.type === 'VIDEO' || m.cdnUrl?.includes('.mp4') ? (
                          <video src={m.cdnUrl} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={m.cdnUrl} alt={m.uploaderName} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-900 font-bold">{m.uploaderName}</div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          m.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : m.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {m.status === 'APPROVED' ? '✓ APPROVED' : m.status === 'REJECTED' ? '✗ REJECTED' : '⏳ PENDING'}
                        </span>
                      </div>
                      {m.caption && (
                        <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">"{m.caption}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleUpdateMediaStatus(m.id, 'APPROVED')}
                        className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                          m.status === 'APPROVED'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateMediaStatus(m.id, 'REJECTED')}
                        className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                          m.status === 'REJECTED'
                            ? 'bg-rose-600 text-white'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-600 hover:text-white'
                        }`}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleDeleteMediaAsset(m.id)}
                        className="p-1.5 rounded-lg bg-slate-200 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-all border border-slate-300"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      {/* Live Branded Invitation Card Pass Preview Modal */}
      <InvitationCardModal
        isOpen={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        invitation={{
          guestName: 'Abebe Bikila & Family',
          inviteCode: 'G5qHaAkPNs7g',
          maxGuests: 4,
          tableNumber: '4',
          rsvpStatus: 'ATTENDING',
        }}
        event={{
          title: `${formState.brideName || 'Bride'} & ${formState.groomName || 'Groom'}`,
          brideName: formState.brideName,
          groomName: formState.groomName,
          eventDate: formState.eventDate,
          startTime: formState.startTime,
          venueName: formState.venueName,
          venueAddress: formState.venueAddress,
          dressCode: formState.dressCode,
          coverImageUrl: formState.coverImageUrl,
          couplePhotoUrl: formState.couplePhotoUrl || formState.coverImageUrl,
          cardTheme: formState.cardTheme,
          cardTemplate: formState.cardTemplate,
          customWording: formState.customWording,
          slug: eventSlug,
        }}
      />
      </main>
    </div>
    </DashboardSecurityGate>
  );
}
