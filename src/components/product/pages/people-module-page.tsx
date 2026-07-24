"use client";

import { CalendarCheck, Receipt, ShieldCheck } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { PeoplePreview } from "@/components/product/previews/people-preview";

const config: ModuleConfig = {
  slug: "people",
  eyebrow: MODULES.people.name,
  headline: "Leave and expense, on the same rails.",
  description:
    "The approvals your organisation already runs for money — same engine, shaped for people requests. Leave requests and staff expense claims, structured, routed, and permanently on record.",
  status: "roadmap",
  previewUrl: "Avrentis / requests / leave / LV-2026-0042",
  preview: <PeoplePreview />,

  pillars: [
    {
      icon: CalendarCheck,
      title: "Leave requests, routed and on record",
      body:
        "Annual, sick, compassionate, and study leave — each on its own approval chain. Employees submit, managers approve, and the request, decision, and approver are permanently attributed.",
    },
    {
      icon: Receipt,
      title: "Staff expense claims with receipts",
      body:
        "Submit an expense claim with its receipts attached, route it through the same review-and-sanction chain as a payment, and settle it with a full audit trail behind every decision.",
    },
    {
      icon: ShieldCheck,
      title: "The same audit trail as your payments",
      body:
        "Leave and expense decisions run on the same approval engine and immutable audit trail as your money — every request timestamped and attributed to a person, a time, and a decision.",
    },
  ],

  useCases: [
    {
      title: "End the \"did my leave get approved?\" thread",
      body:
        "Employees see the status of every request in real time — pending, approved, changes requested — with the manager's name and timestamp attached. No wondering, no chasing.",
    },
    {
      title: "Staff expenses without the reimbursement chase",
      body:
        "A staff member submits an expense claim with receipts; it routes to the approver, and the decision and payout are on record — the same discipline you apply to vendor payments.",
    },
    {
      title: "People approvals an auditor can trust",
      body:
        "Leave and expense decisions are timestamped and attributed on the same immutable trail as payments — so an auditor sees the same completeness they get on your financial approvals.",
    },
  ],

  planAvailability: [
    { plan: "30-day Business trial", included: false, note: "Not during beta" },
    { plan: "Starter", included: false, note: "Not included" },
    { plan: "Business", included: false, note: "Enterprise tier only at launch" },
    { plan: "Enterprise", included: true, note: "Included at launch" },
  ],

  relatedModules: [
    { slug: "audit", name: "Avrentis Compliance", desc: "Leave and expense events flow into the same immutable trail" },
    { slug: "pay", name: "Avrentis Payables", desc: "Expense approvals run on the same review-and-sanction rails as payments" },
    { slug: "connect", name: "Avrentis Integrations", desc: "Emit leave and expense events to your payroll or HRIS via webhook" },
  ],
};

export function PeopleModulePage() {
  return <ProductModuleLayout config={config} />;
}
