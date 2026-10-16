import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { amountInWords, currencySymbol, formatCount, formatCurrencyAmount, toMinorUnits } from "@/lib/money";

describe("money and count display", () => {
  it("prints an amount through core's formatter, rounded to whole units", () => {
    expect(formatCurrencyAmount(1_500_000.4, "NGN")).toBe("₦1,500,000");
  });

  it("groups a count the same way whatever the visitor's language", () => {
    expect(formatCount(1234.6)).toBe("1,235");
    expect(formatCount(10000)).toBe("10,000");
  });

  it("converts to minor units through core's minor-unit table, never a literal 100", () => {
    expect(toMinorUnits(850_000, "NGN")).toBe(85_000_000);
    expect(toMinorUnits(1_000, "XOF")).toBe(1_000);
    expect(() => toMinorUnits(1, "XYZ")).toThrow(RangeError);
  });

  it("writes an amount in words with core's unit name", () => {
    expect(amountInWords(850_000, "NGN")).toBe("eight hundred and fifty thousand Naira");
  });

  it("names a currency's symbol from core, and an unknown one by its code", () => {
    expect(currencySymbol("NGN")).toBe("₦");
    expect(currencySymbol("XYZ")).toBe("XYZ");
  });
});

/**
 * A bare `toLocaleString()` groups digits by the VISITOR's browser language, so
 * the server render and a French browser print different figures for the same
 * number. Every number on the site goes through `@/lib/money` instead.
 */
describe("no number is formatted by the browser's language", () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts")) files.push(path);
    }
  };
  walk(join(process.cwd(), "src"));

  it("finds the source files it checks", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it("has no bare toLocaleString() call", () => {
    const offenders = files.filter((file) => /\.toLocaleString\(\s*\)/.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });
});
