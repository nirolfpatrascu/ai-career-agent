// ============================================================================
// Rate Limiter — Upstash Redis (production) with in-memory fallback (dev/CI)
// ============================================================================
// Uses sliding window algorithm via @upstash/ratelimit.
// Falls back to in-memory Map when UPSTASH_REDIS_REST_URL is not set,
// so local dev and CI work without Redis credentials.
// ============================================================================

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const LIMIT_PER_HOUR = parseInt(process.env.RATE_LIMIT_PER_HOUR || '10', 10);
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// ---------------------------------------------------------------------------
// Upstash setup — only when credentials are present
// ---------------------------------------------------------------------------

const hasUpstash = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

let upstashLimiter: Ratelimit | null = null;

if (hasUpstash) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  upstashLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(LIMIT_PER_HOUR, '1 h'),
    analytics: false,
    prefix: '@gapzero/rl',
  });
}

// ---------------------------------------------------------------------------
// In-memory fallback (dev / CI / Upstash unavailable)
// ---------------------------------------------------------------------------

interface MemEntry {
  count: number;
  resetAt: number;
}

const memStore = new Map<string, MemEntry>();

function memCheckRateLimit(identifier: string, limit: number): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();

  // Periodic cleanup (~1% of calls)
  if (Math.random() < 0.01) {
    memStore.forEach((v, k) => {
      if (now > v.resetAt) memStore.delete(k);
    });
  }

  const entry = memStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    memStore.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: limit - 1, resetAt: now + WINDOW_MS };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// ---------------------------------------------------------------------------
// Cache last result per identifier so getRateLimitHeaders stays synchronous
// ---------------------------------------------------------------------------

const lastResult = new Map<string, { remaining: number; resetAt: number }>();

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Unix timestamp (ms) when the window resets */
  resetAt: number;
}

/**
 * Check rate limit for an identifier (IP, user ID, or composite key).
 * Uses Upstash Redis sliding window in production; falls back to in-memory.
 */
export async function checkRateLimit(
  identifier: string,
  limit = LIMIT_PER_HOUR
): Promise<RateLimitResult> {
  let result: RateLimitResult;

  if (upstashLimiter) {
    try {
      const r = await upstashLimiter.limit(identifier);
      result = {
        allowed: r.success,
        remaining: r.remaining,
        resetAt: r.reset, // already ms
      };
    } catch (err) {
      // Upstash unavailable — fail open, fall back to memory
      console.warn('[rate-limit] Upstash unavailable, falling back to in-memory:', err);
      result = memCheckRateLimit(identifier, limit);
    }
  } else {
    result = memCheckRateLimit(identifier, limit);
  }

  lastResult.set(identifier, { remaining: result.remaining, resetAt: result.resetAt });
  return result;
}

/**
 * Returns standard rate limit response headers.
 * Reads from the cached result of the last checkRateLimit call for this identifier.
 */
export function getRateLimitHeaders(identifier: string): Record<string, string> {
  const r = lastResult.get(identifier);
  return {
    'X-RateLimit-Limit': String(LIMIT_PER_HOUR),
    'X-RateLimit-Remaining': String(r?.remaining ?? LIMIT_PER_HOUR),
    'X-RateLimit-Reset': String(Math.ceil((r?.resetAt ?? Date.now() + WINDOW_MS) / 1000)),
  };
}
