"use client";

import { Webhook, KeyRound, Network, ShieldCheck } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig } from "@/components/product/module-layout";
import { ConnectPreview } from "@/components/product/previews/connect-preview";

const config: ModuleConfig = {
  slug: "connect",
  eyebrow: "AVRENTIS CONNECT",
  headline: "Avrentis in your existing stack.",
  description:
    "The operational record Avrentis builds doesn't have to stay inside Avrentis. Push sanctioned vouchers into your accounting system, issued POs into your ERP, or role-changes into your HRIS — using typed webhooks, scoped API keys, and pre-built integrations.",
  status: "partial",
  previewUrl: "app.avrentis.com / settings / integrations",
  preview: <ConnectPreview />,

  pillars: [
    {
      icon: Webhook,
      title: "Typed webhooks for every lifecycle event",
      body:
        "Subscribe to voucher.sanctioned, po.issued, user.role_changed, and 20+ other events. Each payload is versioned and typed; deliveries are signed with HMAC and retried on failure with exponential backoff.",
    },
    {
      icon: KeyRound,
      title: "Scoped, rotatable API keys",
      body:
        "Generate keys per integration with fine-grained scopes (read-only, write-specific-module, etc). Every key call is logged with IP, user-agent, and response. Rotate keys without downtime.",
    },
    {
      icon: Network,
      title: "Pre-built integrations where it matters",
      body:
        "QuickBooks, Xero, SAP B1, and Oracle NetSuite adapters for accounting. Sage HRMS and BambooHR for HR. Slack and Microsoft Teams for approvals. More ship with each quarterly release.",
    },
    {
      icon: ShieldCheck,
      title: "Security on by default",
      body:
        "All delivery URLs must be HTTPS. Payload bodies are HMAC-SHA256 signed with a per-subscription secret. IP allowlisting available per webhook. Every delivery attempt is logged for replay and troubleshooting.",
    },
  ],

  useCases: [
    {
      title: "Reconcile Avrentis payments into your accounting system automatically",
      body:
        "When the MD sanctions a voucher, the Integrations module posts it to QuickBooks as an approved bill — with vendor, amount, reference, and department pre-mapped. No double-entry, no month-end reconciliation gap.",
    },
    {
      title: "Sync Avrentis roles into your identity provider",
      body:
        "Role changes in Avrentis propagate to Okta / Azure AD / Google Workspace within seconds. Deactivated users lose platform access everywhere, not just in Avrentis.",
    },
    {
      title: "Notify the right Slack channel on every sanction",
      body:
        "Pipe voucher.sanctioned to #finance-audit. Your team sees every high-value approval land in real time — without granting broad access to the platform UI.",
    },
    {
      title: "Build your own internal integrations",
      body:
        "The typed webhook schema and OpenAPI spec are public. Your platform team can build an integration to your internal data warehouse in an afternoon.",
    },
  ],

  planAvailability: [
    { plan: "14-day Business trial", included: true, note: "Full webhook + API access" },
    { plan: "Starter", included: false, note: "Not included" },
    { plan: "Business", included: false, note: "Enterprise tier only" },
    { plan: "Enterprise", included: true, note: "Unlimited keys + priority support" },
  ],

  relatedModules: [
    { slug: "pay", name: "Avrentis Pay", desc: "Push sanctioned payments straight into accounting" },
    { slug: "procure", name: "Avrentis Procurement", desc: "Sync issued POs into ERP and vendor portals" },
    { slug: "audit", name: "Avrentis Audit", desc: "Stream audit events to your SIEM or log aggregator" },
  ],
};

export function ConnectModulePage() {
  return <ProductModuleLayout config={config} />;
}
