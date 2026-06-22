/**
 * Avrentis brand — single source of truth for the marketing site.
 *
 * The site must present brand strings identical to the product app. Do
 * not hardcode brand names/contacts at call sites — import from here.
 */

export const BRAND = {
  /** Parent brand name. Mixed case is canonical; uppercase only via CSS styling. */
  name: "Avrentis",

  /** Locked tagline — Operational Authority Platform positioning. */
  tagline: "Authority. Automated.",

  /** Category label used in eyebrows, investor materials, press. */
  positioningStatement: "Operational Authority Platform",

  /**
   * Platform API brand credit — mirrors the app's mandatory, non-removable
   * `X-Powered-By` / OpenAPI credit. It belongs to the PRODUCT's API surfaces;
   * the marketing site deliberately does NOT self-credit (a "Powered by
   * Avrentis" line on avrentis.com would credit the brand to its own visitors).
   * Kept here only to preserve string-parity with the app contract.
   */
  poweredBy: "Powered by Avrentis",

  /**
   * Legal entity asserted in legal contexts (terms, privacy, contracts)
   * where the full entity name is required. NOT rendered in the footer
   * copyright — that renders `name` ("Avrentis"), by design. Keep consistent
   * with the product app.
   */
  legalEntity: "Avrentis Inc.",

  /** Canonical footer copyright chrome — mirrors the app's standard email footer. */
  copyrightChrome: "© Avrentis · avrentis.com",

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
 * Module entitlement layer:
 *   - `core`       — included on every plan tier (Payables, Procurement).
 *   - `substrate`  — always-on platform foundation (Compliance, Integrations).
 *   - `expansion`  — plan-gated upgrade (Documents = Business+, HR = Enterprise).
 */
export type ModuleClassification = "core" | "substrate" | "expansion";

/**
 * Module brand names — kept consistent with the product app.
 * `key`/`slug` are the internal identifiers (decoupled from the brand name);
 * the URL slug stays the short key so existing `/product/<slug>` links and SEO
 * are preserved. The customer-facing `name` is the only thing rendered.
 *
 * `publiclyVisible` controls whether a module is shown publicly on the
 * marketing site. A module that is not yet generally available (currently HR)
 * is hidden everywhere — drive lists off `publicModuleKeys()` so a not-yet-public
 * module never leaks, and it returns automatically when this flag flips to `true`.
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
  // Not yet generally available → hidden from the marketing site.
  people: { key: "people", name: "Avrentis HR", slug: "people", classification: "expansion", publiclyVisible: false },
  connect: { key: "connect", name: "Avrentis Integrations", slug: "connect", classification: "substrate", publiclyVisible: true },
} as const;

/** Canonical module display order. */
export const MODULE_ORDER: ModuleKey[] = ["pay", "procure", "vault", "audit", "people", "connect"];

/** Module keys shown to customers, in display order — excludes not-yet-public modules (HR). */
export function publicModuleKeys(): ModuleKey[] {
  return MODULE_ORDER.filter((key) => MODULES[key].publiclyVisible);
}

/** Whether a module may be shown on the public marketing site. */
export function isModulePublic(key: ModuleKey): boolean {
  return MODULES[key].publiclyVisible;
}

/** Count of customer-facing modules (currently 5; HR is not yet public). */
export const PUBLIC_MODULE_COUNT = publicModuleKeys().length;

/** Convenience accessor for a module's locked brand name. */
export function moduleName(key: ModuleKey): string {
  return MODULES[key].name;
}
