import { describe, it, expect } from "vitest";
import { exceedsLimit, FORM_LIMITS, hasEmailShape, tooLongMessage, withinLimit } from "@/lib/form-rules";

describe("form rules", () => {
  it("accepts a value at its limit and refuses one character more", () => {
    expect(exceedsLimit("a".repeat(FORM_LIMITS.name), "name")).toBe(false);
    expect(exceedsLimit("a".repeat(FORM_LIMITS.name + 1), "name")).toBe(true);
    expect(withinLimit("a".repeat(500), "otherDetail")).toHaveLength(FORM_LIMITS.otherDetail);
  });

  it("caps a magic-link token at the platform's bound", () => {
    expect(FORM_LIMITS.token).toBe(100);
  });

  it("says how long a field may be", () => {
    expect(tooLongMessage("name", "name")).toBe("That name is too long (200 character max).");
    expect(tooLongMessage("message", "message")).toBe("That message is too long (5,000 character max).");
  });

  it.each(["ada@acme.com.ng", "a.b+c@sub.example.org"])("sees an email shape in %s", (email) => {
    expect(hasEmailShape(email)).toBe(true);
  });

  it.each(["", "ada", "ada@acme", "ada @acme.com", "@acme.com"])("sees no email shape in %j", (email) => {
    expect(hasEmailShape(email)).toBe(false);
  });
});
