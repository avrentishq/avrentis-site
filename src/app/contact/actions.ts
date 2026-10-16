"use server";

/**
 * submitContact — the Server Action behind the /contact form. Validates
 * inputs, dispatches an inbound notification via Resend, and returns a
 * serialisable state object for `useActionState`. No data is persisted;
 * the email is the record.
 *
 * `"use server"` modules can only export async functions in Next.js 16
 * — the form-state shape and INITIAL_STATE live in `./state` so the client
 * form and this module can share them. The topics themselves (ContactIntent)
 * are core's, so a link built anywhere lands on a topic this form knows.
 */

import { sendContactEmail } from "@/lib/email";
import { emailLink, emailShell, escapeHtml, eyebrowRow, headerSafe, labelledRow } from "@/lib/email-html";
import { humanCheckRefusal, screenSubmission } from "@/lib/submission-guard";
import { CONTACT_FIELDS, type ContactFormState } from "./state";
import { CONTACT_TOPICS } from "./topics";
import { BRAND, isContactIntent, type ContactIntent } from "@/lib/brand";
import { submittedValues } from "@/lib/submitted-values";
import { CONTACT_EMAIL, ENQUIRY_REPLY_TIME } from "@/lib/contacts";
import { ORG_SIZES } from "@/lib/org-size";
import { isSelectableCountry } from "@/data/countries";
import { errorSummary } from "@/lib/safe-log";
import {
  exceedsLimit,
  FORM_MESSAGES,
  hasEmailShape,
  MESSAGE_MIN_LENGTH,
  tooLongMessage,
} from "@/lib/form-rules";

const COUNTRY_NAMES = new Intl.DisplayNames(["en-GB"], { type: "region" });

function isOrgSize(value: string): boolean {
  return (ORG_SIZES as readonly string[]).includes(value);
}

export async function submitContact(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const answer = await answerContact(formData);
  return answer.status === "error"
    ? { ...answer, values: submittedValues(formData, CONTACT_FIELDS) }
    : answer;
}

async function answerContact(formData: FormData): Promise<ContactFormState> {
  const screen = await screenSubmission(formData, "contact");
  // A filled decoy field: answer as if it succeeded, and send nothing.
  if (screen.outcome === "decoy") {
    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  }
  if (screen.outcome === "refused") return { status: "error", message: screen.message };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const organisation = String(formData.get("organisation") ?? "").trim();
  const size = String(formData.get("size") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim().toUpperCase();
  const message = String(formData.get("message") ?? "").trim();
  const consent = formData.get("consent") === "on";
  const rawIntent = String(formData.get("intent") ?? "general");
  const intent: ContactIntent = isContactIntent(rawIntent) ? rawIntent : "general";

  const fieldErrors: ContactFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Please share your name.";
  if (!email) fieldErrors.email = "Please share your email.";
  else if (!hasEmailShape(email)) fieldErrors.email = "That doesn't look like a valid email.";
  // Personal email is accepted on every intent — disclosure, careers, and
  // general enquiries legitimately come from non-corporate addresses.
  if (!organisation) fieldErrors.organisation = "Please share your organisation.";
  // Size and country are optional, but only ever one the form offers.
  if (size && !isOrgSize(size)) fieldErrors.size = "Please choose a size from the list.";
  if (country && !isSelectableCountry(country)) {
    fieldErrors.country = "Please choose your country from the list.";
  }
  if (message.length < MESSAGE_MIN_LENGTH) {
    fieldErrors.message = "A sentence or two about your use case helps us prepare.";
  }
  if (!consent) fieldErrors.consent = "We need your consent to process this enquiry.";

  // Length bounds — fields are HTML-escaped below, but cap them so the email
  // payload can't be inflated with megabytes of input.
  if (exceedsLimit(name, "name")) fieldErrors.name = tooLongMessage("name", "name");
  if (exceedsLimit(email, "email")) fieldErrors.email = tooLongMessage("email", "email");
  if (exceedsLimit(organisation, "organisation")) {
    fieldErrors.organisation = tooLongMessage("organisation name", "organisation");
  }
  if (exceedsLimit(message, "message")) fieldErrors.message = tooLongMessage("message", "message");

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, message: FORM_MESSAGES.fixHighlighted };
  }

  const humanRefusal = await humanCheckRefusal(formData);
  if (humanRefusal) return { status: "error", message: humanRefusal };

  const topic = CONTACT_TOPICS[intent].subjectLabel;
  const subject = `[${BRAND.name} — ${topic}] ${headerSafe(organisation)} · ${headerSafe(name)}`;
  const countryName = country ? (COUNTRY_NAMES.of(country) ?? country) : "";
  const html = emailShell(
    [
      eyebrowRow(`Intent · ${topic}`, 16),
      labelledRow("Name", escapeHtml(name)),
      labelledRow("Work email", emailLink(`mailto:${email}`, email)),
      labelledRow("Organisation", `${escapeHtml(organisation)}${size ? ` · ${escapeHtml(size)}` : ""}`),
      countryName ? labelledRow("Country", escapeHtml(countryName)) : "",
      labelledRow("Message", escapeHtml(message), { valueStyle: "white-space:pre-wrap;line-height:1.55;" }),
    ],
    640,
  );

  try {
    await sendContactEmail({ subject, html, replyTo: email });
  } catch (error) {
    console.error("Contact submission failed:", errorSummary(error));
    return {
      status: "error",
      message: `Something went wrong sending your enquiry. Please email ${CONTACT_EMAIL.general} directly.`,
    };
  }

  return {
    status: "success",
    message: `Thanks — we've received your enquiry and will reply ${ENQUIRY_REPLY_TIME}.`,
  };
}
