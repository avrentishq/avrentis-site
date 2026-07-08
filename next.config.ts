import type { NextConfig } from "next";

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
 * SECURITY DECISION — `script-src 'unsafe-inline'` is an ACCEPTED residual, not
 * an oversight. There is no user-controlled HTML sink anywhere on the site (the
 * only inline script is trusted JSON-LD from brand constants; all email/HTML
 * user input is escaped server-side), so inline-script CSP is defence-in-depth
 * only. Removing it requires a per-request nonce via middleware, which also has
 * to nonce Next's hydration scripts — a change that must be verified in a real
 * browser (a broken nonce silently kills hydration). Revisit with that testing.
 */
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";

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
  `connect-src 'self' https://app.avrentis.com ${TURNSTILE_ORIGIN}${isDev ? " ws:" : ""}`,
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const config: NextConfig = {
  // Don't disclose the framework/version.
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/contact",
        has: [{ type: "query", key: "intent", value: "trial" }],
        destination: "/trial",
        permanent: true,
      },
    ];
  },
};

export default config;
