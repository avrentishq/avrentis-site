import type { NextConfig } from "next";
import { SITE_PAGE_ROUTES } from "@avrentishq/core/brand";
import { cspReportUrl, cspReportingDirectives, reportingEndpointsHeader } from "./src/lib/csp-reporting";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy. The site renders heavy inline `style={{}}` objects and
 * a small inline JSON-LD `<script>`, so `style-src`/`script-src` must allow
 * `'unsafe-inline'`. Fonts are self-hosted via `next/font`, so no external font
 * origin is needed. In development, Turbopack + React Refresh need `'unsafe-eval'`
 * and a websocket connection for HMR — both added only when not in production.
 *
 * Cloudflare Turnstile (bot defence on the public contact form) loads a script
 * from, renders an iframe from, and posts back to `challenges.cloudflare.com`,
 * so that origin is allowed in `script-src` / `frame-src` / `connect-src`.
 *
 * The product app is NOT in `connect-src`: the browser never calls it. Trial
 * requests, verification and pricing are fetched server-side (Server Actions and
 * server components, `src/lib/platform.ts`); the browser only navigates to the
 * app's login page, which `connect-src` does not govern.
 *
 * `script-src 'unsafe-inline'` is a deliberate, recorded decision; its rationale
 * and upgrade path are in guides/security-posture.md (gitignored). Production
 * also upgrades any stray http:// subresource to https.
 */
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";

// Blocked-content reports go to Sentry when CSP_REPORT_URI is set (see csp-reporting.ts).
const CSP_REPORT_URL = cspReportUrl(process.env.CSP_REPORT_URI, process.env.VERCEL_ENV ?? "development");

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  `frame-src 'self' ${TURNSTILE_ORIGIN}`,
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline' ${TURNSTILE_ORIGIN}${isDev ? " 'unsafe-eval'" : ""}`,
  `connect-src 'self' ${TURNSTILE_ORIGIN}${isDev ? " ws:" : ""}`,
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ...cspReportingDirectives(CSP_REPORT_URL),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  ...reportingEndpointsHeader(CSP_REPORT_URL),
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Isolates the site's browsing context from cross-origin windows it opens or
  // is opened by (no shared `window.opener`).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const config: NextConfig = {
  // Don't disclose the framework/version.
  poweredByHeader: false,
  // @avrentishq/core ships raw TypeScript (brand SSOT, etc.) — transpile it here.
  transpilePackages: ["@avrentishq/core"],
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        // Core spells both paths, as it does for every other surface linking here.
        source: SITE_PAGE_ROUTES.contact,
        has: [{ type: "query", key: "intent", value: "trial" }],
        destination: SITE_PAGE_ROUTES.trial,
        permanent: true,
      },
    ];
  },
};

export default config;
