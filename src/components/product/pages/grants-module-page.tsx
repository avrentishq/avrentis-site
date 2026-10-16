"use client";

import { Wallet, Gauge, Share2, FileText, Banknote, CalendarClock } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig, type ModulePageData } from "@/components/product/module-layout";
import { GrantsPreview } from "@/components/product/previews/grants-preview";
import { GRANT } from "@/components/product/demo-fixtures";

const config: ModuleConfig = {
  moduleKey: "grants",
  headline: "Prove where every donor naira went.",
  description:
    "Grants ties every payment to its grant and budget line, tracks burn against each donor's restrictions, and produces a donor-ready report in the grant's own currency — from the same approvals your finance team already runs.",
  previewPath: `grants / ${GRANT.reference}`,
  preview: <GrantsPreview />,

  pillars: [
    {
      icon: Wallet,
      title: "Restricted-fund tracking",
      body:
        "Every voucher and purchase order is tagged to a grant and a budget line — and a single cost can be split across lines. Spend is held against each donor's restrictions instead of blurring into one pool.",
    },
    {
      icon: Gauge,
      title: "Burn & utilisation per grant",
      body:
        "Live allocated-vs-spent-vs-remaining for every grant and donor, on a board widget and on each grant's page — so over- or under-spend shows up before the donor's report does.",
    },
    {
      icon: Share2,
      title: "Sub-grantee oversight",
      body:
        "Money passed to partner organisations is tracked against the parent grant, with a hard cap so a sub-grant can't exceed what the grant holds. Disbursements to a partner are traceable end to end.",
    },
    {
      icon: Banknote,
      title: "Receipts and cash position",
      body:
        "Record each tranche the donor actually sends — what left them, what landed, and the rate the two imply. The award then answers what has been received, what is still to come, and whether the programme is spending ahead of the money.",
    },
    {
      icon: CalendarClock,
      title: "Reporting calendar",
      body:
        "Every reporting obligation carries its period and its due date, settled once when it is sent or waived. A nightly sweep reminds the finance team a week out and once when the date passes — not every night, which is how a reminder becomes noise.",
    },
    {
      icon: FileText,
      title: "Donor-ready report export",
      body:
        "Export a per-grant financial report as PDF, CSV, or Excel in the grant's own currency — with a foreign-currency grant reconciled to your reporting currency so the figures reconcile both ways.",
    },
  ],

  useCases: [
    {
      title: "Assemble the quarterly donor report from one export",
      body:
        "Instead of reconstructing spend from spreadsheets, a finance lead exports a per-grant report scoped to the period — allocations, spend, and remaining balance by budget line — ready for the donor.",
    },
    {
      title: "Prove restricted funds stayed restricted",
      body:
        "At audit, every payment traces to its grant and budget line. Showing that earmarked money was spent only on what the donor funded is a query and an export, not a fortnight of reconstruction.",
    },
    {
      title: "Run a multi-partner sub-grant programme without spreadsheets",
      body:
        "Track disbursements to each partner organisation against the parent grant, with the cap enforced at entry — so a sub-grant programme stays inside its funding envelope by construction.",
    },
  ],

  relatedModules: [
    { moduleKey: "pay", desc: "Disbursements to grantees and partners run through the payment workflow" },
    { moduleKey: "procure", desc: "Grant-funded purchases are tagged to the grant at the point of spend" },
    { moduleKey: "audit", desc: "Every allocation and report export is on the tamper-evident audit trail" },
  ],
};

export function GrantsModulePage(data: ModulePageData) {
  return <ProductModuleLayout config={config} {...data} />;
}
