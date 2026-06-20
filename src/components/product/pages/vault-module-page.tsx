"use client";

import { Archive, Search, Tag, Share2 } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { VaultPreview } from "@/components/product/previews/vault-preview";

const config: ModuleConfig = {
  slug: "vault",
  eyebrow: MODULES.vault.name,
  headline: "Institutional memory, searchable.",
  description:
    "Every approved voucher, signed contract, audit report, and vendor onboarding document lives in one tagged, searchable repository. Replace the shared drive, the filing cabinet, and the \"who has the latest version?\" Slack thread with one source of truth.",
  status: "coming_soon",
  previewUrl: "app.avrentis.com / vault",
  preview: <VaultPreview />,

  pillars: [
    {
      icon: Archive,
      title: "Centralised document repository",
      body:
        "Every PDF Avrentis generates — vouchers, POs, bank instructions, audit bundles — is stored here automatically. External documents can be uploaded with tags and metadata. Nothing sits in an inbox.",
    },
    {
      icon: Search,
      title: "Full-text search across every record",
      body:
        "Search by reference number, vendor name, amount, department, date range, or free-text inside documents. Find the voucher from March that paid Brightpath — without knowing its reference number.",
    },
    {
      icon: Tag,
      title: "Structured categories and tags",
      body:
        "Every document is categorised (Payment / Procurement / Contract / Audit / HR) and taggable (signed, archived, under-review). Filter and group by any combination; saved views for regular workflows.",
    },
    {
      icon: Share2,
      title: "Role-scoped sharing and external access",
      body:
        "Auditors, board members, and external partners can be granted time-bound access to specific folders or tags. Every view is logged; access expires automatically.",
    },
  ],

  useCases: [
    {
      title: "One repository for external audits",
      body:
        "External auditor asks for \"all Q3 approved vouchers.\" Save a view, grant time-bound access, and the auditor has exactly what they need — nothing more, and the access revokes itself.",
    },
    {
      title: "Contracts never fall through the cracks",
      body:
        "Upload contracts with renewal dates. Records surfaces expiring contracts 60 days ahead so legal and procurement can act before lapse, not after.",
    },
    {
      title: "Find it in seconds, not hours",
      body:
        "Reference numbers in old emails become live links. Vendor documents, historical POs, and signed agreements are one search away — even when the person who uploaded them has left the organisation.",
    },
    {
      title: "Institutional memory that survives staff turnover",
      body:
        "When the Finance Director moves on, their documents don't leave with them. Permissions transfer, context stays, and the new director onboards from a complete history.",
    },
  ],

  planAvailability: [
    { plan: "14-day Business trial", included: true, note: "Full access during beta" },
    { plan: "Starter", included: false, note: "Not included" },
    { plan: "Business", included: true, note: "Included at launch" },
    { plan: "Enterprise", included: true, note: "Unlimited storage + retention" },
  ],

  relatedModules: [
    { slug: "audit", name: "Avrentis Compliance", desc: "Every vault access + download logged to the audit trail" },
    { slug: "pay", name: "Avrentis Payables", desc: "Every approved voucher lands in Documents automatically" },
    { slug: "procure", name: "Avrentis Procurement", desc: "POs, vendor quotes, and delivery notes stored together" },
  ],
};

export function VaultModulePage() {
  return <ProductModuleLayout config={config} />;
}
