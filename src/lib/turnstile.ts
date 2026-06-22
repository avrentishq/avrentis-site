import "server-only";

/**
 * Cloudflare Turnstile server-side verification for the public contact form.
 *
 * Gated on env: when `TURNSTILE_SECRET_KEY` is NOT set (local dev, or a preview
 * without the secret), verification is SKIPPED and treated as passing — so the
 * form keeps working everywhere. To ENFORCE the challenge in production, set
 * both `TURNSTILE_SECRET_KEY` (server) and `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
 * (client widget). With the secret present we fail CLOSED: a missing, invalid,
 * or unverifiable token is rejected.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  ok: boolean;
  /** True when verification was skipped because no secret is configured. */
  skipped?: boolean;
}

export async function verifyTurnstile(
  token: string,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Fail open by design (local/preview). Warn in production so a missing
    // secret is observable rather than a silently-disabled bot gate.
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[turnstile] TURNSTILE_SECRET_KEY is not set — contact-form bot verification is DISABLED.",
      );
    }
    return { ok: true, skipped: true };
  }
  if (!token) return { ok: false };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return { ok: false };

    const data = (await res.json()) as { success?: boolean };
    return { ok: data.success === true };
  } catch {
    // Fail closed — if we can't verify, don't let the submission through.
    return { ok: false };
  }
}
