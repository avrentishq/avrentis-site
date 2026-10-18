import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { stripComments } from "@/lib/test-support/strip-comments";

/**
 * Accounting is a file and a read API, never a connection. Approved vouchers and
 * payments become journal entries in QuickBooks Online's, Zoho Books' or Sage
 * Accounting's import layout, or a standard CSV; nothing is pushed into an
 * accounting system and nothing comes back. The integrations page used to list
 * Xero ("bill and PO sync"), Sage Intacct ("API bridge"), SAP Business One
 * ("connector") and Oracle NetSuite ("synchronisation") under "live connectors
 * are delivered on request" — none of which exists.
 *
 * So copy may not name an accounting product the export has no layout for, and
 * may not call the export a connector or a sync.
 */

const SRC = join(process.cwd(), "src");

/** Accounting products with no export layout. Naming one reads as "supported". */
const UNSUPPORTED_LEDGER =
  /\b(?:Xero|Intacct|NetSuite|SAP(?:\s+(?:Business\s+One|B1|S\/4HANA))?|Oracle\s+(?:Financials|Fusion)|Dynamics\s+365|Odoo|MYOB|FreshBooks|Tally(?:Prime)?)\b/;

/** The export described as a live link to the ledger. */
const CONNECTION_WORDING =
  /\b(?:live|named|accounting|ERP|ledger)\s+connectors?\b|\b(?:two-way|live|real-time|bi-?directional)\s+sync\b|\bsyncs?\s+(?:with|to|into)\s+(?:QuickBooks|Zoho|Sage)\b/i;

function copyFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file))
    .filter((file) => !/\.test\.tsx?$/.test(file));
}

function offenders(pattern: RegExp): string[] {
  return copyFiles().flatMap((file) => {
    const match = stripComments(readFileSync(join(SRC, file), "utf8")).match(pattern);
    return match ? [`${file}: "${match[0]}"`] : [];
  });
}

describe("accounting copy — a file and a read API, not a connector", () => {
  it("the detectors catch the wording they exist to stop", () => {
    for (const old of [
      'name: "Xero", summary: "Bill and PO sync for Xero-led finance stacks."',
      'name: "Sage Intacct", summary: "API bridge for mid-market finance teams."',
      'name: "SAP Business One", summary: "Connector for SAP-led procurement."',
      'name: "Oracle NetSuite", summary: "PO and voucher synchronisation."',
    ]) {
      expect(UNSUPPORTED_LEDGER.test(old), old).toBe(true);
    }
    for (const old of [
      "owns the approval chain; live connectors are delivered on request.",
      "Accounting and ERP systems connect through that API — named connectors are delivered on request.",
      "Two-way sync with your ledger.",
      "Avrentis syncs with QuickBooks.",
    ]) {
      expect(CONNECTION_WORDING.test(old), old).toBe(true);
    }
  });

  it("the detectors leave the true lines alone", () => {
    for (const accurate of [
      "Journal entries in Sage Accounting's journal import template.",
      "Journal entries in QuickBooks Online's import layout.",
      "Import the standard CSV journal — and tell us which system you use.",
      "Request a custom connector →",
      "Nigerian bank connectors (GTBank, Zenith, Access)",
    ]) {
      expect(UNSUPPORTED_LEDGER.test(accurate) || CONNECTION_WORDING.test(accurate), accurate).toBe(false);
    }
  });

  it("scans the site's copy (proves the walk can see the integrations page)", () => {
    expect(copyFiles()).toContain(join("components", "product", "integrations-page.tsx"));
  });

  it("no copy names an accounting product the export has no layout for", () => {
    expect(
      offenders(UNSUPPORTED_LEDGER),
      "Only QuickBooks Online, Zoho Books and Sage Accounting have an export layout; every other " +
        "ledger uses the standard CSV or the read API. Do not name it as an integration.",
    ).toEqual([]);
  });

  it("no copy calls the accounting export a connector or a sync", () => {
    expect(
      offenders(CONNECTION_WORDING),
      "The export is a file and a read API: nothing is pushed into the ledger and nothing comes back.",
    ).toEqual([]);
  });
});
