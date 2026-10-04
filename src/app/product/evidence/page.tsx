import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";

export const metadata: Metadata = {
  title: "Avrentis Evidence — a tamper-evident record of every decision",
  description:
    "A tamper-evident record of every approval and document, sealed daily, searchable years later and exportable for auditors and regulators in one step.",
  alternates: { canonical: "/product/evidence" },
  openGraph: {
    title: "Avrentis Evidence — a tamper-evident record of every decision",
    description: "What happened, and proof it was not edited afterwards.",
    url: "https://avrentis.com/product/evidence",
    type: "website",
  },
};

export default function ProductEvidenceSuitePage() {
  return <ProductSuiteLayout suite="evidence" />;
}
