import type { Metadata } from "next";
import { AuthorityModulePage } from "@/components/product/pages/authority-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { planAvailabilityFor } from "@/lib/module-availability";

const DESCRIPTION =
  "Write your approval rules down once — who can sanction what, up to how much, and what happens above that — and have them enforced on every request automatically, with the proof kept for you.";

export const metadata: Metadata = {
  title: "Avrentis Authority — who can approve what, up to how much",
  description: DESCRIPTION,
  alternates: { canonical: "/product/authority" },
  openGraph: {
    title: "Avrentis Authority — your approval rules, enforced automatically",
    description:
      "Approval limits per role, approver groups and quorum, separation of duties, and cover for absence — on every plan.",
    url: "https://avrentis.com/product/authority",
    type: "website",
  },
};

export default async function ProductAuthorityPage() {
  const pricingData = await fetchPricingData();
  return <AuthorityModulePage planAvailability={planAvailabilityFor("authority", pricingData)} />;
}
