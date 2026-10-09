'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardSecurityGate from '@/components/DashboardSecurityGate';
import { 
  QrCode, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Sparkles, 
  ChevronRight,
  Search
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
  venueName?: string;
  venue_name?: string;
}

function GateScannerRootContent() {
  const { t } = useTranslation();
  const router = useRouter();

  const [authUser, setAuthUser] = useState<{ userId: string; email: string; role: string } | null>(null);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [searchSlug, setSearchSlug] = useState('');

  useEffect(() => {
    async function initScannerLauncher() {
      // 1. Check URL query params for ?event=... or ?slug=...
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const targetSlug = urlParams.get('event') || urlParams.get('slug');
        if (targetSlug) {
          router.replace(`/event/${targetSlug}/scanner`);
          return;
        }
      }

      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          setCheckingAuth(false);
          router.push('/login?redirect=/scanner');
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
        } else if (user.role === 'GATE_SCANNER') {
          const storedUser = typeof window !== 'undefined' ? localStorage.getItem('agafari_user') : null;
          const parsed = storedUser ? JSON.parse(storedUser) : null;
          if (parsed?.eventSlug) {
            const targetOrg = parsed.organizerId || 'event';
            router.replace(`/${targetOrg}/${parsed.eventSlug}/scanner`);
            return;
          }
          const res = await fetch('/api/admin/events');
          if (res.ok) {
            const data = await res.json();
            eventList = data.events || [];
          }
        }

        setEvents(eventList);

        // If user has exactly one assigned event, auto-redirect to that event's gate scanner
        if (eventList.length === 1) {
          const e = eventList[0] as any;
          const targetOrg = e.isIndividual || e.managedBy === 'INDIVIDUAL' ? 'event' : (e.organizer_id || e.organizerId || 'org-ethio-weddings');
          router.replace(`/${targetOrg}/${e.slug}/scanner`);
          return;
        }
      } catch (err) {
        console.error('Failed to initialize gate scanner launcher:', err);
      } finally {
        setCheckingAuth(false);
      }
    }

    initScannerLauncher();
  }, [router]);

  const handleManualSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = searchSlug.trim().toLowerCase();
    if (cleaned) {
      router.push(`/event/${cleaned}/scanner`);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-gold-400 text-sm">{t('scannerPage.initializing')}</p>
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
            <h2 className="font-serif font-bold text-2xl text-white">{t('scannerPage.restrictedTitle')}</h2>
            <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">{t('scannerPage.securitySubtitle')}</p>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              {t('scannerPage.securityDescription')}
            </p>
          </div>

          <form onSubmit={handleManualSearchSubmit} className="space-y-3 pt-2 text-left">
            <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider">{t('scannerPage.enterSlugLabel')}</label>
            <div className="relative">
              <input
                type="text"
                value={searchSlug}
                onChange={(e) => setSearchSlug(e.target.value)}
                placeholder={t('scannerPage.placeholderSlug')}
                className="w-full px-4 py-3 pl-10 rounded-2xl bg-stone-900 border border-gold-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                required
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-gold cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-black" />
              <span>{t('scannerPage.launchBtn')}</span>
            </button>
          </form>

          <div className="space-y-2 pt-2 border-t border-stone-800">
            <Link
              href="/organizer/login"
              className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-gray-300 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-stone-700"
            >
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>{t('scannerPage.signInStaff')}</span>
            </Link>
            <Link
              href="/"
              className="block text-xs text-gray-400 hover:text-white pt-1"
            >
              {t('scannerPage.returnHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gold-500/30">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-black/60 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-gold-400" />
                <h1 className="font-serif font-bold text-xl text-white">{t('scannerPage.launchpadTitle')}</h1>
              </div>
              <p className="text-xs text-gold-400">{t('scannerPage.launchpadSubtitle')}</p>
            </div>
          </div>

          <LanguageSwitcher />
        </div>

        {/* Search Bar & Event Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span>{t('scannerPage.selectTerminal')} ({events.length})</span>
            </h2>

            <form onSubmit={handleManualSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={searchSlug}
                onChange={(e) => setSearchSlug(e.target.value)}
                placeholder={t('scannerPage.placeholderSlug')}
                className="px-3.5 py-2 rounded-xl bg-stone-900 border border-gold-500/30 text-white text-xs focus:ring-1 focus:ring-gold-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs transition-all cursor-pointer"
              >
                Go ➔
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((evt) => (
              <Link
                key={evt.id}
                href={`/${(evt as any).isIndividual ? 'event' : ((evt as any).organizer_id || (evt as any).organizerId || 'org-ethio-weddings')}/${evt.slug}/scanner`}
                className="p-6 rounded-3xl bg-black/80 border-2 border-gold-500/30 hover:border-gold-500 transition-all space-y-3 group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                      {t('scannerPage.gateActive')} • {evt.slug}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gold-400 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-gold-400 transition-colors">
                    {evt.title || `${evt.bride_name || evt.brideName} & ${evt.groom_name || evt.groomName}`}
                  </h3>
                  <p className="text-xs text-gray-400 font-light">
                    {t('scannerPage.launchpadSubtitle')}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-gold-400 font-bold">
                  <span>{t('scannerPage.openTerminalBtn')}</span>
                  <QrCode className="w-4 h-4 text-gold-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function GateScannerRootPage() {
  return (
    <DashboardSecurityGate
      dashboardTitle="Gate QR Security Scanner"
      dashboardId="scanner-root"
      dashboardType="scanner"
      defaultEmail="scanner@agafari.com"
    >
      <GateScannerRootContent />
    </DashboardSecurityGate>
  );
}

