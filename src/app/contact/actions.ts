"use server";

/**
 * submitContact — the Server Action behind the /contact form. Validates the
 * inputs the topic shows (CONTACT_TOPICS — the same table the form renders
 * from), emails the topic's inbox via Resend, and returns a serialisable
 * state object for `useActionState`. Nothing is stored, except that an
 * updates signup joins the mailing list when one is configured.
 *
 * `"use server"` modules can only export async functions in Next.js 16
 * — the form-state shape and INITIAL_STATE live in `./state` so the client
 * form and this module can share them. The topics themselves (ContactIntent)
 * are core's, so a link built anywhere lands on a topic this form knows.
 */

import { addToUpdatesList, sendContactEmail } from "@/lib/email";
import { emailLink, emailShell, escapeHtml, eyebrowRow, headerSafe, labelledRow } from "@/lib/email-html";
import { humanCheckRefusal, screenSubmission } from "@/lib/submission-guard";
import { CONTACT_FIELDS, type ContactField, type ContactFormState } from "./state";
import { CONTACT_TOPICS, inputRule, topicEmail, topicInputs, type ContactInput } from "./topics";
import { BRAND, isContactIntent, type ContactIntent } from "@/lib/brand";
import { submittedValues } from "@/lib/submitted-values";
import { isOrgSize } from "@/lib/org-size";
import { isSelectableCountry } from "@/data/countries";
import { errorSummary } from "@/lib/safe-log";
import {
  exceedsLimit,
  FORM_MESSAGES,
  hasEmailShape,
  isWebLink,
  MESSAGE_MIN_LENGTH,
  tooLongMessage,
  type LimitedField,
} from "@/lib/form-rules";

const COUNTRY_NAMES = new Intl.DisplayNames(["en-GB"], { type: "region" });

/** The refusal for a required input left empty. */
const MISSING: Record<ContactInput, string> = {
  name: "Please share your name.",
  email: "Please share your email.",
  organisation: "Please share your organisation.",
  size: "Please choose a size from the list.",
  country: "Please choose your country from the list.",
  relationship: "Please choose the option that fits you best.",
  requestType: "Please choose what you need.",
  module: "Please choose a module.",
  link: "Please share a link.",
  message: "A sentence or two helps us prepare.",
};

/** The inputs with a length cap, and the noun its refusal uses. */
const LENGTH_CAPPED: Partial<Record<ContactInput, { field: LimitedField; noun: string }>> = {
  name: { field: "name", noun: "name" },
  email: { field: "email", noun: "email" },
  organisation: { field: "organisation", noun: "organisation name" },
  link: { field: "link", noun: "link" },
  message: { field: "message", noun: "message" },
};

export async function submitContact(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const answer = await answerContact(formData);
  return answer.status === "error"
    ? { ...answer, values: submittedValues(formData, CONTACT_FIELDS) }
    : answer;
}

/** Why `value` is not an acceptable answer to `input` on this topic, or undefined. */
function refusal(intent: ContactIntent, input: ContactInput, value: string): string | undefined {
  const rule = inputRule(intent, input)!;
  if (!value) return rule.required ? MISSING[input] : undefined;
  const capped = LENGTH_CAPPED[input];
  if (capped && exceedsLimit(value, capped.field)) return tooLongMessage(capped.noun, capped.field);
  if (rule.options && !rule.options.some((option) => option.value === value)) {
    return "Please choose an option from the list.";
  }
  switch (input) {
    case "email":
      return hasEmailShape(value) ? undefined : "That doesn't look like a valid email.";
    case "size":
      return isOrgSize(value) ? undefined : MISSING.size;
    case "country":
      return isSelectableCountry(value) ? undefined : MISSING.country;
    case "link":
      return isWebLink(value) ? undefined : "Please share a full link, starting with https://";
    case "message":
      return value.length < MESSAGE_MIN_LENGTH ? MISSING.message : undefined;
    default:
      return undefined;
  }
}

/** How an answer reads in the team's email — a choice by its label, a country by its name. */
function displayValue(intent: ContactIntent, input: ContactInput, value: string): string {
  if (input === "country") return COUNTRY_NAMES.of(value) ?? value;
  const option = inputRule(intent, input)?.options?.find((choice) => choice.value === value);
  return option?.label ?? value;
}

async function answerContact(formData: FormData): Promise<ContactFormState> {
  const screen = await screenSubmission(formData, "contact");
  const rawIntent = String(formData.get("intent") ?? "general");
  const intent: ContactIntent = isContactIntent(rawIntent) ? rawIntent : "general";
  const topic = CONTACT_TOPICS[intent];

  // A filled decoy field: answer as if it succeeded, and send nothing.
  if (screen.outcome === "decoy") {
    return { status: "success", message: topic.successMessage };
  }
  if (screen.outcome === "refused") return { status: "error", message: screen.message };

  // Only the inputs this topic shows are read; anything else posted is ignored.
  const inputs = topicInputs(intent);
  const answers: Partial<Record<ContactInput, string>> = {};
  const fieldErrors: Partial<Record<ContactField, string>> = {};
  for (const input of inputs) {
    const raw = String(formData.get(input) ?? "").trim();
    const value = input === "country" ? raw.toUpperCase() : raw;
    const problem = refusal(intent, input, value);
    if (problem) fieldErrors[input] = problem;
    else if (value) answers[input] = value;
  }
  if (formData.get("consent") !== "on") {
    fieldErrors.consent = "We need your consent to process this.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, message: FORM_MESSAGES.fixHighlighted };
  }

  const humanRefusal = await humanCheckRefusal(formData);
  if (humanRefusal) return { status: "error", message: humanRefusal };

  const email = answers.email!;
  const failed: ContactFormState = {
    status: "error",
    message: `Something went wrong sending this. Please email ${topicEmail(intent)} directly.`,
  };

  // An updates signup joins the mailing list; the team hears about it only
  // when no list is configured, or for a launch notification (which module).
  let joinedList = false;
  if (topic.joinsUpdatesList) {
    try {
      joinedList = await addToUpdatesList({ email, firstName: answers.name });
    } catch (error) {
      console.error("Updates signup failed:", errorSummary(error));
    }
    if (joinedList && intent === "subscribe") {
      return { status: "success", message: topic.successMessage };
    }
  }

  const sender = answers.name ?? email;
  const subject = `[${BRAND.name} — ${topic.subjectLabel}] ${
    answers.organisation ? `${headerSafe(answers.organisation)} · ` : ""
  }${headerSafe(sender)}`;
  const rows = inputs.flatMap((input) => {
    const value = answers[input];
    if (!value || input === "size") return [];
    const label = inputRule(intent, input)!.label;
    if (input === "email") return [labelledRow(label, emailLink(`mailto:${value}`, value))];
    if (input === "organisation" && answers.size) {
      return [labelledRow(label, `${escapeHtml(value)} · ${escapeHtml(answers.size)}`)];
    }
    if (input === "message") {
      return [labelledRow(label, escapeHtml(value), { valueStyle: "white-space:pre-wrap;line-height:1.55;" })];
    }
    return [labelledRow(label, escapeHtml(displayValue(intent, input, value)))];
  });
  const html = emailShell(
    [
      eyebrowRow(`Intent · ${topic.subjectLabel}${joinedList ? " · added to the updates list" : ""}`, 16),
      ...rows,
    ],
    640,
  );

  try {
    await sendContactEmail({ subject, html, replyTo: email, inbox: topic.inbox });
  } catch (error) {
    console.error("Contact submission failed:", errorSummary(error));
    return failed;
  }

  return { status: "success", message: topic.successMessage };
}
