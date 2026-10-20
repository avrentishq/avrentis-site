"use client";

import { m, type MotionValue } from "framer-motion";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { Z_INDEX } from "@/lib/layers";

/**
 * DarkHeroBackdrop — the ambient layer behind a dark section further down a
 * page: two drifting gold glows and, optionally, the faint 60px grid. A page's
 * opening hero never takes it: heroes are flat ink over their photo (the brand
 * brief), so there is no hero glow pair to ask for. Drop it inside a section
 * styled `position: relative; overflow: hidden; isolation: isolate`, after any
 * SectionBackdrop and before the content (which sits at zIndex 2).
 *
 * The one home of the glow pairs and the grid texture —
 * ui-kit.lock.test.ts fails on the grid gradient typed anywhere else.
 */

interface GlowSpec {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: number;
  intensity: number;
  duration: number;
  delay?: number;
}

/**
 * closing: a dark section further down the page, softer and lower.
 * centered: the closing CTA banner, glows pulled in to frame centred copy.
 */
export const BACKDROP_GLOWS = {
  closing: [
    { top: "20%", left: "-120px", size: 420, intensity: 0.15, duration: 34 },
    { bottom: "-80px", right: "-100px", size: 480, intensity: 0.13, duration: 40, delay: 0.5 },
  ],
  centered: [
    { top: "-80px", left: "20%", size: 520, intensity: 0.22, duration: 38 },
    { bottom: "-60px", right: "15%", size: 480, intensity: 0.18, duration: 44, delay: 0.5 },
  ],
} as const satisfies Record<string, readonly GlowSpec[]>;

export type BackdropGlows = keyof typeof BACKDROP_GLOWS;

const GRID_LINE = "rgba(var(--color-white-rgb), 0.4) 1px, transparent 1px";

interface DarkHeroBackdropProps {
  glows: BackdropGlows;
  /** Draw the grid texture over the glows. */
  grid?: boolean;
  /** Scroll-linked offset for the grid (parallax). Ignored on phones. */
  gridY?: MotionValue<number>;
}

export function DarkHeroBackdrop({ glows, grid = false, gridY }: DarkHeroBackdropProps) {
  const isMobile = useIsMobile();
  return (
    <>
      {BACKDROP_GLOWS[glows].map((glow, index) => (
        <AmbientGlow key={index} {...glow} />
      ))}
      {grid && (
        <m.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: `linear-gradient(${GRID_LINE}), linear-gradient(90deg, ${GRID_LINE})`,
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            y: gridY && !isMobile ? gridY : 0,
            zIndex: Z_INDEX.raised,
          }}
        />
      )}
    </>
  );
}
