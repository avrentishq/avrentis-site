"use client";

/**
 * useIsMobile — true when the viewport is below Tailwind's `lg` breakpoint
 * (< 1024px). Used to degrade heavy, continuous animation on phones/small
 * tablets — interval-driven demos, scroll-linked parallax, ambient drift —
 * where they cost main-thread time and battery for little payoff.
 *
 * Mirrors useReducedMotion: `useSyncExternalStore`, SSR-safe (server renders
 * `false` so the full/desktop experience paints first, then the client
 * corrects on mount).
 */

import { useSyncExternalStore } from "react";

// Below Tailwind `lg` (1024px).
const QUERY = "(max-width: 1023px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Imperative one-shot check for use inside effects (e.g. gating a `setInterval`
 * so it never starts on mobile). SSR-safe. Not reactive — for render-time
 * reactivity use the `useIsMobile` hook instead.
 */
export function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}
