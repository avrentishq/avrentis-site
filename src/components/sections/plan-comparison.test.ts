import { describe, it, expect } from "vitest";
import fallback from "@/data/pricing-fallback.json";
import type { PricingData } from "@/lib/pricing";

/**
 * Drift guard for the comparison matrix. The grouping is derived SSOT
 * (pricing API); these assert the site can render whatever it emits without a
 * silent gap — every grouped feature has a label and a value on every plan.
 */
const data = fallback as unknown as PricingData;

describe("plan comparison data (from the synced pricing fallback)", () => {
  it("exposes feature groups", () => {
    expect(data.featureGroups?.length ?? 0).toBeGreaterThan(0);
  });

  it("every grouped feature key resolves a human label", () => {
    const missing = (data.featureGroups ?? [])
      .flatMap((g) => g.featureKeys)
      .filter((fk) => !data.featureLabels[fk]);
    expect(missing).toEqual([]);
  });

  it("every grouped feature has a boolean on every plan (no rendering gaps)", () => {
    const keys = (data.featureGroups ?? []).flatMap((g) => g.featureKeys);
    for (const plan of data.plans) {
      for (const fk of keys) {
        expect(typeof plan.features[fk]).toBe("boolean");
      }
    }
  });

  it("does not list the same feature in two groups", () => {
    const all = (data.featureGroups ?? []).flatMap((g) => g.featureKeys);
    expect(new Set(all).size).toBe(all.length);
  });
});
