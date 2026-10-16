/* ── Plan-name helpers — copy names tiers from the API, never by hand ── */

import { formatEnglishList } from "@/lib/english-list";
import type { Plan, PricingData } from "@/lib/pricing";

/*
 * Pure functions over the pricing payload, split from `pricing.ts` so a client
 * page can use them: `pricing.ts` fetches through `platformFetch`, which is
 * server-only.
 */

/** Plan names in display order (`planOrder`), optionally only those with `featureKey` on. */
export function planNames(data: PricingData, featureKey?: string): string[] {
  return data.planOrder
    .map((key) => data.plans.find((plan) => plan.key === key))
    .filter((plan): plan is Plan => plan !== undefined)
    .filter((plan) => featureKey === undefined || plan.features[featureKey] === true)
    .map((plan) => plan.name);
}

/** "Enterprise", "Business and Enterprise", "Starter, Business and Enterprise". */
export function formatPlanList(names: string[]): string {
  return formatEnglishList(names);
}

/** Each plan feature's plan names, in display order — serialisable, so a route can hand it to a client page. */
export type FeaturePlans = Record<string, string[]>;

export function featurePlans(data: PricingData): FeaturePlans {
  const keys = new Set(data.plans.flatMap((plan) => Object.keys(plan.features)));
  return Object.fromEntries([...keys].map((key) => [key, planNames(data, key)]));
}

/** The one wording for a capability that is on every plan — as a lead-in, and as a sentence. */
export const EVERY_PLAN_LEAD = "Included on every plan";
export const EVERY_PLAN_NOTE = `${EVERY_PLAN_LEAD}.`;

/**
 * The sentence naming the plans something is on: "Available on Business and
 * Enterprise." / "Included on every plan." — or "" when the payload names no
 * plan (unknown, so nothing is claimed).
 */
export function planScopeNote(names: readonly string[], allPlanNames: readonly string[]): string {
  if (names.length === 0) return "";
  if (allPlanNames.length > 0 && allPlanNames.every((name) => names.includes(name))) return EVERY_PLAN_NOTE;
  return `Available on ${formatPlanList([...names])}.`;
}
