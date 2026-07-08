import { BRAND } from "@/lib/brand";

/**
 * Product-app (platform) origin — single source of truth. Read from
 * PLATFORM_API_URL, falling back to the brand's app URL. Server code
 * (trial actions, verify) gets the env value; client components inline the
 * fallback at build (non-public env vars aren't exposed to the browser), so
 * keep PLATFORM_API_URL aligned with BRAND.appUrl in production.
 */
export const PLATFORM_ORIGIN = process.env.PLATFORM_API_URL ?? BRAND.appUrl;

/** Canonical login URL for the product app. */
export const LOGIN_URL = `${PLATFORM_ORIGIN}/login`;
