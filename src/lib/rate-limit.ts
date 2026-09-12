import "server-only";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiter for the public marketing surfaces (contact + savings-estimate).
 *
 * Two paths: a durable shared window when the KV credentials are present, and
 * an in-memory limiter otherwise so local development and previews work with
 * no setup.
 *
 * This repository is PUBLIC. The behaviour of each path under failure, and the
 * reasoning behind that choice, is deliberately not described here — it is
 * abuse-defence detail, and it lives in `guides/security-posture.md`, which is
 * gitignored. Read that before changing anything in this file: the tradeoffs
 * are considered, not accidental.
 */

// ── In-memory limiter ───────────────────────────────────────────────────────

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Best-effort per-instance limiter. True = allowed, false = over the limit. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Occasional prune so the map can't grow unbounded under load.
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

// ── Durable Upstash-backed limiter (cross-instance) ─────────────────────────

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

// One limiter per (limit, windowMs) shape — cached so we don't rebuild per call.
const _limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const seconds = Math.max(1, Math.round(windowMs / 1000));
  const cacheKey = `${limit}:${seconds}`;
  let limiter = _limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${seconds} s`),
      analytics: false,
      prefix: "avrentis-site",
    });
    _limiters.set(cacheKey, limiter);
  }
  return limiter;
}

/**
 * True = allowed, false = over the limit.
 *
 * Behaviour when the durable store is unavailable is a deliberate tradeoff
 * documented in `guides/security-posture.md` (gitignored — this repo is
 * public). Do not change it from what you see here without reading that.
 */
export async function rateLimitDurable(
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const limiter = getLimiter(limit, windowMs);
  if (!limiter) return rateLimit(key, limit, windowMs);
  try {
    const { success } = await limiter.limit(key);
    return success;
  } catch {
    // See guides/security-posture.md before altering this branch.
    return true;
  }
}

/** Best-effort client IP from proxy headers; "unknown" if unavailable. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
