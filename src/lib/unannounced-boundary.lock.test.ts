import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

import { HIDDEN_AT_LAUNCH } from "@/lib/launch";

/**
 * Pages not yet announced live in the git-ignored `unannounced/` folder, and
 * the `@/` alias falls back to it so those pages type-check locally. A
 * published file must never lean on that fallback: the folder does not exist
 * on Vercel, so an import that resolves only there passes on this laptop and
 * breaks the deploy. Every `@/` import in a tracked file must land in `src/`.
 */
const EXTENSIONS = ["", ".ts", ".tsx", ".mjs", ".js", "/index.ts", "/index.tsx"];

function resolvesInSrc(specifier: string): boolean {
  const base = join(process.cwd(), "src", specifier.slice(2));
  return EXTENSIONS.some((extension) => existsSync(base + extension));
}

function unresolved(source: string): string[] {
  const specifiers = [...source.matchAll(/(?:from|import)\s*\(?\s*"(@\/[^"]+)"/g)].map((match) => match[1]!);
  return specifiers.filter((specifier) => !resolvesInSrc(specifier));
}

describe("published code never imports an unannounced page", () => {
  it("the detector catches an import that resolves nowhere in src/", () => {
    expect(unresolved('import { CareersPage } from "@/components/careers/careers-page";')).toEqual([
      "@/components/careers/careers-page",
    ]);
    expect(unresolved('import { BRAND } from "@/lib/brand";')).toEqual([]);
  });

  it("every @/ import in a tracked file resolves inside src/", () => {
    const tracked = execFileSync("git", ["ls-files", "src", "scripts"], { encoding: "utf8" })
      .split("\n")
      .filter((file) => /\.(ts|tsx|mjs)$/.test(file));
    expect(tracked.length).toBeGreaterThan(100);
    const offenders = tracked.flatMap((file) =>
      unresolved(readFileSync(join(process.cwd(), file), "utf8")).map((specifier) => `${file} → ${specifier}`),
    );
    expect(offenders).toEqual([]);
  });
});

describe("an unannounced page is not in the public repo", () => {
  const pageIn = (root: string, path: string) =>
    ["page.tsx", "page.ts"].some((file) => existsSync(join(process.cwd(), root, ...path.split("/").filter(Boolean), file)));

  it("the detector finds a published page", () => {
    expect(pageIn("src/app", "/pricing")).toBe(true);
  });

  it("every path hidden for launch has no page under src/app", () => {
    expect(HIDDEN_AT_LAUNCH.length).toBeGreaterThan(0);
    const published = HIDDEN_AT_LAUNCH.filter((path) => pageIn("src/app", path));
    expect(published, "move these pages into unannounced/ until they launch").toEqual([]);
  });
});
