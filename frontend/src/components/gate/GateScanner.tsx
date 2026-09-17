'use client';

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
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

export function GateScanner({ eventSlug = 'sara-and-dawit-2026' }: { eventSlug?: string }) {
  const [scanResult, setScanResult] = useState<ScanResultState | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);

  useEffect(() => {
    if (!scannerActive) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader-container',
      {
        fps: 15,
        qrbox: { width: 240, height: 240 },
        aspectRatio: 1.0,
      },
      false
    );

    async function onScanSuccess(decodedText: string) {
      try {
        scanner.pause();
      } catch (e) {}

      setLoading(true);

      // Extract code if a URL was scanned
      let codeToVerify = decodedText.trim();
      if (codeToVerify.includes('code=')) {
        const urlParams = new URLSearchParams(codeToVerify.split('?')[1]);
        const extracted = urlParams.get('code');
        if (extracted) codeToVerify = extracted;
      }

      try {
        const response = await fetch(`/api/events/${eventSlug}/invitations`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteCode: codeToVerify, checkInCount: 1 }),
        });

        const data = await response.json();

        if (response.ok && data.invitation) {
          setScanResult({
            status: 'VALID',
            message: data.message || `Verified: ${data.invitation.guestName}`,
            code: codeToVerify,
            guestName: data.invitation.guestName,
            maxGuests: data.invitation.maxGuests,
            scannedCount: data.invitation.scannedCount,
            tableNumber: data.invitation.tableNumber || 'VIP Table 1',
          });
        } else if (response.status === 409 && data.invitation) {
          setScanResult({
            status: 'ALREADY_SCANNED',
            message: data.message || 'WARNING: Pass was already checked in.',
            code: codeToVerify,
            guestName: data.invitation.guestName,
            maxGuests: data.invitation.maxGuests,
            scannedCount: data.invitation.scannedCount,
            tableNumber: data.invitation.tableNumber || 'VIP Table 1',
          });
        } else {
          setScanResult({
            status: 'INVALID',
            message: data.message || 'Access Denied: Unrecognized or counterfeit QR code.',
            code: codeToVerify,
          });
        }
      } catch (err) {
        setScanResult({
          status: 'INVALID',
          message: 'Network error or server verification timeout.',
          code: codeToVerify,
        });
      } finally {
        setLoading(false);
      }
    }

    function onScanFailure() {
      // Continue scanning next frame
    }

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [eventSlug, scannerActive]);

  return (
    <div className="w-full space-y-4">
      <div className="relative rounded-3xl overflow-hidden border-2 border-gold-500/40 bg-black shadow-lg p-2">
        <div id="qr-reader-container" className="overflow-hidden rounded-2xl bg-black text-white" />
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
          <div className="flex items-start gap-3">
            {scanResult.status === 'VALID' ? (
              <CheckCircle className="w-7 h-7 text-emerald-600 shrink-0" />
            ) : scanResult.status === 'ALREADY_SCANNED' ? (
              <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-600 shrink-0" />
            )}

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-75">
                CODE: {scanResult.code}
              </span>
              <h4 className="font-serif font-bold text-base">
                {scanResult.status === 'VALID'
                  ? 'VALID INVITATION PASS'
                  : scanResult.status === 'ALREADY_SCANNED'
                  ? 'ALREADY SCANNED PASS WARNING'
                  : 'INVALID PASS - ACCESS DENIED'}
              </h4>
              <p className="text-xs font-medium">{scanResult.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
