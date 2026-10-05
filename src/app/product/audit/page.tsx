import type { Metadata } from "next";
import { AuditModulePage } from "@/components/product/pages/audit-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { planAvailabilityFor } from "@/lib/module-availability";
import { canonical } from "@/lib/seo";
import { moduleName } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${moduleName("audit")} — Compliance without the scramble`,
  description:
    "A tamper-evident, regulator-ready audit trail of every action in your organisation, sealed daily and verifiable without trusting us. Structured events, one-click exports, and policies that follow SOC 2 structure.",
  alternates: { canonical: "/product/audit" },
  openGraph: {
    title: `${moduleName("audit")} — Compliance without the scramble`,
    description:
      "Tamper-evident audit trail sealed daily, structured events, regulator-ready PDF + CSV exports. Every action on record for the life of your account.",
    url: canonical("/product/audit"),
    type: "website",
  },
};

export default async function ProductAuditPage() {
  const pricingData = await fetchPricingData();
  return <AuditModulePage planAvailability={planAvailabilityFor("audit", pricingData)} />;
}
