import { describe, it, expect, vi, beforeEach } from "vitest";

const sendContactEmail = vi.fn();
vi.mock("@/lib/email", () => ({ sendContactEmail: (...args: unknown[]) => sendContactEmail(...args) }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/rate-limit", () => ({
  limitVisitor: async () => ({ ok: true }),
  visitorIp: async () => "203.0.113.7",
  UNKNOWN_VISITOR_IP: "unknown",
  RATE_LIMIT_UNAVAILABLE_MESSAGE: "This form is temporarily unavailable.",
}));
vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: async () => ({ ok: true, skipped: true }) }));

import { submitContact } from "./actions";
import { INITIAL_STATE } from "./state";

function posted(consent: boolean, extra: Record<string, string> = {}): FormData {
  const formData = new FormData();
  formData.set("intent", "general");
  formData.set("name", "Ada Obi");
  formData.set("email", "ada@acme.com.ng");
  formData.set("organisation", "Acme Ltd");
  formData.set("message", "We want to structure our approvals properly.");
  if (consent) formData.set("consent", "on");
  for (const [key, value] of Object.entries(extra)) formData.set(key, value);
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

  it("names the visitor's country in the email from the code the form posts", async () => {
    const state = await submitContact(INITIAL_STATE, posted(true, { country: "ng", size: "21–50" }));
    expect(state.status).toBe("success");
    const { html, subject } = sendContactEmail.mock.calls[0]![0] as { html: string; subject: string };
    expect(html).toContain("Nigeria");
    expect(html).toContain("Acme Ltd · 21–50");
    expect(subject).toContain("General enquiry");
  });

  it("refuses a size or a country the form does not offer, on that field", async () => {
    const state = await submitContact(INITIAL_STATE, posted(true, { size: "10,000", country: "Atlantis" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.size).toBe("Please choose a size from the list.");
    expect(state.fieldErrors?.country).toBe("Please choose your country from the list.");
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("accepts an enquiry with no size or country (both optional)", async () => {
    const state = await submitContact(INITIAL_STATE, posted(true, { size: "", country: "" }));
    expect(state.status).toBe("success");
    expect((sendContactEmail.mock.calls[0]![0] as { html: string }).html).not.toContain("Country");
  });

  it("escapes the visitor's words in the email and keeps line breaks out of the subject", async () => {
    await submitContact(
      INITIAL_STATE,
      posted(true, { name: "Ada\r\nBcc: x@evil.test", organisation: "<b>Acme</b>" }),
    );
    const { html, subject } = sendContactEmail.mock.calls[0]![0] as { html: string; subject: string };
    expect(subject).not.toMatch(/[\r\n]/);
    expect(html).toContain("&lt;b&gt;Acme&lt;/b&gt;");
    expect(html).not.toContain("<b>Acme</b>");
  });
});
