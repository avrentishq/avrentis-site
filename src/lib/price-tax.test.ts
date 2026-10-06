import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PlatformTaxRegistration } from "@avrentishq/core/billing/platform-tax";
import { STANDARD_SALES_TAX } from "@avrentishq/core/region/sales-tax";
import type { CountryCode } from "@avrentishq/core/region/countries";
import { formatTaxRate, priceTaxNote, taxLabel } from "@/lib/price-tax";
import fallback from "@/data/pricing-fallback.json";
import { readFileSync } from "node:fs";

// Core's real `platformSalesTax`, run against a registration list the test
// controls: by default core's own list (empty today — Avrentis is not
// registered anywhere), or a registered-for-Nigerian-VAT one to prove the
// registered branch without waiting for core to change.
const registrationsUnderTest = vi.hoisted(() => ({
  current: undefined as Readonly<Partial<Record<CountryCode, PlatformTaxRegistration>>> | undefined,
}));
vi.mock("@avrentishq/core/billing/platform-tax", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@avrentishq/core/billing/platform-tax")>();
  return {
    ...actual,
    platformSalesTax: (currency: Parameters<typeof actual.platformSalesTax>[0]) =>
      actual.platformSalesTax(currency, registrationsUnderTest.current ?? actual.PLATFORM_TAX_REGISTRATIONS),
  };
});

const registeredInNigeria = { NG: { effectiveFrom: "2000-01-01" } } as const;
const nigerianVatRate = STANDARD_SALES_TAX.NG!.rate;

beforeEach(() => {
  registrationsUnderTest.current = undefined;
});

describe("no tax line while core holds no registration (today)", () => {
  it("naira shows no tax, from core's own registration list", () => {
    expect(priceTaxNote("NGN")).toBeNull();
    expect(taxLabel("NGN")).toBeNull();
  });

  it("ignores a rate the live API still sends — core decides whether, the payload only formats", () => {
    expect(priceTaxNote("NGN", nigerianVatRate)).toBeNull();
    expect(priceTaxNote("NGN", null)).toBeNull();
    expect(priceTaxNote("NGN", undefined)).toBeNull();
  });

  it("the generated fallback carries no tax on any price", () => {
    for (const plan of fallback.plans) {
      for (const price of plan.pricing) {
        expect(price.taxRate).toBeNull();
        expect(price.taxLabel).toBeNull();
      }
    }
  });
});

describe("once registered for Nigerian VAT", () => {
  beforeEach(() => {
    registrationsUnderTest.current = registeredInNigeria;
  });

  it("naira shows core's VAT rate, formatted, never typed", () => {
    expect(priceTaxNote("NGN")).toBe(`+ ${formatTaxRate(nigerianVatRate)} VAT`);
    expect(taxLabel("NGN")).toBe(`VAT ${formatTaxRate(nigerianVatRate)}`);
  });

  it("formats the payload's positive rate, else core's", () => {
    expect(priceTaxNote("NGN", 0.1)).toBe("+ 10% VAT");
    expect(priceTaxNote("NGN", undefined)).toBe(priceTaxNote("NGN"));
    expect(priceTaxNote("NGN", null)).toBe(priceTaxNote("NGN"));
    expect(priceTaxNote("NGN", 0)).toBe(priceTaxNote("NGN"));
  });

  it("not before the registration takes effect", () => {
    registrationsUnderTest.current = { NG: { effectiveFrom: "2999-01-01" } };
    expect(priceTaxNote("NGN", nigerianVatRate)).toBeNull();
  });
});

describe("Stripe currencies", () => {
  it("state no tax (computed at checkout), registered or not, whatever the payload says", () => {
    for (const registrations of [undefined, registeredInNigeria]) {
      registrationsUnderTest.current = registrations;
      expect(priceTaxNote("USD")).toBeNull();
      expect(priceTaxNote("USD", 0.2)).toBeNull();
      expect(taxLabel("USD")).toBeNull();
    }
  });
});

describe("formatting and locks", () => {
  it("formats a rate as a percent with up to two decimals", () => {
    expect(formatTaxRate(0.075)).toBe("7.5%");
    expect(formatTaxRate(0.2)).toBe("20%");
  });

  it("no rate is typed in the pricing section, the helper or the fallback builder", () => {
    for (const file of [
      "../components/sections/pricing.tsx",
      "./price-tax.ts",
      "./pricing-fallback-build.ts",
    ]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/7\.5\s*%|0\.075/);
    }
  });
});
