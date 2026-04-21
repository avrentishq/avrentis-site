"use client";

/**
 * useReducedMotion — returns true when the user has
 * `prefers-reduced-motion: reduce` set at the OS level.
 *
 * Uses `useSyncExternalStore` so the value stays in sync without
 * triggering the React 19 "setState in effect" warning. SSR-safe:
 * server renders as `false` (no motion reduction), then the client
 * hydrates to the real value on mount.
 */

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
