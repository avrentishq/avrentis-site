import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
const limitVisitor = vi.fn();
const visitorIp = vi.fn();
vi.mock("@/lib/rate-limit", () => ({
  limitVisitor: (...args: unknown[]) => limitVisitor(...args),
  visitorIp: () => visitorIp(),
  UNKNOWN_VISITOR_IP: "unknown",
  RATE_LIMIT_UNAVAILABLE_MESSAGE: "This form is temporarily unavailable.",
}));
const verifyTurnstile = vi.fn();
vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: (...args: unknown[]) => verifyTurnstile(...args) }));

import { humanCheckRefusal, screenSubmission } from "@/lib/submission-guard";
import { FORM_MESSAGES, HONEYPOT_FIELD } from "@/lib/form-rules";
import { TURNSTILE_RESPONSE_FIELD } from "@/lib/turnstile-config";

function form(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) formData.set(key, value);
  return formData;
}

beforeEach(() => {
  limitVisitor.mockReset().mockResolvedValue({ ok: true });
  visitorIp.mockReset().mockResolvedValue("203.0.113.7");
  verifyTurnstile.mockReset().mockResolvedValue({ ok: true });
});

describe("screenSubmission", () => {
  it("short-circuits on a filled decoy field without spending a rate-limit attempt", async () => {
    expect(await screenSubmission(form({ [HONEYPOT_FIELD]: "bot" }), "contact")).toEqual({ outcome: "decoy" });
    expect(limitVisitor).not.toHaveBeenCalled();
  });

  it("ignores a decoy field left blank (or only spaces) and checks the limit", async () => {
    expect(await screenSubmission(form({ [HONEYPOT_FIELD]: "  " }), "contact")).toEqual({ outcome: "pass" });
    expect(limitVisitor).toHaveBeenCalledWith("contact");
  });

  it("refuses over the limit with the one rate-limit message, and an unreachable limiter with its own", async () => {
    limitVisitor.mockResolvedValueOnce({ ok: false, status: 429 });
    expect(await screenSubmission(form({}), "trialRequest")).toEqual({
      outcome: "refused",
      message: FORM_MESSAGES.rateLimited,
    });
    limitVisitor.mockResolvedValueOnce({ ok: false, status: 503 });
    expect(await screenSubmission(form({}), "trialRequest")).toEqual({
      outcome: "refused",
      message: "This form is temporarily unavailable.",
    });
  });
});

describe("humanCheckRefusal", () => {
  it("passes the widget answer and the visitor's IP to the check", async () => {
    expect(await humanCheckRefusal(form({ [TURNSTILE_RESPONSE_FIELD]: "answer" }))).toBeUndefined();
    expect(verifyTurnstile).toHaveBeenCalledWith("answer", "203.0.113.7");
  });

  it("sends no IP when the visitor's is unknown", async () => {
    visitorIp.mockResolvedValue("unknown");
    await humanCheckRefusal(form({}));
    expect(verifyTurnstile).toHaveBeenCalledWith("", undefined);
  });

  it("refuses with the one human-check message when the check fails", async () => {
    verifyTurnstile.mockResolvedValue({ ok: false });
    expect(await humanCheckRefusal(form({}))).toBe(FORM_MESSAGES.humanCheckFailed);
  });
});
