import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { MODULE_ORDER, MODULES } from "@/lib/brand";

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

  it("every page takes planAvailability as a prop", () => {
    const missing = modulePageFiles().filter((file) => {
      const source = readFileSync(join(process.cwd(), PAGES_DIR, file), "utf8");
      // Whitespace-collapsed, and tolerant of the trailing comma/semicolon a
      // formatter adds when it breaks this signature across lines. A lock test
      // that fails on reformatting is noise, and noise gets deleted.
      const flat = source.replace(/\s+/g, " ");
      return !/planAvailability,? \}: \{ planAvailability: ModulePlan\[\];? \}/.test(flat);
    });

    expect(
      missing,
      `These pages neither derive nor receive plan availability:\n` +
        missing.map((f) => `  ${PAGES_DIR}/${f}`).join("\n"),
    ).toEqual([]);
  });

  it("every product route feeds the derivation", () => {
    // A page taking the prop is only half the wiring — the route must supply it
    // from live pricing data, not from a literal at the call site.
    const routesDir = join(process.cwd(), "src/app/product");
    const slugs = readdirSync(routesDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    const wired = slugs.filter((slug) => {
      const source = readFileSync(join(routesDir, slug, "page.tsx"), "utf8");
      return source.includes("planAvailabilityFor(");
    });

    // Derived from the module catalog, not listed here: a hardcoded expectation
    // in the test that polices hardcoding is the same bug wearing a lab coat.
    // Every module in the catalog owns a /product/<slug> route (including the
    // ones hidden from nav, which are launch-gated rather than absent);
    // /security, /how-it-works and /integrations are narrative pages, not modules.
    expect(wired.sort()).toEqual(MODULE_ORDER.map((key) => MODULES[key].slug).sort());
  });
});
