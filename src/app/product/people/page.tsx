import type { Metadata } from "next";
import { PeopleModulePage } from "@/components/product/pages/people-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { modulePageData } from "@/lib/module-availability";
import { pageMetadata } from "@/lib/seo";
import { notFoundUnlessPublic } from "@/lib/module-route";
import { moduleName, moduleHref } from "@/lib/brand";

export const metadata: Metadata = pageMetadata({
  path: moduleHref("people"),
  title: `${moduleName("people")} — staff expense approvals on the same rails`,
  description: "Staff expense claims structured through the same approval engine and audit trail as your financial decisions. Every approval on record for the life of your account.",
  socialDescription: "Staff expense claims — structured, routed, and every approval on record.",
});

export default async function ProductPeoplePage() {
  // Visibility first — never fetch pricing for a page we're about to 404.
  notFoundUnlessPublic("people");
  const pricingData = await fetchPricingData();
  return <PeopleModulePage {...modulePageData("people", pricingData)} />;
}
