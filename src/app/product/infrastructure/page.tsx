import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";
import { suitePageMetadata } from "@/lib/product-suites";

export const metadata: Metadata = suitePageMetadata("infrastructure");

export default function ProductInfrastructureSuitePage() {
  return <ProductSuiteLayout suite="infrastructure" />;
}
