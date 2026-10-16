/**
 * State of the verify page's confirm button (`confirmTrialVerification` in
 * ../../actions.ts). Lives outside the "use server" module, which may export
 * only async functions.
 *
 * `idle` shows the confirm card. Any other status is the platform's answer
 * (expired, not_found, rejected) or `error`, rendered by VerifyResult. Success
 * never comes back: the action redirects to the workspace invite.
 */
export type VerifyState = { status: "idle" } | { status: string; message: string };

export const INITIAL_VERIFY_STATE: VerifyState = { status: "idle" };

/** Shown when a link cannot be verified and the platform gave no reason. */
export const VERIFY_FAILED_MESSAGE = "We couldn't verify this link.";
