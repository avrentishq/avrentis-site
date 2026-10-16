/**
 * Form-state shape + initial value for the /trial page.
 *
 * Lives in a non-"use server" file because Next.js 16 enforces that
 * `"use server"` modules export only async functions — types and
 * consts have to live next door. Both the client form
 * (trial-form.tsx) and the action (actions.ts) import from here.
 */

import type { SubmittedValues } from "@/lib/submitted-values";

/** The fields a trial request posts; a refusal hands them back (submitted-values.ts). */
export const TRIAL_FIELDS = [
  "name",
  "email",
  "organisation",
  "role",
  "roleOther",
  "orgSize",
  "sector",
  "sectorOther",
  "country",
  "source",
  "consent",
] as const;
export type TrialField = (typeof TRIAL_FIELDS)[number];

/**
 * The fields the form can show an error on — the action's own checks and the
 * platform's 422 answer are both narrowed to these (map-response.ts), so an
 * error is never raised on a field the visitor cannot see.
 */
export const TRIAL_ERROR_FIELDS = [
  "name",
  "email",
  "organisation",
  "role",
  "orgSize",
  "sector",
  "country",
  "consent",
] as const satisfies readonly TrialField[];
export type TrialErrorField = (typeof TRIAL_ERROR_FIELDS)[number];
export type TrialFieldErrors = Partial<Record<TrialErrorField, string>>;

/**
 * The job titles a trial request may name — the platform's `role` field is an
 * allow-list of these values. Ordered likeliest-first, the order the form
 * shows them; `label` is what the visitor reads.
 */
export const TRIAL_ROLES = [
  { value: "Finance Manager", label: "Finance Manager" },
  { value: "Finance Director", label: "Finance Director" },
  { value: "CFO", label: "CFO" },
  { value: "Operations Manager", label: "Operations Manager" },
  { value: "MD", label: "MD / CEO" },
  { value: "Other", label: "Other" },
] as const;
export type TrialRole = (typeof TRIAL_ROLES)[number]["value"];

/** The role whose free-text detail rides along with the request. */
export const OTHER_ROLE: TrialRole = "Other";

/** Whether `value` is one of the trial's roles. */
export function isTrialRole(value: string): value is TrialRole {
  return TRIAL_ROLES.some((role) => role.value === value);
}

export type TrialFormState =
  | { status: "idle" }
  | {
      status: "verification_sent";
      message: string;
      email: string;
    }
  | {
      status: "queued_for_review";
      message: string;
      /** The address the request was made with, when known. */
      email?: string;
    }
  | {
      /**
       * The platform rejected the submission (HTTP 403). `message` is the
       * platform's own user-facing explanation — already had a trial, missing
       * organisation, disposable email domain, sanctioned country — so surface
       * it rather than replacing it with generic copy.
       *
       * Rendered by HardBlockedCard in trial-form.tsx. There was previously a
       * second `auto_rejected` variant for the same thing; both rendered the
       * identical card, so it was redundant and is gone. Rejections of every
       * kind map here.
       */
      status: "hard_blocked";
      message: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: TrialFieldErrors;
      /** What the visitor posted, so a page rendered without JavaScript keeps it. */
      values?: SubmittedValues<TrialField>;
    };

export const INITIAL_STATE: TrialFormState = { status: "idle" };
