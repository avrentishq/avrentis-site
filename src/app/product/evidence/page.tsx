import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";
import { suitePageMetadata } from "@/lib/product-suites";

export const metadata: Metadata = suitePageMetadata("evidence");

export default function ProductEvidenceSuitePage() {
  return <ProductSuiteLayout suite="evidence" />;
}
