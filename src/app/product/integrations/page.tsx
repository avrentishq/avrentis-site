import type { Metadata } from "next";
import { IntegrationsCataloguePage } from "@/components/product/integrations-page";
import { fetchPricingData } from "@/lib/pricing";
import { featurePlans, planNames } from "@/lib/plan-names";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Integrations — Avrentis",
  description:
    "Identity (OIDC / SAML / SCIM), notifications (email / WhatsApp / SMS), accounting (journal export for QuickBooks Online, Zoho Books and Sage Accounting), bank payment files (NIBSS, SEPA, Bacs, ACH), and a first-class developer platform. Every integration labelled honestly — available today, or delivered on request.",
  alternates: { canonical: "/product/integrations" },
  openGraph: {
    title: "Avrentis integrations catalogue",
    description:
      "Plug Avrentis into the identity, notification, accounting, banking, and developer tools your organisation already runs.",
    url: canonical("/product/integrations"),
    type: "website",
  },
};

export default async function IntegrationsPage() {
  const pricingData = await fetchPricingData();
  return <IntegrationsCataloguePage featurePlans={featurePlans(pricingData)} allPlanNames={planNames(pricingData)} />;
}
