import { describe, it, expect, vi, beforeEach } from "vitest";

const sendEmail = vi.fn();
vi.mock("@/lib/email", () => ({ sendEmail: (...args: unknown[]) => sendEmail(...args) }));
vi.mock("@/lib/rate-limit", () => ({
  limitVisitor: async () => ({ ok: true }),
  RATE_LIMIT_UNAVAILABLE_MESSAGE: "This form is temporarily unavailable.",
}));
vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: async () => ({ ok: true, skipped: true }) }));

import { emailEstimate } from "./actions";
import { INITIAL_STATE } from "./state";

function posted(consent: boolean): FormData {
  const formData = new FormData();
  formData.set("email", "ada@acme.com.ng");
  formData.set("approvals", "200");
  formData.set("minutes", "30");
  formData.set("cost", "5000");
  if (consent) formData.set("consent", "on");
  return formData;
}

beforeEach(() => {
  sendEmail.mockReset().mockResolvedValue(undefined);
});

describe("emailEstimate (the server path, with or without JavaScript)", () => {
  it("sends the estimate when consent is given", async () => {
    const state = await emailEstimate(INITIAL_STATE, posted(true));
    expect(state.status).toBe("success");
    expect(sendEmail).toHaveBeenCalled();
  });

  it("refuses a post without consent, says why on the consent field, and sends nothing", async () => {
    const state = await emailEstimate(INITIAL_STATE, posted(false));
    expect(state).toMatchObject({ status: "error", fieldErrors: { consent: "We need your consent to email you." } });
    expect(sendEmail).not.toHaveBeenCalled();
    expect(state.values).toEqual({ email: "ada@acme.com.ng" });
  });
});
