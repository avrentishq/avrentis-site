/**
 * Launch visibility gate — the single, reversible source of truth for which
 * routes are currently hidden.
 *
 * A hidden page has no file in this repository: its code lives in the
 * git-ignored `unannounced/` folder (a private companion repository), so its
 * path answers the not-found page. The nav + footer link lists filter their
 * hrefs through `isLaunchVisible(href)`, the sitemap leaves it out, and
 * `pageMetadata` titles it "Page not found" — a hidden page is neither
 * reachable, advertised nor readable here. `unannounced-boundary.lock.test.ts`
 * fails if a listed path gets a page under `src/app`.
 *
 * To launch a page: move its files from `unannounced/` back to the same paths
 * here and delete its entry below (see AGENTS.md "Unannounced pages").
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
