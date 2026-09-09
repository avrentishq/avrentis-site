"use client";

/**
 * Client wrapper for the Pay product page. Holds the full ModuleConfig
 * (which includes lucide icon component references that cannot cross the
 * server → client serialisation boundary) and hands it to the shared
 * ProductModuleLayout. The server page (app/product/pay/page.tsx) only
 * handles metadata and mounts this component.
 */

import { FileCheck, Workflow, Banknote, ShieldCheck, Receipt, Scale } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig, type ModulePlan } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { PayPreview } from "@/components/product/previews/pay-preview";

const config: Omit<ModuleConfig, "planAvailability"> = {
  slug: "pay",
  eyebrow: MODULES.pay.name,
  headline: "Every payment, on record. End-to-end.",
  description:
    "From submission through finance validation to MD sanction, every payment voucher travels a defined approval chain. No email threads, no lost approvals — and a bank-ready PDF the moment the MD signs.",
  status: "available",
  previewUrl: "Avrentis / vouchers / PV-2026-0184",
  preview: <PayPreview />,

  pillars: [
    {
      icon: Workflow,
      title: "A defined approval chain for every voucher",
      body:
        "Staff submit → Finance reviews → MD sanctions. Authority enforced at every stage, never left to ad-hoc email or verbal sign-off. Role-based routing happens automatically based on the approval chain you configure.",
    },
    {
      icon: FileCheck,
      title: "A complete digital paper trail",
      body:
        "Every submission, query, return, and signature is captured on an immutable audit trail. Who approved, when, with which signature — all permanently on record and exportable for auditors.",
    },
    {
      icon: Banknote,
      title: "Bank-ready payment instructions",
      body:
        "The moment the MD sanctions a voucher, Avrentis generates a formatted bank payment instruction letter — addressed to the beneficiary's bank, signed with the MD's digital signature. Hand it to your bank; the money moves on your rails, not ours. Available on Business and Enterprise.",
    },
    {
      icon: ShieldCheck,
      title: "Separation of duties enforced",
      body:
        "Built-in ABAC rules prevent submitters from approving their own requests and enforce department-scoped approval windows. Amount thresholds route high-value vouchers directly to the MD. Compliance is the default path.",
    },
    {
      icon: Receipt,
      title: "Proof that the money actually moved",
      body:
        "Sanctioning a voucher is not the same as paying it. Finance records the payment against the voucher — which account it left, the bank's reference, the value date, and the receipt — and a voucher cannot be confirmed as paid until that evidence is attached. The reference and the receipt stay on the record, visible to whoever raised it.",
    },
    {
      icon: Scale,
      title: "Reconciled against your bank statement",
      body:
        "Import the statement and match it line by line against what you recorded. A receipt proves a particular voucher was paid; a statement is the only thing that shows money leaving the account with no document behind it — a duplicate debit, or a batch leg that quietly failed. Available on Business and Enterprise.",
    },
  ],

  useCases: [
    {
      title: "Month-end payment runs without the scramble",
      body:
        "Run finance month-end knowing every voucher has a documented submission, review, and sanction — with signatures attached. Export the full run as a single compliance bundle.",
    },
    {
      title: "Approve from anywhere, any device",
      body:
        "The MD is travelling. Approvers get notified on email and WhatsApp and can review and sanction from their phone — one click straight from the email, or a secure link from WhatsApp. Payments keep moving, decisions stay in writing.",
    },
    {
      title: "Queries without the back-and-forth",
      body:
        "Finance can query a voucher without rejecting it. The submitter sees the question in context, responds in place, and the voucher returns to the same approver — no lost thread, no restart.",
    },
    {
      title: "Audit-ready exports on demand",
      body:
        "External auditors ask for Q3's payment records. Export the full period as a timestamped PDF bundle — reference numbers, approval chains, signatures, and attachments — in a single click.",
    },
  ],

  relatedModules: [
    { slug: "procure", name: "Avrentis Procurement", desc: "Purchase orders on the same approval rails" },
    { slug: "audit", name: "Avrentis Compliance", desc: "The full compliance trail across every payment" },
    { slug: "connect", name: "Avrentis Integrations", desc: "Push payment events into your accounting system" },
  ],
};

export function PayModulePage({ planAvailability }: { planAvailability: ModulePlan[] }) {
  return <ProductModuleLayout config={{ ...config, planAvailability }} />;
}
