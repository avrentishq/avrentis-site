"use client";

import { Webhook, KeyRound, Network, ShieldCheck } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig } from "@/components/product/module-layout";
import { MODULES } from "@/lib/brand";
import { ConnectPreview } from "@/components/product/previews/connect-preview";

const config: ModuleConfig = {
  slug: "connect",
  eyebrow: MODULES.connect.name,
  headline: "Avrentis in your existing stack.",
  description:
    "The operational record Avrentis builds doesn't have to stay inside Avrentis. Push sanctioned vouchers into your accounting system, issued POs into your ERP, or role-changes into your HRIS — using typed webhooks, scoped API keys, and a documented REST API.",
  status: "available",
  previewUrl: "Avrentis / settings / integrations",
  preview: <ConnectPreview />,

  pillars: [
    {
      icon: Webhook,
      title: "Typed webhooks for every lifecycle event",
      body:
        "Subscribe to voucher.sanctioned, po.issued, user.role_changed, and more lifecycle events. Each payload is versioned and typed; deliveries are signed with HMAC and retried on failure with exponential backoff.",
    },
    {
      icon: KeyRound,
      title: "Scoped, rotatable API keys",
      body:
        "Generate keys per integration with fine-grained scopes (read-only, write-specific-module, etc). Every key call is logged with IP, user-agent, and response. Rotate keys without downtime.",
    },
    {
      icon: Network,
      title: "Build any integration on a typed API",
      body:
        "A documented REST API and typed webhooks let you connect Avrentis to your accounting system, ERP, or HRIS. SSO via OpenID Connect (OIDC) and automated user provisioning via SCIM are built in, with SAML 2.0 on the enterprise roadmap.",
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
      title: "Reconcile Avrentis payments into your accounting system",
      body:
        "When the MD sanctions a voucher, Avrentis fires a signed voucher.sanctioned webhook carrying the vendor, amount, reference, and department. Your integration posts it to your accounting system as a bill — no double-entry, no month-end reconciliation gap.",
    },
    {
      title: "React to role changes in your own systems",
      body:
        "Subscribe to the user.role_changed webhook and forward it wherever you need — an internal dashboard, a review queue, your data warehouse. (Avrentis emits the event; provisioning stays one-directional — your IdP remains the source of authority via inbound SCIM.)",
    },
    {
      title: "Notify the right Slack channel on every sanction",
      body:
        "Point a webhook at your Slack workspace and every high-value approval lands in #finance-audit in real time — built on the same signed voucher.sanctioned event, without granting broad access to the platform UI.",
    },
    {
      title: "Build your own internal integrations",
      body:
        "The typed webhook schema and OpenAPI spec are public. Your platform team can build an integration to your internal data warehouse in an afternoon.",
    },
  ],

  planAvailability: [
    { plan: "30-day Business trial", included: true, note: "Full webhook + API access" },
    { plan: "Starter", included: false, note: "Not included" },
    { plan: "Business", included: false, note: "Enterprise tier only" },
    { plan: "Enterprise", included: true, note: "Unlimited keys + priority support" },
  ],

  relatedModules: [
    { slug: "pay", name: "Avrentis Payables", desc: "Push sanctioned payments straight into accounting" },
    { slug: "procure", name: "Avrentis Procurement", desc: "Sync issued POs into ERP and vendor portals" },
    { slug: "audit", name: "Avrentis Compliance", desc: "Stream audit events to your SIEM or log aggregator" },
  ],
};

export function ConnectModulePage() {
  return <ProductModuleLayout config={config} />;
}
