import { describe, it, expect } from "vitest";
import { mapTrialResponse } from "./map-response";

/**
 * Pins the platform contract for POST /api/v1/public/trial/request.
 *
 * The response shape lives in the avrentis-app repo and is not exported from
 * @avrentishq/core, so this mirror can drift with nothing to catch it — and it
 * did: the 403 branch matched a status string ("hard_blocked") the platform has
 * never sent, so every rejection fell through to the generic error message.
 * The first case below is that regression.
 */

const EMAIL = "person@example.org";

describe("mapTrialResponse", () => {
  it("maps a 403 rejection and surfaces the platform's own reason", () => {
    // The platform sends status "rejected" — NOT "hard_blocked".
    const state = mapTrialResponse(
      403,
      {
        status: "rejected",
        message: "This email address has already used a trial.",
      },
      EMAIL,
    );
    expect(state.status).toBe("hard_blocked");
    expect(state).toHaveProperty(
      "message",
      "This email address has already used a trial.",
    );
  });

  it("maps a 403 regardless of the status string, and never as a generic error", () => {
    // 403 comes from exactly one place in the platform route: the rejection.
    // Matching the code alone is what stops a renamed status string silently
    // downgrading a rejection to "something went wrong".
    for (const status of [
      "rejected",
      "hard_blocked",
      "auto_rejected",
      undefined,
    ]) {
      const state = mapTrialResponse(403, { status, message: "Nope." }, EMAIL);
      expect(state.status, `status=${status}`).toBe("hard_blocked");
    }
  });

  it("falls back to safe copy when a rejection carries no message", () => {
    const state = mapTrialResponse(403, { status: "rejected" }, EMAIL);
    expect(state).toHaveProperty("message", "Trial unavailable.");
  });

  it("maps 202 verification_sent and carries the email through", () => {
    const state = mapTrialResponse(
      202,
      { status: "verification_sent", message: "Check your inbox." },
      EMAIL,
    );
    expect(state.status).toBe("verification_sent");
    expect(state).toHaveProperty("email", EMAIL);
    expect(state).toHaveProperty("message", "Check your inbox.");
  });

  it("defaults the verification message to one naming the address", () => {
    const state = mapTrialResponse(202, { status: "verification_sent" }, EMAIL);
    expect(state).toHaveProperty(
      "message",
      `Check ${EMAIL} for your verification link.`,
    );
  });

  it("maps 202 queued_for_review", () => {
    const state = mapTrialResponse(
      202,
      { status: "queued_for_review", message: "We'll be in touch." },
      EMAIL,
    );
    expect(state.status).toBe("queued_for_review");
    expect(state).toHaveProperty("message", "We'll be in touch.");
  });

  it("maps 422 field errors, keeping only fields the form renders", () => {
    const state = mapTrialResponse(
      422,
      {
        message: "Validation failed",
        errors: {
          fieldErrors: {
            email: ["Enter a valid work email."],
            organisation: ["Required."],
            // Not rendered by the form — must be dropped, not shown blank.
            sector: ["Unknown sector."],
          },
        },
      },
      EMAIL,
    );
    expect(state.status).toBe("error");
    expect(state).toHaveProperty("fieldErrors", {
      email: "Enter a valid work email.",
      organisation: "Required.",
    });
  });

  it("never returns a 422 with an empty fieldErrors object (silent no-op guard)", () => {
    // Backend rejected only on fields the form does not render. The user must
    // still get feedback rather than a suppressed banner showing nothing.
    const state = mapTrialResponse(
      422,
      { errors: { fieldErrors: { sector: ["Unknown sector."] } } },
      EMAIL,
    );
    expect(state.status).toBe("error");
    expect(state).not.toHaveProperty("fieldErrors");
    expect(String((state as { message: string }).message).length).toBeGreaterThan(0);
  });

  it("maps 429 to a wait-and-retry message", () => {
    const state = mapTrialResponse(429, {}, EMAIL);
    expect(state.status).toBe("error");
    expect((state as { message: string }).message).toMatch(/short window/i);
  });

  it("maps unhandled statuses to a generic error", () => {
    // 400 (malformed JSON) and 500 both land here by design.
    for (const code of [400, 500, 503]) {
      const state = mapTrialResponse(code, {}, EMAIL);
      expect(state.status, `code=${code}`).toBe("error");
      expect(
        (state as { message: string }).message.length,
        `code=${code}`,
      ).toBeGreaterThan(0);
    }
  });

  it("never returns idle for any real response", () => {
    for (const code of [202, 400, 403, 422, 429, 500]) {
      expect(mapTrialResponse(code, {}, EMAIL).status).not.toBe("idle");
    }
  });
});
