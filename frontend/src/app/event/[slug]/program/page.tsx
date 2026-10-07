'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  MapPin, 
  Home, 
  Heart, 
  Camera, 
  Crown
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface ProgramItem {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
}

interface EventData {
  brideName: string;
  groomName: string;
  venueName: string;
  venueAddress: string;
  eventDate: string;
  programs?: ProgramItem[];
}

function WeddingProgramContent({ params }: { params: { slug: string } }) {
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
        console.error('Failed to load event for program page:', err);
      }
    }
    loadEvent();
  }, [slug]);

  const brideName = event?.brideName || 'Bride';
  const groomName = event?.groomName || 'Groom';
  const coupleTitle = `${brideName} & ${groomName}`;
  const venueTitle = event?.venueName || 'Main Wedding Venue';

  const defaultPrograms: ProgramItem[] = [
    {
      id: 'p1',
      time: '10:00 AM',
      title: 'Holy Matrimony & Blessing',
      location: 'Holy Trinity Cathedral',
      description: 'Sacred church wedding ceremony, prayer of blessing, and exchange of rings.'
    },
    {
      id: 'p2',
      time: '04:00 PM',
      title: 'Grand Wedding Reception',
      location: venueTitle,
      description: 'Grand entrance of the couple, champagne toast, multi-course dinner banquet, and couple dance.'
    },
    {
      id: 'p3',
      time: '08:00 PM',
      title: 'Melse & Cultural Tradition',
      location: 'Traditional Cultural Hall',
      description: 'Ethio-Eritrean traditional attire celebration, kebero music performance, and cutting of the Himbasha.'
    }
  ];

  const activePrograms = event?.programs && Array.isArray(event.programs) && event.programs.length > 0
    ? event.programs
    : defaultPrograms;

  return (
    <div className="min-h-screen w-full bg-stone-950 text-white flex justify-center selection:bg-gold-500 selection:text-black font-sans relative overflow-x-hidden">
      {/* Fixed/Rigged 100% Height Cover Background Photo Layer */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
        <img
          src="/images/hero_couple_bg.png"
          alt=""
          className="w-full h-full object-cover object-center filter brightness-100 contrast-105 saturate-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-black/45 to-stone-950/90" />
      </div>

      {/* Main Centered Frame (100% Mobile, 60% Width Centered on Desktop with 20% Left/Right Margins) */}
      <div className="relative z-10 w-full lg:w-[60vw] min-h-screen flex flex-col pb-32 border-x border-gold-500/30 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        
        {/* Background Glow Accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

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
            <span>{rsvpGuestName ? `Invitation for ${rsvpGuestName}` : 'Event Schedule & Programs'}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* 2. HERO HEADER SECTION */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs font-extrabold tracking-widest uppercase shadow-md">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>OFFICIAL WEDDING TIMELINE</span>
          </div>
          <h1 className="font-script text-5xl sm:text-7xl font-bold text-white drop-shadow-2xl py-1">
            {coupleTitle}'s Program Schedule
          </h1>
          <p className="text-gray-300 font-serif italic text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow">
            "Join us for each memorable chapter of our wedding celebration, from holy vows to evening reception."
          </p>
          <div className="w-36 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* 3. PROGRAM LIST ITEMS */}
        <div className="space-y-4">
          {activePrograms.map((item, index) => {
            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="p-6 sm:p-8 rounded-3xl bg-black/80 backdrop-blur-xl border border-gold-500/40 hover:border-gold-500 transition-all shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/40 shadow-md mt-1 sm:mt-0">
                    <Sparkles className="w-6 h-6 text-gold-400" />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold text-[9px] uppercase tracking-widest border border-gold-500/30">
                        EVENT #{index + 1}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gold-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm font-light pt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-2.5 rounded-2xl bg-gold-500/20 border border-gold-500/50 text-gold-300 font-mono font-extrabold text-sm sm:text-base shrink-0 self-end sm:self-center shadow-md">
                  {item.time}
                </div>
              </motion.div>
            );
          })}
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
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Heart className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">{t('nav.history', 'Couple History')}</span>
          <span className="sm:hidden">{t('nav.history', 'History')}</span>
        </Link>

        <Link
          href={`/event/${slug}/program${queryString}`}
          className="px-4 py-2 rounded-full bg-gold-500 text-black shadow-gold scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-4 h-4 shrink-0 fill-black" />
          <span className="hidden sm:inline">{t('nav.program', 'Lists of Programs')}</span>
          <span className="sm:hidden">{t('nav.program', 'Programs')}</span>
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

export default function WeddingProgramPage({ params }: { params: { slug: string } }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-stone-950 text-gold-400 flex items-center justify-center text-sm font-serif">Loading program...</div>}>
      <WeddingProgramContent params={params} />
    </React.Suspense>
  );
}
