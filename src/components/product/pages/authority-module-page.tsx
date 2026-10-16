"use client";

import { SlidersHorizontal, Users, ShieldAlert, Clock } from "lucide-react";
import {
  ProductModuleLayout,
  type ModuleConfig,
  type ModulePageData,
} from "@/components/product/module-layout";
import { AuthorityPreview } from "@/components/product/previews/authority-preview";


const config: ModuleConfig = {
  moduleKey: "authority",
  headline: "Who can approve what, up to how much.",
  description:
    "Every organisation already has approval rules. They usually live in a policy document nobody opens, and get enforced by whoever happens to be paying attention. Authority is where you write those rules down once — the limits, the levels, the exceptions — and have them enforced on every single request automatically, with the proof kept for you.",
  previewPath: "authority",
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
      planFeature: "advancedApprovalWorkflows",
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
      planFeature: "delegation",
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
    {
      title: "One approval route, offered to every company in the group",
      planFeature: "multiCompanyGroup",
      body:
        "Save a route that already works in one company as a group template. Each company in the group can propose its own route from it, and that company's own reviewer approves the change — the template is a recommendation, never imposed.",
    },
    {
      title: "Try a new route in a test company first",
      body:
        "Your administrator can create a test company: a separate copy of your settings where colleagues sign in as themselves to try a new approval route, a bank file format or an integration. Nothing leaves it — no email, SMS or WhatsApp, no bank files or letters — its documents are stamped as test documents, and it costs nothing extra. Delete it, or start it again, whenever you like.",
    },
  ],

  relatedModules: [
    { moduleKey: "pay", desc: "Every payment voucher is routed and sanctioned by these rules" },
    { moduleKey: "procure", desc: "Purchase orders run through the same authority policy" },
    { moduleKey: "audit", desc: "Every approval, delegation, and policy change lands on the tamper-evident trail" },
  ],
};

export function AuthorityModulePage(data: ModulePageData) {
  return <ProductModuleLayout config={config} {...data} />;
}
