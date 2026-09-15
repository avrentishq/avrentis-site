import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, it, expect } from "vitest";

import {
  DEPENDENCY_SECURITY_FLOORS,
  diffDependencyFloors,
} from "@avrentishq/core/security/dependency-floors";

/**
 * Parity lock for transitive dependency security floors.
 *
 * ── WHY THIS REPO GOT ONE LAST ─────────────────────────────────────────────
 *
 * The canonical list lives in core. pnpm cannot inherit `overrides` from a
 * dependency, so every consumer must physically materialise it — that
 * duplication is forced by the package manager. What is NOT forced is letting
 * the copies drift, and this site is the proof of what happens without a test:
 * avrentis-app and avrentis-admin have carried this lock for a while; this repo
 * had eight ad-hoc overrides of its own, in caret syntax, matching nothing.
 *
 * It was also ten core releases behind with Dependabot alerts switched OFF, so
 * nothing was reporting. A local `pnpm audit` found ten advisories, two of them
 * critical unauthenticated remote code execution. Being the repo with no map
 * and no detector is why it drifted furthest, not bad luck.
 *
 * A comment saying "keep in sync" is drift management. This test is drift
 * elimination: add a floor to core and this fails until it is materialised here.
 *
 * ── WHAT PASSES AND WHAT DOES NOT ──────────────────────────────────────────
 *
 * `extra` entries — a floor here that core does not carry — are ALLOWED and
 * reported, because this repo may legitimately need one the others do not. What
 * must never pass is a MISSING or WEAKER floor from the shared set.
 *
 * Note the direction that bites: this repo previously overrode js-yaml to
 * `^5.2.2`, forcing it UP across a major that nothing here asked for
 * (@eslint/eslintrc requests 4.x). An override can walk a dependency in either
 * direction, and "we pinned it higher" is not automatically safer — it is just
 * unreviewed.
 */

const overrides = (() => {
  const packageJson = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
    pnpm?: { overrides?: Record<string, string> };
  };
  return packageJson.pnpm?.overrides ?? {};
})();

describe("pnpm.overrides matches core's canonical dependency floors", () => {
  it("materialises every canonical floor at or above the canonical version", () => {
    const { missing, mismatched } = diffDependencyFloors(overrides);

    expect(
      { missing, mismatched },
      [
        "pnpm.overrides has drifted from @avrentishq/core/security/dependency-floors.",
        missing.length ? `MISSING: ${missing.join(", ")}` : "",
        mismatched.length
          ? `MISMATCHED: ${mismatched
              .map((entry) => `${entry.name} expected ${entry.expected}, found ${entry.actual}`)
              .join("; ")}`
          : "",
        "Copy the canonical entries into package.json's pnpm.overrides, reinstall,",
        "and confirm the LOCKFILE actually moved — an override in the wrong place",
        "is silently ignored, so verify by resolution rather than by placement.",
      ]
        .filter(Boolean)
        .join("\n"),
    ).toEqual({ missing: [], mismatched: [] });
  });

  it("is scanning a real map, not an empty one", () => {
    // Detector-live check: an empty map or an empty overrides block would make
    // the assertion above pass while examining nothing.
    expect(Object.keys(DEPENDENCY_SECURITY_FLOORS).length).toBeGreaterThan(20);
    expect(Object.keys(overrides).length).toBeGreaterThan(20);
  });
});
