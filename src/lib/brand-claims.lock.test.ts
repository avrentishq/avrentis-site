import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { BRAND_CLAIM_FORBIDDEN, brandClaimViolations } from "@edidi-hq/core/brand/copy-guardrails";
import { BRAND } from "@/lib/brand";

/**
 * The brand brief's claims rules: no certification we do not hold, never "we
 * move/hold money", never "catches all fraud", never a legal-instrument claim,
 * never "governed/certified by" us, never "sealed forever", and the name is
 * never shortened or split. The rules are core's, so the site, the app and the
 * console refuse the same wording; this file is the site's proof the detector
 * is live, and the scan of its copy.
 */

const SRC = join(process.cwd(), "src");

function copyFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(tsx?|json)$/.test(file))
    .filter((file) => !file.endsWith(".test.ts"));
}

describe("brand claims — the brief's never-say list", () => {
  it("the detector catches the wording it exists to stop", () => {
    for (const claim of [
      "SOC 2 certified",
      "NDPR compliant",
      "We move your money safely",
      `${BRAND.name} catches all fraud`,
      "A legally binding record",
      `Governed by ${BRAND.name}`,
      "Sealed forever.",
    ]) {
      expect(brandClaimViolations(claim), claim).not.toEqual([]);
    }
  });

  it("leaves accurate lines alone", () => {
    for (const accurate of [
      "Flags anomalies and control lapses for review.",
      "Tamper-evident: any later change shows.",
      `Prepared on ${BRAND.name}`,
      "SOC 2 is on our roadmap.",
    ]) {
      expect(brandClaimViolations(accurate), accurate).toEqual([]);
    }
  });

  it("scans the site's copy (proves the walk can see a known file)", () => {
    expect(copyFiles()).toContain(join("components", "sections", "hero.tsx"));
  });

  it("no copy makes a forbidden claim", () => {
    const offenders: string[] = [];
    for (const file of copyFiles()) {
      const source = readFileSync(join(SRC, file), "utf8");
      for (const name of brandClaimViolations(source)) {
        const pattern = BRAND_CLAIM_FORBIDDEN.find((rule) => rule.name === name)!.pattern;
        offenders.push(`${relative(process.cwd(), join(SRC, file))}: ${name} — "${source.match(pattern)?.[0] ?? ""}"`);
      }
    }
    expect(offenders, "The brand brief's claims rules (core copy-guardrails):\n" + offenders.join("\n")).toEqual([]);
  });
});
