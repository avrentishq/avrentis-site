"use client";

/**
 * ScrollProgress — thin accent-gold bar fixed to the top of the viewport,
 * scales horizontally with scroll position (0% → 100%).
 *
 * Brand-spec compliant: single translate/scaleX transform on a 1D axis,
 * no rotation/bounce/spring. Uses `transform-origin: 0 50%` so it grows
 * left→right rather than scaling from the centre.
 */

import { m, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // `useSpring` here is only to smooth the raw scroll value — not a bouncy
  // motion effect; stiffness/damping picked to be near-linear.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });

  return (
    <m.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        backgroundColor: "var(--color-gold)",
        transformOrigin: "0 50%",
        scaleX,
        zIndex: 50,
        pointerEvents: "none",
      }}
    />
  );
}
