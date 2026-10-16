import { describe, it, expect } from "vitest";
import { MODULE_CATALOG, MODULE_ORDER as CORE_MODULE_ORDER, SUITE_ORDER } from "@avrentishq/core/modules/catalog";

import { MODULES, MODULE_ORDER, SUITES, UNMODELLED_MODULE_KEYS, publicModuleKeys } from "./brand";

/**
 * The marketing catalogue must cover the product's — in both directions.
 *
 * `src/lib/brand.ts` reads each module's name, short name, suite and maturity
 * from core's catalogue, so those cannot drift. What can still go wrong is
 * COVERAGE: the site used to keep its own list and only checked that its keys
 * existed in core, so a module core released would never have been noticed.
 * The type `ModuleKey` already forces a new core key to be modelled or listed
 * as unmodelled; these tests hold the runtime half of that promise.
 */

describe("marketing module catalogue ↔ core", () => {
  it("orders every modelled module exactly once", () => {
    expect([...MODULE_ORDER].sort()).toEqual(Object.keys(MODULES).sort());
    expect(new Set(MODULE_ORDER).size).toBe(MODULE_ORDER.length);
  });

  it("accounts for every module core has", () => {
    const covered = new Set<string>([...MODULE_ORDER, ...UNMODELLED_MODULE_KEYS]);
    for (const key of Object.keys(MODULE_CATALOG)) {
      expect(covered.has(key), `core module "${key}" is neither modelled nor listed as unmodelled`).toBe(true);
    }
  });

  it("leaves out only modules a tenant cannot be sold", () => {
    // The moment core releases `intelligence`, this fails: the site must then
    // decide whether to market it, instead of silently never mentioning it.
    for (const key of UNMODELLED_MODULE_KEYS) {
      const entry = MODULE_CATALOG[key];
      const tenantVisible = (CORE_MODULE_ORDER as readonly string[]).includes(key) && !entry.uiHidden;
      expect(tenantVisible && entry.maturity === "ga", `"${key}" is released — model it in brand.ts`).toBe(false);
    }
  });

  it("names and groups modules exactly as core does", () => {
    for (const key of MODULE_ORDER) {
      expect(MODULES[key].name).toBe(MODULE_CATALOG[key].name);
      expect(MODULES[key].shortName).toBe(MODULE_CATALOG[key].sidebarLabel);
      expect(MODULES[key].suite).toBe(MODULE_CATALOG[key].suite);
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

  it("proves the comparison can fail", () => {
    // Guard against a vacuous pass: an empty order would satisfy every loop.
    expect(MODULE_ORDER.length).toBeGreaterThan(5);
    expect(publicModuleKeys().length).toBeGreaterThan(5);
    expect(MODULES.pay.name).not.toBe(MODULE_CATALOG.vault.name);
  });
});
