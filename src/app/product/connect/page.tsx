import type { Metadata } from "next";
import { ConnectModulePage } from "@/components/product/pages/connect-module-page";

export const metadata: Metadata = {
  title: "Avrentis Integrations — Avrentis in your existing stack",
  description:
    "Typed webhooks, scoped API keys, a documented REST API, and SSO/SCIM. Push Avrentis events into the systems your organisation already runs.",
  alternates: { canonical: "/product/connect" },
  openGraph: {
    title: "Avrentis Integrations — Avrentis in your existing stack",
    description:
      "Typed webhooks, HMAC-signed delivery, scoped API keys, and SSO/SCIM. Your operational record flowing where it needs to go.",
    url: "https://avrentis.com/product/connect",
    type: "website",
  },
};

export default function ProductConnectPage() {
  return <ConnectModulePage />;
}
