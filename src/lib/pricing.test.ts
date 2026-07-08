import { describe, it, expect } from "vitest";
import { formatCurrencyAmount, formatBytes, formatRetention } from "@/lib/pricing";

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
