import type { Metadata } from "next";
import { GuardModulePage } from "@/components/product/pages/guard-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { planAvailabilityFor } from "@/lib/module-availability";
import { canonical } from "@/lib/seo";
import { moduleName } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${moduleName("guard")} — Catch the bad payment before the money moves`,
  description:
    "Real-time flags on the patterns that drain finance teams — duplicate payments, vendor bank-account switches, and threshold-gaming — surfaced before approval, resolved on an audited review queue.",
  alternates: { canonical: "/product/guard" },
  openGraph: {
    title: `${moduleName("guard")} — Catch the bad payment before the money moves`,
    description:
      "Duplicate payments, vendor bank-account changes, and structuring flagged before approval — with an audited review-and-resolve queue.",
    url: canonical("/product/guard"),
    type: "website",
  },
};

export default async function ProductGuardPage() {
  const pricingData = await fetchPricingData();
  return <GuardModulePage planAvailability={planAvailabilityFor("guard", pricingData)} />;
}
