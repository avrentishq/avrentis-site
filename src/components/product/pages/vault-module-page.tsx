"use client";

import { Archive, Search, Tag, Share2, Gavel, CalendarClock } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig, type ModulePlan } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { VaultPreview } from "@/components/product/previews/vault-preview";

const config: Omit<ModuleConfig, "planAvailability"> = {
  slug: "vault",
  eyebrow: MODULES.vault.name,
  headline: "Your financial records, in one place.",
  description:
    "Every voucher and purchase order Avrentis generates — with its attachments and full version history — in one tagged, searchable record. Find any approved payment or PO by reference, vendor, amount, or date, long after the person who raised it has moved on.",
  status: "available",
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
    {
      icon: CalendarClock,
      title: "Financial records can't be deleted too early",
      body:
        "Nigerian tax and company law expect financial records to be kept for years, so payment vouchers, purchase orders and their version snapshots sit behind a seven-year floor. A shorter retention setting still applies to everything else — it simply cannot purge the documents the law says you must keep.",
    },
    {
      icon: Gavel,
      title: "Legal hold, for when something is disputed",
      body:
        "Put a hold on a single record or on the whole organisation and deletion stops, including the scheduled clean-ups that would otherwise run. Placing and releasing a hold are themselves recorded, so there is a clean answer to when preservation started and who asked for it.",
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
    {
      title: "Preserve everything, the day the dispute starts",
      body:
        "A contract goes to arbitration, or a regulator opens a query. Put the organisation under legal hold and nothing can be deleted while it runs — no scramble to warn people not to tidy up, and a record of exactly when preservation began.",
    },
  ],

  relatedModules: [
    { slug: "audit", name: "Avrentis Compliance", desc: "Every vault access + download logged to the audit trail" },
    { slug: "pay", name: "Avrentis Payables", desc: "Every approved voucher lands in Records automatically" },
    { slug: "procure", name: "Avrentis Procurement", desc: "POs, vendor quotes, and delivery notes stored together" },
  ],
};

export function VaultModulePage({ planAvailability }: { planAvailability: ModulePlan[] }) {
  return <ProductModuleLayout config={{ ...config, planAvailability }} />;
}
