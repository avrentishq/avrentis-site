import { describe, it, expect } from "vitest";
import { failureFocusTarget, type FocusCandidate } from "./focus-after-failure";

/** A minimal element: `focusable` says whether it matches the focusable selector. */
function element(
  name: string,
  { focusable = true, children = {} as Record<string, FocusCandidate> } = {},
): FocusCandidate & { name: string } {
  return {
    name,
    matches: () => focusable,
    querySelector: (selector) =>
      Object.entries(children).find(([key]) => selector.includes(key))?.[1] ?? null,
  };
}

const alert = element("alert");

describe("failureFocusTarget", () => {
  it("focuses the first field marked invalid", () => {
    const name = element("name");
    const form = element("form", { children: { "aria-invalid": name } });
    expect(failureFocusTarget(form, alert)).toBe(name);
  });

  it("focuses the checked radio inside an invalid radio group", () => {
    const radio = element("radio");
    const group = element("group", { focusable: false, children: { 'tabindex="0"': radio } });
    const form = element("form", { children: { "aria-invalid": group } });
    expect(failureFocusTarget(form, alert)).toBe(radio);
  });

  it("falls back to the alert when no field is in error", () => {
    expect(failureFocusTarget(element("form"), alert)).toBe(alert);
  });

  it("moves focus nowhere when there is neither an invalid field nor an alert", () => {
    expect(failureFocusTarget(element("form"), null)).toBeNull();
  });
});
