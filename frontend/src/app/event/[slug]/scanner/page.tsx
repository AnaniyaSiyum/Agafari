'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  QrCode, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  UserCheck, 
  Search,
  ArrowLeft,
  Camera,
  CameraOff,
  RefreshCw,
  Zap,
  Lock,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface ScanResult {
  code: string;
  guestName: string;
  maxGuests: number;
  scannedCount: number;
  tableNumber: string;
  status: 'VALID' | 'ALREADY_SCANNED' | 'INVALID';
  message: string;
  scannedAt?: string;
}

// Audio Feedback Synthesizer using Web Audio API
const playBeep = (type: 'detect' | 'success' | 'already' | 'error') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'detect') {
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'already') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(440, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(164.81, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // Audio context blocked by browser policy
  }
};

export default function EventGateScannerPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useTranslation();

  const [authUser, setAuthUser] = useState<{ userId: string; email: string; role: string } | null>(null);
  const [eventData, setEventData] = useState<{ id: string; title: string; brideName: string; groomName: string; venueName: string; adminApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [qrDetected, setQrDetected] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Authenticate user & verify per-event staff access
  useEffect(() => {
    async function verifyAccess() {
      try {
        const eventRes = await fetch(`/api/events/${slug}`);
        if (!eventRes.ok) {
          setCheckingAuth(false);
          return;
        }
        const eventJson = await eventRes.json();
        const evt = eventJson.event;
          setEventData({
            id: evt.id,
            title: evt.title,
            brideName: evt.bride_name || evt.brideName,
            groomName: evt.groom_name || evt.groomName,
            venueName: evt.venue_name || evt.venueName || 'Main Wedding Venue',
            adminApprovalStatus: evt.adminApprovalStatus || evt.admin_approval_status || 'APPROVED',
          });

        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authJson = await authRes.json();
          const user = authJson.user;
          setAuthUser(user);

          if (['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'GATE_SCANNER', 'BRIDE_GROOM'].includes(user.role)) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error('Failed to verify gate scanner access:', err);
        setIsAuthorized(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    verifyAccess();
  }, [slug]);

  // Start Camera QR Scanner Engine
  const startScanner = async () => {
    setCameraError(null);
    setIsCameraActive(true);

    // Allow DOM to mount <div id="qr-camera-reader" />
    setTimeout(async () => {
      try {
        const container = document.getElementById('qr-camera-reader');
        if (!container) return;

        if (html5QrCodeRef.current) {
          try {
            if (html5QrCodeRef.current.isScanning) {
              await html5QrCodeRef.current.stop();
            }
            html5QrCodeRef.current.clear();
          } catch (e) {}
        }

        const scanner = new Html5Qrcode('qr-camera-reader');
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdge * 0.7);
              return { width: qrboxSize, height: qrboxSize };
            },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            // STEP 1: DETECT QR CODE
            playBeep('detect');
            setQrDetected(true);

            // Pause scanner while verifying so it doesn't re-trigger continuously
            try {
              scanner.pause(true);
            } catch (e) {}

            // STEP 2 & 3: SCAN & VERIFY
            await executeVerification(decodedText);
          },
          () => {
            // Frame scanner heartbeat
          }
        );
      } catch (err: any) {
        console.warn('Camera scanner failed to start:', err);
        setCameraError(err?.message || 'Camera permission denied or camera device unavailable.');
        setIsCameraActive(false);
      }
    }, 150);
  };

  // Stop Camera Scanner Engine
  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {}
    }
    setIsCameraActive(false);
  };

  // Resume scanning next QR code
  const handleScanNext = () => {
    setScanResult(null);
    setQrDetected(false);
    if (html5QrCodeRef.current) {
      try {
        html5QrCodeRef.current.resume();
      } catch (e) {
        startScanner();
      }
    } else {
      startScanner();
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      startScanner();
    }
    return () => {
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().catch(() => {});
          }
          html5QrCodeRef.current.clear();
        } catch (e) {}
      }
    };
  }, [isAuthorized]);

  // Execute Code Extraction & Real/Fake Verification
  const executeVerification = async (codeToVerify: string) => {
    let rawInput = codeToVerify.trim();
    if (!rawInput) return;

    setVerifying(true);
    let extractedCode = rawInput;

    // 1. Try parsing JSON if input starts with {
    if (rawInput.startsWith('{')) {
      try {
        const parsed = JSON.parse(rawInput);
        if (parsed.inviteCode) extractedCode = parsed.inviteCode;
        else if (parsed.code) extractedCode = parsed.code;
      } catch (e) {}
    }
    // 2. Try extracting from URL query param ?code= or &code= or /scan?d=
    else if (rawInput.toLowerCase().includes('code=')) {
      const match = rawInput.match(/code=([^&]+)/i);
      if (match && match[1]) {
        try {
          extractedCode = decodeURIComponent(match[1]).trim();
        } catch (e) {
          extractedCode = match[1].trim();
        }
      }
    } else if (rawInput.toLowerCase().includes('d=')) {
      const match = rawInput.match(/d=([^&]+)/i);
      if (match && match[1]) {
        try {
          const decoded = JSON.parse(decodeURIComponent(match[1]));
          if (decoded.inviteCode) extractedCode = decoded.inviteCode;
          else if (decoded.code) extractedCode = decoded.code;
        } catch (e) {}
      }
    }

    try {
      const res = await fetch(`/api/events/${slug}/invitations`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: extractedCode, checkInCount: 1 }),
      });

      const data = await res.json();

      if (res.ok && data.invitation) {
        playBeep('success');
        setScanResult({
          code: extractedCode,
          guestName: data.invitation.guestName,
          maxGuests: data.invitation.maxGuests,
          scannedCount: data.invitation.scannedCount,
          tableNumber: data.invitation.tableNumber || 'Table 1 - VIP Family',
          status: 'VALID',
          message: data.message || `✓ REAL & VALID PASS for ${eventData?.title || slug}. Guest: ${data.invitation.guestName} (${data.invitation.scannedCount}/${data.invitation.maxGuests} Checked In).`,
        });
      } else if (res.status === 409 && data.invitation) {
        playBeep('already');
        setScanResult({
          code: extractedCode,
          guestName: data.invitation.guestName,
          maxGuests: data.invitation.maxGuests,
          scannedCount: data.invitation.scannedCount,
          tableNumber: data.invitation.tableNumber || 'Table 1 - VIP Family',
          status: 'ALREADY_SCANNED',
          scannedAt: data.invitation.scannedAt || 'earlier today',
          message: data.message || '⚠️ WARNING: Pass is authentic, but was ALREADY checked in at gate.',
        });
      } else {
        playBeep('error');
        setScanResult({
          code: extractedCode || 'UNKNOWN',
          guestName: 'Invalid / Counterfeit Pass',
          maxGuests: 0,
          scannedCount: 0,
          tableNumber: 'N/A',
          status: 'INVALID',
          message: `🔴 ACCESS DENIED: Unrecognized, fake, or counterfeit QR code for ${eventData?.title || slug}.`,
        });
      }
    } catch (e) {
      playBeep('error');
      setScanResult({
        code: extractedCode || 'UNKNOWN',
        guestName: 'Network Error',
        maxGuests: 0,
        scannedCount: 0,
        tableNumber: 'N/A',
        status: 'INVALID',
        message: '🔴 ACCESS DENIED: Verification request failed.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyForm = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerification(inputCode);
  };

  const handleCheckIn = async (count: number) => {
    if (!scanResult) return;
    const newCount = scanResult.scannedCount + count;
    setScanResult({
      ...scanResult,
      scannedCount: newCount,
      status: 'ALREADY_SCANNED',
      scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: `Successfully checked in ${count} guest(s). Headcount updated to ${newCount}/${scanResult.maxGuests}.`,
    });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-gold-400 text-sm">Verifying Gate Security Credentials for {slug}...</p>
        </div>
      </div>
    );
  }

  if (eventData?.adminApprovalStatus === 'PENDING') {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/50 text-center max-w-md shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-amber-400 animate-pulse" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
            ⏳ Terminal Locked: Approval Pending
          </span>
          <h2 className="font-serif text-xl font-bold text-white">{eventData.title}</h2>
          <p className="text-stone-300 text-xs leading-relaxed">
            Gate scanner operations for this wedding are locked while awaiting System Admin review. The terminal will activate automatically upon approval.
          </p>
        </div>
      </div>
    );
  }

  if (eventData?.adminApprovalStatus === 'REJECTED') {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="p-8 rounded-3xl bg-stone-900 border-2 border-rose-500/50 text-center max-w-md shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7 text-rose-500" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30">
            🔴 Terminal Blocked: Request Rejected
          </span>
          <h2 className="font-serif text-xl font-bold text-white">Request Rejected by Admin</h2>
          <p className="text-stone-300 text-xs leading-relaxed">
            This wedding event request was rejected by the System Admin. Security scanning operations are disabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 p-4 sm:p-6 flex flex-col items-center font-sans">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gold-500/30">
          <div className="flex items-center gap-3">
            <Link href={`/event/${slug}`} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h1 className="font-serif font-bold text-base text-gray-900">
                  Gate Security Scanner
                </h1>
              </div>
              <p className="text-[11px] text-gold-600 font-bold">
                Wedding: <span className="text-gray-900">{eventData?.title || slug}</span>
              </p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Gate Active</span>
          </div>
        </div>

        {/* Live Camera QR Viewfinder Box */}
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-gold-500/40 bg-black shadow-2xl flex flex-col justify-between p-4">
          
          <div className="absolute inset-0 bg-black">
            {isCameraActive ? (
              <div id="qr-camera-reader" className="w-full h-full object-cover text-white" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-black to-stone-950 flex flex-col items-center justify-center p-6 text-center">
                <CameraOff className="w-12 h-12 text-gold-500/40 mb-2 animate-pulse" />
                <p className="text-xs text-gold-400 font-semibold mb-1">Gate Camera Viewfinder Off</p>
                <p className="text-[11px] text-gray-400">{cameraError || 'Click button to activate camera scanner'}</p>
                <button
                  onClick={startScanner}
                  className="mt-3 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold shadow-md cursor-pointer"
                >
                  Activate Camera
                </button>
              </div>
            )}
          </div>

          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gold-500/30 text-[11px] text-gold-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>GATE SCANNER • {slug.toUpperCase()}</span>
            </div>

            <button
              onClick={() => (isCameraActive ? stopScanner() : startScanner())}
              className="p-2.5 rounded-full bg-black/80 backdrop-blur-md border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-all cursor-pointer"
              title="Toggle Camera"
            >
              {isCameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Target Scanning Box Overlay */}
          <div className={`relative z-10 w-56 h-56 mx-auto my-auto rounded-2xl border-2 transition-colors ${
            qrDetected ? 'border-emerald-400 bg-emerald-500/10' : 'border-gold-500/40'
          } flex items-center justify-center`}>
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-gold-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-gold-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-gold-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-gold-400 rounded-br-lg" />
            
            {verifying ? (
              <div className="text-center p-3 bg-black/80 rounded-xl border border-gold-500/40 animate-pulse">
                <Zap className="w-6 h-6 text-gold-400 mx-auto mb-1 animate-spin" />
                <span className="text-[10px] font-bold text-gold-400">Verifying Real Pass...</span>
              </div>
            ) : qrDetected ? (
              <div className="text-center p-3 bg-emerald-950/90 rounded-xl border border-emerald-400 animate-bounce">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-emerald-300">QR Code Detected!</span>
              </div>
            ) : (
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent shadow-[0_0_15px_#D4AF37] animate-bounce" />
            )}
          </div>

          <div className="relative z-10 text-center bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-between px-4">
            <p className="text-[11px] text-gray-200 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span>Point camera directly at guest QR pass</span>
            </p>
            {scanResult && (
              <button
                onClick={handleScanNext}
                className="px-3 py-1 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-[10px] font-extrabold cursor-pointer transition-all"
              >
                Scan Next ➔
              </button>
            )}
          </div>
        </div>

        {/* Verification Result Card */}
        {scanResult && (
          <div
            className={`p-6 rounded-3xl border shadow-xl transition-all animate-fade-in ${
              scanResult.status === 'VALID'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : scanResult.status === 'ALREADY_SCANNED'
                ? 'bg-amber-50 border-amber-400 text-amber-950'
                : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              {scanResult.status === 'VALID' ? (
                <div className="p-2.5 rounded-2xl bg-emerald-100 border border-emerald-300 shrink-0">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
              ) : scanResult.status === 'ALREADY_SCANNED' ? (
                <div className="p-2.5 rounded-2xl bg-amber-100 border border-amber-300 shrink-0">
                  <AlertTriangle className="w-7 h-7 text-amber-600" />
                </div>
              ) : (
                <div className="p-2.5 rounded-2xl bg-rose-100 border border-rose-300 shrink-0">
                  <XCircle className="w-7 h-7 text-rose-600" />
                </div>
              )}

              <div className="flex-1">
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-80 font-bold">
                  PASS CODE: {scanResult.code}
                </span>
                <h3 className="font-serif font-bold text-lg leading-snug">
                  {scanResult.status === 'VALID'
                    ? '✓ VALID INVITATION PASS'
                    : scanResult.status === 'ALREADY_SCANNED'
                    ? '⚠️ ALREADY SCANNED WARNING'
                    : '🔴 INVALID / COUNTERFEIT PASS'}
                </h3>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-white p-4 rounded-2xl border border-gray-200 font-mono mb-4 shadow-sm">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">Guest Name:</span>
                <span className="font-bold text-gray-900">{scanResult.guestName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">Allowed Quota:</span>
                <span className="font-bold text-gold-600">{scanResult.maxGuests} Guests</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">Seating Table:</span>
                <span className="font-bold text-gray-900">{scanResult.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Checked In:</span>
                <span className="font-bold text-gray-900">
                  {scanResult.scannedCount} of {scanResult.maxGuests}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed mb-4 font-medium">{scanResult.message}</p>

            <div className="flex flex-wrap gap-2">
              {scanResult.status === 'VALID' && scanResult.scannedCount < scanResult.maxGuests && (
                <>
                  <button
                    onClick={() => handleCheckIn(1)}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    Admit 1 Guest
                  </button>
                  {scanResult.maxGuests > 1 && (
                    <button
                      onClick={() => handleCheckIn(scanResult.maxGuests)}
                      className="flex-1 py-3 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      Admit All ({scanResult.maxGuests})
                    </button>
                  )}
                </>
              )}

              <button
                onClick={handleScanNext}
                className="w-full py-3 rounded-xl bg-black text-gold-400 font-bold text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 border border-gold-500/30 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Scan Next Guest Pass</span>
              </button>
            </div>
          </div>
        )}

        {/* Verification Form */}
        <div className="bg-white p-6 rounded-3xl border border-gold-500/30 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100">
            <div>
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4 text-gold-500" />
                Manual Code Verification
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Verify pass for {eventData?.title || slug}
              </p>
            </div>
            <span className="text-[11px] text-gold-600 font-mono font-bold shrink-0">
              Format: INV-SD2026-XXX
            </span>
          </div>

          <form onSubmit={handleVerifyForm} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="ENTER CODE E.G. INV-SD2026-001"
                className="w-full px-4 py-3 pl-11 rounded-2xl bg-gray-50 border border-gold-500/30 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 uppercase font-mono tracking-wider placeholder:text-gray-400 placeholder:normal-case placeholder:font-sans"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-black hover:bg-gray-800 text-gold-400 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md border border-gold-500/40 cursor-pointer active:scale-95"
            >
              <QrCode className="w-4 h-4 text-gold-400" />
              <span>Verify Pass for {eventData?.brideName || 'Couple'} Wedding</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
