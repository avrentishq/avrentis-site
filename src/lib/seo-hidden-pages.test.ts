import { describe, expect, it } from "vitest";

import { HIDDEN_AT_LAUNCH } from "@/lib/launch";
import { NOT_FOUND_TITLE, pageMetadata, pageTitle } from "@/lib/seo";
import { SITE_ROUTES } from "@/lib/routes";

/**
 * A page hidden for launch renders the not-found page, so its tab must say so —
 * never its real name beside a "this page isn't here" screen.
 */
describe("metadata of pages hidden for launch", () => {
  const input = (path: string) => ({ path, title: "Real name", description: "Real description" });

  it("every hidden page takes the not-found title and stays out of search", () => {
    expect(HIDDEN_AT_LAUNCH.length).toBeGreaterThan(0);
    for (const path of HIDDEN_AT_LAUNCH) {
      const metadata = pageMetadata(input(path));
      expect(metadata.title, path).toBe(pageTitle(NOT_FOUND_TITLE));
      expect(metadata.robots, path).toEqual({ index: false, follow: false });
    }
  });

  it("a visible page keeps its own title", () => {
    expect(pageMetadata(input(SITE_ROUTES.pricing)).title).toBe(pageTitle("Real name"));
  });
});
