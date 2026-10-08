/**
 * Form-state for the "email me this estimate" action. Kept out of the
 * "use server" module so the client component and the action can share it
 * (Next.js 16 lets "use server" files export only async functions).
 */

import type { SubmittedValues } from "@/lib/submitted-values";

/** The fields the estimate email posts; a refusal hands them back (submitted-values.ts). */
export const ESTIMATE_FIELDS = ["email", "consent"] as const;
export type EstimateField = (typeof ESTIMATE_FIELDS)[number];

export interface EstimateEmailState {
  status: "idle" | "success" | "error";
  message?: string;
  /** What the visitor posted, so a page rendered without JavaScript keeps it. */
  values?: SubmittedValues<EstimateField>;
  fieldErrors?: Partial<Record<"email" | "consent", string>>;
}

export const INITIAL_STATE: EstimateEmailState = { status: "idle" };
