import { describe, it, expect } from "vitest";

import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/seo";
import { moduleHref, suiteHref, SUITES } from "@/lib/brand";
import { isLaunchHidden } from "@/lib/launch";
import { SITE_ROUTES } from "@/lib/routes";
import { chromeLinks } from "@/lib/site-nav";

/**
 * Drift guard for indexing. The bug this prevents: a page ships, gets linked
 * from the navbar or footer, and nobody adds it to the sitemap — so it is
 * publicly reachable but never indexed. /product/integrations sat that way.
 *
 * Both sides are the real thing: the links every piece of chrome renders
 * (`site-nav.ts` — the desktop bar, mobile menu and footer read nothing else)
 * and the sitemap's own output. An earlier version scraped two of the three
 * menus with a regex and rebuilt the sitemap by hand, missing the mobile menu,
 * inline `href="…"` links and the suite pages.
 */

/** Internal routes intentionally kept out of the sitemap, with the reason. */
const INTENTIONALLY_ABSENT: Record<string, string> = {
  [SITE_ROUTES.status]: "redirects to an external status page; sitemaps must not list redirects",
  [SITE_ROUTES.features]: "redirects to /product",
};

function sitemapPaths(): string[] {
  return sitemap().map((entry) => {
    const path = entry.url.slice(SITE_URL.length);
    return path === "" ? SITE_ROUTES.home : path;
  });
}

function linkedInternalPaths(): string[] {
  return [
    ...new Set(
      chromeLinks()
        .map((link) => link.href)
        .filter((href) => href.startsWith("/"))
        .map((href) => href.split("#")[0]!),
    ),
  ];
}

describe("sitemap", () => {
  it("sees the chrome's links (guards against a vacuous pass)", () => {
    const linked = linkedInternalPaths();
    expect(linked.length).toBeGreaterThan(5);
    expect(linked).toContain(SITE_ROUTES.product);
  });

  it("lists every internal page linked from the chrome", () => {
    const inSitemap = new Set(sitemapPaths());
    const missing = linkedInternalPaths()
      .filter((path) => !isLaunchHidden(path))
      .filter((path) => !(path in INTENTIONALLY_ABSENT))
      .filter((path) => !inSitemap.has(path));
    expect(
      missing,
      "linked and reachable but not in the sitemap. Add the route to STATIC_ROUTES, or to INTENTIONALLY_ABSENT with a reason.",
    ).toEqual([]);
  });

  it("lists the suite pages", () => {
    const paths = sitemapPaths();
    for (const suite of SUITES) expect(paths).toContain(suiteHref(suite.key));
  });

  it("does not list a launch-hidden route", () => {
    expect(sitemapPaths().filter(isLaunchHidden), "launch-hidden routes must never be advertised").toEqual([]);
  });

  it("excludes modules the site does not market", () => {
    const paths = sitemapPaths();
    // Requests is not publicly visible, so its route must not appear.
    expect(paths).not.toContain(moduleHref("people"));
    expect(paths).toContain(moduleHref("pay"));
  });

  it("keeps every intentionally-absent route genuinely absent", () => {
    const inSitemap = new Set(sitemapPaths());
    for (const path of Object.keys(INTENTIONALLY_ABSENT)) {
      expect(inSitemap.has(path), `${path} is documented as absent (${INTENTIONALLY_ABSENT[path]}) but is in the sitemap`).toBe(false);
    }
  });
});
