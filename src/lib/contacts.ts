/**
 * The site's published contact addresses — one place, so a page, a server
 * action, an email default and `/.well-known/security.txt` can never disagree.
 */
import { LEGAL_PAGES } from "@/lib/brand";
import { isLaunchHidden } from "@/lib/launch";

export const CONTACT_EMAIL = {
  /** Sales and general enquiries; the contact form's inbox. */
  general: "hello@avrentis.com",
  /** Trial sign-up problems. */
  trials: "trials@avrentis.com",
  /** Vulnerability reports (responsible disclosure). */
  security: "security@avrentis.com",
} as const;

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
