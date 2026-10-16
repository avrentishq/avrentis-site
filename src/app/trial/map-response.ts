/**
 * Maps the platform's `POST /api/v1/public/trial/request` response onto
 * TrialFormState.
 *
 * Pure and separate from actions.ts on purpose — same split as
 * tools/savings/{compute,actions}.ts — so the contract can be tested without
 * a network, a rate limiter, or Turnstile. This mirror is the single most
 * drift-prone code in the repo: the response shape is defined in the
 * avrentis-app repo, is NOT exported from @avrentishq/core, and neither side
 * has a test pinning it. It silently broke once already (see below), so any
 * change here belongs with a case in map-response.test.ts.
 *
 * The contract, verified against the platform route:
 *
 *   202 + status "verification_sent"  → magic link sent
 *   202 + status "queued_for_review"  → human review; no time is promised
 *   403 + status "rejected"           → auto-policy rejection; `message` is
 *                                       user-facing copy explaining why
 *   422 + errors.fieldErrors          → Zod flatten() from parseJsonBody
 *   429                               → rate limited
 *   400 / 500                         → generic failure
 *
 * HISTORY — do not "simplify" the 403 branch back to a status-string match.
 * It originally required `status === "hard_blocked"`, a value the platform has
 * never sent. Every rejection therefore fell through to the generic error and
 * the applicant lost the specific reason. The endpoint returns 403 from exactly
 * one place — the rejection — so 403 alone is the reliable signal.
 */

import { TRIAL_ERROR_FIELDS, type TrialErrorField, type TrialFieldErrors, type TrialFormState } from "./state";
import { CONTACT_EMAIL } from "@/lib/contacts";
import { FORM_MESSAGES } from "@/lib/form-rules";

/** Field keys the trial form actually renders, so a mapped error can be shown. */
const RENDERED_FIELDS: ReadonlySet<string> = new Set(TRIAL_ERROR_FIELDS);

function isRenderedField(key: string): key is TrialErrorField {
  return RENDERED_FIELDS.has(key);
}

export interface TrialResponsePayload {
  status?: string;
  message?: string;
  errors?: { fieldErrors?: Record<string, string[]> };
}

export function mapTrialResponse(
  httpStatus: number,
  payload: TrialResponsePayload,
  email: string,
): TrialFormState {
  // Rejection. Matched on the status code alone — see HISTORY above.
  if (httpStatus === 403) {
    return {
      status: "hard_blocked",
      message: payload.message ?? "Trial unavailable.",
    };
  }

  if (httpStatus === 202 && payload.status === "verification_sent") {
    return {
      status: "verification_sent",
      email,
      message: payload.message ?? `Check ${email} for your verification link.`,
    };
  }

  if (httpStatus === 202 && payload.status === "queued_for_review") {
    return {
      status: "queued_for_review",
      email,
      // The platform's own words when it omits a message: it promises a review,
      // never a time, and this fallback must not promise more than it does.
      message:
        payload.message ??
        "We have received your trial request. A member of our team will review it and be in touch to set up your trial.",
    };
  }

  if (httpStatus === 422) {
    const backend = payload.errors?.fieldErrors ?? {};
    // Only map keys the form renders — otherwise the field-error banner is
    // suppressed but nothing shows, which reads as a silent no-op.
    const mapped: TrialFieldErrors = {};
    for (const [key, messages] of Object.entries(backend)) {
      if (messages && messages[0] && isRenderedField(key)) {
        mapped[key] = messages[0];
      }
    }
    if (Object.keys(mapped).length > 0) {
      return {
        status: "error",
        message: payload.message ?? FORM_MESSAGES.fixHighlighted,
        fieldErrors: mapped,
      };
    }
    // Rejected on a field the form doesn't render — always give feedback.
    return {
      status: "error",
      message:
        payload.message ??
        "We couldn't process that. Please review your details and try again.",
    };
  }

  if (httpStatus === 429) {
    return { status: "error", message: FORM_MESSAGES.rateLimited };
  }

  return {
    status: "error",
    message:
      payload.message ??
      `Something went wrong. Please try again or contact ${CONTACT_EMAIL.trials}.`,
  };
}
