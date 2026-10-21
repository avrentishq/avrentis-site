/**
 * WCAG 2.x contrast maths — the one copy, shared by the browser contrast check
 * (`check-contrast.mjs`) and the token lock tests (`src/lib/*.lock.test.ts`).
 *
 * Plain JavaScript on purpose: the check runs under bare `node`, and the same
 * functions are serialised into the page it measures (see
 * `CONTRAST_SOURCE_FOR_BROWSER`), so the numbers a test asserts and the numbers
 * the browser check reports can never be computed two different ways.
 */

/** Relative luminance of an sRGB colour, channels 0–255 (WCAG 2.x). */
export function relativeLuminance([red, green, blue]) {
  const channel = (value) => {
    const unit = value / 255;
    return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

/** Contrast ratio between two opaque colours, 1–21. */
export function contrastRatio(first, second) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

/** A colour painted at `alpha` over an opaque `under`. */
export function composite(colour, alpha, under) {
  return colour.map((channel, index) => channel * alpha + under[index] * (1 - alpha));
}

/**
 * The ratio text needs (WCAG 1.4.3, level AA): 4.5:1, or 3:1 for large text —
 * at least 24px, or at least 18.66px (14pt) when bold.
 */
export function requiredRatio(fontSizePx, fontWeight) {
  const large = fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
  return large ? 3 : 4.5;
}

/**
 * The ratio a run of text actually gets over a varied background: the value
 * that `share` of its area falls at or below (default 10%). A flat surface
 * gives one value; a gradient or image gives the bad end of its range, so text
 * that crosses a bright patch fails even when it reads on average.
 */
export function ratioAtShare(ratios, share = 0.1) {
  if (ratios.length === 0) return Number.NaN;
  const sorted = [...ratios].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * share))];
}

/** The functions above, as source to define inside a browser page. */
export const CONTRAST_SOURCE_FOR_BROWSER = [relativeLuminance, contrastRatio, composite, requiredRatio, ratioAtShare]
  .map((fn) => fn.toString())
  .join("\n");
