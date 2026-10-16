'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardSecurityGate from '@/components/DashboardSecurityGate';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Calendar, 
  Users, 
  Video, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  KeyRound, 
  Film, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  Archive, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  MapPin, 
  Crown, 
  ScanLine, 
  Share2, 
  Lock, 
  Radio, 
  Send, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Menu,
  X,
  Layers,
  Upload
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface EventCredential {
  fullName: string;
  email: string;
  temporaryPassword?: string;
  role: string;
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
  venueAddress: string;
  dressCode?: string;
  coverImageUrl?: string;
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  coupleCredentials?: {
    email: string;
    temporaryPassword?: string;
  };
  credentials?: {
    couple: EventCredential;
    organizer: EventCredential;
    streamer: EventCredential;
    scanner: EventCredential;
    moderator?: EventCredential;
  };
  stats?: {
    totalInvites: number;
    totalWishes: number;
    totalMedia: number;
  };
}

interface MediaAssetData {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  cdnUrl: string;
  caption: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

function formatEvent(e: any): EventData {
  if (!e) return e;
  const brideName = e.brideName || e.bride_name || '';
  const groomName = e.groomName || e.groom_name || '';
  const venueName = e.venueName || e.venue_name || '';
  const eventDate = e.eventDate || e.event_date || new Date().toISOString();
  const adminApprovalStatus = e.adminApprovalStatus || e.admin_approval_status || 'PENDING';
  const coverImageUrl = e.coverImageUrl || e.cover_image_url || undefined;
  const venueAddress = e.venueAddress || e.venue_address || '';
  const dressCode = e.dressCode || e.dress_code || undefined;
  const youtubeVideoId = e.youtubeVideoId || e.youtube_video_id || undefined;

  return {
    ...e,
    id: e.id,
    slug: e.slug,
    title: e.title || (brideName && groomName ? `${brideName} & ${groomName}'s Wedding` : 'Wedding Event'),
    brideName,
    groomName,
    eventDate,
    venueName,
    venueAddress,
    dressCode,
    coverImageUrl,
    status: e.status || 'COMING_SOON',
    adminApprovalStatus,
    youtubeVideoId,
    stats: {
      totalInvites: Number(e.stats?.totalInvites ?? e.total_invites ?? 0),
      totalWishes: Number(e.stats?.totalWishes ?? e.total_wishes ?? 0),
      totalMedia: Number(e.stats?.totalMedia ?? e.total_media ?? 0),
    },
    coupleCredentials: e.coupleCredentials || {
      email: e.couple_email || `couple@${e.slug}.com`,
      temporaryPassword: 'agafari2026',
    },
    credentials: e.credentials || {
      couple: { fullName: `${brideName} & ${groomName}`, email: e.couple_email || `couple@${e.slug}.com`, temporaryPassword: 'agafari2026', role: 'COUPLE' },
      organizer: { fullName: 'Event Organizer', email: `organizer@${e.slug}.com`, temporaryPassword: 'org2026', role: 'ORGANIZER_OWNER' },
      streamer: { fullName: 'Live Streamer Crew', email: `streamer@${e.slug}.com`, temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
      scanner: { fullName: 'Gate QR Scanner', email: `scanner@${e.slug}.com`, temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
    }
  };
}

export interface OrganizerDashboardViewProps {
  organizerId: string;
}

export function OrganizerDashboardView({ organizerId }: OrganizerDashboardViewProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'WEDDINGS' | 'CREDENTIALS'>('WEDDINGS');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  const [events, setEvents] = useState<EventData[]>([]);
  const [organizerInfo, setOrganizerInfo] = useState<{ agencyName: string; fullName: string; email: string; activeHostingCount?: number; hostedArchiveCount?: number } | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVE' | 'PENDING' | 'REJECTED'>('ALL');
  const [searchFleetQuery, setSearchFleetQuery] = useState('');

  // Form State
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [coupleEmail, setCoupleEmail] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [venueName, setVenueName] = useState('');
  const [expectedGuests, setExpectedGuests] = useState<number | ''>(300);
  const [requestingApproval, setRequestingApproval] = useState(false);
  const [provisionSuccessMsg, setProvisionSuccessMsg] = useState('');
  const [provisionErrorMsg, setProvisionErrorMsg] = useState('');

  const [copiedKey, setCopiedKey] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function initAndLoad() {
      setLoading(true);
      setErrorMsg(null);

      if (typeof window === 'undefined') return;

      const userStr = localStorage.getItem('agafari_user');
      const token = localStorage.getItem('agafari_token');
      const role = localStorage.getItem('agafari_role');

      if (!userStr || !token) {
        router.replace(`/login?redirect=${encodeURIComponent(`/organizer/${organizerId}`)}`);
        return;
      }

      let userObj: any = null;
      try {
        userObj = JSON.parse(userStr);
      } catch {
        router.replace(`/login?redirect=${encodeURIComponent(`/organizer/${organizerId}`)}`);
        return;
      }

      const isSystemAdmin = role === 'SYSTEM_ADMIN' || userObj.role === 'SYSTEM_ADMIN';
      const isOrganizer = role === 'ORGANIZER_OWNER' || role === 'EVENT_ORGANIZER' || userObj.role === 'ORGANIZER_OWNER' || userObj.role === 'EVENT_ORGANIZER';

      if (!isSystemAdmin && !isOrganizer) {
        router.replace('/login');
        return;
      }

      setIsAdminView(isSystemAdmin);

      // ORGANIZER ISOLATION: Mismatch for a non-admin => redirect to their own dashboard
      if (!isSystemAdmin) {
        const myOrgId = userObj.tenantId || userObj.organizerId || userObj.scopeId || userObj.userId;
        if (myOrgId && organizerId !== myOrgId) {
          router.replace(`/organizer/${myOrgId}`);
          return;
        }
      }

      try {
        const reqHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const [eventsRes, mediaRes] = await Promise.all([
          fetch(`/api/organizer/events?id=${encodeURIComponent(organizerId)}`, { headers: reqHeaders }),
          fetch(`/api/organizer/media?id=${encodeURIComponent(organizerId)}`, { headers: reqHeaders }),
        ]);

        if (eventsRes.status === 403) {
          setErrorMsg('Forbidden — You are not authorized to access another organizer’s events or dashboard.');
          setLoading(false);
          return;
        }

        if (eventsRes.status === 404) {
          const errData = await eventsRes.json().catch(() => ({}));
          setErrorMsg(errData.error || `Organizer account "${organizerId}" was not found.`);
          setLoading(false);
          return;
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          const loadedEvents: EventData[] = (eventsData.events || []).map(formatEvent);
          setEvents(loadedEvents);
          if (eventsData.organizerInfo) {
            setOrganizerInfo(eventsData.organizerInfo);
          } else {
            setOrganizerInfo({
              agencyName: 'Executive Organizer Suite',
              fullName: userObj.fullName || userObj.email,
              email: userObj.email || '',
            });
          }

          if (loadedEvents.length > 0) {
            setSelectedEvent(loadedEvents[0]);
          } else {
            setSelectedEvent(null);
          }
        } else {
          setErrorMsg(`Failed to fetch organizer profile. Server responded with status ${eventsRes.status}.`);
        }

        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          setMediaAssets(mediaData.mediaAssets || []);
        }
      } catch (err) {
        console.error('Failed to load organizer dashboard data:', err);
        setErrorMsg('A network error occurred while connecting to the server.');
      } finally {
        setLoading(false);
      }
    }

    initAndLoad();
  }, [organizerId, router]);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agafari_user');
      localStorage.removeItem('agafari_role');
      localStorage.removeItem('agafari_token');
      document.cookie = 'agafari_token=; path=/; max-age=0';
      document.cookie = 'agafari_session=; path=/; max-age=0';
    }
    router.push('/login');
  };

  const handleRequestCoupleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisionErrorMsg('');
    setProvisionSuccessMsg('');

    if (isAdminView) {
      setProvisionErrorMsg('Admin access to organizer dashboard is read-only. Action prohibited.');
      return;
    }

    if (!brideName.trim() || !groomName.trim() || !coupleEmail.trim() || !venueName.trim() || expectedGuests === '' || Number(expectedGuests) < 1) {
      setProvisionErrorMsg('Please fill in all required fields (Bride Name, Groom Name, Couple Email, Venue, and Expected Guest Limit).');
      return;
    }

    const generatedTitle = `${brideName.trim()} & ${groomName.trim()}'s Wedding`;
    const generatedSlug = `${brideName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}-and-${groomName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;

    setRequestingApproval(true);
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('agafari_token') : null;
      const res = await fetch(`/api/organizer/events?id=${encodeURIComponent(organizerId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify({
          title: generatedTitle,
          slug: generatedSlug,
          brideName: brideName.trim(),
          groomName: groomName.trim(),
          coupleEmail: coupleEmail.trim(),
          eventDate,
          venueName: venueName.trim(),
          expectedGuests: Number(expectedGuests),
          organizerId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.event) {
        const formattedEvent = formatEvent(data.event);
        setEvents((prev) => [formattedEvent, ...prev.filter((e) => e.id !== formattedEvent.id)]);
        setSelectedEvent(formattedEvent);
        setProvisionSuccessMsg(
          `⏳ Wedding request for "${formattedEvent.title}" submitted successfully! Status: Awaiting System Admin Verification.`
        );
        setBrideName('');
        setGroomName('');
        setCoupleEmail('');
        setVenueName('');
      } else {
        setProvisionErrorMsg(data.error || 'Failed to submit event request.');
      }
    } catch (err) {
      setProvisionErrorMsg('Server error. Please try again.');
    } finally {
      setRequestingApproval(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 3000);
  };

  const toggleShowPassword = (key: string) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeHostingEvents = events.filter((e) => e.status !== 'COMPLETED' && e.status !== 'ARCHIVED' && (e.adminApprovalStatus === 'APPROVED'));
  const hostedArchiveEvents = events.filter((e) => e.status === 'COMPLETED' || e.status === 'ARCHIVED');
  const pendingAdminEvents = events.filter((e) => (e.adminApprovalStatus === 'PENDING'));
  const rejectedAdminEvents = events.filter((e) => (e.adminApprovalStatus === 'REJECTED'));

  const filteredEvents = events.filter((evt) => {
    const titleStr = (evt.title || '').toLowerCase();
    const venueStr = (evt.venueName || '').toLowerCase();
    const brideStr = (evt.brideName || '').toLowerCase();
    const groomStr = (evt.groomName || '').toLowerCase();
    const query = searchFleetQuery.toLowerCase();

    if (!titleStr.includes(query) && !venueStr.includes(query) && !brideStr.includes(query) && !groomStr.includes(query)) {
      return false;
    }

    if (fleetFilter === 'ALL') return true;
    if (fleetFilter === 'ACTIVE') return evt.status !== 'COMPLETED' && evt.status !== 'ARCHIVED' && evt.adminApprovalStatus === 'APPROVED';
    if (fleetFilter === 'ARCHIVE') return evt.status === 'COMPLETED' || evt.status === 'ARCHIVED';
    if (fleetFilter === 'PENDING') return evt.adminApprovalStatus === 'PENDING';
    if (fleetFilter === 'REJECTED') return evt.adminApprovalStatus === 'REJECTED';
    return true;
  });

  const displayAgencyName = organizerInfo?.agencyName || 'Event Production Agency';
  const displayOrganizerSubTitle = organizerInfo?.fullName || organizerInfo?.email || 'ORGANIZER OWNER SUITE';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-gold-400 font-serif p-6">
        <div className="text-center space-y-4">
          <Crown className="w-12 h-12 animate-bounce mx-auto text-gold-400" />
          <p className="text-sm font-bold tracking-wider">Loading Organizer Dashboard ({organizerId})...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !organizerInfo) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-white font-sans">
        <div className="p-8 max-w-md w-full rounded-3xl bg-gray-900 border border-gold-500/30 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto font-bold">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-white">Organizer Dashboard Error</h2>
            <p className="text-xs text-gray-400 leading-relaxed mt-2">
              {errorMsg || `No matching event organizer was found for ID "${organizerId}".`}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/admin"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Return to Admin Portal</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-all"
            >
              Sign In with Another Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-950 text-white flex flex-col justify-between border-r border-gold-500/30 transition-transform duration-300 ease-in-out
        md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          <div className="p-6 border-b border-gold-500/20 overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src="/branding/artboard-13.png"
                  alt="Agafari Logo"
                  className="h-10 w-auto object-contain shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif font-bold text-sm sm:text-base text-gold-400 tracking-wide truncate" title={displayAgencyName}>
                    {displayAgencyName}
                  </h2>
                  <div className="text-[10px] text-gold-500/80 font-semibold uppercase tracking-wider truncate mt-0.5" title={displayOrganizerSubTitle}>
                    {displayOrganizerSubTitle}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1 text-white/70 hover:text-white shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAdminView && (
              <div className="mt-3 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider text-center">
                System Admin Audited View (Read-Only)
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                <div className="text-emerald-400 font-bold text-base">{activeHostingEvents.length}</div>
                <div className="text-white/70 text-[10px]">{t('organizerDashboard.kpiHosting')}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                <div className="text-[#D4AF37] font-bold text-base">{hostedArchiveEvents.length}</div>
                <div className="text-white/70 text-[10px]">{t('organizerDashboard.kpiArchive')}</div>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('WEDDINGS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'WEDDINGS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-gold-400" />
                <span>{t('organizerDashboard.tabs.weddings')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {events.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('CREDENTIALS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'CREDENTIALS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <KeyRound className="w-4 h-4 text-gold-400" />
                <span>{t('organizerDashboard.tabs.credentials')}</span>
              </div>
              {pendingAdminEvents.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 font-bold">
                  {pendingAdminEvents.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2.5 px-3 rounded-xl hover:bg-rose-950/40 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.signOut', 'Sign Out')}</span>
          </button>
        </div>
      </aside>

      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        />
      )}

      {/* MAIN WORKSPACE */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gold-500/30 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[11px] text-gold-600 font-semibold uppercase tracking-wider">
                {t('organizerDashboard.header.tag')}
              </div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-gray-900">
                {activeTab === 'WEDDINGS' && t('organizerDashboard.header.title')}
                {activeTab === 'CREDENTIALS' && t('organizerDashboard.credentials.title')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            {!isAdminView && (
              <button
                onClick={() => setActiveTab('CREDENTIALS')}
                className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-gold-500/40"
              >
                <Plus className="w-3.5 h-3.5 text-gold-400" />
                <span className="hidden sm:inline">{t('organizerDashboard.header.requestBtn')}</span>
              </button>
            )}

            <LanguageSwitcher />
          </div>
        </header>

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'WEDDINGS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setFleetFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ALL'
                        ? 'bg-black text-gold-400 shadow-sm'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {t('organizerDashboard.fleet.all')} ({events.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('ACTIVE')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ACTIVE'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-gray-50 text-emerald-900 hover:bg-emerald-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.active')} ({activeHostingEvents.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('ARCHIVE')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ARCHIVE'
                        ? 'bg-blue-800 text-white shadow-sm'
                        : 'bg-gray-50 text-blue-900 hover:bg-blue-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.archive')} ({hostedArchiveEvents.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('PENDING')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'PENDING'
                        ? 'bg-amber-800 text-white shadow-sm'
                        : 'bg-gray-50 text-amber-900 hover:bg-amber-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.pending')} ({pendingAdminEvents.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('REJECTED')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'REJECTED'
                        ? 'bg-rose-800 text-white shadow-sm'
                        : 'bg-gray-50 text-rose-900 hover:bg-rose-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.rejected') || 'Rejected'} ({rejectedAdminEvents.length})
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFleetQuery}
                    onChange={(e) => setSearchFleetQuery(e.target.value)}
                    placeholder={t('organizerDashboard.fleet.searchPlaceholder')}
                    className="pl-8 pr-4 py-1.5 rounded-xl border border-gold-500/30 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
                  <Layers className="w-12 h-12 text-gold-500 mx-auto" />
                  <h3 className="font-serif font-bold text-xl text-gray-900">No Hosted Weddings Registered Yet</h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                    Submit your wedding credential request under Tab 2 to initiate event creation.
                  </p>
                  {!isAdminView && (
                    <button onClick={() => setActiveTab('CREDENTIALS')} className="px-6 py-3 rounded-xl bg-black text-gold-400 font-bold text-xs shadow-md">
                      Request Admin Approval & Provision Couple Credentials →
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((evt) => {
                    const isSelected = selectedEvent?.id === evt.id;
                    const adminStatus = evt.adminApprovalStatus || 'PENDING';

                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`
                          rounded-3xl p-5 border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden bg-white
                          ${isSelected ? 'border-gold-500 ring-2 ring-gold-500/50 shadow-lg' : 'border-gold-500/30 hover:border-gold-500 shadow-sm hover:shadow-md hover:scale-[1.01]'}
                        `}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              {evt.eventDate ? new Date(evt.eventDate).toLocaleDateString() : 'Date TBD'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              adminStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                              adminStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {adminStatus}
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-base text-gray-900 leading-snug line-clamp-1">
                            {evt.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 line-clamp-1">
                            <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                            <span>{evt.venueName || 'Venue TBD'}</span>
                          </p>

                          <div className="mt-4 grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-gray-50 border border-gray-100">
                            <div>
                              <div className="text-xs font-bold text-gray-800">{evt.stats?.totalInvites || 0}</div>
                              <div className="text-[9px] text-gray-400 uppercase">Invites</div>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-800">{evt.stats?.totalWishes || 0}</div>
                              <div className="text-[9px] text-gray-400 uppercase">Wishes</div>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-800">{evt.stats?.totalMedia || 0}</div>
                              <div className="text-[9px] text-gray-400 uppercase">Media</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                          <span className="text-gray-400 text-[10px]">Slug: {evt.slug}</span>
                          <span className="text-gold-600 hover:text-gold-700 font-bold flex items-center gap-1">
                            Inspect <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Event Detail View */}
              {selectedEvent && (
                <div className="p-6 rounded-3xl bg-white border border-gold-500/30 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-[10px] text-gold-600 font-bold uppercase tracking-wider">Event Detail View</span>
                      <h2 className="font-serif font-bold text-xl text-gray-900">{selectedEvent.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        selectedEvent.adminApprovalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        selectedEvent.adminApprovalStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        Status: {selectedEvent.adminApprovalStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-gray-50 space-y-2 border border-gray-100">
                      <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Wedding Logistics</h4>
                      <div><span className="text-gray-500">Date:</span> <span className="font-semibold">{selectedEvent.eventDate}</span></div>
                      <div><span className="text-gray-500">Venue:</span> <span className="font-semibold">{selectedEvent.venueName}</span></div>
                      <div><span className="text-gray-500">Address:</span> <span className="font-semibold">{selectedEvent.venueAddress || 'Not set'}</span></div>
                      <div><span className="text-gray-500">Dress Code:</span> <span className="font-semibold">{selectedEvent.dressCode || 'Standard'}</span></div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 space-y-2 border border-gray-100">
                      <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Couple Information</h4>
                      <div><span className="text-gray-500">Bride & Groom:</span> <span className="font-semibold">{selectedEvent.brideName} & {selectedEvent.groomName}</span></div>
                      <div><span className="text-gray-500">Couple Email:</span> <span className="font-semibold">{selectedEvent.coupleCredentials?.email || 'Not configured'}</span></div>
                      <div><span className="text-gray-500">Event Slug:</span> <span className="font-mono font-semibold">{selectedEvent.slug}</span></div>
                      <div><span className="text-gray-500">Event ID:</span> <span className="font-mono text-gray-600">{selectedEvent.id}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'CREDENTIALS' && (
            <div className="p-8 rounded-3xl bg-white border border-gold-500/30 shadow-md space-y-6 max-w-2xl mx-auto">
              <div>
                <span className="text-[10px] text-gold-600 font-bold uppercase tracking-wider">Pillar 1 Provisioning</span>
                <h2 className="font-serif font-bold text-2xl text-gray-900 mt-1">Request Admin Approval & Couple Credentials</h2>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  Submit wedding details for System Super Admin review. Upon approval, couple credentials and event feeds activate automatically.
                </p>
              </div>

              {provisionSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{provisionSuccessMsg}</p>
                </div>
              )}

              {provisionErrorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{provisionErrorMsg}</p>
                </div>
              )}

              <form onSubmit={handleRequestCoupleCredentials} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Bride Full Name *</label>
                    <input
                      type="text"
                      required
                      disabled={isAdminView}
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="e.g. Bethlehem Tilahun"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Groom Full Name *</label>
                    <input
                      type="text"
                      required
                      disabled={isAdminView}
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="e.g. Yonas Girma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Couple Email Address *</label>
                  <input
                    type="email"
                    required
                    disabled={isAdminView}
                    value={coupleEmail}
                    onChange={(e) => setCoupleEmail(e.target.value)}
                    placeholder="couple@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Event Date *</label>
                    <input
                      type="date"
                      required
                      disabled={isAdminView}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Expected Guests Limit *</label>
                    <input
                      type="number"
                      required
                      min={10}
                      disabled={isAdminView}
                      value={expectedGuests}
                      onChange={(e) => setExpectedGuests(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="300"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Venue / Reception Location *</label>
                  <input
                    type="text"
                    required
                    disabled={isAdminView}
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g. Sheraton Addis, Lalibela Ballroom"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={requestingApproval || isAdminView}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black text-xs font-bold shadow-md hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {requestingApproval ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Wedding for Admin Approval</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}

export default OrganizerDashboardView;
