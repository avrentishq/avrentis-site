import type { Metadata } from "next";
import { ConnectModulePage } from "@/components/product/pages/connect-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { modulePageData } from "@/lib/module-availability";
import { canonical } from "@/lib/seo";
import { notFoundUnlessPublic } from "@/lib/module-route";
import { moduleName } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${moduleName("connect")} — Avrentis in your existing stack`,
  description:
    "Typed webhooks, scoped API keys, a documented REST API, journal entries for your ledger, and single sign-on (OIDC or SAML) with SCIM. Push Avrentis events into the systems your organisation already runs.",
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
  notFoundUnlessPublic("connect");
  const pricingData = await fetchPricingData();
  return <ConnectModulePage {...modulePageData("connect", pricingData)} />;
}
