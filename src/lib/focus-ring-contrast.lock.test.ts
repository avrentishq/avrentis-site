import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The focus ring inside forms (fields, buttons and the form alert) must stand
 * out from the white card it sits on: at least 3:1 (WCAG 1.4.11, non-text
 * contrast). Reads the rule and the token straight from globals.css, so a
 * palette change that weakens the ring fails here.
 */

const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");
const themeBlock = css.match(/@theme[^{]*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const token = (name: string): string => {
  const value = themeBlock.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6});`))?.[1];
  if (!value) throw new Error(`--color-${name} is not a six-digit hex token in @theme`);
  return value;
};

function luminance(hex: string): number {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(first: string, second: string): number {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light! + 0.05) / (dark! + 0.05);
}

describe("form focus ring contrast", () => {
  it("the check fails a ring that is too faint (plain gold on white is under 3:1)", () => {
    expect(contrast(token("gold"), token("white"))).toBeLessThan(3);
  });

  it("the ring inside forms, the alert's included, is at least 3:1 against white", () => {
    const rule = css.match(/form :focus-visible,\s*form \[role="alert"\]:focus\s*\{([^}]*)\}/)?.[1];
    expect(rule, "the form focus rule in globals.css").toBeDefined();
    const ringToken = rule!.match(/outline:\s*2px solid var\(--color-([\w-]+)\)/)?.[1];
    expect(ringToken).toBeDefined();
    expect(contrast(token(ringToken!), token("white"))).toBeGreaterThanOrEqual(3);
  });
});
