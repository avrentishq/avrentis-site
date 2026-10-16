import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { STAGGER_MAX_TOTAL, STAGGER_STEP, fadeUpOnScroll, staggerDelay } from "@/lib/animations";
import { stripComments } from "@/lib/test-support/strip-comments";

/**
 * The shared UI kit holds four patterns that were once copied by hand, and
 * drifted (button heights, eyebrow tracking, glow sizes, stagger lengths):
 *
 *   - the gold call-to-action        → components/ui/button.tsx
 *   - the fade-up-on-scroll props    → lib/animations.ts (fadeUpOnScroll)
 *   - the 60px grid texture          → components/ui/dark-hero-backdrop.tsx
 *   - the uppercase gold eyebrow     → components/ui/section-intro.tsx
 *
 * This test fails on a fresh copy of any of them outside its home.
 */

const SRC = join(process.cwd(), "src");

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file))
    .filter((file) => !file.endsWith(".test.ts"));
}

/** The `{ … }` object literal that encloses `index`. */
function enclosingObject(source: string, index: number): string {
  let depth = 0;
  let start = index;
  for (; start > 0; start--) {
    if (source[start] === "}") depth++;
    else if (source[start] === "{") {
      if (depth === 0) break;
      depth--;
    }
  }
  depth = 0;
  let end = index;
  for (; end < source.length; end++) {
    if (source[end] === "{") depth++;
    else if (source[end] === "}") {
      if (depth === 0) break;
      depth--;
    }
  }
  return source.slice(start, end + 1);
}

function objectsAround(source: string, pattern: RegExp): string[] {
  return [...source.matchAll(pattern)].map((match) => enclosingObject(source, match.index ?? 0));
}

/** A style object painting gold behind a sized, labelled control. */
function goldCtaObjects(source: string): string[] {
  return objectsAround(source, /background(?:Color)?:[^,\n]*"var\(--color-gold\)"/g).filter(
    (object) =>
      /\bheight:/.test(object) &&
      /\bfontSize:/.test(object) &&
      /\b(?:padding|textDecoration|cursor):/.test(object),
  );
}

/** The fade-up variants wired to whileInView by hand. */
function rawFadeUps(source: string): string[] {
  return [
    ...source.matchAll(
      /variants=\{fadeUp\}[^>]*?whileInView=|whileInView="visible"[^>]*?variants=\{fadeUp\}/g,
    ),
  ].map((match) => match[0]);
}

/** The 60px grid texture. */
function gridOverlays(source: string): string[] {
  return [
    ...source.matchAll(
      /backgroundSize:\s*"60px 60px"|linear-gradient\(rgba\(var\(--color-white-rgb\), [\d.]+\) 1px, transparent 1px\)/g,
    ),
  ].map((match) => match[0]);
}

/** An uppercase gold label carrying its own tracking — an eyebrow typed out. */
function eyebrowObjects(source: string): string[] {
  return objectsAround(source, /textTransform:\s*"uppercase"/g).filter(
    (object) =>
      /\bletterSpacing:/.test(object) &&
      /\bcolor:\s*"var\(--color-gold(?:-on-light)?\)"/.test(object) &&
      !/\b(?:background|backgroundColor|border):/.test(object) &&
      !/fontFamily:\s*"var\(--font-mono\)"/.test(object),
  );
}

const HOMES = {
  goldCta: "components/ui/button.tsx",
  grid: "components/ui/dark-hero-backdrop.tsx",
  eyebrow: new Set(["components/ui/section-intro.tsx", "components/ui/button.tsx"]),
};

const files = sourceFiles().map((file) => ({
  file,
  source: stripComments(readFileSync(join(SRC, file), "utf8")),
}));

