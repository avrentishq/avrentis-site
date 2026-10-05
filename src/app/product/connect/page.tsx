import type { Metadata } from "next";
import { ConnectModulePage } from "@/components/product/pages/connect-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { planAvailabilityFor } from "@/lib/module-availability";
import { canonical } from "@/lib/seo";
import { moduleName } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${moduleName("connect")} — Avrentis in your existing stack`,
  description:
    "Typed webhooks, scoped API keys, a documented REST API, and SSO/SCIM. Push Avrentis events into the systems your organisation already runs.",
  alternates: { canonical: "/product/connect" },
  openGraph: {
    title: `${moduleName("connect")} — Avrentis in your existing stack`,
    description:
      "Typed webhooks with Standard Webhooks signatures, scoped API keys, and SSO/SCIM. Your operational record flowing where it needs to go.",
    url: canonical("/product/connect"),
    type: "website",
  },
};

export default async function ProductConnectPage() {
  const pricingData = await fetchPricingData();
  return <ConnectModulePage planAvailability={planAvailabilityFor("connect", pricingData)} />;
}
