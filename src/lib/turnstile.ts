import "server-only";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile-config";

/**
 * Server-side Cloudflare Turnstile verification for the public forms.
 *
 * `verifyTurnstile` answers `{ ok }` for a widget token, and `skipped: true`
 * when the bot check is not configured (it needs both TURNSTILE_SECRET_KEY and
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY). When it is configured, a missing, invalid
 * or unverifiable token is refused.
 *
 * This repository is PUBLIC. Why the check behaves as it does is abuse-defence
 * detail and lives in `guides/security-posture.md`, which is gitignored. Read
 * that before changing this file.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** How long the verification call may take before it counts as unverifiable. */
const TURNSTILE_VERIFY_TIMEOUT_MS = 5_000;

export interface TurnstileResult {
  ok: boolean;
  /** True when verification was skipped because the check is not configured. */
  skipped?: boolean;
}

export async function verifyTurnstile(
  token: string,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret || !TURNSTILE_SITE_KEY) {
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

    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(TURNSTILE_VERIFY_TIMEOUT_MS),
    });
    if (!response.ok) return { ok: false };

    const data = (await response.json()) as { success?: boolean };
    return { ok: data.success === true };
  } catch {
    // Unverifiable (network failure or timeout) is refused.
    return { ok: false };
  }
}
