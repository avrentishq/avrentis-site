/**
 * The rules every public form shares — field length limits, the email shape,
 * the hidden decoy field's name and the visitor-facing wording of the refusals
 * every form can give. Read by the forms (as `maxLength` and as-you-type
 * checks) and by their Server Actions, so the browser and the server can never
 * disagree on what is accepted or on what the visitor is told.
 *
 * Client-safe: no server imports. `form-rules.lock.test.ts` fails on a typed
 * copy of the decoy field's name, the email pattern or a length cap anywhere
 * in `src/app` or `src/components`.
 */

import { TRIAL_REQUEST_LIMITS, TRIAL_TOKEN_LENGTH } from "@avrentishq/core/trial/request-terms";

/**
 * The longest value each field accepts, in characters. Name, email,
 * organisation and source are core's bounds on a trial request and `token` its
 * bound on a magic-link token — the same numbers the app's API enforces, so a
 * form can never accept what the platform will refuse. The message and the
 * "Other" detail are the site's own.
 */
export const FORM_LIMITS = {
  name: TRIAL_REQUEST_LIMITS.name,
  email: TRIAL_REQUEST_LIMITS.email,
  organisation: TRIAL_REQUEST_LIMITS.organisation,
  source: TRIAL_REQUEST_LIMITS.source,
  message: 5000,
  /** The free-text detail behind an "Other" choice (role, industry). */
  otherDetail: 120,
  token: TRIAL_TOKEN_LENGTH.max,
} as const;

export type LimitedField = keyof typeof FORM_LIMITS;

/** Whether `value` is longer than `field` accepts. */
export function exceedsLimit(value: string, field: LimitedField): boolean {
  return value.length > FORM_LIMITS[field];
}

/** `value` cut to the length `field` accepts. */
export function withinLimit(value: string, field: LimitedField): string {
  return value.slice(0, FORM_LIMITS[field]);
}

/** "That name is too long (200 character max)." */
export function tooLongMessage(noun: string, field: LimitedField): string {
  return `That ${noun} is too long (${FORM_LIMITS[field].toLocaleString("en-GB")} character max).`;
}

/** The shortest enquiry message the contact form accepts. */
export const MESSAGE_MIN_LENGTH = 10;

/**
 * The hidden decoy field. People never see it; form-filling bots do, and a
 * filled one is answered as if it succeeded, without sending anything.
 */
export const HONEYPOT_FIELD = "fax_number";

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Does the value look like an email address at all? */
export function hasEmailShape(email: string): boolean {
  return EMAIL_SHAPE.test(email);
}

/** The refusals every form can give, in one wording each. */
export const FORM_MESSAGES = {
  fixHighlighted: "Please fix the highlighted fields.",
  humanCheckFailed:
    "We couldn't verify that you're human. Please complete the challenge and try again.",
  rateLimited: "You've sent a few requests in a short time. Please wait a few minutes and try again.",
} as const;
