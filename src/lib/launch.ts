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

import { LEGAL_PAGES, hiddenModuleKeys, moduleHref } from "./brand";
import { SITE_ROUTES } from "./routes";

export const HIDDEN_AT_LAUNCH: readonly string[] = [
  SITE_ROUTES.customers,
  SITE_ROUTES.careers,
  SITE_ROUTES.changelog,
  SITE_ROUTES.docs,
  LEGAL_PAGES.trust,
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

/**
 * The one line that says where the product stands — the brand brief's approved
 * wording ("Pre-launch; built and tested, piloting now"). Never a customer
 * count, logo or uptime figure until there is one to state.
 */
export const LAUNCH_STATUS = "Pre-launch; built and tested, piloting now.";
