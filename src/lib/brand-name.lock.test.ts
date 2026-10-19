import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { BRAND, SITE_HOST } from "@/lib/brand";
import { scannedLanguageFor, typedBrandLines, typedHostLines } from "@avrentishq/core/brand/typed-brand";

/**
 * The brand name is core's (`BRAND.name`, through `@/lib/brand`), so renaming the
 * product is one edit in core. Copy reads it — `{BRAND.name}` in JSX,
 * `${BRAND.name}` in a string — and never types it. Origins and inboxes are built
 * from core too (`siteUrl`, `BRAND.appUrl`, `BRAND.contactEmail`, `SITE_HOST`).
 * The detectors are core's, shared with the app and the console. Comments may
 * name either; the changelog records what was true on its date and is exempt, as
 * are tests.
 */

const SRC = join(process.cwd(), "src");
// pricing-fallback.json is generated from the platform API (`pnpm pricing:check`
// locks it); it holds core's RESOLVED module names.
const EXEMPT_FILE = /^(?:lib[\\/]brand\.ts|components[\\/]changelog[\\/].*|data[\\/]pricing-fallback\.json)$/;
function scannedFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(?:tsx?|json|css)$/.test(file))
    .filter((file) => !/\.test\.tsx?$/.test(file))
    .filter((file) => !EXEMPT_FILE.test(file));
}

describe("the brand name is never typed", () => {
  it("core names the brand (the detector is built from the real value)", () => {
    expect(BRAND.name.length).toBeGreaterThan(0);
  });

  it("the detector fires on typed copy and ignores comments and BRAND.name", () => {
    expect(typedBrandLines(`<p>Why ${BRAND.name} exists</p>`)).toHaveLength(1);
    expect(typedBrandLines(`const title = "Try ${BRAND.name}";`)).toHaveLength(1);
    expect(typedBrandLines(`eyebrow="WHY TEAMS TRUST ${BRAND.name.toUpperCase()}"`)).toHaveLength(1);
    expect(typedBrandLines(`// ${BRAND.name} owns this`)).toEqual([]);
    expect(typedBrandLines(`/* ${BRAND.name}\n * owns this */`)).toEqual([]);
    expect(typedBrandLines(`{/* ${BRAND.name} owns this */}`)).toEqual([]);
    expect(typedBrandLines("const title = `Try ${BRAND.name}`;")).toEqual([]);
    expect(typedBrandLines("<p>Try {BRAND.name}</p>")).toEqual([]);
    expect(typedBrandLines(`href="https://${BRAND.name.toLowerCase()}.example"`)).toEqual([]);
  });

  it("the scan reads the site's source (proves it can see a known file)", () => {
    const files = scannedFiles();
    expect(files).toContain(join("app", "terms", "page.tsx"));
    expect(files).not.toContain(join("lib", "brand.ts"));
  });

  it("no source file types the brand name", () => {
    const offenders = scannedFiles().flatMap((file) =>
      typedBrandLines(readFileSync(join(SRC, file), "utf8"), scannedLanguageFor(file)).map(
        (line) => `${file}: ${line}`,
      ),
    );
    expect(offenders, "read it from BRAND.name (@/lib/brand) so a rename is one edit in core").toEqual([]);
  });

  it("the host detector is live", () => {
    expect(typedHostLines(`const url = "https://${SITE_HOST}/trial";`)).toHaveLength(1);
  });

  it("no source file types the site host", () => {
    const offenders = scannedFiles().flatMap((file) =>
      typedHostLines(readFileSync(join(SRC, file), "utf8"), scannedLanguageFor(file)).map(
        (line) => `${file}: ${line}`,
      ),
    );
    expect(offenders, "build it from core (siteUrl / BRAND.* / SITE_HOST) so a new domain is one edit").toEqual([]);
  });
});
