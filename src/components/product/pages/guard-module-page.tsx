"use client";

import { Copy, Landmark, Split, ListChecks } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { GuardPreview } from "@/components/product/previews/guard-preview";

const config: ModuleConfig = {
  slug: "guard",
  eyebrow: MODULES.guard.name,
  headline: "Catch the bad payment before the money moves.",
  description:
    "Guard checks every payment and purchase order as it's submitted and flags the patterns that drain finance teams — duplicate payments, vendor bank-account switches, and amounts split to slip under an approval limit — so a reviewer sees the risk before it's approved, not after the money is gone.",
  status: "available",
  previewUrl: "Avrentis / guard / flags",
  preview: <GuardPreview />,

  pillars: [
    {
      icon: Copy,
      title: "Duplicate payment & invoice detection",
      body:
        "The same payee, amount, and invoice paid twice is flagged the moment it's submitted — on both payment vouchers and purchase orders — before it ever reaches an approver.",
    },
    {
      icon: Landmark,
      title: "Vendor bank-account-change alerts",
      body:
        "When a vendor's account details change, Guard raises a flag recording who changed them and when. The classic \"switch the account the day before payday\" fraud, surfaced instead of missed.",
    },
    {
      icon: Split,
      title: "Threshold-gaming detection",
      body:
        "A large cost broken into several smaller vouchers to dodge an approval limit is surfaced as structuring — so splitting to stay under the MD's ceiling stops working.",
    },
    {
      icon: ListChecks,
      title: "A review-and-resolve queue",
      body:
        "Every flag lands in a Guard inbox where a reviewer clears it or escalates it — and each action is written to the immutable audit trail. Detection, review, and resolution in one loop.",
    },
  ],

  useCases: [
    {
      title: "Stop the account-swap fraud before payday",
      body:
        "A vendor's bank account is changed days before a large payment. Guard flags the change for review before the voucher is approved — the money doesn't leave to the wrong account first.",
    },
    {
      title: "Answer \"who changed this?\" with certainty",
      body:
        "When a duplicate or a suspicious change surfaces, the flag carries the document, the actor, and the timing — no Slack archaeology, no guesswork for the finance lead or internal audit.",
    },
    {
      title: "Give the risk committee a real control",
      body:
        "Every flag raised, cleared, or escalated is on the audit trail. The board's risk committee sees a working anti-fraud control, not a policy document nobody enforces.",
    },
  ],

  planAvailability: [
    { plan: "30-day Business trial", included: true, note: "Full Guard flags on the trial's Business tier" },
    { plan: "Starter", included: false },
    { plan: "Business", included: true, note: "All rule-based flags + review queue" },
    { plan: "Enterprise", included: true, note: "All rule-based flags + review queue" },
  ],

  relatedModules: [
    { slug: "pay", name: "Avrentis Payables", desc: "Guard checks every payment voucher as it enters the approval chain" },
    { slug: "procure", name: "Avrentis Procurement", desc: "Purchase orders and invoices are screened for duplicates too" },
    { slug: "audit", name: "Avrentis Compliance", desc: "Every flag raised or resolved is written to the immutable trail" },
  ],
};

export function GuardModulePage() {
  return <ProductModuleLayout config={config} />;
}
