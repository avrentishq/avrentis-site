import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";
import { SUITE_PAGES } from "@/lib/product-suites";

export const metadata: Metadata = {
  title: "Avrentis Evidence — a tamper-evident record of every decision",
  description: SUITE_PAGES.evidence.metaDescription,
  alternates: { canonical: "/product/evidence" },
  openGraph: {
    title: "Avrentis Evidence — a tamper-evident record of every decision",
    description: SUITE_PAGES.evidence.headline,
    url: "https://avrentis.com/product/evidence",
    type: "website",
  },
};

export default function ProductEvidenceSuitePage() {
  return <ProductSuiteLayout suite="evidence" />;
}
