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
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Enforce ONLY when both keys are present, so the client widget and the
  // server check are always in the same state. A half-configured deployment
  // (one key set, the other not) skips verification instead of either failing
  // open silently or bricking every form with an un-satisfiable challenge —
  // and logs loudly in production so the misconfig is caught. When both are
  // set, a missing/invalid/unverifiable token is rejected (fail closed).
  if (!secret || !siteKey) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[turnstile] Not fully configured (need both TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY) — bot verification SKIPPED.",
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
