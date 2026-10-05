import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { planNames, formatPlanList, type PricingData } from "@/lib/pricing";
import { formatCurrencyAmount } from "@/lib/money";
import {
  documentLimitLine,
  retentionAdjective,
  retentionLimitLine,
  storageLimitLine,
  userLimitLine,
} from "@/lib/plan-limits";
import fallback from "@/data/pricing-fallback.json";
import { PLAN_ORDER } from "@avrentishq/core/billing/catalog";
import { softwareApplicationSchema } from "@/lib/seo";

describe("pricing formatters (money path feeding the UI + JSON-LD)", () => {
  it("formats known currencies with their symbol", () => {
    expect(formatCurrencyAmount(583333, "NGN")).toBe("₦583,333");
    expect(formatCurrencyAmount(0, "USD")).toBe("$0");
    expect(formatCurrencyAmount(1000, "GBP")).toBe("£1,000");
  });

  it("falls back to the code for unknown currencies", () => {
    expect(formatCurrencyAmount(1000, "XYZ")).toBe("XYZ 1,000");
  });

  it("rounds to whole units and never groups by the visitor's locale", () => {
    expect(formatCurrencyAmount(583333.4, "NGN")).toBe("₦583,333");
    expect(formatCurrencyAmount(3000000, "NGN")).toBe("₦3,000,000");
  });
});

describe("limit lines are formatted from the numbers (0 = unlimited)", () => {
  it("formats seats and documents", () => {
    expect(userLimitLine(10)).toBe("Up to 10 users");
    expect(userLimitLine(0)).toBe("Unlimited users");
    expect(documentLimitLine(0)).toBe("Unlimited documents");
    expect(documentLimitLine(200)).toBe("200 documents/month");
  });

  it("writes storage in the binary unit it is counted in", () => {
    expect(storageLimitLine(10 * 1024 ** 3)).toBe("10 GiB storage");
    expect(storageLimitLine(0)).toBe("Unlimited storage");
    expect(storageLimitLine(null)).toBe("Unlimited storage");
  });

  it("formats retention as a line and as an adjective", () => {
    expect(retentionLimitLine(2555)).toBe("7 years retention");
    expect(retentionLimitLine(365)).toBe("1 year retention");
    expect(retentionLimitLine(90)).toBe("90 days retention");
    expect(retentionLimitLine(0)).toBe("Unlimited retention");
    expect(retentionAdjective(2555)).toBe("7-year");
    expect(retentionAdjective(0)).toBeNull();
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

  it("types no plan key at all — the featured tier is core's recommended plan", () => {
    // `FEATURED_PLAN = "business"` and `find((p) => p.key === "business")` (the
    // trial chip) were the other two tier literals in this file.
    for (const key of PLAN_ORDER) {
      expect(pricingSource).not.toMatch(new RegExp(`["'\`]${key}["'\`]`));
    }
    expect(pricingSource).toMatch(/PLAN_CATALOG\[key\]\.recommended/);
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

describe("plan names come from the pricing data, in plan order", () => {
  const data = fallback as unknown as PricingData;

  it("lists every plan, and only the plans carrying a feature", () => {
    expect(planNames(data)).toEqual(data.planOrder.map((key) => data.plans.find((plan) => plan.key === key)!.name));
    const withSso = planNames(data, "sso");
    expect(withSso.length).toBeGreaterThan(0);
    expect(withSso.length).toBeLessThan(data.plans.length);
    for (const name of withSso) {
      expect(data.plans.find((plan) => plan.name === name)!.features.sso).toBe(true);
    }
    expect(planNames(data, "no-such-feature")).toEqual([]);
  });

  it("joins names the way a sentence reads", () => {
    expect(formatPlanList(["Enterprise"])).toBe("Enterprise");
    expect(formatPlanList(["Business", "Enterprise"])).toBe("Business and Enterprise");
    expect(formatPlanList(["Starter", "Business", "Enterprise"])).toBe("Starter, Business and Enterprise");
  });
});

describe("the SoftwareApplication offer is priced from the served currency", () => {
  it("renders an offer from the price list's own currency, self-serve plans only", () => {
    const data = fallback as unknown as PricingData;
    const offer = softwareApplicationSchema(data).offers as Record<string, unknown> | undefined;
    // It looked for USD only, so with a naira-only price list it never rendered.
    expect(offer).toBeDefined();
    const currency = data.plans[0]!.pricing[0]!.currency;
    const selfServe = data.plans
      .filter((plan) => plan.selfServeCheckout)
      .map((plan) => plan.pricing.find((price) => price.currency === currency)!.monthly);
    expect(offer).toMatchObject({
      priceCurrency: currency,
      lowPrice: Math.min(...selfServe),
      highPrice: Math.max(...selfServe),
      offerCount: selfServe.length,
    });
  });
});
