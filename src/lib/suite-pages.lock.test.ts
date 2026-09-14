import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { SUITES, moduleSuite, isModulePublic, MODULE_ORDER, moduleName } from "./brand";
import { SUITE_PAGES, SUITE_NAV, suiteModuleKeys } from "./product-suites";

/**
 * The navigation lists four suites and nothing else. That makes each suite page
 * the ONLY route to the modules inside it, so the failure this locks is a
 * navigational dead end: a suite in the catalogue with no page, or a module in a
 * suite whose page has no words for it.
 *
 * Neither fails loudly on its own. A missing page is a 404 reached only by
 * clicking the nav; a missing blurb renders as a card that silently isn't there,
 * so the module simply stops being mentioned anywhere a visitor can reach. Both
 * would ship green.
 *
 * The module pages themselves are NOT re-checked here — `sitemap.test.ts`
 * already holds those, and duplicating it would mean two tests to update for one
 * change.
 */

const APP_DIR = join(process.cwd(), "src", "app", "product");

describe("suite pages", () => {
  it("gives every suite in the catalogue a route", () => {
    for (const suite of SUITES) {
      expect(
        existsSync(join(APP_DIR, suite.key, "page.tsx")),
        `src/app/product/${suite.key}/page.tsx is missing — the nav links to it`,
      ).toBe(true);
    }
  });

  it("gives every suite copy to render", () => {
    for (const suite of SUITES) {
      const config = SUITE_PAGES[suite.key];
      expect(config, `SUITE_PAGES.${suite.key}`).toBeDefined();
      expect(config.headline.trim()).toBeTruthy();
      expect(config.description.trim()).toBeTruthy();
      expect(config.metaDescription.trim()).toBeTruthy();
      // Three shared points is the design; fewer reads as an afterthought.
      expect(config.shared.length, `${suite.key} shared points`).toBeGreaterThanOrEqual(2);
    }
  });

  it("gives every public module a block on its suite page", () => {
    for (const key of MODULE_ORDER) {
      if (!isModulePublic(key)) continue;
      const suite = moduleSuite(key);
      const blurb = SUITE_PAGES[suite].modules[key];
      expect(
        blurb,
        `${moduleName(key)} sits in the ${suite} suite but that page has no copy for it — ` +
          "it would be unreachable from the navigation",
      ).toBeDefined();
      expect(blurb!.claim.trim()).toBeTruthy();
      expect(blurb!.body.trim()).toBeTruthy();
    }
  });

  it("writes no copy for a module the site does not market", () => {
    // Requests is deliberately not public. Copy for it here would be dead text
    // that quietly becomes live the day the flag flips, unreviewed.
    for (const suite of SUITES) {
      for (const key of Object.keys(SUITE_PAGES[suite.key].modules)) {
        expect(
          isModulePublic(key),
          `${key} has suite copy but is not publiclyVisible`,
        ).toBe(true);
      }
    }
  });

  it("points the nav at the pages that exist", () => {
    expect(SUITE_NAV.map((s) => s.href)).toEqual(SUITES.map((s) => `/product/${s.key}`));
    for (const entry of SUITE_NAV) {
      expect(entry.label.trim()).toBeTruthy();
      expect(entry.desc.trim()).toBeTruthy();
    }
  });

  it("proves the file probe actually looks at the filesystem", () => {
    // `existsSync` against a wrong base path returns false for everything, which
    // would make the first test vacuous in the opposite direction — it would
    // fail. This asserts the inverse: a name that is NOT a suite has no page,
    // so the probe is reading a real directory rather than answering true.
    expect(existsSync(join(APP_DIR, "treasury", "page.tsx"))).toBe(false);
    expect(existsSync(join(APP_DIR, "page.tsx"))).toBe(true);
  });

  it("leaves no suite with nothing to show", () => {
    for (const suite of SUITES) {
      expect(suiteModuleKeys(suite.key).length, `${suite.key} has no public modules`)
        .toBeGreaterThan(0);
    }
  });
});
