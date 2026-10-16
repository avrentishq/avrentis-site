/**
 * The media queries the site's script reacts to — each named once. Read them
 * through `useMediaQuery` (reactive) or `matchesMediaQuery` (one-shot); a raw
 * `matchMedia(` outside this folder fails design-tokens.lock.test.ts.
 */
export const MEDIA_QUERIES = {
  /** Below Tailwind's `lg` (1024px): phones and small tablets, where heavy continuous animation is dropped. */
  mobile: "(max-width: 1023px)",
  /** Narrow enough that the plan comparison table switches to one plan at a time. */
  compact: "(max-width: 720px)",
  /** The visitor asked the OS to reduce motion. */
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

export type MediaQueryName = keyof typeof MEDIA_QUERIES;

/**
 * One-shot check for use inside effects (e.g. gating a `setInterval`). SSR-safe:
 * false on the server. Not reactive — render-time code uses `useMediaQuery`.
 */
export function matchesMediaQuery(name: MediaQueryName): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(MEDIA_QUERIES[name]).matches;
}
