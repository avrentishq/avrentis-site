import type { StaticImageData } from "next/image";

// Static imports (not "/sections/x.jpg" strings) so Next.js content-hashes the
// URL. Swapping a file in public/sections/ changes the hash → the optimizer
// re-generates and NEVER serves a stale cached copy (the dev-cache staleness
// you hit with plain string paths). Applies in dev and prod.
import problemBg from "../../public/sections/problem.jpg";
import socialProofBg from "../../public/sections/social-proof.jpg";
import featuresGridBg from "../../public/sections/features-grid.jpg";
import pricingBg from "../../public/sections/pricing.jpg";
import ctaBannerBg from "../../public/sections/cta-banner.jpg";
import howItWorksBg from "../../public/sections/how-it-works.jpg";
import placeholderBg from "../../public/sections/placeholder.jpg";

/**
 * Single source of truth for every section backdrop image across the site.
 *
 * To switch a section's backdrop: replace the file in `public/sections/` (keep
 * the name), or import a new file above and point the key at it — one line.
 *
 * These are IMAGES ONLY. The `scrim` tint stays at each `<SectionBackdrop>`
 * call site because it's a per-section legibility choice, not part of the
 * image: "light" for pale sections (dark text), "dark" for navy sections
 * (white text). `placeholder` is the shared stand-in used by pages that don't
 * yet have dedicated art.
 */
export const SECTION_BACKDROPS = {
  problem: problemBg,
  socialProof: socialProofBg,
  featuresGrid: featuresGridBg,
  pricing: pricingBg,
  ctaBanner: ctaBannerBg,
  howItWorks: howItWorksBg,
  placeholder: placeholderBg,
} satisfies Record<string, StaticImageData>;
