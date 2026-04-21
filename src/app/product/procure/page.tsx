import type { Metadata } from "next";
import { ProcureModulePage } from "@/components/product/pages/procure-module-page";

export const metadata: Metadata = {
  title: "Avrentis Procurement — Procurement on record",
  description:
    "Every purchase order submitted, approved, and issued through a structured vendor and approval system. Line items, vendor directory, and a permanent record for every procurement decision.",
  openGraph: {
    title: "Avrentis Procurement — Procurement on record",
    description:
      "Submit, approve, and issue purchase orders through a single system of record. Vendor directory + line items + approval chain.",
    url: "https://avrentis.com/product/procure",
    type: "website",
  },
};

export default function ProductProcurePage() {
  return <ProcureModulePage />;
}
