import { describe, expect, it } from "vitest";
import { COUNTRY_CODES } from "@avrentishq/core/region/countries";

import { COUNTRIES, SERVED_COUNTRIES, isSelectableCountry, isServedCountry } from "./countries";

describe("trial-form countries", () => {
  it("offers every country core sets up, first", () => {
    const leading = COUNTRIES.slice(0, COUNTRY_CODES.length).map((c) => c.code).sort();
    expect(leading).toEqual([...COUNTRY_CODES].sort());
    expect(SERVED_COUNTRIES).toHaveLength(COUNTRY_CODES.length);
    for (const code of COUNTRY_CODES) expect(isServedCountry(code)).toBe(true);
  });

  it("lists each country once", () => {
    const codes = COUNTRIES.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("accepts only offered codes", () => {
    expect(isSelectableCountry("NG")).toBe(true);
    expect(isSelectableCountry("KE")).toBe(true);
    expect(isServedCountry("KE")).toBe(false);
    expect(isSelectableCountry("ZZ")).toBe(false);
    expect(isSelectableCountry("ng")).toBe(false);
  });
});
