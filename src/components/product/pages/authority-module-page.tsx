"use client";

import { SlidersHorizontal, Users, ShieldAlert, Clock } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig, type ModulePlan } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { AuthorityPreview } from "@/components/product/previews/authority-preview";

const config: Omit<ModuleConfig, "planAvailability"> = {
  slug: "authority",
  eyebrow: MODULES.authority.name,
  headline: "Who can approve what, up to how much.",
  description:
    "Every organisation already has approval rules. They usually live in a policy document nobody opens, and get enforced by whoever happens to be paying attention. Authority is where you write those rules down once — the limits, the levels, the exceptions — and have them enforced on every single request automatically, with the proof kept for you.",
  status: "available",
  previewUrl: "Avrentis / authority",
  preview: <AuthorityPreview />,

  pillars: [
    {
      icon: SlidersHorizontal,
      title: "Approval limits per role",
      body:
        "Set what each role can sanction and up to what amount. A request above someone's limit doesn't rely on them remembering to escalate — it routes to the person who does have the authority, automatically.",
    },
    {
      icon: Users,
      title: "Approver groups and quorum",
      body:
        "Some decisions shouldn't rest on one signature. Name a group of eligible approvers and require two of them, or a specific pair, before anything moves. Being in the group makes you eligible to approve — it grants no other access.",
    },
    {
      icon: ShieldAlert,
      title: "Separation of duties, enforced",
      body:
        "Nobody approves their own request, and nobody approves twice in the same chain. It's a property of the engine rather than a rule people are asked to remember, so it holds on the busy days too.",
    },
    {
      icon: Clock,
      title: "Cover for absence, without shortcuts",
      body:
        "When an approver is away, delegate their authority for a fixed window. The stand-in approves under their own name with the delegation on record — instead of the password-sharing that usually fills the gap.",
    },
  ],

  useCases: [
    {
      title: "Stop the CEO being the bottleneck for everything",
      body:
        "Routine spend clears at the level that should own it, and only genuinely large or unusual requests reach the top. The limits do the filtering, so nobody has to.",
    },
    {
      title: "Give the auditor the rule, not just the outcome",
      body:
        "For any approved payment, show the policy that was in force, who was entitled to approve it, and who actually did. The chain is evidence, not recollection.",
    },
    {
      title: "Keep control while the organisation grows",
      body:
        "New department, new subsidiary, new finance lead — authority is a policy you edit, not a process you rebuild. The rules follow the org chart instead of trailing behind it.",
    },
  ],

  relatedModules: [
    { slug: "pay", name: "Avrentis Payables", desc: "Every payment voucher is routed and sanctioned by these rules" },
    { slug: "procure", name: "Avrentis Procurement", desc: "Purchase orders run through the same authority policy" },
    { slug: "audit", name: "Avrentis Compliance", desc: "Every approval, delegation, and policy change lands on the immutable trail" },
  ],
};

export function AuthorityModulePage({ planAvailability }: { planAvailability: ModulePlan[] }) {
  return <ProductModuleLayout config={{ ...config, planAvailability }} />;
}
