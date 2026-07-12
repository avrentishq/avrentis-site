"use client";

/**
 * useMediaQuery — reactive boolean for a CSS media query.
 *
 * Same `useSyncExternalStore` pattern as `useReducedMotion` (no React 19
 * "setState in effect" warning). SSR-safe: the server renders as `false`, then
 * the client hydrates to the real value on mount.
 */

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
