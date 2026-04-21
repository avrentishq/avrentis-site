"use client";

import { ShieldCheck, FileSearch, Download, LockKeyhole } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig } from "@/components/product/module-layout";
import { AuditPreview } from "@/components/product/previews/audit-preview";

const config: ModuleConfig = {
  slug: "audit",
  eyebrow: "AVRENTIS AUDIT",
  headline: "Compliance without the scramble.",
  description:
    "Every submission, approval, query, signature, and access event — recorded to an immutable audit trail that no user, including superadmins, can modify. Export a regulator-ready bundle for any period, any entity, in one click.",
  status: "available",
  previewUrl: "app.avrentis.com / audit",
  preview: <AuditPreview />,

  pillars: [
    {
      icon: LockKeyhole,
      title: "Tamper-proof immutable log",
      body:
        "Postgres-level triggers block UPDATE and DELETE on audit tables; the platform has no API surface that can alter a historical entry. What happened, happened — and the record proves it.",
    },
    {
      icon: FileSearch,
      title: "Every action, structured",
      body:
        "Each event carries actor, role, action code, entity reference, IP, user-agent, and a payload snapshot of the state-change. Filter by any combination. Investigate anything.",
    },
    {
      icon: Download,
      title: "Regulator-ready PDF + CSV exports",
      body:
        "Export a period-scoped audit bundle as a formatted PDF for auditors or a CSV for analysts. Every export itself is logged, so you always know which auditor received which snapshot.",
    },
    {
      icon: ShieldCheck,
      title: "SOC2 + ISO 27001 aligned controls",
      body:
        "Separation of duties, role-based access control, immutable trails, and time-bound access grants — all part of the platform architecture. No bolt-on compliance theatre.",
    },
  ],

  useCases: [
    {
      title: "External audit preparation in hours, not weeks",
      body:
        "When an auditor asks for \"all approvals in Q3 over ₦1M\", a saved-view + export delivers the answer — with signatures, chains, and timestamps — before the meeting starts.",
    },
    {
      title: "Investigate \"who changed this?\" with certainty",
      body:
        "A vendor's bank details changed between submission and payment. Audit shows who changed it, when, from which IP, and what the previous values were. No Slack archaeology.",
    },
    {
      title: "Post-incident forensics without gaps",
      body:
        "If a fraudulent approval is ever attempted, the audit trail is complete and unalterable. Security teams have a forensic source of truth on day one, not the scattered evidence they usually inherit.",
    },
    {
      title: "Board-ready operational reports",
      body:
        "Monthly and quarterly exports feed board packs with volume, turnaround, and exception data — pulled from the trail, not hand-assembled from spreadsheets.",
    },
  ],

  planAvailability: [
    { plan: "14-day Business trial", included: true, note: "Full trail access" },
    { plan: "Starter", included: true, note: "Basic trail + CSV export" },
    { plan: "Business", included: true, note: "Full trail + regulator PDF" },
    { plan: "Enterprise", included: true, note: "Unlimited retention + SIEM export" },
  ],

  relatedModules: [
    { slug: "pay", name: "Avrentis Pay", desc: "Every payment event lands in the audit trail automatically" },
    { slug: "procure", name: "Avrentis Procure", desc: "PO lifecycle events — from submission to issue — all tracked" },
    { slug: "vault", name: "Avrentis Vault", desc: "Document access and download events logged to Audit" },
  ],
};

export function AuditModulePage() {
  return <ProductModuleLayout config={config} />;
}
