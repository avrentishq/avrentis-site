import { describe, expect, it } from "vitest";
import { platformSalesTax } from "@avrentishq/core/billing/platform-tax";
import { formatTaxRate, priceTaxNote, taxLabel } from "@/lib/price-tax";
import fallback from "@/data/pricing-fallback.json";
import { readFileSync } from "node:fs";

const ngnRate = platformSalesTax("NGN")!.rate;

describe("tax added on top of a listed price", () => {
  it("naira shows core's VAT rate, formatted, never typed", () => {
    expect(priceTaxNote("NGN")).toBe(`+ ${formatTaxRate(ngnRate)} VAT`);
    expect(formatTaxRate(0.075)).toBe("7.5%");
    expect(taxLabel("NGN")).toBe(`VAT ${formatTaxRate(ngnRate)}`);
  });

  it("prefers the payload's numeric rate, and stays compatible when it is absent", () => {
    expect(priceTaxNote("NGN", 0.1)).toBe("+ 10% VAT");
    expect(priceTaxNote("NGN", undefined)).toBe(priceTaxNote("NGN"));
    expect(priceTaxNote("NGN", null)).toBe(priceTaxNote("NGN"));
  });

  it("states no tax for a Stripe currency (tax is computed at checkout)", () => {
    expect(priceTaxNote("USD")).toBeNull();
    expect(priceTaxNote("USD", null)).toBeNull();
    expect(taxLabel("USD")).toBeNull();
  });

  it("the generated fallback carries core's rate on every naira price", () => {
    for (const plan of fallback.plans) {
      for (const price of plan.pricing.filter((entry) => entry.currency === "NGN")) {
        expect(price.taxRate).toBe(ngnRate);
        expect(price.taxLabel).toBe(taxLabel("NGN"));
      }
    }
  });

  it("no rate is typed in the pricing section or the helper", () => {
    for (const file of ["../components/sections/pricing.tsx", "./price-tax.ts"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/7\.5\s*%|0\.075/);
    }
  });
});
