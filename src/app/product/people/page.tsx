import type { Metadata } from "next";
import { PeopleModulePage } from "@/components/product/pages/people-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { planAvailabilityFor } from "@/lib/module-availability";
import { canonical } from "@/lib/seo";
import { notFoundUnlessPublic } from "@/lib/module-route";
import { moduleName } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${moduleName("people")} — staff expense approvals on the same rails`,
  description:
    "Staff expense claims structured through the same approval engine and audit trail as your financial decisions. Every approval on record for the life of your account.",
  alternates: { canonical: "/product/people" },
  openGraph: {
    title: `${moduleName("people")} — staff expense approvals on the same rails`,
    description:
      "Staff expense claims — structured, routed, and every approval on record.",
    url: canonical("/product/people"),
    type: "website",
  },
};

export default async function ProductPeoplePage() {
  // Visibility first — never fetch pricing for a page we're about to 404.
  notFoundUnlessPublic("people");
  const pricingData = await fetchPricingData();
  return <PeopleModulePage planAvailability={planAvailabilityFor("people", pricingData)} />;
}
