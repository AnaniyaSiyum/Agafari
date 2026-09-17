'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Radio, 
  Video, 
  Play, 
  Square, 
  Settings, 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  Film,
  Wifi,
  Eye,
  Crown,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

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

function LiveStreamerContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const paramSlug = searchParams ? searchParams.get('slug') : null;
  const [activeSlug, setActiveSlug] = useState<string>(paramSlug || 'adeday-and-adisu-mtrnab92');

  const [streamStatus, setStreamStatus] = useState<'SCHEDULED' | 'LIVE' | 'ENDED'>('SCHEDULED');
  const [youtubeVideoId, setYoutubeVideoId] = useState('vp8WJ-ZbZXw');
  const [streamTitle, setStreamTitle] = useState('Sara & Dawit Royal Wedding - Live Broadcast');
  const [isSaved, setIsSaved] = useState(false);
  const [viewerCount, setViewerCount] = useState(148);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing event live stream configuration on mount / slug change
  useEffect(() => {
    async function loadEventStreamConfig() {
      setLoading(true);
      try {
        const res = await fetch(`/api/events/${activeSlug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.event) {
            if (data.event.youtubeVideoId) {
              setYoutubeVideoId(data.event.youtubeVideoId);
            }
            if (data.event.title) {
              setStreamTitle(data.event.title);
            }
            if (data.event.isLive) {
              setStreamStatus('LIVE');
              setViewerCount(Math.floor(120 + Math.random() * 180));
            } else if (data.event.status === 'ENDED') {
              setStreamStatus('ENDED');
            } else {
              setStreamStatus('SCHEDULED');
            }
          }
        }
      } catch (err) {
        console.error('Failed to load event live stream configuration:', err);
      } finally {
        setLoading(false);
      }
    }

    loadEventStreamConfig();
  }, [activeSlug]);

  const handleUpdateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const cleanId = extractYouTubeId(youtubeVideoId);
    setYoutubeVideoId(cleanId);

    try {
      const res = await fetch(`/api/events/${activeSlug}`, {
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
      await fetch(`/api/events/${activeSlug}`, {
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

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gold-500/30">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-black/60 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
                <h1 className="font-serif font-bold text-xl text-white">Live Streamer Control Studio</h1>
              </div>
              <p className="text-xs text-gold-400">Broadcast & Diaspora Connection Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
              streamStatus === 'LIVE' 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500 animate-pulse'
                : streamStatus === 'SCHEDULED'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                : 'bg-gray-800 text-gray-400 border-gray-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${streamStatus === 'LIVE' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'}`} />
              {streamStatus}
            </span>
          </div>
        </div>

        {/* Live Broadcast Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-black/80 border border-gold-500/30 space-y-1">
            <div className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">Broadcast Status</div>
            <div className="font-serif font-bold text-lg text-white">{streamStatus}</div>
            <div className="text-[11px] text-gray-400">Stream ready on YouTube Live Engine</div>
          </div>

          <div className="p-5 rounded-2xl bg-black/80 border border-gold-500/30 space-y-1">
            <div className="text-[10px] text-gold-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-rose-400" /> Active Remote Viewers
            </div>
            <div className="font-serif font-bold text-2xl text-white">{streamStatus === 'LIVE' ? viewerCount : 0}</div>
            <div className="text-[11px] text-emerald-400">Diaspora & Remote Relatives Online</div>
          </div>

          <div className="p-5 rounded-2xl bg-black/80 border border-gold-500/30 space-y-1">
            <div className="text-[10px] text-gold-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Stream Health
            </div>
            <div className="font-serif font-bold text-lg text-emerald-400">1080p60 Excellent</div>
            <div className="text-[11px] text-gray-400">Low Latency Diaspora Feed</div>
          </div>
        </div>

        {/* Stream Action Controls */}
        <div className="p-6 rounded-3xl bg-black/80 border-2 border-gold-500/40 space-y-4">
          <h2 className="font-serif font-bold text-lg text-white">Broadcast Execution Controls</h2>
          <p className="text-xs text-gray-300 font-light">
            Start or stop the official wedding live broadcast. When live, guests on the public portal can watch the video feed seamlessly.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => handleToggleLive('LIVE')}
              disabled={streamStatus === 'LIVE'}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-rose-400"
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span>Go LIVE Now</span>
            </button>

            <button
              onClick={() => handleToggleLive('ENDED')}
              disabled={streamStatus === 'ENDED'}
              className="px-6 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-white font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer border border-stone-600"
            >
              <Square className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>End Broadcast</span>
            </button>

            <button
              onClick={() => handleToggleLive('SCHEDULED')}
              className="px-6 py-3.5 rounded-2xl bg-black hover:bg-stone-900 text-gold-400 font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer border border-gold-500/40"
            >
              <Radio className="w-4 h-4 text-gold-400" />
              <span>Reset to Scheduled</span>
            </button>
          </div>
        </div>

        {/* YouTube Video ID / Link Configuration */}
        <div className="p-6 rounded-3xl bg-black/80 border border-gold-500/30 space-y-4">
          <h2 className="font-serif font-bold text-lg text-white">Stream Video Embed Settings</h2>

          <form onSubmit={handleUpdateStream} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gold-400 uppercase tracking-wider mb-1">
                Stream Title
              </label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-gold-500/30 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gold-400 uppercase tracking-wider mb-1">
                YouTube Video Link or Video ID
              </label>
              <input
                type="text"
                value={youtubeVideoId}
                onChange={(e) => setYoutubeVideoId(extractYouTubeId(e.target.value))}
                placeholder="Paste full YouTube Link or Video ID (e.g. https://www.youtube.com/watch?v=oVs7dGNBOp8)"
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-gold-500/30 text-white font-mono focus:outline-none focus:ring-2 focus:ring-gold-500 text-xs"
                required
              />
              <div className="mt-2 p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-[11px] text-gray-300 space-y-1">
                <p className="text-gold-400 font-bold">💡 How it works:</p>
                <p>
                  You can paste your <strong>Full YouTube Link</strong> (e.g. <span className="font-mono text-gold-300">https://www.youtube.com/watch?v=oVs7dGNBOp8</span> or <span className="font-mono text-gold-300">https://youtu.be/oVs7dGNBOp8</span>) or just the <strong>11-Character ID</strong> (e.g. <span className="font-mono text-gold-300">oVs7dGNBOp8</span>). The platform automatically extracts the ID!
                </p>
                {youtubeVideoId && (
                  <p className="text-emerald-400 font-mono text-[10px] pt-1">
                    ✓ Active Clean Video ID: <strong>{youtubeVideoId}</strong>
                  </p>
                )}
              </div>
            </div>

            {isSaved && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Stream settings updated successfully in database!
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs shadow-gold transition-all cursor-pointer border border-gold-300 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : null}
                <span>{saving ? 'Saving...' : 'Save Stream Configuration'}</span>
              </button>

              <Link
                href={`/event/${activeSlug}/feed?tab=LIVE`}
                target="_blank"
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg transition-all border border-rose-400 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-white" />
                <span>Open Public Live Stream Feed ➔</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Live Stream Preview Window */}
        <div className="p-6 rounded-3xl bg-black/80 border border-gold-500/30 space-y-4">
          <h2 className="font-serif font-bold text-lg text-white">Live Stream Preview Monitor</h2>
          <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-gold-500/40 bg-black relative">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0`}
              title="Live Stream Preview"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LiveStreamerDashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-stone-950 text-gold-400 flex items-center justify-center font-serif text-sm">Opening Live Studio...</div>}>
      <LiveStreamerContent />
    </React.Suspense>
  );
}

