import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";
import { SUITE_PAGES } from "@/lib/product-suites";

export const metadata: Metadata = {
  title: "Avrentis Infrastructure — access, alerts and integrations",
  description: SUITE_PAGES.infrastructure.metaDescription,
  alternates: { canonical: "/product/infrastructure" },
  openGraph: {
    title: "Avrentis Infrastructure — access, alerts and integrations",
    description: SUITE_PAGES.infrastructure.headline,
    url: "https://avrentis.com/product/infrastructure",
    type: "website",
  },
};

export default function ProductInfrastructureSuitePage() {
  return <ProductSuiteLayout suite="infrastructure" />;
}
