import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";

export const metadata: Metadata = {
  title: "Avrentis Evidence — an immutable record of every decision",
  description:
    "An immutable record of every approval and document, searchable years later and exportable for auditors and regulators in one step.",
  alternates: { canonical: "/product/evidence" },
  openGraph: {
    title: "Avrentis Evidence — an immutable record of every decision",
    description: "What happened, and proof it was not edited afterwards.",
    url: "https://avrentis.com/product/evidence",
    type: "website",
  },
};

export default function ProductEvidenceSuitePage() {
  return <ProductSuiteLayout suite="evidence" />;
}
