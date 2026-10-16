"use client";

import { Webhook, KeyRound, Network, ShieldCheck } from "lucide-react";
import { ProductModuleLayout, type ModuleConfig, type ModulePlan } from "@/components/product/module-layout";
import { ConnectPreview } from "@/components/product/previews/connect-preview";

const config: Omit<ModuleConfig, "planAvailability"> = {
  moduleKey: "connect",
  headline: "Avrentis in your existing stack.",
  description:
    "The operational record Avrentis builds doesn't have to stay inside Avrentis. Push sanctioned vouchers into your accounting system, issued POs into your ERP, or role-changes into your HRIS — using typed webhooks, scoped API keys, and a documented REST API.",
  previewPath: "settings / integrations",
  preview: <ConnectPreview />,

  pillars: [
    {
      icon: Webhook,
      title: "Typed webhooks for every lifecycle event",
      body:
        "Subscribe to document.sanctioned, user.role_changed, vendor.bank_details_updated, and more lifecycle events. Each payload is versioned and typed; deliveries are signed to the Standard Webhooks scheme and retried on failure with exponential backoff.",
    },
    {
      icon: KeyRound,
      title: "Scoped, rotatable API keys",
      body:
        "Generate keys per integration and give each only the read permissions it needs — every permission opens exactly the endpoints it names, and long lists come back a page at a time. Every key call is logged with a masked IP address, user-agent, and response. Rotate keys without downtime.",
    },
    {
      icon: Network,
      title: "Build any integration on a typed API",
      body:
        "A documented REST API and typed webhooks let you connect Avrentis to your accounting system, ERP, or HRIS. Single sign-on via OpenID Connect (OIDC) or SAML 2.0, and automated user provisioning via SCIM, are built in.",
    },
    {
      icon: ShieldCheck,
      title: "Security on by default",
      body:
        "All delivery URLs must be HTTPS. Every delivery is signed with HMAC-SHA256 over its id, timestamp and body using a per-subscription secret, so your receiver can reject forged or replayed requests. Rotating a secret keeps the old one valid for 24 hours, and every delivery attempt is logged and can be retried.",
    },
  ],

  useCases: [
    {
      title: "Reconcile Avrentis payments into your accounting system",
      body:
        "When the MD sanctions a voucher, Avrentis fires a signed document.sanctioned webhook carrying the vendor, amount, reference, and department. Your integration posts it to your accounting system as a bill — no double-entry, no month-end reconciliation gap. Or read the balanced journal entries for approved vouchers and payments straight from the API, coded with your own chart of accounts.",
    },
    {
      title: "React to role changes in your own systems",
      body:
        "Subscribe to the user.role_changed webhook and forward it wherever you need — an internal dashboard, a review queue, your data warehouse. (Avrentis emits the event; provisioning stays one-directional — your IdP remains the source of authority via inbound SCIM.)",
    },
    {
      title: "Notify the right Slack channel on every sanction",
      body:
        "Point a webhook at your Slack workspace and every high-value approval lands in #finance-audit in real time — built on the same signed document.sanctioned event, without granting broad access to the platform UI.",
    },
    {
      title: "Build your own internal integrations",
      body:
        "The typed webhook schema and OpenAPI spec are available to launch partners today. Your platform team can build an integration to your internal data warehouse in an afternoon.",
    },
  ],

  relatedModules: [
    { moduleKey: "pay", desc: "Push sanctioned payments straight into accounting" },
    { moduleKey: "procure", desc: "Sync issued POs into ERP and vendor portals" },
    { moduleKey: "audit", desc: "Stream audit events to your SIEM or log aggregator" },
  ],
};

export function ConnectModulePage({ planAvailability }: { planAvailability: ModulePlan[] }) {
  return <ProductModuleLayout config={{ ...config, planAvailability }} />;
}
