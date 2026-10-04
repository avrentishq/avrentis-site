import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";
import { SUITE_PAGES } from "@/lib/product-suites";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Avrentis Oversight — approval authority, enforced and monitored",
  description: SUITE_PAGES.oversight.metaDescription,
  alternates: { canonical: "/product/oversight" },
  openGraph: {
    title: "Avrentis Oversight — approval authority, enforced and monitored",
    description: SUITE_PAGES.oversight.headline,
    url: canonical("/product/oversight"),
    type: "website",
  },
};

export default function ProductOversightSuitePage() {
  return <ProductSuiteLayout suite="oversight" />;
}
