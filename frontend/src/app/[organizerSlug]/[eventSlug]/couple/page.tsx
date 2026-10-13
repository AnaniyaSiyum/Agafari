'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardSecurityGate from '@/components/DashboardSecurityGate';
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
  Eye, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Crown, 
  ArrowLeft,
  Video, 
  Image as ImageIcon,
  Heart,
  ChevronLeft,
  Music
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

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
  status: string;
}

interface MediaAssetData {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE' | 'MEZMUR' | string;
  media_type?: string;
  category?: 'BTS' | 'WISHES' | 'LIVE' | 'MEZMUR' | 'MUSIC' | string;
  cdnUrl: string;
  thumbnailUrl?: string;
  caption: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface MusicRecommendationData {
  id: string;
  guestName: string;
  title: string;
  artist: string;
  category?: string;
  createdAt?: string;
}

interface InvitationRecord {
  id: string;
  inviteCode: string;
  guestName: string;
  guestPhone: string;
  maxGuests: number;
  inviteType: 'CARD' | 'LINK';
  rsvpStatus: 'ATTENDING' | 'DECLINED' | 'MAYBE' | 'PENDING';
  attendingHeadcount?: number;
  scannedCount: number;
  isScanned: boolean;
  qrCodeUrl?: string;
  createdAt?: string;
}

function ScopedCouplePortalContent({ params }: { params: { organizerSlug: string; eventSlug: string } }) {
  const { organizerSlug, eventSlug } = params;
  const { t } = useTranslation();
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>([]);
  const [musicRecommendations, setMusicRecommendations] = useState<MusicRecommendationData[]>([]);
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Permitted total quota allocated by Organizer/Admin
  const [permittedTotalQuota, setPermittedTotalQuota] = useState(150);

  // Active Navigation Tab: 'GUESTS' | 'MEDIA' | 'MEZMUR'
  const [activeTab, setActiveTab] = useState<'GUESTS' | 'MEDIA' | 'MEZMUR'>('GUESTS');

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

  const fetchPortalData = async () => {
    setLoading(true);
    try {
      const [eventRes, mediaRes, invitesRes, quotaRes, musicRes] = await Promise.all([
        fetch(`/api/events/${eventSlug}`),
        fetch(`/api/events/${eventSlug}/media?status=ALL`),
        fetch(`/api/events/${eventSlug}/invitations`),
        fetch(`/api/events/${eventSlug}/quota`),
        fetch(`/api/events/${eventSlug}/music`),
      ]);

      if (eventRes.ok) {
        const data = await eventRes.json();
        if (data.event) {
          setEvent({
            ...data.event,
            brideName: data.event.bride_name || data.event.brideName || 'Bride',
            groomName: data.event.groom_name || data.event.groomName || 'Groom',
            venueName: data.event.venue_name || data.event.venueName || 'Sheraton Addis Luxury Ballroom',
            eventDate: data.event.event_date || data.event.eventDate || '2026-09-20',
          });
        }
      }

      const extractedMusic: MusicRecommendationData[] = [];

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
            createdAt: r.createdAt || r.created_at,
          });
        });
      }

      if (mediaRes.ok) {
        const data = await mediaRes.json();
        const rawItems = data.items || data.mediaAssets || [];
        const galleryItems: MediaAssetData[] = [];

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
                createdAt: m.created_at || m.createdAt,
              });
            }
          } else {
            galleryItems.push({
              id: m.id,
              eventId: m.event_id || m.eventId,
              uploaderName: m.uploader_name || m.uploaderName || 'Anonymous Guest',
              mediaType: m.media_type || m.mediaType || 'IMAGE',
              category: m.category || 'WISHES',
              cdnUrl: m.cdn_url || m.cdnUrl || '',
              caption: m.caption || '',
              status: m.status || 'APPROVED',
              createdAt: m.created_at || m.createdAt || new Date().toISOString(),
            });
          }
        });

        setMediaAssets(galleryItems);
      }

      setMusicRecommendations(extractedMusic);

      if (invitesRes.ok) {
        const data = await invitesRes.json();
        const rawInvites = data.invitations || [];
        setInvitations(
          rawInvites.map((inv: any) => ({
            id: inv.id,
            inviteCode: inv.invite_code || inv.inviteCode || 'INV-0000',
            guestName: inv.guest_name || inv.guestName || 'Guest',
            guestPhone: inv.guest_phone || inv.guestPhone || '',
            maxGuests: inv.max_guests || inv.maxGuests || 1,
            inviteType: inv.invite_type || inv.inviteType || 'CARD',
            rsvpStatus: inv.rsvp_status || inv.rsvpStatus || 'PENDING',
            scannedCount: inv.scanned_count || inv.scannedCount || 0,
            isScanned: Boolean(inv.is_scanned || inv.isScanned),
            qrCodeUrl: inv.qr_code_url || inv.qrCodeUrl,
            createdAt: inv.created_at || inv.createdAt,
          }))
        );
      }

      if (quotaRes.ok) {
        const data = await quotaRes.json();
        if (data.totalAllocatedQuota) {
          setPermittedTotalQuota(data.totalAllocatedQuota);
        }
      }
    } catch (err) {
      console.error('Failed to load couple portal data:', err);
    } finally {
      setLoading(false);
    }
  };

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
    fetchPortalData();
  }, [eventSlug, router]);

  // Calculate current quota usage
  const currentTotalGuestsSubmitted = invitations.reduce((sum, inv) => sum + (inv.maxGuests || 1), 0);
  const remainingPermittedSeats = Math.max(0, permittedTotalQuota - currentTotalGuestsSubmitted);

  // Submit Guest Data to Organizer / System Admin
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestErrorMsg('');
    setGuestSuccessMsg('');

    if (!guestName.trim() || !guestPhone.trim() || !guestHeadcount) {
      setGuestErrorMsg('All 3 fields (Guest Name, Allowed Persons Quota, and Guest Phone/Contact) are required to generate an invitation.');
      return;
    }

    if (currentTotalGuestsSubmitted + guestHeadcount > permittedTotalQuota) {
      setGuestErrorMsg(`Exceeds your total permitted quota of ${permittedTotalQuota} guests! Remaining available seats: ${remainingPermittedSeats}.`);
      return;
    }

    setSubmittingGuest(true);
    try {
      const res = await fetch(`/api/events/${eventSlug}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName.trim(),
          guestPhone: guestPhone.trim(),
          maxGuests: guestHeadcount,
          inviteType,
        }),
      });

      const data = await res.json();
      if (res.ok && data.invitation) {
        const newInv: InvitationRecord = {
          id: data.invitation.id,
          inviteCode: data.invitation.invite_code || data.invitation.inviteCode,
          guestName: data.invitation.guest_name || data.invitation.guestName,
          guestPhone: data.invitation.guest_phone || data.invitation.guestPhone || '',
          maxGuests: data.invitation.max_guests || data.invitation.maxGuests || 1,
          inviteType: data.invitation.invite_type || data.invitation.inviteType || 'CARD',
          rsvpStatus: data.invitation.rsvp_status || data.invitation.rsvpStatus || 'PENDING',
          scannedCount: 0,
          isScanned: false,
          qrCodeUrl: data.invitation.qr_code_url || data.invitation.qrCodeUrl,
          createdAt: new Date().toISOString(),
        };

        setInvitations((prev) => [newInv, ...prev]);
        setGuestName('');
        setGuestPhone('');
        setGuestHeadcount(2);
        setGuestSuccessMsg(`✓ Successfully generated QR Pass & Invitation link for ${newInv.guestName}!`);
        setTimeout(() => setGuestSuccessMsg(''), 4000);
      } else {
        setGuestErrorMsg(data.error || 'Failed to submit guest data.');
      }
    } catch (err) {
      setGuestErrorMsg('Network error. Failed to generate guest pass.');
    } finally {
      setSubmittingGuest(false);
    }
  };

  const handleCopyCode = (code: string) => {
    const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    const fullUrl = `${appOrigin}/event/${eventSlug}?code=${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const filteredMedia = mediaAssets.filter((item) => {
    const isMezmur =
      item.category === 'MEZMUR' ||
      item.category === 'MUSIC' ||
      (typeof item.caption === 'string' && item.caption.trim().startsWith('{') && (item.caption.includes('"title"') || item.caption.includes('"artist"')));
    if (isMezmur) return false;

    if (mediaSubTab === 'ALL') return true;
    if (mediaSubTab === 'BTS') return item.category === 'BTS';
    return item.category === 'WISHES' || item.category === 'LIVE';
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3 bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-sm w-full">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
            <Heart className="w-6 h-6 animate-pulse text-amber-600 fill-amber-600" />
          </div>
          <p className="font-bold text-slate-800 text-sm">{t('couplePortal.loading')}</p>
        </div>
      </div>
    );
  }

  const isApproved = (event as any)?.adminApprovalStatus === 'APPROVED' || (event as any)?.admin_approval_status === 'APPROVED';

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="p-8 max-w-lg w-full rounded-3xl bg-slate-900 border border-amber-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/40">
              {t('couplePortal.lockedBadge')}
            </span>
            <h2 className="font-serif font-bold text-2xl text-white pt-2">
              {t('couplePortal.lockedTitle')}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              {t('couplePortal.lockedDesc')}
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      
      {/* Header Mobile / Desktop Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href={`/login?redirect=${encodeURIComponent(`/${organizerSlug}/${eventSlug}`)}`}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all border border-slate-200/80 active:scale-95"
            title="Go to Event Hub"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold uppercase tracking-wider text-[10px] border border-rose-200/60 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
                {t('couplePortal.portalBadge')}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-mono text-[11px]">/{eventSlug}</span>
            </div>
            <h1 className="font-bold text-base sm:text-lg text-slate-900 mt-0.5 tracking-tight">
              {event ? `${event.brideName} & ${event.groomName}` : 'Adeday & Addisu'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6 flex-1">
        
        {/* Top Segmented Navigation Control */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={() => setActiveTab('GUESTS')}
            className={`flex-1 w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
              activeTab === 'GUESTS'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>1. {t('couplePortal.tabGuests')} ({invitations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MEDIA')}
            className={`flex-1 w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
              activeTab === 'MEDIA'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Film className="w-4 h-4 text-rose-400" />
            <span>2. {t('couplePortal.tabMedia')} ({mediaAssets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MEZMUR')}
            className={`flex-1 w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
              activeTab === 'MEZMUR'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Music className="w-4 h-4 text-amber-500" />
            <span>3. Mezmur & Song Recommendations ({musicRecommendations.length})</span>
          </button>
        </div>

        {/* TAB 1: GUEST DIRECTORY & QR PASS GENERATOR */}
        {activeTab === 'GUESTS' && (
          <div className="space-y-6">
            
            {/* Quota KPI Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('couplePortal.permittedQuota')}</span>
                <div className="font-bold text-3xl text-slate-900">{permittedTotalQuota}</div>
                <p className="text-xs text-slate-500 font-medium">{t('couplePortal.allocatedByOrg')}</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">{t('couplePortal.guestsSubmitted')}</span>
                <div className="font-bold text-3xl text-emerald-700">{currentTotalGuestsSubmitted}</div>
                <p className="text-xs text-emerald-600 font-bold">{t('couplePortal.passesActive')}</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                <span className="text-xs text-amber-800 font-bold uppercase tracking-wider">{t('couplePortal.remainingQuota')}</span>
                <div className="font-bold text-3xl text-amber-700">{remainingPermittedSeats}</div>
                <p className="text-xs text-slate-500 font-medium">{t('couplePortal.availableRemaining')}</p>
              </div>
            </div>

            {/* Guest Submission Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                    <Plus className="w-5 h-5 text-amber-600" />
                    {t('couplePortal.submitTitle')}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {t('couplePortal.submitSubtitle')}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setInviteType('CARD')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      inviteType === 'CARD'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t('couplePortal.cardType')}
                  </button>
                  <button
                    onClick={() => setInviteType('LINK')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      inviteType === 'LINK'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t('couplePortal.linkType')}
                  </button>
                </div>
              </div>

              {guestSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{guestSuccessMsg}</span>
                </div>
              )}

              {guestErrorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{guestErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddGuest} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">{t('couplePortal.guestNameLabel')}</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Bekele & Family"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">{t('couplePortal.quotaLabel')}</label>
                  <select
                    value={guestHeadcount}
                    onChange={(e) => setGuestHeadcount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  >
                    <option value={1}>1 Person (Single Pass)</option>
                    <option value={2}>2 Persons (Couple Pass)</option>
                    <option value={3}>3 Persons (Family Pass)</option>
                    <option value={4}>4 Persons (Family Group)</option>
                    <option value={5}>5 Persons (Group Pass)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">{t('couplePortal.phoneLabel')}</label>
                  <input
                    type="text"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+251 91 122 3344"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="md:col-span-3 pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingGuest}
                    className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer border border-amber-300 active:scale-95"
                  >
                    {submittingGuest ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-950" />
                    )}
                    <span>{t('couplePortal.generatePassBtn')}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Guest Invitations List Grid */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                  {t('couplePortal.directoryTitle')} ({invitations.length})
                </h3>
                <span className="text-xs text-amber-800 font-mono font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {t('couplePortal.totalSeats')}: {currentTotalGuestsSubmitted} / {permittedTotalQuota}
                </span>
              </div>

              {invitations.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <QrCode className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-bold text-base text-slate-800">{t('couplePortal.noGuestsSubmitted')}</p>
                  <p className="text-xs text-slate-400">{t('couplePortal.useFormAbove')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {invitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-slate-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            {inv.inviteCode}
                          </span>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {inv.isScanned ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold">
                                🎟 Checked In
                              </span>
                            ) : inv.rsvpStatus === 'ATTENDING' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Attending
                              </span>
                            ) : inv.rsvpStatus === 'DECLINED' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold">
                                Cannot Attend
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-bold">
                                ⏳ Pending RSVP
                              </span>
                            )}

                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold">
                              {inv.maxGuests} {inv.maxGuests > 1 ? 'Persons' : 'Person'}
                            </span>
                          </div>
                        </div>

                        <h4 className="font-bold text-base text-slate-900">{inv.guestName}</h4>
                        {inv.guestPhone && (
                          <p className="text-xs text-slate-500 font-mono">{inv.guestPhone}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-slate-200/80">
                        <button
                          onClick={() => setSelectedInviteForPass(inv)}
                          className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        >
                          <QrCode className="w-3.5 h-3.5 text-slate-950" />
                          <span>{t('couplePortal.viewPassBtn')}</span>
                        </button>

                        <button
                          onClick={() => handleCopyCode(inv.inviteCode)}
                          className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer active:scale-95"
                          title={t('couplePortal.copyLinkTooltip')}
                        >
                          {copiedCode === inv.inviteCode ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: BTS & GATHERED MEDIA GALLERY */}
        {activeTab === 'MEDIA' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMediaSubTab('ALL')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mediaSubTab === 'ALL'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('couplePortal.allMedia')} ({mediaAssets.length})
                </button>

                <button
                  onClick={() => setMediaSubTab('BTS')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mediaSubTab === 'BTS'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('couplePortal.bts')}
                </button>

                <button
                  onClick={() => setMediaSubTab('GATHERED')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mediaSubTab === 'GATHERED'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('couplePortal.wishes')}
                </button>
              </div>
            </div>

            {filteredMedia.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center text-slate-400 space-y-2 shadow-sm">
                <Film className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-base text-slate-800">{t('couplePortal.noMediaYet')}</p>
                <p className="text-xs text-slate-400">{t('couplePortal.mediaSubtitle')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMedia.map((media) => (
                  <div key={media.id} className="p-5 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-sm">
                    <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 relative shadow-inner">
                      {media.mediaType === 'VIDEO' || media.cdnUrl.includes('.mp4') ? (
                        <video src={media.cdnUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={media.cdnUrl} alt={media.caption} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{media.uploaderName}</span>
                      <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{media.category}</span>
                    </div>
                    {media.caption && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-medium">
                        "{media.caption}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: MEZMUR & SONG RECOMMENDATIONS */}
        {activeTab === 'MEZMUR' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                    <Music className="w-5 h-5 text-amber-600" />
                    Mezmur & Song Recommendations ({musicRecommendations.length})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Special mezmurs and songs requested by your beloved family & guests for your wedding day.
                  </p>
                </div>

                <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold w-fit">
                  🎵 {musicRecommendations.length} Requested
                </span>
              </div>

              {musicRecommendations.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Music className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-bold text-base text-slate-800">No song recommendations received yet</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When guests fill out music suggestions on your digital wedding invitation, their recommendations will appear here cleanly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {musicRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/30 border border-amber-200/80 shadow-sm flex flex-col justify-between space-y-3 transition-all hover:shadow-md"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Music className="w-3 h-3 text-amber-600" />
                            {rec.category || 'MEZMUR'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Requested by <strong className="text-slate-900 font-bold">{rec.guestName}</strong>
                          </span>
                        </div>

                        <div className="space-y-1 pt-1">
                          <h4 className="font-bold text-lg text-slate-900 leading-snug tracking-tight">
                            {rec.title}
                          </h4>
                          {rec.artist ? (
                            <p className="text-xs text-amber-800 font-semibold">
                              Singer / Artist: <span className="text-slate-700 font-medium">{rec.artist}</span>
                            </p>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Singer / Artist unspecified</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-amber-200/50 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                          Wedding Playlist Request
                        </span>
                        {rec.createdAt && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(rec.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* QR PASS MODAL */}
      {selectedInviteForPass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl relative text-slate-900">
            <button
              onClick={() => setSelectedInviteForPass(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
                {t('couplePortal.officialPass')}
              </span>
              <h3 className="font-bold text-xl text-slate-900">
                {selectedInviteForPass.guestName}
              </h3>
              <p className="text-xs text-slate-500 font-bold mt-1">
                Headcount Quota: {selectedInviteForPass.maxGuests} Persons
              </p>
            </div>

            <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-2 border-amber-400 flex items-center justify-center shadow-md">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002'}/event/${eventSlug}?code=${selectedInviteForPass.inviteCode}`
                )}`}
                alt="Guest Pass QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs text-slate-900 font-bold">
              {selectedInviteForPass.inviteCode}
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleCopyCode(selectedInviteForPass.inviteCode)}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Copy className="w-4 h-4 text-slate-950" />
                <span>{t('couplePortal.copyDigitalLink')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScopedCouplePortalPage({ params }: { params: { organizerSlug: string; eventSlug: string } }) {
  return (
    <DashboardSecurityGate
      dashboardTitle="Bride & Groom Wedding Portal"
      dashboardId={`couple:${params.eventSlug}`}
      dashboardType="couple"
      slug={params.eventSlug}
      defaultEmail={`couple@${params.eventSlug}.com`}
    >
      <ScopedCouplePortalContent params={params} />
    </DashboardSecurityGate>
  );
}
