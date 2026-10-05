import { describe, expect, it } from "vitest";
import { PLAN_CATALOG, PLAN_ORDER } from "@avrentishq/core/billing/catalog";
import { SERVICE_COMMITMENT_KEYS } from "@avrentishq/core/billing/features";
import type { PricingData } from "@/lib/pricing";
import { SERVICE_GROUP_KEY, withServiceCommitmentGroup } from "@/lib/service-commitments";
import fallback from "@/data/pricing-fallback.json";

const SERVICE: readonly string[] = SERVICE_COMMITMENT_KEYS;
const current = fallback as unknown as PricingData;

/** The payload as an older API served it: commitments only in `features`, under the platform group. */
function legacyPayload(): PricingData {
  return {
    ...current,
    plans: current.plans.map((plan) => {
      const { serviceCommitments: _dropped, ...rest } = plan;
      void _dropped;
      return rest;
    }),
    featureGroups: (current.featureGroups ?? [])
      .filter((group) => group.key !== SERVICE_GROUP_KEY)
      .map((group) => (group.key === "platform" ? { ...group, featureKeys: [...group.featureKeys, ...SERVICE] } : group)),
  };
}

describe("service commitments render as their own group", () => {
  it("the generated fallback lists them per plan from core, and only in the service group", () => {
    for (const plan of current.plans) {
      expect(plan.serviceCommitments).toEqual([...PLAN_CATALOG[plan.key as (typeof PLAN_ORDER)[number]].serviceCommitments]);
    }
    const groups = current.featureGroups ?? [];
    expect(groups.at(-1)?.key).toBe(SERVICE_GROUP_KEY);
    for (const group of groups.filter((group) => group.key !== SERVICE_GROUP_KEY)) {
      for (const key of SERVICE) expect(group.featureKeys).not.toContain(key);
    }
  });

  it("an older payload (commitments only in features, under platform) renders the same groups", () => {
    const fromLegacy = withServiceCommitmentGroup(legacyPayload());
    // Proves the fixture really is the old shape before trusting the comparison.
    expect(legacyPayload().featureGroups!.find((group) => group.key === "platform")!.featureKeys).toEqual(
      expect.arrayContaining([...SERVICE]),
    );
    expect(fromLegacy.featureGroups).toEqual(current.featureGroups);
    for (const plan of fromLegacy.plans) {
      const expected = current.plans.find((candidate) => candidate.key === plan.key)!;
      expect(plan.serviceCommitments).toEqual(expected.serviceCommitments);
    }
  });

  it("the per-plan list wins over a stale features flag", () => {
    const data = withServiceCommitmentGroup({
      ...current,
      plans: current.plans.map((plan) => ({
        ...plan,
        serviceCommitments: [],
        features: { ...plan.features, prioritySupport: true },
      })),
    });
    expect(data.plans.every((plan) => plan.features.prioritySupport === false)).toBe(true);
    expect(data.featureGroups!.some((group) => group.key === SERVICE_GROUP_KEY)).toBe(false);
  });

  it("is idempotent (the page applies it to a fallback that already had it)", () => {
    expect(withServiceCommitmentGroup(current)).toEqual(current);
  });
});
