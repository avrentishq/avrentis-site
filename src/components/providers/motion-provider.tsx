"use client";

import { MotionConfig, LazyMotion, domAnimation } from "framer-motion";

/**
 * App-wide motion configuration. `reducedMotion="user"` makes every Framer
 * Motion animation respect the OS "reduce motion" setting — animations resolve
 * straight to their END state, so reduced-motion users still see all content
 * (no lingering opacity:0 entry states). Pairs with the CSS reset in
 * globals.css that neutralises CSS-driven animations/transitions.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  // LazyMotion + `m` ships one small feature bundle (domAnimation: animations,
  // variants, exit, in-view) instead of the full motion API in every component.
  // `strict` makes any stray `motion.*` throw so the smaller `m.*` is enforced.
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
