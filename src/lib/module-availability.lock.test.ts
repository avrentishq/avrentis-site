import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { MODULE_ORDER } from "@/lib/brand";

/**
 * Plan inclusion must stay DERIVED. Two of the eight product module pages had
 * drifted against the platform while each carried its own hand-written
 * `planAvailability` array — one under-claiming Records on Starter, one
 * over-claiming Compliance on Starter. Deriving it fixed both; this test is
 * what stops the next person re-introducing the hardcode a page at a time.
 *
 * The failure mode is silent and customer-facing: nothing crashes, the page
 * renders, and the only symptom is a prospect being told the wrong thing about
 * what they are buying. There is no test that would otherwise catch it, because
 * a hardcoded array is perfectly valid TypeScript.
 */
const PAGES_DIR = "src/components/product/pages";

function modulePageFiles(): string[] {
  return readdirSync(join(process.cwd(), PAGES_DIR)).filter((f) =>
    f.endsWith("-module-page.tsx"),
  );
}

describe("product module pages — plan availability stays derived", () => {
  it("finds the module pages at all (proves the scan can see a known case)", () => {
    // A negative result from a glob that matched nothing is not evidence.
    const files = modulePageFiles();
    expect(files.length).toBeGreaterThanOrEqual(8);
    expect(files).toContain("vault-module-page.tsx");
  });

  it("no page declares its own planAvailability array", () => {
    const offenders = modulePageFiles().filter((file) => {
      const source = readFileSync(join(process.cwd(), PAGES_DIR, file), "utf8");
      return /planAvailability:\s*\[/.test(source);
    });

    expect(
      offenders,
      `These pages hardcode plan inclusion instead of deriving it from the ` +
        `pricing API. Delete the array and let the route pass ` +
        `planAvailabilityFor(<moduleKey>, pricingData):\n` +
        offenders.map((f) => `  ${PAGES_DIR}/${f}`).join("\n"),
    ).toEqual([]);
  });

  it("every page takes the derived page data and hands it to the layout", () => {
    const missing = modulePageFiles().filter((file) => {
      const flat = readFileSync(join(process.cwd(), PAGES_DIR, file), "utf8").replace(/\s+/g, " ");
      return !/ModulePage\(data: ModulePageData\)/.test(flat) || !/<ProductModuleLayout [^>]*\{\.\.\.data\}/.test(flat);
    });
    expect(
      missing,
      `These pages neither receive ModulePageData nor pass it on:\n` +
        missing.map((f) => `  ${PAGES_DIR}/${f}`).join("\n"),
    ).toEqual([]);
  });

  it("every product route builds it from live pricing data", () => {
    // A page taking the prop is only half the wiring — the route must supply it
    // from the pricing API, not from a literal at the call site. Derived from the
    // module catalog, not listed here: a hardcoded expectation in the test that
    // polices hardcoding is the same bug wearing a lab coat.
    const routesDir = join(process.cwd(), "src/app/product");
    const unwired = MODULE_ORDER.filter((moduleKey) => {
      const source = readFileSync(join(routesDir, moduleKey, "page.tsx"), "utf8");
      return !source.includes(`modulePageData("${moduleKey}", pricingData)`);
    });
    expect(unwired).toEqual([]);
  });

  it("every module route 404s when its module is hidden", () => {
    // The visibility flag is the one switch; a route that forgets to ask it is
    // served while every list hides it.
    const routesDir = join(process.cwd(), "src/app/product");
    const unguarded = MODULE_ORDER.filter((moduleKey) => {
      const source = readFileSync(join(routesDir, moduleKey, "page.tsx"), "utf8");
      return !source.includes(`notFoundUnlessPublic("${moduleKey}")`);
    });
    expect(unguarded, "routes missing notFoundUnlessPublic(<their own key>)").toEqual([]);
  });
});
