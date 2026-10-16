"use client";

/**
 * useIsMobile — true below Tailwind's `lg` breakpoint (`MEDIA_QUERIES.mobile`).
 * Used to degrade heavy, continuous animation on phones and small tablets —
 * interval-driven demos, scroll-linked parallax, ambient drift — where it
 * costs main-thread time and battery for little payoff.
 */

import { useMediaQuery } from "./use-media-query";
import { matchesMediaQuery } from "./media-queries";

export function useIsMobile(): boolean {
  return useMediaQuery("mobile");
}

/** One-shot check for use inside effects; see `matchesMediaQuery`. */
export function isMobileViewport(): boolean {
  return matchesMediaQuery("mobile");
}
