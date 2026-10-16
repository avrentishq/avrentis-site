import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { RECORD_KEEPING_FORBIDDEN, recordKeepingViolations } from "@avrentishq/core/brand/copy-guardrails";

/**
 * Copy must not promise to keep DOCUMENTS forever. The audit trail is kept for
 * the life of the account; vouchers, purchase orders and attached files follow
 * the plan's retention period (see `record-keeping.ts`). The site used to say
 * "stored with the document permanently" and "a permanent record" — a promise
 * the product does not keep, made in a market that will hold us to it.
 *
 * The rules are core's (`@avrentishq/core/brand/copy-guardrails`), so the site,
 * the app and the console all refuse the same wording. This file keeps only the
 * site's own proof that the detector is live and leaves accurate lines alone.
 * "Every action is permanently attributed" is TRUE (it is the audit trail) and
 * passes; a document word near a permanence word, "permanent(ly on) record",
 * and "immutable record" (the trail is tamper-evident, not immutable) fail.
 */

const SRC = join(process.cwd(), "src");

function copyFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(tsx?|json)$/.test(file))
    .filter((file) => !file.endsWith(".test.ts"));
}

describe("record-keeping copy — documents are not permanent", () => {
  it("the detector catches the wording it exists to stop", () => {
    // A scan that matches nothing proves nothing; these are the old lines.
    for (const old of [
      "Attach contracts, invoices, and quotes — all stored with the document permanently",
      "with a bank-ready PDF and permanent record at the end",
      "a permanent operational record for every decision",
      "Every claim permanently on record.",
      "permanently recording operational\n          documents",
      "provable on the immutable record.",
    ]) {
      expect(recordKeepingViolations(old), old).not.toEqual([]);
    }
  });

  it("the detector leaves accurate audit-trail lines alone", () => {
    for (const accurate of [
      "Retained permanently for the lifetime of the tenant.",
      "Supporting documents are generated automatically. Every action is permanently attributed to a person.",
      "every decision routed to the right approver, enforced, and on record permanently.",
      "Document retention follows your plan; the audit trail itself is never purged while the account is active.",
      "When the retention period ends, documents and their files are permanently deleted.",
    ]) {
      expect(recordKeepingViolations(accurate), accurate).toEqual([]);
    }
  });

  it("scans the site's copy (proves the walk can see a known file)", () => {
    expect(copyFiles()).toContain(join("components", "product", "how-it-works-page.tsx"));
  });

  it("no copy claims documents are kept permanently", () => {
    const offenders: string[] = [];
    for (const file of copyFiles()) {
      const source = readFileSync(join(SRC, file), "utf8");
      for (const name of recordKeepingViolations(source)) {
        const pattern = RECORD_KEEPING_FORBIDDEN.find((rule) => rule.name === name)!.pattern;
        offenders.push(`${relative(process.cwd(), join(SRC, file))}: ${name} — "${source.match(pattern)?.[0] ?? ""}"`);
      }
    }
    expect(
      offenders,
      "Documents are kept for the plan's retention period, not forever; the audit trail is kept " +
        "for the life of the account and is tamper-evident, not immutable. Use AUDIT_TRAIL_KEPT / " +
        "DOCUMENTS_KEPT from src/lib/record-keeping.ts:\n" +
        offenders.join("\n"),
    ).toEqual([]);
  });
});

describe("record-keeping facts are stated once", () => {
  // The seal cadence, a retention span and how fast access ends were each typed
  // into a dozen sentences; one of them said "kept for at least seven years"
  // about documents whose retention is the plan's. Copy reads the constants in
  // record-keeping.ts / compliance-posture.ts; retention spans come from the
  // plan's limits (plan-limits.ts).
  const HOMES = new Set([
    join("lib", "record-keeping.ts"),
    join("lib", "compliance-posture.ts"),
    join("lib", "plan-limits.ts"),
  ]);
  const TYPED_FACT = /\bsealed (?:daily|nightly|every night)\b|\b(?:seven|\d+)[ -]years?\b(?! ago)|\bwithin seconds\b/i;
  /** Code only: comments may explain the rule. The changelog records what was true on its date. */
  const code = (file: string) =>
    readFileSync(join(SRC, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

  it("the detector catches the typed facts", () => {
    for (const typed of ["sealed daily", "kept for at least seven years", "7-year retention", "ends within seconds"]) {
      expect(TYPED_FACT.test(typed), typed).toBe(true);
    }
    expect(TYPED_FACT.test("findable in seconds")).toBe(false);
  });

  it("no copy types them", () => {
    const offenders = copyFiles()
      .filter((file) => /\.tsx?$/.test(file) && !HOMES.has(file) && !file.includes("changelog"))
      .filter((file) => TYPED_FACT.test(code(file)));
    expect(offenders, "read TRAIL_SEALED / DOCUMENTS_KEPT / ACCESS_ENDS, or a plan-limits line").toEqual([]);
  });
});
