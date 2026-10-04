import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { BRAND_COLORS } from "@/lib/brand";
import { STATIC_COLORS } from "@/lib/static-colors";

/**
 * Every colour on the site is a token in the @theme block of globals.css,
 * read as var(--color-…). A colour typed out anywhere else is a second source
 * of truth that drifts the day the palette changes (there were 1,300+).
 *
 * Allowed to hold colour values, and why:
 *   - app/globals.css, inside @theme — that IS the token definition.
 *   - lib/static-colors.ts — email HTML and the OG image are rendered where
 *     CSS variables do not resolve; their values are checked against the tokens.
 */
const SRC = join(process.cwd(), "src");
const ALLOWED = new Set(["lib/static-colors.ts"]);

const HEX = /(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;
const FUNCTIONAL = /\b(?:rgba?|hsla?)\(\s*\d/;

const globalsCss = readFileSync(join(SRC, "app", "globals.css"), "utf8");
const themeBlock = globalsCss.match(/@theme[^{]*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const TOKENS = new Map(
  [...themeBlock.matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
);

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(tsx?|css)$/.test(file))
    .filter((file) => !file.endsWith(".test.ts"));
}

/** Colour literals in `text`, ignoring the @theme block of globals.css. */
function literals(file: string, text: string): string[] {
  const scanned = file === join("app", "globals.css") ? text.replace(themeBlock, "") : text;
  const found: string[] = [];
  scanned.split("\n").forEach((line, index) => {
    const match = line.match(HEX) ?? line.match(FUNCTIONAL);
    if (match) found.push(`src/${file}:${index + 1}  ${match[0]}`);
  });
  return found;
}

const hexToTriplet = (hex: string) =>
  [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)).join(", ");

describe("colours come from theme tokens", () => {
  it("the detector catches literals and ignores what is not a colour", () => {
    expect(literals("x.tsx", 'color: "#0f172a"')).toHaveLength(1);
    expect(literals("x.tsx", 'border: "1px solid #E2E8F0"')).toHaveLength(1);
    expect(literals("x.tsx", 'bg: "rgba(4,120,87,0.08)"')).toHaveLength(1);
    expect(literals("x.tsx", 'hsl(210 40% 98%)')).toHaveLength(1);
    expect(literals("x.tsx", 'bg: "rgba(var(--color-success-rgb), 0.08)"')).toEqual([]);
    expect(literals("x.tsx", '<a href="#main">')).toEqual([]);
    expect(literals("x.tsx", "dash &#8212; here")).toEqual([]);
  });

  it("scans the site (proves the walk sees a known file)", () => {
    expect(sourceFiles()).toContain(join("components", "sections", "hero.tsx"));
    expect(TOKENS.get("text-primary")).toBe("#0f172a");
  });

  it("no hard-coded colour outside the token definitions", () => {
    const offenders = sourceFiles()
      .filter((file) => !ALLOWED.has(file))
      .flatMap((file) => literals(file, readFileSync(join(SRC, file), "utf8")));
    expect(
      offenders,
      "Use a token: var(--color-…) for a colour, rgba(var(--color-…-rgb), alpha) for a tint. " +
        "Add a role-named token to the @theme block in globals.css only for a genuinely new colour.\n" +
        offenders.join("\n"),
    ).toEqual([]);
  });

  it("every var(--color-…) the site reads is a defined token, written out in full", () => {
    const problems: string[] = [];
    for (const file of sourceFiles()) {
      const text = readFileSync(join(SRC, file), "utf8");
      if (/var\(--color-\$\{/.test(text)) problems.push(`src/${file}: token name built at runtime`);
      for (const [, name] of text.matchAll(/var\(--color-([\w-]+)\)/g)) {
        if (!TOKENS.has(name)) problems.push(`src/${file}: --color-${name} is not defined`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("each -rgb triplet matches its colour, and brand tokens match core", () => {
    for (const [name, value] of TOKENS) {
      if (!name.endsWith("-rgb")) continue;
      const base = TOKENS.get(name.slice(0, -"-rgb".length));
      if (base?.startsWith("#")) expect(value, `--color-${name}`).toBe(hexToTriplet(base));
    }
    expect(TOKENS.get("gold")).toBe(BRAND_COLORS.gold);
    expect(TOKENS.get("accent")).toBe(BRAND_COLORS.gold);
    expect(TOKENS.get("navy-primary")).toBe(BRAND_COLORS.navy);
  });

  it("static colours (email, OG image) equal the tokens they mirror", () => {
    expect(STATIC_COLORS.textPrimary).toBe(TOKENS.get("text-primary"));
    expect(STATIC_COLORS.textMuted).toBe(TOKENS.get("text-muted"));
    expect(STATIC_COLORS.textSubtle).toBe(TOKENS.get("text-subtle"));
    expect(STATIC_COLORS.white).toBe(TOKENS.get("white"));
    expect(STATIC_COLORS.gold).toBe(TOKENS.get("gold"));
    expect(STATIC_COLORS.navy).toBe(TOKENS.get("navy-primary"));
  });
});
