import type { Metadata } from "next";
import { IntegrationsCataloguePage, type PlansByFeature } from "@/components/product/integrations-page";
import { fetchPricingData, formatPlanList, planNames } from "@/lib/pricing";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Integrations — Avrentis",
  description:
    "Identity (OIDC / SCIM, SAML on the roadmap), notifications (email / WhatsApp / SMS), accounting (QuickBooks / Xero / SAP), banking, and a first-class developer platform. Every integration labelled honestly — available today, or delivered on request.",
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
  const plansFor = (featureKey: string) => formatPlanList(planNames(pricingData, featureKey));
  const plansByFeature: PlansByFeature = { sso: plansFor("sso"), apiAccess: plansFor("apiAccess") };
  return <IntegrationsCataloguePage plansByFeature={plansByFeature} />;
}
