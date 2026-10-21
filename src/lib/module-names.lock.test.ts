import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BRAND, MODULE_ORDER, MODULES } from "@/lib/brand";

/**
 * A module's brand name ("<brand> Payables") is typed once, in `MODULES`
 * (`src/lib/brand.ts`, itself proven against core by
 * `module-catalog-parity.test.ts`). Every title, card, link and sentence that
 * names a module reads it from there — `moduleName(key)` / `MODULES[key].name`
 * — so a rename in core reaches every page instead of the ones someone found.
 *
 * Scope: every non-test source file except `brand.ts`. Generated JSON (the
 * pricing fallback) is out of scope: core writes its names.
 */

const SRC = join(process.cwd(), "src");
// brand.ts reads every name from core and types none.
const HOME = join("lib", "brand.ts");
const NAMES = Object.values(MODULES).map((module) => module.name);
/** A brand name as typed in copy: any case, its words split by spaces, a line break or a non-breaking space. */
const TYPED_NAME = new RegExp(
  NAMES.map((name) =>
    name
      .split(/\s+/)
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("(?:\\s|&nbsp;|\\u00a0|\\{\" \"\\})+"),
  ).join("|"),
  "i",
);

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(tsx?|mjs)$/.test(file))
    .filter((file) => !/\.test\.tsx?$/.test(file))
    .filter((file) => file !== HOME);
}

describe("module names come from the brand registry, never from copy", () => {
  it("the detector catches a typed name and passes the template", () => {
    expect(TYPED_NAME.test(`title: "${BRAND.name} Payables — Structured payment approvals"`)).toBe(true);
    expect(TYPED_NAME.test("title: `${moduleName(\"pay\")} — Structured payment approvals`")).toBe(false);
    expect(TYPED_NAME.test(`the ${BRAND.name.toLowerCase()} payables module`)).toBe(true);
    expect(TYPED_NAME.test(`${BRAND.name}\n            Payables`)).toBe(true);
    expect(TYPED_NAME.test(`${BRAND.name}&nbsp;Payables`)).toBe(true);
    expect(TYPED_NAME.test(`${BRAND.name}{" "}Payables`)).toBe(true);
  });

  it("would have caught the files this lock was written for (proven on a pre-lock revision)", () => {
    // 3cd2885 is the branch point: product pages typed their own titles there.
    let old = "";
    try {
      old = execFileSync("git", ["show", "3cd2885:src/app/product/pay/page.tsx"], { encoding: "utf8" });
    } catch {
      return; // shallow clone without that commit — the fixture test above still holds
    }
    // That revision typed the brand of its day; the brand has been renamed
    // since, so put today's name in its place — the SHAPE is what is proven.
    expect(TYPED_NAME.test(old.replace(/\bAvrentis\b/g, BRAND.name))).toBe(true);
  });

  it("no file keeps its own list of modules", () => {
    // The product overview, homepage grid and docs index each once listed the
    // modules by hand (`moduleName("pay")`, `moduleName("procure")`, …) and all
    // three missed Authority. A list renders `publicModuleKeys()` and reads its
    // words from `MODULE_COPY`; naming one or two modules in a sentence is fine.
    const moduleKeys = MODULE_ORDER.join("|");
    const NAMED_KEY = new RegExp(`(?:moduleName\\(\\s*|\\bkey:\\s*)["'](${moduleKeys})["']`, "g");
    const keysNamedIn = (source: string) => new Set([...source.matchAll(NAMED_KEY)].map((match) => match[1]));
    // Both spellings of a hand list the site used to have:
    expect(keysNamedIn('{ key: "pay" }, { key: "procure" }, { key: "vault" }, { key: "audit" }').size).toBe(4);
    expect(keysNamedIn('moduleName("pay") moduleName("guard") moduleName("grants") moduleName("connect")').size).toBe(4);
    const offenders = sourceFiles().filter((file) => keysNamedIn(readFileSync(join(SRC, file), "utf8")).size >= 4);
    expect(offenders, "render publicModuleKeys() instead of naming modules one by one").toEqual([]);
  });

  it("no source file types a module's brand name", () => {
    const offenders = sourceFiles().filter((file) => TYPED_NAME.test(readFileSync(join(SRC, file), "utf8")));
    expect(offenders, "use moduleName(key) / MODULES[key].name from @/lib/brand").toEqual([]);
  });
});
