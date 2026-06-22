/**
 * Launch visibility gate — the single, reversible source of truth for which
 * routes are hidden at launch.
 *
 * Pages that aren't yet rooted/tested/verified (or that have no real content
 * yet — empty customer/careers/status/docs/changelog pages) are listed here.
 * Each hidden page calls `notFound()` when `isLaunchHidden(path)` is true, and
 * the nav + footer link lists filter their hrefs through `isLaunchVisible(href)`
 * so a hidden page is neither reachable nor advertised.
 *
 * To re-enable a page once its content is ready: delete its entry below. That is
 * the ONLY change required — the page renders again and its nav/footer links
 * reappear automatically. No content is deleted; the routes stay in the repo.
 *
 * This file is intentionally dependency-free (pure predicates) so it can be
 * imported by both server pages and client nav components.
 */

export const HIDDEN_AT_LAUNCH: readonly string[] = [
  // Temporarily hidden pre-launch; re-enable by deleting this entry.
  "/trust",
  "/customers",
  "/status",
  "/careers",
  "/docs",
  "/changelog",
  "/product/integrations", // the named-adapter catalogue; the /product/connect module page stays
  "/product/people", // Avrentis HR — not yet public
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
