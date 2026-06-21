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
 * Module entitlement layer — MIRRORS `avrentis-app/src/lib/modules.ts`
 * (`classification` field, guarded by `modules.lock.test.ts`):
 *   - `core`       — included on every plan tier (Payables, Procurement).
 *   - `substrate`  — always-on platform foundation (Compliance, Integrations).
 *   - `expansion`  — plan-gated upgrade (Documents = Business+, HR = Enterprise).
 */
export type ModuleClassification = "core" | "substrate" | "expansion";

/**
 * Module brand names — LOCKED to match `avrentis-app/src/lib/modules.ts`.
 * `key`/`slug` are the internal identifiers (decoupled from the brand name,
 * exactly as in the app); the URL slug stays the short key so existing
 * `/product/<slug>` links and SEO are preserved. The customer-facing
 * `name` is the only thing rendered.
 *
 * `publiclyVisible` MIRRORS the app's maturity gate: a module held at
 * `internal` maturity in the app (currently HR/`people`) is invisible to
 * every tenant, so it must NOT appear anywhere on the marketing site.
 * Drive every module list/count off `publicModuleKeys()` so a held-back
 * module can never leak — and returns automatically when the app promotes
 * it to `ga` and this flag flips to `true`.
 */
export const MODULES: Record<
  ModuleKey,
  {
    key: ModuleKey;
    name: string;
    slug: ModuleKey;
    classification: ModuleClassification;
    publiclyVisible: boolean;
  }
> = {
  pay: { key: "pay", name: "Avrentis Payables", slug: "pay", classification: "core", publiclyVisible: true },
  procure: { key: "procure", name: "Avrentis Procurement", slug: "procure", classification: "core", publiclyVisible: true },
  vault: { key: "vault", name: "Avrentis Documents", slug: "vault", classification: "expansion", publiclyVisible: true },
  audit: { key: "audit", name: "Avrentis Compliance", slug: "audit", classification: "substrate", publiclyVisible: true },
  // Held at `internal` maturity in the app → hidden from every customer.
  people: { key: "people", name: "Avrentis HR", slug: "people", classification: "expansion", publiclyVisible: false },
  connect: { key: "connect", name: "Avrentis Integrations", slug: "connect", classification: "substrate", publiclyVisible: true },
} as const;

/** Canonical module display order (mirrors the app's MODULE_ORDER). */
export const MODULE_ORDER: ModuleKey[] = ["pay", "procure", "vault", "audit", "people", "connect"];

/** Module keys shown to customers, in display order — excludes internal modules (HR). */
export function publicModuleKeys(): ModuleKey[] {
  return MODULE_ORDER.filter((key) => MODULES[key].publiclyVisible);
}

/** Whether a module may be shown on the public marketing site. */
export function isModulePublic(key: ModuleKey): boolean {
  return MODULES[key].publiclyVisible;
}

/** Count of customer-facing modules (currently 5 — HR is internal). */
export const PUBLIC_MODULE_COUNT = publicModuleKeys().length;

/** Convenience accessor for a module's locked brand name. */
export function moduleName(key: ModuleKey): string {
  return MODULES[key].name;
}
