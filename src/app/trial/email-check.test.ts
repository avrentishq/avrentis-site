import { describe, it, expect } from "vitest";
import { trialEmailError } from "./email-check";
import { FORM_LIMITS } from "@/lib/form-rules";

const RESERVED = "That address can't receive email. Please use the work email you check.";

describe("trialEmailError", () => {
  it.each([
    "finance@example.com",
    "ap@billing.example.org",
    "cfo@acme.test",
    "ops@company.invalid",
    "me@host.localhost",
    "CFO@EXAMPLE.NET",
  ])("refuses the reserved address %s", (email) => {
    expect(trialEmailError(email)).toBe(RESERVED);
  });

  it.each([
    "finance@acme.com.ng",
    "ap@example.com.ng",
    "cfo@testing.ng",
    "person@gmail.com",
  ])("accepts the deliverable address %s", (email) => {
    expect(trialEmailError(email)).toBeUndefined();
  });

  it("keeps the shape, presence and length messages ahead of the reserved rule", () => {
    expect(trialEmailError("")).toBe("Please share your work email.");
    expect(trialEmailError("not-an-email")).toBe("That doesn't look like a valid email.");
    const long = `${"a".repeat(FORM_LIMITS.email)}@acme.com`;
    expect(trialEmailError(long)).toBe("That email is too long (320 character max).");
  });
});
