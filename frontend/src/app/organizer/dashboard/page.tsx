'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
      couple: { fullName: `${brideName} & ${groomName}`, email: e.couple_email || `couple@${e.slug}.com`, temporaryPassword: 'agafari2026', role: 'BRIDE_GROOM' },
      organizer: { fullName: 'Event Organizer', email: `organizer@${e.slug}.com`, temporaryPassword: 'org2026', role: 'EVENT_ORGANIZER' },
      streamer: { fullName: 'Live Streamer Crew', email: `streamer@${e.slug}.com`, temporaryPassword: 'stream123', role: 'LIVE_STREAMER' },
      scanner: { fullName: 'Gate QR Scanner', email: `scanner@${e.slug}.com`, temporaryPassword: 'scan123', role: 'GATE_SCANNER' },
    }
  };
}

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();

  // Navigation: 'WEDDINGS' (Pillar 2) | 'CREDENTIALS' (Pillar 1)
  const [activeTab, setActiveTab] = useState<'WEDDINGS' | 'CREDENTIALS'>('WEDDINGS');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Organizer URL slug derived from the ?id= param (used to build event deep-link URLs)
  const [organizerUrlSlug, setOrganizerUrlSlug] = useState<string>('');

  const [events, setEvents] = useState<EventData[]>([]);
  const [organizerInfo, setOrganizerInfo] = useState<{ agencyName: string; fullName: string; email: string; activeHostingCount?: number; hostedArchiveCount?: number } | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected Wedding for Deep Inspection (Pillar 2)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Wedding Fleet Directory Filters
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVE' | 'PENDING' | 'REJECTED'>('ALL');
  const [searchFleetQuery, setSearchFleetQuery] = useState('');

  // Pillar 1: Request Admin Approval & Provision Couple Credentials Form State
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [coupleEmail, setCoupleEmail] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [venueName, setVenueName] = useState('');
  const [expectedGuests, setExpectedGuests] = useState<number | ''>(300);
  const [requestingApproval, setRequestingApproval] = useState(false);
  const [provisionSuccessMsg, setProvisionSuccessMsg] = useState('');
  const [provisionErrorMsg, setProvisionErrorMsg] = useState('');
  const [newlyProvisionedCreds, setNewlyProvisionedCreds] = useState<{ email: string; pass: string; slug: string } | null>(null);

  // Password Visibility State & Copied feedback
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('agafari_user');
      const token = localStorage.getItem('agafari_token');
      const role = localStorage.getItem('agafari_role');
      if (!userStr || !token || (role !== 'EVENT_ORGANIZER' && role !== 'SYSTEM_ADMIN')) {
        localStorage.removeItem('agafari_user');
        localStorage.removeItem('agafari_role');
        localStorage.removeItem('agafari_token');
        document.cookie = 'agafari_token=; path=/; max-age=0';
        router.push('/organizer/login');
        return;
      }
    }
    async function loadOrganizerData() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const orgId = urlParams?.get('id') || urlParams?.get('organizerId');

        const userStr = typeof window !== 'undefined' ? localStorage.getItem('agafari_user') : null;
        const userObj = userStr ? JSON.parse(userStr) : null;
        const effectiveOrgId = orgId || userObj?.userId || 'org-certified';

        // Derive the organizer URL slug used in /{organizerSlug}/{eventSlug} deep links
        const derivedSlug = effectiveOrgId.startsWith('org-') ? effectiveOrgId : `org-${effectiveOrgId}`;
        setOrganizerUrlSlug(derivedSlug);

        const eventsApiUrl = `/api/organizer/events?id=${encodeURIComponent(effectiveOrgId)}`;
        const mediaApiUrl = `/api/organizer/media?id=${encodeURIComponent(effectiveOrgId)}`;

        const reqHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('agafari_token');
          if (storedToken) reqHeaders['Authorization'] = `Bearer ${storedToken}`;
        }

        const [eventsRes, mediaRes] = await Promise.all([
          fetch(eventsApiUrl, { headers: reqHeaders }),
          fetch(mediaApiUrl, { headers: reqHeaders }),
        ]);

        if (eventsRes.status === 404) {
          const errData = await eventsRes.json().catch(() => ({}));
          setErrorMsg(errData.error || `Organizer account with ID "${orgId}" was not found.`);
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
            setErrorMsg(`No organizer profile data found for ID "${orgId}".`);
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

    loadOrganizerData();
  }, [router]);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agafari_user');
      localStorage.removeItem('agafari_role');
      document.cookie = 'agafari_token=; path=/; max-age=0';
    }
    router.push('/organizer/login');
  };

  // Pillar 1 Handler: Request Admin Approval & Provision Couple Credentials
  const handleRequestCoupleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisionErrorMsg('');
    setProvisionSuccessMsg('');

    if (!brideName.trim() || !groomName.trim() || !coupleEmail.trim() || !venueName.trim() || expectedGuests === '' || Number(expectedGuests) < 1) {
      setProvisionErrorMsg('Please fill in all required fields (Bride Name, Groom Name, Couple Email, Venue, and Expected Guest Limit).');
      return;
    }

    const generatedTitle = `${brideName.trim()} & ${groomName.trim()}'s Wedding`;
    const generatedSlug = `${brideName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}-and-${groomName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;

    const orgId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') : null;
    const postUrl = '/api/organizer/events' + (orgId ? `?id=${encodeURIComponent(orgId)}` : '');

    setRequestingApproval(true);
    try {
      const res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedTitle,
          slug: generatedSlug,
          brideName: brideName.trim(),
          groomName: groomName.trim(),
          coupleEmail: coupleEmail.trim(),
          eventDate,
          venueName: venueName.trim(),
          expectedGuests: Number(expectedGuests),
          organizerId: orgId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.event) {
        const formattedEvent = formatEvent(data.event);
        if (data.coupleCredentials) {
          formattedEvent.coupleCredentials = data.coupleCredentials;
          if (formattedEvent.credentials?.couple) {
            formattedEvent.credentials.couple.email = data.coupleCredentials.email;
            formattedEvent.credentials.couple.temporaryPassword = data.coupleCredentials.temporaryPassword;
          }
        }

        setEvents((prev) => {
          const filtered = prev.filter((e) => e.id !== formattedEvent.id && e.slug !== formattedEvent.slug);
          return [formattedEvent, ...filtered];
        });
        setSelectedEvent(formattedEvent);
        setNewlyProvisionedCreds(null);
        setProvisionSuccessMsg(
          `⏳ Wedding request for "${formattedEvent.title}" submitted successfully! Status: Awaiting System Admin Verification. Couple credentials and portal access will activate upon System Admin approval under Admin Approvals.`
        );
        setBrideName('');
        setGroomName('');
        setCoupleEmail('');
        setVenueName('');
      } else {
        setProvisionErrorMsg(data.error || 'Failed to submit event request.');
      }
    } catch (err) {
      console.error('Failed to provision couple credentials:', err);
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

  // Metrics Calculations
  const activeHostingEvents = events.filter((e) => e.status !== 'COMPLETED' && e.status !== 'ARCHIVED' && (e.adminApprovalStatus || (e as any).admin_approval_status) === 'APPROVED');
  const hostedArchiveEvents = events.filter((e) => e.status === 'COMPLETED' || e.status === 'ARCHIVED');
  const pendingAdminEvents = events.filter((e) => (e.adminApprovalStatus || (e as any).admin_approval_status) === 'PENDING');
  const rejectedAdminEvents = events.filter((e) => (e.adminApprovalStatus || (e as any).admin_approval_status) === 'REJECTED');

  // Filtered Events according to Fleet filter
  const filteredEvents = events.filter((evt) => {
    const titleStr = (evt.title || '').toLowerCase();
    const venueStr = (evt.venueName || (evt as any).venue_name || '').toLowerCase();
    const brideStr = (evt.brideName || (evt as any).bride_name || '').toLowerCase();
    const groomStr = (evt.groomName || (evt as any).groom_name || '').toLowerCase();
    const query = searchFleetQuery.toLowerCase();

    const matchesSearch = titleStr.includes(query) || venueStr.includes(query) || brideStr.includes(query) || groomStr.includes(query);
    if (!matchesSearch) return false;

    const adminStatus = evt.adminApprovalStatus || (evt as any).admin_approval_status || 'PENDING';

    if (fleetFilter === 'ALL') return true;
    if (fleetFilter === 'ACTIVE') return evt.status !== 'COMPLETED' && evt.status !== 'ARCHIVED' && adminStatus === 'APPROVED';
    if (fleetFilter === 'ARCHIVE') return evt.status === 'COMPLETED' || evt.status === 'ARCHIVED';
    if (fleetFilter === 'PENDING') return adminStatus === 'PENDING';
    if (fleetFilter === 'REJECTED') return adminStatus === 'REJECTED';
    return true;
  });

  // Helper to format clean Agency Name & ID for top sidebar header
  const rawOrgIdParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') : null;
  const currentOrgId = rawOrgIdParam || 'org-certified';
  const displayOrgId = currentOrgId.length > 22 ? `${currentOrgId.slice(0, 18)}...` : currentOrgId;

  function getDynamicAgencyTitle(orgIdParam: string | null, info: { agencyName?: string; fullName?: string; email?: string } | null): string {
    const rawName = info?.agencyName || info?.fullName;
    const email = info?.email;

    // 1. If clean custom name exists, return it
    if (
      rawName &&
      !rawName.startsWith('org-') &&
      !rawName.includes('@') &&
      rawName.trim() !== 'Event Organizer' &&
      !rawName.startsWith('Organizer Agency') &&
      rawName.trim() !== 'Certified Event Agency & Planners' &&
      !/[0-9a-f]{8,}/i.test(rawName)
    ) {
      return rawName.trim();
    }

    // 2. If email exists and is valid (e.g. kanaevents@gmail.com, anansiy861@gmail.com)
    if (email && email.includes('@') && !email.startsWith('organizer-')) {
      const uname = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
      const titleCase = uname.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return `${titleCase} Event Production Agency`;
    }

    // 3. Derive from URL orgId parameter if available
    if (orgIdParam) {
      const cleanId = orgIdParam.replace(/^org-/, '').trim();
      if (cleanId && !/[0-9a-f]{8,}/i.test(cleanId)) {
        const titleCase = cleanId.replace(/[^a-zA-Z0-9]/g, ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return `${titleCase} Event Agency`;
      }
    }

    // 4. Universal default (neutral, no hardcoded agency names)
    return 'Event Organizer Agency Suite';
  }

  const displayAgencyName = getDynamicAgencyTitle(rawOrgIdParam, organizerInfo);

  const displayOrganizerSubTitle =
    organizerInfo?.fullName && !organizerInfo.fullName.includes('@') && organizerInfo.fullName.trim() !== 'Event Organizer'
      ? organizerInfo.fullName.trim()
      : (organizerInfo?.email && !organizerInfo.email.startsWith('organizer-') ? organizerInfo.email : 'EVENT ORGANIZER SUITE');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-gold-400 font-serif p-6">
        <div className="text-center space-y-4">
          <Crown className="w-12 h-12 animate-bounce mx-auto text-gold-400" />
          <p className="text-sm font-bold tracking-wider">Loading Executive Organizer Dashboard...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !organizerInfo) {
    const rawOrgIdParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') : null;
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-white font-sans selection:bg-gold-500 selection:text-black">
        <div className="p-8 max-w-md w-full rounded-3xl bg-gray-900 border border-gold-500/30 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto font-bold">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-white">Organizer Profile Error</h2>
            <p className="text-xs text-gray-400 leading-relaxed mt-2">
              {errorMsg || `No matching event organizer partner was found for ID "${rawOrgIdParam || 'Unspecified'}".`}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/admin/dashboard"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Return to Super Admin Dashboard</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              href="/organizer/login"
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-all"
            >
              Organizer Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex font-sans selection:bg-gold-500 selection:text-black">
      
      {/* =========================================================================
          1. ORGANIZER STRUCTURED EXECUTIVE SIDEBAR
         ========================================================================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-950 text-white flex flex-col justify-between border-r border-gold-500/30 transition-transform duration-300 ease-in-out
        md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-gold-500/20 overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src="/branding/artboard-13.png"
                  alt="Agafari (አጋፋሪ) Logo"
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

            {/* Quick Metrics */}
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

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            
            {/* Pillar 2: Hosted & Active Weddings */}
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

            {/* Pillar 1: Couple Credentials Provisioning */}
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

        {/* Footer */}
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

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        />
      )}

      {/* =========================================================================
          2. MAIN WORKSPACE
         ========================================================================= */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        
        {/* Top Header */}
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
            <button
              onClick={() => setActiveTab('CREDENTIALS')}
              className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-gold-500/40"
            >
              <Plus className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">{t('organizerDashboard.header.requestBtn')}</span>
            </button>

            <LanguageSwitcher />
          </div>
        </header>

        {/* Workspace Body */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* =========================================================================
              PILLAR 2: HOSTED & ACTIVE WEDDINGS DIRECTORY & 1-CLICK ROLE LAUNCH
             ========================================================================= */}
          {activeTab === 'WEDDINGS' && (
            <div className="space-y-6">
              
              {/* Filter Pills & Search */}
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
                    {t('organizerDashboard.fleet.rejected') || '🔴 Rejected / Action Required'} ({rejectedAdminEvents.length})
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

              {/* Event Cards Grid */}
              {filteredEvents.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
                  <Layers className="w-12 h-12 text-gold-500 mx-auto" />
                  <h3 className="font-serif font-bold text-xl text-gray-900">No Hosted Weddings Registered Yet</h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                    Everything starts from the System Super Admin portal. Submit your first wedding credential request under Tab 2 below or ask your System Super Admin.
                  </p>
                  <button onClick={() => setActiveTab('CREDENTIALS')} className="px-6 py-3 rounded-xl bg-black text-gold-400 font-bold text-xs shadow-md">
                    Request Admin Approval & Provision Couple Credentials →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((evt) => {
                    const isSelected = selectedEvent?.id === evt.id;
                    const isArchive = evt.status === 'COMPLETED' || evt.status === 'ARCHIVED';
                    const adminStatus = evt.adminApprovalStatus || (evt as any).admin_approval_status || 'PENDING';

                  return (
                    <div
                      key={evt.id}
                      onClick={() => {
                        // Navigate to the dedicated event management page
                        const destination = `/${organizerUrlSlug}/${evt.slug}`;
                        router.push(destination);
                      }}
                      className={`
                        rounded-3xl p-5 border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden bg-white
                        ${isSelected ? 'border-gold-500 ring-2 ring-gold-500/50 shadow-lg' : 'border-gold-500/30 hover:border-gold-500 shadow-sm hover:shadow-md hover:scale-[1.01]'}
                      `}
                    >
                      <div>
                        {/* Status Badges */}
                        <div className="flex items-center justify-between mb-3">
                          {adminStatus === 'PENDING' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                              🟡 Pending Admin
                            </span>
                          ) : adminStatus === 'REJECTED' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold">
                              🔴 Rejected by Admin
                            </span>
                          ) : isArchive ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                              📜 Hosted Archive
                            </span>
                          ) : evt.status === 'LIVE' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold animate-pulse">
                              🔴 LIVE NOW
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                              🟢 Active Hosting
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-gold-700 font-bold">
                            {new Date(evt.eventDate).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Image / Header */}
                        <div className="h-32 rounded-2xl overflow-hidden mb-3 relative bg-black/10">
                          {evt.coverImageUrl ? (
                            <img
                              src={evt.coverImageUrl}
                              alt={evt.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black text-gold-400 font-serif font-bold">
                              {evt.brideName} & {evt.groomName}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-white">
                            <div>
                              <div className="font-serif font-bold text-sm">{evt.brideName} & {evt.groomName}</div>
                              <div className="text-[10px] text-gold-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {evt.venueName}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-gray-50 p-2 rounded-xl mb-3 border border-gold-500/20">
                          <div>
                            <div className="font-bold text-gray-900">{evt.stats?.totalInvites ?? 0}</div>
                            <div className="text-gray-500">Invited</div>
                          </div>
                          <div>
                            <div className="font-bold text-emerald-800">{evt.stats?.totalWishes ?? 0}</div>
                            <div className="text-gray-500">Wishes</div>
                          </div>
                          <div>
                            <div className="font-bold text-gold-600">{evt.stats?.totalMedia ?? 0}</div>
                            <div className="text-gray-500">Reels</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                        <span className="text-gold-600 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          Open Event Dashboard
                        </span>
                        <ChevronRight className="w-4 h-4 text-gold-500 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
              )}

              {/* =========================================================================
              {/* End of Fleet Cards Grid */}
            </div>
          )}

          {/* =========================================================================
              PILLAR 1: PROVISION COUPLE CREDENTIALS & REQUEST ADMIN APPROVAL
             ========================================================================= */}
          {activeTab === 'CREDENTIALS' && (
            <div className="space-y-6">
              
              {/* Form Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gold-500/20">
                  <div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-gray-900 flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-gold-500" />
                      {t('organizerDashboard.credentials.title')}
                    </h2>
                    <p className="text-xs text-gray-600 font-light mt-0.5">
                      {t('organizerDashboard.credentials.subtitle')}
                    </p>
                  </div>
                </div>

                {provisionSuccessMsg && (
                  <div className="mb-6 p-5 rounded-2xl bg-amber-50/90 border-[1.5px] border-amber-300 text-amber-950 text-xs space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                      <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
                      <span>Wedding Onboarding Request Sent to Admin!</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed font-normal">
                      {provisionSuccessMsg}
                    </p>
                  </div>
                )}

                {provisionErrorMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-xs font-bold flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{provisionErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRequestCoupleCredentials} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('organizerDashboard.credentials.brideName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="e.g. Bethlehem Assefa"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('organizerDashboard.credentials.groomName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="e.g. Henok Girma"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('organizerDashboard.credentials.email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={coupleEmail}
                      onChange={(e) => setCoupleEmail(e.target.value)}
                      placeholder="couple@bethlehem-henok.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('organizerDashboard.credentials.date')}
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      Expected Guest Limit / Quota (Max Guests) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="50000"
                      value={expectedGuests}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExpectedGuests(val === '' ? '' : Number(val));
                      }}
                      onBlur={() => {
                        if (expectedGuests === '' || Number(expectedGuests) < 1) {
                          setExpectedGuests(1);
                        }
                      }}
                      placeholder="e.g. 300"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('organizerDashboard.credentials.venue')}
                    </label>
                    <input
                      type="text"
                      required
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="e.g. Skylight Hotel Grand Ballroom, Addis Ababa"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end pt-3">
                    <button
                      type="submit"
                      disabled={requestingApproval}
                      className="px-8 py-3.5 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center gap-2 border border-gold-500/40"
                    >
                      <Send className="w-4 h-4 text-gold-400" />
                      <span>{requestingApproval ? t('organizerDashboard.credentials.submittingBtn') : t('organizerDashboard.credentials.submitBtn')}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Status Tracking Table */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  {t('organizerDashboard.credentials.trackerTitle')}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gold-500/20 text-[10px] text-gold-700 font-bold uppercase tracking-wider bg-gray-50">
                        <th className="py-3 px-4 rounded-l-xl">Wedding Title</th>
                        <th className="py-3 px-4">Couple Contact Login</th>
                        <th className="py-3 px-4">Admin Verification</th>
                        <th className="py-3 px-4 text-right rounded-r-xl">1-Click Portal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {events.map((evt) => (
                        <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-serif font-bold text-gray-900">
                            {evt.title}
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-600">
                            {evt.coupleCredentials?.email || `couple@${evt.slug}.com`}
                          </td>
                          <td className="py-3 px-4">
                            {evt.adminApprovalStatus === 'APPROVED' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                <Clock className="w-3 h-3 text-amber-700" /> Pending Admin
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {evt.adminApprovalStatus === 'APPROVED' ? (
                              <Link
                                href={`/${(evt as any).organizer_id || (evt as any).organizerId || currentOrgId || 'org-default'}/${evt.slug}/couple`}
                                className="px-3 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold shadow-sm inline-flex items-center gap-1 border border-gold-500/30"
                              >
                                <span>Launch Couple Suite</span>
                                <ExternalLink className="w-3 h-3 text-gold-400" />
                              </Link>
                            ) : (
                              <span className="px-3.5 py-1.5 rounded-lg bg-amber-100/80 text-amber-900 border border-amber-300 text-[11px] font-bold inline-flex items-center gap-1 opacity-85 cursor-not-allowed">
                                <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                                <span>Awaiting Admin Approval</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Floating Mobile Bottom Ball Navigation Menu (Replacing Hamburger Button) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border-2 border-gold-500/50 rounded-full px-5 py-2.5 flex items-center gap-4 shadow-2xl ring-2 ring-gold-500/20">
        <button
          onClick={() => setActiveTab('WEDDINGS')}
          className={`p-3 rounded-full transition-all flex items-center justify-center ${
            activeTab === 'WEDDINGS'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-lg scale-110'
              : 'text-gold-400/80 hover:text-gold-400 hover:bg-white/10'
          }`}
          title={t('organizerDashboard.tabs.weddings')}
        >
          <Layers className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('CREDENTIALS')}
          className={`p-3 rounded-full transition-all flex items-center justify-center relative ${
            activeTab === 'CREDENTIALS'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-lg scale-110'
              : 'text-gold-400/80 hover:text-gold-400 hover:bg-white/10'
          }`}
          title={t('organizerDashboard.tabs.credentials')}
        >
          <KeyRound className="w-5 h-5" />
          {pendingAdminEvents.length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <Link
          href="/organizer/login"
          className="p-3 rounded-full text-rose-400/90 hover:text-rose-400 hover:bg-rose-950/40 transition-all flex items-center justify-center"
          title={t('nav.signOut')}
        >
          <LogOut className="w-5 h-5" />
        </Link>
      </nav>

    </div>
  );
}
