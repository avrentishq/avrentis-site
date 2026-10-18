import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { stripComments } from "@/lib/test-support/strip-comments";

/**
 * The integrations catalogue lists only what ships. It used to carry "Talk to
 * us" items the product did not have (Slack, Teams, Zapier, n8n/Make,
 * JumpCloud, Rippling/BambooHR, Apple Business Manager), banking "connectors"
 * under "Live banking next" with "native banking APIs on the roadmap", and an
 * offer to "scope, build, and ship" custom connectors — none of it a service
 * the business sells. All of it was removed; this keeps it out. (Accounting
 * claims have their own lock, `accounting-claims.lock.test.ts`.)
 */

const SRC = join(process.cwd(), "src");

const FORBIDDEN: ReadonlyArray<{ name: string; pattern: RegExp }> = [
  { name: "an integration not yet available", pattern: /availability:\s*["']request["']/ },
  { name: "integrations delivered on request", pattern: /\b(?:delivered|built|available)\s+on\s+request\b[^.]{0,40}\b(?:integration|connector)s?\b|\b(?:integration|connector)s?\b[^.]{0,60}\bdelivered\s+on\s+request\b/i },
  { name: "custom connector offer", pattern: /\bcustom\s+connectors?\b|\bscope,\s+build,\s+and\s+ship\b/i },
  { name: "banking connector or roadmap", pattern: /\bbank(?:ing)?\s+connectors?\b|\blive\s+banking\b|\bnative\s+banking\b/i },
];

function copyFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file))
    .filter((file) => !/\.test\.tsx?$/.test(file));
}

function violations(text: string): string[] {
  return FORBIDDEN.filter(({ pattern }) => pattern.test(text)).map(({ name }) => name);
}

describe("integrations copy — only what ships", () => {
  it("the detectors catch the wording that was removed", () => {
    for (const old of [
      '{ name: "Slack", summary: "Approval shortcuts.", availability: "request" }',
      "Each integration labelled honestly — available today or delivered on request as part of a conversation.",
      "Request a custom connector →",
      "Tell us what you run; we scope, build, and ship.",
      "Nigerian bank connectors (GTBank, Zenith, Access)",
      "Bank files and letters today. Live banking next.",
      "Native banking APIs are on the roadmap.",
    ]) {
      expect(violations(old), old).not.toEqual([]);
    }
  });

  it("leaves true lines alone", () => {
    for (const accurate of [
      "A DPA and sub-processor list are available on request.",
      "Bank letters and payment files, in your bank's own scheme.",
      "Everything listed here is available today.",
      '{ name: "NIBSS Direct Credit", summary: "Naira batch files.", availability: "available" }',
    ]) {
      expect(violations(accurate), accurate).toEqual([]);
    }
  });

  it("scans the integrations page", () => {
    expect(copyFiles()).toContain(join("components", "product", "integrations-page.tsx"));
  });

  it("no site copy offers an integration, connector or banking link that does not ship", () => {
    const offenders = copyFiles().flatMap((file) => {
      const broken = violations(stripComments(readFileSync(join(SRC, file), "utf8")));
      return broken.length > 0 ? [`${file}: ${broken.join(", ")}`] : [];
    });
    expect(offenders).toEqual([]);
  });
});
