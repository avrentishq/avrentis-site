import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MODULES } from "@/lib/brand";

/**
 * A module's brand name ("Avrentis Payables") is typed once, in `MODULES`
 * (`src/lib/brand.ts`, itself proven against core by
 * `module-catalog-parity.test.ts`). Every title, card, link and sentence that
 * names a module reads it from there — `moduleName(key)` / `MODULES[key].name`
 * — so a rename in core reaches every page instead of the ones someone found.
 *
 * Scope: every non-test source file except `brand.ts`. Generated JSON (the
 * pricing fallback) is out of scope: core writes its names.
 */

const SRC = join(process.cwd(), "src");
const HOME = join("lib", "brand.ts");
const NAMES = Object.values(MODULES).map((module) => module.name);
const TYPED_NAME = new RegExp(NAMES.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"));

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(tsx?|mjs)$/.test(file))
    .filter((file) => !/\.test\.tsx?$/.test(file))
    .filter((file) => file !== HOME);
}

describe("module names come from the brand registry, never from copy", () => {
  it("the detector catches a typed name and passes the template", () => {
    expect(TYPED_NAME.test('title: "Avrentis Payables — Structured payment approvals"')).toBe(true);
    expect(TYPED_NAME.test("title: `${moduleName(\"pay\")} — Structured payment approvals`")).toBe(false);
  });

  it("would have caught the files this lock was written for (proven on a pre-lock revision)", () => {
    // 3cd2885 is the branch point: product pages typed their own titles there.
    let old = "";
    try {
      old = execFileSync("git", ["show", "3cd2885:src/app/product/pay/page.tsx"], { encoding: "utf8" });
    } catch {
      return; // shallow clone without that commit — the fixture test above still holds
    }
    expect(TYPED_NAME.test(old)).toBe(true);
  });

  it("no source file types a module's brand name", () => {
    const offenders = sourceFiles().filter((file) => TYPED_NAME.test(readFileSync(join(SRC, file), "utf8")));
    expect(offenders, "use moduleName(key) / MODULES[key].name from @/lib/brand").toEqual([]);
  });
});
