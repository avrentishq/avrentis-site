"use client";

import { ShieldCheck, FileSearch, Download, LockKeyhole, UserSearch } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig, type ModulePageData } from "@/components/product/module-layout";
import { AuditPreview } from "@/components/product/previews/audit-preview";

const config: ModuleConfig = {
  moduleKey: "audit",
  headline: "Compliance without the scramble.",
  description:
    "Every submission, approval, query, signature, and access event — recorded to a tamper-evident audit trail, sealed daily, that no user — superadmins included — can edit. Export a regulator-ready bundle for any period up to a year, in one click.",
  previewPath: "audit",
  preview: <AuditPreview />,

  pillars: [
    {
      icon: LockKeyhole,
      title: "Tamper-evident, sealed daily",
      body:
        "Database triggers refuse edits and deletions of audit entries, and the platform has no API surface that can alter a historical entry. Each entry is chained to the one before it and the chain is sealed every night with a signed fingerprint, so any change would show — and you can check it yourself.",
    },
    {
      icon: FileSearch,
      title: "Every action, structured",
      body:
        "Each event carries actor, role, action code, entity reference, a masked IP address, user-agent, and a snapshot of what changed. Filter by any combination. Investigate anything.",
    },
    {
      icon: Download,
      title: "Regulator-ready PDF + CSV exports",
      planFeature: "fullAuditExport",
      body:
        "Export a period-scoped bundle as a formatted PDF for auditors or one CSV per section for analysts, or deliver the trail to your SIEM every night. Every export is itself logged, so you always know who received which snapshot.",
    },
    {
      icon: ShieldCheck,
      title: "Policies that follow SOC 2 structure",
      planFeature: "controlsAttestation",
      body:
        "Separation of duties enforced as work moves, with a report of every exception; access reviews and control sign-offs signed by a named officer and kept on the record; role-based access and time-bound grants. No bolt-on compliance theatre.",
    },
    {
      icon: UserSearch,
      title: "Data-subject requests, handled on a clock",
      everyPlan: true,
      body:
        "Someone can ask what personal data you hold on them, have it corrected, take a copy, or ask you to erase it. Requests arrive through your organisation's own link, identity is verified before anything is disclosed, and the statutory deadline is tracked with warnings before it is missed rather than after.",
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
        "A vendor's bank details changed between submission and payment. Audit shows who changed it, when, from which (masked) IP address, and what the previous values were. No Slack archaeology.",
    },
    {
      title: "Post-incident forensics without gaps",
      body:
        "If a fraudulent approval is ever attempted, the audit trail is complete, and any later change to it would show. Security teams have a forensic source of truth on day one, not the scattered evidence they usually inherit.",
    },
    {
      title: "Board-ready operational reports",
      planFeature: "fullAuditExport",
      body:
        "Monthly and quarterly exports feed board packs with volume, turnaround, and exception data — pulled from the trail, not hand-assembled from spreadsheets.",
    },
  ],

  relatedModules: [
    { moduleKey: "pay", desc: "Every payment event lands in the audit trail automatically" },
    { moduleKey: "procure", desc: "PO lifecycle events — from submission to issue — all tracked" },
    { moduleKey: "vault", desc: "Document access and download events logged to the compliance trail" },
  ],
};

export function AuditModulePage(data: ModulePageData) {
  return <ProductModuleLayout config={config} {...data} />;
}
