import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";
import { suitePageMetadata } from "@/lib/product-suites";

export const metadata: Metadata = suitePageMetadata("spend");

export default function ProductSpendSuitePage() {
  return <ProductSuiteLayout suite="spend" />;
}
