import { describe, it, expect, vi, beforeEach } from "vitest";

// The limiter, bot check and platform are the action's outside world: mocked,
// so the test drives what the server does with a posted form, the same path a
// visitor without JavaScript takes.
const limitVisitor = vi.fn();
vi.mock("@/lib/rate-limit", () => ({
  limitVisitor: (...args: unknown[]) => limitVisitor(...args),
  RATE_LIMIT_UNAVAILABLE_MESSAGE: "This form is temporarily unavailable.",
}));
vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: async () => ({ ok: true, skipped: true }) }));

import { submitTrialRequest } from "./actions";
import { INITIAL_STATE } from "./state";

const platform = vi.fn();

function posted(overrides: Record<string, string | undefined> = {}): FormData {
  const fields: Record<string, string | undefined> = {
    name: "Ada Obi",
    email: "ada@acme.com.ng",
    organisation: "Acme Ltd",
    role: "CFO",
    orgSize: "21–50",
    country: "NG",
    consent: "on",
    ...overrides,
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) if (value !== undefined) formData.set(key, value);
  return formData;
}

beforeEach(() => {
  limitVisitor.mockReset().mockResolvedValue({ ok: true });
  platform
    .mockReset()
    .mockResolvedValue(
      new Response(JSON.stringify({ status: "verification_sent", message: "Check your inbox." }), {
        status: 202,
      }),
    );
  vi.stubGlobal("fetch", platform);
});

describe("submitTrialRequest (the server path, with or without JavaScript)", () => {
  it("forwards a complete request and answers with the verification step", async () => {
    const state = await submitTrialRequest(INITIAL_STATE, posted());
    expect(state.status).toBe("verification_sent");
    expect(platform).toHaveBeenCalledTimes(1);
    expect(JSON.parse(platform.mock.calls[0]![1].body)).toMatchObject({ email: "ada@acme.com.ng", consent: true });
    expect("values" in state).toBe(false);
  });

  it("hands back what was posted with a refusal, so a page without JavaScript keeps it", async () => {
    const state = await submitTrialRequest(INITIAL_STATE, posted({ consent: undefined, source: "A colleague" }));
    expect(state.status === "error" && state.values).toEqual({
      name: "Ada Obi",
      email: "ada@acme.com.ng",
      organisation: "Acme Ltd",
      role: "CFO",
      orgSize: "21–50",
      country: "NG",
      source: "A colleague",
    });
  });

  it("refuses a post without consent, says why on the consent field, and sends nothing", async () => {
    const state = await submitTrialRequest(INITIAL_STATE, posted({ consent: undefined }));
    expect(state.status).toBe("error");
    expect(state.status === "error" && state.fieldErrors?.consent).toBe(
      "We need your consent to process this request.",
    );
    expect(platform).not.toHaveBeenCalled();
  });

  it("refuses with the 'temporarily unavailable' message when the limiter cannot be reached", async () => {
    limitVisitor.mockResolvedValue({ ok: false, status: 503 });
    const state = await submitTrialRequest(INITIAL_STATE, posted());
    expect(state).toMatchObject({ status: "error", message: "This form is temporarily unavailable." });
    expect(platform).not.toHaveBeenCalled();
  });
});
