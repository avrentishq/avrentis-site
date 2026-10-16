/**
 * Form-state shape + initial value for the /contact page.
 *
 * Lives in a non-"use server" file because Next.js 16 enforces that
 * `"use server"` modules export only async functions — types and
 * consts have to live next door. Both the client form
 * (contact-form.tsx) and the action (actions.ts) import from here.
 */

import type { SubmittedValues } from "@/lib/submitted-values";
import { CONTACT_INPUTS } from "./topics";

/**
 * The fields an enquiry can post — every topic input plus consent; a refusal
 * hands them back (submitted-values.ts), and each can carry an error of its
 * own. Which of them a topic shows is `CONTACT_TOPICS[intent].inputs`.
 */
export const CONTACT_FIELDS = [...CONTACT_INPUTS, "consent"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** What the visitor posted, so a page rendered without JavaScript keeps it. */
  values?: SubmittedValues<ContactField>;
}

export const INITIAL_STATE: ContactFormState = { status: "idle" };
