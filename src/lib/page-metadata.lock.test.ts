import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { BRAND } from "@/lib/brand";
import { canonical, pageMetadata, pageTitle } from "@/lib/seo";

/**
 * Every page's metadata comes from `pageMetadata` (`src/lib/seo.tsx`).
 *
 * Next merges metadata shallowly. Pages that set their own `openGraph` but not
 * `twitter` inherited the root layout's twitter card, so every page shared on X
 * showed the homepage's title and description; the page's `openGraph` replaced
 * the root one and dropped the site name; and each page typed its path twice
 * and the brand name in its title.
 */

const APP = join(process.cwd(), "src", "app");
/** Not ordinary pages: the root layout owns the defaults, the home page inherits them, status redirects, verify is unindexed. */
const EXEMPT = new Set(["layout.tsx", "page.tsx", join("status", "page.tsx"), join("trial", "verify", "[token]", "page.tsx")]);

function metadataFiles(): string[] {
  return readdirSync(APP, { recursive: true, encoding: "utf8" })
    .filter((file) => /(?:page|layout)\.tsx$/.test(file))
    .filter((file) => /export (?:const metadata\b|async function generateMetadata\b|function generateMetadata\b)/.test(readFileSync(join(APP, file), "utf8")));
}

/** The metadata export's own text. */
function metadataBlock(file: string): string {
  const source = readFileSync(join(APP, file), "utf8");
  const start = source.search(/export (?:const metadata\b|async function generateMetadata\b|function generateMetadata\b)/);
  const end = source.indexOf("\n}", start);
  return source.slice(start, end === -1 ? undefined : end + 2);
}

describe("page metadata", () => {
  it("fills title, canonical, Open Graph and Twitter from one input", () => {
    const metadata = pageMetadata({ path: "/pricing", title: "Pricing", description: "Plans." });
    expect(metadata.title).toBe(`Pricing — ${BRAND.name}`);
    expect(metadata.alternates?.canonical).toBe("/pricing");
    expect(metadata.openGraph).toMatchObject({ url: canonical("/pricing"), siteName: BRAND.name, title: `Pricing — ${BRAND.name}` });
    expect(metadata.twitter).toMatchObject({ title: `Pricing — ${BRAND.name}`, description: "Plans." });
    expect(pageTitle(`${BRAND.name} Spend`)).toBe(`${BRAND.name} Spend`);
  });

  it("the scan sees the pages (proves it can find a known one)", () => {
    expect(metadataFiles()).toContain(join("pricing", "page.tsx"));
  });

  it("every page builds its metadata with pageMetadata", () => {
    const offenders = metadataFiles()
      .filter((file) => !EXEMPT.has(file))
      .filter((file) => !/(?:=|return)\s*(?:pageMetadata|suitePageMetadata)\(/.test(metadataBlock(file)));
    expect(offenders, "export const metadata = pageMetadata({ path, title, description })").toEqual([]);
  });

  it("no metadata types the brand name", () => {
    const offenders = metadataFiles().filter((file) => new RegExp(`["\`][^"\`]*\\b${BRAND.name}\\b`).test(metadataBlock(file)));
    expect(offenders, "pageTitle() adds the brand; use ${BRAND.name} inside copy").toEqual([]);
  });
});
