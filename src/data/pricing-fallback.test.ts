/**
 * The committed pricing fallback must equal what core's plan catalogue
 * generates — checked offline, every run.
 *
 * WHAT THE FALLBACK IS. The site fetches pricing from the live API on every
 * render path (`fetchPricingData`, ISR at one hour). This file is the
 * COLD-START FLOOR: it renders only when the cache holds nothing good AND the
 * API is unreachable or returns an invalid shape.
 *
 * WHY IT IS GENERATED. It used to be a copy of the live API, refreshed by
 * whichever build happened to reach the API, and checked by a test that could
 * only compare anything while the API was up — so it reported nothing exactly
 * when the floor mattered. It once went eight core releases stale (Business
 * recorded as lacking two features that had gone GA) with every check green.
 * Every fact the API serves now lives in core, so the file is derived from core
 * by `src/lib/pricing-fallback-build.ts`, and this test fails the moment the
 * committed copy and the generated one disagree — a core bump that changes a
 * price, a capacity or a plan's features turns this red until the file is
 * regenerated and committed.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PLAN_CATALOG, PLAN_ORDER, annualPriceMinor } from "@avrentishq/core/billing/catalog";
import { CURRENCIES } from "@avrentishq/core/money/types";

import { serialisePricingFallback } from "@/lib/pricing-fallback-build";
import fallback from "./pricing-fallback.json";

const committedText = readFileSync(new URL("./pricing-fallback.json", import.meta.url), "utf8");

/** Published module copy — the `name` and `description` a buyer reads. */
function moduleCopy(data: {
  modules?: Record<string, { name?: string; description?: string }>;
}): Record<string, { name: string; description: string }> {
  const copy: Record<string, { name: string; description: string }> = {};
  for (const [key, entry] of Object.entries(data.modules ?? {})) {
    copy[key] = { name: entry.name ?? "", description: entry.description ?? "" };
  }
  return copy;
}

describe("pricing fallback", () => {
  it("is exactly what core's catalogue generates (regenerate and commit when red)", () => {
    expect(
      committedText,
      "src/data/pricing-fallback.json is stale — run `node scripts/generate-pricing-fallback.mjs` and commit it",
    ).toBe(serialisePricingFallback());
  });

  it("states core's prices, in major units, for every plan it lists", () => {
    // The equality above proves the file matches the GENERATOR; this proves the
    // generator matches CORE, so a bug in the builder cannot pass by agreeing
    // with itself.
    for (const plan of fallback.plans) {
      const key = plan.key as (typeof PLAN_ORDER)[number];
      for (const price of plan.pricing) {
        const currency = price.currency as keyof typeof CURRENCIES;
        const divisor = 10 ** CURRENCIES[currency].minorUnit;
        expect(price.monthly).toBe(PLAN_CATALOG[key].pricing[currency]!.monthlyMinor / divisor);
        const annualMinor = annualPriceMinor(key, currency);
        expect(price.annualTotal).toBe(annualMinor === null ? null : annualMinor / divisor);
      }
      expect(plan.limits.maxUsers).toBe(PLAN_CATALOG[key].capacity.maxUsers);
      expect(plan.limits.maxStorageBytes).toBe(PLAN_CATALOG[key].capacity.maxStorageBytes);
    }
    expect(fallback.planOrder).toEqual([...PLAN_ORDER]);
  });

  it("has the shape the renderer requires", () => {
    // `fetchPricingData` validates this same shape before using a response, so
    // a fallback that failed it would leave the cold-start path with nothing.
    expect(fallback.plans.length).toBeGreaterThan(0);
    expect(fallback.planOrder.length).toBeGreaterThan(0);
    for (const plan of fallback.plans) {
      expect(Array.isArray(plan.pricing)).toBe(true);
      expect(plan.pricing.length).toBeGreaterThan(0);
      expect(typeof plan.selfServeCheckout).toBe("boolean");
    }
  });

  it("names every plan the order references", () => {
    const keys = new Set(fallback.plans.map((plan) => plan.key));
    for (const key of fallback.planOrder) {
      expect(keys.has(key), `planOrder names "${key}" but no plan has that key`).toBe(true);
    }
  });

  it("says the same thing about a module everywhere it appears", () => {
    // Every module's copy is published TWICE — once in the `modules` map and
    // again inside each plan that includes it. Whichever a surface reads decides
    // what the buyer is told, so the two must agree.
    const canonical = moduleCopy(fallback);
    const mismatches: string[] = [];
    for (const plan of fallback.plans) {
      for (const listed of plan.modules) {
        const source = canonical[listed.key];
        if (!source) {
          mismatches.push(`plan "${plan.key}" lists module "${listed.key}", absent from the modules map`);
          continue;
        }
        if (listed.description !== source.description) mismatches.push(`${plan.key}/${listed.key}: description differs`);
        if (listed.name !== source.name) mismatches.push(`${plan.key}/${listed.key}: name differs`);
      }
    }
    expect(mismatches, `the fallback contradicts itself:\n${mismatches.join("\n")}`).toEqual([]);
  });

  it("carries the trial terms the product runs", () => {
    expect(fallback.trial.plan).toBeDefined();
    expect(fallback.plans.some((plan) => plan.key === fallback.trial.plan)).toBe(true);
  });
});
