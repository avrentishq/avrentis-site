/* ── Pricing API types and fetch ──────────────────────────────── */

import { PLATFORM_ORIGIN } from "@/lib/platform";

export interface PricingCurrency {
  currency: string;
  monthly: number;
  monthlyLabel: string | null;
  annualPerMonth: number | null;
  annualTotal: number | null;
  annualLabel: string | null;
  taxRate: number | null;
  taxLabel: string | null;
}

export interface PlanLimits {
  maxUsers: number;
  maxDocumentsPerMonth: number | null;
  maxStorageBytes: number | null;
  documentRetentionDays: number | null;
  /** Display labels precomputed by the pricing API (treat `0` as unlimited,
   *  matching the pricing cards). Prefer these over re-deriving from the raw
   *  numbers — the numbers use `0` to mean "unlimited". */
  maxUsersLabel?: string;
  maxDocumentsPerMonthLabel?: string;
  maxStorageBytesLabel?: string;
  documentRetentionDaysLabel?: string;
}

export interface PlanModule {
  key: string;
  name: string;
  description: string;
  /**
   * Present ONLY for a module restricted to certain industry sectors (an
   * archetype add-on — Grants is for grant-funded organisations). The plan
   * includes it, but a customer outside these sectors cannot use it, so the
   * badge MUST be qualified rather than implying every buyer on the tier gets
   * it. Absent = available to everyone on the plan (the normal case).
   */
  availableToSectors?: string[];
}

export interface Plan {
  key: string;
  name: string;
  description: string;
  /** Curated, short marketing bullets from the product API. Prefer these over
   *  composing features + limits — the product API is the single source of truth. */
  highlights: string[];
  /**
   * Can this tier be bought with a card, or does it need a sales conversation?
   *
   * READ THIS, NEVER THE TIER NAME. `plan.key === "enterprise"` was how the CTA,
   * the struck-through price and the annual-saving line all decided — which
   * silently becomes wrong the day a second tier is quote-priced, or the day
   * Enterprise becomes self-serve. The published amount cannot answer it either:
   * a quote-priced tier shows a FLOOR ("From ₦…"), which reads as a price.
   *
   * The product API is the single source of truth and enforces the same flag on
   * its own Pay button, so the page and the product cannot disagree.
   */
  selfServeCheckout: boolean;
  pricing: PricingCurrency[];
  limits: PlanLimits;
  modules: PlanModule[];
  features: Record<string, boolean>;
}

export interface ModuleInfo {
  name: string;
  description: string;
  /** See `PlanModule.availableToSectors`. */
  availableToSectors?: string[];
}

/** A comparison-table section, derived server-side by the pricing API from the
 *  module→feature ownership SSOT (deduped, orphan-free, coverage-complete).
 *  `label` is the module's short name, or "Workflow & platform" for the
 *  cross-cutting catch-all group. */
export interface FeatureGroup {
  key: string;
  label: string;
  featureKeys: string[];
}

/** The free-trial terms, as published by the pricing API. The trial runs on a
 *  real plan tier (`plan`), so what a trialist can actually use is that plan's
 *  entitlement — which is why the module pages derive their trial row from it
 *  rather than restating "30-day Business trial" in eight places. */
export interface TrialInfo {
  enabled: boolean;
  days: number;
  /** Plan KEY the trial runs on (matches a `Plan.key`), not a display name. */
  plan: string;
  seatCap?: number;
  cardRequired?: boolean;
}

export interface PricingData {
  plans: Plan[];
  planOrder: string[];
  addOns: unknown[];
  featureLabels: Record<string, string>;
  /** Optional — absent on a stale fallback; the trial row then self-hides. */
  trial?: TrialInfo;
  /** Optional — absent on a cold-start stale fallback; the comparison table
   *  self-hides when missing/empty. */
  featureGroups?: FeatureGroup[];
  moduleOrder: string[];
  modules: Record<string, ModuleInfo>;
  /** The always-on substrate modules (approval engine, audit trail, integrations)
   *  advertised ONCE as "included on every plan", never a per-plan badge. Optional
   *  — absent on a stale fallback / a pre-deploy API; the render falls back to the
   *  site's own substrate module list. Reuses `PlanModule` ({ key, name, description }). */
  platformModules?: PlanModule[];
}

const PRICING_API = `${PLATFORM_ORIGIN}/api/v1/public/pricing`;

import fallback from "@/data/pricing-fallback.json";

export async function fetchPricingData(): Promise<PricingData> {
  try {
    const res = await fetch(PRICING_API, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return fallback as unknown as PricingData;

    const data = await res.json();
    // Guard the full shape the UI depends on — a structurally-partial but
    // non-empty payload would otherwise pass and crash the render.
    const valid =
      Array.isArray(data?.plans) &&
      data.plans.length > 0 &&
      Array.isArray(data?.planOrder) &&
      data.planOrder.length > 0 &&
      data.plans.every(
        (p: { pricing?: unknown; selfServeCheckout?: unknown }) =>
          // `selfServeCheckout` is guarded like `pricing` because the page reads
          // it to decide between "Start my trial" and "Talk to us". Absent, the
          // check below would coerce to false and put EVERY tier behind a sales
          // conversation — so a payload without it is not trusted, and the
          // committed snapshot serves instead.
          Array.isArray(p?.pricing) && typeof p?.selfServeCheckout === "boolean",
      );
    if (!valid) return fallback as unknown as PricingData;

    return data as PricingData;
  } catch {
    return fallback as unknown as PricingData;
  }
}

/* ── Formatting helpers ──────────────────────────────────────── */

export function formatBytes(bytes: number | null): string {
  if (bytes === null) return "Unlimited";
  if (bytes >= 1073741824) return `${Math.round(bytes / 1073741824)} GB`;
  if (bytes >= 1048576) return `${Math.round(bytes / 1048576)} MB`;
  return `${bytes} B`;
}

export function formatRetention(days: number | null): string {
  if (days === null) return "Unlimited";
  if (days >= 365) {
    const years = Math.round(days / 365);
    return `${years} year${years > 1 ? "s" : ""}`;
  }
  return `${days}-day`;
}

export function formatCurrencyAmount(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    NGN: "₦",
    GBP: "£",
    EUR: "€",
    GHS: "GH₵",
    KES: "KSh",
    ZAR: "R",
  };
  const symbol = symbols[currency] ?? currency + " ";
  return `${symbol}${amount.toLocaleString()}`;
}
