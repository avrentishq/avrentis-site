/**
 * Form-state shape + initial value for the /contact page.
 *
 * Lives in a non-"use server" file because Next.js 16 enforces that
 * `"use server"` modules export only async functions — types and
 * consts have to live next door. Both the client form
 * (contact-form.tsx) and the action (actions.ts) import from here.
 */

export type ContactIntent =
  | "demo"
  | "security"
  | "disclosure"
  | "privacy"
  | "legal"
  | "careers"
  | "feedback"
  | "subscribe"
  | "notify"
  | "beta"
  | "roadmap"
  | "general";

export const VALID_INTENTS: ContactIntent[] = [
  "demo",
  "security",
  "disclosure",
  "privacy",
  "legal",
  "careers",
  "feedback",
  "subscribe",
  "notify",
  "beta",
  "roadmap",
  "general",
];

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "organisation" | "message" | "consent", string>>;
}

export const INITIAL_STATE: ContactFormState = { status: "idle" };
