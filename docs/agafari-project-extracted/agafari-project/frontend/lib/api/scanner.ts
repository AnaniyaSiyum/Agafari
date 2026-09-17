import { apiPost } from "./client";

export type ScanResult = {
  status: "valid" | "already_checked_in" | "headcount_exceeded" | "invalid";
  message: string;
  headcount: number | null;
};

export function scanTicket(guestId: string, signature: string, deviceId: string) {
  return apiPost<ScanResult>("/api/scan", { guestId, signature, deviceId });
}

export type QueuedScan = {
  guestId: string;
  signature: string;
  deviceId: string;
  scannedAt: string;
};

// Minimal offline queue for the skeleton. Swap localStorage for IndexedDB
// (see lib/offline/) once you need to store hundreds of scans reliably.
const QUEUE_KEY = "agafari_offline_scan_queue";

export function queueScan(scan: QueuedScan) {
  const existing = readQueue();
  existing.push(scan);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(existing));
}

export function readQueue(): QueuedScan[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export function syncQueue() {
  const scans = readQueue();
  if (scans.length === 0) return Promise.resolve({ results: [] });
  return apiPost<{ results: ScanResult[] }>("/api/scan/batch", { scans }).then((res) => {
    clearQueue();
    return res;
  });
}
