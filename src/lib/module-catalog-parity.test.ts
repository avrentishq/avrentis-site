import { describe, it, expect } from "vitest";
import { MODULE_CATALOG, SUITE_ORDER } from "@avrentishq/core/modules/catalog";

import { MODULES, MODULE_ORDER, SUITES } from "./brand";

/**
 * The marketing catalogue must agree with the product's.
 *
 * `src/lib/brand.ts` keeps its OWN module list on purpose: the site ships one
 * slice of core (`core/brand` — the wordmark, the fonts) and nothing from
 * `modules`, so a core release that does not touch branding changes nothing here
 * beyond a pin. See RELEASING.md in avrentis-core.
 *
 * The cost of that independence is a mirror, and a mirror rots silently: the
 * product renamed `people` from "Avrentis HR" to "Avrentis Requests" months
 * before this file existed, and nothing anywhere would have said so. A visitor
 * reading one name on avrentis.com and another inside the product has been told
 * two different things about the same purchase.
 *
 * So the mirror stays at RUNTIME and this test does the importing. It is the
 * only place the site reads core's module catalogue, and it runs in the
 * release fan-out's `verify` list, which means a core bump that renames a module
 * or moves it between suites fails the site's own PR rather than shipping.
 *
 * WHAT IS AND IS NOT PINNED. Names and suites must match exactly — those are the
 * product's to decide. `classification` is NOT compared: the site's vocabulary
 * is deliberately different (it adds `universal` for the approval engine, which
 * core calls substrate). `publiclyVisible` is the site's alone — which modules it
 * chooses to lead with is a marketing decision, not a product fact.
 */

describe("marketing module catalogue ↔ core", () => {
  it("names every module exactly as the product does", () => {
    for (const key of MODULE_ORDER) {
      expect(MODULES[key].name, `brand.ts name for ${key}`).toBe(MODULE_CATALOG[key].name);
    }
  });

  it("puts every module in the suite the product puts it in", () => {
    for (const key of MODULE_ORDER) {
      expect(MODULES[key].suite, `brand.ts suite for ${key}`).toBe(MODULE_CATALOG[key].suite);
    }
  });

  it("lists the suites core declares, in core's order", () => {
    expect(SUITES.map((s) => s.key)).toEqual([...SUITE_ORDER]);
  });

  it("gives every suite a label and a blurb", () => {
    for (const suite of SUITES) {
      expect(suite.label.trim(), `${suite.key} label`).toBeTruthy();
      expect(suite.blurb.trim(), `${suite.key} blurb`).toBeTruthy();
    }
  });

  it("models only modules core actually has", () => {
    // The site does not model `foundation` (hidden plumbing) or `intelligence`
    // (unreleased) — a subset is fine, an INVENTED key is not.
    for (const key of MODULE_ORDER) {
      expect(MODULE_CATALOG, `core has no module "${key}"`).toHaveProperty(key);
    }
  });

  it("proves the comparison can fail", () => {
    // Guard against a vacuous pass: if MODULE_ORDER were empty, every loop above
    // would pass having compared nothing at all.
    expect(MODULE_ORDER.length).toBeGreaterThan(5);
    expect(MODULES.pay.name).not.toBe(MODULE_CATALOG.vault.name);
  });
});
