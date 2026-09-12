/**
 * Launch visibility gate — the single, reversible source of truth for which
 * routes are currently hidden.
 *
 * Each hidden page calls `notFound()` when `isLaunchHidden(path)` is true, and
 * the nav + footer link lists filter their hrefs through `isLaunchVisible(href)`
 * so a hidden page is neither reachable nor advertised.
 *
 * To re-enable a page: delete its entry below. That is the ONLY change
 * required — the page renders again and its nav/footer links reappear
 * automatically. No content is deleted; the routes stay in the repo.
 *
 * This file is intentionally dependency-free (pure predicates) so it can be
 * imported by both server pages and client nav components.
 *
 * Rationale per entry is deliberately NOT recorded here. This repository is
 * public, and "why a page is not published yet" is commercial context. It
 * lives in `guides/public-site-setup.md`, which is gitignored.
 */

export const HIDDEN_AT_LAUNCH: readonly string[] = [
  "/customers",
  "/careers",
  "/changelog",
  "/docs",
  "/trust",
  "/product/people",
] as const;

/** True if `path` is hidden for launch (exact match or a sub-path). */
export function isLaunchHidden(path: string): boolean {
  return HIDDEN_AT_LAUNCH.some(
    (hidden) => path === hidden || path.startsWith(hidden + "/"),
  );
}

/** True if `path` may be shown/linked at launch. */
export function isLaunchVisible(path: string): boolean {
  return !isLaunchHidden(path);
}
