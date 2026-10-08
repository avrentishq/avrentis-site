import { describe, it, expect, vi, beforeEach } from "vitest";

const sendContactEmail = vi.fn();
vi.mock("@/lib/email", () => ({ sendContactEmail: (...args: unknown[]) => sendContactEmail(...args) }));
vi.mock("@/lib/rate-limit", () => ({
  limitVisitor: async () => ({ ok: true }),
  RATE_LIMIT_UNAVAILABLE_MESSAGE: "This form is temporarily unavailable.",
}));
vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: async () => ({ ok: true, skipped: true }) }));

import { submitContact } from "./actions";
import { INITIAL_STATE } from "./state";

function posted(consent: boolean): FormData {
  const formData = new FormData();
  formData.set("intent", "general");
  formData.set("name", "Ada Obi");
  formData.set("email", "ada@acme.com.ng");
  formData.set("organisation", "Acme Ltd");
  formData.set("message", "We want to structure our approvals properly.");
  if (consent) formData.set("consent", "on");
  return formData;
}

beforeEach(() => {
  sendContactEmail.mockReset().mockResolvedValue(undefined);
});

describe("submitContact (the server path, with or without JavaScript)", () => {
  it("sends the enquiry when consent is given", async () => {
    const state = await submitContact(INITIAL_STATE, posted(true));
    expect(state.status).toBe("success");
    expect(sendContactEmail).toHaveBeenCalledTimes(1);
  });

  it("refuses a post without consent, says why on the consent field, and sends nothing", async () => {
    const state = await submitContact(INITIAL_STATE, posted(false));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.consent).toBe("We need your consent to process this enquiry.");
    expect(sendContactEmail).not.toHaveBeenCalled();
    expect(state.values).toMatchObject({ name: "Ada Obi", message: "We want to structure our approvals properly." });
    expect(state.values?.consent).toBeUndefined();
  });
});
