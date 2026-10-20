/**
 * Stacking order — every z-index on the site. Sections are `isolation: isolate`,
 * so the low layers (base → content) only order things inside one section;
 * the high ones order the chrome above the page. globals.css's `.skip-link`
 * mirrors `overlay` (design-tokens.lock.test.ts holds them equal).
 */
export const Z_INDEX = {
  /** In-flow layers: ambient glows, a connector line under its nodes. */
  base: 0,
  /** Above the base layer: the grid overlay, or content in a section without one. */
  raised: 1,
  /** Section content above the grid overlay. */
  content: 2,
  /** A form control's open list. */
  dropdown: 30,
  /** The navbar and the scroll progress bar. */
  header: 50,
  /** The full-screen mobile menu. */
  mobileMenu: 70,
  /** The navbar's open menu panel and the skip link — above everything. */
  overlay: 100,
} as const;
