import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_FOCUS_RING,
  NON_SURFACE_FILLS,
  SURFACE_FOCUS_CSS,
  SURFACE_FOCUS_RINGS,
  TINT_MAX_ALPHA,
  surfaceStyleFragments,
} from "./surfaces";

/**
 * The focus ring must stand out from the surface it is drawn over: at least
 * 3:1 (WCAG 1.4.11, non-text contrast). Colours are read straight from the
 * @theme tokens in globals.css, so a palette change that weakens any pairing
 * fails here.
 */

const SRC = join(process.cwd(), "src");
const css = readFileSync(join(SRC, "app", "globals.css"), "utf8");
const themeBlock = css.match(/@theme[^{]*\{([\s\S]*?)\n\}/)?.[1] ?? "";
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
  const over = SURFACE_FOCUS_RINGS.find((entry) => entry.surface === surface)?.over;
  if (!over) throw new Error(`${surface} is translucent but names no backdrop (over)`);
  const [top, alpha, beneath] = [rgbOf(token(layer[1]!)), Number(layer[2]), shownColour(over)];
  return top.map((value, index) => value * alpha + beneath[index]! * (1 - alpha)) as Rgb;
}

const OPAQUE_SURFACES = SURFACE_FOCUS_RINGS.filter(({ surface }) => !TRANSLUCENT.test(surface)).map(
  ({ surface }) => tokenName(surface),
);

describe("focus ring contrast, per surface", () => {
  it("the check fails a ring that does not read (one ring for every surface cannot pass)", () => {
    const gold = rgbOf(token("gold"));
    const goldOnLight = rgbOf(token("gold-on-light"));
    expect(contrast(gold, rgbOf(token("white")))).toBeLessThan(3);
    const shown = SURFACE_FOCUS_RINGS.map(({ surface }) => shownColour(surface));
    expect(shown.some((colour) => contrast(goldOnLight, colour) < 3)).toBe(true);
    expect(shown.some((colour) => contrast(gold, colour) < 3)).toBe(true);
  });

  it.each(SURFACE_FOCUS_RINGS.map(({ surface, ring }) => [surface, ring]))(
    "the ring on %s (%s) is at least 3:1",
    (surface, ring) => {
      const ratio = contrast(rgbOf(token(tokenName(ring))), shownColour(surface));
      expect(ratio, `${ring} on ${surface}`).toBeGreaterThanOrEqual(3);
    },
  );

  it("a surface sets the ring for what sits on it, not for itself (a ring is drawn outside)", () => {
    for (const rule of SURFACE_FOCUS_CSS.split("\n")) {
      const selectorList = rule.slice(0, rule.indexOf("{"));
      const selectorCount = selectorList.split("[style*=").length - 1;
      expect(selectorCount).toBeGreaterThan(0);
      expect(selectorList.split('"]>*').length - 1, rule).toBe(selectorCount);
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
      expect(SURFACE_FOCUS_CSS).toContain(`[style*="${fragment}"]>*`);
    }
    expect(surfaceStyleFragments(navy)).toContain("background-color:var(--color-navy-primary)");
    expect(surfaceStyleFragments(navy)).toContain("background-color: var(--color-navy-primary)");
  });
});

describe("every background in the code is a known surface or fill", () => {
  const BACKGROUND_TOKEN = /background(?:Color)?:[^\n]*/g;
  const OPAQUE_TOKEN = /var\(--color-([\w-]+?)\)/g;

  function backgroundTokens(text: string): string[] {
    return [...text.matchAll(BACKGROUND_TOKEN)].flatMap((line) =>
      [...line[0].matchAll(OPAQUE_TOKEN)]
        .map((match) => match[1]!)
        // `…-rgb` channels only appear inside rgba() tints, which are not surfaces.
        .filter((name) => !name.endsWith("-rgb")),
    );
  }

  it("the scan finds an opaque background and skips a translucent tint", () => {
    expect(backgroundTokens('backgroundColor: "var(--color-navy-primary)"')).toEqual(["navy-primary"]);
    expect(backgroundTokens('backgroundColor: "rgba(var(--color-gold-rgb), 0.08)"')).toEqual([]);
  });

  it("no background token is unaccounted for", () => {
    const known = new Set<string>([...OPAQUE_SURFACES, ...NON_SURFACE_FILLS.map(tokenName)]);
    const unknown = new Set<string>();
    for (const file of readdirSync(SRC, { recursive: true, encoding: "utf8" })) {
      if (!/\.tsx?$/.test(file) || /\.test\.ts$/.test(file)) continue;
      for (const name of backgroundTokens(readFileSync(join(SRC, file), "utf8"))) {
        if (!known.has(name)) unknown.add(`${name} (${file})`);
      }
    }
    expect(
      [...unknown],
      "Add the token to SURFACE_FOCUS_RINGS (with its ring) or NON_SURFACE_FILLS in src/lib/surfaces.ts",
    ).toEqual([]);
  });

  it("every strong translucent background is a registered surface", () => {
    const STRONG = /rgba\(var\(--color-[\w-]+-rgb\), ?([0-9.]+)\)/g;
    const registered = new Set(SURFACE_FOCUS_RINGS.map(({ surface }) => surface));
    const unregistered = new Set<string>();
    for (const file of readdirSync(SRC, { recursive: true, encoding: "utf8" })) {
      if (!/\.tsx?$/.test(file) || /\.test\.ts$/.test(file) || file === join("lib", "surfaces.ts")) continue;
      for (const line of readFileSync(join(SRC, file), "utf8").match(BACKGROUND_TOKEN) ?? []) {
        for (const layer of line.matchAll(STRONG)) {
          if (Number(layer[1]) >= TINT_MAX_ALPHA && !registered.has(layer[0])) unregistered.add(`${layer[0]} (${file})`);
        }
      }
    }
    expect([...unregistered], "Register it in SURFACE_FOCUS_RINGS with the surface it sits on").toEqual([]);
  });
});
