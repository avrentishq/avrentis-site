/* ── The trial's terms, from core ─────────────────────────────── */

import {
  READ_ONLY_GRACE_DAYS,
  TRIAL_DURATION_DAYS,
  TRIAL_PLAN,
} from "@avrentishq/core/billing/trial-deadlines";
import {
  TRIAL_MESSAGE_CAP,
  TRIAL_SEAT_CAP,
  TRIAL_STORAGE_BYTES,
} from "@avrentishq/core/billing/capacity";
import { planName } from "@avrentishq/core/billing/catalog";
import { formatByteSize } from "@avrentishq/core/billing/limit-format";

/**
 * Every number the site states about a trial — its length, the read-only grace
 * after it, the plan it runs on and its fair-use caps — read from the constants
 * the product enforces, never typed into copy.
 *
 * "30-day trial" used to be written out in more than a dozen places, and the
 * grace period in a few more. Changing the trial meant finding them all, and the
 * one that was missed went on promising the old terms. `trial-terms.lock.test.ts`
 * fails on a day count, seat count or plan name typed next to "trial".
 *
 * A page that already renders the pricing API's `trial` block reads `days` and
 * `seatCap` from it instead (the product's live answer); everything else reads
 * these. The two agree whenever the site and the app pin the same core.
 */

export { READ_ONLY_GRACE_DAYS, TRIAL_DURATION_DAYS, TRIAL_MESSAGE_CAP, TRIAL_PLAN, TRIAL_SEAT_CAP };

/** "30-day" — the adjective form: "Start your 30-day trial". */
export const TRIAL_LENGTH = `${TRIAL_DURATION_DAYS}-day`;

/** The plan a trial runs on, by its proper name ("Business"). */
export const TRIAL_PLAN_NAME = planName(TRIAL_PLAN);

/** The trial's storage cap in the unit it is counted in ("2 GiB"). */
export const TRIAL_STORAGE = formatByteSize(TRIAL_STORAGE_BYTES);

/** The day, counted from sign-up, a trial that never converted is closed. */
export const TRIAL_CLOSE_DAY = TRIAL_DURATION_DAYS + READ_ONLY_GRACE_DAYS;

/** The trial call to action, wherever a button or link offers one. */
export const START_TRIAL_CTA = `Start your ${TRIAL_LENGTH} trial`;
