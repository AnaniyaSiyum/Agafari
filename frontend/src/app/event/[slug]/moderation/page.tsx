'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardSecurityGate from '@/components/DashboardSecurityGate';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  Film, 
  ThumbsUp, 
  ThumbsDown,
  Lock,
  RefreshCw,
  Crown,
  KeyRound,
  Mail,
  UserCheck,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Camera,
  Tag,
  X,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';
import { inspectImageFile, IMAGE_SPECS, ImageInspectionResult } from '@/lib/imageInspector';

interface MediaItem {
  id: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  category: 'WISHES' | 'BTS' | 'LIVE' | 'GALLERY' | 'CEREMONY' | 'ENGAGEMENT' | 'PRE_WEDDING' | 'MEZMUR';
  cdnUrl: string;
  caption: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

function EventMediaModerationContent({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useTranslation();

  const [authUser, setAuthUser] = useState<{ userId: string; email: string; role: string } | null>(null);
  const [eventData, setEventData] = useState<{ id: string; title: string; brideName: string; groomName: string; adminApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Moderator Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [modUploaderName, setModUploaderName] = useState('Official Photographer');
  const [modCategory, setModCategory] = useState<'GALLERY' | 'ENGAGEMENT' | 'PRE_WEDDING' | 'CEREMONY' | 'BTS' | 'WISHES'>('GALLERY');
  const [modMediaType, setModMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [modCaption, setModCaption] = useState('');
  const [modCdnUrl, setModCdnUrl] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Authenticate user & verify per-event staff access
  useEffect(() => {
    async function verifyAccess() {
      try {
        const eventRes = await fetch(`/api/events/${slug}`);
        if (eventRes.ok) {
          const eventJson = await eventRes.json();
          const evt = eventJson.event;
          if (evt) {
            setEventData({
              id: evt.id,
              title: evt.title,
              brideName: evt.bride_name || evt.brideName || 'Bride',
              groomName: evt.groom_name || evt.groomName || 'Groom',
              adminApprovalStatus: evt.adminApprovalStatus || evt.admin_approval_status || 'APPROVED',
            });
          }
        }

        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authJson = await authRes.json();
          setAuthUser(authJson.user);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        setIsAuthorized(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAccess();
  }, [slug]);

  // Fetch Media & Mezmur Music Items
  const fetchMedia = async () => {
    setLoadingMedia(true);
    try {
      const [res, musicRes] = await Promise.all([
        fetch(`/api/events/${slug}/media?status=ALL`),
        fetch(`/api/events/${slug}/music?status=ALL`)
      ]);

      let rawItems: any[] = [];
      if (res.ok) {
        const data = await res.json();
        rawItems = [...(data.items || data.mediaAssets || [])];
      }

      if (musicRes.ok) {
        const mData = await musicRes.json();
        const musicRecs = mData.recommendations || mData.items || [];
        const existingIds = new Set(rawItems.map((i: any) => i.id));

        for (const m of musicRecs) {
          if (!existingIds.has(m.id)) {
            rawItems.push({
              id: m.id,
              uploader_name: m.guestName || m.uploaderName || 'Honored Guest',
              media_type: 'MEZMUR',
              category: 'MEZMUR',
              cdn_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
              caption: typeof m.title === 'string' ? JSON.stringify({ title: m.title, artist: m.artist || '' }) : m.caption,
              status: m.status || 'PENDING',
              created_at: m.createdAt || new Date().toISOString(),
            });
          }
        }
      }

      const normalized = rawItems.map((item: any) => ({
        id: item.id,
        uploaderName: item.uploaderName || item.uploader_name || 'Anonymous Guest',
        mediaType: item.mediaType || item.media_type || 'IMAGE',
        category: item.category || 'WISHES',
        cdnUrl: item.cdnUrl || item.cdn_url || item.url || '',
        caption: item.caption || '',
        status: item.status || 'PENDING',
        createdAt: item.createdAt || item.created_at || new Date().toISOString(),
      }));
      setMediaList(normalized);
    } catch (err) {
      console.error('Failed to load media assets:', err);
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchMedia();
    }
  }, [isAuthorized, slug, eventData?.id]);

  const handleUpdateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setMediaList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    try {
      const res = await fetch('/api/organizer/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventId: eventData?.id, 
          mediaId: id, 
          status: newStatus,
          action: newStatus === 'APPROVED' ? 'approve' : 'reject' 
        }),
      });
      if (res.ok) {
        setActionSuccess(`Status updated to ${newStatus.toLowerCase()}!`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update media status:', err);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset permanently?')) return;
    setMediaList((prev) => prev.filter((item) => item.id !== id));
    try {
      const res = await fetch(`/api/organizer/media?mediaId=${id}&eventId=${eventData?.id || ''}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setActionSuccess('Media asset permanently deleted.');
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete media asset:', err);
    }
  };

  const [modInspection, setModInspection] = useState<ImageInspectionResult | null>(null);

  // Moderator direct file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        const inspection = await inspectImageFile(file, 'MEDIA_ASSET');
        setModInspection(inspection);
        setModMediaType('IMAGE');
      } else {
        setModInspection(null);
        setModMediaType('VIDEO');
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        if (result) {
          setModCdnUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModeratorUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modCdnUrl) {
      alert('Please choose a file or paste an image/video URL.');
      return;
    }
    setUploadingMedia(true);
    try {
      const res = await fetch('/api/organizer/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: eventData?.id,
          uploaderName: modUploaderName,
          mediaType: modMediaType,
          category: modCategory,
          cdnUrl: modCdnUrl,
          caption: modCaption,
          status: 'APPROVED'
        }),
      });

      if (res.ok) {
        setActionSuccess('New media asset published directly to Gallery & TikTok feed!');
        setTimeout(() => setActionSuccess(null), 3000);
        setIsUploadOpen(false);
        setModCaption('');
        setModCdnUrl('');
        fetchMedia();
      }
    } catch (err) {
      console.error('Failed to post moderator media:', err);
    } finally {
      setUploadingMedia(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3 bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-sm w-full">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
            <ShieldCheck className="w-6 h-6 animate-pulse text-amber-600" />
          </div>
          <p className="font-bold text-slate-800 text-sm">Loading Moderator Studio...</p>
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
            Content moderation studio operations for this wedding are locked while awaiting System Admin review. The studio will activate automatically upon approval.
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
            This wedding event request was rejected by the System Admin. Content moderation operations are disabled.
          </p>
        </div>
      </div>
    );
  }

  const filteredItems = mediaList.filter((item) => {
    const statusMatch = filterStatus === 'ALL' || item.status === filterStatus;
    const categoryMatch = filterCategory === 'ALL' || item.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  const pendingCount = mediaList.filter((m) => m.status === 'PENDING').length;
  const approvedCount = mediaList.filter((m) => m.status === 'APPROVED').length;
  const rejectedCount = mediaList.filter((m) => m.status === 'REJECTED').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      
      {/* Top Mobile/Desktop Navigation Header */}
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
                Content Moderator
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-mono text-[11px]">/{slug}</span>
            </div>
            <h1 className="font-bold text-base sm:text-lg text-slate-900 mt-0.5 tracking-tight flex items-center gap-2">
              <span>{eventData?.title || slug}</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] animate-pulse">
                  {pendingCount} Pending
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setModCategory('GALLERY');
              setModMediaType('IMAGE');
              setIsUploadOpen(true);
            }}
            className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Add Media Asset</span>
          </button>

          <button
            onClick={fetchMedia}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all border border-slate-200/80 active:scale-95 cursor-pointer"
            title="Refresh Queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6 flex-1">

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Status Metrics Cards Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`p-5 rounded-3xl border text-left transition-all cursor-pointer ${
              filterStatus === 'PENDING'
                ? 'bg-amber-50 border-amber-300 shadow-md ring-2 ring-amber-400/40'
                : 'bg-white border-slate-200/90 shadow-sm hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" /> Pending Approval
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200">
                {pendingCount}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Guest wishes & BTS media awaiting check</p>
          </button>

          <button
            onClick={() => setFilterStatus('APPROVED')}
            className={`p-5 rounded-3xl border text-left transition-all cursor-pointer ${
              filterStatus === 'APPROVED'
                ? 'bg-emerald-50 border-emerald-300 shadow-md ring-2 ring-emerald-400/40'
                : 'bg-white border-slate-200/90 shadow-sm hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approved Assets
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
                {approvedCount}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Live on Gallery & TikTok video feed</p>
          </button>

          <button
            onClick={() => setFilterStatus('REJECTED')}
            className={`p-5 rounded-3xl border text-left transition-all cursor-pointer ${
              filterStatus === 'REJECTED'
                ? 'bg-rose-50 border-rose-300 shadow-md ring-2 ring-rose-400/40'
                : 'bg-white border-slate-200/90 shadow-sm hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" /> Rejected Assets
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200">
                {rejectedCount}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Filtered out from public view</p>
          </button>
        </div>

        {/* Category Filters Pill Bar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5 px-2">
            <Tag className="w-4 h-4 text-amber-600" /> Category:
          </span>
          {['ALL', 'MEZMUR', 'GALLERY', 'ENGAGEMENT', 'PRE_WEDDING', 'CEREMONY', 'BTS', 'WISHES'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat === 'MEZMUR' ? '🎵 MEZMUR & MUSIC' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900 tracking-tight">
              {filterStatus} Submissions ({filteredItems.length})
            </h2>
            <button
              onClick={() => {
                setFilterStatus('ALL');
                setFilterCategory('ALL');
              }}
              className="text-xs text-amber-700 hover:underline font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          {loadingMedia ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center text-slate-500 shadow-sm">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-medium">Loading media submission queue...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center text-slate-500 space-y-2 shadow-sm">
              <Film className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-base text-slate-800">No {filterStatus.toLowerCase()} submissions found</p>
              <p className="text-xs text-slate-400">Click "+ Add Media Asset" above to upload photos or videos directly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                let mezmurTitle = item.caption;
                let mezmurArtist = '';
                if (item.category === 'MEZMUR' && item.caption) {
                  try {
                    if (item.caption.startsWith('{')) {
                      const p = JSON.parse(item.caption);
                      mezmurTitle = p.title || item.caption;
                      mezmurArtist = p.artist || '';
                    } else if (item.caption.includes('|')) {
                      const parts = item.caption.split('|');
                      mezmurTitle = parts[0].trim();
                      mezmurArtist = parts[1]?.trim() || '';
                    }
                  } catch (e) {}
                }

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Header Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
                            {(item.uploaderName || 'A').charAt(0)}
                          </div>
                          <div className="truncate">
                            <div className="font-bold text-slate-900 text-xs truncate">{item.uploaderName}</div>
                            <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">{item.category || 'WISHES'}</div>
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : item.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      {/* Media Preview Box */}
                      {item.category === 'MEZMUR' ? (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                            <span>🎵 Mezmur & Music Recommendation</span>
                          </div>
                          <div className="font-serif font-bold text-base text-slate-900 leading-snug">
                            {mezmurTitle}
                          </div>
                          {mezmurArtist && (
                            <div className="text-xs text-amber-900 font-semibold">
                              by {mezmurArtist}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-500 font-mono pt-1">
                            Suggested by: {item.uploaderName}
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 relative shadow-inner">
                          {item.mediaType === 'VIDEO' || (item.cdnUrl && item.cdnUrl.includes('.mp4')) ? (
                            <video
                              src={item.cdnUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={item.cdnUrl}
                              alt={item.caption || 'Wedding upload'}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      )}

                    {/* Caption */}
                    {item.caption && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80 font-medium">
                        "{item.caption}"
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'APPROVED')}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
                        item.status === 'APPROVED'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                      title="Approve for public view"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.status === 'APPROVED' ? 'Approved ✓' : 'Approve'}</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
                        item.status === 'REJECTED'
                          ? 'bg-rose-700 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                      title="Reject from public view"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{item.status === 'REJECTED' ? 'Rejected ✗' : 'Reject'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition-all border border-slate-200/80 cursor-pointer active:scale-95"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      </main>

      {/* Moderator Direct Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-left relative text-slate-900">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Camera className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {modMediaType === 'VIDEO' ? 'Upload Video Asset' : 'Upload Photo Asset'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Directly publish BTS videos, wish videos, or photos to Gallery & Feed</p>
              </div>
            </div>

            <form onSubmit={handleModeratorUploadSubmit} className="space-y-4 text-xs">
              {/* Media Type Switcher */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setModMediaType('VIDEO')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modMediaType === 'VIDEO'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Film className="w-4 h-4 text-amber-400" />
                  <span>Video Clip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModMediaType('IMAGE')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modMediaType === 'IMAGE'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Photo / Image</span>
                </button>
              </div>

              {/* Quick Category Target Presets */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Target Destination & Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {['BTS', 'WISHES', 'GALLERY'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setModCategory(cat as any)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                        modCategory === cat
                          ? 'bg-amber-100 border-amber-300 text-amber-900 ring-2 ring-amber-400/40'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-300'
                      }`}
                    >
                      {cat === 'BTS' ? '🎬 BTS Video' : cat === 'WISHES' ? '💖 Guest Wish' : '🖼️ Gallery'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Uploader / Moderator Name</label>
                  <input
                    type="text"
                    value={modUploaderName}
                    onChange={(e) => setModUploaderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ceremony Tag</label>
                  <select
                    value={modCategory}
                    onChange={(e) => setModCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 font-bold"
                  >
                    <option value="BTS">Behind The Scenes (BTS)</option>
                    <option value="WISHES">Guest Wish Video / Note</option>
                    <option value="GALLERY">General Gallery</option>
                    <option value="ENGAGEMENT">Engagement Shoot</option>
                    <option value="PRE_WEDDING">Pre-Wedding Vows</option>
                    <option value="CEREMONY">Church Matrimony</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {modCdnUrl ? "Change Cover Photo" : "Select File from Device"}
                </label>
                {modMediaType === 'IMAGE' && (
                  <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-[11px] mb-2 font-medium">
                    📐 Recommended Specs: 1200 × 800 px (3:2 / 4:5 Gallery Format) • Max 15MB
                  </div>
                )}
                <input
                  type="file"
                  accept={modMediaType === 'VIDEO' ? 'video/*' : 'image/*'}
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-600 cursor-pointer"
                />

                {modInspection && modMediaType === 'IMAGE' && (
                  modInspection.isOptimal ? (
                    <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold">{modInspection.statusBadgeText}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2 shadow-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-bold block">{modInspection.statusBadgeText}</span>
                        <p className="text-[11px] text-amber-800 leading-relaxed">{modInspection.warningMessage}</p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Or Paste Direct Media URL</label>
                <input
                  type="url"
                  placeholder={modMediaType === 'VIDEO' ? 'https://assets.mixkit.co/...' : 'https://images.unsplash.com/...'}
                  value={modCdnUrl}
                  onChange={(e) => setModCdnUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              {modCdnUrl && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 max-h-40 relative shadow-inner">
                  {modMediaType === 'VIDEO' || modCdnUrl.includes('.mp4') || modCdnUrl.startsWith('data:video/') ? (
                    <video src={modCdnUrl} controls autoPlay loop muted className="w-full h-full object-cover" />
                  ) : (
                    <img src={modCdnUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={modCaption}
                  onChange={(e) => setModCaption(e.target.value)}
                  placeholder={modCategory === 'WISHES' ? 'Write the wish blessing message...' : 'Enter video description or title...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingMedia}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Upload className="w-4 h-4 text-slate-950" />
                <span>{uploadingMedia ? 'Publishing Asset...' : `Publish Approved Asset Directly to Gallery & Feed`}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function EventMediaModerationPage({ params }: { params: { slug: string } }) {
  return (
    <DashboardSecurityGate
      dashboardTitle="Media Content Moderation Suite"
      dashboardId={`moderator:${params.slug}`}
      dashboardType="moderator"
      slug={params.slug}
      defaultEmail={`moderator@${params.slug}.com`}
    >
      <EventMediaModerationContent params={params} />
    </DashboardSecurityGate>
  );
}
