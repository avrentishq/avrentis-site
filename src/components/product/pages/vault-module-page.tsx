"use client";

import { Archive, Search, Tag, Share2 } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { VaultPreview } from "@/components/product/previews/vault-preview";

const config: ModuleConfig = {
  slug: "vault",
  eyebrow: MODULES.vault.name,
  headline: "Your financial records, in one place.",
  description:
    "Every voucher and purchase order Avrentis generates — with its attachments and full version history — in one tagged, searchable record. Find any approved payment or PO by reference, vendor, amount, or date, long after the person who raised it has moved on.",
  status: "coming_soon",
  previewUrl: "Avrentis / vault",
  preview: <VaultPreview />,

  pillars: [
    {
      icon: Archive,
      title: "Every record stored automatically",
      body:
        "Every PDF Avrentis generates — vouchers, POs, bank instructions — is stored here automatically, together with the receipts and attachments raised against it. Nothing sits in an inbox.",
    },
    {
      icon: Search,
      title: "Search across every record",
      body:
        "Search by reference number, vendor name, amount, department, or date range. Find the voucher from March that paid Brightpath — without knowing its reference number.",
    },
    {
      icon: Tag,
      title: "Structured categories and tags",
      body:
        "Every record is categorised (Payment / Procurement) and taggable (signed, archived, under-review). Filter and group by any combination.",
    },
    {
      icon: Share2,
      title: "Full version history, on the audit trail",
      body:
        "Every record carries its version history, and every view, download, or edit is written to the immutable audit trail — who, what, and when.",
    },
  ],

  useCases: [
    {
      title: "Give an external auditor exactly what they need",
      body:
        "Auditor asks for \"all Q3 approved vouchers.\" Filter by date and export the records with their attachments — exactly the period requested, nothing more.",
    },
    {
      title: "Find it in seconds, not hours",
      body:
        "Reference numbers in old emails become live links. Historical vouchers and POs are one search away — even when the person who raised them has left the organisation.",
    },
    {
      title: "Records that survive staff turnover",
      body:
        "When the Finance Director moves on, the records stay. The new director onboards from a complete voucher and purchase-order history instead of a scattered shared drive.",
    },
  ],

  planAvailability: [
    { plan: "30-day Business trial", included: true, note: "Full access during beta" },
    { plan: "Starter", included: false, note: "Not included" },
    { plan: "Business", included: true, note: "Included at launch" },
    { plan: "Enterprise", included: true, note: "Unlimited storage + retention" },
  ],

  relatedModules: [
    { slug: "audit", name: "Avrentis Compliance", desc: "Every vault access + download logged to the audit trail" },
    { slug: "pay", name: "Avrentis Payables", desc: "Every approved voucher lands in Records automatically" },
    { slug: "procure", name: "Avrentis Procurement", desc: "POs, vendor quotes, and delivery notes stored together" },
  ],
};

export function VaultModulePage() {
  return <ProductModuleLayout config={config} />;
}
