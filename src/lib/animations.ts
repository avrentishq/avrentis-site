/**
 * AVRENTIS animation utilities — constrained by brand spec.
 *
 * Hard rules:
 * - Fade-up ONLY (opacity + translateY)
 * - Duration 0.4s, ease-out
 * - No bounce, no spring, no scale, no rotation
 * - Stagger max 0.08s between siblings, never exceed 0.32s total
 * - viewport once: true — fires once, never re-triggers
 */

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeUpTransition = {
  duration: 0.4,
  ease: "easeOut" as const,
};

export function staggerDelay(index: number) {
  return { ...fadeUpTransition, delay: index * 0.08 };
}
