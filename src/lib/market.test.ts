import { describe, expect, it } from "vitest";

import { accountingConnectionViolations, recordKeepingViolations } from "@avrentishq/core/brand/copy-guardrails";

import { MARKET_NEED, MARKET_SCOPE, MARKET_STATEMENT } from "./market";

describe("the market statement", () => {
  it("is composed from the lead market, never typed", () => {
    expect(MARKET_STATEMENT).toBe(`Built for ${MARKET_SCOPE} ${MARKET_NEED}.`);
  });

  it("keeps the claims rules (no 'permanent record')", () => {
    expect(recordKeepingViolations(MARKET_STATEMENT)).toEqual([]);
    expect(accountingConnectionViolations(MARKET_STATEMENT)).toEqual([]);
  });
});
