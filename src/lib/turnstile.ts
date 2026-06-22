import "server-only";

/**
 * Server-side Cloudflare Turnstile verification for the contact form.
 *
 * Enforced when a key is configured; skipped only when no key is set
 * (local/preview), and a production warning is emitted if the key is missing.
 * To enforce the challenge, set both `TURNSTILE_SECRET_KEY` (server) and
 * `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (client widget). With the secret present a
 * missing, invalid, or unverifiable token is rejected.
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
    // No key configured (local/preview). Warn in production so a missing
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
