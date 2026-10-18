import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { accountingConnectionViolations } from "@avrentishq/core/brand/copy-guardrails";
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
 * may not call the export a connector or a sync. The rule is core's
 * (`accountingConnectionViolations`), the same one the app, the console and the
 * module catalogue are held to; this file keeps the site's own proof that the
 * scan sees its pages and leaves the true lines alone.
 */

const SRC = join(process.cwd(), "src");

function copyFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file))
    .filter((file) => !/\.test\.tsx?$/.test(file));
}

describe("accounting copy — a file and a read API, not a connector", () => {
  it("the shared rule catches the wording the site used to publish", () => {
    for (const old of [
      'name: "Xero", summary: "Bill and PO sync for Xero-led finance stacks."',
      'name: "Sage Intacct", summary: "API bridge for mid-market finance teams."',
      'name: "SAP Business One", summary: "Connector for SAP-led procurement."',
      'name: "Oracle NetSuite", summary: "PO and voucher synchronisation."',
      "owns the approval chain; live connectors are delivered on request.",
      "Two-way sync with your ledger.",
      "Avrentis syncs with QuickBooks.",
    ]) {
      expect(accountingConnectionViolations(old), old).not.toEqual([]);
    }
  });

  it("the shared rule leaves the true lines alone", () => {
    for (const accurate of [
      "Journal entries in Sage Accounting's journal import template.",
      "Journal entries in QuickBooks Online's import layout.",
      "Import the standard CSV journal — and tell us which system you use.",
    ]) {
      expect(accountingConnectionViolations(accurate), accurate).toEqual([]);
    }
  });

  it("scans the site's copy (proves the walk can see the integrations page)", () => {
    expect(copyFiles()).toContain(join("components", "product", "integrations-page.tsx"));
  });

  it("no copy names an unsupported ledger or calls the export a connector or a sync", () => {
    const offenders = copyFiles().flatMap((file) => {
      const broken = accountingConnectionViolations(stripComments(readFileSync(join(SRC, file), "utf8")));
      return broken.length > 0 ? [`${file}: ${broken.join(", ")}`] : [];
    });
    expect(
      offenders,
      "Only QuickBooks Online, Zoho Books and Sage Accounting have an export layout; every other " +
        "ledger uses the standard CSV or the read API. The export is a file and a read API: nothing " +
        "is pushed into the ledger and nothing comes back.",
    ).toEqual([]);
  });
});
