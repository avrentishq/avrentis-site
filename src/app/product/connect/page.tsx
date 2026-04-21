import type { Metadata } from "next";
import { ConnectModulePage } from "@/components/product/pages/connect-module-page";

export const metadata: Metadata = {
  title: "Avrentis Integrations — Avrentis in your existing stack",
  description:
    "Webhooks, scoped API keys, and pre-built integrations with QuickBooks, SAP, Okta, and more. Push Avrentis events into the systems your organisation already runs.",
  openGraph: {
    title: "Avrentis Integrations — Avrentis in your existing stack",
    description:
      "Typed webhooks, HMAC-signed delivery, pre-built adapters for accounting and HR. Your operational record flowing where it needs to go.",
    url: "https://avrentis.com/product/connect",
    type: "website",
  },
};

export default function ProductConnectPage() {
  return <ConnectModulePage />;
}
