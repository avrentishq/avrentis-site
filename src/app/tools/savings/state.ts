/**
 * Form-state for the "email me this estimate" action. Kept out of the
 * "use server" module so the client component and the action can share it
 * (Next.js 16 lets "use server" files export only async functions).
 */

export interface EstimateEmailState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldError?: string;
}

export const INITIAL_STATE: EstimateEmailState = { status: "idle" };
