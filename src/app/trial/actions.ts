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

const PLATFORM_ORIGIN = process.env.PLATFORM_API_URL ?? "https://app.avrentis.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLES = [
  "CFO",
  "Finance Director",
  "MD",
  "Finance Manager",
  "Operations Manager",
  "Other",
] as const;

const SIZES = ["1–20", "21–50", "51–200", "200+"] as const;

export async function submitTrialRequest(
  _previous: TrialFormState,
  formData: FormData,
): Promise<TrialFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const organisation = String(formData.get("organisation") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const orgSize = String(formData.get("orgSize") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
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
        source: source ? source.slice(0, 200) : undefined,
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
    const mapped: FieldErrors = {};
    for (const [k, v] of Object.entries(backend)) {
      if (v && v[0] && k in ({} as FieldErrors)) {
        (mapped as Record<string, string>)[k] = v[0];
      } else if (v && v[0]) {
        // Permissive map for any field the backend reports; the client
        // form will ignore unknown keys.
        (mapped as Record<string, string>)[k] = v[0];
      }
    }
    return {
      status: "error",
      message: payload.message ?? "Please fix the highlighted fields.",
      fieldErrors: mapped,
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
  if (!token) return { status: "error", message: "Missing token." };

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
