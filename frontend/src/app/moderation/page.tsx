'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Film, 
  Calendar,
  Lock,
  ChevronRight,
  Sparkles,
  Crown
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface EventSummary {
  id: string;
  slug: string;
  title: string;
  brideName?: string;
  groomName?: string;
  bride_name?: string;
  groom_name?: string;
}

export default function MediaModerationRootPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [authUser, setAuthUser] = useState<{ userId: string; email: string; role: string } | null>(null);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function initModerationPortal() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          setCheckingAuth(false);
          return;
        }
        const authJson = await authRes.json();
        const user = authJson.user;
        setAuthUser(user);

        // Fetch events accessible to user
        let eventList: EventSummary[] = [];
        if (user.role === 'SYSTEM_ADMIN') {
          const res = await fetch('/api/admin/events');
          if (res.ok) {
            const data = await res.json();
            eventList = data.events || [];
          }
        } else if (user.role === 'EVENT_ORGANIZER') {
          const res = await fetch('/api/organizer/events');
          if (res.ok) {
            const data = await res.json();
            eventList = data.events || [];
          }
        } else {
          // Staff member / Content Moderator
          eventList = [];
        }

        setEvents(eventList);

        // If user has exactly one assigned event, auto-redirect to that event's moderation portal
        if (eventList.length === 1) {
          const e = eventList[0] as any;
          const targetOrg = e.isIndividual || e.managedBy === 'INDIVIDUAL' ? 'event' : (e.organizer_id || e.organizerId || 'org-ethio-weddings');
          router.replace(`/${targetOrg}/${e.slug}/moderation`);
        }
      } catch (err) {
        console.error('Failed to initialize moderation portal:', err);
      } finally {
        setCheckingAuth(false);
      }
    }

    initModerationPortal();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-gold-400 text-sm">Loading Media Moderator Portal...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-black/90 border-2 border-gold-500/40 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-500 flex items-center justify-center mx-auto animate-pulse">
            <Lock className="w-8 h-8 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-2xl text-white">Media Moderator Portal Restricted</h2>
            <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">Specific Event Content Security</p>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              The Media Moderator Dashboard is a restricted portal assigned per wedding. Public access is disabled. Please log in with authorized Content Moderator or Organizer credentials.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/organizer/login"
              className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-gold"
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Log In as Moderator / Organizer</span>
            </Link>
            <Link
              href="/"
              className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-gray-300 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-stone-700"
            >
              <ArrowLeft className="w-4 h-4 text-gray-400" />
              <span>Return to Public Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gold-500/30">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-black/60 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
                <h1 className="font-serif font-bold text-xl text-white">Media Moderator Portal</h1>
              </div>
              <p className="text-xs text-gold-400">Select a Wedding Event to Open its Specific Moderation Queue</p>
            </div>
          </div>

          <LanguageSwitcher />
        </div>

        {/* Event Selection Grid */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span>Select Wedding Event for Moderation ({events.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((evt) => (
              <Link
                key={evt.id}
                href={`/${(evt as any).isIndividual ? 'event' : ((evt as any).organizer_id || (evt as any).organizerId || 'org-ethio-weddings')}/${evt.slug}/moderation`}
                className="p-6 rounded-3xl bg-black/80 border-2 border-gold-500/30 hover:border-gold-500 transition-all space-y-3 group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 text-[10px] font-bold uppercase tracking-wider">
                      Event Slug: {evt.slug}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gold-400 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-gold-400 transition-colors">
                    {evt.title || `${evt.bride_name || evt.brideName} & ${evt.groom_name || evt.groomName} Wedding`}
                  </h3>
                  <p className="text-xs text-gray-400 font-light">
                    Review pending video wishes, BTS clips, and photo uploads submitted by guests for this wedding.
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-gold-400 font-bold">
                  <span>Open Event Moderation Queue</span>
                  <ShieldCheck className="w-4 h-4 text-gold-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
