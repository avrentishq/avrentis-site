/**
 * Background surfaces and the focus ring that reads on each.
 *
 * The keyboard focus ring must stand out from whatever it is drawn over
 * (WCAG 1.4.11: 3:1 for non-text). Plain gold passes on navy but measures
 * 2.94:1 on white; the darker gold-on-light passes on light surfaces but not
 * on navy. So the ring is a property of the SURFACE, not of the component:
 * each surface token names its ring token here, once.
 *
 * How it applies: SURFACE_FOCUS_CSS (rendered by the root layout) sets
 * `--focus-ring` on the CHILDREN of any element painted with a registered
 * surface through an inline `background`/`background-color`, the way every
 * section on the site sets its background. A ring is drawn outside its
 * element, over the surface the element sits on, so an element takes its
 * ring from its parent's surface, never its own fill: a navy button on a
 * white card gets the light ring. Custom properties inherit, so the nearest
 * painted ancestor wins. globals.css draws every focus ring from
 * `--focus-ring`, defaulting to the light ring for the page itself.
 *
 * Translucent backgrounds: a faint tint (alpha under TINT_MAX_ALPHA, e.g.
 * `rgba(var(--color-gold-rgb), 0.08)`) keeps the lightness of what is beneath,
 * so it is not a surface and inherits. A stronger one is a surface of its own
 * (frosted glass over the hero) and is registered with the surface it is
 * designed to sit on (`over`), so the test can measure the colour it shows.
 *
 * focus-ring-contrast.lock.test.ts checks every pairing at 3:1 and fails when
 * a background token in the code is neither a surface here nor a fill below.
 */

/**
 * Each surface and the ring drawn over it, written out as full `var(--color-…)`
 * references (colour-tokens.lock.test.ts checks each is a defined token).
 */
export const SURFACE_FOCUS_RINGS: readonly {
  surface: string;
  ring: string;
  /** A translucent surface's backdrop: another registered surface. */
  over?: string;
}[] = [
  { surface: "var(--color-white)", ring: "var(--color-gold-on-light)" },
  { surface: "var(--color-bg-light)", ring: "var(--color-gold-on-light)" },
  { surface: "var(--color-bg)", ring: "var(--color-gold-on-light)" },
  { surface: "var(--color-gold-surface)", ring: "var(--color-gold-on-light)" },
  { surface: "var(--color-nav-surface)", ring: "var(--color-gold-on-light)" },
  { surface: "var(--color-navy-primary)", ring: "var(--color-gold)" },
  { surface: "var(--color-navy-mid)", ring: "var(--color-gold)" },
  { surface: "var(--color-navy-deep)", ring: "var(--color-gold)" },
  // Frosted glass in the hero (hero.tsx): the browser-window frame over navy
  // reads mid-grey, where neither gold reaches 3:1; the inbox list inside it
  // reads light.
  {
    surface: "rgba(var(--color-bg-light-rgb), 0.72)",
    over: "var(--color-navy-primary)",
    ring: "var(--color-navy-primary)",
  },
  {
    surface: "rgba(var(--color-white-rgb), 0.64)",
    over: "rgba(var(--color-bg-light-rgb), 0.72)",
    ring: "var(--color-gold-on-light)",
  },
  // The navbar once scrolled (navbar.tsx): a near-opaque cream pill that can
  // sit over the navy hero.
  {
    surface: "rgba(var(--color-nav-surface-rgb), 0.9)",
    over: "var(--color-navy-primary)",
    ring: "var(--color-gold-on-light)",
  },
];

/** At or above this alpha a translucent background is a surface and must be registered. */
export const TINT_MAX_ALPHA = 0.5;

/** The ring for the page itself (the body is white) and anything not painted. */
export const DEFAULT_FOCUS_RING = "var(--color-gold-on-light)";

/**
 * Background colours that fill a control or a mark (a gold button, a success
 * badge, a hairline), never a region that holds focusable content. A focus
 * ring around such an element is drawn over the surface beneath it.
 */
export const NON_SURFACE_FILLS = [
  "var(--color-gold)",
  "var(--color-gold-hover)",
  "var(--color-success)",
  "var(--color-border)",
] as const;

/**
 * How an inline background reaches the `style` attribute: React writes it
 * without a space in server HTML; the browser re-serialises it with one when
 * script changes it (e.g. the navbar on scroll).
 */
const INLINE_BACKGROUND_PREFIXES = ["background-color:", "background-color: ", "background:", "background: "];

/** The style-attribute fragments that mark an element as painted with `surface`. */
export function surfaceStyleFragments(surface: string): string[] {
  return INLINE_BACKGROUND_PREFIXES.map((prefix) => `${prefix}${surface}`);
}

export const SURFACE_FOCUS_CSS = SURFACE_FOCUS_RINGS.map(({ surface, ring }) => {
  const selectors = surfaceStyleFragments(surface).map((fragment) => `[style*="${fragment}"]>*`);
  return `${selectors.join(",")}{--focus-ring:${ring}}`;
}).join("\n");
