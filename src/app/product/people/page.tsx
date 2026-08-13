import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PeopleModulePage } from "@/components/product/pages/people-module-page";
import { isLaunchHidden } from "@/lib/launch";
import { fetchPricingData } from "@/lib/pricing";
import { planAvailabilityFor } from "@/lib/module-availability";

export const metadata: Metadata = {
  title: "Avrentis Requests — leave & expense approvals on the same rails",
  description:
    "Leave requests and staff expense claims structured through the same approval engine and audit trail as your financial decisions. People requests, permanently on record.",
  alternates: { canonical: "/product/people" },
  openGraph: {
    title: "Avrentis Requests — leave & expense approvals on the same rails",
    description:
      "Leave and staff expense claims — structured, routed, and permanently on record.",
    url: "https://avrentis.com/product/people",
    type: "website",
  },
};

export default async function ProductPeoplePage() {
  // Launch gate first — never fetch pricing for a page we're about to 404.
  if (isLaunchHidden("/product/people")) notFound();
  const pricingData = await fetchPricingData();
  return <PeopleModulePage planAvailability={planAvailabilityFor("people", pricingData)} />;
}
