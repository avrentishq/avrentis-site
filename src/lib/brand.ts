/**
 * Avrentis brand — single source of truth for the marketing site.
 *
 * This file MIRRORS the locked parent-brand contract in the product app
 * (`avrentis-app/src/lib/brand.ts`, guarded by `brand.lock.test.ts`) and
 * the locked module brand names (`avrentis-app/src/lib/modules.ts`,
 * guarded by `modules.lock.test.ts`). The marketing site and the product
 * must present IDENTICAL brand strings — a prospect who reads the site
 * then logs into the app must meet the same names, tagline, positioning,
 * legal entity, and contacts.
 *
 * Do NOT hardcode "Avrentis", the tagline, the positioning, a module
 * name, or a brand contact at any call site — import from here. When the
 * app's locked values change, update this file in lockstep.
 */

export const BRAND = {
  /** Parent brand name. Mixed case is canonical; uppercase only via CSS styling. */
  name: "Avrentis",

  /** Locked tagline — Operational Authority Platform positioning. */
  tagline: "Authority. Automated.",

  /** Category label used in eyebrows, investor materials, press. */
  positioningStatement: "Operational Authority Platform",

  /** Mandatory, non-removable platform brand credit. */
  poweredBy: "Powered by Avrentis",

  /** Legal entity asserted in copyright/footer chrome. */
  legalEntity: "Avrentis Inc.",

  /** Canonical footer copyright chrome — mirrors the app's standard footer. */
  copyrightChrome: "© Avrentis Inc. · avrentis.com",

  // ── Brand-contract contacts (must match the app's locked inboxes) ──────────
  /** Customer support inbox. */
  supportEmail: "support@avrentis.com",
  /** Security disclosure inbox. */
  securityEmail: "security@avrentis.com",
  /** Trial-flow sender/contact inbox. */
  trialsEmail: "trials@avrentis.com",

  // ── Site-specific operational inboxes (not part of the app brand contract) ─
  /** General marketing enquiries. */
  contactEmail: "hello@avrentis.com",
  /** Status-page incident subscriptions. */
  statusEmail: "status@avrentis.com",

  /** Canonical public origin of the product app. */
  appUrl: "https://app.avrentis.com",
} as const;

export type BrandKey = keyof typeof BRAND;

/**
 * Literal brand colors for contexts where the `--color-*` CSS custom
 * properties don't resolve — email HTML and any JS prop that becomes an
 * SVG/HTML presentation attribute (e.g. lucide-react's `color` prop,
 * which renders to `stroke="…"` where `var()` is invalid). In CSS `style`
 * objects and className tokens, prefer `var(--color-gold)` /
 * `rgba(var(--color-gold-rgb), α)` instead of these literals.
 */
export const BRAND_COLORS = {
  /** primary navy used for shells and brand chrome. */
  navy: "#0f172a",
  /** the Avrentis accent gold (canonical lowercase, matches the app). */
  gold: "#c68b2f",
} as const;

export type ModuleKey = "pay" | "procure" | "vault" | "audit" | "people" | "connect";

/**
 * Module brand names — LOCKED to match `avrentis-app/src/lib/modules.ts`.
 * `key`/`slug` are the internal identifiers (decoupled from the brand name,
 * exactly as in the app); the URL slug stays the short key so existing
 * `/product/<slug>` links and SEO are preserved. The customer-facing
 * `name` is the only thing rendered.
 */
export const MODULES: Record<ModuleKey, { key: ModuleKey; name: string; slug: ModuleKey }> = {
  pay: { key: "pay", name: "Avrentis Payables", slug: "pay" },
  procure: { key: "procure", name: "Avrentis Procurement", slug: "procure" },
  vault: { key: "vault", name: "Avrentis Documents", slug: "vault" },
  audit: { key: "audit", name: "Avrentis Compliance", slug: "audit" },
  people: { key: "people", name: "Avrentis HR", slug: "people" },
  connect: { key: "connect", name: "Avrentis Integrations", slug: "connect" },
} as const;

/** Convenience accessor for a module's locked brand name. */
export function moduleName(key: ModuleKey): string {
  return MODULES[key].name;
}
