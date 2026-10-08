/**
 * The trial form's one email rule — read by the form as the visitor types
 * (to explain the problem and hold the submit button) and by the server action
 * before anything is forwarded. One module, so the two can never disagree on
 * what is accepted or on what the visitor is told.
 *
 * The platform's trial endpoint re-validates and stays the source of truth;
 * this is the early courtesy check. The reserved-domain rule is core's
 * (`billing/reserved-mail-domain`), shared with the app and the console.
 */

import { isReservedEmailAddress } from "@avrentishq/core/billing/reserved-mail-domain";

/** Mirrors the platform's Zod bound on the trial request's email. */
export const TRIAL_EMAIL_MAX_LENGTH = 320;

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Does the value look like an email address at all? */
export function hasEmailShape(email: string): boolean {
  return EMAIL_SHAPE.test(email);
}

/** The visitor-facing reason a trial email is refused, or `undefined` when it is fine. */
export function trialEmailError(email: string): string | undefined {
  if (!email) return "Please share your work email.";
  if (!hasEmailShape(email)) return "That doesn't look like a valid email.";
  if (email.length > TRIAL_EMAIL_MAX_LENGTH) return "That email is too long.";
  if (isReservedEmailAddress(email)) {
    return "That address can't receive email. Please use the work email you check.";
  }
  return undefined;
}
