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
 * tamper-evident trail) runs on every plan. Where that distinction matters the note
 * says so explicitly; see `MODULE_PLAN_NOTES.audit.starter`.
 *
 * A row that does NOT include the module and has no authored note says where the
 * module starts ("From <tier>" / "<tier> tier only"), derived from the
 * same membership — tier names are never typed into a note.
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

  // Where the module starts, for the rows that do not include it: "From
  // <tier>", or "<tier> tier only" when only the top tier carries it.
  // Derived from the same membership as the tick, so no plan name is typed here.
  const includingPlans = data.planOrder.filter(includes);
  const lowestIncluding = includingPlans.length > 0 ? planFor(includingPlans[0]!) : undefined;
  const isTopTierOnly =
    includingPlans.length === 1 && includingPlans[0] === data.planOrder[data.planOrder.length - 1];
  const startsAt = lowestIncluding
    ? isTopTierOnly
      ? `${lowestIncluding.name} tier only`
      : `From ${lowestIncluding.name}`
    : undefined;
  const noteFor = (key: string, included: boolean): string | undefined => {
    const authored = notes[key];
    if (typeof authored === "function") return authored(lowestIncluding?.name ?? "");
    return authored ?? (included ? undefined : startsAt);
  };

  // Trial row first — a trialist is on a real tier, so its inclusion is that
  // tier's inclusion. Self-hides when the API omits trial terms (stale fallback)
  // or the trial is switched off, rather than asserting a trial that isn't sold.
  const trial = data.trial;
  const trialPlan = trial?.enabled ? planFor(trial.plan) : undefined;
  if (trial && trialPlan) {
    rows.push({
      plan: `${trial.days}-day ${trialPlan.name} trial`,
      included: includes(trial.plan),
      note: noteFor("trial", includes(trial.plan)),
    });
  }

  for (const planKey of data.planOrder) {
    const plan = planFor(planKey);
    if (!plan) continue; // planOrder naming a plan the payload doesn't carry
    rows.push({
      plan: plan.name,
      included: includes(planKey),
      note: noteFor(planKey, includes(planKey)),
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
 * — those live in `Plan.limits` and would drift here. Never name a tier either:
 * "From <tier>" is derived for every row that lacks the module, and a note that
 * must name one is a function handed the lowest tier that includes the module.
 */
type PlanNote = string | ((lowestIncludingPlanName: string) => string);

const MODULE_PLAN_NOTES: Record<string, Record<string, PlanNote>> = {
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
    // The honesty fix. Starter does not carry Compliance, but the tamper-evident
    // trail and data-subject request handling are foundation and run for
    // everyone — say both, claim neither.
    starter: (from) =>
      `Trail still recorded and data-subject requests handled — reporting and exports from ${from}`,
    business: "Full trail history and regulator-ready export",
    enterprise: "Unlimited retention, plus a live SIEM feed through the API",
  },
  guard: {
    business: "All rule-based flags and the review queue",
  },
  grants: {
    // No enterprise line. Sub-grantee oversight is part of the module, and the
    // module is Business+ in its entirety — "Adds sub-grantees at scale" sold
    // an upgrade for something the Business buyer already has.
    business:
      "Donors, awards and budget lines, partner sub-awards, donor receipts and cash position, matching contributions, reporting deadlines and donor-ready reports",
  },
  connect: {
    enterprise: "Unlimited API keys and priority support",
  },
};
