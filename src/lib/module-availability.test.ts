import { describe, it, expect } from "vitest";
import { planAvailabilityFor } from "@/lib/module-availability";
import type { PricingData } from "@/lib/pricing";
import fallback from "@/data/pricing-fallback.json";

const data = fallback as unknown as PricingData;

/** The row for a plan display name, e.g. "Starter". */
const row = (moduleKey: string, planName: string) =>
  planAvailabilityFor(moduleKey, data).find((r) => r.plan === planName);

describe("planAvailabilityFor — inclusion comes from the API, never from prose", () => {
  // The two drifts this derivation exists to kill. Both were live on the site
  // and both were wrong in the expensive direction: one talked a Starter buyer
  // out of a module they get, the other sold one they don't.
  it("Records IS included on Starter (the under-claim that cost conversions)", () => {
    expect(row("vault", "Starter")?.included).toBe(true);
  });

  it("Compliance is NOT included on Starter (the over-claim that sold a missing tier)", () => {
    expect(row("audit", "Starter")?.included).toBe(false);
  });

  it("says what a Starter buyer still gets rather than leaving a bare cross", () => {
    // Compliance is substrate: the trail runs for everyone even though the
    // sellable module starts at Business. A bare ✗ would be its own over-correction.
    expect(row("audit", "Starter")?.note).toMatch(/still recorded/i);
  });

  it("tracks real membership across every tier", () => {
    // Ground truth: avrentis-app src/lib/billing/plans.ts module lists.
    expect(row("pay", "Starter")?.included).toBe(true);
    expect(row("procure", "Starter")?.included).toBe(true);
    expect(row("guard", "Starter")?.included).toBe(false);
    expect(row("guard", "Business")?.included).toBe(true);
    expect(row("connect", "Business")?.included).toBe(false);
    expect(row("connect", "Enterprise")?.included).toBe(true);
    expect(row("people", "Business")?.included).toBe(false);
    expect(row("people", "Enterprise")?.included).toBe(true);
  });

  it("derives the trial row from the tier the trial actually runs on", () => {
    // Not the literal string "30-day Business trial" in eight files: change the
    // trial length or tier in the API and every module page follows.
    const rows = planAvailabilityFor("guard", data);
    expect(rows[0]!.plan).toBe("30-day Business trial");
    // Guard is a Business module, and the trial is a Business trial ⇒ included.
    expect(rows[0]!.included).toBe(true);
    // People is Enterprise-only, so a Business trial does NOT include it.
    expect(planAvailabilityFor("people", data)[0]!.included).toBe(false);
  });

  it("emits one row per plan, in the API's declared order", () => {
    const rows = planAvailabilityFor("vault", data).map((r) => r.plan);
    expect(rows).toEqual([
      "30-day Business trial",
      "Starter",
      "Business",
      "Enterprise",
    ]);
  });

  it("carries no note that restates the tick", () => {
    for (const moduleKey of data.moduleOrder) {
      for (const r of planAvailabilityFor(moduleKey, data)) {
        expect(r.note ?? "").not.toMatch(/^(Included|Not included)$/i);
      }
    }
  });
});

describe("planAvailabilityFor — degraded payloads must not invent entitlement", () => {
  it("hides the trial row when the API omits trial terms", () => {
    const noTrial = { ...data, trial: undefined } as PricingData;
    expect(planAvailabilityFor("vault", noTrial)[0]!.plan).toBe("Starter");
  });

  it("hides the trial row when the trial is switched off", () => {
    const off = {
      ...data,
      trial: { ...data.trial!, enabled: false },
    } as PricingData;
    expect(off.trial!.enabled).toBe(false);
    expect(planAvailabilityFor("vault", off)[0]!.plan).toBe("Starter");
  });

  it("skips a planOrder entry the payload has no plan for", () => {
    const ghost = {
      ...data,
      planOrder: [...data.planOrder, "ghost"],
    } as PricingData;
    expect(
      planAvailabilityFor("vault", ghost).some((r) => r.plan === "ghost"),
    ).toBe(false);
  });

  it("reports an unknown module as not included rather than throwing", () => {
    // Fails CLOSED: a module the API doesn't publish is not something we claim.
    const rows = planAvailabilityFor("does-not-exist", data);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => !r.included)).toBe(true);
  });
});
