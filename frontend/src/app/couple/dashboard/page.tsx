'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardSecurityGate from '@/components/DashboardSecurityGate';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  QrCode,
  Film,
  Download,
  Copy,
  Check,
  Plus,
  Search,
  Share2,
  LogOut,
  Eye,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Crown,
  Menu,
  X,
  Video,
  Image as ImageIcon,
  Music,
  Radio,
  Volume2,
  Lock
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

import InvitationCardModal from '@/components/InvitationCardModal';

interface EventData {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  startTime?: string;
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  dressCode?: string;
  welcomeMessage?: string;
  coverImageUrl?: string;
  couplePhotoUrl?: string;
  status: string;
}

interface MediaAssetData {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  category?: 'BTS' | 'WISHES' | 'LIVE' | 'MEZMUR';
  cdnUrl: string;
  thumbnailUrl?: string;
  caption: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface InvitationRecord {
  id: string;
  inviteCode: string;
  guestName: string;
  guestPhone: string;
  maxGuests: number;
  inviteType: 'CARD' | 'LINK';
  rsvpStatus: 'ATTENDING' | 'DECLINED' | 'PENDING';
  attendingHeadcount?: number;
  scannedCount: number;
  isScanned: boolean;
  qrCodeUrl?: string;
  createdAt?: string;
}

function CoupleDashboardContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>([]);
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Permitted total quota allocated by Organizer/Admin
  const [permittedTotalQuota, setPermittedTotalQuota] = useState(150);

  // Active Navigation Tab: 'SETUP' | 'GUESTS' | 'MEDIA'
  const [activeTab, setActiveTab] = useState<'SETUP' | 'GUESTS' | 'MEDIA'>('GUESTS');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Background Audio State
  const [backgroundAudioUrl, setBackgroundAudioUrl] = useState('');
  const [savingAudio, setSavingAudio] = useState(false);
  const [audioSuccessMsg, setAudioSuccessMsg] = useState('');

  // Cover Image & Couple Photo Upload State (Fix for image upload disappearing on save)
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [savingCoverImage, setSavingCoverImage] = useState(false);
  const [coverSuccessMsg, setCoverSuccessMsg] = useState('');

  // Card Design Template & Theme Palette State
  const [cardTemplate, setCardTemplate] = useState<'CLASSIC_HORIZONTAL' | 'ELEGANT_VERTICAL'>('ELEGANT_VERTICAL');
  const [cardTheme, setCardTheme] = useState<'ROYAL_GOLD' | 'CHAMPAGNE_IVORY' | 'ROSE_GOLD' | 'EMERALD_GOLD'>('CHAMPAGNE_IVORY');
  const [cardModalOpen, setCardModalOpen] = useState(false);

  // Guest RSVP Filter Tab ('ALL' | 'ATTENDING' | 'DECLINED' | 'PENDING')
  const [guestFilterTab, setGuestFilterTab] = useState<'ALL' | 'ATTENDING' | 'DECLINED' | 'PENDING'>('ALL');

  // Music & Mezmur Recommendations submitted by guests
  const [musicRecommendations, setMusicRecommendations] = useState<{ id: string; guestName: string; title: string; artist: string; category?: string }[]>([
    { id: 'rec-1', guestName: 'Abebe Bikila', title: 'Egziabhair Semayen', artist: 'Singer Solomon', category: 'MEZMUR' },
    { id: 'rec-2', guestName: 'Tigist Haile', title: 'Yene Geta', artist: 'Grace Choir', category: 'MEZMUR' },
  ]);

  // Guest Submission Form State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestHeadcount, setGuestHeadcount] = useState(2);
  const [inviteType, setInviteType] = useState<'CARD' | 'LINK'>('CARD');
  const [submittingGuest, setSubmittingGuest] = useState(false);
  const [guestSuccessMsg, setGuestSuccessMsg] = useState('');
  const [guestErrorMsg, setGuestErrorMsg] = useState('');

  // Media Section Filters ('ALL' | 'BTS' | 'GATHERED')
  const [mediaSubTab, setMediaSubTab] = useState<'ALL' | 'BTS' | 'GATHERED'>('ALL');

