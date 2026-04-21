"use client";

/**
 * AmbientGlow — a blurred radial gradient orb that drifts slowly on a
 * translate-only loop. Used as a non-interactive background layer to add
 * depth to dark sections without violating the brand motion spec
 * (no scale, no rotation, no spring, no bounce — pure translate over a
 * long cycle).
 *
 * All glows share the same spec:
 *   - Fixed size (no scale animation)
 *   - Very low opacity (0.35 max)
 *   - Heavy blur so the edges are soft and pattern-like
 *   - `pointer-events: none` so they never intercept clicks
 *   - Honour `prefers-reduced-motion: reduce` — positioned statically then
 *
 * The parent section MUST have `position: relative; overflow: hidden` so
 * the glow is clipped to the section bounds.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AmbientGlowProps {
  /** Pixel size of the square glow. Defaults to 480. */
  size?: number;
  /** Hex or rgba colour of the radial gradient's inner stop. */
  color?: string;
  /** Max opacity at the centre. 0–1. Defaults to 0.35. */
  intensity?: number;
  /** Starting position relative to the parent, as a CSS percentage string. */
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  /** Drift amplitude in pixels. Defaults to 40. */
  amplitude?: number;
  /** Seconds for one complete loop. Longer = slower, more ambient. Defaults to 26. */
  duration?: number;
  /** Offset into the drift loop (0–1). Used when two glows share a section so
   *  their motion doesn't synchronise. */
  delay?: number;
}

export function AmbientGlow({
  size = 480,
  color = "#C68B2F",
  intensity = 0.35,
  top,
  left,
  right,
  bottom,
  amplitude = 40,
  duration = 26,
  delay = 0,
}: AmbientGlowProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const background = `radial-gradient(closest-side, ${color} 0%, transparent 70%)`;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ x: 0, y: 0 }}
      animate={
        reducedMotion
          ? { x: 0, y: 0 }
          : {
              // Gentle figure-8-ish drift using translateX + translateY only
              x: [0, amplitude, 0, -amplitude, 0],
              y: [0, -amplitude * 0.6, amplitude * 0.8, 0, 0],
            }
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration,
              ease: "easeInOut",
              repeat: Infinity,
              delay: -duration * delay,
            }
      }
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: `${size}px`,
        height: `${size}px`,
        background,
        opacity: intensity,
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0,
        willChange: "transform",
      }}
    />
  );
}
