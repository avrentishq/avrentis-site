import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { formatCurrencyAmount, formatBytes, formatRetention } from "@/lib/pricing";
import fallback from "@/data/pricing-fallback.json";

describe("pricing formatters (money path feeding the UI + JSON-LD)", () => {
  it("formats known currencies with their symbol", () => {
    expect(formatCurrencyAmount(583333, "NGN")).toBe("₦583,333");
    expect(formatCurrencyAmount(0, "USD")).toBe("$0");
    expect(formatCurrencyAmount(1000, "GBP")).toBe("£1,000");
  });

  it("falls back to the code for unknown currencies", () => {
    expect(formatCurrencyAmount(1000, "XYZ")).toBe("XYZ 1,000");
  });

  it("formats bytes and retention", () => {
    expect(formatBytes(1073741824)).toBe("1 GB");
    expect(formatBytes(null)).toBe("Unlimited");
    expect(formatRetention(30)).toBe("30-day");
    expect(formatRetention(730)).toBe("2 years");
  });
});

/**
 * The page must decide "sell it" vs "talk to us" from the product API, never
 * from a tier's NAME.
 *
 * This is the drift that existed: `plan.key === "enterprise"` drove the CTA, the
 * struck-through price and the annual-saving line. It works only while exactly
 * one tier is quote-priced and that tier is called Enterprise. Change either and
 * the page sells something it should not, or refuses to sell something it
 * should — with nothing failing to say so.
 */
describe("quote-priced tiers are API-derived, never name-derived", () => {
  const pricingSource = readFileSync(
    new URL("../components/sections/pricing.tsx", import.meta.url),
    "utf8",
  );

  it("does not branch on a tier name anywhere in the pricing section", () => {
    // Proven live rather than assumed: this same pattern matched before the
    // change, which is what makes its absence now meaningful.
    expect(pricingSource).not.toMatch(/key\s*===\s*["']enterprise["']/);
  });

  it("derives the quote-priced decision from selfServeCheckout", () => {
    expect(pricingSource).toMatch(/isQuotePriced\s*=\s*!plan\.selfServeCheckout/);
  });

  it("carries the flag on every plan in the committed fallback", () => {
    // The fallback renders whenever the API is unreachable or untrusted. Missing
    // the field there would put every tier behind a sales conversation at
    // exactly the moment nobody is watching the API.
    for (const plan of fallback.plans) {
      expect(typeof (plan as { selfServeCheckout?: unknown }).selfServeCheckout).toBe("boolean");
    }
  });

  it("keeps the fallback agreeing with the product about which tiers sell", () => {
    const selling = fallback.plans.filter(
      (plan) => (plan as { selfServeCheckout?: boolean }).selfServeCheckout,
    );
    // At least one tier must be buyable, or the site cannot sell at all — the
    // failure a blanket `false` would produce, and the one direction the tests
    // above cannot catch on their own.
    expect(selling.length).toBeGreaterThan(0);
    expect(selling.length).toBeLessThan(fallback.plans.length);
  });
});
