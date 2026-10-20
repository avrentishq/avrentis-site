import { SITE_PAGES } from "@/lib/brand";
import { SITE_ROUTES } from "@/lib/routes";
import { START_TRIAL_CTA } from "@/lib/trial-terms";

/**
 * The button pair at the top of a product page — a module page or a suite
 * page — when what it describes is available today. One definition, so the two
 * kinds of product page can never show different buttons again.
 */
export const PRODUCT_HERO_CTAS = {
  primary: { label: START_TRIAL_CTA, href: SITE_PAGES.trial() },
  secondary: { label: "See how it works", href: SITE_ROUTES.howItWorks },
} as const;
