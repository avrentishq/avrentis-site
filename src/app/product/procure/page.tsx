import type { Metadata } from "next";
import { ProcureModulePage } from "@/components/product/pages/procure-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { planAvailabilityFor } from "@/lib/module-availability";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Avrentis Procurement — Procurement on record",
  description:
    "Every purchase order submitted, approved, and issued through a structured vendor and approval system. Line items, vendor directory, and a tamper-evident audit trail of every procurement decision.",
  alternates: { canonical: "/product/procure" },
  openGraph: {
    title: "Avrentis Procurement — Procurement on record",
    description:
      "Submit, approve, and issue purchase orders through a single system of record. Vendor directory + line items + approval chain.",
    url: canonical("/product/procure"),
    type: "website",
  },
};

export default async function ProductProcurePage() {
  const pricingData = await fetchPricingData();
  return <ProcureModulePage planAvailability={planAvailabilityFor("procure", pricingData)} />;
}