describe("detectors fire on a copy and stay silent on the shared form", () => {
  it("gold CTA", () => {
    const copy = `style={{ fontSize: "14px", backgroundColor: "var(--color-gold)", height: "44px", padding: "0 22px" }}`;
    expect(goldCtaObjects(copy)).toHaveLength(1);
    expect(goldCtaObjects(`style={{ width: "4px", height: "4px", backgroundColor: "var(--color-gold)" }}`)).toEqual([]);
    expect(goldCtaObjects(`{...buttonProps({ size: "md" })}`)).toEqual([]);
  });

  it("raw fade-up props", () => {
    const copy = `<m.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(1)}>`;
    expect(rawFadeUps(copy)).toHaveLength(1);
    expect(rawFadeUps(`<m.p {...fadeUpOnScroll(1)}>`)).toEqual([]);
  });

  it("grid overlay", () => {
    const copy = `backgroundImage: "linear-gradient(rgba(var(--color-white-rgb), 0.4) 1px, transparent 1px)", backgroundSize: "60px 60px"`;
    expect(gridOverlays(copy)).toHaveLength(2);
    expect(gridOverlays(`<DarkHeroBackdrop grid />`)).toEqual([]);
  });

  it("eyebrow", () => {
    const copy = `style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-gold)" }}`;
    expect(eyebrowObjects(copy)).toHaveLength(1);
    // A tinted badge and a mono kicker are not eyebrows.
    expect(eyebrowObjects(`{ letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-gold)", backgroundColor: "x" }`)).toEqual([]);
    expect(eyebrowObjects(`{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-gold)" }`)).toEqual([]);
    expect(eyebrowObjects(`<Eyebrow surface="dark">Product</Eyebrow>`)).toEqual([]);
  });

  it("comments are not code", () => {
    expect(rawFadeUps(stripComments(`// variants={fadeUp} whileInView="visible"`))).toEqual([]);
    expect(stripComments(`href="https://example.test"`)).toContain("https://example.test");
  });

  it("the scan reaches the homes", () => {
    const source = (path: string) => files.find((entry) => entry.file === path)?.source ?? "";
    // The grid home holds the literal texture, so the detector sees real files.
    expect(gridOverlays(source(HOMES.grid)).length).toBeGreaterThan(0);
    // The button's gold sits in a size-free colour object, which is why the
    // home is allowed rather than relying on the detector missing it.
    expect(source(HOMES.goldCta)).toContain('"var(--color-gold)"');
    expect(source("components/ui/section-intro.tsx")).toContain("EYEBROW_LETTER_SPACING");
  });
});

describe("the UI kit is the only home of its patterns", () => {
  it("no gold CTA style outside button.tsx", () => {
    const offenders = files
      .filter(({ file }) => file !== HOMES.goldCta)
      .flatMap(({ file, source }) => goldCtaObjects(source).map(() => file));
    expect(offenders).toEqual([]);
  });

  it("no hand-typed fade-up-on-scroll props (use fadeUpOnScroll)", () => {
    const offenders = files.flatMap(({ file, source }) => rawFadeUps(source).map(() => file));
    expect(offenders).toEqual([]);
  });

  it("no grid overlay outside dark-hero-backdrop.tsx", () => {
    const offenders = files
      .filter(({ file }) => file !== HOMES.grid)
      .flatMap(({ file, source }) => gridOverlays(source).map(() => file));
    expect(offenders).toEqual([]);
  });

  it("no eyebrow letter-spacing outside section-intro.tsx", () => {
    const offenders = files
      .filter(({ file }) => !HOMES.eyebrow.has(file))
      .flatMap(({ file, source }) => eyebrowObjects(source).map(() => file));
    expect(offenders).toEqual([]);
  });
});

describe("motion stays inside the brand rules", () => {
  it("a stagger never exceeds the documented total", () => {
    expect(staggerDelay(1).delay).toBeCloseTo(STAGGER_STEP);
    expect(staggerDelay(99).delay).toBe(STAGGER_MAX_TOTAL);
    expect(staggerDelay(-1).delay).toBe(0);
  });

  it("fadeUpOnScroll fires once", () => {
    expect(fadeUpOnScroll().viewport.once).toBe(true);
    expect(fadeUpOnScroll(2).transition).toEqual(staggerDelay(2));
  });
});
