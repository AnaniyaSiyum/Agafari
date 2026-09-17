'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  X
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface MediaItem {
  id: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  category: 'WISHES' | 'BTS' | 'LIVE' | 'GALLERY' | 'CEREMONY' | 'ENGAGEMENT' | 'PRE_WEDDING';
  cdnUrl: string;
  caption: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function EventMediaModerationPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useTranslation();

  const [authUser, setAuthUser] = useState<{ userId: string; email: string; role: string } | null>(null);
  const [eventData, setEventData] = useState<{ id: string; title: string; brideName: string; groomName: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Inline Sign-In form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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
          if (eventJson.event) {
            setEventData({
              id: eventJson.event.id,
              title: eventJson.event.title,
              brideName: eventJson.event.bride_name || eventJson.event.brideName || 'Bride',
              groomName: eventJson.event.groom_name || eventJson.event.groomName || 'Groom',
            });
          }
        }

        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authJson = await authRes.json();
          setAuthUser(authJson.user);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        setIsAuthorized(true);
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAccess();
  }, [slug]);

  // Inline sign in submission
  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter email and password.');
      return;
    }
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setAuthUser(data.user);
        setIsAuthorized(true);
        setActionSuccess(`Signed in successfully as ${data.user.email}`);
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setLoginError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setLoginError('Sign in failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  // Fetch Media Items
  const fetchMedia = async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch(`/api/events/${slug}/media?status=ALL`);
      if (res.ok) {
        const data = await res.json();
        const rawItems = data.items || data.mediaAssets || [];
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
      } else if (eventData?.id) {
        const orgRes = await fetch(`/api/organizer/media?eventId=${eventData.id}&status=ALL`);
        if (orgRes.ok) {
          const orgData = await orgRes.json();
          const rawItems = orgData.items || orgData.mediaAssets || [];
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
        }
      }
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

  // Moderator direct file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        if (result) {
          setModCdnUrl(result);
          if (file.type.startsWith('video/')) {
            setModMediaType('VIDEO');
          } else {
            setModMediaType('IMAGE');
          }
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
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-gold-400 text-sm">Loading Media Moderator Credentials...</p>
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
    <div className="min-h-screen bg-stone-950 text-white font-sans p-4 sm:p-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gold-500/30 gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href={`/event/${slug}`} 
              className="p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-all shrink-0"
              title="View Wedding Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
                <h1 className="font-serif font-bold text-xl text-white">
                  Media Moderator Portal
                </h1>
              </div>
              <p className="text-xs text-gold-400 font-semibold">
                Event: <span className="text-white font-bold">{eventData?.title || `${slug}`}</span> ({eventData?.brideName} & {eventData?.groomName})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                setModCategory('BTS');
                setModMediaType('VIDEO');
                setIsUploadOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-purple-400/40"
            >
              <Film className="w-4 h-4 text-purple-200" />
              <span>+ Upload BTS Video</span>
            </button>

            <button
              onClick={() => {
                setModCategory('WISHES');
                setModMediaType('VIDEO');
                setIsUploadOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-rose-400/40"
            >
              <Camera className="w-4 h-4 text-rose-200" />
              <span>+ Upload Wish Video</span>
            </button>

            <button
              onClick={() => {
                setModCategory('GALLERY');
                setModMediaType('IMAGE');
                setIsUploadOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-gold cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>+ Add Media Asset</span>
            </button>

            <button
              onClick={fetchMedia}
              className="p-2 rounded-xl bg-stone-900 border border-stone-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <span className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              {pendingCount} Pending
            </span>
          </div>
        </div>

        {/* Action Success Toast */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Status Metrics Selector Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              filterStatus === 'PENDING'
                ? 'bg-amber-950/60 border-amber-500 shadow-md'
                : 'bg-black/60 border-stone-800 hover:border-amber-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Pending Approval
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs">
                {pendingCount}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Guest wishes & BTS media awaiting check</p>
          </button>

          <button
            onClick={() => setFilterStatus('APPROVED')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              filterStatus === 'APPROVED'
                ? 'bg-emerald-950/60 border-emerald-500 shadow-md'
                : 'bg-black/60 border-stone-800 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Approved Assets
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                {approvedCount}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Live on Gallery & TikTok video feed</p>
          </button>

          <button
            onClick={() => setFilterStatus('REJECTED')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              filterStatus === 'REJECTED'
                ? 'bg-rose-950/60 border-rose-500 shadow-md'
                : 'bg-black/60 border-stone-800 hover:border-rose-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-400" /> Rejected Assets
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs">
                {rejectedCount}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Filtered out from public view</p>
          </button>
        </div>

        {/* Category Filters Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-gold-400" /> Category:
          </span>
          {['ALL', 'GALLERY', 'ENGAGEMENT', 'PRE_WEDDING', 'CEREMONY', 'BTS', 'WISHES'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                filterCategory === cat
                  ? 'bg-gold-500 text-black border-gold-400 shadow-sm'
                  : 'bg-stone-900 text-gray-300 border-stone-700 hover:border-gold-500/40'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-white">
              {filterStatus} Submissions ({filteredItems.length})
            </h2>
            <button
              onClick={() => {
                setFilterStatus('ALL');
                setFilterCategory('ALL');
              }}
              className="text-xs text-gold-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          {loadingMedia ? (
            <div className="p-12 text-center text-gray-400">
              <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Loading media submission queue...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 rounded-3xl bg-black/60 border border-stone-800 text-center text-gray-400 space-y-2">
              <Film className="w-10 h-10 text-gold-400/40 mx-auto" />
              <p className="font-serif text-base text-white">No {filterStatus.toLowerCase()} submissions found</p>
              <p className="text-xs text-gray-500">Click "Add Gallery / Feed Media" above to upload photos or videos directly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-3xl bg-black/80 border-2 border-gold-500/30 space-y-3 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-7 h-7 rounded-full bg-gold-500 text-black font-serif font-bold text-xs flex items-center justify-center shrink-0">
                          {(item.uploaderName || 'A').charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-white text-xs truncate">{item.uploaderName}</div>
                          <div className="text-[10px] text-gold-400 font-semibold uppercase tracking-wider">{item.category || 'WISHES'}</div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                        item.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                          : item.status === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Media Preview Box */}
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 relative">
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

                    {/* Caption */}
                    {item.caption && (
                      <p className="text-xs text-gray-200 font-light leading-relaxed bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                        "{item.caption}"
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'APPROVED')}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md ${
                        item.status === 'APPROVED'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                      title="Approve for public view"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.status === 'APPROVED' ? 'Approved ✓' : 'Approve'}</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md ${
                        item.status === 'REJECTED'
                          ? 'bg-rose-800 text-white'
                          : 'bg-rose-700 hover:bg-rose-600 text-white'
                      }`}
                      title="Reject from public view"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{item.status === 'REJECTED' ? 'Rejected ✗' : 'Reject'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      className="p-2 rounded-xl bg-stone-900 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition-all border border-stone-800 cursor-pointer"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Moderator Direct Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-stone-950 border-2 border-gold-500/60 rounded-3xl p-6 space-y-4 shadow-2xl text-left relative">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-gold-500/30 pb-3">
              <Camera className="w-5 h-5 text-gold-400" />
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  {modMediaType === 'VIDEO' ? 'Upload Video Asset' : 'Upload Photo Asset'}
                </h3>
                <p className="text-[11px] text-gold-400">Directly publish BTS videos, wish videos, or photos to Gallery & TikTok Memory Feed</p>
              </div>
            </div>

            <form onSubmit={handleModeratorUploadSubmit} className="space-y-4 text-xs">
              {/* Media Type Switcher */}
              <div className="flex items-center gap-2 bg-stone-900 p-1.5 rounded-2xl border border-stone-800">
                <button
                  type="button"
                  onClick={() => setModMediaType('VIDEO')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modMediaType === 'VIDEO'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Video Clip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModMediaType('IMAGE')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modMediaType === 'IMAGE'
                      ? 'bg-gold-500 text-black shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Photo / Image</span>
                </button>
              </div>

              {/* Quick Category Target Presets */}
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Target Destination & Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setModCategory('BTS')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                      modCategory === 'BTS'
                        ? 'bg-purple-950/80 border-purple-500 text-purple-300 ring-2 ring-purple-500/40'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-purple-500/40'
                    }`}
                  >
                    🎬 Behind Scenes (BTS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModCategory('WISHES')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                      modCategory === 'WISHES'
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500/40'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-rose-500/40'
                    }`}
                  >
                    💖 Guest Wish
                  </button>
                  <button
                    type="button"
                    onClick={() => setModCategory('GALLERY')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                      modCategory === 'GALLERY'
                        ? 'bg-gold-950/80 border-gold-500 text-gold-300 ring-2 ring-gold-500/40'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-gold-500/40'
                    }`}
                  >
                    🖼️ Main Gallery
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Uploader / Moderator Name</label>
                  <input
                    type="text"
                    value={modUploaderName}
                    onChange={(e) => setModUploaderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs focus:ring-1 focus:ring-gold-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Specific Ceremony Tag</label>
                  <select
                    value={modCategory}
                    onChange={(e) => setModCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs focus:ring-1 focus:ring-gold-500"
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
                <label className="block text-gray-300 font-bold mb-1">Select Video / Image File from Device</label>
                <input
                  type="file"
                  accept={modMediaType === 'VIDEO' ? 'video/*' : 'image/*'}
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold-500 file:text-black hover:file:bg-gold-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Or Paste Direct Web Video / Image URL</label>
                <input
                  type="url"
                  placeholder={modMediaType === 'VIDEO' ? 'https://assets.mixkit.co/videos/preview/mixkit-...' : 'https://images.unsplash.com/...'}
                  value={modCdnUrl}
                  onChange={(e) => setModCdnUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs focus:ring-1 focus:ring-gold-500"
                />
              </div>

              {modCdnUrl && (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-gold-500/40 max-h-40 relative">
                  {modMediaType === 'VIDEO' || modCdnUrl.includes('.mp4') || modCdnUrl.startsWith('data:video/') ? (
                    <video src={modCdnUrl} controls autoPlay loop muted className="w-full h-full object-cover" />
                  ) : (
                    <img src={modCdnUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
              )}

              <div>
                <label className="block text-gray-300 font-bold mb-1">Wish Message / Video Caption</label>
                <textarea
                  rows={2}
                  value={modCaption}
                  onChange={(e) => setModCaption(e.target.value)}
                  placeholder={modCategory === 'WISHES' ? 'Write the wish blessing message...' : 'Enter video description or title...'}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingMedia}
                className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs transition-all shadow-gold cursor-pointer flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-black" />
                <span>{uploadingMedia ? 'Publishing Video Asset...' : `Publish Approved ${modCategory === 'WISHES' ? 'Wish' : modCategory} Video Directly to TikTok Feed & Gallery`}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
