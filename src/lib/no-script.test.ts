import { describe, it, expect } from "vitest";
import { FORM_STEP, JS_ONLY, NO_SCRIPT_CSS, startsHidden } from "./no-script";

describe("no-script reveal", () => {
  it.each([
    "max-width:640px;margin:0 auto 24px;opacity:0;transform:translateY(12px)",
    "display:inline-block;margin-right:0.3em;opacity:0;transform:translateY(12px)",
    "max-width:460px;width:100%;opacity:0",
    "opacity:0",
  ])("reveals a hidden entry state: %s", (style) => {
    expect(startsHidden(style)).toBe(true);
  });

  it.each([
    "position:absolute;inset:0;opacity:0.05;background-size:60px 60px",
    "object-fit:cover;color:transparent;opacity:0.3;z-index:-1",
    "cursor:not-allowed;opacity:0.6;transition:background-color 150ms ease",
    "opacity:1;transform:none",
  ])("leaves a deliberately faint or visible layer alone: %s", (style) => {
    expect(startsHidden(style)).toBe(false);
  });

  it("the CSS uses the same two fragments the matcher checks", () => {
    expect(NO_SCRIPT_CSS).toContain('[style*="opacity:0;"]');
    expect(NO_SCRIPT_CSS).toContain('[style$="opacity:0"]');
  });
});

describe("no-script markers", () => {
  it("hides what is marked script-only and shows every form step", () => {
    expect(Object.keys(JS_ONLY)).toEqual(["data-js-only"]);
    expect(Object.keys(FORM_STEP)).toEqual(["data-form-step"]);
    expect(NO_SCRIPT_CSS).toContain("[data-js-only]{display:none!important}");
    expect(NO_SCRIPT_CSS).toContain("[data-form-step]{display:flex!important}");
  });
});
