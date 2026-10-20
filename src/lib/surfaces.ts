/**
 * Background surfaces, and the focus ring and text greys that read on each.
 *
 * The keyboard focus ring must stand out from whatever it is drawn over
 * (WCAG 1.4.11: 3:1 for non-text). Plain gold passes on navy but measures
 * 2.94:1 on white; the darker gold-on-light passes on light surfaces but not
 * on navy. So the ring is a property of the SURFACE, not of the component:
 * each surface token names its ring token here, once.
 *
 * How it applies: SURFACE_CSS (rendered by the root layout) sets
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
 * (the scrolled navbar over the hero) and is registered with the surface it is
 * designed to sit on (`over`), so the test can measure the colour it shows.
 *
 * focus-ring-contrast.lock.test.ts checks every pairing at 3:1 and fails when
 * a background token in the code is neither a surface here nor a fill below.
 */

/**
 * Each surface and the ring drawn over it, written out as full `var(--color-…)`
 * references (colour-tokens.lock.test.ts checks each is a defined token).
 */
/** Light surfaces take the slate-stone grey; dark ones (the ink shell) its on-dark twin. */
export type SurfaceTone = "light" | "dark";

/**
 * The grey text roles a surface re-points for what sits on it. On the ink
 * shell the light-page grey measures under 3:1, so a section that only sets its
 * background still gets readable secondary, muted and subtle copy — and a
 * parchment card inside it gets the light greys back.
 */
export const TONE_TEXT: Record<SurfaceTone, string> = {
  light:
    "--color-text-secondary:var(--color-text-secondary-on-light);--color-text-secondary-rgb:var(--color-text-secondary-on-light-rgb);" +
    "--color-text-muted:var(--color-text-secondary-on-light);--color-text-muted-rgb:var(--color-text-secondary-on-light-rgb);" +
    "--color-text-subtle:var(--color-text-secondary-on-light);--color-text-subtle-rgb:var(--color-text-secondary-on-light-rgb)",
  dark:
    "--color-text-secondary:var(--color-text-secondary-on-dark);--color-text-secondary-rgb:var(--color-text-secondary-on-dark-rgb);" +
    "--color-text-muted:var(--color-text-secondary-on-dark);--color-text-muted-rgb:var(--color-text-secondary-on-dark-rgb);" +
    "--color-text-subtle:var(--color-text-secondary-on-dark);--color-text-subtle-rgb:var(--color-text-secondary-on-dark-rgb)",
};

export const SURFACES: readonly {
  surface: string;
  ring: string;
  /** A translucent surface's backdrop: another registered surface. */
  over?: string;
  /** Which grey secondary/muted/subtle text takes on this surface. */
  tone: SurfaceTone;
}[] = [
  { surface: "var(--color-white)", ring: "var(--color-gold-on-light)", tone: "light" },
  { surface: "var(--color-bg-light)", ring: "var(--color-gold-on-light)", tone: "light" },
  { surface: "var(--color-bg)", ring: "var(--color-gold-on-light)", tone: "light" },
  { surface: "var(--color-gold-surface)", ring: "var(--color-gold-on-light)", tone: "light" },
  { surface: "var(--color-nav-surface)", ring: "var(--color-gold-on-light)", tone: "light" },
  { surface: "var(--color-navy-primary)", ring: "var(--color-gold)", tone: "dark" },
  { surface: "var(--color-navy-mid)", ring: "var(--color-gold)", tone: "dark" },
  { surface: "var(--color-navy-deep)", ring: "var(--color-gold)", tone: "dark" },
  // The navbar once scrolled (navbar.tsx): a near-opaque cream pill that can
  // sit over the navy hero.
  {
    surface: "rgba(var(--color-nav-surface-rgb), 0.96)",
    over: "var(--color-navy-primary)",
    ring: "var(--color-gold-on-light)",
    tone: "light",
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

/**
 * Per surface, two rules. The text greys apply to the painted element ITSELF
 * (a badge's own words sit on its own fill) and inherit down; the focus ring
 * applies to its CHILDREN (a ring is drawn outside, over the parent's fill).
 */
export const SURFACE_CSS = SURFACES.flatMap(({ surface, ring, tone }) => {
  const painted = surfaceStyleFragments(surface).map((fragment) => `[style*="${fragment}"]`);
  return [
    `${painted.join(",")}{${TONE_TEXT[tone]}}`,
    `${painted.map((selector) => `${selector}>*`).join(",")}{--focus-ring:${ring}}`,
  ];
}).join("\n");
