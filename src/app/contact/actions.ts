"use server";

/**
 * submitContact — the Server Action behind the /contact form. Validates
 * inputs, dispatches an inbound notification via Resend, and returns a
 * serialisable state object for `useActionState`. No data is persisted;
 * the email is the record.
 *
 * `"use server"` modules can only export async functions in Next.js 16
 * — the form-state shape, INITIAL_STATE, and the ContactIntent enum
 * live in `./state` so the client form and this module can share them.
 */

import { sendContactEmail } from "@/lib/email";
import { verifyTurnstile } from "@/lib/turnstile";
import {
  type ContactFormState,
  type ContactIntent,
  VALID_INTENTS,
} from "./state";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "live.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
]);

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function intentLabel(intent: ContactIntent): string {
  switch (intent) {
    case "demo":
      return "Personalised demo";
    case "security":
      return "Security review";
    case "disclosure":
      return "Responsible disclosure";
    case "privacy":
      return "Data-protection enquiry";
    case "legal":
      return "Legal enquiry";
    case "careers":
      return "Careers — register interest";
    case "feedback":
      return "Docs feedback";
    case "subscribe":
      return "Subscribe to updates";
    case "notify":
      return "Launch notification";
    case "beta":
      return "Beta access";
    case "roadmap":
      return "Roadmap input";
    case "general":
      return "General enquiry";
  }
}

export async function submitContact(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot — bots fill every field they can see. If this is set, silently succeed.
  // Field name is deliberately non-obvious so naive form crawlers fill it anyway.
  const honeypot = formData.get("fax_number");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const organisation = String(formData.get("organisation") ?? "").trim();
  const size = String(formData.get("size") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const consent = formData.get("consent") === "on";
  const rawIntent = String(formData.get("intent") ?? "general");
  const intent: ContactIntent = (VALID_INTENTS as string[]).includes(rawIntent)
    ? (rawIntent as ContactIntent)
    : "general";

  const fieldErrors: ContactFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Please share your name.";
  if (!email) fieldErrors.email = "Please share your work email.";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "That doesn't look like a valid email.";
  else {
    const domain = email.split("@")[1]?.toLowerCase();
    if (domain && FREE_EMAIL_DOMAINS.has(domain)) {
      fieldErrors.email = "Please use your work email — we reply faster to verified domains.";
    }
  }
  if (!organisation) fieldErrors.organisation = "Please share your organisation.";
  if (!message || message.length < 10) {
    fieldErrors.message = "A sentence or two about your use case helps us prepare.";
  }
  if (!consent) fieldErrors.consent = "We need your consent to process this enquiry.";

  // Length bounds — fields are HTML-escaped below, but cap them so the email
  // payload can't be inflated with megabytes of input.
  if (name.length > 200) fieldErrors.name = "That name is too long (200 character max).";
  if (email.length > 320) fieldErrors.email = "That email is too long.";
  if (organisation.length > 200)
    fieldErrors.organisation = "That organisation name is too long (200 character max).";
  if (message.length > 5000)
    fieldErrors.message = "That message is too long (5000 character max).";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, message: "Please fix the highlighted fields." };
  }

  // Bot defence — verified when Turnstile is configured.
  const turnstile = await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""));
  if (!turnstile.ok) {
    return {
      status: "error",
      message: "We couldn't verify that you're human. Please complete the challenge and try again.",
    };
  }

  // Strip CR/LF from user values used in the subject so they can't inject extra
  // email headers (defence-in-depth — the HTML body is already escaped below).
  const safeOrg = organisation.replace(/[\r\n]+/g, " ");
  const safeName = name.replace(/[\r\n]+/g, " ");
  const subject = `[Avrentis — ${intentLabel(intent)}] ${safeOrg} · ${safeName}`;
  const html = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#0f172a;max-width:640px;">
      <tr><td style="padding:0 0 16px;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase;">Intent · ${escape(intentLabel(intent))}</td></tr>
      <tr><td style="padding:0 0 4px;color:#64748b;font-size:12px;">Name</td></tr>
      <tr><td style="padding:0 0 12px;">${escape(name)}</td></tr>
      <tr><td style="padding:0 0 4px;color:#64748b;font-size:12px;">Work email</td></tr>
      <tr><td style="padding:0 0 12px;"><a href="mailto:${escape(email)}" style="color:#C68B2F;text-decoration:none;">${escape(email)}</a></td></tr>
      <tr><td style="padding:0 0 4px;color:#64748b;font-size:12px;">Organisation</td></tr>
      <tr><td style="padding:0 0 12px;">${escape(organisation)}${size ? ` · ${escape(size)}` : ""}</td></tr>
      ${country ? `<tr><td style="padding:0 0 4px;color:#64748b;font-size:12px;">Country</td></tr><tr><td style="padding:0 0 12px;">${escape(country)}</td></tr>` : ""}
      <tr><td style="padding:0 0 4px;color:#64748b;font-size:12px;">Message</td></tr>
      <tr><td style="padding:0 0 12px;white-space:pre-wrap;line-height:1.55;">${escape(message)}</td></tr>
    </table>
  `;

  try {
    await sendContactEmail({ subject, html, replyTo: email });
  } catch (err) {
    console.error("Contact submission failed:", err);
    return {
      status: "error",
      message: "Something went wrong sending your enquiry. Please email hello@avrentis.com directly.",
    };
  }

  return {
    status: "success",
    message: "Thanks — we've received your enquiry and will reply within one business day.",
  };
}
