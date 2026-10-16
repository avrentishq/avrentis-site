import { describe, it, expect } from "vitest";
import { CURRENCIES, SUPPORTED_CURRENCY_CODES } from "@avrentishq/core/money/types";
import { LOCALES } from "@avrentishq/core/locales";
import {
  INTERFACE_LANGUAGE_NAMES,
  SUPPORTED_CURRENCY_COUNT,
  SUPPORTED_CURRENCY_NAMES,
} from "./languages-and-currencies";

describe("languages and currencies read from core", () => {
  it("names every currency core supports", () => {
    expect(SUPPORTED_CURRENCY_COUNT).toBe(SUPPORTED_CURRENCY_CODES.length);
    for (const code of SUPPORTED_CURRENCY_CODES) {
      expect(SUPPORTED_CURRENCY_NAMES).toContain(CURRENCIES[code].name);
    }
  });

  it("names every interface language in words, never as a bare code", () => {
    expect(INTERFACE_LANGUAGE_NAMES.split(/, | and /)).toHaveLength(LOCALES.length);
    for (const locale of LOCALES) {
      expect(INTERFACE_LANGUAGE_NAMES).not.toMatch(new RegExp(`\\b${locale}\\b`));
    }
    expect(INTERFACE_LANGUAGE_NAMES).toContain("English");
  });
});
