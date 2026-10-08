import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Published addresses have one home each: contact emails in `contacts.ts`, the
 * site's own URL in core (`BRAND.siteUrl`, re-exported as `SITE_URL` by
 * `seo.tsx`). A retyped copy is how the security contact on a
 * page and the one in `security.txt` end up different.
 */

const SRC = join(process.cwd(), "src");
const HOMES = new Set(["lib/contacts.ts"]);
const EMAIL = /\b[a-z0-9._-]+@avrentis\.com\b/i;
const SITE_URL_LITERAL = /["'`]https:\/\/avrentis\.com["'`/]/;

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(tsx?|json)$/.test(file))
    .filter((file) => !/\.test\.tsx?$/.test(file))
    .filter((file) => !HOMES.has(file));
}

function offenders(pattern: RegExp): string[] {
  return sourceFiles().filter((file) => pattern.test(readFileSync(join(SRC, file), "utf8")));
}

describe("published addresses live in one place", () => {
  it("the detectors catch a retyped address", () => {
    expect(EMAIL.test('href="mailto:hello@avrentis.com"')).toBe(true);
    expect(SITE_URL_LITERAL.test('new URL("https://avrentis.com")')).toBe(true);
    expect(SITE_URL_LITERAL.test('"https://avrentis.com/pricing"')).toBe(true);
  });

  it("no file outside contacts.ts types an @avrentis.com address", () => {
    expect(offenders(EMAIL)).toEqual([]);
  });

  it("no file types the site URL; it comes from core", () => {
    expect(offenders(SITE_URL_LITERAL)).toEqual([]);
  });
});
