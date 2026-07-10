import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";

// Lock test: every `SECTION_BACKDROPS.<key>` used anywhere in src must resolve
// to a real key. A mistyped key is `undefined` at runtime → SectionBackdrop
// 500s the page, and the Turbopack dev server doesn't run tsc to catch it — so
// this fails `pnpm test` instead of the browser.

const SRC = join(process.cwd(), "src");
const REFERENCE = /SECTION_BACKDROPS\.([A-Za-z0-9_]+)/g;

function collectReferences(): Map<string, string[]> {
  const found = new Map<string, string[]>(); // key -> files referencing it
  for (const file of readdirSync(SRC, { recursive: true, encoding: "utf8" })) {
    if (!/\.(tsx|ts)$/.test(file) || file.endsWith(".test.ts")) continue;
    const content = readFileSync(join(SRC, file), "utf8");
    for (const match of content.matchAll(REFERENCE)) {
      const key = match[1]!;
      found.set(key, [...(found.get(key) ?? []), file]);
    }
  }
  return found;
}

describe("SECTION_BACKDROPS key references", () => {
  const references = collectReferences();
  const validKeys = new Set(Object.keys(SECTION_BACKDROPS));

  it("finds references to scan (guards against a broken scanner)", () => {
    expect(references.size).toBeGreaterThan(10);
  });

  it("every referenced key exists in the registry", () => {
    const missing = [...references.entries()]
      .filter(([key]) => !validKeys.has(key))
      .map(([key, files]) => `${key} (used in ${files.join(", ")})`);
    expect(missing, `unknown SECTION_BACKDROPS keys:\n${missing.join("\n")}`).toEqual([]);
  });
});
