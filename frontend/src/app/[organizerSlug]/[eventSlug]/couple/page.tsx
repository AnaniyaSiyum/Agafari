'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Heart
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
  rsvpStatus: 'ATTENDING' | 'DECLINED' | 'MAYBE' | 'PENDING';
  attendingHeadcount?: number;
  scannedCount: number;
  isScanned: boolean;
  qrCodeUrl?: string;
  createdAt?: string;
}

export default function ScopedCouplePortalPage({ params }: { params: { organizerSlug: string; eventSlug: string } }) {
  const { organizerSlug, eventSlug } = params;
  const { t } = useTranslation();

  const [event, setEvent] = useState<EventData | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>([]);
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Permitted total quota allocated by Organizer/Admin
  const [permittedTotalQuota, setPermittedTotalQuota] = useState(150);

  // Active Navigation Tab: 'GUESTS' | 'MEDIA'
  const [activeTab, setActiveTab] = useState<'GUESTS' | 'MEDIA'>('GUESTS');

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
      const [eventRes, mediaRes, invitesRes, quotaRes] = await Promise.all([
        fetch(`/api/events/${eventSlug}`),
        fetch(`/api/events/${eventSlug}/media?status=ALL`),
        fetch(`/api/events/${eventSlug}/invitations`),
        fetch(`/api/events/${eventSlug}/quota`),
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

      if (mediaRes.ok) {
        const data = await mediaRes.json();
        const rawItems = data.items || data.mediaAssets || [];
        setMediaAssets(
          rawItems.map((m: any) => ({
            id: m.id,
            eventId: m.event_id || m.eventId,
            uploaderName: m.uploader_name || m.uploaderName || 'Anonymous Guest',
            mediaType: m.media_type || m.mediaType || 'IMAGE',
            category: m.category || 'WISHES',
            cdnUrl: m.cdn_url || m.cdnUrl || '',
            caption: m.caption || '',
            status: m.status || 'APPROVED',
            createdAt: m.created_at || m.createdAt || new Date().toISOString(),
          }))
        );
      }

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
            rsvpStatus: inv.rsvp_status || inv.rsvpStatus || 'ATTENDING',
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
    fetchPortalData();
  }, [eventSlug]);

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
          rsvpStatus: 'ATTENDING',
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
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const filteredMedia = mediaAssets.filter((item) => {
    if (mediaSubTab === 'ALL') return true;
    if (mediaSubTab === 'BTS') return item.category === 'BTS';
    return item.category === 'WISHES' || item.category === 'LIVE';
  });

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans selection:bg-gold-500 selection:text-black">
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 bg-black/90 border-r border-gold-500/30 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 to-amber-400 text-black flex items-center justify-center font-serif font-bold text-lg shadow-gold">
                  {event ? `${event.brideName.charAt(0)}&${event.groomName.charAt(0)}` : 'A&A'}
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base text-white leading-tight">
                    {event ? `${event.brideName} & ${event.groomName}` : 'Adeday & Addisu'}
                  </h2>
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">
                    COUPLE'S PORTAL
                  </span>
                </div>
              </div>
            </div>

            {/* Event Meta Summary */}
            <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 text-xs text-gray-300 font-light">
              <div className="flex items-center gap-2 text-gold-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>{event?.eventDate || '2026-09-20'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{event?.venueName || 'Sheraton Addis Luxury Ballroom'}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('GUESTS')}
                className={`w-full p-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'GUESTS'
                    ? 'bg-gold-500 text-black shadow-gold'
                    : 'bg-stone-900/60 hover:bg-stone-900 text-gray-300 border border-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>1. Guest List & QR Passes</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'GUESTS' ? 'bg-black text-gold-400' : 'bg-stone-800 text-gray-400'
                }`}>
                  {invitations.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('MEDIA')}
                className={`w-full p-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'MEDIA'
                    ? 'bg-gold-500 text-black shadow-gold'
                    : 'bg-stone-900/60 hover:bg-stone-900 text-gray-300 border border-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4" />
                  <span>2. BTS & Gathered Media</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'MEDIA' ? 'bg-black text-gold-400' : 'bg-stone-800 text-gray-400'
                }`}>
                  {mediaAssets.length}
                </span>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-stone-800 space-y-2">
            <Link
              href={`/${organizerSlug}/${eventSlug}`}
              className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-gray-300 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-stone-700"
            >
              <ArrowLeft className="w-4 h-4 text-gold-400" />
              <span>Open Public Event Page</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-6xl">

          {/* Header Metric Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gold-500/20 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                AGAFARI WEDDING SUITE
              </span>
              <h1 className="font-serif font-bold text-2xl text-white">
                {activeTab === 'GUESTS' ? 'Guest Directory & QR Pass Center' : 'Behind-the-Scenes & Media Gallery'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Quota: {currentTotalGuestsSubmitted} / {permittedTotalQuota} Guests Submitted
              </span>
              <LanguageSwitcher />
            </div>
          </div>

          {/* TAB 1: GUEST DIRECTORY & QR PASS GENERATOR */}
          {activeTab === 'GUESTS' && (
            <div className="space-y-8">
              
              {/* Quota Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-black/80 border border-gold-500/30 space-y-1">
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">PERMITTED GUEST QUOTA</span>
                  <div className="font-serif font-bold text-3xl text-white">{permittedTotalQuota}</div>
                  <p className="text-[11px] text-gray-400">Allocated by Event Organizer</p>
                </div>

                <div className="p-5 rounded-2xl bg-black/80 border border-gold-500/30 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">GUESTS SUBMITTED</span>
                  <div className="font-serif font-bold text-3xl text-emerald-400">{currentTotalGuestsSubmitted}</div>
                  <p className="text-[11px] text-emerald-300">✓ QR Passes & Links Active</p>
                </div>

                <div className="p-5 rounded-2xl bg-black/80 border border-gold-500/30 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">REMAINING QUOTA</span>
                  <div className="font-serif font-bold text-3xl text-amber-400">{remainingPermittedSeats}</div>
                  <p className="text-[11px] text-gray-400">Available Seats Remaining</p>
                </div>
              </div>

              {/* Guest Submission Form */}
              <div className="p-6 rounded-3xl bg-black/80 border-2 border-gold-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-gold-400" />
                      Submit Permitted Guest Data
                    </h3>
                    <p className="text-xs text-gray-400">
                      Enter your guest names and permitted headcounts. Your submission will generate their scannable QR card & unique invitation link.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInviteType('CARD')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        inviteType === 'CARD'
                          ? 'bg-gold-500 text-black border-gold-400'
                          : 'bg-stone-900 text-gray-400 border-stone-700'
                      }`}
                    >
                      Physical Card QR
                    </button>
                    <button
                      onClick={() => setInviteType('LINK')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        inviteType === 'LINK'
                          ? 'bg-gold-500 text-black border-gold-400'
                          : 'bg-stone-900 text-gray-400 border-stone-700'
                      }`}
                    >
                      Digital Link
                    </button>
                  </div>
                </div>

                {guestSuccessMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{guestSuccessMsg}</span>
                  </div>
                )}

                {guestErrorMsg && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                    <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{guestErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddGuest} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-300 uppercase tracking-wider">Guest / Family Name *</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Uncle Bekele & Family"
                      className="w-full px-4 py-3 rounded-2xl bg-stone-900 border border-gold-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-300 uppercase tracking-wider">Allowed Persons (Headcount Quota) *</label>
                    <select
                      value={guestHeadcount}
                      onChange={(e) => setGuestHeadcount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl bg-stone-900 border border-gold-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                    >
                      <option value={1}>1 Person (Single Guest Pass)</option>
                      <option value={2}>2 Persons (Couple VIP Entry)</option>
                      <option value={3}>3 Persons (Family Entry)</option>
                      <option value={4}>4 Persons (Family Entry)</option>
                      <option value={5}>5 Persons (Group Entry)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-300 uppercase tracking-wider">Guest Phone Number (Optional)</label>
                    <input
                      type="text"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+251 91 122 3344"
                      className="w-full px-4 py-3 rounded-2xl bg-stone-900 border border-gold-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="md:col-span-3 pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingGuest}
                      className="px-6 py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs shadow-gold transition-all flex items-center gap-2 cursor-pointer border border-gold-300"
                    >
                      {submittingGuest ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 text-black" />
                      )}
                      <span>Submit Guest Data & Generate QR Pass</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Guest Invitations Table */}
              <div className="p-6 rounded-3xl bg-black/80 border border-gold-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-white">
                    Accepted Guest Invitations ({invitations.length})
                  </h3>
                  <span className="text-xs text-gold-400 font-mono">
                    Total Headcount: {currentTotalGuestsSubmitted} Seats
                  </span>
                </div>

                {invitations.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 space-y-2">
                    <QrCode className="w-10 h-10 text-gold-500/40 mx-auto" />
                    <p className="font-serif text-base text-white">No guest data submitted yet</p>
                    <p className="text-xs text-gray-500">Use the form above to add your guests within your permitted quota.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {invitations.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-5 rounded-2xl bg-stone-900/90 border border-gold-500/20 space-y-3 shadow-md flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-mono text-[10px] text-gold-400 font-bold bg-black/60 px-2 py-0.5 rounded border border-gold-500/30">
                              {inv.inviteCode}
                            </span>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              {inv.isScanned ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-bold">
                                  🎟 Checked In
                                </span>
                              ) : inv.rsvpStatus === 'ATTENDING' ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Attending
                                </span>
                              ) : inv.rsvpStatus === 'DECLINED' ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold flex items-center gap-1">
                                  Cannot Attend
                                </span>
                              ) : inv.rsvpStatus === 'MAYBE' ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold">
                                  Maybe
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-gray-400 border border-stone-700 text-[10px] font-bold">
                                  ⏳ RSVP Pending
                                </span>
                              )}

                              <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-gold-400 border border-stone-700 text-[10px] font-bold">
                                {inv.maxGuests} {inv.maxGuests > 1 ? 'Persons' : 'Person'}
                              </span>
                            </div>
                          </div>

                          <h4 className="font-serif font-bold text-base text-white">{inv.guestName}</h4>
                          {inv.guestPhone && (
                            <p className="text-xs text-gray-400 font-mono">{inv.guestPhone}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
                          <button
                            onClick={() => setSelectedInviteForPass(inv)}
                            className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5 text-black" />
                            <span>View QR Card Pass</span>
                          </button>

                          <button
                            onClick={() => handleCopyCode(`${window.location.origin}/event/${eventSlug}?code=${inv.inviteCode}`)}
                            className="px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-gray-300 text-xs font-bold transition-all border border-stone-700 cursor-pointer"
                            title="Copy Invitation Link"
                          >
                            {copiedCode.includes(inv.inviteCode) ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
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
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMediaSubTab('ALL')}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                      mediaSubTab === 'ALL'
                        ? 'bg-gold-500 text-black border-gold-400 shadow-gold'
                        : 'bg-black/60 text-gray-400 border-stone-800'
                    }`}
                  >
                    All Media ({mediaAssets.length})
                  </button>

                  <button
                    onClick={() => setMediaSubTab('BTS')}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                      mediaSubTab === 'BTS'
                        ? 'bg-gold-500 text-black border-gold-400 shadow-gold'
                        : 'bg-black/60 text-gray-400 border-stone-800'
                    }`}
                  >
                    Behind The Scenes (BTS)
                  </button>

                  <button
                    onClick={() => setMediaSubTab('GATHERED')}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                      mediaSubTab === 'GATHERED'
                        ? 'bg-gold-500 text-black border-gold-400 shadow-gold'
                        : 'bg-black/60 text-gray-400 border-stone-800'
                    }`}
                  >
                    Guest Wishes & Gathered Clips
                  </button>
                </div>
              </div>

              {filteredMedia.length === 0 ? (
                <div className="p-12 rounded-3xl bg-black/80 border border-stone-800 text-center text-gray-400 space-y-2">
                  <Film className="w-10 h-10 text-gold-400/40 mx-auto" />
                  <p className="font-serif text-base text-white">No media uploads available yet</p>
                  <p className="text-xs text-gray-500">Guest photos, videos, and behind-the-scenes clips will display here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMedia.map((media) => (
                    <div key={media.id} className="p-4 rounded-3xl bg-black/80 border border-gold-500/30 space-y-3">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 relative">
                        {media.mediaType === 'VIDEO' || media.cdnUrl.includes('.mp4') ? (
                          <video src={media.cdnUrl} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={media.cdnUrl} alt={media.caption} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{media.uploaderName}</span>
                        <span className="text-[10px] text-gold-400 font-semibold uppercase">{media.category}</span>
                      </div>
                      {media.caption && (
                        <p className="text-xs text-gray-300 font-light bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                          "{media.caption}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* QR PASS MODAL */}
      {selectedInviteForPass && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-black border-2 border-gold-500 rounded-3xl p-6 text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedInviteForPass(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-mono text-gold-400 font-bold uppercase tracking-wider">
                OFFICIAL AGAFARI INVITATION PASS
              </span>
              <h3 className="font-serif font-bold text-xl text-white mt-1">
                {selectedInviteForPass.guestName}
              </h3>
              <p className="text-xs text-gold-400 font-semibold mt-0.5">
                Headcount Quota: {selectedInviteForPass.maxGuests} Persons
              </p>
            </div>

            <div className="w-56 h-56 mx-auto bg-white p-4 rounded-2xl border-2 border-gold-500 flex items-center justify-center shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  JSON.stringify({ code: selectedInviteForPass.inviteCode, guests: selectedInviteForPass.maxGuests })
                )}`}
                alt="Guest Pass QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 font-mono text-xs text-gold-400 font-bold">
              {selectedInviteForPass.inviteCode}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleCopyCode(`${window.location.origin}/event/${eventSlug}?code=${selectedInviteForPass.inviteCode}`)}
                className="w-full py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs shadow-gold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-black" />
                <span>Copy Invitation Digital Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
