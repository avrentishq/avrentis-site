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
    sector: "Manufacturing",
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
    expect(JSON.parse(platform.mock.calls[0]![1].body)).toMatchObject({
      email: "ada@acme.com.ng",
      sector: "Manufacturing",
      consent: true,
    });
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
      sector: "Manufacturing",
      country: "NG",
      source: "A colleague",
    });
  });

  // The app refuses a trial without a storable industry (core `isStorableSector`),
  // so the site must always send one: a listed industry, or "Other: <text>".
  it("refuses a post without an industry, on the industry field, and sends nothing", async () => {
    const state = await submitTrialRequest(INITIAL_STATE, posted({ sector: undefined }));
    expect(state.status === "error" && state.fieldErrors?.sector).toBe("Please select your industry.");
    expect(platform).not.toHaveBeenCalled();
  });

  it("refuses 'Other' without a description, and an industry not on the list", async () => {
    const other = await submitTrialRequest(INITIAL_STATE, posted({ sector: "Other" }));
    expect(other.status === "error" && other.fieldErrors?.sector).toBe("Please describe your industry.");
    const unknown = await submitTrialRequest(INITIAL_STATE, posted({ sector: "Space tourism" }));
    expect(unknown.status === "error" && unknown.fieldErrors?.sector).toBe(
      "Please choose your industry from the list.",
    );
    expect(platform).not.toHaveBeenCalled();
  });

  it("sends 'Other' with its description in the form the app stores", async () => {
    await submitTrialRequest(INITIAL_STATE, posted({ sector: "Other", sectorOther: "  Space tourism " }));
    expect(JSON.parse(platform.mock.calls[0]![1].body)).toMatchObject({ sector: "Other: Space tourism" });
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
