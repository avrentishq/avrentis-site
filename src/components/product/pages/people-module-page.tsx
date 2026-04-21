"use client";

import { Users, CalendarCheck, UserPlus, BadgeCheck } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig } from "@/components/product/module-layout";
import { PeoplePreview } from "@/components/product/previews/people-preview";

const config: ModuleConfig = {
  slug: "people",
  eyebrow: "AVRENTIS PEOPLE",
  headline: "HR approvals, on the same rails.",
  description:
    "The approvals your organisation already runs for money — same engine, shaped for people decisions. Leave requests, onboarding, policy acknowledgements, and performance sign-offs — all structured, routed, and permanently on record.",
  status: "roadmap",
  previewUrl: "app.avrentis.com / people / leave / LV-2026-0042",
  preview: <PeoplePreview />,

  pillars: [
    {
      icon: CalendarCheck,
      title: "Leave requests with balance tracking",
      body:
        "Annual, sick, compassionate, and study leave — each with its own balance, accrual rules, and approval chain. Employees see available days; managers see team coverage before approving.",
    },
    {
      icon: UserPlus,
      title: "Structured onboarding workflows",
      body:
        "Every new hire follows the same defined checklist: welcome pack, role assignment, access grants, policy acknowledgements. HR and IT see the same progress view — no email tag.",
    },
    {
      icon: BadgeCheck,
      title: "Policy acknowledgements on record",
      body:
        "Distribute an updated policy, require acknowledgement by date, track completion per employee. Every acknowledgement is timestamped and ends up on the audit trail.",
    },
    {
      icon: Users,
      title: "Delegation + out-of-office handling",
      body:
        "Inherits the platform's delegation engine — when a manager sets themselves OOO, their approvals auto-route to the delegate, with an audit entry naming both parties.",
    },
  ],

  useCases: [
    {
      title: "End the \"did my leave get approved?\" Slack thread",
      body:
        "Employees see the status of every request in real-time — pending, approved, changes requested — with the manager's name and timestamp attached. No wondering, no chasing.",
    },
    {
      title: "Year-end leave planning without the spreadsheet",
      body:
        "The HR dashboard shows team-wide leave overlap for any date range. Plan December coverage from one screen instead of reconciling individual email chains.",
    },
    {
      title: "Turn onboarding into a repeatable process",
      body:
        "A new joiner's first week is a defined workflow, not a sprawl of ad-hoc tasks. Everyone (the hire, their manager, IT, HR) sees the same checklist and the same progress state.",
    },
    {
      title: "Compliance acknowledgements that stick",
      body:
        "When a new anti-money-laundering policy goes out, every relevant employee gets it, acknowledges it, and their acknowledgement is filed against their record. Auditors see completeness at a glance.",
    },
  ],

  planAvailability: [
    { plan: "14-day Business trial", included: false, note: "Not during beta" },
    { plan: "Starter", included: false, note: "Not included" },
    { plan: "Business", included: false, note: "Enterprise tier only at launch" },
    { plan: "Enterprise", included: true, note: "Included at launch" },
  ],

  relatedModules: [
    { slug: "audit", name: "Avrentis Audit", desc: "HR events flow into the same immutable trail" },
    { slug: "vault", name: "Avrentis Vault", desc: "Employee documents and signed acknowledgements stored together" },
    { slug: "connect", name: "Avrentis Connect", desc: "Push HR events into your payroll or HRIS system" },
  ],
};

export function PeopleModulePage() {
  return <ProductModuleLayout config={config} />;
}
