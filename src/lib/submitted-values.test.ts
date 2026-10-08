import { describe, it, expect } from "vitest";
import { submittedValues } from "./submitted-values";

describe("submittedValues", () => {
  it("hands back the named fields as typed, consent included", () => {
    const formData = new FormData();
    formData.set("name", " Ada Obi ");
    formData.set("consent", "on");
    formData.set("fax_number", "bot");
    expect(submittedValues(formData, ["name", "consent"] as const)).toEqual({ name: " Ada Obi ", consent: "on" });
  });

  it("leaves out empty, missing and unnamed fields, and bounds a long value", () => {
    const formData = new FormData();
    formData.set("email", "");
    formData.set("message", "x".repeat(6000));
    const values = submittedValues(formData, ["email", "message", "name"] as const);
    expect(values).toEqual({ message: "x".repeat(5000) });
  });
});
