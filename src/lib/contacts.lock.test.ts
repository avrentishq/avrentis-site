import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Published addresses have one home each: contact emails in `contacts.ts`, the
 * site's own URL in core (`BRAND.siteUrl`, re-exported as `SITE_URL` by
 * `seo.tsx`). A retyped copy is how the security contact on a
 * page and the one in `security.txt` end up different.
 */

const SRC = join(process.cwd(), "src");
// contacts.ts reads core's addresses and types none, so nothing is exempt.
const HOMES = new Set<string>();
/** Any mailbox at the domain or a subdomain of it: hello@, x@mail.… */
const EMAIL = /\b[a-z0-9._%+-]+@(?:[a-z0-9-]+\.)*avrentis\.com\b/i;
/** The site's origin or bare host, quoted: "https://avrentis.com", 'http://avrentis.com/x', "avrentis.com". */
const SITE_URL_LITERAL = /["'`](?:https?:\/\/)?avrentis\.com(?=["'`/])/;

/** Root files and folders outside src/ that are built or run, checked too. */
const ROOT_FILES = ["next.config.ts"];
const ROOT_FOLDERS = ["scripts"];

function sourceFiles(): string[] {
  const inSource = readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(tsx?|mjs|json|css)$/.test(file))
    .filter((file) => !/\.test\.tsx?$/.test(file))
    .filter((file) => !HOMES.has(file))
    .map((file) => join(SRC, file));
  const inRootFolders = ROOT_FOLDERS.flatMap((folder) =>
    readdirSync(join(process.cwd(), folder), { recursive: true, encoding: "utf8" })
      .filter((file) => /\.(tsx?|mjs|js)$/.test(file))
      .map((file) => join(process.cwd(), folder, file)),
  );
  return [...inSource, ...ROOT_FILES.map((file) => join(process.cwd(), file)), ...inRootFolders];
}

function offenders(pattern: RegExp): string[] {
  return sourceFiles()
    .filter((file) => pattern.test(readFileSync(file, "utf8")))
    .map((file) => relative(process.cwd(), file));
}

describe("published addresses live in one place", () => {
  it("the detectors catch a retyped address", () => {
    expect(EMAIL.test('href="mailto:hello@avrentis.com"')).toBe(true);
    expect(SITE_URL_LITERAL.test('new URL("https://avrentis.com")')).toBe(true);
    expect(SITE_URL_LITERAL.test('"https://avrentis.com/pricing"')).toBe(true);
    expect(EMAIL.test('"alerts@mail.avrentis.com"')).toBe(true);
    expect(SITE_URL_LITERAL.test('"http://avrentis.com"')).toBe(true);
    expect(SITE_URL_LITERAL.test('const host = "avrentis.com";')).toBe(true);
    expect(SITE_URL_LITERAL.test('"docs.avrentis.com"')).toBe(false);
  });

  it("no file outside contacts.ts types an @avrentis.com address", () => {
    expect(offenders(EMAIL)).toEqual([]);
  });

  it("no file reads core's addresses around contacts.ts", () => {
    // Core owns the mailboxes; contacts.ts is the one place the site reads them,
    // so a page cannot pick a different address for the same purpose.
    expect(
      offenders(/\bBRAND\.(?:contactEmail|supportEmail|securityEmail|trialsEmail|statusEmail)\b/).filter(
        (file) => file !== join("src", "lib", "contacts.ts"),
      ),
    ).toEqual([]);
  });

  it("contact addresses are core's", async () => {
    const { BRAND } = await import("@/lib/brand");
    const { CONTACT_EMAIL } = await import("@/lib/contacts");
    expect(CONTACT_EMAIL.general).toBe(BRAND.contactEmail);
    expect(CONTACT_EMAIL.security).toBe(BRAND.securityEmail);
  });

  it("no file types the site URL; it comes from core", () => {
    expect(offenders(SITE_URL_LITERAL)).toEqual([]);
  });
});
