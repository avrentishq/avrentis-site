import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { STATIC_ROUTES } from "@/app/sitemap";
import { publicModuleKeys, MODULES } from "@/lib/brand";
import { isLaunchHidden } from "@/lib/launch";

/**
 * Drift guard for indexing. The bug this prevents: a page ships, gets linked
 * from the navbar or footer, and nobody adds it to the sitemap — so it is
 * publicly reachable but never indexed. /product/integrations sat that way.
 *
 * Link hrefs are scraped from the chrome components rather than imported,
 * because those are "use client" modules that pull in framer-motion and will
 * not load in this node-environment suite. The scrape is guarded by a sanity
 * assertion below so it cannot silently match nothing and pass vacuously.
 */

/** Internal routes intentionally kept out of the sitemap, with the reason. */
const INTENTIONALLY_ABSENT: Record<string, string> = {
  "/status": "redirects to an external status page; sitemaps must not list redirects",
  "/features": "redirects to /product",
};

function sitemapPaths(): string[] {
  const moduleRoutes = publicModuleKeys().map(
    (key) => `/product/${MODULES[key].slug}`,
  );
  return [...STATIC_ROUTES, ...moduleRoutes].filter(
    (path) => !isLaunchHidden(path),
  );
}

function linkedInternalPaths(): string[] {
  const files = [
    "src/components/layout/navbar.tsx",
    "src/components/layout/footer.tsx",
  ];
  const found = new Set<string>();
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/href: "(\/[^"]*)"/g)) {
      // Drop the fragment — /product/integrations#identity indexes as its page.
      const path = match[1].split("#")[0];
      if (path) found.add(path);
    }
  }
  return [...found];
}

describe("sitemap", () => {
  it("scrape actually finds links (guards against a vacuous pass)", () => {
    const linked = linkedInternalPaths();
    expect(
      linked.length,
      "expected to scrape several internal hrefs from navbar/footer",
    ).toBeGreaterThan(5);
    expect(linked, "the product hub is linked from the chrome").toContain(
      "/product",
    );
  });

  it("lists every internal page linked from the navbar or footer", () => {
    const inSitemap = new Set(sitemapPaths());
    const missing = linkedInternalPaths()
      .filter((path) => !isLaunchHidden(path))
      .filter((path) => !(path in INTENTIONALLY_ABSENT))
      .filter((path) => !inSitemap.has(path));

    expect(
      missing,
      `linked and reachable but not in the sitemap: ${missing.join(", ")}. ` +
        "Add the route to STATIC_ROUTES, or to INTENTIONALLY_ABSENT with a reason.",
    ).toEqual([]);
  });

  it("does not list a launch-hidden route", () => {
    const hidden = sitemapPaths().filter(isLaunchHidden);
    expect(hidden, "launch-hidden routes must never be advertised").toEqual([]);
  });

  it("excludes modules the site does not market", () => {
    const paths = sitemapPaths();
    // Requests is publiclyVisible:false, so its route must not appear.
    expect(paths).not.toContain(`/product/${MODULES.people.slug}`);
    expect(paths).toContain(`/product/${MODULES.pay.slug}`);
  });

  it("keeps every intentionally-absent route genuinely absent", () => {
    const inSitemap = new Set(sitemapPaths());
    for (const path of Object.keys(INTENTIONALLY_ABSENT)) {
      expect(
        inSitemap.has(path),
        `${path} is documented as absent (${INTENTIONALLY_ABSENT[path]}) but is in the sitemap`,
      ).toBe(false);
    }
  });
});