  // Interactive Modal State for QR Pass & Card Download
  const [selectedInviteForPass, setSelectedInviteForPass] = useState<InvitationRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('agafari_user');
      const token = localStorage.getItem('agafari_token');
      const role = localStorage.getItem('agafari_role');
      if (!userStr || !token || (role !== 'BRIDE_GROOM' && role !== 'EVENT_ORGANIZER' && role !== 'SYSTEM_ADMIN')) {
        localStorage.removeItem('agafari_user');
        localStorage.removeItem('agafari_role');
        localStorage.removeItem('agafari_token');
        document.cookie = 'agafari_token=; path=/; max-age=0';
        router.push('/couple/login');
        return;
      }
    }
    async function loadCoupleDashboardData() {
      try {
        let coupleEventSlug: string | null = null;
        let orgId = 'org-default';

        // 1. Resolve explicit URL parameter (?slug=... or ?event=... or ?id=...)
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const querySlug = urlParams?.get('slug') || urlParams?.get('event') || urlParams?.get('id');

        // 2. Resolve logged-in couple user object from localStorage
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('agafari_user') : null;
        let userObj: any = null;
        if (userStr) {
          try {
            userObj = JSON.parse(userStr);
          } catch (e) { }
        }
        const userSlug = userObj?.eventSlug || userObj?.slug || userObj?.eventId || userObj?.event_slug || userObj?.event_id;
        const storedCoupleSlug = typeof window !== 'undefined' ? localStorage.getItem('agafari_couple_slug') : null;

        coupleEventSlug = querySlug || userSlug || storedCoupleSlug || null;

        // Strict Security: If no explicit wedding event slug is authorized for this user, do NOT load random data
        if (!coupleEventSlug) {
          setEvent(null);
          setLoading(false);
          return;
        }

        if (typeof window !== 'undefined' && coupleEventSlug) {
          localStorage.setItem('agafari_couple_slug', coupleEventSlug);
        }

        const reqHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('agafari_token');
          if (storedToken) reqHeaders['Authorization'] = `Bearer ${storedToken}`;
        }

        const [eventRes, mediaRes, invitesRes, quotaRes, musicRes] = await Promise.all([
          fetch(`/api/events/${coupleEventSlug}`, { headers: reqHeaders }),
          fetch(`/api/events/${coupleEventSlug}/media`, { headers: reqHeaders }),
          fetch(`/api/events/${coupleEventSlug}/invitations`, { headers: reqHeaders }),
          fetch(`/api/events/${coupleEventSlug}/quota`, { headers: reqHeaders }),
          fetch(`/api/events/${coupleEventSlug}/music`, { headers: reqHeaders }),
        ]);

        if (eventRes.ok) {
          const data = await eventRes.json();
          setEvent(data.event);
          if (data.event) {
            const cachedAudio = typeof window !== 'undefined' ? localStorage.getItem(`agafari_bg_audio_${coupleEventSlug}`) : null;
            const serverAudio = data.event.backgroundAudioUrl || data.event.background_audio_url || data.event.customization?.backgroundAudioUrl || '';
            setBackgroundAudioUrl(serverAudio || cachedAudio || '');
            const serverCover = data.event.coverImageUrl || data.event.couplePhotoUrl || data.event.customization?.coverImageUrl || '';
            setCoverImageUrl(serverCover || '');
            if (data.event.cardTemplate || data.event.card_template) {
              setCardTemplate(data.event.cardTemplate || data.event.card_template);
            }
            if (data.event.cardTheme || data.event.card_theme) {
              setCardTheme(data.event.cardTheme || data.event.card_theme);
            }
          }
        }

        if (invitesRes.ok) {
          const data = await invitesRes.json();
          setInvitations(data.invitations || []);
        }

        if (quotaRes.ok) {
          const data = await quotaRes.json();
          if (data.totalAllocatedQuota) {
            setPermittedTotalQuota(data.totalAllocatedQuota);
          }
        }

        const extractedMusic: { id: string; guestName: string; title: string; artist: string; category?: string }[] = [];

        if (musicRes.ok) {
          const mData = await musicRes.json();
          const recs = mData.recommendations || mData.items || [];
          recs.forEach((r: any) => {
            extractedMusic.push({
              id: r.id,
              guestName: r.guestName || r.guest_name || 'Honored Guest',
              title: r.title || 'Untitled Song',
              artist: r.artist || '',
              category: r.category || 'MEZMUR',
            });
          });
        }

        if (mediaRes.ok) {
          const data = await mediaRes.json();
          const rawItems = data.mediaAssets || data.items || [];
          const galleryItems: any[] = [];

          rawItems.forEach((m: any) => {
            const isMezmur =
              m.category === 'MEZMUR' ||
              m.category === 'MUSIC' ||
              m.media_type === 'MEZMUR' ||
              m.mediaType === 'MEZMUR' ||
              (typeof m.caption === 'string' && m.caption.trim().startsWith('{') && (m.caption.includes('"title"') || m.caption.includes('"artist"')));

            if (isMezmur) {
              let title = 'Untitled Song';
              let artist = '';
              try {
                if (m.caption && m.caption.trim().startsWith('{')) {
                  const parsed = JSON.parse(m.caption);
                  title = parsed.title || title;
                  artist = parsed.artist || '';
                } else if (m.caption && m.caption.includes('|')) {
                  const parts = m.caption.split('|');
                  title = parts[0].trim();
                  artist = parts[1]?.trim() || '';
                } else if (m.caption) {
                  title = m.caption;
                }
              } catch (e) {
                title = m.caption || 'Untitled Song';
              }

              if (!extractedMusic.some((x) => x.id === m.id)) {
                extractedMusic.push({
                  id: m.id,
                  guestName: m.uploader_name || m.uploaderName || 'Honored Guest',
                  title: title || 'Untitled Song',
                  artist: artist || '',
                  category: 'MEZMUR',
                });
              }
            } else {
              galleryItems.push(m);
            }
          });

          setMediaAssets(galleryItems);
        }

        setMusicRecommendations(extractedMusic);
      } catch (err) {
        console.error('Failed to load couple dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCoupleDashboardData();
  }, [router]);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('Image file size must be less than 15MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const imgData = evt.target?.result as string;
        if (imgData) {
          setCoverImageUrl(imgData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCoverImage = async () => {
    if (!event?.slug) return;
    setSavingCoverImage(true);
    setCoverSuccessMsg('');
    try {
      const res = await fetch(`/api/events/${event.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverImageUrl, couplePhotoUrl: coverImageUrl, cardTemplate, cardTheme }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.event) {
          setEvent(data.event);
        } else {
          setEvent((prev) => prev ? { ...prev, coverImageUrl } : null);
        }
        setCoverSuccessMsg('✓ Invitation cover photo & card design settings saved successfully!');
        setTimeout(() => setCoverSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error('Failed to save cover image:', err);
    } finally {
      setSavingCoverImage(false);
    }
  };

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agafari_user');
      localStorage.removeItem('agafari_role');
      document.cookie = 'agafari_token=; path=/; max-age=0';
    }
    router.push('/couple/login');
  };

  // Calculate current quota usage
  const currentTotalGuestsSubmitted = (invitations || []).reduce((sum, inv) => sum + (inv?.maxGuests || 1), 0);
  const remainingPermittedSeats = Math.max(0, permittedTotalQuota - currentTotalGuestsSubmitted);

  // Submit Guest Data to Organizer / System Admin
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestErrorMsg('');
    setGuestSuccessMsg('');

    if (!guestName.trim() || !guestPhone.trim() || !guestHeadcount) {
      setGuestErrorMsg('All 3 fields (Guest Name, Headcount Quota, and Guest Phone/Contact) are required to submit guest data.');
      return;
    }

    if (currentTotalGuestsSubmitted + guestHeadcount > permittedTotalQuota) {
      setGuestErrorMsg(`Exceeds your total permitted quota of ${permittedTotalQuota} guests! Remaining available seats: ${remainingPermittedSeats}.`);
      return;
    }

    setSubmittingGuest(true);
    try {
      const slug = event?.slug || 'sara-and-dawit-2026';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-dev-role': 'BRIDE_GROOM',
      };
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('agafari_token');
        if (storedToken) {
          headers['Authorization'] = `Bearer ${storedToken}`;
        }
      }

      const res = await fetch(`/api/events/${slug}/invitations`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          guestName: guestName.trim(),
          guestPhone: guestPhone.trim(),
          maxGuests: guestHeadcount,
          inviteType,
        }),
      });

      const data = await res.json();
      if (res.ok && data.invitation) {
        setInvitations((prev) => [data.invitation, ...prev]);
        setGuestSuccessMsg(`Guest data for "${guestName}" sent to your Event Organizer! QR Pass & unique ID link generated.`);
        setGuestName('');
        setGuestPhone('');
        setGuestHeadcount(2);
        setTimeout(() => setGuestSuccessMsg(''), 6000);
      } else {
        setGuestErrorMsg(data.error || 'Failed to submit guest data.');
      }
    } catch (err) {
      console.error('Error submitting guest data:', err);
      setGuestErrorMsg('Server error. Please try again.');
    } finally {
      setSubmittingGuest(false);
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
      reader.onload = (evt) => {
        const audioData = evt.target?.result as string;
        if (audioData) {
          setBackgroundAudioUrl(audioData);
          if (typeof window !== 'undefined' && event?.slug) {
            localStorage.setItem(`agafari_bg_audio_${event.slug}`, audioData);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAudio = async () => {
    if (!event?.slug) return;
    setSavingAudio(true);
    setAudioSuccessMsg('');
    try {
      if (typeof window !== 'undefined' && backgroundAudioUrl) {
        localStorage.setItem(`agafari_bg_audio_${event.slug}`, backgroundAudioUrl);
      }
      const res = await fetch(`/api/events/${event.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backgroundAudioUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.event) {
          setEvent(data.event);
        } else {
          setEvent((prev) => prev ? { ...prev, backgroundAudioUrl } : null);
        }
        setAudioSuccessMsg('✓ Background audio track updated successfully! Guests visiting your celebration page will hear this track.');
        setTimeout(() => setAudioSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error('Failed to save background audio:', err);
    } finally {
      setSavingAudio(false);
    }
  };

  const handleCopyLink = (code: string, name: string) => {
    const slug = event?.slug || 'sara-and-dawit-2026';
    const fullUrl = `${window.location.origin}/event/${slug}?code=${code}&guest=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  // Filter Media (Behind The Scenes vs Gathered Media - Excludes MEZMUR recommendations)
  const filteredMedia = (mediaAssets || []).filter((m) => {
    if (!m || m.status === 'REJECTED') return false;
    const isMezmur =
      m.category === 'MEZMUR' ||
      m.category === 'MUSIC' ||
      m.media_type === 'MEZMUR' ||
      m.mediaType === 'MEZMUR' ||
      (typeof m.caption === 'string' && m.caption.trim().startsWith('{') && (m.caption.includes('"title"') || m.caption.includes('"artist"')));
    if (isMezmur) return false;
    if (mediaSubTab === 'ALL') return true;
    if (mediaSubTab === 'BTS') return m.category === 'BTS';
    if (mediaSubTab === 'GATHERED') return m.category === 'WISHES' || m.category === 'LIVE' || !m.category;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-gold-400 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-gold-400 text-xs tracking-widest uppercase">Verifying Security & Access Permissions...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-gold-500/30 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
            <Lock className="w-8 h-8 text-gold-400" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-2xl text-gold-400 tracking-tight">Private Couple Dashboard</h2>
            <p className="text-[10px] text-gold-500/90 font-bold uppercase tracking-widest bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20 inline-block">
              Authentication & Credentials Required
            </p>
            <p className="text-xs text-slate-300 font-light leading-relaxed pt-2">
              No specific wedding event slug or couple account credentials were provided. To access your private wedding hub, please log in with your couple credentials or enter your exact wedding URL link.
            </p>
          </div>
          <Link
            href="/couple/login"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-gold active:scale-95 cursor-pointer"
          >
            <span>Log In to Couple Portal →</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100 text-slate-900 flex font-sans selection:bg-amber-400 selection:text-slate-950">

      {/* =========================================================================
          LEFT SIDEBAR: COUPLE PORTAL NAVIGATION
         ========================================================================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-950 text-white flex flex-col justify-between border-r border-gold-500/30 transition-transform duration-300 ease-in-out
        md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Couple Header */}
          <div className="p-6 border-b border-gold-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/branding/artboard-13.png"
                  alt="Agafari Logo"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h2 className="font-serif font-bold text-base text-gold-400 tracking-wide">
                    {event?.brideName || 'Bride'} & {event?.groomName || 'Groom'}
                  </h2>
                  <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-widest block">
                    COUPLE'S PORTAL
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wedding Card Metadata */}
            <div className="mt-4 p-3 rounded-xl bg-black/40 border border-gold-500/20 text-[11px] space-y-1">
              <div className="flex items-center gap-2 text-gold-400 font-medium">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{event?.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Wedding Date'}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{event?.venueName || 'Primary Venue'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2 text-xs font-semibold">
            {/* 0. Background Audio & Entrance Mezmur */}
            <button
              onClick={() => { setActiveTab('SETUP'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${activeTab === 'SETUP'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-extrabold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Music className="w-4 h-4 text-gold-400" />
                <span>0. Background Audio & Mezmur</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-gold-300 font-bold border border-gold-500/30">
                🎵
              </span>
            </button>

            {/* 1. Guest Data & QR Invitations */}
            <button
              onClick={() => { setActiveTab('GUESTS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${activeTab === 'GUESTS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-extrabold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gold-400" />
                <span>1. Guest List & QR Passes</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-gold-300 font-bold border border-gold-500/30">
                {invitations.length}
              </span>
            </button>

            {/* 2. Behind-The-Scenes & Gathered Media Gallery */}
            <button
              onClick={() => { setActiveTab('MEDIA'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${activeTab === 'MEDIA'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-extrabold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4 text-gold-400" />
                <span>2. BTS & Gathered Media</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-gold-300 font-bold border border-gold-500/30">
                {mediaAssets.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href={`/event/${event?.slug || 'sara-and-dawit-2026'}`}
            className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-gold-500/20"
          >
            <Eye className="w-4 h-4 text-gold-400" />
            <span>Open Public Event Page</span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2 px-3 rounded-xl hover:bg-rose-950/40 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Drawer */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
        />
      )}

      {/* =========================================================================
          MAIN WORKSPACE CONTENT
         ========================================================================= */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">

        {/* Top Executive Header */}
        <header className="sticky top-0 z-30 bg-gray-950/95 backdrop-blur-md border-b border-gold-500/30 px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[10px] text-gold-400 font-bold uppercase tracking-widest">
                AGAFARI WEDDING SUITE
              </div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-white">
                {activeTab === 'SETUP' && 'Coming Soon Background Audio & Entrance Mezmur'}
                {activeTab === 'GUESTS' && 'Guest Directory & QR Pass Center'}
                {activeTab === 'MEDIA' && 'Behind-The-Scenes & Gathered Media Gallery'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-gold-400 text-xs font-bold shadow-sm border border-gold-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quota: {currentTotalGuestsSubmitted} / {permittedTotalQuota} Guests Submitted</span>
            </div>

            <LanguageSwitcher />
          </div>
        </header>

        {/* Workspace Body Content */}
        <main className="p-6 max-w-6xl w-full mx-auto space-y-6">

          {/* =========================================================================
              SECTION 0: INVITATION COVER PHOTO & BACKGROUND AUDIO SETUP
             ========================================================================= */}
          {activeTab === 'SETUP' && (
            <div className="space-y-6">

              {/* Cover Photo Upload & Persistence Panel */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gray-950 border border-gold-500/30 shadow-xl space-y-6">
                <div className="pb-4 border-b border-gold-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-gold-400 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-gold-500" />
                      Invitation Card Design & Couple Photo Upload
                    </h2>
                    <p className="text-xs text-gray-400 font-light mt-1">
                      Choose your preferred invitation template style, upload couple photos, and preview your official printable QR invitation card pass.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCardModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black font-extrabold text-xs shadow-lg shadow-gold-500/20 flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Live Preview & Download Card (.PNG)</span>
                  </button>
                </div>

                {/* TEMPLATE PICKER FOR COUPLES */}
                <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-gold-500/20">
                  <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider">
                    Select Card Design Template Style (2 Options)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setCardTemplate('CLASSIC_HORIZONTAL')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${cardTemplate === 'CLASSIC_HORIZONTAL'
                          ? 'border-gold-400 bg-gold-500/10 ring-2 ring-gold-400/40 text-gold-200'
                          : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                        }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>Template 1: Royal Horizontal Pass</span>
                        {cardTemplate === 'CLASSIC_HORIZONTAL' && <Check className="w-4 h-4 text-gold-400" />}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Landscape 3:2 layout with dual QR gate pass seal and foil border accents.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCardTemplate('ELEGANT_VERTICAL')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${cardTemplate === 'ELEGANT_VERTICAL'
                          ? 'border-gold-400 bg-gold-500/10 ring-2 ring-gold-400/40 text-gold-200'
                          : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                        }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>Template 2: Romantic Floral Portrait</span>
                        {cardTemplate === 'ELEGANT_VERTICAL' && <Check className="w-4 h-4 text-gold-400" />}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Vertical 2:3 layout with champagne parchment background, golden roses filigree, and arched photo frame.</p>
                    </button>
                  </div>
                </div>

                {coverSuccessMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{coverSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Option A: Upload Device Photo */}
                  <div className="p-5 rounded-2xl bg-black border border-gold-500/30 shadow-md space-y-3">
                    <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-gold-500" />
                      Option A: Select Image File from Device
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="block w-full text-xs text-gray-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold-500 file:text-black hover:file:bg-gold-400 cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-400">Supported formats: JPG, PNG, WEBP (Max 15MB)</p>
                  </div>

                  {/* Option B: Direct Image URL */}
                  <div className="p-5 rounded-2xl bg-black border border-gold-500/30 shadow-md space-y-3">
                    <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-gold-500" />
                      Option B: Direct Image URL / Web Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-900 text-white text-xs focus:ring-2 focus:ring-gold-500 font-mono"
                    />
                    <p className="text-[11px] text-gray-400">Paste direct image link</p>
                  </div>
                </div>

                {/* Cover Image Preview */}
                {coverImageUrl && (
                  <div className="p-4 rounded-2xl bg-black border border-gold-500/40 text-white flex flex-col sm:flex-row items-center gap-4 shadow-lg">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-900 shrink-0 border border-gold-500/30">
                      <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-xs font-bold text-gold-400">Active Invitation Cover Photo</div>
                      <div className="text-[11px] text-gray-300 truncate mt-1">
                        This image will be displayed on your invitation page card header.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveCoverImage}
                      disabled={savingCoverImage}
                      className="px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4 text-black" />
                      <span>{savingCoverImage ? 'Saving Image...' : 'Save Uploaded Cover Photo'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Background Audio Panel */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gray-950 border border-gold-500/30 shadow-xl space-y-6">
                <div className="pb-4 border-b border-gold-500/20">
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-gold-400 flex items-center gap-2">
                    <Music className="w-5 h-5 text-gold-500" />
                    Background Audio & Entrance Mezmur
                  </h2>
                  <p className="text-xs text-gray-400 font-light mt-1">
                    Upload an audio file (.mp3, .wav, .m4a) from your device or paste a direct web audio link. This audio track will automatically play when guests visit your public celebration page.
                  </p>
                </div>

                {audioSuccessMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{audioSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Option A: Upload Audio File */}
                  <div className="p-5 rounded-2xl bg-black border border-gold-500/30 shadow-md space-y-3">
                    <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-gold-500" />
                      Option A: Upload Audio File (.mp3, .wav, .m4a)
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileUpload}
                      className="block w-full text-xs text-gray-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold-500 file:text-black hover:file:bg-gold-400 cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-400">Supported formats: MP3, WAV, AAC, M4A (Max 20MB)</p>
                  </div>

                  {/* Option B: Direct Audio URL */}
                  <div className="p-5 rounded-2xl bg-black border border-gold-500/30 shadow-md space-y-3">
                    <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-gold-500" />
                      Option B: Direct Audio URL / Web Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/mezmur.mp3"
                      value={backgroundAudioUrl}
                      onChange={(e) => setBackgroundAudioUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-900 text-white text-xs focus:ring-2 focus:ring-gold-500"
                    />
                    <p className="text-[11px] text-gray-400">Paste direct link to any hosted mp3 or audio file</p>
                  </div>
                </div>

                {/* Audio Preview Player */}
                {backgroundAudioUrl && (
                  <div className="p-5 rounded-2xl bg-black border border-gold-500/40 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-gold-400">Active Background Audio Track</div>
                        <div className="text-[11px] text-gray-300 truncate max-w-xs">
                          {backgroundAudioUrl.startsWith('data:') ? 'Custom Uploaded Device Audio File' : backgroundAudioUrl}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <audio controls src={backgroundAudioUrl} className="h-9 max-w-[240px]" />
                      <button
                        type="button"
                        onClick={() => setBackgroundAudioUrl('')}
                        className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-900 text-xs font-bold transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveAudio}
                    disabled={savingAudio}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
                  >
                    <Music className="w-4 h-4 text-black" />
                    <span>{savingAudio ? 'Saving Audio Track...' : 'Save All Wedding Customizations'}</span>
                  </button>
                </div>
              </div>

              {/* Guest Mezmur & Music Recommendations Panel */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gray-950 border border-gold-500/30 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold-500/20">
                  <div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-gold-400 flex items-center gap-2">
                      <Music className="w-5 h-5 text-gold-500" />
                      Guest Mezmur & Song Recommendations ({musicRecommendations.length})
                    </h2>
                    <p className="text-xs text-gray-400 font-light mt-1">
                      Songs and mezmurs suggested by your guests and family members for your wedding celebration.
                    </p>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-bold shrink-0">
                    🎵 {musicRecommendations.length} Recommendations
                  </div>
                </div>

                {musicRecommendations.length === 0 ? (
                  <div className="p-8 text-center bg-black/40 rounded-2xl border border-dashed border-gold-500/20 text-gray-400 text-xs space-y-2">
                    <Music className="w-8 h-8 text-gold-500/40 mx-auto" />
                    <p className="font-bold text-gold-400">No song recommendations received yet</p>
                    <p className="text-[11px] text-gray-400">Guests visiting your public celebration page can recommend mezmurs and songs to be played at your wedding.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {musicRecommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-5 rounded-2xl bg-black border border-gold-500/30 hover:border-gold-500/60 shadow-md flex flex-col justify-between space-y-3 transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 text-[10px] font-bold uppercase tracking-wider">
                              🎵 {rec.category || 'MEZMUR'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              By: {rec.guestName}
                            </span>
                          </div>

                          <div className="font-serif font-bold text-base text-white leading-snug">
                            {rec.title}
                          </div>

                          {rec.artist && (
                            <div className="text-xs text-gold-400 font-medium">
                              Singer / Artist: {rec.artist}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                          <div className="text-[10px] text-gray-400">
                            Submitted by guest <strong className="text-gold-400">{rec.guestName}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setBackgroundAudioUrl(`${rec.title} - ${rec.artist || ''}`);
                              alert(`Selected "${rec.title}" as entrance mezmur! Click 'Save All Wedding Customizations' to apply.`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-bold transition-all cursor-pointer"
                          >
                            Use Track
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 1: GUEST LIST SUBMISSION & UNIQUE ID QR PASS GENERATION
             ========================================================================= */}
          {activeTab === 'GUESTS' && (
            <div className="space-y-6">

              {/* Quota KPI Overview Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-gray-950 border border-gold-500/30 shadow-md">
                  <div className="text-[11px] text-gold-400 font-bold uppercase tracking-wider">Permitted Guest Quota</div>
                  <div className="text-3xl font-serif font-bold text-white mt-1">{permittedTotalQuota}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Allocated by Event Organizer</div>
                </div>

                <div className="p-5 rounded-2xl bg-gray-950 border border-gold-500/30 shadow-md">
                  <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Guests Submitted</div>
                  <div className="text-3xl font-serif font-bold text-emerald-400 mt-1">{currentTotalGuestsSubmitted}</div>
                  <div className="text-[11px] text-emerald-300 font-medium mt-0.5">✓ QR Passes & Links Active</div>
                </div>

                <div className="p-5 rounded-2xl bg-gray-950 border border-gold-500/30 shadow-md">
                  <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">Remaining Quota</div>
                  <div className="text-3xl font-serif font-bold text-amber-400 mt-1">{remainingPermittedSeats}</div>
                  <div className="text-[11px] text-amber-300 font-medium mt-0.5">Available Seats Remaining</div>
                </div>
              </div>

              {/* Guest Submission Form */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gray-950 border border-gold-500/30 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-500/20">
                  <div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-gold-400 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-gold-500" />
                      Submit Permitted Guest Data
                    </h2>
                    <p className="text-xs text-gray-400 font-light mt-0.5">
                      Enter your guest names and permitted headcounts. Your submission will generate their scannable QR card & unique invitation link.
                    </p>
                  </div>

                  <div className="flex items-center p-1 rounded-xl bg-black border border-gold-500/30 text-xs">
                    <button
                      type="button"
                      onClick={() => setInviteType('CARD')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${inviteType === 'CARD'
                          ? 'bg-gold-500 text-black shadow-sm'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Physical Card QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteType('LINK')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${inviteType === 'LINK'
                          ? 'bg-gold-500 text-black shadow-sm'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Digital Link
                    </button>
                  </div>
                </div>

                {guestSuccessMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{guestSuccessMsg}</span>
                  </div>
                )}

                {guestErrorMsg && (
                  <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>{guestErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gold-400 mb-1">
                      Guest / Family Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Uncle Bekele & Family"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-black text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gold-400 mb-1">
                      Allowed Persons (Headcount Quota) *
                    </label>
                    <select
                      value={guestHeadcount}
                      onChange={(e) => setGuestHeadcount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-black text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500 font-bold"
                    >
                      <option value={1}>1 Person (Single Entry)</option>
                      <option value={2}>2 Persons (Couple VIP Entry)</option>
                      <option value={3}>3 Persons (Family Entry)</option>
                      <option value={4}>4 Persons (Family Pass)</option>
                      <option value={5}>5 Persons (Full Family Pass)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gold-400 mb-1">
                      Guest Phone / Contact *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+251 91 122 3344"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-black text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={submittingGuest}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-black" />
                      <span>{submittingGuest ? 'Submitting to Organizer...' : 'Submit Guest Data & Generate QR Pass'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Guest Invitations List */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gray-950 border border-gold-500/30 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-500/20">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-white">
                      Guest Invitations & RSVP Directory ({invitations.length})
                    </h2>
                    <p className="text-xs text-gray-400 font-light">
                      Filter guests coming vs declined, copy unique invitation links, or download printable branded invitation card passes.
                    </p>
                  </div>

                  {/* RSVP Filter Pills */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black border border-gold-500/30 text-xs font-bold">
                    <button
                      onClick={() => setGuestFilterTab('ALL')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${guestFilterTab === 'ALL'
                          ? 'bg-gold-500 text-black shadow-sm font-extrabold'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      All ({invitations.length})
                    </button>
                    <button
                      onClick={() => setGuestFilterTab('ATTENDING')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${guestFilterTab === 'ATTENDING'
                          ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                          : 'text-emerald-400 hover:text-white'
                        }`}
                    >
                      ✓ Coming ({invitations.filter((i) => i.rsvpStatus === 'ATTENDING').length})
                    </button>
                    <button
                      onClick={() => setGuestFilterTab('DECLINED')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${guestFilterTab === 'DECLINED'
                          ? 'bg-rose-600 text-white shadow-sm font-extrabold'
                          : 'text-rose-400 hover:text-white'
                        }`}
                    >
                      ✗ Declined ({invitations.filter((i) => i.rsvpStatus === 'DECLINED').length})
                    </button>
                    <button
                      onClick={() => setGuestFilterTab('PENDING')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${guestFilterTab === 'PENDING'
                          ? 'bg-amber-600 text-white shadow-sm font-extrabold'
                          : 'text-amber-400 hover:text-white'
                        }`}
                    >
                      ⏳ Pending ({invitations.filter((i) => !i.rsvpStatus || i.rsvpStatus === 'PENDING').length})
                    </button>
                  </div>
                </div>

                {invitations.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    No guest data submitted yet. Use the form above to add your guests within your permitted quota.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gold-500/20 text-[10px] text-gold-400 font-bold uppercase tracking-wider bg-black/60">
                          <th className="py-3 px-4 rounded-l-xl">Guest / Family</th>
                          <th className="py-3 px-4">Unique ID</th>
                          <th className="py-3 px-4">Quota Allowed</th>
                          <th className="py-3 px-4">RSVP Status</th>
                          <th className="py-3 px-4">Gate Check-In</th>
                          <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-500/10">
                        {invitations
                          .filter((inv) => {
                            if (guestFilterTab === 'ALL') return true;
                            if (guestFilterTab === 'ATTENDING') return inv.rsvpStatus === 'ATTENDING';
                            if (guestFilterTab === 'DECLINED') return inv.rsvpStatus === 'DECLINED';
                            if (guestFilterTab === 'PENDING') return !inv.rsvpStatus || inv.rsvpStatus === 'PENDING';
                            return true;
                          })
                          .map((inv) => (
                            <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-serif font-bold text-white text-sm">{inv.guestName}</div>
                                {inv.guestPhone && <div className="text-[11px] text-gray-400">{inv.guestPhone}</div>}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-gold-300 font-bold">
                                {inv.inviteCode}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-white">
                                {inv.maxGuests} {inv.maxGuests === 1 ? 'Person' : 'Persons'}
                              </td>
                              <td className="py-3.5 px-4">
                                {inv.rsvpStatus === 'ATTENDING' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Attending
                                  </span>
                                ) : inv.rsvpStatus === 'DECLINED' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold text-[10px] border border-rose-500/30">
                                    <XCircle className="w-3 h-3 text-rose-400" /> Declined
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 font-semibold text-[10px] border border-amber-500/30">
                                    <Clock className="w-3 h-3 text-amber-400" /> Pending RSVP
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                {inv.isScanned ? (
                                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Checked In
                                  </span>
                                ) : (
                                  <span className="text-gray-500 font-light text-[11px]">
                                    Awaiting Gate
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setSelectedInviteForPass(inv)}
                                    className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                                    title="Download Branded Invitation Card"
                                  >
                                    <QrCode className="w-3.5 h-3.5 text-black" />
                                    <span>Download Card / QR</span>
                                  </button>

                                  <button
                                    onClick={() => handleCopyLink(inv.inviteCode, inv.guestName)}
                                    className="p-1.5 rounded-lg border border-gold-500/30 bg-black hover:bg-gray-800 text-gold-400 transition-colors cursor-pointer"
                                    title="Copy Unique Invitation Link"
                                  >
                                    {copiedCode === inv.inviteCode ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Share2 className="w-3.5 h-3.5 text-gold-400" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Guest Music & Mezmur Recommendations Card (Req 7) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gray-950 border border-gold-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gold-500/20">
                  <h2 className="font-serif font-bold text-lg text-gold-400 flex items-center gap-2">
                    <Music className="w-5 h-5 text-gold-500" />
                    Guest Music & Mezmur Recommendations ({musicRecommendations.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {musicRecommendations.map((rec) => (
                    <div key={rec.id} className="p-4 rounded-2xl bg-black border border-gold-500/20 flex items-center justify-between shadow-sm">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <Music className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          <span>{rec.title}</span>
                          {rec.artist && <span className="text-gray-400 text-[11px]">by {rec.artist}</span>}
                        </div>
                        <div className="text-[11px] text-gold-400 font-medium">
                          Recommended by: <strong className="text-white font-bold">{rec.guestName}</strong>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px] border border-gold-500/30">
                        {rec.category || 'MEZMUR'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 2: BEHIND-THE-SCENES & GATHERED MEDIA GALLERY
             ========================================================================= */}
          {activeTab === 'MEDIA' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gray-950 border border-gold-500/30 shadow-xl space-y-6">
              <div className="flex flex-col gap-4 pb-4 border-b border-gold-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-gold-400">
                      Behind-The-Scenes & Gathered Media Gallery ({mediaAssets.length})
                    </h2>
                    <p className="text-xs text-gray-400 font-light mt-0.5">
                      Photos, candid videos, and behind-the-scenes memories shared by your Event Organizer and guests after the wedding day.
                    </p>
                  </div>

                  {/* Subpage Pills */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-black border border-gold-500/30 text-xs font-bold">
                    <button
                      onClick={() => setMediaSubTab('ALL')}
                      className={`px-3.5 py-1.5 rounded-lg transition-all ${mediaSubTab === 'ALL'
                          ? 'bg-gold-500 text-black shadow-sm font-extrabold'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      🌟 All Media ({mediaAssets.length})
                    </button>
                    <button
                      onClick={() => setMediaSubTab('BTS')}
                      className={`px-3.5 py-1.5 rounded-lg transition-all ${mediaSubTab === 'BTS'
                          ? 'bg-gold-500 text-black shadow-sm font-extrabold'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      🎬 Behind-The-Scenes (BTS)
                    </button>
                    <button
                      onClick={() => setMediaSubTab('GATHERED')}
                      className={`px-3.5 py-1.5 rounded-lg transition-all ${mediaSubTab === 'GATHERED'
                          ? 'bg-gold-500 text-black shadow-sm font-extrabold'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      📸 Gathered Guest Media
                    </button>
                  </div>
                </div>
              </div>

              {filteredMedia.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-xs space-y-2">
                  <Film className="w-8 h-8 text-gold-500 mx-auto opacity-50" />
                  <div className="font-bold text-sm text-gray-300">No Media Shared Yet</div>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Behind-the-scenes videos and guest media uploads will be shared here by your Event Organizer after the wedding celebration.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedia.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-4 rounded-2xl border border-gold-500/20 bg-black/60 flex flex-col justify-between shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-gold-400 uppercase">
                            {asset.category === 'BTS' ? '🎬 Behind-The-Scenes' : '📸 Guest Media'}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {new Date(asset.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Video / Photo Container */}
                        <div className="h-48 rounded-xl overflow-hidden bg-gray-900 mb-3 flex items-center justify-center border border-gold-500/20">
                          {asset.mediaType === 'VIDEO' || asset.cdnUrl.includes('.mp4') ? (
                            <video
                              src={asset.cdnUrl}
                              controls
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={asset.cdnUrl}
                              alt={asset.caption || 'Wedding media'}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="font-serif font-bold text-white text-sm">
                          {asset.uploaderName}
                        </div>
                        {asset.caption && (
                          <p className="text-xs text-gray-400 italic mt-1 line-clamp-2">
                            "{asset.caption}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          HIGH-RES QR INVITATION CARD MODAL (VIEW & DOWNLOAD)
         ========================================================================= */}
      {/* High-Res Branded Invitation Card Modal */}
      <InvitationCardModal
        isOpen={Boolean(selectedInviteForPass) || cardModalOpen}
        onClose={() => { setSelectedInviteForPass(null); setCardModalOpen(false); }}
        invitation={selectedInviteForPass || {
          guestName: `${event?.brideName || 'Bride'} & ${event?.groomName || 'Groom'}'s VIP Guest`,
          inviteCode: 'G5qHaAkPNs7g',
          maxGuests: 4,
          tableNumber: '1',
          rsvpStatus: 'ATTENDING',
        }}
        event={event ? {
          ...event,
          cardTemplate,
          cardTheme,
          couplePhotoUrl: coverImageUrl || event.couplePhotoUrl || event.coverImageUrl,
        } : null}
      />

      {/* Floating Mobile Bottom Ball Navigation Menu (Replacing Hamburger Button) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border-2 border-gold-500/50 rounded-full px-5 py-2.5 flex items-center gap-4 shadow-2xl ring-2 ring-gold-500/20">
        <button
          onClick={() => setActiveTab('GUESTS')}
          className={`p-3 rounded-full transition-all flex items-center justify-center ${activeTab === 'GUESTS'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-lg scale-110'
              : 'text-gold-400/80 hover:text-gold-400 hover:bg-white/10'
            }`}
          title="Guest List & QR Passes"
        >
          <Users className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('MEDIA')}
          className={`p-3 rounded-full transition-all flex items-center justify-center ${activeTab === 'MEDIA'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-lg scale-110'
              : 'text-gold-400/80 hover:text-gold-400 hover:bg-white/10'
            }`}
          title="BTS & Gathered Media"
        >
          <Film className="w-5 h-5" />
        </button>

        <Link
          href="/couple/login"
          className="p-3 rounded-full text-rose-400/90 hover:text-rose-400 hover:bg-rose-950/40 transition-all flex items-center justify-center"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </Link>
      </nav>

    </div>
  );
}

export default function CoupleDashboardPage() {
  return (
    <DashboardSecurityGate
      dashboardTitle="Bride & Groom Wedding Dashboard"
      dashboardId="couple-dashboard"
      dashboardType="couple"
      defaultEmail="couple@agafari.com"
    >
      <CoupleDashboardContent />
    </DashboardSecurityGate>
  );
}
