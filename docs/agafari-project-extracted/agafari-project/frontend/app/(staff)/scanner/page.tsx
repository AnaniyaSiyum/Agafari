"use client";

import { useState } from "react";
import { queueScan, scanTicket, syncQueue, type ScanResult } from "@/lib/api/scanner";

const DEVICE_ID = "gate-1"; // in production, generate/persist a real device id

export default function ScannerPage() {
  const [guestId, setGuestId] = useState("");
  const [signature, setSignature] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleScan() {
    setError(null);
    setResult(null);

    try {
      const res = await scanTicket(guestId, signature, DEVICE_ID);
      setResult(res);
    } catch {
      // Offline (or backend unreachable): queue it and reconcile later.
      queueScan({ guestId, signature, deviceId: DEVICE_ID, scannedAt: new Date().toISOString() });
      setError("Offline — scan queued locally, will sync when back online.");
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 420 }}>
      <h1>Gate scanner</h1>
      <p>Skeleton input form — replace with a real camera-based QR reader.</p>

      <label>
        Guest ID
        <input value={guestId} onChange={(e) => setGuestId(e.target.value)} style={{ display: "block", width: "100%" }} />
      </label>
      <label>
        QR signature
        <input value={signature} onChange={(e) => setSignature(e.target.value)} style={{ display: "block", width: "100%" }} />
      </label>

      <button onClick={handleScan} style={{ marginTop: 12 }}>
        Scan
      </button>
      <button onClick={() => syncQueue()} style={{ marginTop: 12, marginLeft: 8 }}>
        Sync queued scans
      </button>

      {result && (
        <p style={{ color: result.status === "valid" ? "green" : "crimson" }}>
          {result.message} {result.headcount ? `(headcount ${result.headcount})` : ""}
        </p>
      )}
      {error && <p style={{ color: "darkorange" }}>{error}</p>}
    </main>
  );
}
