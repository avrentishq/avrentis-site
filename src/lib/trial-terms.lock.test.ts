import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PLAN_CATALOG, PLAN_ORDER } from "@avrentishq/core/billing/catalog";

/**
 * The trial's terms — its length, the grace after it, its seat cap and the plan
 * it runs on — are read from core through `@/lib/trial-terms`, never typed into
 * copy. A typed "30-day trial" is the copy that keeps promising the old terms
 * the day the product changes them.
 *
 * Scope: every non-test source file. The changelog is exempt on purpose — an
 * entry records what was true on its date, and rewriting history to today's
 * figure would be its own lie.
 */

const SRC = join(process.cwd(), "src");
const EXEMPT = new Set([
  join("lib", "trial-terms.ts"),
  join("lib", "market.ts"),
  join("components", "changelog", "changelog-page.tsx"),
]);

const PLAN_NAMES = PLAN_ORDER.map((key) => PLAN_CATALOG[key].name).join("|");

const TYPED_TERMS: { name: string; pattern: RegExp }[] = [
  { name: "a day count before 'trial'", pattern: /\b\d+[- ]day\b[^\n]{0,30}\btrial\b/i },
  { name: "a grace count after a trial", pattern: /\b\d+ days? after (?:your |the )?trial/i },
  { name: "a trial seat count", pattern: /\b\d+-seat\b/i },
  { name: "the trial plan's name", pattern: new RegExp(`\\b(?:${PLAN_NAMES}) (?:tier|features|trial)\\b`) },
  { name: "a typed no-card promise (NO_CARD_REQUIRED)", pattern: /\bno\s+(?:credit\s+)?card\b|\bcard\s+on\s+file\b/i },
  { name: "a typed setup time (TRIAL_SETUP_TIME)", pattern: /\b(?:under|less\s+than|within)\s+(?:\d+|one|two|three|five|ten|fifteen|twenty|thirty)\s+minutes?\b|\bsetup\s+in\s+minutes\b/i },
  { name: "the market typed out (MARKET_SCOPE)", pattern: /across Nigeria and Africa|Nigerian and African organisations|Pan-African platform/i },
];

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(tsx?|mjs)$/.test(file))
    .filter((file) => !/\.test\.tsx?$/.test(file))
    .filter((file) => !EXEMPT.has(file));
}

describe("trial terms come from core, never from copy", () => {
  it("the detectors catch typed terms", () => {
    const [dayCount, graceCount, seatCount, planNameDetector, noCard, setupTime, market] = TYPED_TERMS.map((term) => term.pattern);
    expect(dayCount!.test("Start your 30-day trial")).toBe(true);
    expect(dayCount!.test("30-DAY TRIAL")).toBe(true);
    expect(graceCount!.test("Data preserved for 30 days after trial end")).toBe(true);
    expect(seatCount!.test("a 5-seat pilot workspace")).toBe(true);
    expect(planNameDetector!.test("Full Business features on your own data")).toBe(true);
    expect(noCard!.test("No credit card required")).toBe(true);
    expect(noCard!.test("no card on file")).toBe(true);
    expect(setupTime!.test("Setup takes less than 10 minutes")).toBe(true);
    expect(setupTime!.test("in under two minutes")).toBe(true);
    // JSX wraps text across lines; the detectors read through the break.
    expect(noCard!.test("No credit\n          card.")).toBe(true);
    expect(setupTime!.test("within fifteen\n          minutes")).toBe(true);
    expect(market!.test("Organisations across Nigeria and Africa")).toBe(true);
    // And stay quiet on the interpolated form.
    expect(dayCount!.test("Start your {trialDays}-day trial")).toBe(false);
  });

  it("scans the trial pages (proves the walk sees them)", () => {
    expect(sourceFiles()).toContain(join("app", "trial", "trial-form.tsx"));
  });

  it("no source file types a trial term", () => {
    const offenders = sourceFiles().flatMap((file) => {
      const text = readFileSync(join(SRC, file), "utf8");
      return TYPED_TERMS.filter((term) => term.pattern.test(text)).map(
        (term) => `src/${file}: ${term.name}`,
      );
    });
    expect(offenders, "read it from @/lib/trial-terms instead").toEqual([]);
  });
});
