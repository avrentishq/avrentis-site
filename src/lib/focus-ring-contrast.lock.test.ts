import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_FOCUS_RING,
  NON_SURFACE_FILLS,
  SURFACE_CSS,
  SURFACES,
  TINT_MAX_ALPHA,
  surfaceStyleFragments,
} from "./surfaces";
import { GLOBALS_CSS, THEME_BLOCK } from "@/lib/test-support/theme-tokens";

/**
 * The focus ring must stand out from the surface it is drawn over: at least
 * 3:1 (WCAG 1.4.11, non-text contrast). Colours are read straight from the
 * @theme tokens in globals.css, so a palette change that weakens any pairing
 * fails here.
 */

const SRC = join(process.cwd(), "src");
const css = GLOBALS_CSS;
const themeBlock = THEME_BLOCK;
/** The token name inside a `var(--color-…)` reference. */
const tokenName = (reference: string): string => reference.slice("var(--color-".length, -1);

const token = (name: string): string => {
  const value = themeBlock.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6});`))?.[1];
  if (!value) throw new Error(`--color-${name} is not a six-digit hex token in @theme`);
  return value;
};

type Rgb = [number, number, number];
const rgbOf = (hex: string): Rgb => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)) as Rgb;

function luminance([red, green, blue]: Rgb): number {
  const channel = (value: number) => {
    const unit = value / 255;
    return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

function contrast(first: Rgb, second: Rgb): number {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light! + 0.05) / (dark! + 0.05);
}

const TRANSLUCENT = /^rgba\(var\(--color-([\w-]+)-rgb\), ?([0-9.]+)\)$/;

/** The colour a registered surface shows: a token, or a translucent layer over its backdrop. */
function shownColour(surface: string): Rgb {
  const layer = surface.match(TRANSLUCENT);
  if (!layer) return rgbOf(token(tokenName(surface)));
  const over = SURFACES.find((entry) => entry.surface === surface)?.over;
  if (!over) throw new Error(`${surface} is translucent but names no backdrop (over)`);
  const [top, alpha, beneath] = [rgbOf(token(layer[1]!)), Number(layer[2]), shownColour(over)];
  return top.map((value, index) => value * alpha + beneath[index]! * (1 - alpha)) as Rgb;
}

const OPAQUE_SURFACES = SURFACES.filter(({ surface }) => !TRANSLUCENT.test(surface)).map(
  ({ surface }) => tokenName(surface),
);

describe("focus ring contrast, per surface", () => {
  it("the check fails a ring that does not read (one ring for every surface cannot pass)", () => {
    const gold = rgbOf(token("gold"));
    const goldOnLight = rgbOf(token("gold-on-light"));
    expect(contrast(gold, rgbOf(token("white")))).toBeLessThan(3);
    const shown = SURFACES.map(({ surface }) => shownColour(surface));
    expect(shown.some((colour) => contrast(goldOnLight, colour) < 3)).toBe(true);
    expect(shown.some((colour) => contrast(gold, colour) < 3)).toBe(true);
  });

  it.each(SURFACES.map(({ surface, ring }) => [surface, ring]))(
    "the ring on %s (%s) is at least 3:1",
    (surface, ring) => {
      const ratio = contrast(rgbOf(token(tokenName(ring))), shownColour(surface));
      expect(ratio, `${ring} on ${surface}`).toBeGreaterThanOrEqual(3);
    },
  );

  it.each(SURFACES.map(({ surface, tone }) => [surface, tone]))(
    "the %s surface's grey text (%s tone) is at least 4.5:1",
    (surface, tone) => {
      const grey = rgbOf(token(`text-secondary-on-${tone}`));
      expect(contrast(grey, shownColour(surface)), `${tone} grey on ${surface}`).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("the tone check fails the wrong grey (the light grey on ink is the bug it exists to stop)", () => {
    expect(contrast(rgbOf(token("text-secondary-on-light")), rgbOf(token("navy-primary")))).toBeLessThan(4.5);
    expect(SURFACE_CSS).toContain("--color-text-muted:var(--color-text-secondary-on-dark)");
  });

  it("a surface sets the ring for what sits on it, and the greys for itself", () => {
    const rules = SURFACE_CSS.split("\n");
    expect(rules).toHaveLength(SURFACES.length * 2);
    for (const rule of rules) {
      const selectorList = rule.slice(0, rule.indexOf("{"));
      const selectorCount = selectorList.split("[style*=").length - 1;
      expect(selectorCount).toBeGreaterThan(0);
      // A ring is drawn outside, over the parent's fill: children only. Text sits
      // on the element's own fill: the element itself (and it inherits down).
      const childSelectors = selectorList.split('"]>*').length - 1;
      expect(childSelectors, rule).toBe(rule.includes("--focus-ring") ? selectorCount : 0);
    }
  });

  it("the page's default ring (globals.css :root) is the registry's default", () => {
    const rootRing = css.match(/:root\s*\{[^}]*--focus-ring:\s*var\(--color-([\w-]+)\)/)?.[1];
    expect(rootRing).toBe(tokenName(DEFAULT_FOCUS_RING));
  });

  it("every focus outline in globals.css draws from --focus-ring", () => {
    const outlines = [...css.matchAll(/outline:\s*2px solid ([^;]+);/g)].map((match) => match[1]);
    expect(outlines.length).toBeGreaterThan(0);
    expect(outlines.every((colour) => colour === "var(--focus-ring)")).toBe(true);
  });

  it("the generated CSS covers both the server's and the browser's spelling of each surface", () => {
    const navy = "var(--color-navy-primary)";
    for (const fragment of surfaceStyleFragments(navy)) {
      expect(SURFACE_CSS).toContain(`[style*="${fragment}"]>*`);
    }
    expect(surfaceStyleFragments(navy)).toContain("background-color:var(--color-navy-primary)");
    expect(surfaceStyleFragments(navy)).toContain("background-color: var(--color-navy-primary)");
  });
});

describe("every background in the code is a known surface or fill", () => {
  // A style object's `background`/`backgroundColor`, or a stylesheet's `background`/`background-color`.
  const BACKGROUND_TOKEN = /background(?:Color|-color)?:[^\n]*/g;
  const OPAQUE_TOKEN = /var\(--color-([\w-]+?)\)/g;

  /** Tint tokens (`--color-gold-ghost: rgba(…, 0.08)`): translucent like an inline tint, so not surfaces — when faint. */
  const TINT_TOKENS = new Map(
    [...themeBlock.matchAll(/--color-([\w-]+):\s*(rgba\([^;]+\));/g)].map((match) => [match[1]!, match[2]!.trim()]),
  );
  const isFaintTint = (name: string): boolean => {
    const layer = TINT_TOKENS.get(name)?.match(TRANSLUCENT);
    return !!layer && Number(layer[2]) < TINT_MAX_ALPHA;
  };

  function backgroundTokens(text: string): string[] {
    return [...text.matchAll(BACKGROUND_TOKEN)].flatMap((line) =>
      [...line[0].matchAll(OPAQUE_TOKEN)]
        .map((match) => match[1]!)
        // `…-rgb` channels only appear inside rgba() tints, which are not surfaces.
        .filter((name) => !name.endsWith("-rgb") && !isFaintTint(name)),
    );
  }

  it("the scan finds an opaque background and skips a translucent tint", () => {
    expect(backgroundTokens('backgroundColor: "var(--color-navy-primary)"')).toEqual(["navy-primary"]);
    expect(backgroundTokens("  background-color: var(--color-navy-primary);")).toEqual(["navy-primary"]);
    expect(backgroundTokens('backgroundColor: "rgba(var(--color-gold-rgb), 0.08)"')).toEqual([]);
    expect(backgroundTokens('backgroundColor: "var(--color-gold-ghost)"')).toEqual([]);
    // A tint token at or above the surface threshold is a surface and must be registered.
    expect(isFaintTint("danger-invalid")).toBe(false);
  });

  it("every tint token is a translucent layer of a defined colour", () => {
    expect(TINT_TOKENS.size).toBeGreaterThan(0);
    for (const [name, value] of TINT_TOKENS) {
      const layer = value.match(TRANSLUCENT);
      expect(layer, `--color-${name}: ${value}`).not.toBeNull();
      expect(themeBlock, `--color-${name} layers --color-${layer![1]}-rgb`).toContain(`--color-${layer![1]}-rgb:`);
    }
  });

  it("no background token is unaccounted for (components and stylesheets)", () => {
    const known = new Set<string>([...OPAQUE_SURFACES, ...NON_SURFACE_FILLS.map(tokenName)]);
    const unknown = new Set<string>();
    const scanned: string[] = [];
    for (const file of readdirSync(SRC, { recursive: true, encoding: "utf8" })) {
      if (!/\.(tsx?|css)$/.test(file) || /\.test\.ts$/.test(file)) continue;
      scanned.push(file);
      const text = readFileSync(join(SRC, file), "utf8");
      // The @theme block defines tokens; it paints nothing.
      const painted = file.endsWith(".css") ? text.replace(themeBlock, "") : text;
      for (const name of backgroundTokens(painted)) {
        if (!known.has(name)) unknown.add(`${name} (${file})`);
      }
    }
    expect(scanned).toContain(join("app", "globals.css"));
    expect(
      [...unknown],
      "Add the token to SURFACES (with its ring) or NON_SURFACE_FILLS in src/lib/surfaces.ts",
    ).toEqual([]);
  });

  it("every strong translucent background is a registered surface", () => {
    const STRONG = /rgba\(var\(--color-[\w-]+-rgb\), ?([0-9.]+)\)/g;
    const registered = new Set(SURFACES.map(({ surface }) => surface));
    const unregistered = new Set<string>();
    for (const file of readdirSync(SRC, { recursive: true, encoding: "utf8" })) {
      if (!/\.tsx?$/.test(file) || /\.test\.ts$/.test(file) || file === join("lib", "surfaces.ts")) continue;
      for (const line of readFileSync(join(SRC, file), "utf8").match(BACKGROUND_TOKEN) ?? []) {
        for (const layer of line.matchAll(STRONG)) {
          if (Number(layer[1]) >= TINT_MAX_ALPHA && !registered.has(layer[0])) unregistered.add(`${layer[0]} (${file})`);
        }
      }
    }
    expect([...unregistered], "Register it in SURFACES with the surface it sits on").toEqual([]);
  });
});

describe("no focus ring fades in", () => {
  // `transition: all` (or Tailwind's transition-all) also animates outline-color
  // and outline-width, so a ring fades in from the text colour on focus. Name
  // the properties that actually change instead.
  const ANIMATES_EVERYTHING = /transition:\s*["'`]all\b|\btransition-all\b/;

  it("the detector catches both spellings", () => {
    expect(ANIMATES_EVERYTHING.test('transition: "all 150ms ease",')).toBe(true);
    expect(ANIMATES_EVERYTHING.test('className="transition-all"')).toBe(true);
    expect(ANIMATES_EVERYTHING.test('transition: "background-color 150ms ease",')).toBe(false);
  });

  it("nothing animates every property", () => {
    const offenders = readdirSync(SRC, { recursive: true, encoding: "utf8" })
      .filter((file) => /\.(tsx?|css)$/.test(file) && !/\.test\.ts$/.test(file))
      .filter((file) => ANIMATES_EVERYTHING.test(readFileSync(join(SRC, file), "utf8")));
    expect(offenders).toEqual([]);
  });
});
