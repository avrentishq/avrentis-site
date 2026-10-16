import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Z_INDEX } from "@/lib/layers";
import { stripComments, stripCommentsFor } from "@/lib/test-support/strip-comments";

/**
 * Every repeated design value has one home, and a typed copy fails here:
 *
 *   - font family  → `var(--font-sans | --font-mono | --font-wordmark | --font-signature)`
 *                    (and only to switch away from the sans the body sets)
 *   - font size    → `var(--text-…)` / a `text-…` utility from the @theme scale
 *   - radius       → `var(--radius-…)`
 *   - page width   → `var(--layout-max-width)` (never a typed 1200px / 1100px)
 *   - stacking     → `Z_INDEX` in lib/layers.ts
 *   - brand colour → a token; BRAND_COLORS stays in lib/brand.ts and lib/static-colors.ts
 *   - media query  → `MEDIA_QUERIES` through lib/hooks (no raw matchMedia)
 *
 * Exempt: renderers that cannot read CSS variables — outbound email HTML
 * (lib/email-html.ts, server actions that build email) and the Open Graph
 * image (app/opengraph-image.tsx) — plus lib/static-colors.ts, which holds
 * their values.
 */

const SRC = join(process.cwd(), "src");
const NO_CSS_VARIABLES = new Set([
  join("lib", "static-colors.ts"),
  join("lib", "email-html.ts"),
  join("app", "opengraph-image.tsx"),
]);
const isExempt = (file: string) => NO_CSS_VARIABLES.has(file) || file.endsWith("actions.ts");

