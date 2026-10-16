/**
 * Avrentis brand — the parent-brand identity (BRAND constants, colours, fonts,
 * white-label resolvers, gate-mark geometry) is sourced from the SSOT
 * @avrentishq/core/brand, lifted so the app, marketing site, and admin console
 * can't diverge. This file re-exports it, and adds the marketing view of core's
 * module catalogue below: core decides each module's name, suite and maturity;
 * the site decides only which modules it leads with and the words for suites.
 *
 * DO NOT add parent-brand values here — add them in core, release, bump the pin.
 */
export * from "@avrentishq/core/brand";

import {
  MODULE_CATALOG,
  type ModuleKey as CatalogModuleKey,
  type ModuleMaturity,
  type ModuleSuite,
} from "@avrentishq/core/modules/catalog";

// ── Marketing module catalog ─────────────────────────────────────────────────

export type { ModuleSuite };

/**
 * Core modules the site does not model. `foundation` is hidden plumbing with no
 * product of its own; `intelligence` is not released. Every other core module is
 * a `ModuleKey` here, so a module core adds fails this file's type-check until it
 * is either given a visibility below or listed here —
 * `module-catalog-parity.test.ts` also fails if a listed one becomes a
 * released, tenant-visible module.
 */
export const UNMODELLED_MODULE_KEYS = ["foundation", "intelligence"] as const satisfies readonly CatalogModuleKey[];

export type ModuleKey = Exclude<CatalogModuleKey, (typeof UNMODELLED_MODULE_KEYS)[number]>;

/**
 * The one module fact the site owns: whether it leads with the module. Requests
 * (`people`) is GA but Enterprise-only and deliberately not marketed as a
 * standalone product, so it is hidden everywhere — its page 404s through the
 * launch gate (`launch.ts` derives the route from this flag) and every list is
 * driven off `publicModuleKeys()`. Flip the flag and it returns everywhere.
 */
const PUBLICLY_VISIBLE: Record<ModuleKey, boolean> = {
  pay: true,
  procure: true,
  vault: true,
  authority: true,
  audit: true,
  guard: true,
  grants: true,
  people: false,
  connect: true,
};

/**
 * How a released module is presented: generally available, or in beta (an
 * early-access grant inside the product). Derived from core's maturity, never
 * typed per page.
 */
export type ModuleStatus = "available" | "partial";

export const MODULE_STATUS_LABELS: Record<ModuleStatus, string> = {
  available: "Available now",
  partial: "In beta",
};

/** Maturities a buyer can actually get — internal and deprecated modules are never marketed. */
const MARKETABLE_MATURITIES: ReadonlySet<ModuleMaturity> = new Set(["ga", "beta", "alpha"]);

export interface SiteModule {
  key: ModuleKey;
  /** Brand name, from core: "Avrentis Payables". */
  name: string;
  /** Short name, from core's sidebar label: "Payables". */
  shortName: string;
  /** Presentation bucket, from core. */
  suite: ModuleSuite;
  status: ModuleStatus;
  publiclyVisible: boolean;
}

/**
 * Every modelled module — name, short name, suite and status read from core's
 * catalogue, so the site cannot call a module something the product does not.
 * The URL slug is the key (`moduleHref`), which keeps `/product/<key>` stable
 * whatever the brand name becomes.
 */
export const MODULES = Object.fromEntries(
  (Object.keys(PUBLICLY_VISIBLE) as ModuleKey[]).map((key) => {
    const entry = MODULE_CATALOG[key];
    const siteModule: SiteModule = {
      key,
      name: entry.name,
      shortName: entry.sidebarLabel,
      suite: entry.suite,
      status: entry.maturity === "ga" ? "available" : "partial",
      publiclyVisible: PUBLICLY_VISIBLE[key] && MARKETABLE_MATURITIES.has(entry.maturity),
    };
    return [key, siteModule];
  }),
) as Record<ModuleKey, SiteModule>;

/**
 * Canonical module display order. Authority sits after the three modules a
 * buyer actually shops for and ahead of the rest of the platform layer: it is
 * what they all run on, but leading a product menu with the engine rather than
 * with Payables would bury the thing people arrive looking for.
 * `module-catalog-parity.test.ts` proves it lists every modelled module once.
 */
export const MODULE_ORDER: readonly ModuleKey[] = [
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

/** Module keys the site does not show — the launch gate hides their pages. */
export function hiddenModuleKeys(): ModuleKey[] {
  return MODULE_ORDER.filter((key) => !MODULES[key].publiclyVisible);
}

/**
 * Whether a module key may be shown on the public marketing site. Guard-safe for
 * a key this catalog doesn't model (e.g. `foundation` / `intelligence`, which the
 * pricing API never publishes) ⇒ false.
 *
 * Pricing badges are driven off the API's per-plan `modules` (which encode the
 * real tier entitlement, incl. tier-gated Compliance/Integrations); this only
 * hides the modules the site chooses not to market (Requests) + unknown keys.
 * Note this does NOT badge Authority: the API publishes it under
 * `platformModules`, outside every plan's `modules` array, so there is nothing to badge.
 */
export function isModulePublic(key: string): key is ModuleKey {
  return Object.hasOwn(MODULES, key) && MODULES[key as ModuleKey].publiclyVisible;
}

/** A module's brand name, from core: "Avrentis Payables". */
export function moduleName(key: ModuleKey): string {
  return MODULES[key].name;
}

/** A module's short name, from core: "Payables". Never strip "Avrentis " off the brand name. */
export function moduleShortName(key: ModuleKey): string {
  return MODULES[key].shortName;
}

/**
 * The short name for a module the pricing API names — core's label when the
 * site models the key, else the API's own name (a module the site does not
 * model yet still reads correctly, never with a hand-cut prefix).
 */
export function moduleShortNameFor(module: { key: string; name: string }): string {
  return Object.hasOwn(MODULES, module.key) ? moduleShortName(module.key as ModuleKey) : module.name;
}

/** A module's product page. */
export function moduleHref(key: ModuleKey): string {
  return `/product/${key}`;
}

/** A suite's page. */
export function suiteHref(suite: ModuleSuite): string {
  return `/product/${suite}`;
}

/** The suite a module belongs to, from core. */
export function moduleSuite(key: ModuleKey): ModuleSuite {
  return MODULES[key].suite;
}

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

