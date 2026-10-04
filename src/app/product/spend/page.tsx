import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";
import { SUITE_PAGES } from "@/lib/product-suites";

export const metadata: Metadata = {
  title: "Avrentis Spend — payments, purchase orders and restricted funds",
  description: SUITE_PAGES.spend.metaDescription,
  alternates: { canonical: "/product/spend" },
  openGraph: {
    title: "Avrentis Spend — payments, purchase orders and restricted funds",
    description: SUITE_PAGES.spend.headline,
    url: "https://avrentis.com/product/spend",
    type: "website",
  },
};

export default function ProductSpendSuitePage() {
  return <ProductSuiteLayout suite="spend" />;
}
