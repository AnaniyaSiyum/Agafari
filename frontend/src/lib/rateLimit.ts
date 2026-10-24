import { NextResponse } from 'next/server';

/**
 * Robust in-memory sliding-window rate limiter & brute-force defense suite.
 * 
 * Supports:
 * 1. Sliding-window request tracking with automatic TTL expiration.
 * 2. Strict authentication/recovery threshold: Max 5 failed attempts per IP / identifier per 15 minutes.
 * 3. General API sliding-window rate limits: 60-120 req/min per IP.
 * 4. Standard HTTP 429 Too Many Requests responses with Retry-After and X-RateLimit headers.
 */

// -----------------------------------------------------------------------------
// 1. Sliding Window Request Rate Limiting
// -----------------------------------------------------------------------------

interface SlidingWindowRecord {
  timestamps: number[];
}

const slidingWindowStore = new Map<string, SlidingWindowRecord>();

/**
 * Cleans up stale timestamp entries to prevent memory leaks.
 */
function cleanupSlidingWindow(now: number) {
  if (slidingWindowStore.size > 10000) {
    for (const [key, record] of slidingWindowStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 3600 * 1000);
      if (record.timestamps.length === 0) {
        slidingWindowStore.delete(key);
      }
    }
  }
}

export interface RateLimitOptions {
  max: number;           // Maximum allowed requests in window
  windowSeconds: number; // Duration of sliding window in seconds
}

export interface RateLimitResult {
  success: boolean;
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Checks and records a request against a sliding-window rate limiter.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { max: 60, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now();
  cleanupSlidingWindow(now);

  const windowMs = options.windowSeconds * 1000;
  const thresholdTime = now - windowMs;

  let record = slidingWindowStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    slidingWindowStore.set(key, record);
  }

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => ts > thresholdTime);

  if (record.timestamps.length >= options.max) {
    const oldestInWindow = record.timestamps[0];
    const remainingMs = oldestInWindow + windowMs - now;
    const retryAfterSeconds = Math.max(1, Math.ceil(remainingMs / 1000));

    return {
      success: false,
      allowed: false,
      limit: options.max,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  // Record this request
  record.timestamps.push(now);

  return {
    success: true,
    allowed: true,
    limit: options.max,
    remaining: options.max - record.timestamps.length,
    retryAfterSeconds: 0,
  };
}

// -----------------------------------------------------------------------------
// 2. Strict Authentication & Recovery Brute-Force Tracker
// -----------------------------------------------------------------------------

interface BruteForceRecord {
  failures: number;
  firstFailureAt: number;
  lastFailureAt: number;
  lockedUntil: number;
}

const bruteForceStore = new Map<string, BruteForceRecord>();
const AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes lockout window
export const MAX_FAILED_AUTH_ATTEMPTS = 5; // Max 5 failed attempts per 15 min

function cleanupBruteForce(now: number) {
  if (bruteForceStore.size > 5000) {
    for (const [key, record] of bruteForceStore.entries()) {
      if (now > record.lockedUntil && now - record.lastFailureAt > AUTH_WINDOW_MS) {
        bruteForceStore.delete(key);
      }
    }
  }
}

function getBruteForceSubKeys(ip: string, identifier?: string): string[] {
  const cleanIp = (ip || '127.0.0.1').trim().toLowerCase();
  const keys = [`auth_ip:${cleanIp}`];
  if (identifier && identifier.trim().length > 0) {
    const cleanId = identifier.trim().toLowerCase();
    keys.push(`auth_id:${cleanId}`);
    keys.push(`auth_pair:${cleanIp}:${cleanId}`);
  }
  return keys;
}

/**
 * Checks whether an IP or account identifier is currently locked out from authentication.
 */
export function checkAuthBruteForce(
  ip: string,
  identifier?: string
): { allowed: boolean; retryAfterSeconds: number; attempts: number } {
  const now = Date.now();
  cleanupBruteForce(now);

  const keys = getBruteForceSubKeys(ip, identifier);
  let maxRetryAfter = 0;
  let maxAttempts = 0;

  for (const k of keys) {
    const record = bruteForceStore.get(k);
    if (!record) continue;

    // Check if lockout has expired
    if (now < record.lockedUntil) {
      const remainingSeconds = Math.max(1, Math.ceil((record.lockedUntil - now) / 1000));
      if (remainingSeconds > maxRetryAfter) maxRetryAfter = remainingSeconds;
      if (record.failures > maxAttempts) maxAttempts = record.failures;
    } else if (now - record.lastFailureAt > AUTH_WINDOW_MS) {
      // Window expired, reset
      bruteForceStore.delete(k);
    } else if (record.failures >= MAX_FAILED_AUTH_ATTEMPTS) {
      const remainingSeconds = Math.max(1, Math.ceil((record.lastFailureAt + AUTH_WINDOW_MS - now) / 1000));
      if (remainingSeconds > maxRetryAfter) maxRetryAfter = remainingSeconds;
      if (record.failures > maxAttempts) maxAttempts = record.failures;
    } else {
      if (record.failures > maxAttempts) maxAttempts = record.failures;
    }
  }

  if (maxRetryAfter > 0) {
    return {
      allowed: false,
      retryAfterSeconds: maxRetryAfter,
      attempts: maxAttempts,
    };
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
    attempts: maxAttempts,
  };
}

/**
 * Records a failed authentication attempt across both IP and identifier.
 * Triggers a 15-minute lock if failed attempts reach the threshold of 5.
 */
export function recordAuthFailure(
  ip: string,
  identifier?: string
): { locked: boolean; retryAfterSeconds: number; attempts: number } {
  const now = Date.now();
  const keys = getBruteForceSubKeys(ip, identifier);
  let isLocked = false;
  let maxAttempts = 0;
  let maxRetryAfter = 0;

  for (const k of keys) {
    let record = bruteForceStore.get(k);
    if (!record || now - record.lastFailureAt > AUTH_WINDOW_MS) {
      record = {
        failures: 1,
        firstFailureAt: now,
        lastFailureAt: now,
        lockedUntil: 0,
      };
    } else {
      record.failures += 1;
      record.lastFailureAt = now;
    }

    if (record.failures >= MAX_FAILED_AUTH_ATTEMPTS) {
      record.lockedUntil = now + AUTH_WINDOW_MS;
      isLocked = true;
      const retrySec = Math.ceil(AUTH_WINDOW_MS / 1000);
      if (retrySec > maxRetryAfter) maxRetryAfter = retrySec;
    }

    bruteForceStore.set(k, record);
    if (record.failures > maxAttempts) maxAttempts = record.failures;
  }

  return {
    locked: isLocked,
    retryAfterSeconds: maxRetryAfter,
    attempts: maxAttempts,
  };
}

/**
 * Resets the failed attempts counter on successful authentication.
 */
export function recordAuthSuccess(ip: string, identifier?: string): void {
  const keys = getBruteForceSubKeys(ip, identifier);
  for (const k of keys) {
    bruteForceStore.delete(k);
  }
}

// -----------------------------------------------------------------------------
// 3. HTTP 429 Response Builder
// -----------------------------------------------------------------------------

/**
 * Constructs a standard HTTP 429 Too Many Requests response with standard Retry-After
 * and X-RateLimit headers.
 */
export function buildRateLimitResponse(
  retryAfterOrResult: number | { retryAfterSeconds?: number; remaining?: number } = 60,
  customMessage?: string,
  limit: number = 60,
  remainingCount?: number
): NextResponse {
  const retrySec = typeof retryAfterOrResult === 'number'
    ? retryAfterOrResult
    : (retryAfterOrResult?.retryAfterSeconds ?? 60);
  const remaining = remainingCount !== undefined
    ? remainingCount
    : (typeof retryAfterOrResult === 'object' && retryAfterOrResult?.remaining !== undefined ? retryAfterOrResult.remaining : 0);

  const safeRetryAfter = Math.max(1, Math.ceil(retrySec || 60));
  const message =
    customMessage ||
    `Too many requests. Please slow down and try again in ${safeRetryAfter} second${safeRetryAfter === 1 ? '' : 's'}.`;

  const response = NextResponse.json(
    {
      error: message,
      retryAfterSeconds: safeRetryAfter,
    },
    { status: 429 }
  );

  response.headers.set('Retry-After', String(safeRetryAfter));
  response.headers.set('X-RateLimit-Limit', String(limit));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.floor(Date.now() / 1000) + safeRetryAfter));

  return response;
}

