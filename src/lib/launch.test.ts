import { describe, it, expect } from "vitest";
import {
  HIDDEN_AT_LAUNCH,
  isLaunchHidden,
  isLaunchVisible,
} from "@/lib/launch";

describe("launch gate", () => {
  // Derived from HIDDEN_AT_LAUNCH, not a hardcoded route list. The previous
  // version asserted `/product/integrations` was hidden; PR #57 deliberately
  // un-hid it (the catalogue was made claim-accurate and published) and the test
  // was left behind, so it failed on main. Re-enabling a page is meant to be a
  // ONE-line deletion from the list — a test that names routes independently
  // turns that into a two-file edit and then rots. This asserts the BEHAVIOUR of
  // the gate over whatever the list currently holds.
  it("hides every listed route, and its sub-paths", () => {
    expect(
      HIDDEN_AT_LAUNCH.length,
      "expected ≥1 hidden route to police",
    ).toBeGreaterThan(0);
    for (const route of HIDDEN_AT_LAUNCH) {
      expect(isLaunchHidden(route), route).toBe(true);
      expect(isLaunchVisible(route), route).toBe(false);
      expect(isLaunchHidden(`${route}/some-child`), `${route}/some-child`).toBe(
        true,
      );
    }
  });

  it("shows anything not listed", () => {
    for (const route of [
      "/",
      "/trial",
      "/pricing",
      "/product/pay",
      "/product/integrations",
    ]) {
      expect(isLaunchVisible(route), route).toBe(true);
      expect(isLaunchHidden(route), route).toBe(false);
    }
  });

  it("does not hide a route that merely shares a prefix with a hidden one", () => {
    // `/docs` is hidden; `/docsomething` must not be caught by a naive
    // startsWith. Guards the `path.startsWith(hidden + "/")` boundary.
    for (const route of HIDDEN_AT_LAUNCH) {
      expect(isLaunchHidden(`${route}something`), `${route}something`).toBe(
        false,
      );
    }
  });
});
