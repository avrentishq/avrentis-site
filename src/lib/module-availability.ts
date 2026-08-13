/* ── Per-module plan availability, DERIVED ────────────────────── */

import type { PricingData } from "@/lib/pricing";
// Type-only: erased at compile time, so pulling the row shape from the client
// component does not drag the client bundle into a server route.
import type { ModulePlan } from "@/components/product/module-layout";

/**
 * Which plans include a module, derived from the pricing API's per-plan module
 * membership — the same field the pricing page's module badges read.
 *
 * WHY THIS IS DERIVED AND NOT AUTHORED. Every product module page used to carry
 * its own hand-written `planAvailability` array, and two of the eight had gone
 * stale against the platform:
 *
 *   - Records said "Starter — Not included". Records has been a core, every-tier
 *     module since it was reclassified from `expansion`; Starter carries it AND
 *     both features it owns. The page talked a Starter buyer out of a module
 *     they already get.
 *   - Compliance said "Starter — included, Basic audit trail". Compliance is not
 *     in Starter's module set and all three of its features are off at that tier.
 *     That one sold a capability the tier does not deliver.
 *
 * Both are the same failure: a fact about entitlement, kept by hand, in a file
 * nobody edits when pricing changes. The API already publishes the truth, so
 * inclusion is now read from it and only the editorial colour stays authored.
 *
 * NOTE ON SUBSTRATE MODULES. `included` answers "is the sellable module in this
 * tier", which is the question the table's tick actually claims. It is NOT the
 * same as "you get nothing" — the always-on foundation (approval engine,
 * immutable trail) runs on every plan. Where that distinction matters the note
 * says so explicitly; see `MODULE_PLAN_NOTES.audit.starter`.
 */
export function planAvailabilityFor(
  moduleKey: string,
  data: PricingData,
): ModulePlan[] {
  const planFor = (key: string) => data.plans.find((p) => p.key === key);

  // A PLATFORM module (Authority — the approval engine) is on every plan and is
  // therefore published under `platformModules`, deliberately absent from any
  // plan's own `modules` array. Read literally that would render a page of
  // crosses for the one module nobody can be without, so inclusion is answered
  // from the field the API actually puts it in. Still derived — no key is
  // special-cased here, and a module the API later promotes or demotes follows
  // automatically.
  const isPlatformModule = (data.platformModules ?? []).some((m) => m.key === moduleKey);
  const includes = (planKey: string) =>
    isPlatformModule || (planFor(planKey)?.modules.some((m) => m.key === moduleKey) ?? false);

  const notes = MODULE_PLAN_NOTES[moduleKey] ?? {};
  const rows: ModulePlan[] = [];

  // Trial row first — a trialist is on a real tier, so its inclusion is that
  // tier's inclusion. Self-hides when the API omits trial terms (stale fallback)
  // or the trial is switched off, rather than asserting a trial that isn't sold.
  const trial = data.trial;
  const trialPlan = trial?.enabled ? planFor(trial.plan) : undefined;
  if (trial && trialPlan) {
    rows.push({
      plan: `${trial.days}-day ${trialPlan.name} trial`,
      included: includes(trial.plan),
      note: notes.trial,
    });
  }

  for (const planKey of data.planOrder) {
    const plan = planFor(planKey);
    if (!plan) continue; // planOrder naming a plan the payload doesn't carry
    rows.push({
      plan: plan.name,
      included: includes(planKey),
      note: notes[planKey],
    });
  }

  return rows;
}

/**
 * Editorial colour only — what a tier adds BEYOND inclusion, or what a buyer
 * still gets when the module itself is not in their tier.
 *
 * Deliberately holds no inclusion claim: "Included" / "Not included" notes were
 * dropped because the row's tick already says it, and a note that restates the
 * tick is a second copy that can contradict the first. Keyed by module, then by
 * plan key (or `trial`). A missing entry renders no note, which is fine.
 *
 * Do not restate numbers the API already publishes (seats, storage, retention)
 * — those live in `Plan.limits` with precomputed labels and would drift here.
 */
const MODULE_PLAN_NOTES: Record<string, Record<string, string>> = {
  pay: {
    business: "Adds custom approval chains",
    enterprise: "Adds SLA tracking and advanced routing",
  },
  procure: {
    business: "Adds custom approval chains",
    enterprise: "Adds SLA tracking and advanced routing",
  },
  vault: {
    enterprise: "Unlimited storage and retention",
  },
  authority: {
    // On every tier by definition; the depth is what moves. Base engine
    // (approval chains, multi-level routing) is universal — see the app's
    // module catalog, which gates only the depth behind plan features.
    starter: "Approval chains and multi-level routing",
    business: "Adds custom chains, SLA tracking and delegation",
    enterprise: "Adds approver groups, quorum gates and condition-based routing",
  },
  audit: {
    // The honesty fix. Starter does not carry Compliance, but the immutable
    // trail is foundation and runs for everyone — say both, claim neither.
    starter:
      "Trail still recorded — reporting, exports and DSAR tools from Business",
    business: "Full trail history and regulator-ready export",
    enterprise: "Unlimited retention and SIEM export",
  },
  guard: {
    starter: "From Business",
    business: "All rule-based flags and the review queue",
  },
  grants: {
    starter: "From Business",
    business: "Donors, grants, budget lines, burn and reports",
    enterprise: "Adds sub-grantees at scale",
  },
  people: {
    starter: "Enterprise tier only",
    business: "Enterprise tier only",
  },
  connect: {
    starter: "Enterprise tier only",
    business: "Enterprise tier only",
    enterprise: "Unlimited API keys and priority support",
  },
};
