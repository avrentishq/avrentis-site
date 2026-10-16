/**
 * AVRENTIS animation utilities — constrained by brand spec.
 *
 * Hard rules:
 * - Fade-up ONLY (opacity + translateY)
 * - Duration 0.4s, ease-out
 * - No bounce, no spring, no scale, no rotation
 * - Stagger max 0.08s between siblings, never exceed 0.32s total
 * - viewport once: true — fires once, never re-triggers
 *
 * Everything that moves reads its timing from here: the reveal props
 * (`fadeUpOnScroll` / `fadeUpOnLoad`), interface motion (`MOTION_DURATION`)
 * and CSS hover/state transitions (`TRANSITION`, `cssTransition`).
 * ui-kit.lock.test.ts fails on the reveal props typed out by hand.
 */

/** CSS transition speeds, in milliseconds — the one scale for hover and state changes. */
export const TRANSITION_MS = { fast: 150, base: 200, slow: 300 } as const;

export type TransitionSpeed = keyof typeof TRANSITION_MS;

/** CSS timing for each speed, e.g. `border-color ${TRANSITION.fast}`. */
export const TRANSITION: Record<TransitionSpeed, string> = {
  fast: `${TRANSITION_MS.fast}ms ease`,
  base: `${TRANSITION_MS.base}ms ease`,
  slow: `${TRANSITION_MS.slow}ms ease`,
};

/** A CSS `transition` value moving each property at one speed. */
export function cssTransition(
  properties: string | readonly string[],
  speed: TransitionSpeed = "fast",
): string {
  const list = typeof properties === "string" ? [properties] : properties;
  return list.map((property) => `${property} ${TRANSITION[speed]}`).join(", ");
}

/** Framer Motion durations, in seconds: the CSS scale plus the brand reveal. */
export const MOTION_DURATION = {
  fast: TRANSITION_MS.fast / 1000,
  base: TRANSITION_MS.base / 1000,
  slow: TRANSITION_MS.slow / 1000,
  reveal: 0.4,
} as const;

export const MOTION_EASE = "easeOut" as const;

/** Gap between siblings in a stagger. */
export const STAGGER_STEP = 0.08;
/** No stagger delays an element by more than this. */
export const STAGGER_MAX_TOTAL = 0.32;

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeUpTransition = {
  duration: MOTION_DURATION.reveal,
  ease: MOTION_EASE,
};

/**
 * The reveal transition for the `index`th sibling. The delay is capped at
 * STAGGER_MAX_TOTAL, so a long list never keeps its tail waiting.
 */
export function staggerDelay(index: number) {
  const delay = Math.min(Math.max(index, 0) * STAGGER_STEP, STAGGER_MAX_TOTAL);
  return { ...fadeUpTransition, delay };
}

export const FADE_UP_VIEWPORT = { once: true, margin: "-40px" } as const;

function revealTransition(index?: number) {
  return index === undefined ? fadeUpTransition : staggerDelay(index);
}

/** Spread on an `m.*` element: fades up once when scrolled into view. */
export function fadeUpOnScroll(index?: number) {
  return {
    variants: fadeUp,
    initial: "hidden",
    whileInView: "visible",
    viewport: FADE_UP_VIEWPORT,
    transition: revealTransition(index),
  } as const;
}

/** Spread on an `m.*` element: fades up as the page loads (above the fold). */
export function fadeUpOnLoad(index?: number) {
  return {
    variants: fadeUp,
    initial: "hidden",
    animate: "visible",
    transition: revealTransition(index),
  } as const;
}
