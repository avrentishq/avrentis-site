import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { BRAND } from "@/lib/brand";
import { stripComments } from "@/lib/test-support/strip-comments";

/**
 * The brand name is core's (`BRAND.name`, through `@/lib/brand`), so renaming the
 * product is one edit in core. Copy reads it — `{BRAND.name}` in JSX,
 * `${BRAND.name}` in a string — and never types it. Comments may name it; the
 * changelog records what was true on its date and is exempt, as are tests.
 */

const SRC = join(process.cwd(), "src");
const EXEMPT_FILE = /^(?:lib[\\/]brand\.ts|components[\\/]changelog[\\/].*)$/;
/** The wordmark in either case: a typed upper-case label is the same copy. */
const TYPED_BRAND = new RegExp(`\\b(?:${BRAND.name}|${BRAND.name.toUpperCase()})\\b`);

function typedBrandLines(source: string): string[] {
  return stripComments(source)
    .split("\n")
    .filter((line) => TYPED_BRAND.test(line))
    .map((line) => line.trim());
}

function scannedFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file))
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
      typedBrandLines(readFileSync(join(SRC, file), "utf8")).map((line) => `${file}: ${line}`),
    );
    expect(offenders, "read it from BRAND.name (@/lib/brand) so a rename is one edit in core").toEqual([]);
  });
});
