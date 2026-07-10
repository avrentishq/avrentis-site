import { BRAND } from "@/lib/brand";

/**
 * Product-app origin for BROWSER-FACING links (login in navbar/footer). MUST be
 * a NEXT_PUBLIC_ var (or the constant fallback) so it inlines identically into
 * the server and client bundles — a server-only env var here renders one host
 * during SSR and another after hydration, causing a hydration mismatch.
 */
export const BROWSER_PLATFORM_ORIGIN =
  process.env.NEXT_PUBLIC_PLATFORM_URL ?? BRAND.appUrl;

/**
 * Product-app (platform) origin for SERVER-SIDE calls — trial request/verify
 * fetches. Reads PLATFORM_API_URL (server-only; may point at a demo/preview
 * backend), falling back to the browser origin above.
 */
export const PLATFORM_ORIGIN =
  process.env.PLATFORM_API_URL ?? BROWSER_PLATFORM_ORIGIN;

/** Canonical login URL for the product app (browser-facing). */
export const LOGIN_URL = `${BROWSER_PLATFORM_ORIGIN}/login`;
