import "server-only";
import {
  limitVisitor,
  RATE_LIMIT_UNAVAILABLE_MESSAGE,
  UNKNOWN_VISITOR_IP,
  visitorIp,
  type SiteRateLimitedAction,
} from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { TURNSTILE_RESPONSE_FIELD } from "@/lib/turnstile-config";
import { FORM_MESSAGES, HONEYPOT_FIELD } from "@/lib/form-rules";

/**
 * The screen every public Server Action runs before it does any work, in one
 * order: the decoy field, then the visitor's rate limit (spending an attempt),
 * then — after the action has validated the fields — the bot check. Each
 * action keeps its own limiter entry and failure mode in `rate-limit.ts`.
 */

export type ScreenVerdict =
  /** Carry on. */
  | { outcome: "pass" }
  /** The decoy field was filled: answer as if it succeeded, and send nothing. */
  | { outcome: "decoy" }
  /** Refused; `message` is what the visitor is told. */
  | { outcome: "refused"; message: string };

/** Whether the hidden decoy field came back filled in. */
export function decoyFilled(formData: FormData): boolean {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim() !== "";
}

/** Spends one of the visitor's attempts at `action`; the refusal to show, or undefined when allowed. */
export async function rateLimitRefusal(action: SiteRateLimitedAction): Promise<string | undefined> {
  const verdict = await limitVisitor(action);
  if (verdict.ok) return undefined;
  return verdict.status === 503 ? RATE_LIMIT_UNAVAILABLE_MESSAGE : FORM_MESSAGES.rateLimited;
}

/** The decoy check, then the rate limit. A filled decoy spends no attempt. */
export async function screenSubmission(
  formData: FormData,
  action: SiteRateLimitedAction,
): Promise<ScreenVerdict> {
  if (decoyFilled(formData)) return { outcome: "decoy" };
  const refusal = await rateLimitRefusal(action);
  return refusal ? { outcome: "refused", message: refusal } : { outcome: "pass" };
}

/** The bot check on the posted widget answer; the refusal to show, or undefined when it passes. */
export async function humanCheckRefusal(formData: FormData): Promise<string | undefined> {
  const ip = await visitorIp();
  const result = await verifyTurnstile(
    String(formData.get(TURNSTILE_RESPONSE_FIELD) ?? ""),
    ip === UNKNOWN_VISITOR_IP ? undefined : ip,
  );
  return result.ok ? undefined : FORM_MESSAGES.humanCheckFailed;
}
