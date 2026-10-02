"use client";

import { Receipt, ShieldCheck, Tags } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig, type ModulePlan } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { PeoplePreview } from "@/components/product/previews/people-preview";

const config: Omit<ModuleConfig, "planAvailability"> = {
  slug: "people",
  eyebrow: MODULES.people.name,
  headline: "Staff expenses, on the same rails as payments.",
  description:
    "The approvals your organisation already runs for money — same engine, shaped for staff expense claims. Structured, routed, reimbursed and permanently on record.",
  status: "available",
  previewUrl: "Avrentis / requests / expenses / ER-2026-0042",
  preview: <PeoplePreview />,

  pillars: [
    {
      icon: Receipt,
      title: "Staff expense claims with receipts",
      body:
        "Submit an expense claim with its receipts attached, route it through the same review-and-sanction chain as a payment, and settle it with a full audit trail behind every decision.",
    },
    {
      icon: Tags,
      title: "Your categories, your limits",
      body:
        "Define expense categories with their own receipt thresholds and approvers, and keep each employee's bank details on file as a payee — so a claim is paid to the right account without retyping it.",
    },
    {
      icon: ShieldCheck,
      title: "The same audit trail as your payments",
      body:
        "Expense decisions run on the same approval engine and immutable audit trail as your money — every request timestamped and attributed to a person, a time, and a decision.",
    },
  ],

  useCases: [
    {
      title: "End the \"has my claim been approved?\" thread",
      body:
        "Employees see the status of every claim in real time — pending, approved, returned for changes, reimbursed — with the approver's name and timestamp attached. No wondering, no chasing.",
    },
    {
      title: "Staff expenses without the reimbursement chase",
      body:
        "A staff member submits an expense claim with receipts; it routes to the approver, and the decision and payout are on record — the same discipline you apply to vendor payments.",
    },
    {
      title: "People approvals an auditor can trust",
      body:
        "Expense decisions are timestamped and attributed on the same immutable trail as payments — so an auditor sees the same completeness they get on your financial approvals.",
    },
  ],

  relatedModules: [
    { slug: "audit", name: "Avrentis Compliance", desc: "Expense events flow into the same immutable trail" },
    { slug: "pay", name: "Avrentis Payables", desc: "Expense approvals run on the same review-and-sanction rails as payments" },
    { slug: "connect", name: "Avrentis Integrations", desc: "Emit expense events to your accounting or payroll system via webhook" },
  ],
};

export function PeopleModulePage({ planAvailability }: { planAvailability: ModulePlan[] }) {
  return <ProductModuleLayout config={{ ...config, planAvailability }} />;
}
