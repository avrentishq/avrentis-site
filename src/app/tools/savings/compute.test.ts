import { describe, it, expect } from "vitest";
import { computeSavings, clampInt, BOUNDS } from "./compute";

describe("savings compute (money path)", () => {
  it("computes the documented defaults", () => {
    const r = computeSavings({ approvals: 120, minutes: 25, cost: 5000 });
    expect(Math.round(r.hoursPerMonth)).toBe(30);
    expect(Math.round(r.hoursPerYear)).toBe(360);
    expect(Math.round(r.nairaPerYear)).toBe(1_800_000);
  });

  it("clamps out-of-range and non-numeric input", () => {
    expect(clampInt("abc", BOUNDS.approvals)).toBe(BOUNDS.approvals.min);
    expect(clampInt(9_999_999, BOUNDS.minutes)).toBe(BOUNDS.minutes.max);
    expect(clampInt(-5, BOUNDS.cost)).toBe(BOUNDS.cost.min);
    expect(clampInt("40", BOUNDS.minutes)).toBe(40);
  });
});
