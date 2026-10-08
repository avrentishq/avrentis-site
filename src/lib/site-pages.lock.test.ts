import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { STATIC_ROUTES } from "@/app/sitemap";
import { LEGAL_PAGES, SITE_PAGE_ROUTES, type LegalPageKey } from "@/lib/brand";
import { isLaunchHidden } from "@/lib/launch";

/**
 * Core owns the paths other surfaces link to on this site — the legal pages
 * (`LEGAL_PAGES`) and the trial/contact pages (`SITE_PAGE_ROUTES`). Product
 * emails, the trial screens and the billing portal build links from them, so
 * a page moved or renamed here would break a customer's click somewhere this
 * repo never sees. Core cannot check that; the site owns the routes, so the
 * site proves every path core publishes is a page it actually serves.
 */

const SRC = join(process.cwd(), "src");
const APP = join(SRC, "app");

/** True if the app router serves a page at `route` (dynamic segments in [brackets]). */
function hasPage(route: string): boolean {
  const segments = route.split("/").filter(Boolean);
  return ["page.tsx", "page.ts"].some((file) => existsSync(join(APP, ...segments, file)));
}

/**
 * Legal pages the launch gate hides today. A link core builds to one of these
 * lands on a 404 until the page is shown, so each entry is an open decision,
 * not a permanent exemption: the test below fails the moment the page is
 * shown (delete the entry then) and fails if any other legal page is hidden.
 */
const HIDDEN_LEGAL_PAGES_PENDING: Partial<Record<LegalPageKey, string>> = {
  trust: "the trust centre is launch-gated; core's legalPageUrl(\"trust\") 404s until it is shown",
};

const legalPages = Object.entries(LEGAL_PAGES) as [LegalPageKey, string][];

describe("every page core links to is a page the site serves", () => {
  it("the page detector finds a real page and misses a fake one", () => {
    expect(hasPage("/privacy")).toBe(true);
    expect(hasPage("/trial/verify/[token]")).toBe(true);
    expect(hasPage("/no-such-page")).toBe(false);
  });

  it.each(legalPages)("LEGAL_PAGES.%s (%s) is a real page", (_key, path) => {
    expect(hasPage(path), `${path} has no page.tsx under src/app`).toBe(true);
  });

  it.each(legalPages)("LEGAL_PAGES.%s (%s) is in the sitemap's STATIC_ROUTES", (_key, path) => {
    expect(STATIC_ROUTES).toContain(path);
  });

  it("no legal page is launch-hidden beyond the named pending decisions", () => {
    const hidden = legalPages.filter(([, path]) => isLaunchHidden(path)).map(([key]) => key);
    expect(hidden.sort()).toEqual(Object.keys(HIDDEN_LEGAL_PAGES_PENDING).sort());
  });

  it.each(Object.entries(SITE_PAGE_ROUTES))("SITE_PAGE_ROUTES.%s (%s) is a real page", (_key, route) => {
    expect(hasPage(route), `${route} has no page.tsx under src/app`).toBe(true);
  });

  it.each(Object.entries(SITE_PAGE_ROUTES).filter(([, route]) => !route.includes("[")))(
    "SITE_PAGE_ROUTES.%s (%s) is in the sitemap and not launch-hidden",
    (_key, route) => {
      expect(STATIC_ROUTES).toContain(route);
      expect(isLaunchHidden(route)).toBe(false);
    },
  );
});

/**
 * The route inventories list paths on purpose — the sitemap and the launch
 * gate — and the tests above hold them to core. Every other file links
 * through `LEGAL_PAGES`, `SITE_PAGES` or `contactHref`.
 */
const ROUTE_INVENTORIES = new Set([join("app", "sitemap.ts"), join("lib", "launch.ts")]);

const STATIC_SITE_ROUTES = Object.values(SITE_PAGE_ROUTES).filter((route) => !route.includes("["));
const LINKED_PATHS = [...Object.values(LEGAL_PAGES), ...STATIC_SITE_ROUTES];
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
/** A quoted path core owns: "/privacy", '/terms#x', `/contact?intent=…` and the like. */
const HAND_TYPED_PATH = new RegExp(`["'\`](?:${LINKED_PATHS.map(escapeRegExp).join("|")})(?=["'\`#?])`);

