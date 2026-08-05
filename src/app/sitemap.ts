import type { MetadataRoute } from "next";
import { isLaunchVisible } from "@/lib/launch";
import { publicModuleKeys, MODULES } from "@/lib/brand";

const BASE_URL = "https://avrentis.com";

/**
 * Sitemap of publicly-reachable routes. Launch-hidden routes (filtered via the
 * launch gate) and hidden modules (Requests — excluded by `publicModuleKeys`) are
 * left out so search engines only index what a visitor can actually open.
 */
/**
 * Content routes that aren't derived from the module registry.
 *
 * Deliberately absent: `/status` redirects to an external status page, and a
 * sitemap must not advertise a redirect; `/features` likewise redirects to
 * `/product`. Routes hidden by the launch gate are filtered below rather than
 * omitted here, so re-enabling a page needs only the gate edit.
 *
 * Exported so `sitemap.test.ts` can assert no linked, reachable page is missing.
 */
export const STATIC_ROUTES: readonly string[] = [
  "/",
  "/product",
  "/product/how-it-works",
  "/product/security",
  // Catalogue page, not a module slug — the module registry emits /product/connect,
  // so this route is only in the sitemap because it is listed here explicitly.
  "/product/integrations",
  "/pricing",
  "/trial",
  "/contact",
  "/about",
  "/trust",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = STATIC_ROUTES;

  const moduleRoutes = publicModuleKeys().map(
    (key) => `/product/${MODULES[key].slug}`,
  );

  const lastModified = new Date();

  return [...staticRoutes, ...moduleRoutes]
    .filter(isLaunchVisible)
    .map((path) => ({
      url: `${BASE_URL}${path === "/" ? "" : path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    }));
}
