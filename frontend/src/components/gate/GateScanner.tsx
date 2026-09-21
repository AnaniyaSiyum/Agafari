'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Zap } from 'lucide-react';

interface ScanResultState {
  status: 'VALID' | 'ALREADY_SCANNED' | 'INVALID';
  message: string;
  code: string;
  guestName?: string;
  maxGuests?: number;
  scannedCount?: number;
  tableNumber?: string;
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
    // Silent fallback
  }
};

export function GateScanner({ eventSlug = 'sara-and-dawit-2026' }: { eventSlug?: string }) {
  const [scanResult, setScanResult] = useState<ScanResultState | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!scannerActive) return;

    let mounted = true;

    setTimeout(async () => {
      if (!mounted) return;
      try {
        const container = document.getElementById('qr-reader-container');
        if (!container) return;

        if (html5QrCodeRef.current) {
          try {
            if (html5QrCodeRef.current.isScanning) {
              await html5QrCodeRef.current.stop();
            }
            html5QrCodeRef.current.clear();
          } catch (e) {}
        }

        const scanner = new Html5Qrcode('qr-reader-container');
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: (w, h) => {
              const minEdge = Math.min(w, h);
              const sz = Math.floor(minEdge * 0.7);
              return { width: sz, height: sz };
            },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            playBeep('detect');

            try {
              scanner.pause(true);
            } catch (e) {}

            setLoading(true);

            // Extract code from URL, JSON, or raw string
            let codeToVerify = decodedText.trim();
            if (codeToVerify.startsWith('{')) {
              try {
                const parsed = JSON.parse(codeToVerify);
                if (parsed.inviteCode) codeToVerify = parsed.inviteCode;
                else if (parsed.code) codeToVerify = parsed.code;
              } catch (e) {}
            } else if (codeToVerify.toLowerCase().includes('code=')) {
              const match = codeToVerify.match(/code=([^&]+)/i);
              if (match && match[1]) {
                try {
                  codeToVerify = decodeURIComponent(match[1]).trim();
                } catch (e) {
                  codeToVerify = match[1].trim();
                }
              }
            }

            try {
              const response = await fetch(`/api/events/${eventSlug}/invitations`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inviteCode: codeToVerify, checkInCount: 1 }),
              });

              const data = await response.json();

              if (response.ok && data.invitation) {
                playBeep('success');
                setScanResult({
                  status: 'VALID',
                  message: data.message || `✓ Verified: ${data.invitation.guestName}`,
                  code: codeToVerify,
                  guestName: data.invitation.guestName,
                  maxGuests: data.invitation.maxGuests,
                  scannedCount: data.invitation.scannedCount,
                  tableNumber: data.invitation.tableNumber || 'VIP Table 1',
                });
              } else if (response.status === 409 && data.invitation) {
                playBeep('already');
                setScanResult({
                  status: 'ALREADY_SCANNED',
                  message: data.message || '⚠️ WARNING: Pass was already checked in at gate.',
                  code: codeToVerify,
                  guestName: data.invitation.guestName,
                  maxGuests: data.invitation.maxGuests,
                  scannedCount: data.invitation.scannedCount,
                  tableNumber: data.invitation.tableNumber || 'VIP Table 1',
                });
              } else {
                playBeep('error');
                setScanResult({
                  status: 'INVALID',
                  message: data.message || '🔴 ACCESS DENIED: Unrecognized or counterfeit QR code.',
                  code: codeToVerify,
                });
              }
            } catch (err) {
              playBeep('error');
              setScanResult({
                status: 'INVALID',
                message: '🔴 ACCESS DENIED: Network error or server verification timeout.',
                code: codeToVerify,
              });
            } finally {
              setLoading(false);
            }
          },
          () => {}
        );
      } catch (err) {
        console.warn('GateScanner start error:', err);
      }
    }, 150);

    return () => {
      mounted = false;
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().catch(() => {});
          }
          html5QrCodeRef.current.clear();
        } catch (e) {}
      }
    };
  }, [eventSlug, scannerActive]);

  const handleResume = () => {
    setScanResult(null);
    if (html5QrCodeRef.current) {
      try {
        html5QrCodeRef.current.resume();
      } catch (e) {
        setScannerActive(false);
        setTimeout(() => setScannerActive(true), 100);
      }
    }
  };

  return (
    <div className="w-full space-y-4 font-sans">
      <div className="relative rounded-3xl overflow-hidden border-2 border-gold-500/40 bg-black shadow-lg p-2 aspect-square">
        <div id="qr-reader-container" className="w-full h-full overflow-hidden rounded-2xl bg-black text-white" />
      </div>

      {loading && (
        <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-600 font-bold text-xs text-center flex items-center justify-center gap-2 animate-pulse">
          <Zap className="w-4 h-4 text-gold-500" />
          <span>Verifying Pass Credentials against Gate API...</span>
        </div>
      )}

      {scanResult && (
        <div
          className={`p-5 rounded-3xl border shadow-md transition-all ${
            scanResult.status === 'VALID'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : scanResult.status === 'ALREADY_SCANNED'
              ? 'bg-amber-50 border-amber-400 text-amber-950'
              : 'bg-rose-50 border-rose-400 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-3 mb-3">
            {scanResult.status === 'VALID' ? (
              <CheckCircle className="w-7 h-7 text-emerald-600 shrink-0" />
            ) : scanResult.status === 'ALREADY_SCANNED' ? (
              <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-600 shrink-0" />
            )}

            <div className="space-y-1 flex-1">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-75">
                CODE: {scanResult.code}
              </span>
              <h4 className="font-serif font-bold text-base">
                {scanResult.status === 'VALID'
                  ? '✓ VALID INVITATION PASS'
                  : scanResult.status === 'ALREADY_SCANNED'
                  ? '⚠️ ALREADY SCANNED PASS'
                  : '🔴 INVALID / COUNTERFEIT PASS'}
              </h4>
              <p className="text-xs font-medium">{scanResult.message}</p>
            </div>
          </div>

          <button
            onClick={handleResume}
            className="w-full py-2.5 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs flex items-center justify-center gap-2 border border-gold-500/30 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Next Pass</span>
          </button>
        </div>
      )}
    </div>
  );
}
