import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort in-memory rate limiter. Per-instance only — NOT shared across
 * serverless instances/regions — so it's a burst guard, not a hard global
 * cap. For a strict cross-instance limit, back this with Upstash/Vercel KV.
 * ponytail: in-memory Map; swap for KV if abuse volume warrants it.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Returns true if the action is allowed, false if the limit is exceeded. */
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

/** Best-effort client IP from proxy headers; "unknown" if unavailable. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
