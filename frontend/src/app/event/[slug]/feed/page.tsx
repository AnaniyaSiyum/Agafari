'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, 
  Heart, 
  Upload, 
  ArrowLeft, 
  X, 
  CheckCircle, 
  Sparkles,
  MessageCircle,
  Eye,
  Camera,
  Share2,
  Send,
  Crown,
  Volume2,
  VolumeX,
  Radio,
  Search,
  Check,
  Video
} from 'lucide-react';

interface MediaAssetData {
  id: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  category?: 'WISHES' | 'BTS' | 'LIVE';
  cdnUrl: string;
  caption: string;
  viewsCount: number;
  likesCount: number;
}

interface CommentData {
  id: string;
  mediaId: string;
  senderName: string;
  comment: string;
  createdAt: string;
}

interface DoubleTapHeart {
  id: string;
  x: number;
  y: number;
}

interface EventInfoData {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  isLive: boolean;
  youtubeVideoId: string;
  status?: string;
}

function TikTokMemoryFeedContent({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const searchParams = useSearchParams();
  const rawQuery = searchParams ? searchParams.toString() : '';
  const queryString = rawQuery ? `?${rawQuery}` : '';
  const guestQuery = searchParams.get('guest') || searchParams.get('name');
  const tabQuery = searchParams ? searchParams.get('tab')?.toUpperCase() : null;

  const [eventInfo, setEventInfo] = useState<EventInfoData | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaAssetData[]>([]);
  const [activeTab, setActiveTab] = useState<'WISHES' | 'BTS' | 'LIVE'>(
    tabQuery === 'LIVE' ? 'LIVE' : tabQuery === 'BTS' ? 'BTS' : 'WISHES'
  );
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [isMuted, setIsMuted] = useState(true);

  // Active playing index tracking via IntersectionObserver
  const [activeReelId, setActiveReelId] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Comments State
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedMediaForComments, setSelectedMediaForComments] = useState<MediaAssetData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentSender, setCommentSender] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Double Tap Hearts
  const [doubleTapHearts, setDoubleTapHearts] = useState<DoubleTapHeart[]>([]);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'WISHES' | 'BTS' | 'LIVE'>('WISHES');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (tabQuery === 'LIVE') setActiveTab('LIVE');
    else if (tabQuery === 'BTS') setActiveTab('BTS');
    else if (tabQuery === 'WISHES') setActiveTab('WISHES');
  }, [tabQuery]);

  useEffect(() => {
    if (guestQuery) {
      const decoded = decodeURIComponent(guestQuery).trim();
      if (decoded) {
        setCommentSender(decoded);
        setUploaderName(decoded);
      }
    }
  }, [guestQuery]);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const [eventRes, mediaRes, wishesRes] = await Promise.all([
          fetch(`/api/events/${slug}`),
          fetch(`/api/events/${slug}/media`),
          fetch(`/api/events/${slug}/wishes`),
        ]);

        if (eventRes.ok) {
          const evtData = await eventRes.json();
          if (evtData.event) {
            setEventInfo({
              id: evtData.event.id,
              slug: evtData.event.slug,
              title: evtData.event.title || '',
              brideName: evtData.event.brideName || 'Bride',
              groomName: evtData.event.groomName || 'Groom',
              isLive: Boolean(evtData.event.isLive),
              youtubeVideoId: evtData.event.youtubeVideoId || '',
              status: evtData.event.status,
            });
          }
        }

        let mediaList: MediaAssetData[] = [];
        if (mediaRes.ok) {
          const data = await mediaRes.json();
          const rawList = data.mediaAssets || data.items || [];
          mediaList = rawList.map((m: any) => ({
            id: m.id,
            uploaderName: m.uploaderName || m.uploader_name || 'Guest',
            mediaType: m.mediaType || m.media_type || 'VIDEO',
            category: m.category || 'WISHES',
            cdnUrl: m.cdnUrl || m.cdn_url || m.url || '',
            caption: m.caption || '',
            viewsCount: Number(m.viewsCount || m.views_count || 0),
            likesCount: Number(m.likesCount || m.likes_count || 0),
          }));
        }

        if (wishesRes.ok) {
          const wishData = await wishesRes.json();
          const rawWishes = wishData.wishes || [];
          const existingUrls = new Set(mediaList.map((m) => m.cdnUrl));

          rawWishes.forEach((w: any) => {
            if (w.video_url || w.videoUrl || w.media_type === 'VIDEO') {
              const videoUrl = w.video_url || w.videoUrl || '';
              if (videoUrl && !existingUrls.has(videoUrl)) {
                mediaList.unshift({
                  id: `wish-${w.id}`,
                  uploaderName: w.sender_name || w.senderName || 'Guest',
                  mediaType: 'VIDEO',
                  category: 'WISHES',
                  cdnUrl: videoUrl,
                  caption: w.message || '',
                  viewsCount: 0,
                  likesCount: 0,
                });
              }
            }
          });
        }

        setMediaItems(mediaList);
        if (mediaList.length > 0) {
          setActiveReelId(mediaList[0].id);
          const initialLikes: Record<string, number> = {};
          mediaList.forEach((item) => {
            initialLikes[item.id] = item.likesCount || 0;
          });
          setLikeCounts(initialLikes);
        }
      } catch (err) {
        console.error('Failed to load memory feed:', err);
      }
    }

    fetchMedia();
    const interval = setInterval(fetchMedia, 5000);
    return () => clearInterval(interval);
  }, [slug]);

  // Fetch comments when opening comments drawer
  useEffect(() => {
    if (!selectedMediaForComments) return;
    async function fetchComments() {
      try {
        const res = await fetch(`/api/organizer/media/comments?mediaId=${selectedMediaForComments?.id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    }
    fetchComments();
  }, [selectedMediaForComments?.id]);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedIds((prev) => {
      const currentlyLiked = !prev[id];
      const nextState = !currentlyLiked;
      setLikeCounts((counts) => ({
        ...counts,
        [id]: (counts[id] || 0) + (nextState ? 1 : -1),
      }));
      return { ...prev, [id]: nextState };
    });
  };

  // Double-tap screen heart burst effect
  const handleDoubleTap = (e: React.MouseEvent<HTMLElement>, mediaId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!likedIds[mediaId]) {
      setLikedIds((prev) => ({ ...prev, [mediaId]: true }));
      setLikeCounts((counts) => ({
        ...counts,
        [mediaId]: (counts[mediaId] || 0) + 1,
      }));
    }

    const heartId = `h-${Date.now()}-${Math.random()}`;
    setDoubleTapHearts((prev) => [...prev, { id: heartId, x, y }]);
    setTimeout(() => {
      setDoubleTapHearts((prev) => prev.filter((h) => h.id !== heartId));
    }, 900);
  };

  // Submit Comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentSender.trim() || !commentText.trim() || !selectedMediaForComments) return;

    setSubmittingComment(true);
    try {
      const res = await fetch('/api/organizer/media/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaId: selectedMediaForComments.id,
          senderName: commentSender,
          comment: commentText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data.comment, ...prev]);
        setCommentText('');
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit Upload Form
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderName || !caption) return;
    setUploading(true);

    try {
      const fallbackVideo = 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-park-on-their-wedding-day-43185-large.mp4';
      const res = await fetch(`/api/events/${slug}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploaderName,
          caption,
          category: uploadCategory,
          mediaType: 'VIDEO',
          cdnUrl: videoPreviewUrl || fallbackVideo,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.mediaAsset) {
          setMediaItems((prev) => [data.mediaAsset, ...prev]);
          setLikeCounts((prev) => ({ ...prev, [data.mediaAsset.id]: 0 }));
          setActiveReelId(data.mediaAsset.id);
        }
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setIsUploadOpen(false);
          setUploaderName('');
          setCaption('');
          setVideoFile(null);
          setVideoPreviewUrl(null);
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to upload memory:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleTabChange = (newTab: 'WISHES' | 'BTS' | 'LIVE') => {
    setActiveTab(newTab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Keyboard Arrow Key Listener for sliding left and right (Wishes <-> Behind Scenes <-> Live)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (activeTab === 'WISHES') handleTabChange('BTS');
        else if (activeTab === 'BTS') handleTabChange('LIVE');
      } else if (e.key === 'ArrowLeft') {
        if (activeTab === 'LIVE') handleTabChange('BTS');
        else if (activeTab === 'BTS') handleTabChange('WISHES');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Horizontal Swipe Handler for Tab Navigation (Wishes <-> Behind Scenes <-> Live)
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swiped Left -> Move to Next Tab
        if (activeTab === 'WISHES') handleTabChange('BTS');
        else if (activeTab === 'BTS') handleTabChange('LIVE');
      } else {
        // Swiped Right -> Move to Previous Tab
        if (activeTab === 'LIVE') handleTabChange('BTS');
        else if (activeTab === 'BTS') handleTabChange('WISHES');
      }
    }
    touchStartX.current = null;
  };

  // Filter media items based on active tab
  const filteredMediaItems = mediaItems.filter((item) => {
    if (activeTab === 'WISHES') return item.category === 'WISHES' || !item.category;
    if (activeTab === 'BTS') return item.category === 'BTS';
    if (activeTab === 'LIVE') return item.category === 'LIVE';
    return true;
  });

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-[100dvh] w-full bg-black text-neutral flex flex-col font-sans relative overflow-hidden select-none"
    >
      
      {/* 1. TIKTOK-STYLE TOP NAVIGATION HEADER */}
      <header className="absolute top-0 left-0 right-0 z-50 px-3 sm:px-6 py-3 flex items-center justify-between pointer-events-none bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        
        {/* Left: Back Link & Agafari Logo */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <Link
            href={`/event/${slug}${queryString}`}
            className="p-1.5 sm:p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/70 text-white transition-all border border-white/15 shadow-md flex items-center justify-center"
            aria-label="Back to Wedding Hub"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>

          <img
            src="/branding/artboard-13.png"
            alt="Agafari (አጋፋሪ) Logo"
            className="h-6 sm:h-8 w-auto object-contain shrink-0"
          />
        </div>

        {/* Center: Single-Line TikTok Navigation Tabs (Wishes | BTS | Live) */}
        <nav className="flex items-center gap-3 sm:gap-6 pointer-events-auto overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => handleTabChange('WISHES')}
            className="relative py-1 text-xs sm:text-sm transition-all focus:outline-none whitespace-nowrap"
          >
            <span className={activeTab === 'WISHES' ? 'text-white font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-white/70 hover:text-white font-medium drop-shadow'}>
              Wishes
            </span>
            {activeTab === 'WISHES' && (
              <motion.div
                layoutId="tiktokActiveTabUnderline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-400 rounded-full mx-auto shadow-sm"
              />
            )}
          </button>

          <button
            onClick={() => handleTabChange('BTS')}
            className="relative py-1 text-xs sm:text-sm transition-all focus:outline-none whitespace-nowrap"
          >
            <span className={activeTab === 'BTS' ? 'text-white font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-white/70 hover:text-white font-medium drop-shadow'}>
              Behind Scenes
            </span>
            {activeTab === 'BTS' && (
              <motion.div
                layoutId="tiktokActiveTabUnderline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-400 rounded-full mx-auto shadow-sm"
              />
            )}
          </button>

          <button
            onClick={() => handleTabChange('LIVE')}
            className="relative py-1 text-xs sm:text-sm transition-all focus:outline-none whitespace-nowrap"
          >
            <span className={`flex items-center gap-1 ${activeTab === 'LIVE' ? 'text-rose-400 font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-white/70 hover:text-white font-medium drop-shadow'}`}>
              <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
              <span>Live</span>
            </span>
            {activeTab === 'LIVE' && (
              <motion.div
                layoutId="tiktokActiveTabUnderline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rose-500 rounded-full mx-auto shadow-sm"
              />
            )}
          </button>
        </nav>

        {/* Right: Mute / Sound Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 sm:p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/70 text-white transition-all border border-white/15"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* 2. FULL-SCREEN VERTICALLY SNAP-SCROLLABLE REELS CONTAINER */}
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar bg-black"
      >
        {activeTab === 'LIVE' ? (
          ((eventInfo?.isLive || (eventInfo?.youtubeVideoId && eventInfo?.status !== 'ENDED')) && eventInfo?.youtubeVideoId) ? (
            <section className="h-[100dvh] w-full snap-start relative flex items-center justify-center bg-black overflow-hidden">
              {/* 100% Full-Screen Vertical YouTube Live Broadcast Reel */}
              <div className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${eventInfo.youtubeVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&enablejsapi=1&rel=0&playsinline=1&vq=hd1080&hd=1&modestbranding=1`}
                  title="Live Stream Broadcast"
                  className="w-full h-full object-cover border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {/* Top Overlay Banner: Live Indicator */}
                <div className="absolute top-16 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-rose-400 shadow-lg animate-pulse pointer-events-auto">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>🔴 LIVE BROADCAST</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-gold-400 text-xs font-bold border border-gold-500/40 shadow-md">
                    <span>📹 Diaspora Video Stream</span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute left-4 right-4 bottom-6 z-20 pointer-events-auto flex items-end justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold-500 text-black font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-gold-300 shadow-md">
                        <Radio className="w-4 h-4 text-black animate-pulse" />
                      </div>
                      <div>
                        <span className="font-serif font-bold text-white text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          {eventInfo.brideName} & {eventInfo.groomName}
                        </span>
                        <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Official Live Broadcast</div>
                      </div>
                    </div>
                    <p className="text-xs text-white/90 font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] line-clamp-2 pl-10">
                      {eventInfo.title || 'Live Wedding Celebration Broadcast'}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUploadOpen(true)}
                    className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B89628] hover:from-amber-300 hover:to-[#D4AF37] text-black font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5 border border-amber-300/60 shrink-0 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-black" />
                    <span>Upload Wish</span>
                  </motion.button>
                </div>
              </div>
            </section>
          ) : eventInfo?.status === 'ENDED' ? (
            <div className="h-[100dvh] w-full flex flex-col items-center justify-center text-center px-6 text-neutral bg-black space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-900 text-gold-400 flex items-center justify-center border border-gold-500/30 shadow-lg">
                <Radio className="w-8 h-8 text-gold-400" />
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-stone-800 text-gold-300 text-[10px] font-extrabold uppercase tracking-wider border border-gold-500/30">
                  Broadcast Concluded
                </span>
                <h3 className="font-serif font-bold text-2xl text-white pt-1">
                  Live Stream Concluded
                </h3>
              </div>
              <p className="text-xs text-neutral/70 max-w-sm leading-relaxed">
                The live video broadcast for <strong>{eventInfo?.brideName || 'Bride'} & {eventInfo?.groomName || 'Groom'}</strong>'s wedding has concluded. You can swipe left/right to browse guest wish reels and behind-the-scenes videos!
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => handleTabChange('WISHES')}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>‹ Slide to Guest Wishes</span>
                </button>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-extrabold text-xs shadow-accent flex items-center gap-2 cursor-pointer hover:brightness-110 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Send Wish Video</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[100dvh] w-full flex flex-col items-center justify-center text-center px-6 text-neutral bg-black space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 animate-pulse shadow-lg">
                <Radio className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-rose-950 text-rose-300 text-[10px] font-extrabold uppercase tracking-wider border border-rose-500/40">
                  🔴 Live Broadcast Offline
                </span>
                <h3 className="font-serif font-bold text-2xl text-white pt-1">
                  Live Stream Currently Offline
                </h3>
              </div>
              <p className="text-xs text-neutral/70 max-w-sm leading-relaxed">
                The official live video broadcast for <strong>{eventInfo?.brideName || 'Bride'} & {eventInfo?.groomName || 'Groom'}</strong>'s wedding is not streaming right now. As soon as the video crew starts broadcasting, the live feed will stream automatically right here!
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => handleTabChange('WISHES')}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>‹ Slide to Guest Wishes</span>
                </button>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-extrabold text-xs shadow-accent flex items-center gap-2 cursor-pointer hover:brightness-110 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Send Wish Video</span>
                </button>
              </div>
            </div>
          )
        ) : filteredMediaItems.length === 0 ? (
          <div className="h-[100dvh] w-full flex flex-col items-center justify-center text-center px-6 text-neutral">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37] mb-4 animate-bounce">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl mb-2">No videos yet in this category</h3>
            <p className="text-xs text-neutral/70 max-w-xs mb-4">Be the first to share a wish video for this beautiful couple!</p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-xs shadow-accent flex items-center gap-2"
            >
              <Camera className="w-4 h-4" /> Upload Wish Video / Note
            </button>
          </div>
        ) : (
          filteredMediaItems.map((media) => {
            const isLiked = !!likedIds[media.id];
            const likes = likeCounts[media.id] ?? (media.likesCount || (media as any).likes_count || 0);
            const mediaUrl = media.cdnUrl || (media as any).cdn_url || (media as any).url || '';
            const mediaType = media.mediaType || (media as any).media_type || 'VIDEO';
            const isVideo = (mediaUrl ? mediaUrl.includes('.mp4') : false) || mediaType === 'VIDEO';

            return (
              <section
                key={media.id}
                onDoubleClick={(e) => handleDoubleTap(e, media.id)}
                className="h-[100dvh] w-full snap-start relative flex items-center justify-center bg-black overflow-hidden"
              >
                {/* 100% Full-Width Video/Image Reel Viewport */}
                <div className="w-full h-full max-w-full relative bg-black flex items-center justify-center overflow-hidden">
                  
                  {isVideo ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={media.caption}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

                  {/* Double-Tap Heart Bursts */}
                  {doubleTapHearts.map((h) => (
                    <motion.div
                      key={h.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.4, 1.1], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8 }}
                      style={{ left: h.x - 30, top: h.y - 30 }}
                      className="absolute z-30 pointer-events-none"
                    >
                      <Heart className="w-16 h-16 fill-rose-500 text-rose-500 drop-shadow-lg" />
                    </motion.div>
                  ))}

                  {/* 3. RIGHT TIKTOK ACTION BAR */}
                  <div className="absolute right-3.5 bottom-24 z-30 flex flex-col items-center gap-4">
                      {/* Like / Heart Button */}
                      <button
                        onClick={(e) => toggleLike(media.id, e)}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-125 ${
                          isLiked ? 'bg-rose-500/20 text-rose-500' : 'bg-black/50 backdrop-blur-md text-white'
                        }`}>
                          <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                        </div>
                        <span className="text-[11px] font-bold text-white mt-1 drop-shadow">
                          {likes}
                        </span>
                      </button>

                      {/* Comment Drawer Button */}
                      <button
                        onClick={() => {
                          setSelectedMediaForComments(media);
                          setIsCommentsOpen(true);
                        }}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-125 transition-transform">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold text-white mt-1 drop-shadow">
                          {comments.length || 12}
                        </span>
                      </button>
                    </div>

                  {/* 4. BOTTOM OVERLAY INFO: Caption + Sender Name + Upload Wishes Button */}
                  <div className="absolute left-4 right-16 bottom-6 z-20 pointer-events-auto flex items-end justify-between gap-3">
                    <div className="flex-1 pr-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                          {media.uploaderName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-serif font-bold text-white text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          {media.uploaderName}
                        </span>
                        {media.category === 'WISHES' && (
                          <span className="text-[10px] bg-[#D4AF37]/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40 font-bold backdrop-blur-sm">
                            💖 Guest Wish
                          </span>
                        )}
                        {media.category === 'BTS' && (
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/40 font-bold backdrop-blur-sm">
                            🎬 Behind The Scenes
                          </span>
                        )}
                      </div>
                      {media.caption && (
                        <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] line-clamp-3 pl-9">
                          "{media.caption}"
                        </p>
                      )}
                    </div>

                    {/* ONLY THE UPLOADING BUTTON IS SHOWN IN LIVE & OTHER SECTIONS AS REQUESTED */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsUploadOpen(true)}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B89628] hover:from-amber-300 hover:to-[#D4AF37] text-black font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5 border border-amber-300/60 shrink-0 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-black" />
                      <span>Upload Wish</span>
                    </motion.button>
                  </div>

                </div>
              </section>
            );
          })
        )}
      </div>

      {/* 5. SLIDE-UP COMMENTS DRAWER (ACCEPTS NORMAL COMMENTS FOR SPECIFIC VIDEO) */}
      <AnimatePresence>
        {isCommentsOpen && selectedMediaForComments && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCommentsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-white text-gray-900 rounded-t-3xl shadow-2xl border-t-2 border-gold-500/40 max-h-[70vh] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between text-center relative">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2" />
                <h4 className="font-serif font-bold text-sm text-gray-900 mx-auto pt-2">
                  Comments for this Video ({comments.length})
                </h4>
                <button
                  onClick={() => setIsCommentsOpen(false)}
                  className="p-1 rounded-full hover:bg-black/10 text-gray-500 absolute right-4 top-4"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No comments on this video yet. Add a comment below!
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-black text-gold-400 font-serif font-bold text-[10px] flex items-center justify-center shrink-0 border border-gold-500/30">
                        {c.senderName.charAt(0)}
                      </div>
                      <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-serif font-bold text-gray-900 text-[11px]">{c.senderName}</span>
                          <span className="text-[9px] text-gray-500">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-gray-800 text-xs font-light">{c.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="p-4 border-t border-gray-100 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={commentSender}
                  onChange={(e) => setCommentSender(e.target.value)}
                  placeholder="Your Name"
                  className="w-1/3 px-3 py-2 rounded-xl bg-gray-50 text-xs text-gray-900 border border-gold-500/30 focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment on this video..."
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-50 text-xs text-gray-900 border border-gold-500/30 focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="p-2 rounded-xl bg-black text-gold-400 hover:bg-gray-800 transition-colors disabled:opacity-50 border border-gold-500/30"
                >
                  <Send className="w-4 h-4 text-gold-400" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. UPLOAD GUEST WISH MODAL (WISHES ONLY - VIDEO OR TEXT FORMAT) */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="p-6 rounded-3xl border-2 border-gold-500 bg-white text-gray-900 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-black text-gold-400 flex items-center justify-center border border-gold-500/30">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-900">Send Your Wedding Wish</h3>
                  <p className="text-[10px] text-gold-600 font-bold">Upload video clip or text wish for the bride and groom</p>
                </div>
              </div>

              {uploadSuccess ? (
                <div className="py-8 text-center text-emerald-600 space-y-2">
                  <CheckCircle className="w-12 h-12 mx-auto animate-bounce" />
                  <p className="font-bold text-sm">Wish Uploaded Successfully!</p>
                  <p className="text-[11px] text-gray-500">Your wish is now live on the wedding feed.</p>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs text-left">
                  <div>
                    <label className="block text-gray-900 font-bold mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      placeholder="e.g. Aunt Meron & Family"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gold-500/30 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-1">Wish Message / Caption *</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write your sweet wish for the couple..."
                      rows={3}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gold-500/30 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-1">Wish Video Clip (Optional)</label>
                    <label className="border-2 border-dashed border-gold-500/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all bg-gray-50">
                      <Upload className="w-5 h-5 text-gold-600 mb-1" />
                      <span className="text-[11px] text-gray-900 font-medium">Record or choose wish video</span>
                      <span className="text-[9px] text-gray-500">MP4, MOV video up to 60s</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                      />
                    </label>
                    {videoFile && (
                      <p className="text-[10px] text-emerald-600 mt-1">✓ Selected: {videoFile.name}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs shadow-gold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2 border border-gold-400/40"
                  >
                    {uploading ? 'Publishing Wish...' : 'Publish Wish 💖'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TikTokMemoryFeedPage({ params }: { params: { slug: string } }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-black text-gold-400 flex items-center justify-center font-serif text-sm">Opening TikTok Feed...</div>}>
      <TikTokMemoryFeedContent params={params} />
    </React.Suspense>
  );
}

