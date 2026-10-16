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
 *   - every .svg under public/ — static images (favicon, logo files) cannot read a
 *     token either; every colour in them must be one of core's brand colours
 *     (or white), so a brand change cannot leave a stale icon behind.
 */
const SRC = join(process.cwd(), "src");
const ALLOWED = new Set(["lib/static-colors.ts"]);

const HEX = /(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;
const FUNCTIONAL = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(\s*[-\d.]|\bcolor\(\s*(?:srgb|display-p3|rec2020|a98-rgb|prophoto-rgb|xyz)/;
/** CSS named colours (CSS Color 4), matched only where a colour value goes. */
const NAMED_COLOURS =
  "aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen";
/** A colour-bearing property (style object, CSS declaration or SVG/JSX attribute) whose value names a colour. */
const NAMED = new RegExp(
  String.raw`(?:\b(?:color|background|backgroundColor|background-color|border\w*|border-[\w-]*|outline\w*|outline-[\w-]*|fill|stroke|stop-color|stopColor|boxShadow|box-shadow|textShadow|text-shadow|textDecorationColor|text-decoration-color|caretColor|caret-color|accentColor|accent-color)\s*[:=]\s*["'\x60{]?[^;\n"'\x60}]*?)(?<![-\w#.])(?:${NAMED_COLOURS})\b(?![-\w(])`,
);

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
    // Named colours read like prose, so comment lines are skipped for them only.
    const isComment = /^\s*(?:\*|\/\/|\/\*)/.test(line);
    const match = line.match(HEX) ?? line.match(FUNCTIONAL) ?? (isComment ? null : line.match(NAMED));
    if (match) found.push(`src/${file}:${index + 1}  ${match[0]}`);
  });
  return found;
}

const hexToTriplet = (hex: string) =>
  [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)).join(", ");

/** A token's value with `var(--color-…)` references followed to the end. */
function resolved(name: string): string | undefined {
  const value = TOKENS.get(name);
  const reference = value?.match(/^var\(--color-([\w-]+)\)$/);
  return reference ? resolved(reference[1]!) : value;
}

/** camelCase → kebab-case: a STATIC_COLORS key → the token it mirrors. */
const kebab = (key: string) => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const PUBLIC = join(process.cwd(), "public");
const svgFiles = () =>
  readdirSync(PUBLIC, { recursive: true, encoding: "utf8" }).filter((file) => file.endsWith(".svg"));

/** Colours a static SVG may use: core's brand colours and white, as hex and as an rgb triplet. */
const SVG_ALLOWED = [...Object.values(BRAND_COLORS), TOKENS.get("white")!].map((hex) => hex.toLowerCase());
const SVG_COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\([^)]*\)/g;

/** Colours in an SVG that are not a brand colour (alpha allowed on an rgba of one). */
function offBrandSvgColours(svg: string): string[] {
  const offenders = [...svg.matchAll(SVG_COLOUR)]
    .map((match) => match[0])
    .filter((colour) => {
      if (colour.startsWith("#")) return !SVG_ALLOWED.includes(colour.toLowerCase());
      const rgb = colour.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$/);
      return !rgb || !SVG_ALLOWED.map(hexToTriplet).includes(`${rgb[1]}, ${rgb[2]}, ${rgb[3]}`);
    });
  const named = svg.match(new RegExp(String.raw`\b(?:fill|stroke|stop-color|color)\s*[=:]\s*["']?(?:${NAMED_COLOURS})\b`, "g"));
  return [...offenders, ...(named ?? [])];
}

describe("colours come from theme tokens", () => {
  it("the detector catches literals and ignores what is not a colour", () => {
    expect(literals("x.tsx", 'color: "#0f172a"')).toHaveLength(1);
    expect(literals("x.tsx", 'border: "1px solid #E2E8F0"')).toHaveLength(1);
    expect(literals("x.tsx", 'bg: "rgba(4,120,87,0.08)"')).toHaveLength(1);
    expect(literals("x.tsx", 'hsl(210 40% 98%)')).toHaveLength(1);
    expect(literals("x.tsx", 'color: "oklch(0.7 0.1 80)"')).toHaveLength(1);
    expect(literals("x.tsx", 'color: "lab(52% 40 60)"')).toHaveLength(1);
    expect(literals("x.tsx", 'color: "color(display-p3 1 0 0)"')).toHaveLength(1);
    expect(literals("x.tsx", 'color: "white"')).toHaveLength(1);
    expect(literals("x.tsx", 'border: "1px solid black"')).toHaveLength(1);
    expect(literals("x.tsx", '<X color="red" />')).toHaveLength(1);
    expect(literals("x.css", "  background-color: white;")).toHaveLength(1);
    expect(literals("x.tsx", 'variant: "gold", label: "Red flags"')).toEqual([]);
    expect(literals("x.tsx", 'color: "var(--color-white)"')).toEqual([]);
    expect(literals("x.tsx", 'borderColor: "transparent", color: "currentColor"')).toEqual([]);
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
    expect(TOKENS.get("navy-primary")).toBe(BRAND_COLORS.navy);
  });

  it("the logo aliases point at the brand tokens, never a second copy of the value", () => {
    expect(TOKENS.get("accent")).toBe("var(--color-gold)");
    expect(TOKENS.get("primary-800")).toBe("var(--color-navy-primary)");
    expect(TOKENS.get("shell")).toBe("var(--color-navy-primary)");
    expect(resolved("accent")).toBe(BRAND_COLORS.gold);
    expect(resolved("primary-800")).toBe(BRAND_COLORS.navy);
    expect(resolved("logo-mark")).toBe(BRAND_COLORS.navy);
  });

  it("static colours (email, OG image) equal the tokens they mirror", () => {
    const keys = Object.keys(STATIC_COLORS) as (keyof typeof STATIC_COLORS)[];
    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      expect(STATIC_COLORS[key], `STATIC_COLORS.${key} mirrors --color-${kebab(key)}`).toBe(TOKENS.get(kebab(key)));
    }
  });

  it("the SVG check catches an off-brand colour and passes the brand ones", () => {
    expect(svgFiles()).toContain("favicon.svg");
    expect(offBrandSvgColours('<rect fill="#C68B2F" stroke="rgba(15,23,42,0.25)"/>')).toEqual([]);
    expect(offBrandSvgColours('<rect fill="#c68b30"/>')).toEqual(["#c68b30"]);
    expect(offBrandSvgColours('<rect fill="rgba(16,23,42,0.25)"/>')).toHaveLength(1);
    expect(offBrandSvgColours('<rect fill="oklch(0.7 0.1 80)"/>')).toHaveLength(1);
    expect(offBrandSvgColours('<rect fill="red"/>')).toHaveLength(1);
    expect(offBrandSvgColours('<rect fill="none"/>')).toEqual([]);
  });

  it("every colour in a static SVG (favicon, logo files) is a core brand colour", () => {
    const offenders = svgFiles().flatMap((file) =>
      offBrandSvgColours(readFileSync(join(PUBLIC, file), "utf8")).map((colour) => `public/${file}  ${colour}`),
    );
    expect(offenders, "Use core's BRAND_COLORS values (gold, navy) or white in static SVGs").toEqual([]);
  });
});
