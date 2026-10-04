import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The site takes small slices of `@avrentishq/core`, never the whole package:
 * most subpaths need peer dependencies this repo does not install (database,
 * auth, cloud SDKs), and importing one breaks the build or the bundle.
 *
 * Runtime code may import:
 *   - `brand` — the wordmark, fonts and BRAND constants.
 *   - `region/countries` — type-only imports, no peers.
 *   - `security/rate-limit` and `security/rate-limit-tiers` — the shared
 *     limiter for the four Server Actions. Their import graph needs only
 *     `@upstash/ratelimit` and `@upstash/redis`, which the site installs.
 *     Admitted module by module, not as `security/*`: the rest of that folder
 *     pulls in peers the site does not carry.
 * Tests may additionally import dependency-free modules that back parity locks.
 */
const RUNTIME_ALLOWED = new Set([
  "brand",
  "region/countries",
  "security/rate-limit",
  "security/rate-limit-tiers",
]);
const TEST_ONLY_ALLOWED = new Set(["modules/catalog", "security/dependency-floors"]);

const SRC = join(process.cwd(), "src");
// This file's own detector fixtures name disallowed subpaths on purpose.
const SELF = join("lib", "core-imports.lock.test.ts");
const CORE_IMPORT = /(?:from\s+|import\s*\(\s*|import\s+)["']@avrentishq\/core(?:\/([^"']+))?["']/g;

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(tsx?|mjs)$/.test(file))
    .filter((file) => file !== SELF);
}

/** Core subpaths `text` imports; "" for the package root. */
function coreSubpaths(text: string): string[] {
  return [...text.matchAll(CORE_IMPORT)].map((match) => match[1] ?? "");
}

describe("core imports stay inside the site's allowlist", () => {
  it("the detector finds static, dynamic and side-effect imports", () => {
    expect(coreSubpaths('import { BRAND } from "@avrentishq/core/brand";')).toEqual(["brand"]);
    expect(coreSubpaths('await import("@avrentishq/core/db/rls")')).toEqual(["db/rls"]);
    expect(coreSubpaths('import "@avrentishq/core";')).toEqual([""]);
    expect(coreSubpaths('// see @avrentishq/core/brand')).toEqual([]);
  });

  it("scans the site (proves the walk sees a known importer)", () => {
    const hero = join("components", "sections", "hero.tsx");
    expect(sourceFiles()).toContain(hero);
    expect(coreSubpaths(readFileSync(join(SRC, hero), "utf8"))).toContain("brand");
  });

  it("no file imports a core subpath outside its allowlist", () => {
    const offenders = sourceFiles().flatMap((file) => {
      const isTest = /\.test\.tsx?$/.test(file);
      return coreSubpaths(readFileSync(join(SRC, file), "utf8"))
        .filter((subpath) => !RUNTIME_ALLOWED.has(subpath))
        .filter((subpath) => !(isTest && TEST_ONLY_ALLOWED.has(subpath)))
        .map((subpath) => `src/${file}  @avrentishq/core/${subpath}`);
    });
    expect(
      offenders,
      "Check the subpath's import graph for peers the site does not install, then extend the " +
        "allowlist here and in AGENTS.md together.\n" +
        offenders.join("\n"),
    ).toEqual([]);
  });
});
