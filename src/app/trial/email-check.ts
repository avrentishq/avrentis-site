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

import { isReservedEmailAddress } from "@edidi-hq/core/billing/reserved-mail-domain";
import { exceedsLimit, hasEmailShape, tooLongMessage } from "@/lib/form-rules";

/** The visitor-facing reason a trial email is refused, or `undefined` when it is fine. */
export function trialEmailError(email: string): string | undefined {
  if (!email) return "Please share your work email.";
  if (!hasEmailShape(email)) return "That doesn't look like a valid email.";
  if (exceedsLimit(email, "email")) return tooLongMessage("email", "email");
  if (isReservedEmailAddress(email)) {
    return "That address can't receive email. Please use the work email you check.";
  }
  return undefined;
}
