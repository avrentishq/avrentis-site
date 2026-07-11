import type { StaticImageData } from "next/image";

/**
 * A section's backdrop source. Either a bare image (uses SectionBackdrop's
 * default opacity/crop) OR an object bundling the image with a per-section
 * `opacity` and/or `objectPosition` override — so you tune a section's backdrop
 * entirely here, with no call-site change. Example:
 *   aboutValues: { src: textureLight, opacity: 0.35, objectPosition: "top" }
 */
export type SectionBackdropSource =
  | StaticImageData
  | { src: StaticImageData; opacity?: number; objectPosition?: string };

// The 5 recycled brand textures are the ONLY section-backdrop images — every
// section across the site (home included) maps to one of them. Static imports
// (not string paths) so Next.js content-hashes the URL: swapping a file in
// public/sections/ re-optimises and never serves a stale cached copy. Dark
// textures pair with dark-scrim sections, light with light-scrim; `structure` =
// geometric/authority motif, `flow` = organic, `gold` = warm accent.
import textureNavy from "../../public/sections/texture-navy.jpg";
import textureGold from "../../public/sections/texture-gold.jpg";
import textureLight from "../../public/sections/texture-light.jpg";
import textureFeather from "../../public/sections/texture-feather.jpg";
import textureStructure from "../../public/sections/texture-structure.jpg";
import textureFlow from "../../public/sections/texture-flow.jpg";

/**
 * Single source of truth for every section backdrop image across the site.
 *
 * EVERY unique section band on the site has its own key here, and every one maps
 * to one of the 5 recycled brand textures (texture-navy / -gold / -light /
 * -structure / -flow) — swap a texture file in `public/sections/` to restyle a
 * whole family of sections at once, or point a single key at a different
 * texture. One line per section, no call-site change.
 *
 * The `scrim` tint stays at each `<SectionBackdrop>` call site because it's a
 * per-section legibility choice, not part of the image: "light" for pale
 * sections (dark text), "dark" for navy sections (white text). `placeholder`
 * is the shared stand-in / fallback (points at the neutral light texture).
 *
 * To adjust a section's backdrop OPACITY (or crop) individually, tune the
 * object form — see `SectionBackdropSource` above:
 *   aboutValues: { src: textureLight, opacity: 0.35 }
 */