describe("pages core owns are never linked by a hand-typed path", () => {
  it("the detector catches a typed path and ignores look-alikes", () => {
    expect(HAND_TYPED_PATH.test('href="/privacy"')).toBe(true);
    expect(HAND_TYPED_PATH.test('{ href: "/product/security" }')).toBe(true);
    expect(HAND_TYPED_PATH.test("canonical('/terms')")).toBe(true);
    expect(HAND_TYPED_PATH.test('href="/trust#dpa"')).toBe(true);
    expect(HAND_TYPED_PATH.test('href="/trial"')).toBe(true);
    expect(HAND_TYPED_PATH.test('href="/privacy-notice"')).toBe(false);
    expect(HAND_TYPED_PATH.test('href="/product/security-stack"')).toBe(false);
    expect(HAND_TYPED_PATH.test("// see /privacy for the policy")).toBe(false);
  });

  it("no source file outside the route inventories types one", () => {
    const offenders = readdirSync(SRC, { recursive: true, encoding: "utf8" })
      .filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file))
      .filter((file) => !ROUTE_INVENTORIES.has(file))
      .filter((file) => HAND_TYPED_PATH.test(readFileSync(join(SRC, file), "utf8")));
    expect(offenders, "link through LEGAL_PAGES / SITE_PAGES / contactHref").toEqual([]);
  });

  it("the scan reads the files that link to these pages", () => {
    // Guards against a vacuous pass: the footer links to every legal page.
    const footer = readFileSync(join(SRC, "components", "layout", "footer.tsx"), "utf8");
    expect(footer).toContain("LEGAL_PAGES.privacy");
  });
});

/**
 * Core owns every Avrentis origin — the app (`BRAND.appUrl`), the status page
 * (`statusUrl`) and the docs site (`docsUrl`) — all built from `SITE_HOST`. A
 * retyped `status.`/`docs.`/`app.` host is how a link quietly keeps pointing
 * at the old place after the domain moves. Email addresses are not hosts here
 * (they have their own home, `contacts.ts`), so `@…` is not matched.
 */
const HAND_TYPED_HOST = /(?<![@\w.-])(?:[a-z0-9-]+\.)+avrentis\.com\b/i;
/** Files outside `src/` that build origins (the CSP in `next.config.ts`). */
const ROOT_FILES = ["next.config.ts"];

describe("Avrentis hosts are never typed by hand", () => {
  it("the detector catches a typed subdomain host and ignores emails and the bare site host", () => {
    expect(HAND_TYPED_HOST.test('const url = "https://status.avrentis.com/";')).toBe(true);
    expect(HAND_TYPED_HOST.test('href="https://docs.avrentis.com/scim"')).toBe(true);
    expect(HAND_TYPED_HOST.test("`connect-src 'self' https://app.avrentis.com`")).toBe(true);
    expect(HAND_TYPED_HOST.test("<a>app.avrentis.com</a>")).toBe(true);
    expect(HAND_TYPED_HOST.test('"mailto:status@avrentis.com"')).toBe(false);
    expect(HAND_TYPED_HOST.test("the site at avrentis.com")).toBe(false);
  });

  it("no source file (or next.config.ts) types one; it comes from core", () => {
    const sourceFiles = readdirSync(SRC, { recursive: true, encoding: "utf8" })
      .filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file))
      .map((file) => join(SRC, file));
    const offenders = [...sourceFiles, ...ROOT_FILES.map((file) => join(process.cwd(), file))]
      .filter((file) => HAND_TYPED_HOST.test(readFileSync(file, "utf8")))
      .map((file) => relative(process.cwd(), file));
    expect(offenders, "use BRAND.appUrl / statusUrl() / docsUrl() from @/lib/brand").toEqual([]);
  });

  it("the scan reads the files that build these origins", () => {
    // Guards against a vacuous pass: both read core's builders, not a literal.
    expect(readFileSync(join(APP, "status", "page.tsx"), "utf8")).toContain("statusUrl(");
    expect(readFileSync(join(process.cwd(), "next.config.ts"), "utf8")).toContain("BRAND.appUrl");
  });
});
