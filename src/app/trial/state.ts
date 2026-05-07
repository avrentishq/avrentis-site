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
      status: "hard_blocked";
      message: string;
    }
  | {
      /**
       * Returned by avrentis-app's feat/trial-auto-policy when the
       * submission is auto-rejected (sanctions hit, disposable domain,
       * or missing-org check). The actions.ts adapter will map the
       * platform's 403 / "auto_rejected" response to this variant.
       *
       * The UI renders it as a clear inline rejection card — see
       * HardBlockedCard in trial-form.tsx (re-uses the same surface).
       */
      status: "auto_rejected";
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
