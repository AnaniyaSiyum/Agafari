'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Send,
  Calendar,
  MapPin,
  Video,
  QrCode,
  Film,
  CheckCircle,
  MessageSquareHeart,
  ArrowLeft,
  ArrowRight,
  Navigation,
  Crown,
  Shirt,
  Music,
  CheckCircle2,
  Users,
  Building2,
  X,
  Radio,
  Share2,
  HelpCircle,
  User,
  Upload,
  Play,
  Camera,
  ShieldCheck,
  Download,
  Copy,
  Check,
  ExternalLink,
  Home,
  Clock,
  XCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';
import InvitationCardModal from '@/components/InvitationCardModal';

interface MezmurItem {
  id: string;
  title: string;
  artist: string;
  category: 'MEZMUR' | 'TRADITIONAL' | 'DANCE' | 'SLOW';
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
  venueMapUrl: string;
  dressCode?: string;
  welcomeMessage: string;
  coverImageUrl: string;
  couplePhotoUrl?: string;
  youtubeStreamUrl?: string;
  youtubeVideoId?: string;
  isLive?: boolean;
  status?: string;
  adminApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  backgroundAudioUrl?: string;
  backgroundMusicUrl?: string;
  backgroundMusicTitle?: string;
  mezmurPlaylist?: MezmurItem[];
  loveStory?: {
    headline: string;
    firstMetDate: string;
    firstMetStory: string;
    proposalDate: string;
    proposalStory: string;
  };
  programs?: {
    id: string;
    time: string;
    title: string;
    location: string;
    description: string;
  }[];
  additionalLocations?: {
    id: string;
    label: string;
    description: string;
    mapUrl?: string;
  }[];
}

interface WishData {
  id: string;
  eventId: string;
  senderName: string;
  message: string;
  mediaType?: 'TEXT' | 'VIDEO';
  videoUrl?: string;
  createdAt: string;
}

interface InvitationRecord {
  id: string;
  inviteCode: string;
  guestName: string;
  maxGuests: number;
  inviteType: 'CARD' | 'LINK';
  tableNumber?: string;
}

