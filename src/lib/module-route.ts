import { notFound } from "next/navigation";

import { isModulePublic, type ModuleKey } from "@/lib/brand";

/**
 * A module route renders only for a module the site shows. The visibility flag
 * in `brand.ts` is the one switch: it hides the page here, its links (every
 * list reads `publicModuleKeys()`) and its sitemap entry (the launch gate
 * derives the route). Call it before fetching anything for the page.
 */
export function notFoundUnlessPublic(moduleKey: ModuleKey): void {
  if (!isModulePublic(moduleKey)) notFound();
}
