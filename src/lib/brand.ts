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

export type ModuleKey =
  | "pay"
  | "procure"
  | "vault"
  | "authority"
  | "audit"
  | "guard"
  | "grants"
  | "people"
  | "connect";

/**
 * Module entitlement layer:
 *   - `core`       — included on every plan tier (Payables, Procurement, Records).
 *   - `universal`  — the engine every plan runs on, sold with none of them (Authority).
 *   - `substrate`  — always-on platform foundation (Compliance, Integrations).
 *   - `expansion`  — plan-gated upgrade (Guard + Grants = Business+, Requests = Enterprise).
 *
 * WHY `universal` IS NOT `core`. Both are on every tier, but they answer to
 * different UI. A `core` module is a thing a buyer chooses and compares, so it
 * earns a per-plan badge. Authority is the delegation-of-authority engine that
 * every approval in the product already runs through — badging it on all three
 * plans would read as a differentiator that differentiates nothing, and pricing
 * already advertises it once, correctly, as an included-on-every-plan trust line.
 *
 * The pricing API encodes exactly this: `authority` is published under
 * `platformModules`, never inside a plan's own `modules` array. So a `universal`
 * module gets a product page and site navigation, and gets no badge, WITHOUT
 * anything here having to special-case it — see `planAvailabilityFor`.
 */
export type ModuleClassification = "core" | "universal" | "substrate" | "expansion";

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
  // The approval engine every plan runs on. Documented publicly, never badged
  // per-plan — see `ModuleClassification` and `planAvailabilityFor`.
  authority: { key: "authority", name: "Avrentis Authority", slug: "authority", classification: "universal", publiclyVisible: true },
  audit: { key: "audit", name: "Avrentis Compliance", slug: "audit", classification: "substrate", publiclyVisible: true },
  guard: { key: "guard", name: "Avrentis Guard", slug: "guard", classification: "expansion", publiclyVisible: true },
  grants: { key: "grants", name: "Avrentis Grants", slug: "grants", classification: "expansion", publiclyVisible: true },
  // GA but Enterprise-only and deliberately not led with → hidden from the marketing site.
  people: { key: "people", name: "Avrentis Requests", slug: "people", classification: "expansion", publiclyVisible: false },
  connect: { key: "connect", name: "Avrentis Integrations", slug: "connect", classification: "substrate", publiclyVisible: true },
} as const;

/**
 * Canonical module display order. Authority sits after the three modules a
 * buyer actually shops for and ahead of the rest of the platform layer: it is
 * what they all run on, but leading a product menu with the engine rather than
 * with Payables would bury the thing people arrive looking for.
 */
export const MODULE_ORDER: ModuleKey[] = [
  "pay",
  "procure",
  "vault",
  "authority",
  "audit",
  "guard",
  "grants",
  "people",
  "connect",
];

/** Module keys shown to customers, in display order — excludes hidden modules (Requests). */
export function publicModuleKeys(): ModuleKey[] {
  return MODULE_ORDER.filter((key) => MODULES[key].publiclyVisible);
}

/**
 * Whether a module key may be shown on the public marketing site. Guard-safe for
 * a key this catalog doesn't model (e.g. `foundation` / `intelligence`, which the
 * pricing API never publishes) ⇒ false.
 *
 * Pricing badges are driven off the API's per-plan `modules` (which encode the
 * real tier entitlement, incl. tier-gated Compliance/Integrations); this only
 * hides the modules the site chooses not to market (Requests) + unknown keys.
 * Note this does NOT badge Authority despite it now being public: the API keeps
 * `authority` out of every plan's `modules` array, so there is nothing to badge.
 */
export function isModulePublic(key: string): boolean {
  return MODULES[key as ModuleKey]?.publiclyVisible ?? false;
}

/** Count of customer-facing modules (currently 8; Requests is hidden). */
export const PUBLIC_MODULE_COUNT = publicModuleKeys().length;

/** Convenience accessor for a module's locked brand name. */
export function moduleName(key: ModuleKey): string {
  return MODULES[key].name;
}
