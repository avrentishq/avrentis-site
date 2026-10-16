"use client";

/**
 * Client wrapper for the Pay product page. Holds the full ModuleConfig
 * (which includes lucide icon component references that cannot cross the
 * server → client serialisation boundary) and hands it to the shared
 * ProductModuleLayout. The server page (app/product/pay/page.tsx) only
 * handles metadata and mounts this component.
 */

import { FileCheck, Workflow, Banknote, ShieldCheck, Receipt, Scale } from "lucide-react";
import {
  ProductModuleLayout,
  type ModuleConfig,
  type ModulePageData,
} from "@/components/product/module-layout";
import { AUDIT_TRAIL_KEPT } from "@/lib/record-keeping";
import { SUPPORTED_CURRENCY_NAMES } from "@/lib/languages-and-currencies";
import { PayPreview } from "@/components/product/previews/pay-preview";
import { FEATURED_VOUCHER } from "@/components/product/demo-fixtures";


const config: ModuleConfig = {
  moduleKey: "pay",
  headline: "Every payment, on record. End-to-end.",
  description:
    "From submission through finance validation to MD sanction, every payment voucher travels a defined approval chain. No email threads, no lost approvals — and a bank-ready PDF the moment the MD signs.",
  previewPath: `vouchers / ${FEATURED_VOUCHER.reference}`,
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
        `Every submission, query, return, and signature is captured on a tamper-evident audit trail, ${AUDIT_TRAIL_KEPT}. Who approved, when, with which signature — all on record and exportable for auditors.`,
    },
    {
      icon: Banknote,
      title: "Bank-ready payment instructions",
      planFeature: "bankLetterGeneration",
      body:
        "The moment the MD sanctions a voucher, Avrentis generates a formatted bank payment instruction letter — addressed to the beneficiary's bank, signed with the MD's digital signature. Hand it to your bank; the money moves on your rails, not ours.",
    },
    {
      icon: ShieldCheck,
      title: "Separation of duties enforced",
      body:
        "Built-in rules prevent submitters from approving their own requests and enforce department-scoped approval windows. Amount thresholds route high-value vouchers directly to the MD. Compliance is the default path.",
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
        "Import the statement and match it line by line against what you recorded. A receipt proves a particular voucher was paid; a statement is the only thing that shows money leaving the account with no document behind it — a duplicate debit, or a batch leg that quietly failed.",
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
    {
      title: "Answer \"has this been paid?\" without asking Finance",
      body:
        "Whoever raised a voucher can see what happened to it — the payment recorded against it, when the money left, and the bank's reference — without a call to Finance. A head of department sees their department's; Finance and the MD see the organisation's.",
    },
    {
      title: "Work in more than one currency",
      body:
        `Raise documents in ${SUPPORTED_CURRENCY_NAMES}. Each one carries the rate it was measured at, so a total is never quietly recomputed at today's rate, and budgets are held against the rate the period was planned on. Where the European Central Bank publishes a daily reference rate for the pair, the rate box starts with it as a suggestion you check and can change.`,
    },
    {
      title: "Pay in your bank's own file format",
      body:
        "Approved payments go out as one file your bank accepts: NIBSS Direct Credit for naira, SEPA Credit Transfer for euros, Bacs Standard 18 for sterling, or ACH for US dollars — with each ACH payment marked as going to a checking or savings account, as the payee's details say.",
    },
    {
      title: "Give your accounting system entries, not paperwork",
      planFeature: "budgetCodes",
      body:
        "Approved vouchers and the payments against them become balanced journal entries, coded with your own accounts and cost centres. Export them in the layout QuickBooks Online, Zoho Books or Sage Accounting imports, or as a standard CSV. Each entry leaves once, so nothing is posted twice.",
    },
    {
      title: "Settle what your group's companies owe each other",
      planFeature: "multiCompanyGroup",
      body:
        "When one company in your group approves a payment it owes a sister company, the sister company confirms the amount or disputes it with a note. Where two companies owe each other, one proposes netting the debts and the other accepts — the settlement is then recorded in both companies' books, and only the difference has to move.",
    },
  ],

  relatedModules: [
    { moduleKey: "procure", desc: "Purchase orders on the same approval rails" },
    { moduleKey: "audit", desc: "The full compliance trail across every payment" },
    { moduleKey: "connect", desc: "Push payment events into your accounting system" },
  ],
};

export function PayModulePage(data: ModulePageData) {
  return <ProductModuleLayout config={config} {...data} />;
}
