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
 * Product suite — the four buckets the modules are presented in, mirroring
 * core's `ModuleSuite`. Unlike `classification` (which this site deliberately
 * defines its OWN way, adding `universal`), a suite means exactly what core
 * means by it, and `module-catalog-parity.test.ts` fails if the two disagree.
 *
 * Mirrored rather than imported so the runtime keeps consuming ONE slice of
 * core — `core/brand` — as `RELEASING.md` describes. The parity test does the
 * importing, so drift is caught at test time without widening what ships.
 */
export type ModuleSuite = "spend" | "oversight" | "evidence" | "infrastructure";

/**
 * Suite display order and the words the site uses for them. Core stores keys
 * only and leaves the copy to each consumer; this is the marketing wording,
 * which is why it is not identical to the product app's.
 */
export const SUITES: ReadonlyArray<{ key: ModuleSuite; label: string; blurb: string }> = [
  {
    key: "spend",
    label: "Spend",
    blurb: "Everything that asks for money to leave the organisation.",
  },
  {
    key: "oversight",
    label: "Oversight",
    blurb: "Who may approve what — and the checks that catch the rules being worked around.",
  },
  {
    key: "evidence",
    label: "Evidence",
    blurb: "The record of what happened, and the proof it was not altered.",
  },
  {
    key: "infrastructure",
    label: "Infrastructure",
    blurb: "How Avrentis reaches your people and connects to your other systems.",
  },
];

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
    /** Presentation bucket — mirrors core's `suite`; `module-catalog-parity.test.ts` proves it. */
    suite: ModuleSuite;
    publiclyVisible: boolean;
  }
> = {
  pay: { key: "pay", name: "Avrentis Payables", slug: "pay", classification: "core", suite: "spend", publiclyVisible: true },
  procure: { key: "procure", name: "Avrentis Procurement", slug: "procure", classification: "core", suite: "spend", publiclyVisible: true },
  vault: { key: "vault", name: "Avrentis Records", slug: "vault", classification: "core", suite: "evidence", publiclyVisible: true },
  // The approval engine every plan runs on. Documented publicly, never badged
  // per-plan — see `ModuleClassification` and `planAvailabilityFor`.
  authority: { key: "authority", name: "Avrentis Authority", slug: "authority", classification: "universal", suite: "oversight", publiclyVisible: true },
  audit: { key: "audit", name: "Avrentis Compliance", slug: "audit", classification: "substrate", suite: "evidence", publiclyVisible: true },
  guard: { key: "guard", name: "Avrentis Guard", slug: "guard", classification: "expansion", suite: "oversight", publiclyVisible: true },
  grants: { key: "grants", name: "Avrentis Grants", slug: "grants", classification: "expansion", suite: "spend", publiclyVisible: true },
  // GA but Enterprise-only and deliberately not led with → hidden from the marketing site.
  people: { key: "people", name: "Avrentis Requests", slug: "people", classification: "expansion", suite: "spend", publiclyVisible: false },
  connect: { key: "connect", name: "Avrentis Integrations", slug: "connect", classification: "substrate", suite: "infrastructure", publiclyVisible: true },
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

/** Convenience accessor for a module's locked brand name. */
export function moduleName(key: ModuleKey): string {
  return MODULES[key].name;
}

/**
 * The suite a module belongs to. Pages read THIS rather than carrying a suite on
 * their own module lists — the product page already keeps its own copy for icons
 * and marketing copy, and a second place to record the bucket is a second place
 * for it to be wrong.
 */
export function moduleSuite(key: ModuleKey): ModuleSuite {
  return MODULES[key].suite;
}
