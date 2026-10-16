import { PLATFORM_ORIGIN } from "@/lib/platform";

/**
 * Every server-side call to the product app goes through here — trial request,
 * reissue and verify, and the pricing API.
 *
 * A preview build of this site can point PLATFORM_API_URL at the app's private
 * staging deployment, which sits behind Vercel Authentication and answers a
 * server-to-server call with Vercel's login page. PLATFORM_BYPASS_SECRET is that
 * deployment's Protection Bypass for Automation secret; when set, it rides as
 * the documented `x-vercel-protection-bypass` header so the call reaches the app.
 *
 * Never sent from this site's production build, whatever the environment holds:
 * production talks to the public app, and a stray secret there would only leak
 * it to the origin it names. Server-only — never import into a client
 * component (`platform.ts` is the client-safe half).
 *
 * Every call gives up after PLATFORM_REQUEST_TIMEOUT_MS (a caller's own
 * `signal` still applies too), so a slow platform rejects the promise instead
 * of holding the visitor's request open. Callers treat a rejection as the
 * platform being unreachable.
 */

/** How long one call to the product app may take. */
export const PLATFORM_REQUEST_TIMEOUT_MS = 10_000;

export function platformFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const bypass = process.env.PLATFORM_BYPASS_SECRET;
  if (bypass && process.env.VERCEL_ENV !== "production") {
    headers.set("x-vercel-protection-bypass", bypass);
  }
  const timeout = AbortSignal.timeout(PLATFORM_REQUEST_TIMEOUT_MS);
  const signal = init.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  return fetch(`${PLATFORM_ORIGIN}${path}`, { ...init, headers, signal });
}