const globalsCss = readFileSync(join(SRC, "app", "globals.css"), "utf8");
const themeBlock = globalsCss.match(/@theme[^{]*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const definedTokens = new Set([...themeBlock.matchAll(/(--[\w-]+):/g)].map((match) => match[1]!));

const files = readdirSync(SRC, { recursive: true, encoding: "utf8" })
  .filter((file) => /\.(tsx?|css)$/.test(file) && !file.endsWith(".test.ts"))
  .map((file) => {
    const raw = readFileSync(join(SRC, file), "utf8");
    const withoutTheme = file === join("app", "globals.css") ? raw.replace(themeBlock, "") : raw;
    return { file, source: stripCommentsFor(file, withoutTheme) };
  });

/** The value expression after `property:` (or `property=` / `property =`), up to the end of the entry. */
function expressions(source: string, property: string): string[] {
  return [...source.matchAll(new RegExp(String.raw`\b${property}\s*[:=]\s*([^,}\n;]+)`, "g"))].map(
    (match) => match[1]!,
  );
}

/**
 * Typed lengths in a value expression: a quoted number (with or without a unit)
 * anywhere, or a bare number as the whole value or a ternary branch. Arithmetic
 * on a prop (`size / 2`) is geometry, not a typed size.
 */
function typedValues(expression: string): string[] {
  const quoted = [...expression.matchAll(/(["'`])\s*-?\d+(?:\.\d+)?(?:px|rem|%)?\s*\1/g)].map((match) => match[0]);
  const bare = [...expression.matchAll(/(?:^|[?:])\s*(-?\d+(?:\.\d+)?)\s*(?=:|$)/g)].map((match) => match[1]!);
  return [...quoted, ...bare];
}

const detectors = {
  fontFamily(source: string): string[] {
    const named = source.match(/["'`][^"'`\n]*\b(?:IBM Plex Mono|Archivo|Helvetica|Dancing Script|Courier New|Cabinet Grotesk)\b/g) ?? [];
    const inline = expressions(source, "fontFamily").filter((expression) =>
      [...expression.matchAll(/(["'`])([^"'`]*)\1/g)].some(([, , value]) => !/^var\(--font-[\w-]+\)$/.test(value!)),
    );
    const css = (source.match(/font-family:\s*[^;}\n]+/g) ?? []).filter((declaration) => !/:\s*var\(--font-[\w-]+\)\s*$/.test(declaration));
    return [...named, ...inline, ...css];
  },
  borderRadius(source: string): string[] {
    const inline = expressions(source, "borderRadius").filter((expression) =>
      typedValues(expression).some((value) => !/^["'`]?0["'`]?$/.test(value)),
    );
    const css = (source.match(/border(?:-[a-z]+)*-radius:\s*[^;}\n]+/g) ?? []).filter((declaration) => /:\s*\d/.test(declaration));
    return [...inline, ...css];
  },
  fontSize(source: string): string[] {
    const inline = expressions(source, "fontSize").filter((expression) => typedValues(expression).length > 0);
    const css = (source.match(/font-size:\s*[^;}\n]+/g) ?? []).filter((declaration) => /:\s*\d+(?:\.\d+)?(?:px|rem)\b/.test(declaration));
    const utilities = source.match(/\btext-\[\d+(?:\.\d+)?(?:px|rem)\]/g) ?? [];
    return [...inline, ...css, ...utilities];
  },
  pageWidth(source: string): string[] {
    return source.match(/\b1[12]00px\b|maxWidth:\s*1[12]00\b|max-w-\[1[12]00px\]/g) ?? [];
  },
  zIndex(source: string): string[] {
    return source.match(/zIndex:\s*-?\d+|z-index:\s*-?\d+|\bz-(?:\[\d+\]|\d+)\b/g) ?? [];
  },
  brandColors(source: string): string[] {
    return source.match(/\bBRAND_COLORS\b/g) ?? [];
  },
  matchMedia(source: string): string[] {
    return source.match(/\bmatchMedia\s*\??\.?\s*\(/g) ?? [];
  },
};

type DetectorName = keyof typeof detectors;

/** Files a detector does not apply to, besides the no-CSS-variable renderers. */
const HOMES: Record<DetectorName, (file: string) => boolean> = {
  fontFamily: isExempt,
  borderRadius: isExempt,
  fontSize: isExempt,
  pageWidth: isExempt,
  // globals.css's `.skip-link` mirrors Z_INDEX.overlay — asserted below.
  zIndex: (file) => file === join("lib", "layers.ts") || file === join("app", "globals.css"),
  brandColors: (file) => file === join("lib", "brand.ts") || file === join("lib", "static-colors.ts"),
  matchMedia: (file) => file.startsWith(`${join("lib", "hooks")}/`),
};

describe("the detectors fire on a typed value and stay silent on a token", () => {
  const cases: Record<DetectorName, { fires: string[]; silent: string[] }> = {
    fontFamily: {
      fires: [
        `fontFamily: "'IBM Plex Mono', monospace"`,
        `const mono = "'IBM Plex Mono', monospace";`,
        `fontFamily: "Archivo, sans-serif"`,
        `fontFamily: 'Helvetica'`,
        `fontFamily: isCode ? "monospace" : "var(--font-sans)"`,
        `  font-family: 'IBM Plex Mono', monospace;`,
      ],
      silent: [`fontFamily: "var(--font-mono)"`, `fontFamily: code ? "var(--font-mono)" : undefined`, `  font-family: var(--font-mono);`, `import { Archivo } from "next/font/google";`],
    },
    borderRadius: {
      fires: [`borderRadius: "6px"`, `borderRadius: 8`, `borderRadius: open ? "10px" : "var(--radius-pill)"`, `borderRadius: "50%"`, `  border-radius: 3px;`, `  border-top-left-radius: 4px;`],
      silent: [`borderRadius: "var(--radius-md)"`, `borderRadius: scrolled ? "var(--radius-pill)" : "0"`, `borderRadius: RADIUS[shape]`, `  border-radius: var(--radius-xs);`],
    },
    fontSize: {
      fires: [`fontSize: "12px"`, `fontSize: 16`, `fontSize: featured ? "30px" : "var(--text-heading-md)"`, `fontSize = "11px",`, `fontSize="12px"`, `  font-size: 14px;`, `className="lg:!text-[42px]"`],
      silent: [`fontSize: "var(--text-xs)"`, `fontSize: size * WORDMARK_SPEC.sizeFactor`, "fontSize: `${size / 2}px`", `  font-size: 0.9em;`, `className="lg:!text-display-lg"`],
    },
    pageWidth: {
      fires: [`maxWidth: "1200px"`, `maxWidth: "1100px"`, `maxWidth: 1200`, `className="max-w-[1100px]"`],
      silent: [`maxWidth: "var(--layout-max-width)"`, `maxWidth: "920px"`],
    },
    zIndex: {
      fires: [`zIndex: 50`, `zIndex: -1`, `  z-index: 100;`, `className="z-50"`],
      silent: [`zIndex: Z_INDEX.header`, `className="lg:order-none"`],
    },
    brandColors: {
      fires: [`<Icon color={BRAND_COLORS.gold} />`, `import { BRAND_COLORS } from "@/lib/brand";`],
      silent: [`<Icon color="var(--color-gold)" />`],
    },
    matchMedia: {
      fires: [`window.matchMedia("(max-width: 720px)")`, `window.matchMedia?.("(prefers-reduced-motion: reduce)")`],
      silent: [`useMediaQuery("compact")`, `isReducedMotion()`],
    },
  };

  it.each(Object.keys(cases) as DetectorName[])("%s", (name) => {
    for (const sample of cases[name].fires) expect(detectors[name](sample), `${name} misses ${sample}`).not.toEqual([]);
    for (const sample of cases[name].silent) expect(detectors[name](sample), `${name} flags ${sample}`).toEqual([]);
  });

  it("comments are not code", () => {
    expect(detectors.fontSize(stripComments(`// was fontSize: "12px"\n/* borderRadius: "6px" */`))).toEqual([]);
    expect(detectors.borderRadius(stripComments(`{/* borderRadius: "6px" */}`))).toEqual([]);
    expect(stripComments(`href="https://example.com"`)).toContain("example.com");
  });

  it("the walk sees known files", () => {
    const scanned = files.map(({ file }) => file);
    expect(scanned).toContain(join("components", "sections", "hero.tsx"));
    expect(scanned).toContain(join("app", "globals.css"));
  });
});

describe("no typed design value outside its home", () => {
  it.each(Object.keys(detectors) as DetectorName[])("%s", (name) => {
    const offenders = files
      .filter(({ file }) => !HOMES[name](file))
      .flatMap(({ file, source }) => detectors[name](source).map((found) => `src/${file}  ${found.trim()}`));
    expect(offenders, `Use the token or constant for ${name} (see the header of design-tokens.lock.test.ts)`).toEqual([]);
  });

  it("the skip link's z-index in globals.css is Z_INDEX.overlay, and it is the only one", () => {
    const values = [...globalsCss.matchAll(/z-index:\s*(-?\d+)/g)].map((match) => Number(match[1]));
    expect(values).toEqual([Z_INDEX.overlay]);
    expect(globalsCss).toMatch(new RegExp(String.raw`\.skip-link\s*\{[^}]*z-index:\s*${Z_INDEX.overlay};`));
  });
});

describe("every design token the site reads is defined in @theme", () => {
  const READ = /var\((--(?:text|radius|font|layout|measure)-[\w-]+)\)/g;
  const CLASS_LIST = /className=(?:"([^"]*)"|\{`([^`]*)`\})/g;
  /** Tailwind's own `text-*` utilities that are not a size or a colour. */
  const TEXT_KEYWORDS = new Set(["left", "center", "right", "justify", "start", "end", "wrap", "nowrap", "balance", "pretty", "ellipsis", "clip"]);

  it("the class-list scan finds a size utility", () => {
    const sample = 'className="lg:!text-display-lg text-center"';
    const found = [...sample.matchAll(CLASS_LIST)].flatMap(([, quoted]) => [...quoted!.matchAll(/(?:^|[\s:!])text-([\w-]+)/g)].map((match) => match[1]));
    expect(found).toEqual(["display-lg", "center"]);
  });

  it("written out in full and defined", () => {
    const problems: string[] = [];
    for (const { file, source } of files) {
      if (/var\(--(?:text|radius|layout|measure)-\$\{/.test(source)) problems.push(`src/${file}: token name built at runtime`);
      for (const [, name] of source.matchAll(READ)) {
        // next/font injects --font-archivo and friends at runtime; @theme defines the families on top.
        if (/^--font-(?:archivo|ibm-plex-mono|cabinet-grotesk)$/.test(name!)) continue;
        if (!definedTokens.has(name!)) problems.push(`src/${file}: ${name} is not defined in @theme`);
      }
      for (const [, quoted, template] of source.matchAll(CLASS_LIST)) {
        for (const [, utility] of (quoted ?? template ?? "").matchAll(/(?:^|[\s:!])text-([\w-]+)/g)) {
          const known = TEXT_KEYWORDS.has(utility!) || definedTokens.has(`--text-${utility}`) || definedTokens.has(`--color-${utility}`);
          if (!known) problems.push(`src/${file}: text-${utility} is neither on the type scale nor a colour token`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("the type scale is closed: Tailwind's default sizes are reset", () => {
    expect(themeBlock).toMatch(/--text-\*:\s*initial;/);
    expect(definedTokens.has("--text-xs")).toBe(true);
  });
});
