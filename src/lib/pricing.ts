/* ── Pricing API types and fetch ──────────────────────────────── */

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
}

export interface PlanModule {
  key: string;
  name: string;
  description: string;
}

export interface Plan {
  key: string;
  name: string;
  description: string;
  /** Curated, short marketing bullets from the product API. Prefer these over
   *  composing features + limits — the product API is the single source of truth. */
  highlights: string[];
  pricing: PricingCurrency[];
  limits: PlanLimits;
  modules: PlanModule[];
  features: Record<string, boolean>;
}

export interface ModuleInfo {
  name: string;
  description: string;
}

export interface PricingData {
  plans: Plan[];
  planOrder: string[];
  addOns: unknown[];
  featureLabels: Record<string, string>;
  moduleOrder: string[];
  modules: Record<string, ModuleInfo>;
}

const PRICING_API = "https://app.avrentis.com/api/v1/public/pricing";

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
      data.plans.every((p: { pricing?: unknown }) => Array.isArray(p?.pricing));
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

export function formatCurrencyAmount(
  amount: number,
  currency: string,
): string {
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