export const SECTION_BACKDROPS = {
  // ── Home (src/components/sections/*) ──────────────────────────────────
  hero: { src: textureFlow, opacity: 0.5, objectPosition: "center 45%" },
  problem: { src: textureLight, opacity: 1 },
  howItWorks: { src: textureNavy, opacity: 1 },
  socialProof: { src: textureFeather, opacity: 0.3 },
  featuresGrid: { src: textureGold, opacity: 0.2 },
  pricing: { src: textureNavy, opacity: 1 }, // shared: home + /pricing
  ctaBanner: { src: textureFlow, opacity: 0.3 }, // shared: closing CTA band

  // ── /about ────────────────────────────────────────────────────────────
  aboutHero: { src: textureFlow, opacity: 0.5 },
  aboutMission: { src: textureLight, opacity: 1 },
  aboutValues: { src: textureNavy, opacity: 1 },
  aboutJoinUs: { src: textureFeather, opacity: 0.3 },
  aboutContact: { src: textureFlow, opacity: 0.3 },

  // ── /careers ────────────────────────────────────────────────────────────
  careersHero: { src: textureFlow, opacity: 1 },
  careersPrinciples: { src: textureFlow, opacity: 0.3 },
  careersWhoWeWant: { src: textureLight, opacity: 0.15 },
  careersOpenRoles: { src: textureFlow, opacity: 0.3 },
  careersRegisterInterest: { src: textureGold, opacity: 0.25 },

  // ── /changelog ──────────────────────────────────────────────────────────
  changelogHero: { src: textureFlow, opacity: 0.2 },
  changelogTimeline: { src: textureLight, opacity: 0.15 },

  // ── /contact ────────────────────────────────────────────────────────────
  contactForm: { src: textureLight, opacity: 1 },

  // ── /customers ──────────────────────────────────────────────────────────
  customersHero: { src: textureFlow, opacity: 0.5 },
  customersIndustries: { src: textureLight, opacity: 0.15 },
  customersPatterns: { src: textureFlow, opacity: 0.15 },
  customersLaunchPartners: { src: textureLight, opacity: 0.15 },
  customersStories: { src: textureLight, opacity: 0.15 },
  customersFooterBand: { src: textureFlow, opacity: 0.15 },

  // ── /docs ─────────────────────────────────────────────────────────────
  docsHero: { src: textureFlow, opacity: 0.5 },
  docsCategoryNav: { src: textureLight, opacity: 0.15 },
  docsCategories: { src: textureLight, opacity: 0.15 },
  docsCategoryCard: { src: textureLight, opacity: 0.15 },
  docsFeedbackFooter: { src: textureFlow, opacity: 0.15 },

  // ── /privacy + /terms (shared LegalPageShell) ─────────────────────────
  legal: { src: textureLight, opacity: 0.12 },

  // ── /product (index) ──────────────────────────────────────────────────
  productHero: { src: textureFlow, opacity: 0.5 },
  productModuleGrid: { src: textureLight, opacity: 0.15 },
  productPlatformRhythm: { src: textureFlow, opacity: 0.15 },

  // ── /product/[module] (shared ProductModuleLayout, all 6 modules) ─────
  moduleHero: { src: textureFlow, opacity: 0.5 },
  modulePillars: { src: textureLight, opacity: 0.15 },
  moduleUseCases: { src: textureFlow, opacity: 0.15 },
  modulePlan: { src: textureLight, opacity: 0.15 },

  // ── /product/how-it-works ─────────────────────────────────────────────
  hiwHero: { src: textureFlow, opacity: 0.5 },
  hiwLifecycle: { src: textureLight, opacity: 0.15 },
  hiwApprovalChains: { src: textureStructure, opacity: 0.45 },
  hiwNotifications: { src: textureLight, opacity: 0.15 },
  hiwBeforeAfter: { src: textureFlow, opacity: 0.15 },

  // ── /product/integrations ─────────────────────────────────────────────
  integrationsHero: { src: textureFlow, opacity: 0.5 },
  integrationsCategoryNav: { src: textureLight, opacity: 0.15 },
  integrationsCategories: { src: textureLight, opacity: 0.15 },
  integrationsCategoryBlock: { src: textureLight, opacity: 0.15 },
  integrationsDevTeaser: { src: textureFlow, opacity: 0.15 },
  integrationsCustomConnector: { src: textureStructure, opacity: 0.45 },

  // ── /product/security ─────────────────────────────────────────────────
  securityHero: { src: textureFlow, opacity: 0.5 },
  securityPillars: { src: textureLight, opacity: 0.15 },
  securityStack: { src: textureFlow, opacity: 0.15 },
  securityCompliance: { src: textureStructure, opacity: 0.45 },
  securityFaq: { src: textureLight, opacity: 0.15 },

  // ── /status ─────────────────────────────────────────────────────────────
  statusSubsystems: { src: textureLight, opacity: 0.15 },
  statusIncidents: { src: textureLight, opacity: 0.15 },

  // ── /tools/savings ────────────────────────────────────────────────────
  savingsHeader: { src: textureLight, opacity: 0.15 },

  // ── /trial + /trial/verify ────────────────────────────────────────────
  trialForm: { src: textureLight, opacity: 1 },
  trialVerify: { src: textureLight, opacity: 0.15 },

  // ── /trust ────────────────────────────────────────────────────────────
  trustHero: { src: textureFlow, opacity: 0.5 },
  trustFrameworks: { src: textureLight, opacity: 0.15 },
  trustSubprocessors: { src: textureFlow, opacity: 0.15 },
  trustDocuments: { src: textureLight, opacity: 0.15 },
  trustDataResidency: { src: textureFlow, opacity: 0.15 },
  trustStatusContact: { src: textureGold, opacity: 0.45 },

  // Shared stand-in / fallback (neutral light texture).
  placeholder: textureLight,
} satisfies Record<string, SectionBackdropSource>;
