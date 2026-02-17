// ============================================================================
// Rate Limiter — Simple in-memory implementation for MVP
// Production: Replace with Upstash Redis for persistence across serverless instances
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const LIMIT_PER_HOUR = parseInt(process.env.RATE_LIMIT_PER_HOUR || '10', 10);
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if a request is rate limited.
 *
 * @param identifier - Usually the client IP address
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();

  // Clean expired entries periodically (every 100 checks)
  if (Math.random() < 0.01) {
    cleanExpired(now);
  }

  const entry = store.get(identifier);

  // No existing entry — first request
  if (!entry || now > entry.resetAt) {
    store.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: LIMIT_PER_HOUR - 1,
      resetAt: now + WINDOW_MS,
    };
  }

  // Existing entry — check limit
  if (entry.count >= LIMIT_PER_HOUR) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment counter
  entry.count++;
  return {
    allowed: true,
    remaining: LIMIT_PER_HOUR - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Get rate limit headers for HTTP response
 */
export function getRateLimitHeaders(identifier: string): Record<string, string> {
  const entry = store.get(identifier);
  const remaining = entry
    ? Math.max(0, LIMIT_PER_HOUR - entry.count)
    : LIMIT_PER_HOUR;
  const resetAt = entry?.resetAt || Date.now() + WINDOW_MS;

  return {
    'X-RateLimit-Limit': String(LIMIT_PER_HOUR),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
  };
}

/**
 * Remove expired entries to prevent memory leaks
 */
function cleanExpired(now: number): void {
  Array.from(store.entries()).forEach(([key, entry]) => {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  });
}
