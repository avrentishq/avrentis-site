"use client";

import { Workflow, Package, FileCheck, Truck, Store, PackageCheck } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig, type ModulePlan } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { ProcurePreview } from "@/components/product/previews/procure-preview";

const config: Omit<ModuleConfig, "planAvailability"> = {
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
        "Vendors are first-class records with RC numbers, account details, and verified bank accounts. Reuse across POs and track spend per vendor.",
    },
    {
      icon: Truck,
      title: "Issue-to-vendor PDF generation",
      body:
        "Approved POs produce a formatted vendor-facing PDF — reference, line items, delivery address, signatures — ready to email to the vendor. No formatting trouble, no inconsistent templates.",
    },
    {
      icon: Store,
      title: "Suppliers can see where their order stands",
      body:
        "Give a supplier their own login: the purchase orders you have sent them, whether each was accepted or declined, the invoice they submitted, and how far the payment has got. It removes the emails asking whether a PO arrived and when the money is coming. Included on every plan.",
    },
    {
      icon: PackageCheck,
      title: "Goods receipts, matched three ways",
      body:
        "Record what actually arrived against what was ordered, then match the purchase order, the goods receipt and the invoice before anything is paid. A quantity or price that does not line up is caught before the money moves, not at month-end. Included on every plan.",
    },
  ],

  useCases: [
    {
      title: "Centralise procurement across departments",
      body:
        "Operations, Facilities, Admin, and IT all raise POs through the same engine. Cross-department spend visibility for the MD without forcing departments into unfamiliar tools.",
    },
    {
      title: "One vendor, one record",
      body:
        "Vendors are shared records keyed by RC number and bank account. Reuse an existing vendor across POs instead of recreating it, so spend rolls up to a single trail per vendor.",
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

  relatedModules: [
    { slug: "pay", name: "Avrentis Payables", desc: "Turn sanctioned POs into paid invoices on the same rails" },
    { slug: "audit", name: "Avrentis Compliance", desc: "Every PO, every signature — permanently on record" },
    { slug: "vault", name: "Avrentis Records", desc: "Store vendor quotes, receipts, and delivery notes alongside each PO" },
  ],
};

export function ProcureModulePage({ planAvailability }: { planAvailability: ModulePlan[] }) {
  return <ProductModuleLayout config={{ ...config, planAvailability }} />;
}
