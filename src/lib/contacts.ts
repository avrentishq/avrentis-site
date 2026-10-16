/**
 * The site's published contact addresses — one place, so a page, a server
 * action, an email default and `/.well-known/security.txt` can never disagree.
 */
import { BRAND, LEGAL_PAGES } from "@/lib/brand";
import { isLaunchHidden } from "@/lib/launch";

/** Core owns the addresses (`BRAND`), so the product's emails and this site name the same mailboxes. */
export const CONTACT_EMAIL = {
  /** Sales and general enquiries; the contact form's inbox. */
  general: BRAND.contactEmail,
  /** Trial sign-up problems. */
  trials: BRAND.trialsEmail,
  /** Vulnerability reports (responsible disclosure). */
  security: BRAND.securityEmail,
  /** Customer support for people already using the product (the organisation schema's contact point). */
  support: BRAND.supportEmail,
} as const;

/**
 * What the site promises someone who writes in — one wording, so the contact
 * page, its form, its confirmation and the security pages cannot disagree.
 *
 * No reply time: like the product app, the site promises that a person reads
 * every message, not when they answer. The one time it does state is security
 * triage (standard responsible-disclosure practice). The trial's review queue
 * promises no time either — its confirmation is the platform's own message.
 */
export const ENQUIRY_PROMISE = "A real person reads every message.";
export const SECURITY_TRIAGE_TIME = "within two business days";

/**
 * Where the responsible-disclosure policy is published (core owns the paths):
 * the trust centre once it is shown, the security overview while the launch
 * gate hides it — never a link that 404s. Showing the trust centre (deleting
 * its HIDDEN_AT_LAUNCH entry) switches this over with no other edit.
 */
const DISCLOSURE_POLICY_PAGES = [LEGAL_PAGES.trust, LEGAL_PAGES.security] as const;

export function disclosurePolicyPath(): string {
  return DISCLOSURE_POLICY_PAGES.find((path) => !isLaunchHidden(path)) ?? LEGAL_PAGES.security;
}