function PublicWeddingCelebrationContent({
  params,
}: {
  params: { slug: string };
}) {
  const { t, locale } = useTranslation();
  const { slug } = params;
  const searchParams = useSearchParams();
  const rawQuery = searchParams ? searchParams.toString() : '';
  const queryString = rawQuery ? `?${rawQuery}` : '';
  const codeParam = searchParams.get('code');

  const [event, setEvent] = useState<EventData | null>(null);
  const [wishes, setWishes] = useState<WishData[]>([]);
  const [invitation, setInvitation] = useState<InvitationRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Guest Profile State
  const [activeInviteCode, setActiveInviteCode] = useState<string>(codeParam || 'INV-SD2026-001');
  const [rsvpGuestName, setRsvpGuestName] = useState<string>('');
  const [invitationSource, setInvitationSource] = useState<'CARD' | 'LINK'>('CARD');

  // Interactive Wish State (VIDEO BLESSING DEFAULT)
  const [wishType, setWishType] = useState<'TEXT' | 'VIDEO'>('VIDEO');
  const [senderName, setSenderName] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [submittingWish, setSubmittingWish] = useState(false);
  const [wishSubmittedSuccess, setWishSubmittedSuccess] = useState(false);

  // Guest Song Suggestion
  const [guestSongTitle, setGuestSongTitle] = useState('');
  const [guestSongArtist, setGuestSongArtist] = useState('');
  const [songSubmittedSuccess, setSongSubmittedSuccess] = useState(false);

  // Attendance RSVP Modal State (4.5-Second Prompt)
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [hasAnsweredRsvp, setHasAnsweredRsvp] = useState(false);
  const [attendanceChoice, setAttendanceChoice] = useState<'ATTENDING' | 'DECLINED' | 'MAYBE'>('ATTENDING');
  const [guestAttendanceType, setGuestAttendanceType] = useState<'SINGLE' | 'COUPLE'>('COUPLE');
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [rsvpSuccessMessage, setRsvpSuccessMessage] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string>('/audio/leykunu_mezmur.mp3');
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const cachedAudio = typeof window !== 'undefined' && slug ? localStorage.getItem(`agafari_bg_audio_${slug}`) : null;
    const uploadedAudio = event?.backgroundAudioUrl || (event as any)?.background_audio_url || (event as any)?.customization?.backgroundAudioUrl || cachedAudio;
    if (uploadedAudio && typeof uploadedAudio === 'string' && uploadedAudio.trim().length > 0 && !uploadedAudio.includes('youtube') && !uploadedAudio.includes('youtu.be')) {
      setCurrentAudioSrc(uploadedAudio.trim());
    } else {
      setCurrentAudioSrc('/audio/leykunu_mezmur.mp3');
    }
  }, [event, slug]);

  // Reload audio element whenever audio src changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlayingAudio) {
        audioRef.current.play().catch((err) => console.log('Audio autoplay after src change:', err));
      }
    }
  }, [currentAudioSrc]);

  // Check if today is the actual wedding day (or if live stream is actively running)
  const isTodayWeddingDay = React.useMemo(() => {
    if (!event) return false;
    if (event.isLive || (event as any).status === 'LIVE') return true;
    if (!event.eventDate) return false;
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const eventStr = new Date(event.eventDate).toISOString().split('T')[0];
      return todayStr === eventStr;
    } catch {
      return false;
    }
  }, [event]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      if (audioRef.current.readyState === 0) {
        audioRef.current.load();
      }
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlayingAudio(true);
        }).catch((err) => {
          console.warn('Audio playback error on user toggle:', err);
          // Fallback to standard track if custom src fails
          if (currentAudioSrc !== '/audio/leykunu_mezmur.mp3') {
            setCurrentAudioSrc('/audio/leykunu_mezmur.mp3');
          }
        });
      }
    }
  };

  // Auto-play background audio by default on page load or on any guest interaction
  useEffect(() => {
    if (!audioRef.current) return;

    const attemptPlay = () => {
      if (audioRef.current && audioRef.current.paused) {
        const p = audioRef.current.play();
        if (p !== undefined) {
          p.then(() => {
            setIsPlayingAudio(true);
          }).catch((err) => {
            console.log('Autoplay deferred until guest interaction:', err);
          });
        }
      }
    };

    attemptPlay();

    const handleUserGesture = () => {
      if (audioRef.current && audioRef.current.paused) {
        const p = audioRef.current.play();
        if (p !== undefined) {
          p.then(() => {
            setIsPlayingAudio(true);
          }).catch(() => { });
        }
      }
    };

    const options = { capture: true, passive: true };
    window.addEventListener('click', handleUserGesture, options);
    window.addEventListener('touchstart', handleUserGesture, options);
    window.addEventListener('pointerdown', handleUserGesture, options);
    window.addEventListener('keydown', handleUserGesture, options);
    window.addEventListener('scroll', handleUserGesture, options);

    return () => {
      window.removeEventListener('click', handleUserGesture, options);
      window.removeEventListener('touchstart', handleUserGesture, options);
      window.removeEventListener('pointerdown', handleUserGesture, options);
      window.removeEventListener('keydown', handleUserGesture, options);
      window.removeEventListener('scroll', handleUserGesture, options);
    };
  }, [currentAudioSrc]);

  // Real-time Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    async function loadEventHub() {
      try {
        const [eventRes, wishesRes] = await Promise.all([
          fetch(`/api/events/${slug}`),
          fetch(`/api/events/${slug}/wishes`),
        ]);

        if (eventRes.ok) {
          const eventData = await eventRes.json();
          const evt = eventData.event;
          setEvent(evt);
        }

        if (wishesRes.ok) {
          const wishesData = await wishesRes.json();
          setWishes(wishesData.wishes || []);
        }

        // 1. Check if guest query param is present in URL
        const guestQuery = searchParams.get('guest') || searchParams.get('name');
        if (guestQuery) {
          const decodedGuest = decodeURIComponent(guestQuery).trim();
          if (decodedGuest) {
            setRsvpGuestName(decodedGuest);
            setSenderName(decodedGuest);
            if (typeof window !== 'undefined') {
              localStorage.setItem(`agafari_guest_name_${slug}`, decodedGuest);
            }
          }
        }

        // 2. Check if specific invite code was passed
        if (codeParam) {
          try {
            const inviteRes = await fetch(`/api/events/${slug}/invitations?code=${codeParam}`);
            if (inviteRes.ok) {
              const inviteData = await inviteRes.json();
              if (inviteData.invitation) {
                setInvitation(inviteData.invitation);
                setActiveInviteCode(inviteData.invitation.inviteCode);
                if (inviteData.invitation.guestName) {
                  setRsvpGuestName(inviteData.invitation.guestName);
                  setSenderName(inviteData.invitation.guestName);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(`agafari_guest_name_${slug}`, inviteData.invitation.guestName);
                  }
                }
                if (inviteData.invitation.rsvpStatus && inviteData.invitation.rsvpStatus !== 'PENDING') {
                  setHasAnsweredRsvp(true);
                  setAttendanceChoice(inviteData.invitation.rsvpStatus);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(`agafari_rsvp_${slug}`, inviteData.invitation.rsvpStatus);
                    localStorage.setItem(`agafari_rsvp_answered_${slug}`, 'true');
                  }
                }
                setInvitationSource(inviteData.invitation.inviteType || 'LINK');
              }
            }
          } catch (e) { }
        }

        // 3. Fallback to localStorage saved RSVP guest name & response
        if (typeof window !== 'undefined') {
          if (!rsvpGuestName) {
            const savedName = localStorage.getItem(`agafari_guest_name_${slug}`);
            if (savedName) {
              setRsvpGuestName(savedName);
              setSenderName(savedName);
            }
          }
          const savedRsvp = localStorage.getItem(`agafari_rsvp_${slug}`);
          const rsvpAnswered = localStorage.getItem(`agafari_rsvp_answered_${slug}`);
          if (savedRsvp && (savedRsvp === 'ATTENDING' || savedRsvp === 'DECLINED' || savedRsvp === 'MAYBE')) {
            setHasAnsweredRsvp(true);
            setAttendanceChoice(savedRsvp as any);
          } else if (rsvpAnswered === 'true') {
            setHasAnsweredRsvp(true);
          }
        }
      } catch (err) {
        console.error('Failed to load event celebration hub:', err);
      } finally {
        setLoading(false);
      }
    }

    loadEventHub();
  }, [slug, codeParam]);

  // Calculate if RSVP is locked (less than 3 days / 72h before event)
  const isRsvpLocked = React.useMemo(() => {
    if (!event?.eventDate) return false;
    const target = new Date(event.eventDate).getTime();
    const now = new Date().getTime();
    const diffHours = (target - now) / (1000 * 60 * 60);
    return diffHours < 72;
  }, [event?.eventDate]);

  // Trigger RSVP Modal only if guest has NOT answered yet and RSVP is NOT locked
  useEffect(() => {
    if (!hasAnsweredRsvp && !isRsvpLocked && !loading) {
      const timer = setTimeout(() => {
        setRsvpModalOpen(true);
      }, 4500);
      return () => clearTimeout(timer);
    } else {
      setRsvpModalOpen(false);
    }
  }, [hasAnsweredRsvp, isRsvpLocked, loading]);

  // Real-time Countdown Clock Tick
  useEffect(() => {
    if (!event?.eventDate) return;

    const target = new Date(event.eventDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event?.eventDate]);

  // Submit RSVP Attendance Directly (1-Click Instant Automatic Submit)
  const handleDirectRsvpSelect = async (choice: 'ATTENDING' | 'MAYBE' | 'DECLINED') => {
    if (isRsvpLocked) {
      alert('RSVP updates are locked within 72 hours of the wedding date.');
      return;
    }

    setAttendanceChoice(choice);
    setHasAnsweredRsvp(true);
    setRsvpModalOpen(false);

    if (typeof window !== 'undefined') {
      localStorage.setItem(`agafari_rsvp_${slug}`, choice);
      localStorage.setItem(`agafari_rsvp_answered_${slug}`, 'true');
    }

    setSubmittingRsvp(true);

    try {
      await fetch(`/api/events/${slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: rsvpGuestName,
          attendanceStatus: choice,
          inviteCode: activeInviteCode,
        }),
      });
    } catch (err) {
      console.error('Failed to submit RSVP:', err);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  // Submit Wish or Video Blessing
  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveSenderName = (senderName || rsvpGuestName || invitation?.guestName || (typeof window !== 'undefined' ? localStorage.getItem(`agafari_guest_name_${slug}`) : null) || 'Honored Guest').trim();
    if (!effectiveSenderName || (!wishMessage.trim() && !videoFile && !videoPreviewUrl)) return;

    setSubmittingWish(true);
    try {
      const payloadMessage = wishType === 'VIDEO'
        ? `[📹 Video Blessing Uploaded]: ${wishMessage.trim() || 'Heartfelt video blessing for the couple!'}`
        : wishMessage;

      const fallbackVideo = 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-smiling-and-holding-hands-43183-large.mp4';
      const res = await fetch(`/api/events/${slug}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: effectiveSenderName,
          message: payloadMessage,
          mediaType: wishType,
          videoUrl: wishType === 'VIDEO' ? (videoPreviewUrl || fallbackVideo) : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.wish) {
          setWishes((prev) => [data.wish, ...prev]);
        }
        setWishSubmittedSuccess(true);
        setWishMessage('');
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setTimeout(() => setWishSubmittedSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Failed to submit wish:', err);
    } finally {
      setSubmittingWish(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handleSongRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestSongTitle.trim()) return;

    const guestDisplayName = rsvpGuestName || senderName || 'Honored Guest';

    try {
      await Promise.all([
        fetch(`/api/events/${slug}/music`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestName: guestDisplayName,
            songTitle: guestSongTitle.trim(),
            artistName: guestSongArtist.trim(),
          }),
        }),
        fetch(`/api/events/${slug}/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestName: guestDisplayName,
            songRecommendation: `${guestSongTitle.trim()}${guestSongArtist.trim() ? ` by ${guestSongArtist.trim()}` : ''}`,
            attendanceStatus: attendanceChoice || 'ATTENDING',
            inviteCode: activeInviteCode,
          }),
        })
      ]);
    } catch (err) {
      console.error('Error submitting song recommendation:', err);
    }

    setSongSubmittedSuccess(true);
    setGuestSongTitle('');
    setGuestSongArtist('');
    setTimeout(() => setSongSubmittedSuccess(false), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif text-gold-400 text-sm">{t('publicEvent.loadingHub', 'Opening Wedding Hub...')}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="glass-panel-dark p-8 rounded-3xl text-center max-w-md border-2 border-gold-500/40 shadow-2xl">
          <h2 className="font-serif text-xl font-bold text-gold-400 mb-2">{t('publicEvent.notFoundTitle', 'Wedding Not Found')}</h2>
          <p className="text-white/70 text-xs mb-6">{t('publicEvent.notFoundDesc', 'The requested wedding link is invalid or expired.')}</p>
          <Link href="/" className="px-5 py-2 rounded-full bg-gold-500 text-black font-bold text-xs shadow-md">
            {t('common.back')}
          </Link>
        </div>
      </div>
    );
  }

  if (event.adminApprovalStatus === 'PENDING') {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center px-6 font-sans">
        <div className="p-8 sm:p-10 rounded-3xl bg-stone-900 border-2 border-amber-500/50 text-center max-w-lg shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-extrabold px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
              {t('publicEvent.approvalPendingBadge', '⏳ Licensing Approval Pending')}
            </span>
            <h2 className="font-serif text-2xl font-bold text-white mt-3">
              {event.brideName && event.groomName ? `${event.brideName} & ${event.groomName}` : event.title}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mt-3">
              {t('publicEvent.approvalPendingDesc', 'This wedding request was submitted by the organizer and is currently awaiting System Admin review and licensing verification.')}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg transition-all">
              {t('publicEvent.returnToHome', 'Return to Home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (event.adminApprovalStatus === 'REJECTED') {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center px-6 font-sans">
        <div className="p-8 sm:p-10 rounded-3xl bg-stone-900 border-2 border-rose-500/50 text-center max-w-lg shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <XCircle className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-rose-400 font-extrabold px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30">
              {t('publicEvent.requestRejectedBadge', '🔴 Request Rejected')}
            </span>
            <h2 className="font-serif text-2xl font-bold text-white mt-3">
              {t('publicEvent.requestRejectedTitle', 'Wedding Request Rejected')}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mt-3">
              {t('publicEvent.requestRejectedDesc', 'This wedding request was rejected by the System Admin and is not active on Agafari.')}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center">
            <Link href="/" className="px-6 py-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs shadow-md transition-all">
              {t('publicEvent.returnToHome', 'Return to Home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const brideName = event.brideName || 'Bride';
  const groomName = event.groomName || 'Groom';
  const coupleTitle = `${brideName} & ${groomName}`;
  const rawDateStr = event.eventDate ? (event.eventDate.includes('T') ? event.eventDate.split('T')[0] : event.eventDate) : '';
  const formattedDateString = rawDateStr
    ? new Date(rawDateStr.replace(/-/g, '/')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
    : 'SEPTEMBER 20, 2026';

  const venueTitle = event.venueName || 'Sheraton Addis Luxury Ballroom';

  // Dynamic Unique QR Code Payload Generator
  const currentQuota = Number(invitation?.maxGuests || (invitation as any)?.max_guests || (guestAttendanceType === 'COUPLE' ? 2 : 1));
  const currentTable = invitation?.tableNumber || (currentQuota > 1 ? `Table 1: VIP Group (${currentQuota} Persons)` : 'Table 4: Individual VIP');

  const appBaseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002');
  const invitationPageUrl = `${appBaseUrl}/event/${event.slug}?code=${activeInviteCode}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    invitationPageUrl
  )}`;

  // Standardized Professional 800x1200 Digital Pass Card Generator
  const downloadVerificationCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#09090B';
    ctx.fillRect(0, 0, 800, 1200);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.strokeRect(25, 25, 750, 1150);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 730, 1130);

    const coupleImg = new Image();
    coupleImg.crossOrigin = 'anonymous';
    coupleImg.onload = () => {
      ctx.drawImage(coupleImg, 45, 45, 710, 360);

      const gradient = ctx.createLinearGradient(0, 45, 0, 405);
      gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(45, 45, 710, 360);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AGAFARI ROYAL ENTRANCE PASS', 400, 100);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 38px serif';
      ctx.fillText(coupleTitle, 400, 165);

      ctx.fillStyle = '#F3F4F6';
      ctx.font = '16px serif';
      ctx.fillText('ROYAL WEDDING CELEBRATION', 400, 205);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`${formattedDateString} • ${venueTitle}`, 400, 370);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(60, 420, 680, 710);

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 30px serif';
      ctx.fillText(rsvpGuestName || 'Valued Guest & Family', 400, 485);

      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`ADMIT: ${currentQuota} PERSON(S) • ${currentTable}`, 400, 530);

      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 240, 570, 320, 320);

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 18px monospace';
        ctx.fillText(`PASS CODE: ${activeInviteCode}`, 400, 930);

        ctx.fillStyle = '#065F46';
        ctx.fillRect(100, 970, 600, 70);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('✓ OFFICIAL GATE SECURITY VERIFIED PASS', 400, 1012);

        ctx.fillStyle = '#6B7280';
        ctx.font = '13px sans-serif';
        ctx.fillText('Present this pass at the gate scanner for usher verification.', 400, 1090);

        const a = document.createElement('a');
        a.download = `Agafari_Royal_Pass_${activeInviteCode}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
      qrImg.src = qrImageUrl;
    };
    coupleImg.src = event.coverImageUrl || '/images/hero_couple_bg.png';
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 text-white flex justify-center selection:bg-gold-500 selection:text-black font-sans relative overflow-x-hidden">
      {/* 1. AMBIENT BACKGROUND FOR DESKTOP MARGINS (20% LEFT & RIGHT) */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none overflow-hidden bg-stone-950">
        <img
          src={event?.coverImageUrl || '/images/hero_couple_bg.png'}
          alt={coupleTitle}
          className="w-full h-full object-cover filter blur-3xl opacity-20 scale-110"
        />
        <div className="absolute inset-0 bg-stone-950/80" />
      </div>

      {/* 2. MAIN CENTERED ENLARGED 9:16 PORTRAIT FRAME (100% Mobile, 60% Width / max-w-[580px] Centered on Desktop) */}
      <div className="relative z-10 w-full lg:w-[60vw] max-w-[580px] min-h-screen flex flex-col pb-28 border-x border-gold-500/30 bg-stone-950 shadow-[0_0_100px_rgba(0,0,0,0.95)]">

        {/* RIGGED (FIXED) 9:16 COVER PHOTO BACKGROUND INSIDE THE CENTERED FRAME */}
        <div className="fixed top-0 z-0 w-full lg:w-[60vw] max-w-[580px] h-screen h-[100dvh] pointer-events-none overflow-hidden">
          <img
            src={event?.coverImageUrl || '/images/hero_couple_bg.png'}
            alt={coupleTitle}
            className="w-full h-full object-cover object-top filter brightness-105 contrast-105 saturate-110"
          />
        </div>

        {/* ========================================================================= */}
        {/* 1. 100% HEIGHT HERO BANNER WITH 9:16 COVER PHOTO FULLY DISPLAYED */}
        {/* ========================================================================= */}
        <section className="relative z-10 w-full min-h-screen h-[100dvh] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">

          {/* Top Header Bar */}
          <nav className="relative z-20 flex items-center justify-between w-full max-w-full mx-auto py-2 px-1 gap-2">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/branding/artboard-15.png"
                alt="Agafari Logo"
                className="h-8 sm:h-10 w-auto object-contain filter drop-shadow-md"
              />
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink min-w-0 justify-end">
              <audio
                ref={audioRef}
                autoPlay
                loop
                playsInline
                preload="auto"
                src={currentAudioSrc}
                onPlay={() => setIsPlayingAudio(true)}
                onPause={() => setIsPlayingAudio(false)}
                onError={() => {
                  console.warn('Audio playback error, falling back to default MP3');
                  if (currentAudioSrc !== '/audio/leykunu_mezmur.mp3') {
                    setCurrentAudioSrc('/audio/leykunu_mezmur.mp3');
                  }
                }}
              />

              <button
                onClick={toggleAudio}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer shadow-md border shrink-0 ${isPlayingAudio
                  ? 'bg-gold-500 text-black shadow-gold scale-105 border-gold-300'
                  : 'bg-black/80 text-gold-400 border-gold-500/40 hover:scale-105'
                  }`}
                title={isPlayingAudio ? t('publicEvent.musicLabelMuted', 'Mute Background Audio') : t('publicEvent.musicLabelActive', 'Play Background Audio')}
              >
                {isPlayingAudio ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-black animate-pulse" />
                    <span>{t('publicEvent.musicLabelActive', '🔊 Music')}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-gold-400" />
                    <span>{t('publicEvent.musicLabelMuted', '🔇 Music')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCardModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black text-[11px] sm:text-xs font-extrabold shadow-gold transition-all cursor-pointer active:scale-95 hover:scale-105 shrink-0"
                title={t('publicEvent.cardPassTooltip', 'Download Official Invitation Card Pass')}
              >
                <Download className="w-3.5 h-3.5 text-black" />
                <span>{t('publicEvent.cardPassBtn', 'Card Pass')}</span>
              </button>

              <LanguageSwitcher />
            </div>
          </nav>

          {/* COUPLE NAME & DATE OVERLAID DIRECTLY AT THE BOTTOM PART OF THE PHOTO */}
          <div className="relative z-20 text-center max-w-3xl mx-auto mt-auto pb-8 sm:pb-12 space-y-2">
            <h2 className="font-serif text-xs sm:text-base font-bold text-gold-400 tracking-[0.3em] uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              {t('publicEvent.saveTheDate', 'SAVE THE DATE')}
            </h2>

            <h1 className="font-script text-5xl sm:text-7xl lg:text-8xl font-bold text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)] tracking-wide py-1">
              {coupleTitle}
            </h1>

            <div className="space-y-0.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-gold-200 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              <p className="text-gold-300 font-serif">{formattedDateString}</p>
              <p className="text-[11px] sm:text-xs text-white/95 font-bold">{t('publicEvent.atVenue', 'AT')} {venueTitle.toUpperCase()}</p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. OVERLAY CONTENTS FLOATING DIRECTLY ABOVE THE IMAGE (NO GLASSMORPHISM) */}
        {/* ========================================================================= */}
        <section className="relative z-10 px-4 sm:px-6 py-10 max-w-4xl mx-auto space-y-10">

        {/* LIVE BROADCAST BANNER & PLAYER EMBED */}
        {(event.youtubeVideoId && event.status !== 'ENDED') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 space-y-4 relative overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-rose-500/30">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="font-extrabold text-xs text-rose-400 uppercase tracking-wider drop-shadow">
                  {t('publicEvent.liveVideoBroadcast', '🔴 Official Live Video Broadcast')}
                </span>
              </div>
              <Link
                href={`/event/${slug}/feed?tab=LIVE${queryString ? `&${rawQuery}` : ''}`}
                className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>{t('publicEvent.watchLiveReel', 'Watch Interactive TikTok Live Reel ➔')}</span>
              </Link>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gold-500/40 bg-black shadow-inner relative">
              <iframe
                src={`https://www.youtube.com/embed/${event.youtubeVideoId || 'vp8WJ-ZbZXw'}?autoplay=0&vq=hd1080&hd=1&modestbranding=1`}
                title={t('publicEvent.officialLiveStream', 'Official Wedding Live Stream')}
                className="w-full h-full"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-300 pt-1">
              <p className="font-serif italic text-gold-300 drop-shadow">
                {t('publicEvent.liveBroadcastFor', 'Live broadcast for {couple}\'s royal wedding celebration.').replace('{couple}', coupleTitle)}
              </p>
              <Link
                href={`/event/${slug}/feed?tab=LIVE${queryString ? `&${rawQuery}` : ''}`}
                className="text-gold-400 hover:underline font-bold text-xs drop-shadow"
              >
                {t('publicEvent.fullScreenWishes', 'Full Screen Mode & Wishes Feed →')}
              </Link>
            </div>
          </motion.div>
        )}

        {/* INVITATION LETTER WITH DYNAMIC DETAILS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full text-white text-center space-y-5 py-4 relative"
        >
          <h3 className="font-script text-3xl sm:text-5xl font-bold text-gold-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {t('publicEvent.dearFamilies', 'Dear Families and Friends')}
          </h3>

          <p className="text-gray-100 text-xs sm:text-sm sm:text-base leading-relaxed font-serif italic max-w-2xl mx-auto px-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            "{t('publicEvent.invitationText', 'Together with their families, {couple} joyfully invite you to celebrate their wedding day! Join us as we say \'I do\' on {date} at {venue}. {message}').replace('{couple}', coupleTitle).replace('{date}', formattedDateString).replace('{venue}', venueTitle).replace('{message}', event.welcomeMessage || '')}"
          </p>

          {/* 3D COUNTDOWN TIMER TICKER */}
          <div className="pt-3 pb-2">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
              {[
                { label: t('publicEvent.countdown.days'), value: timeLeft.days },
                { label: t('publicEvent.countdown.hours'), value: timeLeft.hours },
                { label: t('publicEvent.countdown.minutes'), value: timeLeft.minutes },
                { label: t('publicEvent.countdown.seconds'), value: timeLeft.seconds },
              ].map((unit, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-2.5 sm:p-3.5 rounded-2xl border border-gold-500/50 bg-black/40 text-center"
                >
                  <div className="font-serif text-xl sm:text-3xl font-extrabold text-gold-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-gold-200 uppercase font-bold tracking-wider mt-0.5 drop-shadow">
                    {unit.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* DYNAMIC MAP NAVIGATION CARD */}
          <div className="pt-6 border-t border-gold-500/30">
            <div className="rounded-2xl bg-black/60 backdrop-blur-md border border-gold-500/40 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/40 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-gold-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-gold-400/90 font-bold uppercase tracking-widest block">
                    {t('publicEvent.venueLabel', 'Wedding Ceremony & Venue')}
                  </span>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-white truncate drop-shadow">
                    {venueTitle}
                  </h4>
                </div>
              </div>

              <a
                href={event.venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueTitle)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 hover:from-gold-400 hover:to-amber-300 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-gold transition-all duration-300 flex items-center justify-center gap-2.5 shrink-0 border border-gold-300 cursor-pointer active:scale-95 hover:scale-105"
              >
                <MapPin className="w-4 h-4 text-black shrink-0" />
                <span>{t('publicEvent.openVenueMap', 'Open Venue Map & Directions')}</span>
                <ExternalLink className="w-4 h-4 text-black shrink-0" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* DYNAMIC CULTURAL PROTOCOL & GUIDELINES */}
        <div className="w-full max-w-4xl text-gold-200 text-xs space-y-4 text-left py-4 border-t border-b border-gold-500/30">
          <div className="pb-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest block drop-shadow">
                {t('publicEvent.eventProtocolBadge', 'Official Event Protocol & Details')}
              </span>
              <h3 className="font-serif text-lg font-bold text-white mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {t('publicEvent.ceremonyGuidelines', 'Ceremony & Celebration Guidelines')}
              </h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px] border border-gold-500/40">
              {t('publicEvent.vipRsvp', 'VIP RSVP')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold-400 shrink-0" />
              <div>
                <span className="font-bold text-white drop-shadow">{t('publicEvent.dateLabel', 'Date:')} {formattedDateString}</span>
                <p className="text-[11px] text-gray-200 drop-shadow">{t('publicEvent.checkInStartsAt', 'Gate check-in starts at {time}').replace('{time}', event.startTime || '14:00')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
              <div>
                <span className="font-bold text-white drop-shadow">{t('publicEvent.venueLabel', 'Venue:')} {venueTitle}</span>
              </div>
            </div>

            {event.additionalLocations && event.additionalLocations.length > 0 && (
              <div className="sm:col-span-2 border-t border-gold-500/20 pt-3 space-y-2.5">
                <div className="text-[10px] text-gold-400 font-bold uppercase tracking-wider flex items-center gap-1.5 drop-shadow">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t('publicEvent.additionalLocations', 'Additional Wedding Locations')}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.additionalLocations.map((loc) => (
                    <div key={loc.id} className="p-3 rounded-2xl bg-black/40 border border-gold-500/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs drop-shadow">{loc.label}</span>
                        {loc.mapUrl && (
                          <a
                            href={loc.mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-gold-400 hover:underline flex items-center gap-1 font-bold drop-shadow"
                          >
                            <span>{t('common.map', 'Map')}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-200 leading-snug drop-shadow">{loc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.dressCode && (
              <div className="flex items-center gap-3 sm:col-span-2 border-t border-gold-500/20 pt-3">
                <Shirt className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-gold-400 font-semibold uppercase drop-shadow">{t('publicEvent.dressCodeLabel', 'Dress Code')}</div>
                  <span className="font-bold text-white text-xs drop-shadow">{event.dressCode}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WATCH LIVE BROADCAST STREAM BANNER (ONLY ON WEDDING DAY OR WHEN LIVE) */}
        {isTodayWeddingDay && (
          <div className="w-full max-w-4xl p-6 sm:p-7 rounded-3xl bg-black/60 border border-rose-500/60 text-white flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/30 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
                <Video className="w-6 h-6 text-rose-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                    {t('publicEvent.liveVideoBroadcast', 'Live Broadcast Stream')}
                  </span>
                  <span className="text-emerald-400 font-bold text-[10px] animate-pulse">{t('publicEvent.todayIsWeddingDay', '● Today is Wedding Day')}</span>
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white mt-1 drop-shadow">{t('publicEvent.watchWeddingLive', 'Watch {couple}\'s Wedding Live').replace('{couple}', coupleTitle)}</h3>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
              <Link
                href={`/event/${slug}/feed?tab=LIVE${rawQuery ? `&${rawQuery}` : ''}`}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 border border-rose-400/40 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>{t('publicEvent.watchLiveBroadcastBtn', 'Watch Live Broadcast')}</span>
              </Link>

              <Link
                href={`/event/${slug}/feed${rawQuery ? `?${rawQuery}` : ''}`}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-black/80 hover:bg-black text-amber-300 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/40 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Film className="w-4 h-4 text-amber-400" />
                <span>{t('publicEvent.tiktokVideoFeedBtn', '📱 TikTok-Style Video Feed')}</span>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. QR GATE PASS SECTION */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 pt-10 pb-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full text-center space-y-6 py-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 text-gold-400 text-[11px] font-bold border border-gold-500/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {invitationSource === 'CARD'
                ? t('publicEvent.physicalCardVerified', '🏷️ Physical Invitation Card • Pre-Printed QR Verified')
                : t('publicEvent.directLinkGenerated', '✨ Direct Link Guest • Dynamic Gate Pass Generated')}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {t('publicEvent.qrPass.title')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 font-light max-w-lg mx-auto leading-relaxed drop-shadow">
              {t('publicEvent.qrPass.subtitle')}
            </p>
          </div>

          {/* VIP Gate Invitation Card Pass Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-black/60 backdrop-blur-md border border-gold-500/40 my-4 text-left space-y-6 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Column: QR Code Box */}
              <div className="p-4 bg-white rounded-3xl border-2 border-gold-500 shadow-2xl text-center shrink-0">
                <img
                  src={qrImageUrl}
                  alt={`Personal Entrance QR Pass for ${rsvpGuestName}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-2xl"
                />
                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-gray-900 tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>PASS CODE: {activeInviteCode}</span>
                </div>
              </div>

              {/* Right Column (Beside QR Code): Card Pass Info & Download Button */}
              <div className="flex-1 w-full space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-[10px] font-extrabold uppercase tracking-wider border border-gold-500/40">
                  <Crown className="w-3.5 h-3.5 text-gold-400" />
                  <span>{t('publicEvent.officialRoyalPass', 'Official Royal Gate Entrance Pass')}</span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-xl sm:text-3xl text-white capitalize drop-shadow">
                    {rsvpGuestName || t('publicEvent.honoredGuestFamily', 'Honored Guest & Family')}
                  </h4>
                  <p className="text-xs text-gold-300 font-serif italic mt-0.5 drop-shadow">
                    {coupleTitle} • {formattedDateString}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-gold-500/30 text-xs text-stone-200 space-y-1.5">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Users className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>{t('publicEvent.quotaPrefix', 'Quota:')} <strong className="text-white font-bold">{currentQuota} {currentQuota > 1 ? t('publicEvent.persons', 'Persons') : t('publicEvent.person', 'Person')}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                    <span className="font-medium text-stone-200 truncate">{venueTitle}</span>
                  </div>
                </div>

                {/* Responsive Action Buttons - Non-Clipping Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
                  <button
                    type="button"
                    onClick={() => setCardModalOpen(true)}
                    className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 hover:from-gold-400 hover:to-amber-300 text-black font-extrabold text-xs shadow-gold transition-all flex items-center justify-center gap-2 border border-gold-300 cursor-pointer active:scale-95 hover:scale-105"
                  >
                    <Download className="w-4 h-4 text-black shrink-0" />
                    <span className="truncate">{t('publicEvent.downloadCardPassPng', 'Download Card (.PNG)')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const personalLink = `${window.location.origin}/event/${slug}?code=${activeInviteCode}&guest=${encodeURIComponent(rsvpGuestName)}`;
                      navigator.clipboard.writeText(personalLink);
                      setCopiedPass(true);
                      setTimeout(() => setCopiedPass(false), 3000);
                    }}
                    className="w-full px-4 py-3.5 rounded-xl bg-black/80 hover:bg-black text-stone-200 hover:text-white font-bold text-xs border border-gold-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:scale-105"
                  >
                    {copiedPass ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Copy className="w-4 h-4 text-gold-400 shrink-0" />}
                    <span className="truncate">{copiedPass ? t('publicEvent.linkCopied', 'Link Copied!') : t('publicEvent.copyLink', 'Copy Pass Link')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SONG RECOMMENDATION SECTION */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 py-8 max-w-4xl mx-auto border-t border-gold-500/20">
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/40">
              <Music className="w-5 h-5 text-gold-400" />
            </div>
            <div className="text-left">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow">
                {t('publicEvent.honoredPerformers', 'Honored Performers & Music Playlist')}
              </h3>
              <p className="text-xs text-gray-200 font-light drop-shadow">
                {t('publicEvent.musicalGuestsDesc', 'Distinguished musical guests & spiritual choirs performing for {couple}.').replace('{couple}', coupleTitle)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: t('publicEvent.choirName', 'Ethiopian Orthodox Wedding Choir'), role: t('publicEvent.choirRole', 'Spiritual Entrance Mezmurs'), type: 'CHOIR' },
              { name: t('publicEvent.bandName', 'Addis Cultural Habesha Band'), role: t('publicEvent.bandRole', 'Traditional Eskista & Merekba Dance'), type: 'BAND' },
              { name: t('publicEvent.acousticName', 'Acoustic Habesha Ensemble'), role: t('publicEvent.acousticRole', 'Dinner & Royal Vows Serenade'), type: 'ACOUSTIC' },
            ].map((artist, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-gold-500/30 text-left space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold text-[9px] border border-gold-500/30">
                  {artist.type}
                </span>
                <div className="font-serif font-bold text-white text-sm mt-1 drop-shadow">{artist.name}</div>
                <div className="text-[11px] text-gray-200 drop-shadow">{artist.role}</div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-gold-500/30 bg-black/40 text-left">
            <h4 className="font-serif font-bold text-white text-sm mb-1 drop-shadow">
              {t('publicEvent.recommendMezmur', 'Recommend a Mezmur or Song to {couple}').replace('{couple}', coupleTitle)}
            </h4>
            <p className="text-xs text-gray-200 font-light mb-4 drop-shadow">
              {t('publicEvent.songSuggestDesc', 'Have a favorite spiritual Mezmur or upbeat Eskista song you\'d love to hear at the wedding? Suggest it below!')}
            </p>

            {songSubmittedSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {t('publicEvent.songSuccessMsg', 'Thank you! Your song recommendation has been sent to {couple}!').replace('{couple}', coupleTitle)}
              </div>
            ) : (
              <form onSubmit={handleSongRecommendation} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <input
                  type="text"
                  required
                  value={guestSongTitle}
                  onChange={(e) => setGuestSongTitle(e.target.value)}
                  placeholder={t('publicEvent.songTitlePlaceholder', 'Song or Mezmur Title')}
                  className="px-3.5 py-2.5 rounded-xl border border-gold-500/40 bg-black/60 text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <input
                  type="text"
                  value={guestSongArtist}
                  onChange={(e) => setGuestSongArtist(e.target.value)}
                  placeholder={t('publicEvent.songArtistPlaceholder', 'Choir / Singer (Optional)')}
                  className="px-3.5 py-2.5 rounded-xl border border-gold-500/40 bg-black/60 text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-gold-500 text-black font-extrabold text-xs hover:bg-gold-400 shadow-gold flex items-center justify-center gap-1.5 border border-gold-300 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-black" /> {t('publicEvent.sendRecommendation', 'Send Recommendation')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 5. GUEST BLESSING SECTION (VIDEO BLESSING DEFAULT) */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-10 rounded-3xl border border-gold-500/40 bg-black/40 text-white relative overflow-hidden space-y-6"
        >
          <div className="text-center mb-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 via-amber-300 to-gold-600 text-black mx-auto flex items-center justify-center mb-3 shadow-md">
              <MessageSquareHeart className="w-7 h-7 text-black" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-400 text-[10px] font-bold uppercase tracking-widest mb-2 border border-gold-500/40">
              <Sparkles className="w-3 h-3 text-gold-400" />
              {t('publicEvent.wishes.badge')}
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {t('publicEvent.blessingWishesFor', 'Blessing Wishes for {couple}').replace('{couple}', coupleTitle)}
            </h3>
            <p className="text-stone-200 text-xs sm:text-sm mt-1 font-light max-w-lg mx-auto leading-relaxed drop-shadow">
              {t('publicEvent.recordVideoOrWriteMsg', 'Record a video or write a blessing message for the bride and groom.')}
            </p>

            <div className="flex items-center justify-center gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setWishType('VIDEO')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${wishType === 'VIDEO'
                  ? 'bg-gold-500 text-black shadow-md border border-gold-300 scale-105'
                  : 'bg-black/60 border border-gold-500/30 text-stone-300'
                  }`}
              >
                <Camera className="w-3.5 h-3.5" /> {t('publicEvent.videoBlessingDefault', '📹 Video Blessing (Default)')}
              </button>
              <button
                type="button"
                onClick={() => setWishType('TEXT')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${wishType === 'TEXT'
                  ? 'bg-gold-500 text-black shadow-md border border-gold-300 scale-105'
                  : 'bg-black/60 border border-gold-500/30 text-stone-300'
                  }`}
              >
                <MessageSquareHeart className="w-3.5 h-3.5" /> {t('publicEvent.textBlessingTab', '✍️ Text Blessing')}
              </button>
            </div>
          </div>

          <form onSubmit={handleWishSubmit} className="space-y-4 text-xs relative z-10">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-gold-300 uppercase tracking-wider">
                  {t('publicEvent.wishes.senderName')}
                </label>
                <span className="text-[10px] font-bold text-gold-300 bg-gold-500/10 border border-gold-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  {t('publicEvent.autoFilledPass', '🔒 Auto-filled from RSVP Guest Pass')}
                </span>
              </div>
              <input
                type="text"
                required
                readOnly
                disabled
                value={senderName || rsvpGuestName || invitation?.guestName || (typeof window !== 'undefined' ? localStorage.getItem(`agafari_guest_name_${slug}`) : '') || t('publicEvent.honoredGuestFamily', 'Honored Guest')}
                placeholder={t('publicEvent.wishes.senderPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-gold-500/40 bg-black/60 text-gold-200 font-bold text-xs focus:outline-none cursor-not-allowed shadow-inner"
              />
            </div>

            {wishType === 'VIDEO' ? (
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-gold-300 uppercase tracking-wider">
                  {t('publicEvent.uploadVideoBlessing', 'Upload Video Blessing')}
                </label>

                {videoPreviewUrl ? (
                  <div className="rounded-2xl overflow-hidden border-2 border-gold-500/40 bg-black/90 p-3 text-center space-y-2">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full max-h-60 rounded-xl mx-auto"
                    />
                    <div className="flex items-center justify-between text-[11px] text-white px-1">
                      <span>{t('publicEvent.videoReady', '✓ Video ready:')} {videoFile?.name || 'video_blessing.mp4'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreviewUrl(null);
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                      >
                        {t('common.cancel', 'Remove')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gold-500/40 hover:border-gold-400 rounded-2xl p-8 text-center cursor-pointer transition-all block bg-black/40 hover:bg-black/60 group shadow-lg backdrop-blur-md">
                    <div className="w-14 h-14 rounded-full bg-gold-500/20 text-gold-400 mx-auto flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform border border-gold-500/30">
                      <Upload className="w-6 h-6 text-gold-400" />
                    </div>
                    <p className="font-serif font-bold text-sm text-white group-hover:text-gold-300 transition-colors">{t('publicEvent.recordOrSelectVideo', 'Record or Select Video Blessing')}</p>
                    <p className="text-[11px] text-stone-300 mt-1 font-light">{t('publicEvent.supportsVideoLimits', 'Supports phone video recording up to 60 seconds (Max 50MB)')}</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-gold-300 uppercase tracking-wider mb-1">
                    {t('publicEvent.captionLabel', 'Caption / Personal Message')}
                  </label>
                  <input
                    type="text"
                    value={wishMessage}
                    onChange={(e) => setWishMessage(e.target.value)}
                    placeholder={t('publicEvent.captionPlaceholder', 'e.g. Wishing you endless joy and blessings!')}
                    className="w-full px-4 py-3 rounded-xl border border-gold-500/40 bg-black/60 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-500 text-xs font-medium"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold text-gold-300 uppercase tracking-wider mb-1.5">
                  {t('publicEvent.wishes.messageLabel')}
                </label>
                <textarea
                  required
                  rows={4}
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  placeholder={t('publicEvent.wishes.messagePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-gold-500/40 bg-black/60 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-500 text-xs leading-relaxed font-medium"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submittingWish}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 hover:from-gold-400 hover:to-amber-300 text-black font-extrabold text-xs sm:text-sm shadow-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer border border-gold-300 active:scale-98 hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{submittingWish ? t('publicEvent.wishes.sendingButton') : t('publicEvent.wishes.submitButton')}</span>
              <Send className="w-4 h-4 text-black" />
            </button>
          </form>

          <AnimatePresence>
            {wishSubmittedSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-center text-xs"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="font-bold">{t('publicEvent.wishes.successMsg')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* VERY BOTTOM SECTION: ATTENDANCE RSVP CONFIRMATION BAR */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 pt-6 pb-28 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full p-6 sm:p-8 rounded-3xl border-2 border-gold-500/60 bg-black/90 backdrop-blur-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl shadow-gold-500/10"
        >
          <div className="text-left space-y-1">
            <div className="text-xs text-gold-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{t('publicEvent.attendanceConfirmation', 'Attendance Confirmation')}</span>
            </div>
            <div className="font-serif font-bold text-lg sm:text-2xl text-white">
              {hasAnsweredRsvp ? (
                <span className="flex items-center gap-2 text-emerald-400">
                  {t('publicEvent.responseSaved', '✓ Response Saved:')} {attendanceChoice === 'ATTENDING' ? t('publicEvent.attendingCelebration', 'Attending Celebration') : attendanceChoice === 'DECLINED' ? t('publicEvent.cannotAttend', 'Cannot Attend') : t('publicEvent.maybeAttending', 'Maybe Attending')}
                </span>
              ) : (
                t('publicEvent.willYouAttend', 'Will you attend our celebration?')
              )}
            </div>
            {isRsvpLocked && (
              <p className="text-[11px] text-amber-400 font-medium">
                {t('publicEvent.rsvpLocked72h', '🔒 RSVP changes locked (Within 72 hours of wedding ceremony)')}
              </p>
            )}
          </div>

          <button
            onClick={() => {
              if (isRsvpLocked) {
                alert('RSVP updates are locked within 72 hours of the wedding date to finalize venue seating.');
                return;
              }
              setRsvpModalOpen(true);
            }}
            disabled={isRsvpLocked}
            className={`px-8 py-4 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shrink-0 border shadow-lg ${isRsvpLocked
              ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-black shadow-gold border-amber-300 cursor-pointer hover:scale-105 active:scale-95'
              }`}
          >
            {isRsvpLocked ? t('publicEvent.rsvpLockedBtn', '🔒 RSVP Locked (Within 72 Hours)') : hasAnsweredRsvp ? t('publicEvent.updateRsvpResponse', 'Update RSVP Response') : t('publicEvent.submitRsvpResponse', 'Submit RSVP Response')}
          </button>
        </motion.div>
      </section>

      {/* FOOTER PROMOTION */}
      <section className="mt-12 py-10 bg-white border-t border-gray-100 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-black text-gold-400 flex items-center justify-center font-serif font-bold text-xl shadow-sm shrink-0 border border-gold-500/30">
              H
            </div>
            <div>
              <div className="text-[10px] text-gold-600 font-bold uppercase tracking-wider">
                {t('publicEvent.eventHostOps', 'Event Host & Digital Operations')}
              </div>
              <h4 className="font-serif font-bold text-gray-900 text-base">
                {t('publicEvent.hostNames', 'Yonas Planners & Hamelmal Creatives')}
              </h4>
              <p className="text-xs text-gray-500 font-light mt-0.5">
                {t('publicEvent.fullTechnicalServiceDesc', 'Full-service technical event production, digital gate pass security, and live broadcast engineering.')}
              </p>
            </div>
          </div>

          <a
            href="https://hamelmal.com"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 border border-gold-500/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>{t('publicEvent.visitHamelmalBtn', 'Visit Hamelmal Creatives')}</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
          </a>
        </div>
      </section>

      {/* SMART RSVP POPUP MODAL */}
      <AnimatePresence>
        {rsvpModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="p-7 sm:p-9 rounded-3xl border-2 border-gold-500 max-w-lg w-full relative bg-white text-gray-900 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setRsvpModalOpen(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-gray-900 p-1.5 rounded-full bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gold-500 text-black mx-auto flex items-center justify-center mb-3 shadow-gold">
                  <Heart className="w-6 h-6 fill-black text-black" />
                </div>
                <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest block mb-1">
                  {t('publicEvent.attendanceConfirmationModal', 'Wedding Attendance Confirmation')}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                  {rsvpGuestName || invitation?.guestName || t('publicEvent.honoredGuestFamily', 'Honored Guest & Family')}
                </h3>
                <p className="text-gold-700 text-xs mt-1 font-serif italic font-medium">
                  {t('publicEvent.cordiallyInviteMsg', '{couple} cordially invite {guest} to celebrate our union!').replace('{couple}', coupleTitle).replace('{guest}', rsvpGuestName || invitation?.guestName || 'you')}
                </p>
              </div>

              {rsvpSuccessMessage ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center text-emerald-950 text-xs shadow-md">
                  <CheckCircle className="w-9 h-9 text-emerald-600 mx-auto mb-2 animate-bounce" />
                  <p className="font-bold text-sm text-gray-900">
                    {t('publicEvent.rsvp.confirmed')}
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-1">{rsvpSuccessMessage}</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {submittingRsvp && (
                    <div className="py-2 text-center text-xs text-gold-600 font-semibold animate-pulse">
                      {t('common.submitting')}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2.5">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      disabled={submittingRsvp}
                      onClick={() => handleDirectRsvpSelect('ATTENDING')}
                      className="p-4 rounded-2xl border-2 border-gold-500 bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs shadow-gold transition-all flex items-center justify-between group disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-black text-gold-400 flex items-center justify-center shadow-sm shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-gold-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-serif font-bold text-sm text-black">
                            {t('publicEvent.rsvp.yesTitle')}
                          </div>
                          <div className="text-[10px] text-black/80 font-medium">
                            {t('publicEvent.rsvp.yesDesc')}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      disabled={submittingRsvp}
                      onClick={() => handleDirectRsvpSelect('MAYBE')}
                      className="p-4 rounded-2xl border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold text-xs shadow-sm transition-all flex items-center justify-between group disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-700 flex items-center justify-center shadow-sm shrink-0">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-serif font-bold text-sm text-gray-900">
                            {t('publicEvent.rsvp.maybeTitle')}
                          </div>
                          <div className="text-[10px] text-gray-600 font-normal">
                            {t('publicEvent.rsvp.maybeDesc')}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-700 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      disabled={submittingRsvp}
                      onClick={() => handleDirectRsvpSelect('DECLINED')}
                      className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-900 font-bold text-xs shadow-sm transition-all flex items-center justify-between group disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm shrink-0">
                          <X className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-serif font-bold text-sm text-rose-900">
                            {t('publicEvent.rsvp.noTitle')}
                          </div>
                          <div className="text-[10px] text-rose-700/80 font-normal">
                            {t('publicEvent.rsvp.noDesc')}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* FLOATING BOTTOM NAVIGATION DOCK */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border-2 border-gold-500/60 rounded-full px-3 py-2 shadow-2xl flex items-center gap-2 sm:gap-3 text-xs font-bold">
        <Link
          href={`/event/${slug}${queryString}`}
          className="px-4 py-2 rounded-full bg-gold-500 text-black shadow-gold scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4 shrink-0 fill-black" />
          <span className="hidden sm:inline">{t('nav.home', 'Home')}</span>
        </Link>

        <Link
          href={`/event/${slug}/history${queryString}`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Heart className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">{t('nav.history', 'Couple History')}</span>
          <span className="sm:hidden">{t('nav.history', 'History')}</span>
        </Link>

        <Link
          href={`/event/${slug}/program${queryString}`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">{t('nav.program', 'Programs')}</span>
        </Link>

        <Link
          href={`/event/${slug}/gallery${queryString}`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span>{t('nav.gallery', 'Gallery')}</span>
        </Link>

        <button
          onClick={toggleAudio}
          className={`px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${isPlayingAudio
            ? 'bg-amber-400 text-black shadow-gold font-extrabold scale-105'
            : 'text-gold-300 hover:bg-gold-500/20 hover:text-white font-bold'
            }`}
          title={isPlayingAudio ? 'Mute Background Audio' : 'Play Background Audio'}
        >
          {isPlayingAudio ? (
            <Volume2 className="w-4 h-4 shrink-0 text-black animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 shrink-0 text-gold-400" />
          )}
          <span>{isPlayingAudio ? '🔊' : '🎵'}</span>
        </button>
      </div>

      {/* Branded High-Resolution Invitation Card Pass Modal */}
      <InvitationCardModal
        isOpen={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        invitation={{
          guestName: rsvpGuestName || invitation?.guestName || 'Honored Guest',
          inviteCode: activeInviteCode,
          maxGuests: currentQuota,
          tableNumber: invitation?.tableNumber,
          rsvpStatus: attendanceChoice || 'ATTENDING',
        }}
        event={{
          title: event.title,
          brideName: event.brideName,
          groomName: event.groomName,
          eventDate: event.eventDate,
          startTime: event.startTime,
          venueName: event.venueName,
          dressCode: event.dressCode,
          slug: event.slug,
        }}
      />
      </div>
    </div>
  );
}

export default function PublicWeddingCelebrationPage({ params }: { params: { slug: string } }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-black text-gold-400 flex items-center justify-center font-serif text-sm">Opening Wedding Hub...</div>}>
      <PublicWeddingCelebrationContent params={params} />
    </React.Suspense>
  );
}

