"use server";

/**
 * submitTrialRequest — server action behind the /trial form. Forwards
 * the submission to the platform's public trial endpoint and returns a
 * serialisable state object for `useActionState` on the client side.
 *
 * The platform does the real validation, eligibility routing, and
 * magic-link dispatch. This module is a thin adapter that keeps the
 * platform URL out of the client bundle and normalises the response
 * shape.
 *
 * `"use server"` modules can only export async functions in Next.js 16
 * — the form-state type + INITIAL_STATE live in `./state` so the
 * client form and this module can share them without tripping the
 * compiler check.
 */

import type { TrialFormState } from "./state";
import { ORG_SIZES as SIZES } from "@/lib/org-size";
import { PLATFORM_ORIGIN } from "@/lib/platform";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit, clientIp } from "@/lib/rate-limit";


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLES = [
  "CFO",
  "Finance Director",
  "MD",
  "Finance Manager",
  "Operations Manager",
  "Other",
] as const;

export async function submitTrialRequest(
  _previous: TrialFormState,
  formData: FormData,
): Promise<TrialFormState> {
  // Honeypot — bots fill hidden fields. Silently mimic success without forwarding.
  const honeypot = formData.get("fax_number");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "queued_for_review", message: "Thanks — we'll be in touch shortly." };
  }

  if (!rateLimit(`trial:${await clientIp()}`, 5, 10 * 60_000)) {
    return {
      status: "error",
      message: "You've submitted a few requests in a short window. Please wait a moment and try again.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const organisation = String(formData.get("organisation") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const orgSize = String(formData.get("orgSize") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const roleOther = String(formData.get("roleOther") ?? "").trim().slice(0, 120);
  const consent = formData.get("consent") === "on";

  // Light client-side validation so we fail fast before hitting the
  // platform. Platform re-validates and is the source of truth.
  type FieldErrors = Partial<
    Record<
      "name" | "email" | "organisation" | "role" | "orgSize" | "country" | "consent",
      string
    >
  >;
  const fieldErrors: FieldErrors = {};
  if (!name) fieldErrors.name = "Please share your full name.";
  if (!email) fieldErrors.email = "Please share your work email.";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "That doesn't look like a valid email.";
  if (!organisation) fieldErrors.organisation = "Please share your organisation.";
  if (!role || !ROLES.includes(role as (typeof ROLES)[number])) {
    fieldErrors.role = "Please select your role.";
  }
  if (!orgSize || !SIZES.includes(orgSize as (typeof SIZES)[number])) {
    fieldErrors.orgSize = "Please select your organisation size.";
  }
  if (!country) fieldErrors.country = "Please select your country.";
  if (!consent) fieldErrors.consent = "We need your consent to process this request.";

  // Length bounds — mirror the platform's Zod limits so we fail fast and never
  // forward unbounded input into the request body.
  if (name.length > 200) fieldErrors.name = "That name is too long (200 character max).";
  if (email.length > 320) fieldErrors.email = "That email is too long.";
  if (organisation.length > 200)
    fieldErrors.organisation = "That organisation name is too long (200 character max).";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  // Bot defence — enforced only when Turnstile is fully configured.
  const turnstile = await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""));
  if (!turnstile.ok) {
    return {
      status: "error",
      message: "We couldn't verify that you're human. Please complete the challenge and try again.",
    };
  }

  // A typed "Other" role rides along in `source` — the platform's `role` field
  // is an allow-list, so the free-text detail can't go there directly.
  const sourceOut =
    role === "Other" && roleOther
      ? source
        ? `Role: ${roleOther} · ${source}`
        : `Role: ${roleOther}`
      : source;

  let response: Response;
  try {
    response = await fetch(`${PLATFORM_ORIGIN}/api/v1/public/trial/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        organisation,
        role,
        orgSize,
        country: country.toUpperCase(),
        source: sourceOut ? sourceOut.slice(0, 200) : undefined,
        consent: true,
      }),
    });
  } catch {
    return {
      status: "error",
      message:
        "We couldn't reach the provisioning service. Please try again in a moment, or contact trials@avrentis.com.",
    };
  }

  const payload = (await response.json().catch(() => ({}))) as {
    status?: string;
    message?: string;
    errors?: { fieldErrors?: Record<string, string[]> };
  };

  if (response.status === 403 && payload.status === "hard_blocked") {
    return { status: "hard_blocked", message: payload.message ?? "Trial unavailable." };
  }

  if (response.status === 202 && payload.status === "verification_sent") {
    return {
      status: "verification_sent",
      email,
      message: payload.message ?? `Check ${email} for your verification link.`,
    };
  }

  if (response.status === 202 && payload.status === "queued_for_review") {
    return {
      status: "queued_for_review",
      message: payload.message ?? "We'll be in touch within 4 hours during business hours.",
    };
  }

  if (response.status === 422) {
    const backend = payload.errors?.fieldErrors ?? {};
    // Only map keys the form actually renders — otherwise the field-error
    // banner is suppressed but nothing shows (a silent no-op).
    const KNOWN = new Set([
      "name",
      "email",
      "organisation",
      "role",
      "orgSize",
      "country",
      "consent",
    ]);
    const mapped: FieldErrors = {};
    for (const [k, v] of Object.entries(backend)) {
      if (v && v[0] && KNOWN.has(k)) (mapped as Record<string, string>)[k] = v[0];
    }
    if (Object.keys(mapped).length > 0) {
      return {
        status: "error",
        message: payload.message ?? "Please fix the highlighted fields.",
        fieldErrors: mapped,
      };
    }
    // Backend rejected on a field the form doesn't render — surface a general
    // message so the user always gets feedback.
    return {
      status: "error",
      message: payload.message ?? "We couldn't process that. Please review your details and try again.",
    };
  }

  if (response.status === 429) {
    return {
      status: "error",
      message:
        "You've submitted a few trial requests in a short window. Please wait a moment and try again.",
    };
  }

  return {
    status: "error",
    message:
      payload.message ??
      "Something went wrong. Please try again or contact trials@avrentis.com.",
  };
}

/**
 * Re-issue a fresh magic-link for a submission whose previous link has
 * expired. The client holds the expired raw token and passes it here.
 */
export async function reissueTrialToken(
  _previous: { status: "idle" | "sent" | "error"; message?: string },
  formData: FormData,
): Promise<{ status: "idle" | "sent" | "error"; message?: string }> {
  const token = String(formData.get("token") ?? "").trim();
  if (!token || token.length > 512) return { status: "error", message: "Missing or invalid token." };

  if (!rateLimit(`reissue:${await clientIp()}`, 3, 10 * 60_000)) {
    return { status: "error", message: "Please wait a moment before requesting another link." };
  }

  let response: Response;
  try {
    response = await fetch(`${PLATFORM_ORIGIN}/api/v1/public/trial/reissue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch {
    return { status: "error", message: "Could not contact the service. Try again shortly." };
  }

  const payload = (await response.json().catch(() => ({}))) as { message?: string };

  if (response.ok) {
    return {
      status: "sent",
      message: payload.message ?? "A new verification link has been sent.",
    };
  }

  return {
    status: "error",
    message:
      payload.message ??
      "Could not issue a new link. Please fill in the form again to start fresh.",
  };
}
