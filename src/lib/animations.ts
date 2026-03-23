/**
 * AVRENTIS animation utilities — constrained by brand spec.
 *
 * Hard rules:
 * - Fade-up ONLY (opacity + translateY)
 * - Duration 0.4s, ease-out
 * - No bounce, no spring, no scale, no rotation
 * - Stagger max 0.08s between siblings
 * - type: "tween" always, never "spring"
 */

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

export const stagger = (index: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: index * 0.08 },
});
