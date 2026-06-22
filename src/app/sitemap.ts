import type { MetadataRoute } from "next";
import { isLaunchVisible } from "@/lib/launch";
import { publicModuleKeys, MODULES } from "@/lib/brand";

const BASE_URL = "https://avrentis.com";

/**
 * Sitemap of publicly-reachable routes. Launch-hidden routes (filtered via the
 * launch gate) and not-yet-public modules (HR — excluded by `publicModuleKeys`) are
 * left out so search engines only index what a visitor can actually open.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/product",
    "/product/how-it-works",
    "/product/security",
    "/pricing",
    "/trial",
    "/contact",
    "/about",
    "/trust",
    "/privacy",
    "/terms",
  ];

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
