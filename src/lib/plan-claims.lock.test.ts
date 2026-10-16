import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Which plans a capability is on is the pricing API's fact, not the copy's.
 *
 * Module cards used to say "Available on Business and Enterprise" by matching
 * their own title text, and "Included on every plan." was typed into card
 * bodies — one of which named a capability (vendor compliance) the entry plan
 * does not carry. A card now carries `planFeature` (the layout names the plans
 * from the API) or `everyPlan` (the one shared wording, `EVERY_PLAN_NOTE`).
 */

const SRC = join(process.cwd(), "src");
const HOME = join("lib", "plan-names.ts");
const MODULE_PAGES = join("components", "product", "pages");

/** Source with comments removed, so a code comment explaining the rule is not a violation. */
function code(file: string): string {
  return readFileSync(join(SRC, file), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file));
}

describe("plan scope comes from the pricing API, never from copy", () => {
  it("the scan sees the module pages", () => {
    expect(sourceFiles().filter((file) => file.startsWith(MODULE_PAGES)).length).toBeGreaterThanOrEqual(8);
  });

  it("only plan-names.ts writes the every-plan sentence", () => {
    expect(/Included on every plan/.test('body: "… Included on every plan."')).toBe(true);
    const offenders = sourceFiles().filter((file) => file !== HOME && /Included on every plan/.test(code(file)));
    expect(offenders, "tag the card everyPlan: true instead").toEqual([]);
  });

  it("no module page names plans in its own words", () => {
    const TYPED_SCOPE = /\b(?:every plan|all plans|every tier|Available on [A-Z])/i;
    const offenders = sourceFiles()
      .filter((file) => file.startsWith(MODULE_PAGES))
      .filter((file) => TYPED_SCOPE.test(code(file)));
    expect(offenders, "tag the card planFeature: <key> and let the layout name the plans").toEqual([]);
  });
});
