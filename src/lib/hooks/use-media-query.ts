"use client";

/**
 * useMediaQuery — reactive boolean for one of the site's named media queries
 * (`MEDIA_QUERIES`).
 *
 * `useSyncExternalStore`, so there is no React 19 "setState in effect" warning.
 * SSR-safe: the server renders `false` (the full, desktop, motion-on
 * experience paints first), then the client hydrates to the real value.
 */

import { useCallback, useSyncExternalStore } from "react";
import { MEDIA_QUERIES, type MediaQueryName } from "./media-queries";

export function useMediaQuery(name: MediaQueryName): boolean {
  const query = MEDIA_QUERIES[name];
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onChange);
      return () => mediaQueryList.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
