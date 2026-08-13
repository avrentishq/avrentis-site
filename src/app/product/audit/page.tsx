import type { Metadata } from "next";
import { AuditModulePage } from "@/components/product/pages/audit-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { planAvailabilityFor } from "@/lib/module-availability";

export const metadata: Metadata = {
  title: "Avrentis Compliance — Compliance without the scramble",
  description:
    "An immutable, regulator-ready audit trail of every action in your organisation. Structured events, one-click exports, and SOC2-aligned controls baked into the platform.",
  alternates: { canonical: "/product/audit" },
  openGraph: {
    title: "Avrentis Compliance — Compliance without the scramble",
    description:
      "Tamper-proof audit trail, structured events, regulator-ready PDF + CSV exports. Every action permanently on record.",
    url: "https://avrentis.com/product/audit",
    type: "website",
  },
};

export default async function ProductAuditPage() {
  const pricingData = await fetchPricingData();
  return <AuditModulePage planAvailability={planAvailabilityFor("audit", pricingData)} />;
}
