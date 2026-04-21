"use client";

/**
 * CountUp — animates a number (or a string with a numeric segment) from 0 to
 * its target value when the element enters the viewport. Honours the brand
 * motion spec: no scale, no spring — pure number interpolation driven by
 * framer-motion's `useMotionValue` + `animate()`, over the same 0.4s
 * cadence used by `fadeUp`.
 *
 * Usage:
 *   <CountUp value="87%" />
 *   <CountUp value="< 2 min" />  ← non-numeric prefixes/suffixes preserved
 *   <CountUp value="Zero" />     ← pure string → renders as-is, no animation
 *
 * Respects users with `prefers-reduced-motion: reduce` — shows the final
 * value immediately.
 */

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

interface CountUpProps {
  value: string;
  /** Seconds. Defaults to 0.9 — longer than the fade cadence because numbers
   *  reading well takes time; still well under a second. */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface Parsed {
  prefix: string;
  number: number;
  decimals: number;
  suffix: string;
}

/**
 * Split a display string like "< 2 min" or "87%" or "1,240" into a numeric
 * component + surrounding text. Returns null for purely non-numeric values
 * (e.g. "Zero") so the caller can render them verbatim.
 */
function parseValue(value: string): Parsed | null {
  const match = value.match(/^([^\d\-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, numeric, suffix] = match;
  const clean = numeric.replace(/,/g, "");
  const number = Number(clean);
  if (!Number.isFinite(number)) return null;
  const decimals = clean.includes(".") ? clean.split(".")[1]!.length : 0;
  return { prefix, number, decimals, suffix };
}

function formatNumber(n: number, decimals: number): string {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CountUp({ value, duration = 0.9, className, style }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const parsed = parseValue(value);
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState<string>(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);

  useEffect(() => {
    if (!parsed || !inView) return;

    // Respect reduced-motion preferences — skip the interpolation.
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setDisplay(value);
      return;
    }

    const controls = animate(motionValue, parsed.number, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(`${parsed.prefix}${formatNumber(v, parsed.decimals)}${parsed.suffix}`);
      },
    });
    return () => controls.stop();
  }, [inView, parsed, duration, motionValue, value]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
