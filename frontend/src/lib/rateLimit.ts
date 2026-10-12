/**
 * In-memory sliding window rate limiter keyed by IP + identifier.
 * Threshold: 6 rapid failed logins triggers rate limiting / CAPTCHA requirement.
 */

interface RateLimitRecord {
  failures: number;
  firstFailureAt: number;
  lastFailureAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const MAX_FAILED_ATTEMPTS = 6;

function cleanOldRecords() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now - record.lastFailureAt > WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
}

export function getRateLimitKey(ip: string, identifier: string): string {
  const cleanIp = (ip || '127.0.0.1').trim().toLowerCase();
  const cleanId = (identifier || 'anonymous').trim().toLowerCase();
  return `${cleanIp}:${cleanId}`;
}

export function isRateLimited(key: string): { limited: boolean; attempts: number; retryAfterSeconds: number } {
  cleanOldRecords();
  const record = rateLimitStore.get(key);
  if (!record) {
    return { limited: false, attempts: 0, retryAfterSeconds: 0 };
  }

  const now = Date.now();
  if (now - record.lastFailureAt > WINDOW_MS) {
    rateLimitStore.delete(key);
    return { limited: false, attempts: 0, retryAfterSeconds: 0 };
  }

  if (record.failures >= MAX_FAILED_ATTEMPTS) {
    const remainingMs = WINDOW_MS - (now - record.lastFailureAt);
    return {
      limited: true,
      attempts: record.failures,
      retryAfterSeconds: Math.ceil(remainingMs / 1000),
    };
  }

  return { limited: false, attempts: record.failures, retryAfterSeconds: 0 };
}

export function recordFailedLogin(key: string): { limited: boolean; attempts: number } {
  cleanOldRecords();
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now - record.lastFailureAt > WINDOW_MS) {
    rateLimitStore.set(key, {
      failures: 1,
      firstFailureAt: now,
      lastFailureAt: now,
    });
    return { limited: false, attempts: 1 };
  }

  record.failures += 1;
  record.lastFailureAt = now;

  return {
    limited: record.failures >= MAX_FAILED_ATTEMPTS,
    attempts: record.failures,
  };
}

export function resetFailedLogins(key: string): void {
  rateLimitStore.delete(key);
}
