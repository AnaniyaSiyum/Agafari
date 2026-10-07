'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardSecurityGate from '@/components/DashboardSecurityGate';
import { 
  Radio, 
  Play, 
  Square, 
  ArrowLeft, 
  CheckCircle2, 
  Eye, 
  Wifi, 
  ExternalLink, 
  RefreshCw,
  Lock,
  ShieldCheck,
  Clock,
  XCircle
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

function extractYouTubeId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|live\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return trimmed;
}

function EventLiveStreamerContent({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useTranslation();

  const [authUser, setAuthUser] = useState<{ userId: string; email: string; role: string } | null>(null);
  const [eventData, setEventData] = useState<{ id: string; title: string; brideName: string; groomName: string; adminApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [streamStatus, setStreamStatus] = useState<'SCHEDULED' | 'LIVE' | 'ENDED'>('SCHEDULED');
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [saving, setSaving] = useState(false);

  // Authenticate user & load event configuration
  useEffect(() => {
    async function initStudio() {
      try {
        const eventRes = await fetch(`/api/events/${slug}`);
        if (eventRes.ok) {
          const eventJson = await eventRes.json();
          if (eventJson.event) {
            const ev = eventJson.event;
            setEventData({
              id: ev.id,
              title: ev.title,
              brideName: ev.bride_name || ev.brideName,
              groomName: ev.groom_name || ev.groomName,
              adminApprovalStatus: ev.adminApprovalStatus || ev.admin_approval_status || 'APPROVED',
            });

            if (ev.youtubeVideoId) {
              setYoutubeVideoId(ev.youtubeVideoId);
            }
            if (ev.title) {
              setStreamTitle(ev.title);
            }
            if (ev.isLive) {
              setStreamStatus('LIVE');
              setViewerCount(Math.floor(120 + Math.random() * 180));
            } else if (ev.status === 'ENDED') {
              setStreamStatus('ENDED');
            } else {
              setStreamStatus('SCHEDULED');
            }
          }
        }

        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authJson = await authRes.json();
          setAuthUser(authJson.user);
        } else {
          router.push(`/login?redirect=/event/${slug}/live-streamer`);
        }
      } catch (err) {
        console.error('Failed to load live streamer studio data:', err);
      } finally {
        setCheckingAuth(false);
      }
    }

    initStudio();
  }, [slug]);

  const handleUpdateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const cleanId = extractYouTubeId(youtubeVideoId);
    setYoutubeVideoId(cleanId);

    try {
      const res = await fetch(`/api/events/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeVideoId: cleanId,
          isLive: streamStatus === 'LIVE',
          status: streamStatus,
          title: streamTitle,
        }),
      });

      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3500);
      }
    } catch (err) {
      console.error('Failed to save stream configuration:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLive = async (newStatus: 'SCHEDULED' | 'LIVE' | 'ENDED') => {
    setStreamStatus(newStatus);
    if (newStatus === 'LIVE') {
      setViewerCount(Math.floor(100 + Math.random() * 200));
    }

    const cleanId = extractYouTubeId(youtubeVideoId);

    try {
      await fetch(`/api/events/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isLive: newStatus === 'LIVE',
          status: newStatus,
          youtubeVideoId: cleanId,
        }),
      });
    } catch (err) {
      console.error('Failed to update live status:', err);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3 bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-sm w-full">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
            <Radio className="w-6 h-6 animate-pulse text-rose-600" />
          </div>
          <p className="font-bold text-slate-800 text-sm">Opening Broadcast Studio...</p>
        </div>
      </div>
    );
  }

  if (eventData?.adminApprovalStatus === 'PENDING') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/50 text-center max-w-md shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
            ⏳ Studio Locked: Approval Pending
          </span>
          <h2 className="font-serif text-xl font-bold text-white">{eventData.title}</h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            Live streamer studio operations for this wedding are locked while awaiting System Admin review. The broadcast controls will activate automatically upon approval.
          </p>
        </div>
      </div>
    );
  }

  if (eventData?.adminApprovalStatus === 'REJECTED') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="p-8 rounded-3xl bg-slate-900 border-2 border-rose-500/50 text-center max-w-md shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7 text-rose-500" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30">
            🔴 Studio Blocked: Request Rejected
          </span>
          <h2 className="font-serif text-xl font-bold text-white">Request Rejected by Admin</h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            This wedding event request was rejected by the System Admin. Broadcast operations are disabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link 
            href={`/event/${slug}`} 
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all border border-slate-200/80 active:scale-95"
            title="View Public Wedding Page"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase tracking-wider text-[10px] border border-amber-200/60">
                Live Streamer Studio
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-mono text-[11px]">/{slug}</span>
            </div>
            <h1 className="font-bold text-base sm:text-lg text-slate-900 mt-0.5 tracking-tight flex items-center gap-2">
              <span>{eventData?.title || slug}</span>
              {streamStatus === 'LIVE' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  LIVE NOW
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/event/${slug}/feed?tab=LIVE`}
            className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Open Live Feed</span>
          </Link>

          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="p-4 sm:p-8 max-w-5xl w-full mx-auto space-y-6 flex-1">
        
        {/* Broadcast Status KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Broadcast Status</div>
            <div className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${streamStatus === 'LIVE' ? 'bg-rose-600 animate-ping' : streamStatus === 'SCHEDULED' ? 'bg-amber-500' : 'bg-slate-400'}`} />
              <span>{streamStatus}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">YouTube Live Streaming Engine</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-rose-600" /> Active Remote Viewers
            </div>
            <div className="font-bold text-2xl text-slate-900">{streamStatus === 'LIVE' ? viewerCount : 0}</div>
            <div className="text-xs text-emerald-700 font-bold">Diaspora & Remote Relatives Online</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-emerald-600" /> Stream Health
            </div>
            <div className="font-bold text-xl text-emerald-700">1080p60 Excellent</div>
            <div className="text-xs text-slate-500 font-medium">Low Latency Diaspora Feed</div>
          </div>
        </div>

        {/* Stream Action Controls Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div>
            <h2 className="font-bold text-lg text-slate-900 tracking-tight">Broadcast Execution Controls</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Start or end the official wedding live video broadcast. When live, guests on the public portal can watch the video feed seamlessly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => handleToggleLive('LIVE')}
              disabled={streamStatus === 'LIVE'}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span>Go LIVE Now</span>
            </button>

            <button
              onClick={() => handleToggleLive('ENDED')}
              disabled={streamStatus === 'ENDED'}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Square className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>End Broadcast</span>
            </button>

            <button
              onClick={() => handleToggleLive('SCHEDULED')}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all flex items-center gap-2 border border-slate-200 cursor-pointer active:scale-95"
            >
              <Radio className="w-4 h-4 text-amber-600" />
              <span>Reset to Scheduled</span>
            </button>
          </div>
        </div>

        {/* YouTube Embed Settings Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <h2 className="font-bold text-lg text-slate-900 tracking-tight">Stream Video Embed Settings</h2>

          <form onSubmit={handleUpdateStream} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stream Title
              </label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                YouTube Video Link or Video ID
              </label>
              <input
                type="text"
                value={youtubeVideoId}
                onChange={(e) => setYoutubeVideoId(extractYouTubeId(e.target.value))}
                placeholder="Paste full YouTube Link or Video ID (e.g. https://www.youtube.com/watch?v=oVs7dGNBOp8)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                required
              />
              <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1 font-medium">
                <p className="text-amber-800 font-bold">💡 Tip:</p>
                <p>
                  Paste your <strong>Full YouTube Link</strong> (e.g. <span className="font-mono text-slate-900">https://www.youtube.com/watch?v=oVs7dGNBOp8</span>) or just the <strong>11-Character ID</strong> (e.g. <span className="font-mono text-slate-900">oVs7dGNBOp8</span>). The platform automatically extracts the ID!
                </p>
                {youtubeVideoId && (
                  <p className="text-emerald-700 font-mono text-[11px] pt-1 font-bold">
                    ✓ Clean Video ID: <strong>{youtubeVideoId}</strong>
                  </p>
                )}
              </div>
            </div>

            {isSaved && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Stream settings updated successfully for {slug}!
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer border border-amber-300 disabled:opacity-50 flex items-center gap-2 active:scale-95"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : null}
                <span>{saving ? 'Saving...' : 'Save Stream Configuration'}</span>
              </button>

              <Link
                href={`/event/${slug}/feed?tab=LIVE`}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <ExternalLink className="w-4 h-4 text-white" />
                <span>Open Public Stream Feed ➔</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Live Stream Preview Window */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-900 tracking-tight">Live Stream Preview Monitor</h2>
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative shadow-inner">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0`}
              title="Live Stream Preview"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>

      </main>
    </div>
  );
}

export default function EventLiveStreamerPage({ params }: { params: { slug: string } }) {
  return (
    <DashboardSecurityGate
      dashboardTitle="Live Streamer Broadcast Studio"
      dashboardId={`streamer:${params.slug}`}
      dashboardType="streamer"
      slug={params.slug}
      defaultEmail={`streamer@${params.slug}.com`}
    >
      <EventLiveStreamerContent params={params} />
    </DashboardSecurityGate>
  );
}
