import type { Metadata } from "next";
import { IntegrationsCataloguePage } from "@/components/product/integrations-page";

export const metadata: Metadata = {
  title: "Integrations — Avrentis",
  description:
    "Identity (SAML / OIDC / SCIM), notifications (email / WhatsApp / SMS), accounting (QuickBooks / Xero / SAP), banking, and a first-class developer platform. Every integration labelled honestly — available today, or delivered on request.",
  openGraph: {
    title: "Avrentis integrations catalogue",
    description:
      "Plug Avrentis into the identity, notification, accounting, banking, and developer tools your organisation already runs.",
    url: "https://avrentis.com/product/integrations",
    type: "website",
  },
};

export default function IntegrationsPage() {
  return <IntegrationsCataloguePage />;
}
