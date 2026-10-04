import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Copy must not promise to keep DOCUMENTS forever. The audit trail is kept for
 * the life of the account; vouchers, purchase orders and attached files follow
 * the plan's retention period (see `record-keeping.ts`). The site used to say
 * "stored with the document permanently" and "a permanent record" — a promise
 * the product does not keep, made in a market that will hold us to it.
 *
 * Deliberately narrow. "Every action is permanently attributed" and "every
 * decision … on record permanently" are TRUE (they are the audit trail) and
 * stay legal; only a document word near a permanence word, the ambiguous
 * "permanent record", and "immutable record" (the trail is tamper-evident,
 * not immutable) fail.
 */

const PERMANENCE = String.raw`(?:permanent(?:ly)?|forever)`;
const DOCUMENT_WORD = String.raw`(?:documents?|files?|attachments?|contracts?|invoices?|quotes?|vouchers?|purchase orders?|POs?|PDFs?|claims?)`;

const FORBIDDEN: Array<{ name: string; pattern: RegExp }> = [
  { name: "document kept permanently", pattern: new RegExp(String.raw`\b${DOCUMENT_WORD}\b[^.]{0,50}\b${PERMANENCE}\b`, "i") },
  { name: "permanently … document", pattern: new RegExp(String.raw`\b${PERMANENCE}\b[^.]{0,40}\b${DOCUMENT_WORD}\b`, "i") },
  { name: "ambiguous 'permanent record'", pattern: /\bpermanent\s+(?:operational\s+)?record\b/i },
  { name: "'immutable' record", pattern: /\bimmutable\s+(?:record|audit|trail|log|ledger|history)\b/i },
];

const SRC = join(process.cwd(), "src");
const THIS_FILE = "lib/record-keeping.lock.test.ts";

function copyFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(tsx?|json)$/.test(file))
    .filter((file) => !file.endsWith(".test.ts"));
}

function violations(text: string): string[] {
  return FORBIDDEN.filter(({ pattern }) => pattern.test(text)).map(({ name }) => name);
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
      expect(violations(old), old).not.toEqual([]);
    }
  });

  it("the detector leaves accurate audit-trail lines alone", () => {
    for (const accurate of [
      "Retained permanently for the lifetime of the tenant.",
      "Supporting documents are generated automatically. Every action is permanently attributed to a person.",
      "every decision routed to the right approver, enforced, and on record permanently.",
      "Document retention follows your plan; the audit trail itself is never purged while the account is active.",
    ]) {
      expect(violations(accurate), accurate).toEqual([]);
    }
  });

  it("scans the site's copy (proves the walk can see a known file)", () => {
    expect(copyFiles()).toContain(join("components", "product", "how-it-works-page.tsx"));
  });

  it("no copy claims documents are kept permanently", () => {
    const offenders: string[] = [];
    for (const file of copyFiles()) {
      if (file === THIS_FILE) continue;
      const source = readFileSync(join(SRC, file), "utf8");
      for (const { name, pattern } of FORBIDDEN) {
        const match = source.match(pattern);
        if (match) offenders.push(`${relative(process.cwd(), join(SRC, file))}: ${name} — "${match[0]}"`);
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
