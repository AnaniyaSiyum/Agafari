import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  /** Maximum allowed requests within the window. */
  max: number;
  /** Window size in seconds. */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

// In-memory sliding window store fallback (for local development or single instance)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function checkMemoryRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + config.windowSeconds * 1000;
    memoryStore.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: config.max,
      remaining: config.max - 1,
      resetSeconds: config.windowSeconds,
    };
  }

  if (existing.count >= config.max) {
    const resetSeconds = Math.ceil((existing.resetAt - now) / 1000);
    return {
      success: false,
      limit: config.max,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  existing.count++;
  const resetSeconds = Math.ceil((existing.resetAt - now) / 1000);
  return {
    success: true,
    limit: config.max,
    remaining: config.max - existing.count,
    resetSeconds: Math.max(1, resetSeconds),
  };
}

/** Extract client IP address from standard headers. */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

/**
 * Checks rate limit for a key using Upstash Redis if configured, or in-memory fallback.
 */
export async function verifyRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const { Ratelimit } = require('@upstash/ratelimit');
      const { Redis } = require('@upstash/redis');

      const redis = new Redis({ url: upstashUrl, token: upstashToken });
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.max, `${config.windowSeconds} s`),
        analytics: true,
      });

      const res = await ratelimit.limit(key);
      const resetSeconds = Math.ceil((res.reset - Date.now()) / 1000);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        resetSeconds: Math.max(1, resetSeconds),
      };
    } catch {
      // Fallback to memory store if Upstash fails
      return checkMemoryRateLimit(key, config);
    }
  }

  return checkMemoryRateLimit(key, config);
}

/** Prepares a standard HTTP 429 Too Many Requests response with Retry-After header. */
export function buildRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Please try again in ${result.resetSeconds} seconds.`,
      retryAfterSeconds: result.resetSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.resetSeconds),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
      },
    }
  );
}
