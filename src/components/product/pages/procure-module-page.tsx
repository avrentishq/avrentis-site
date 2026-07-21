"use client";

import { Workflow, Package, FileCheck, Truck } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { ProcurePreview } from "@/components/product/previews/procure-preview";

const config: ModuleConfig = {
  slug: "procure",
  eyebrow: MODULES.procure.name,
  headline: "Procurement on record. Vendor to issue.",
  description:
    "Every purchase order submitted, reviewed by the department head, sanctioned by the MD, and issued to the vendor through a single system of record. Line items, vendors, and delivery terms — all structured, all traceable.",
  status: "available",
  previewUrl: "Avrentis / purchase-orders / PO-2026-0091",
  preview: <ProcurePreview />,

  pillars: [
    {
      icon: Workflow,
      title: "Role-enforced approval chain",
      body:
        "Staff → HOD → MD. Department heads see only their own POs; the MD sees everything over a configurable amount threshold. Separation of duties baked into the workflow, not bolted on.",
    },
    {
      icon: Package,
      title: "Structured line items + totals",
      body:
        "Each PO captures line items with quantities, unit prices, and per-line totals that reconcile automatically. Edit a line and the total recomputes — no broken spreadsheets, no tally errors.",
    },
    {
      icon: FileCheck,
      title: "Vendor directory with bank + compliance",
      body:
        "Vendors are first-class records with RC numbers, account details, and verified bank accounts. Reuse across POs, track spend per vendor, flag duplicates at submission.",
    },
    {
      icon: Truck,
      title: "Issue-to-vendor PDF generation",
      body:
        "Approved POs produce a formatted vendor-facing PDF — reference, line items, delivery address, signatures — ready to email to the vendor. No formatting trouble, no inconsistent templates.",
    },
  ],

  useCases: [
    {
      title: "Centralise procurement across departments",
      body:
        "Operations, Facilities, Admin, and IT all raise POs through the same engine. Cross-department spend visibility for the MD without forcing departments into unfamiliar tools.",
    },
    {
      title: "Catch duplicate vendors before they happen",
      body:
        "Creating a new vendor runs a fuzzy match against the existing directory and flags likely duplicates — same RC number, similar name, same account. One vendor, one record, one spend trail.",
    },
    {
      title: "Month-end procurement reports without the chase",
      body:
        "Spend by department, spend by vendor, top-10 vendors by ticket — all queryable from the dashboard. Export to CSV in one click for board packs and budget reviews.",
    },
    {
      title: "From PO to invoice to payment — one continuous chain of authority",
      body:
        "A PO sanctioned here becomes the vendor's reference. When the invoice arrives, Avrentis Payables references the same PO number. Full traceability from request to bank instruction.",
    },
  ],

  planAvailability: [
    { plan: "30-day Business trial", included: true, note: "Full access" },
    { plan: "Starter", included: true, note: "Included" },
    { plan: "Business", included: true, note: "Included + custom chains" },
    { plan: "Enterprise", included: true, note: "Unlimited + SLA" },
  ],

  relatedModules: [
    { slug: "pay", name: "Avrentis Payables", desc: "Turn sanctioned POs into paid invoices on the same rails" },
    { slug: "audit", name: "Avrentis Compliance", desc: "Every PO, every signature — permanently on record" },
    { slug: "vault", name: "Avrentis Records", desc: "Store vendor quotes, receipts, and delivery notes alongside each PO" },
  ],
};

export function ProcureModulePage() {
  return <ProductModuleLayout config={config} />;
}
