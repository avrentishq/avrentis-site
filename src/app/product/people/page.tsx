import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PeopleModulePage } from "@/components/product/pages/people-module-page";
import { isLaunchHidden } from "@/lib/launch";
import { fetchPricingData } from "@/lib/pricing";
import { planAvailabilityFor } from "@/lib/module-availability";
import { canonical } from "@/lib/seo";
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
  // Launch gate first — never fetch pricing for a page we're about to 404.
  if (isLaunchHidden("/product/people")) notFound();
  const pricingData = await fetchPricingData();
  return <PeopleModulePage planAvailability={planAvailabilityFor("people", pricingData)} />;
}
