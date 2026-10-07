'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Home, 
  Camera, 
  Clock, 
  Crown,
  Quote
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface StoryCardItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  image?: string;
}

interface EventData {
  brideName: string;
  groomName: string;
  venueName: string;
  eventDate: string;
  coverImageUrl?: string;
  couplePhotoUrl?: string;
  loveStory?: {
    headline: string;
    firstMetDate?: string;
    firstMetStory?: string;
    proposalDate?: string;
    proposalStory?: string;
    storyCards?: StoryCardItem[];
  };
}

function CoupleHistoryContent({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const rawQuery = searchParams ? searchParams.toString() : '';
  const queryString = rawQuery ? `?${rawQuery}` : '';
  const codeParam = searchParams?.get('code');
  const guestParam = searchParams?.get('guest') || searchParams?.get('name');

  const [event, setEvent] = useState<EventData | null>(null);
  const [rsvpGuestName, setRsvpGuestName] = useState<string>('');

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
    async function loadEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data.event);
        }
      } catch (err) {
        console.error('Failed to load event for history page:', err);
      }
    }
    loadEvent();
  }, [slug]);

  const brideName = event?.brideName || 'Bride';
  const groomName = event?.groomName || 'Groom';
  const coupleTitle = `${brideName} & ${groomName}`;
  const headline = event?.loveStory?.headline || 'Our Journey to Forever';

  const firstMetDate = event?.loveStory?.firstMetDate
    ? new Date(event.loveStory.firstMetDate).getFullYear().toString()
    : '2024';

  const firstMetStory = event?.loveStory?.firstMetStory ||
    `${brideName} and ${groomName} first crossed paths on a sunny afternoon. What began as a simple coffee conversation turned into hours of deep dialogue about faith, family traditions, and their shared vision for the future.`;

  const proposalDate = event?.loveStory?.proposalDate
    ? new Date(event.loveStory.proposalDate).getFullYear().toString()
    : '2025';

  const proposalStory = event?.loveStory?.proposalStory ||
    `During a weekend retreat, ${groomName} surprised ${brideName} with a romantic candlelight dinner by the water. With violin serenade playing, he proposed, and ${brideName} joyfully answered YES!`;

  const weddingYear = event?.eventDate
    ? new Date(event.eventDate).getFullYear().toString()
    : '2026';

  const rawWeddingDateStr = event?.eventDate ? (event.eventDate.includes('T') ? event.eventDate.split('T')[0] : event.eventDate) : '';
  const formattedWeddingDate = rawWeddingDateStr
    ? new Date(rawWeddingDateStr.replace(/-/g, '/')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const storyCardsFromDb = event?.loveStory?.storyCards;

  let timelineEvents: any[] = [];

  if (storyCardsFromDb && Array.isArray(storyCardsFromDb) && storyCardsFromDb.length > 0) {
    timelineEvents = storyCardsFromDb.map((card) => {
      let yearStr = '2024';
      if (card.date) {
        if (card.date.length === 4) {
          yearStr = card.date;
        } else {
          try {
            const parsed = new Date(card.date).getFullYear().toString();
            yearStr = !isNaN(Number(parsed)) ? parsed : card.date;
          } catch {
            yearStr = card.date;
          }
        }
      }
      return {
        year: yearStr,
        title: card.title || 'Story Chapter',
        subtitle: card.subtitle || 'OUR STORY',
        description: card.description || '',
        image: card.image || event?.couplePhotoUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
        badge: card.badge || 'OUR STORY',
      };
    });
  } else {
    timelineEvents = [
      {
        year: firstMetDate,
        title: 'A Chance Encounter & First Meeting',
        subtitle: 'The Beginning of Us',
        description: firstMetStory,
        image: event?.couplePhotoUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
        badge: 'THE BEGINNING',
      },
      {
        year: proposalDate,
        title: 'Under the Stars Proposal',
        subtitle: 'The Romantic Proposal',
        description: proposalStory,
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        badge: 'THE PROPOSAL',
      },
      {
        year: weddingYear,
        title: 'Our Royal Wedding Covenant',
        subtitle: formattedWeddingDate ? `${formattedWeddingDate}${event?.venueName ? ` • ${event.venueName}` : ''}` : (event?.venueName || 'Wedding Covenant'),
        description: `Surrounded by our beloved family, respected elders, and cherished friends, ${coupleTitle} unite their lives in holy matrimony and celebrate the beginning of forever.`,
        image: event?.coverImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        badge: 'FOREVER TOGETHER',
      },
    ];
  }

  return (
    <div className="min-h-screen w-full bg-stone-950 text-white flex justify-center selection:bg-gold-500 selection:text-black font-sans relative overflow-x-hidden">
      {/* Ambient Blurred Outer Background for Widescreen Desktop */}
      <div className="fixed inset-0 z-0 opacity-30 blur-3xl pointer-events-none scale-110">
        <img
          src={event?.coverImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'}
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-3xl" />
      </div>

      {/* Main Centered Phone-View Frame (100% on Mobile, ~60% Width / max-w-[620px] Centered on Desktop) */}
      <div className="relative z-10 w-full md:w-[60vw] md:max-w-[580px] lg:max-w-[620px] min-h-screen bg-stone-950 border-x border-gold-500/30 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col pb-32">
        
        {/* Background Glow Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-0" />
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
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span>{rsvpGuestName ? `Invitation for ${rsvpGuestName}` : 'Love Story & Journey'}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs font-extrabold tracking-widest uppercase shadow-md">
            <Heart className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span>{coupleTitle.toUpperCase()}'S LOVE STORY</span>
          </div>
          <h1 className="font-script text-5xl sm:text-7xl font-bold text-white drop-shadow-2xl py-1">
            {headline}
          </h1>
          <p className="text-gray-300 font-serif italic text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow">
            "Two lives, two hearts, joined together by faith, grace, and an everlasting love story."
          </p>
          <div className="w-36 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* 3. TIMELINE CARDS */}
        <div className="relative border-l-2 border-gold-500/40 ml-4 sm:ml-32 space-y-12 pl-6 sm:pl-10">
          {timelineEvents.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Timeline Gold Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-stone-950 border-4 border-gold-500 group-hover:scale-125 transition-transform shadow-gold" />

              {/* Year Badge */}
              <div className="hidden sm:block absolute -left-36 top-1 text-right font-mono font-extrabold text-gold-400 text-base">
                {item.year}
              </div>

              {/* Content Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-black/80 backdrop-blur-xl border border-gold-500/40 hover:border-gold-500 transition-all shadow-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-500/20 pb-3">
                  <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 font-bold text-[10px] uppercase tracking-widest border border-gold-500/30">
                    {item.badge}
                  </span>
                  <span className="sm:hidden font-mono text-xs font-bold text-gold-400">
                    {item.year}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-2 text-left">
                    <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-white">
                      {item.title}
                    </h3>
                    <div className="text-xs text-gold-400 font-semibold uppercase tracking-wider">
                      {item.subtitle}
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gold-500/30 shadow-md">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 md:h-36 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. LOVE QUOTE CARD */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-950/80 via-black/80 to-amber-950/80 backdrop-blur-xl border-2 border-gold-500/50 text-center space-y-3 shadow-2xl">
          <Quote className="w-10 h-10 text-gold-400 mx-auto opacity-60" />
          <p className="font-serif italic text-base sm:text-xl text-gold-200 max-w-2xl mx-auto">
            "Love is patient, love is kind. It always protects, always trusts, always hopes, always perseveres."
          </p>
          <div className="text-xs text-gold-400 font-bold uppercase tracking-widest pt-2">
            1 Corinthians 13:4-7
          </div>
        </div>
      </main>

      {/* FLOATING BOTTOM NAVIGATION DOCK */}
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
          className="px-4 py-2 rounded-full bg-gold-500 text-black shadow-gold scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Heart className="w-4 h-4 shrink-0 fill-black" />
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
      </div>
    </div>
  </div>
);
}

export default function CoupleHistoryPage({ params }: { params: { slug: string } }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-stone-950 text-gold-400 flex items-center justify-center text-sm font-serif">Loading history...</div>}>
      <CoupleHistoryContent params={params} />
    </React.Suspense>
  );
}
