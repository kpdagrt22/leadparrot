/**
 * Minimal fixed-window, in-memory rate limiter.
 *
 * Best-effort by design: state lives in the process, so on a multi-instance
 * serverless deployment each instance keeps its own window. That is still
 * enough to blunt a single client hammering an unauthenticated endpoint; for
 * strict global limits put a shared store (Redis/Upstash) behind this same API.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

/**
 * Record a hit for `key` and report whether it is within `limit` per
 * `windowMs`. `now` is injectable so the behavior is deterministic in tests.
 */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
  now: number = Date.now(),
): RateLimitResult {
  // Opportunistic prune so the map can't grow unbounded under many distinct IPs.
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(k);
    }
  }

  const existing = buckets.get(key);
  if (!existing || now >= existing.resetAt) {
    const resetAt = now + opts.windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: Math.max(0, opts.limit - 1), limit: opts.limit, resetAt };
  }

  existing.count += 1;
  const remaining = Math.max(0, opts.limit - existing.count);
  return { allowed: existing.count <= opts.limit, remaining, limit: opts.limit, resetAt: existing.resetAt };
}

/** Test-only: clear all windows. */
export function __resetRateLimit(): void {
  buckets.clear();
}
