/**
 * Form-state shape + initial value for the /trial page.
 *
 * Lives in a non-"use server" file because Next.js 16 enforces that
 * `"use server"` modules export only async functions — types and
 * consts have to live next door. Both the client form
 * (trial-form.tsx) and the action (actions.ts) import from here.
 */

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
      fieldErrors?: Partial<
        Record<
          "name" | "email" | "organisation" | "role" | "orgSize" | "country" | "consent",
          string
        >
      >;
    };

export const INITIAL_STATE: TrialFormState = { status: "idle" };
