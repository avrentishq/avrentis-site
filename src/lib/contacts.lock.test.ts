import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import { SITE_HOST } from "@/lib/brand";

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
const HOST = SITE_HOST.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const EMAIL = new RegExp(String.raw`\b[a-z0-9._%+-]+@(?:[a-z0-9-]+\.)*${HOST}\b`, "i");
/** The site's origin or bare host, quoted: "https://<host>", 'http://<host>/x', "<host>". */
const SITE_URL_LITERAL = new RegExp(String.raw`["'\x60](?:https?:\/\/)?${HOST}(?=["'\x60/])`);

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
    expect(EMAIL.test(`href="mailto:hello@${SITE_HOST}"`)).toBe(true);
    expect(SITE_URL_LITERAL.test(`new URL("https://${SITE_HOST}")`)).toBe(true);
    expect(SITE_URL_LITERAL.test(`"https://${SITE_HOST}/pricing"`)).toBe(true);
    expect(EMAIL.test(`"alerts@mail.${SITE_HOST}"`)).toBe(true);
    expect(SITE_URL_LITERAL.test(`"http://${SITE_HOST}"`)).toBe(true);
    expect(SITE_URL_LITERAL.test(`const host = "${SITE_HOST}";`)).toBe(true);
    expect(SITE_URL_LITERAL.test(`"docs.${SITE_HOST}"`)).toBe(false);
  });

  it("no file outside contacts.ts types an address on the brand domain", () => {
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

  it("no copy promises a reply time", () => {
    // The site promises a person reads every message (ENQUIRY_PROMISE), not when
    // they answer; only security triage states a time. The privacy policy's own
    // data-request commitment is legal text with its own effective date.
    const REPLY_TIME = /\b(?:reply|replies|respond|responds)\b[^.\n]{0,40}\bbusiness\s+days?\b/i;
    expect(REPLY_TIME.test("we reply within one business day")).toBe(true);
    const files = offenders(REPLY_TIME).filter(
      (file) => file !== join("src", "lib", "contacts.ts") && file !== join("src", "app", "privacy", "page.tsx"),
    );
    expect(files).toEqual([]);
  });

  it("no file types the site URL; it comes from core", () => {
    expect(offenders(SITE_URL_LITERAL)).toEqual([]);
  });
});
