import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";

export const metadata: Metadata = {
  title: "Avrentis Infrastructure — access, alerts and integrations",
  description:
    "Single sign-on, enforced access policy, and typed webhooks and APIs that push what Avrentis approves into your accounting, HR and data systems.",
  alternates: { canonical: "/product/infrastructure" },
  openGraph: {
    title: "Avrentis Infrastructure — access, alerts and integrations",
    description: "It reaches your people, and it talks to your other systems.",
    url: "https://avrentis.com/product/infrastructure",
    type: "website",
  },
};

export default function ProductInfrastructureSuitePage() {
  return <ProductSuiteLayout suite="infrastructure" />;
}
