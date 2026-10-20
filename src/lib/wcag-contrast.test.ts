import { describe, expect, it } from "vitest";

import {
  CONTRAST_SOURCE_FOR_BROWSER,
  composite,
  contrastRatio,
  ratioAtShare,
  requiredRatio,
} from "../../scripts/wcag-contrast.mjs";

/**
 * The contrast maths behind `pnpm check:contrast` and the token lock tests.
 * Reference values are WCAG's own extremes and widely published pairs.
 */
describe("WCAG contrast maths", () => {
  it("measures the known pairs", () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 5);
    expect(contrastRatio([255, 255, 255], [255, 255, 255])).toBeCloseTo(1, 5);
    // #767676 on white is the classic "just passes AA" grey.
    expect(contrastRatio([118, 118, 118], [255, 255, 255])).toBeCloseTo(4.54, 2);
    // Order does not matter.
    expect(contrastRatio([255, 255, 255], [118, 118, 118])).toBeCloseTo(4.54, 2);
  });

  it("composites translucent text over what is behind it", () => {
    expect(composite([0, 0, 0], 0.5, [255, 255, 255])).toEqual([127.5, 127.5, 127.5]);
    expect(composite([10, 20, 30], 1, [255, 255, 255])).toEqual([10, 20, 30]);
  });

  it("asks 4.5:1 of body text and 3:1 of large text", () => {
    expect(requiredRatio(16, 400)).toBe(4.5);
    expect(requiredRatio(24, 400)).toBe(3);
    expect(requiredRatio(18.66, 700)).toBe(3);
    expect(requiredRatio(18.66, 400)).toBe(4.5);
  });

  it("judges a varied background by its bad end, not its average", () => {
    const mostlyFine = [...Array(80).fill(7), ...Array(20).fill(2)];
    expect(ratioAtShare(mostlyFine)).toBe(2);
    expect(ratioAtShare(Array(100).fill(7))).toBe(7);
    expect(ratioAtShare([])).toBeNaN();
  });

  it("ships the same functions to the browser", () => {
    const browserCopy = new Function(`${CONTRAST_SOURCE_FOR_BROWSER}\nreturn { contrastRatio, requiredRatio };`)();
    expect(browserCopy.contrastRatio([118, 118, 118], [255, 255, 255])).toBe(
      contrastRatio([118, 118, 118], [255, 255, 255]),
    );
    expect(browserCopy.requiredRatio(24, 400)).toBe(3);
  });
});
