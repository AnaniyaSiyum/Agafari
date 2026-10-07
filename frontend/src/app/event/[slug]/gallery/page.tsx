'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  ArrowLeft, 
  Sparkles, 
  Film, 
  Heart, 
  Home, 
  Calendar, 
  X, 
  Download, 
  Share2,
  Crown,
  Play
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface GalleryItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  category: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  likes: number;
}

function WeddingGalleryContent({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const rawQuery = searchParams ? searchParams.toString() : '';
  const queryString = rawQuery ? `?${rawQuery}` : '';
  const codeParam = searchParams?.get('code');
  const guestParam = searchParams?.get('guest') || searchParams?.get('name');

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [rsvpGuestName, setRsvpGuestName] = useState<string>('');

  const [dbMedia, setDbMedia] = useState<GalleryItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  useEffect(() => {
    if (guestParam) {
      setRsvpGuestName(decodeURIComponent(guestParam).trim());
    } else if (codeParam) {
      fetch(`/api/events/${slug}/invitations?code=${codeParam}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.invitation?.guestName) {
            setRsvpGuestName(data.invitation.guestName);
          }
        })
        .catch(() => {});
    }
  }, [slug, codeParam, guestParam]);

  useEffect(() => {
    async function fetchApprovedGalleryMedia() {
      try {
        const res = await fetch(`/api/events/${slug}/media?status=APPROVED`);
        if (res.ok) {
          const data = await res.json();
          const items = data.mediaAssets || data.items || [];
          const formatted: GalleryItem[] = items.map((m: any) => ({
            id: m.id,
            type: (m.mediaType || m.media_type || '').includes('VIDEO') || (m.cdnUrl || m.cdn_url || '').includes('.mp4') ? 'VIDEO' : 'IMAGE',
            category: (m.category || 'GALLERY').toUpperCase(),
            title: m.caption || `${m.uploaderName || m.uploader_name || 'Guest'}'s Shared Memory`,
            url: m.cdnUrl || m.cdn_url || m.url || '',
            likes: Number(m.likesCount || m.likes_count || 0)
          }));
          setDbMedia(formatted);
        }
      } catch (err) {
        console.error('Failed to load approved gallery media:', err);
      } finally {
        setLoadingMedia(false);
      }
    }

    fetchApprovedGalleryMedia();
  }, [slug]);

  const fallbackItems: GalleryItem[] = [
    {
      id: 'g1',
      type: 'IMAGE',
      category: 'ENGAGEMENT',
      title: 'Romantic Sunset Proposal at Lake Tana',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      likes: 142,
    },
    {
      id: 'g2',
      type: 'IMAGE',
      category: 'PRE_WEDDING',
      title: 'Traditional Habesha Kemis Portrait Session',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
      likes: 198,
    },
    {
      id: 'g3',
      type: 'IMAGE',
      category: 'ENGAGEMENT',
      title: 'Mount Entoto Forest Walk',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
      likes: 115,
    },
    {
      id: 'g4',
      type: 'IMAGE',
      category: 'BTS',
      title: 'Bridal Crown Fitting & Mezmurs',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
      likes: 89,
    },
    {
      id: 'g5',
      type: 'VIDEO',
      category: 'PRE_WEDDING',
      title: 'Royal Invitation Reel & Teaser',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-park-on-their-wedding-day-43185-large.mp4',
      likes: 254,
    },
    {
      id: 'g6',
      type: 'IMAGE',
      category: 'BTS',
      title: 'Sheraton Luxury Ballroom Floral Design',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
      likes: 176,
    },
  ];

  const allGalleryItems = dbMedia.length > 0 ? dbMedia : fallbackItems;

  const filteredItems = allGalleryItems.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory || (activeCategory === 'BTS' && item.category === 'WISHES');
  });

  return (
    <div className="min-h-screen w-full bg-stone-950 text-white flex justify-center selection:bg-gold-500 selection:text-black font-sans relative overflow-x-hidden">
      {/* Ambient Blurred Outer Background for Widescreen Desktop */}
      <div className="fixed inset-0 z-0 opacity-30 blur-3xl pointer-events-none scale-110">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-3xl" />
      </div>

      {/* Main Centered Phone-View Frame (100% on Mobile, ~60% Width / max-w-[620px] Centered on Desktop) */}
      <div className="relative z-10 w-full md:w-[60vw] md:max-w-[580px] lg:max-w-[620px] min-h-screen bg-stone-950 border-x border-gold-500/30 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col pb-32">
        
        {/* Background Glow Accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 1. TOP HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gold-500/30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <Link
            href={`/event/${slug}${queryString}`}
            className="w-9 h-9 rounded-full bg-black/60 border border-gold-500/40 text-gold-400 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link href={`/event/${slug}${queryString}`}>
            <img
              src="/branding/artboard-15.png"
              alt="Agafari Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/event/${slug}/feed${queryString}`}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 text-black text-xs font-extrabold shadow-gold hover:scale-105 transition-transform"
          >
            <Film className="w-3.5 h-3.5 text-black" />
            <span>TikTok Memory Feed</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* 2. HERO HEADER SECTION */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs font-extrabold tracking-widest uppercase shadow-md">
            <Camera className="w-3.5 h-3.5 text-gold-400" />
            <span>{rsvpGuestName ? `INVITATION FOR ${rsvpGuestName.toUpperCase()}` : 'MODERATOR APPROVED GALLERY'}</span>
          </div>
          <h1 className="font-script text-5xl sm:text-7xl font-bold text-white drop-shadow-2xl py-1">
            Photo & Video Gallery
          </h1>
          <p className="text-gray-300 font-serif italic text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow">
            "A collection of timeless moments, romantic portraits, and approved guest memories."
          </p>
          <div className="w-36 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* 3. CATEGORY FILTERS */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {[
            { id: 'ALL', label: 'All Memories' },
            { id: 'GALLERY', label: 'Gallery' },
            { id: 'ENGAGEMENT', label: 'Engagement Shoot' },
            { id: 'PRE_WEDDING', label: 'Pre-Wedding Vows' },
            { id: 'CEREMONY', label: 'Ceremony' },
            { id: 'BTS', label: 'Behind The Scenes' },
            { id: 'WISHES', label: 'Guest Wishes' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer border shadow-md ${
                activeCategory === cat.id
                  ? 'bg-gold-500 text-black border-gold-400 shadow-gold scale-105'
                  : 'bg-black/70 text-gold-300 border-gold-500/40 hover:bg-black/90'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 4. MASONRY PHOTO & VIDEO GRID */}
        {loadingMedia ? (
          <div className="p-12 text-center text-gold-400 font-serif text-sm">
            <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading approved gallery items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 rounded-3xl bg-black/60 border border-gold-500/30 text-center text-gray-400">
            No approved media assets found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-3xl overflow-hidden border-2 border-gold-500/30 hover:border-gold-500 transition-all cursor-pointer shadow-2xl bg-black/80 aspect-4/3 sm:aspect-square"
              >
                {item.type === 'VIDEO' ? (
                  <div className="w-full h-full relative flex items-center justify-center bg-black">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      muted
                    />
                    <div className="w-14 h-14 rounded-full bg-gold-500/80 text-black flex items-center justify-center absolute z-10 shadow-gold group-hover:scale-125 transition-transform">
                      <Play className="w-6 h-6 fill-black translate-x-0.5" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}

                {/* Gradient & Hover Caption Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-left space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500/30 text-gold-300 font-bold text-[9px] uppercase tracking-widest w-fit border border-gold-500/40">
                    {item.category.replace('_', ' ')}
                  </span>
                  <h3 className="font-serif font-bold text-white text-base leading-snug drop-shadow line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gold-400 pt-1 font-bold">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span>{item.likes} Likes</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* 5. LIGHTBOX MODAL PREVIEW */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 0 }}
              className="max-w-4xl w-full bg-black border-2 border-gold-500/60 rounded-3xl overflow-hidden relative shadow-2xl text-left"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/80 text-gold-400 flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all border border-gold-500/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative max-h-[70vh] flex items-center justify-center bg-black">
                {selectedItem.type === 'VIDEO' ? (
                  <video
                    src={selectedItem.url}
                    controls
                    autoPlay
                    className="w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className="w-full max-h-[70vh] object-contain"
                  />
                )}
              </div>

              <div className="p-6 bg-stone-950 border-t border-gold-500/30 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {selectedItem.title}
                  </h3>
                  <div className="text-xs text-gold-400 font-medium mt-0.5">
                    {selectedItem.category.replace('_', ' ')} • {selectedItem.likes} Likes
                  </div>
                </div>

                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-5 py-2.5 rounded-2xl bg-gold-500 text-black font-extrabold text-xs shadow-gold hover:bg-gold-400 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>Download</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. FLOATING BOTTOM NAVIGATION DOCK */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border-2 border-gold-500/60 rounded-full px-3 py-2 shadow-2xl flex items-center gap-2 sm:gap-3 text-xs font-bold">
        <Link
          href={`/event/${slug}${queryString}`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4 shrink-0" />
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
          className="px-4 py-2 rounded-full bg-gold-500 text-black shadow-gold scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span>{t('nav.gallery', 'Gallery')}</span>
        </Link>
      </div>
    </div>
  </div>
);
}

export default function WeddingGalleryPage({ params }: { params: { slug: string } }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-stone-950 text-gold-400 flex items-center justify-center text-sm font-serif">Loading gallery...</div>}>
      <WeddingGalleryContent params={params} />
    </React.Suspense>
  );
}
