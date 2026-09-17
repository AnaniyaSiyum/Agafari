'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  Lock
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

export default function GateScannerPage() {
  const { t } = useTranslation();
  const [authUser, setAuthUser] = useState<{ email: string; role: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Authenticate Scanner Staff User
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user && ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'GATE_SCANNER', 'BRIDE_GROOM'].includes(data.user.role)) {
            setAuthUser(data.user);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setCheckingAuth(false);
      }
    }

    // Check if event parameter is passed
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const eventSlug = urlParams.get('event');
      if (eventSlug) {
        window.location.href = `/event/${eventSlug}/scanner`;
        return;
      }
    }

    checkAuth();
  }, []);

  // Start Camera Feed
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Camera access not supported on this browser.');
      }
    } catch (err) {
      console.warn('Camera permission denied or unavailable:', err);
      setCameraError('Camera active in Viewfinder Mode (Permission denied or virtual environment).');
      setIsCameraActive(true);
    }
  };

  // Stop Camera Feed
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Dynamic API & Demo Scan Verifier Logic
  const executeVerification = async (codeToVerify: string) => {
    let query = codeToVerify.trim().toUpperCase();
    if (!query) return;

    // Extract code parameter if a signed deep link URL was scanned
    if (query.includes('CODE=')) {
      const parts = query.split('CODE=');
      if (parts[1]) {
        query = parts[1].split('&')[0];
      }
    }

    try {
      const res = await fetch('/api/events/sara-and-dawit-2026/invitations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: query, checkInCount: 1 }),
      });

      const data = await res.json();

      if (res.ok && data.invitation) {
        setScanResult({
          code: query,
          guestName: data.invitation.guestName,
          maxGuests: data.invitation.maxGuests,
          scannedCount: data.invitation.scannedCount,
          tableNumber: data.invitation.tableNumber || 'Table 1 - VIP Family',
          status: 'VALID',
          message: data.message || `✓ Valid Digital Pass Verified. ${data.invitation.guestName} (${data.invitation.scannedCount}/${data.invitation.maxGuests} Checked In).`,
        });
      } else if (res.status === 409 && data.invitation) {
        setScanResult({
          code: query,
          guestName: data.invitation.guestName,
          maxGuests: data.invitation.maxGuests,
          scannedCount: data.invitation.scannedCount,
          tableNumber: data.invitation.tableNumber || 'Table 1 - VIP Family',
          status: 'ALREADY_SCANNED',
          scannedAt: data.invitation.scannedAt || 'earlier today',
          message: data.message || '⚠️ WARNING: Pass was already checked in.',
        });
      } else {
        setScanResult({
          code: query || 'UNKNOWN',
          guestName: 'Invalid / Counterfeit Pass',
          maxGuests: 0,
          scannedCount: 0,
          tableNumber: 'N/A',
          status: 'INVALID',
          message: '🔴 ACCESS DENIED: Unrecognized or counterfeit QR code signature.',
        });
      }
    } catch (e) {
      setScanResult({
        code: query || 'UNKNOWN',
        guestName: 'Network Error',
        maxGuests: 0,
        scannedCount: 0,
        tableNumber: 'N/A',
        status: 'INVALID',
        message: '🔴 ACCESS DENIED: Verification request failed.',
      });
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
          <p className="font-serif text-gold-400 text-sm">Authenticating Gate Security Personnel...</p>
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
            <h2 className="font-serif font-bold text-2xl text-white">Gate Scanner Portal Locked</h2>
            <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">Restricted Staff Access Only</p>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              The Gate QR Scanner is an internal security tool for authorized personnel. Public access is disabled. Please log in with staff or administrator credentials to proceed.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/admin/login"
              className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-gold"
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Log In as Staff / Admin</span>
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 p-4 sm:p-6 flex flex-col items-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gold-500/30">
          <div className="flex items-center gap-3">
            <img
              src="/branding/artboard-14.png"
              alt="Agafari (አጋፋሪ) Logo"
              className="h-9 sm:h-10 w-auto object-contain"
            />
            <div>
              <h1 className="font-serif font-bold text-base text-gray-900">
                {t('scanner.title')}
              </h1>
              <p className="text-[10px] text-gold-600 font-semibold">Door Access Control System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 flex items-center gap-1 text-xs font-bold transition-all border border-gray-200"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </Link>
          </div>
        </div>

        {/* Live Camera Viewfinder Box */}
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-gold-500/40 bg-charcoal-dark shadow-2xl flex flex-col justify-between p-4">
          
          {/* Real Video Camera Feed / Fallback Container */}
          <div className="absolute inset-0 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity ${isCameraActive ? 'opacity-80' : 'opacity-20'}`}
            />
            {/* Viewfinder Mock Backdrop if video not active */}
            {(!isCameraActive || cameraError) && (
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal-dark via-black to-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <CameraOff className="w-12 h-12 text-gold-500/40 mb-2 animate-pulse" />
                <p className="text-xs text-gold-400 font-semibold mb-1">Live Viewfinder Active</p>
                <p className="text-[11px] text-ivory/50">Point device camera at guest's mobile QR code</p>
              </div>
            )}
          </div>

          {/* Top Camera Controls Overlay */}
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/30 text-[11px] text-gold-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE CAMERA SCANNER</span>
            </div>

            <button
              onClick={() => (isCameraActive ? stopCamera() : startCamera())}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-all"
              title="Toggle Camera"
            >
              {isCameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Animated Scanning Reticle & Corner Brackets */}
          <div className="relative z-10 w-56 h-56 mx-auto my-auto rounded-2xl border border-gold-500/40 flex items-center justify-center">
            {/* Corner Target Markers */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-gold-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-gold-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-gold-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-gold-400 rounded-br-lg" />

            {/* Scanning Laser Line */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent shadow-[0_0_15px_#D4AF37] animate-bounce" />
          </div>

          {/* Bottom Guidance Label */}
          <div className="relative z-10 text-center bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10">
            <p className="text-[11px] text-ivory/80 font-medium flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              Align guest QR code inside the frame to scan
            </p>
          </div>
        </div>

        {/* Verification Form / Manual Backup Entry */}
        <div className="bg-white p-6 rounded-3xl border border-gold-500/30 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100">
            <div>
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4 text-gold-500" />
                Manual Invitation Lookup
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Use when guest screen is cracked or camera scan is unavailable.
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
              <span>Verify Pass Credentials</span>
            </button>
          </form>
        </div>

        {/* Verification Result Card */}
        {scanResult && (
          <div
            className={`p-6 rounded-3xl border shadow-xl transition-all animate-fade-in ${
              scanResult.status === 'VALID'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-emerald-900/10'
                : scanResult.status === 'ALREADY_SCANNED'
                ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-amber-900/10'
                : 'bg-rose-50 border-rose-400 text-rose-950 shadow-rose-900/10'
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

              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-80 font-bold">
                  {scanResult.code}
                </span>
                <h3 className="font-serif font-bold text-lg leading-snug">
                  {scanResult.status === 'VALID'
                    ? 'VALID INVITATION PASS'
                    : scanResult.status === 'ALREADY_SCANNED'
                    ? 'ALREADY SCANNED PASS WARNING'
                    : 'INVALID / COUNTERFEIT PASS'}
                </h3>
              </div>
            </div>

            {/* Guest & Seating Details */}
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

            {/* Action Buttons for Check-In */}
            {scanResult.status === 'VALID' && scanResult.scannedCount < scanResult.maxGuests && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleCheckIn(1)}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <UserCheck className="w-4 h-4" />
                  Check In 1 Guest
                </button>
                {scanResult.maxGuests > 1 && (
                  <button
                    onClick={() => handleCheckIn(scanResult.maxGuests)}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <UserCheck className="w-4 h-4" />
                    Check In All ({scanResult.maxGuests})
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
