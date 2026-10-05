import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";

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
 *   - `billing/trial-deadlines`, `billing/capacity`, `billing/catalog` and
 *     `billing/limit-format` — the trial's terms, the plan catalogue and the
 *     byte formatter. Pure data and `Intl`; their value imports reach only
 *     `modules/catalog`, `entitlements/dimensions`, `dates/durations` and
 *     `locales`, none of which import a package.
 *   - `money/format` + `money/types` — core's one money formatter, so a price
 *     prints the way the product prints it. `Intl` and `locales` only.
 *   - `billing/features` — `SERVICE_COMMITMENT_KEYS` for the comparison table's
 *     service group (server-side, in `fetchPricingData`). Reaches only
 *     `modules/catalog`; its `db/schema` and role imports are type-only.
 * Tests may additionally import dependency-free modules that back parity locks
 * (`brand/copy-guardrails` has no imports at all; it backs the record-keeping lock).
 * The pricing-fallback generator (run by `scripts/generate-pricing-fallback.mjs`
 * at build time and by its test; never imported by a page) may also read
 * `billing/retention`, `modules/catalog` and `sectors`; so may
 * tests, which check the generator's output against core.
 *
 * The last test below walks each allowed subpath's VALUE import graph inside
 * core and fails on any package the site does not install, so admitting a
 * subpath is checked, not just asserted in this comment.
 */
const RUNTIME_ALLOWED = new Set([
  "brand",
  "region/countries",
  "security/rate-limit",
  "security/rate-limit-tiers",
  "billing/trial-deadlines",
  "billing/capacity",
  "billing/catalog",
  "billing/limit-format",
  "money/format",
  "money/types",
  "billing/features",
]);
const BUILD_FILES = new Set([join("lib", "pricing-fallback-build.ts"), join("data", "plan-copy.ts")]);
const BUILD_ONLY_ALLOWED = new Set(["billing/retention", "modules/catalog", "sectors"]);
const TEST_ONLY_ALLOWED = new Set([
  "modules/catalog",
  "security/dependency-floors",
  "brand/copy-guardrails",
]);

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
        .filter((subpath) => !(isTest && (TEST_ONLY_ALLOWED.has(subpath) || BUILD_ONLY_ALLOWED.has(subpath))))
        .filter((subpath) => !(BUILD_FILES.has(file) && BUILD_ONLY_ALLOWED.has(subpath)))
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

/* ── The allowed subpaths' own import graphs ─────────────────────── */

const CORE_ROOT = join(process.cwd(), "node_modules", "@avrentishq", "core");
const SITE_PACKAGES = (() => {
  const manifest = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
  return new Set([...Object.keys(manifest.dependencies ?? {}), ...Object.keys(manifest.devDependencies ?? {})]);
})();

/** The file an `@avrentishq/core/<subpath>` import resolves to, via the package's `exports`. */
function coreEntryFile(subpath: string): string {
  const exportsMap: Record<string, string> = JSON.parse(
    readFileSync(join(CORE_ROOT, "package.json"), "utf8"),
  ).exports;
  const exact = exportsMap[`./${subpath}`];
  if (exact) return join(CORE_ROOT, exact);
  for (const [pattern, target] of Object.entries(exportsMap)) {
    if (!pattern.endsWith("/*")) continue;
    const prefix = pattern.slice(2, -1);
    if (subpath.startsWith(prefix)) return join(CORE_ROOT, target.replace("*", subpath.slice(prefix.length)));
  }
  throw new Error(`@avrentishq/core/${subpath} is not exported`);
}

/** Specifiers a file imports for their VALUE (`import type` / `export type` are erased). */
const VALUE_IMPORT = /^\s*(?:import|export)\s+(?!type\s)(?:[^;]*?\sfrom\s+)?["']([^"']+)["']/gm;

function packagesReachedFrom(entry: string): string[] {
  const seen = new Set<string>();
  const packages = new Set<string>();
  const pending = [entry];
  while (pending.length > 0) {
    const file = pending.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const [, specifier] of readFileSync(file, "utf8").matchAll(VALUE_IMPORT)) {
      if (specifier!.startsWith(".")) {
        const base = join(dirname(file), specifier!);
        const candidates = [`${base}.ts`, join(base, "index.ts"), base];
        const resolved = candidates.find((candidate) => {
          try {
            return readFileSync(candidate) !== undefined;
          } catch {
            return false;
          }
        });
        if (!resolved) throw new Error(`cannot resolve ${specifier} from ${file}`);
        pending.push(resolved);
      } else if (!specifier!.startsWith("node:")) {
        const parts = specifier!.split("/");
        packages.add(specifier!.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]!);
      }
    }
  }
  return [...packages];
}

describe("every allowed core subpath reaches only packages the site installs", () => {
  it("the walk sees a known package import (proves it reads value imports)", () => {
    expect(packagesReachedFrom(coreEntryFile("security/rate-limit"))).toContain("@upstash/ratelimit");
  });

  it("the walk skips type-only imports (they are erased at build)", () => {
    expect(VALUE_IMPORT.test('import type { Foo } from "drizzle-orm";')).toBe(false);
    VALUE_IMPORT.lastIndex = 0;
  });

  it.each([...RUNTIME_ALLOWED, ...BUILD_ONLY_ALLOWED, ...TEST_ONLY_ALLOWED])("%s", (subpath) => {
    const missing = packagesReachedFrom(coreEntryFile(subpath)).filter(
      (name) => !SITE_PACKAGES.has(name),
    );
    expect(missing, `@avrentishq/core/${subpath} needs packages the site does not install`).toEqual([]);
  });
});

describe("build-only modules stay out of the pages", () => {
  it("no runtime file imports the fallback generator or the plan copy", () => {
    const importers = sourceFiles()
      .filter((file) => !/\.test\.tsx?$/.test(file) && !BUILD_FILES.has(file))
      .filter((file) =>
        /from\s+["'](?:@\/lib\/pricing-fallback-build|@\/data\/plan-copy|\.{1,2}\/[^"']*(?:pricing-fallback-build|plan-copy))["']/.test(
          readFileSync(join(SRC, file), "utf8"),
        ),
      );
    expect(importers).toEqual([]);
  });
});
