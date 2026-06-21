"use client";

import { MotionConfig } from "framer-motion";

/**
 * App-wide motion configuration. `reducedMotion="user"` makes every Framer
 * Motion animation respect the OS "reduce motion" setting — animations resolve
 * straight to their END state, so reduced-motion users still see all content
 * (no lingering opacity:0 entry states). Pairs with the CSS reset in
 * globals.css that neutralises CSS-driven animations/transitions.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
