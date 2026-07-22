/**
 * Avrentis brand — the parent-brand identity (BRAND constants, colours, fonts,
 * white-label resolvers, gate-mark geometry) is sourced from the SSOT
 * @avrentishq/core/brand, lifted so the app, marketing site, and admin console
 * can't diverge. This file re-exports it, and additionally owns the
 * marketing-site MODULE CATALOG below (the public product names/slugs shown on
 * avrentis.com) — which is site-specific and not part of the parent-brand SSOT.
 *
 * DO NOT add parent-brand values here — add them in core, release, bump the pin.
 */
export * from "@avrentishq/core/brand";

// ── Marketing module catalog (site-specific) ─────────────────────────────────

export type ModuleKey = "pay" | "procure" | "vault" | "audit" | "guard" | "grants" | "people" | "connect";

/**
 * Module entitlement layer:
 *   - `core`       — included on every plan tier (Payables, Procurement, Records).
 *   - `substrate`  — always-on platform foundation (Compliance, Integrations).
 *   - `expansion`  — plan-gated upgrade (Guard + Grants = Business+, Requests = Enterprise).
 */
export type ModuleClassification = "core" | "substrate" | "expansion";

/**
 * Module brand names — kept consistent with the product app.
 * `key`/`slug` are the internal identifiers (decoupled from the brand name);
 * the URL slug stays the short key so existing `/product/<slug>` links and SEO
 * are preserved. The customer-facing `name` is the only thing rendered.
 *
 * `publiclyVisible` controls whether a module is shown publicly on the
 * marketing site. A module we choose not to lead with (currently Requests, the
 * employee leave/expense module — GA but Enterprise-only and deliberately not
 * marketed as a standalone product) is hidden everywhere — drive lists off
 * `publicModuleKeys()` so a hidden module never leaks, and it returns
 * automatically when this flag flips to `true`.
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
  vault: { key: "vault", name: "Avrentis Records", slug: "vault", classification: "core", publiclyVisible: true },
  audit: { key: "audit", name: "Avrentis Compliance", slug: "audit", classification: "substrate", publiclyVisible: true },
  guard: { key: "guard", name: "Avrentis Guard", slug: "guard", classification: "expansion", publiclyVisible: true },
  grants: { key: "grants", name: "Avrentis Grants", slug: "grants", classification: "expansion", publiclyVisible: true },
  // GA but Enterprise-only and deliberately not led with → hidden from the marketing site.
  people: { key: "people", name: "Avrentis Requests", slug: "people", classification: "expansion", publiclyVisible: false },
  connect: { key: "connect", name: "Avrentis Integrations", slug: "connect", classification: "substrate", publiclyVisible: true },
} as const;

/** Canonical module display order. */
export const MODULE_ORDER: ModuleKey[] = ["pay", "procure", "vault", "audit", "guard", "grants", "people", "connect"];

/** Module keys shown to customers, in display order — excludes hidden modules (Requests). */
export function publicModuleKeys(): ModuleKey[] {
  return MODULE_ORDER.filter((key) => MODULES[key].publiclyVisible);
}

/**
 * Whether a module key may be shown on the public marketing site. Guard-safe for
 * a key this catalog doesn't model (e.g. `authority` from the pricing API) ⇒ false.
 * Pricing badges are driven off the API's per-plan `modules` (which encode the
 * real tier entitlement, incl. tier-gated Compliance/Integrations); this only
 * hides the modules the site chooses not to market (Requests) + unknown keys.
 */
export function isModulePublic(key: string): boolean {
  return MODULES[key as ModuleKey]?.publiclyVisible ?? false;
}

/** Count of customer-facing modules (currently 7; Requests is hidden). */
export const PUBLIC_MODULE_COUNT = publicModuleKeys().length;

/** Convenience accessor for a module's locked brand name. */
export function moduleName(key: ModuleKey): string {
  return MODULES[key].name;
}
