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
 * Pure predicates, importable by both server pages and client nav components.
 * A hidden MODULE is not listed here by hand: its page joins the gate from
 * `brand.ts`'s visibility flag, so one switch hides the page, its links and its
 * sitemap entry together.
 *
 * Rationale per entry is deliberately NOT recorded here. This repository is
 * public, and "why a page is not published yet" is commercial context. It
 * lives in `guides/public-site-setup.md`, which is gitignored.
 */

import { hiddenModuleKeys, moduleHref } from "./brand";

export const HIDDEN_AT_LAUNCH: readonly string[] = [
  "/customers",
  "/careers",
  "/changelog",
  "/docs",
  "/trust",
  ...hiddenModuleKeys().map(moduleHref),
];

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
