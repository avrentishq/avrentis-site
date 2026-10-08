/**
 * The site's published contact addresses — one place, so a page, a server
 * action, an email default and `/.well-known/security.txt` can never disagree.
 */
import { LEGAL_PAGES } from "@/lib/brand";

export const CONTACT_EMAIL = {
  /** Sales and general enquiries; the contact form's inbox. */
  general: "hello@avrentis.com",
  /** Trial sign-up problems. */
  trials: "trials@avrentis.com",
  /** Vulnerability reports (responsible disclosure). */
  security: "security@avrentis.com",
} as const;

/** Where the responsible-disclosure policy is published (core owns the path). */
export const DISCLOSURE_POLICY_PATH = LEGAL_PAGES.trust;
