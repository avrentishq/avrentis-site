"use client";

/**
 * useReducedMotion — true when the visitor has `prefers-reduced-motion: reduce`
 * set at the OS level (`MEDIA_QUERIES.reducedMotion`).
 */

import { useMediaQuery } from "./use-media-query";
import { matchesMediaQuery } from "./media-queries";

export function useReducedMotion(): boolean {
  return useMediaQuery("reducedMotion");
}

/** One-shot check for use inside effects; see `matchesMediaQuery`. */
export function isReducedMotion(): boolean {
  return matchesMediaQuery("reducedMotion");
}