// -----------------------------------------------------------------------------
// 4. Utility & Backward Compatibility Helpers
// -----------------------------------------------------------------------------

export function getClientIp(req: any): string {
  if (typeof req?.headers?.get === 'function') {
    const cfIp = req.headers.get('cf-connecting-ip');
    if (cfIp) return cfIp.trim();

    const xForwardedFor = req.headers.get('x-forwarded-for');
    if (xForwardedFor) return xForwardedFor.split(',')[0].trim();

    const xRealIp = req.headers.get('x-real-ip');
    if (xRealIp) return xRealIp.trim();
  }
  return '127.0.0.1';
}

export function getRateLimitKey(ip: string, identifier?: string): string {
  const cleanIp = (ip || '127.0.0.1').trim().toLowerCase();
  const cleanId = (identifier || 'anonymous').trim().toLowerCase();
  return `${cleanIp}:${cleanId}`;
}

/** Backward-compatible verifyRateLimit */
export async function verifyRateLimit(
  key: string,
  options: RateLimitOptions = { max: 10, windowSeconds: 60 }
): Promise<RateLimitResult> {
  return checkRateLimit(key, options);
}

/** Backward-compatible isRateLimited */
export function isRateLimited(key: string): { limited: boolean; attempts: number; retryAfterSeconds: number } {
  const [ip, id] = key.split(':');
  const check = checkAuthBruteForce(ip || key, id);
  return {
    limited: !check.allowed,
    attempts: check.attempts,
    retryAfterSeconds: check.retryAfterSeconds,
  };
}

/** Backward-compatible recordFailedLogin */
export function recordFailedLogin(key: string): { limited: boolean; attempts: number } {
  const [ip, id] = key.split(':');
  const result = recordAuthFailure(ip || key, id);
  return {
    limited: result.locked,
    attempts: result.attempts,
  };
}

/** Backward-compatible resetFailedLogins */
export function resetFailedLogins(key: string): void {
  const [ip, id] = key.split(':');
  recordAuthSuccess(ip || key, id);
}
