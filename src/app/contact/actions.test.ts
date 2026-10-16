import { describe, it, expect, vi, beforeEach } from "vitest";

const sendContactEmail = vi.fn();
const addToUpdatesList = vi.fn();
vi.mock("@/lib/email", () => ({
  sendContactEmail: (...args: unknown[]) => sendContactEmail(...args),
  addToUpdatesList: (...args: unknown[]) => addToUpdatesList(...args),
}));
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
  addToUpdatesList.mockReset().mockResolvedValue(false);
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
    expect(state.fieldErrors?.consent).toBe("We need your consent to process this.");
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

  it("asks each topic only for its own fields", async () => {
    // A subscription needs only an email and consent — no name, organisation or message.
    const subscribe = new FormData();
    subscribe.set("intent", "subscribe");
    subscribe.set("email", "ada@example.com");
    subscribe.set("consent", "on");
    expect((await submitContact(INITIAL_STATE, subscribe)).status).toBe("success");

    // A careers note from a personal address with no organisation is welcome.
    const careers = new FormData();
    careers.set("intent", "careers");
    careers.set("name", "Ada Obi");
    careers.set("email", "ada@gmail.com");
    careers.set("message", "I'd like to work on the approval engine.");
    careers.set("link", "https://github.com/ada");
    careers.set("consent", "on");
    expect((await submitContact(INITIAL_STATE, careers)).status).toBe("success");
    expect((sendContactEmail.mock.calls.at(-1)![0] as { html: string }).html).toContain("https://github.com/ada");
  });

  it("refuses a privacy request without its type and relationship, and an option it does not offer", async () => {
    const privacy = posted(true, { intent: "privacy", organisation: "", requestType: "teleport" });
    const state = await submitContact(INITIAL_STATE, privacy);
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.requestType).toBe("Please choose an option from the list.");
    expect(state.fieldErrors?.relationship).toBe("Please choose the option that fits you best.");
    expect(state.fieldErrors?.organisation).toBeUndefined();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("names a privacy request's type by its label in the email", async () => {
    const privacy = posted(true, { intent: "privacy", requestType: "deletion", relationship: "public" });
    expect((await submitContact(INITIAL_STATE, privacy)).status).toBe("success");
    const { html } = sendContactEmail.mock.calls[0]![0] as { html: string };
    expect(html).toContain("Delete my data");
    expect(html).toContain("Member of the public");
  });

  it("routes a vulnerability report to the security inbox", async () => {
    await submitContact(INITIAL_STATE, posted(true, { intent: "disclosure", organisation: "" }));
    expect(sendContactEmail.mock.calls[0]![0]).toMatchObject({ inbox: "security" });
    await submitContact(INITIAL_STATE, posted(true));
    expect(sendContactEmail.mock.calls[1]![0]).toMatchObject({ inbox: "general" });
  });

  it("refuses a link that is not a web address", async () => {
    const careers = posted(true, { intent: "careers", link: "javascript:alert(1)" });
    const state = await submitContact(INITIAL_STATE, careers);
    expect(state.fieldErrors?.link).toBe("Please share a full link, starting with https://");
  });

  it("ignores fields the topic does not show", async () => {
    await submitContact(INITIAL_STATE, posted(true, { intent: "careers", organisation: "Should not appear" }));
    expect((sendContactEmail.mock.calls[0]![0] as { html: string }).html).not.toContain("Should not appear");
  });

  it("adds a subscriber to the updates list and emails the team only when no list is configured", async () => {
    const subscribe = new FormData();
    subscribe.set("intent", "subscribe");
    subscribe.set("email", "ada@example.com");
    subscribe.set("consent", "on");

    addToUpdatesList.mockResolvedValueOnce(true);
    expect((await submitContact(INITIAL_STATE, subscribe)).message).toContain("unsubscribe");
    expect(addToUpdatesList).toHaveBeenCalledWith({ email: "ada@example.com", firstName: undefined });
    expect(sendContactEmail).not.toHaveBeenCalled();

    addToUpdatesList.mockResolvedValueOnce(false);
    await submitContact(INITIAL_STATE, subscribe);
    expect(sendContactEmail).toHaveBeenCalledTimes(1);

    // A provider refusal never loses the signup: the team is emailed instead.
    addToUpdatesList.mockRejectedValueOnce(new Error("refused"));
    expect((await submitContact(INITIAL_STATE, subscribe)).status).toBe("success");
    expect(sendContactEmail).toHaveBeenCalledTimes(2);
  });
});
