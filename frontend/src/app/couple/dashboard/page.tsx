'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Image as ImageIcon 
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
  mediaType: 'VIDEO' | 'IMAGE';
  category?: 'BTS' | 'WISHES' | 'LIVE';
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

export default function CoupleDashboardPage() {
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventData | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>([]);
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Permitted total quota allocated by Organizer/Admin
  const [permittedTotalQuota, setPermittedTotalQuota] = useState(150);

  // Active Navigation Tab: 'GUESTS' | 'MEDIA'
  const [activeTab, setActiveTab] = useState<'GUESTS' | 'MEDIA'>('GUESTS');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    async function loadCoupleDashboardData() {
      try {
        let coupleEventSlug: string | null = null;
        let orgId = 'org-default';
        const eventsRes = await fetch('/api/organizer/events');
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          if (eventsData.events && eventsData.events.length > 0) {
            coupleEventSlug = eventsData.events[0].slug;
            if (eventsData.events[0].organizer_id || eventsData.events[0].organizerId) {
              orgId = eventsData.events[0].organizer_id || eventsData.events[0].organizerId;
            }
          }
        }

        if (!coupleEventSlug) {
          const pubRes = await fetch('/api/admin/events');
          if (pubRes.ok) {
            const pubData = await pubRes.json();
            if (pubData.events && pubData.events.length > 0) {
              coupleEventSlug = pubData.events[0].slug;
              if (pubData.events[0].organizer_id || pubData.events[0].organizerId) {
                orgId = pubData.events[0].organizer_id || pubData.events[0].organizerId;
              }
            }
          }
        }

        if (coupleEventSlug) {
          const targetUrl = `/${orgId}/${coupleEventSlug}/couple`;
          if (typeof window !== 'undefined' && window.location.pathname === '/couple/dashboard') {
            window.location.replace(targetUrl);
            return;
          }
          const [eventRes, mediaRes, invitesRes, quotaRes] = await Promise.all([
            fetch(`/api/events/${coupleEventSlug}`),
            fetch(`/api/events/${coupleEventSlug}/media`),
            fetch(`/api/events/${coupleEventSlug}/invitations`),
            fetch(`/api/events/${coupleEventSlug}/quota`),
          ]);

          if (eventRes.ok) {
            const data = await eventRes.json();
            setEvent(data.event);
          }

          if (mediaRes.ok) {
            const data = await mediaRes.json();
            setMediaAssets(data.mediaAssets || []);
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
        }
      } catch (err) {
        console.error('Failed to load couple dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCoupleDashboardData();
  }, []);

  // Calculate current quota usage
  const currentTotalGuestsSubmitted = invitations.reduce((sum, inv) => sum + (inv.maxGuests || 1), 0);
  const remainingPermittedSeats = Math.max(0, permittedTotalQuota - currentTotalGuestsSubmitted);

  // Submit Guest Data to Organizer / System Admin
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestErrorMsg('');
    setGuestSuccessMsg('');

    if (!guestName.trim()) return;

    if (currentTotalGuestsSubmitted + guestHeadcount > permittedTotalQuota) {
      setGuestErrorMsg(`Exceeds your total permitted quota of ${permittedTotalQuota} guests! Remaining available seats: ${remainingPermittedSeats}.`);
      return;
    }

    setSubmittingGuest(true);
    try {
      const slug = event?.slug || 'sara-and-dawit-2026';
      const res = await fetch(`/api/events/${slug}/invitations`, {
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

  const handleCopyLink = (code: string, name: string) => {
    const slug = event?.slug || 'sara-and-dawit-2026';
    const fullUrl = `${window.location.origin}/event/${slug}?code=${code}&guest=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  // Filter Media (Behind The Scenes vs Gathered Media)
  const filteredMedia = mediaAssets.filter((m) => {
    if (m.status === 'REJECTED') return false;
    if (mediaSubTab === 'ALL') return true;
    if (mediaSubTab === 'BTS') return m.category === 'BTS';
    if (mediaSubTab === 'GATHERED') return m.category === 'WISHES' || m.category === 'LIVE' || !m.category;
    return true;
  });

  if (!event && !loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-gray-900 border-2 border-gold-500/40 rounded-3xl p-8 space-y-6 shadow-2xl">
          <Crown className="w-12 h-12 text-gold-400 mx-auto" />
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-2xl text-white">No Active Wedding Event Provisioned</h2>
            <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">Couples Control Hub</p>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              Everything starts from the System Super Admin portal. Your System Admin or Event Organizer will register your wedding and provision your couple credentials.
            </p>
          </div>
          <Link
            href="/admin/login"
            className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-gold"
          >
            <span>Log In to System Super Admin Portal →</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-900 text-gray-100 flex font-sans selection:bg-gold-500 selection:text-black">
      
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
                    {event?.brideName || 'Sara'} & {event?.groomName || 'Dawit'}
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
            {/* 1. Guest Data & QR Invitations */}
            <button
              onClick={() => { setActiveTab('GUESTS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
                activeTab === 'GUESTS'
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
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
                activeTab === 'MEDIA'
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
            target="_blank"
            className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-gold-500/20"
          >
            <Eye className="w-4 h-4 text-gold-400" />
            <span>Open Public Event Page</span>
          </Link>

          <Link
            href="/couple/login"
            className="w-full py-2 px-3 rounded-xl hover:bg-rose-950/40 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
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
                {activeTab === 'GUESTS' ? 'Guest Directory & QR Pass Center' : 'Behind-The-Scenes & Gathered Media Gallery'}
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
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        inviteType === 'CARD'
                          ? 'bg-gold-500 text-black shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Physical Card QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteType('LINK')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        inviteType === 'LINK'
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
                      Guest Phone Number (Optional)
                    </label>
                    <input
                      type="text"
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
                      Accepted Guest Invitations ({invitations.length})
                    </h2>
                    <p className="text-xs text-gray-400 font-light">
                      Copy unique invitation links or download printable QR invitation card passes for each guest.
                    </p>
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
                        {invitations.map((inv) => (
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
                                  className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold flex items-center gap-1 shadow-sm transition-all"
                                  title="Download Invitation Card & QR"
                                >
                                  <QrCode className="w-3.5 h-3.5 text-black" />
                                  <span>Download Card / QR</span>
                                </button>

                                <button
                                  onClick={() => handleCopyLink(inv.inviteCode, inv.guestName)}
                                  className="p-1.5 rounded-lg border border-gold-500/30 bg-black hover:bg-gray-800 text-gold-400 transition-colors"
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
                      className={`px-3.5 py-1.5 rounded-lg transition-all ${
                        mediaSubTab === 'ALL'
                          ? 'bg-gold-500 text-black shadow-sm font-extrabold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      🌟 All Media ({mediaAssets.length})
                    </button>
                    <button
                      onClick={() => setMediaSubTab('BTS')}
                      className={`px-3.5 py-1.5 rounded-lg transition-all ${
                        mediaSubTab === 'BTS'
                          ? 'bg-gold-500 text-black shadow-sm font-extrabold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      🎬 Behind-The-Scenes (BTS)
                    </button>
                    <button
                      onClick={() => setMediaSubTab('GATHERED')}
                      className={`px-3.5 py-1.5 rounded-lg transition-all ${
                        mediaSubTab === 'GATHERED'
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
      <AnimatePresence>
        {selectedInviteForPass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-gray-950 rounded-3xl p-6 sm:p-8 border-2 border-gold-500 text-center relative shadow-2xl text-white">
              <button
                onClick={() => setSelectedInviteForPass(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                ✕
              </button>

              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gold-500 text-black text-[10px] font-extrabold uppercase mb-3">
                <Crown className="w-3 h-3 text-black" />
                {selectedInviteForPass.inviteType === 'CARD' ? 'PRINTABLE CARD PASS' : 'DIGITAL LINK PASS'}
              </div>

              <h3 className="font-serif font-bold text-xl text-gold-400">
                {selectedInviteForPass.guestName}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Permitted Headcount: <strong className="text-white font-bold">{selectedInviteForPass.maxGuests} {selectedInviteForPass.maxGuests === 1 ? 'Person' : 'Persons'}</strong>
              </p>

              {/* Scannable High-Res QR Pass */}
              <div className="p-4 bg-white rounded-2xl border border-gold-500/40 inline-block shadow-lg mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    `${typeof window !== 'undefined' ? window.location.origin : ''}/event/${event?.slug || 'sara-and-dawit-2026'}?code=${selectedInviteForPass.inviteCode}&guest=${encodeURIComponent(selectedInviteForPass.guestName)}`
                  )}`}
                  alt="Guest QR Code Pass"
                  className="w-48 h-48 mx-auto"
                />
                <div className="font-mono text-[11px] font-bold text-black mt-2 tracking-wider">
                  {selectedInviteForPass.inviteCode}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
                      `${window.location.origin}/event/${event?.slug || 'sara-and-dawit-2026'}?code=${selectedInviteForPass.inviteCode}&guest=${encodeURIComponent(selectedInviteForPass.guestName)}`
                    )}`;
                    link.download = `Invitation-Pass-${selectedInviteForPass.inviteCode}-${selectedInviteForPass.guestName.replace(/\s+/g, '_')}.png`;
                    link.click();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-black" /> Download Card Design
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gold-400 border border-gold-500/30 shadow-sm"
                  title="Print Pass"
                >
                  <Printer className="w-4 h-4 text-gold-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mobile Bottom Ball Navigation Menu (Replacing Hamburger Button) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border-2 border-gold-500/50 rounded-full px-5 py-2.5 flex items-center gap-4 shadow-2xl ring-2 ring-gold-500/20">
        <button
          onClick={() => setActiveTab('GUESTS')}
          className={`p-3 rounded-full transition-all flex items-center justify-center ${
            activeTab === 'GUESTS'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-lg scale-110'
              : 'text-gold-400/80 hover:text-gold-400 hover:bg-white/10'
          }`}
          title="Guest List & QR Passes"
        >
          <Users className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('MEDIA')}
          className={`p-3 rounded-full transition-all flex items-center justify-center ${
            activeTab === 'MEDIA'
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
