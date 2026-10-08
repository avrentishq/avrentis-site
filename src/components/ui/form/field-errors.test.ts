import { describe, it, expect } from "vitest";
import {
  NO_DISMISSALS,
  dismissFieldError,
  visibleFieldErrors,
  type Dismissals,
  type FieldErrors,
} from "./field-errors";

type Field = "name" | "email" | "consent";

const answer = (): FieldErrors<Field> => ({
  name: "Please share your full name.",
  email: "That doesn't look like a valid email.",
});
const none: Dismissals<Field> = NO_DISMISSALS;

describe("server field errors clear when their field is edited", () => {
  it("shows every error from a fresh answer", () => {
    const errors = answer();
    expect(visibleFieldErrors(errors, none)).toEqual(errors);
  });

  it("hides only the edited field's error", () => {
    const errors = answer();
    const afterEdit = dismissFieldError(errors, none, "email");
    expect(visibleFieldErrors(errors, afterEdit)).toEqual({ name: "Please share your full name." });
  });

  it("keeps an untouched field's error showing", () => {
    const errors = answer();
    const afterEdit = dismissFieldError(errors, none, "email");
    expect(visibleFieldErrors(errors, afterEdit).name).toBe("Please share your full name.");
  });

  it("brings every error back with the next server answer", () => {
    const first = answer();
    const afterEdit = dismissFieldError(first, none, "email");
    const second = answer();
    expect(visibleFieldErrors(second, afterEdit)).toEqual(second);
  });

  it("is a no-op for a field with no error, so typing does not re-render", () => {
    const errors = answer();
    expect(dismissFieldError(errors, none, "consent")).toBe(none);
    const once = dismissFieldError(errors, none, "email");
    expect(dismissFieldError(errors, once, "email")).toBe(once);
    expect(dismissFieldError(undefined, none, "email")).toBe(none);
  });

  it("shows nothing when the server sent no field errors", () => {
    expect(visibleFieldErrors<Field>(undefined, none)).toEqual({});
  });
});
