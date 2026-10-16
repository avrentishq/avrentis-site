import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomersProductPage } from "@/components/customers/customers-page";
import { isLaunchHidden } from "@/lib/launch";
import { BRAND } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { SITE_ROUTES } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  path: SITE_ROUTES.customers,
  title: "Customers",
  description: `Organisations that chose structure over speed. Who ${BRAND.name} is built for, the patterns we hear in every discovery call, and how the launch-partner programme works.`,
  socialTitle: `${BRAND.name} customers & launch partners`,
  socialDescription: "Honest about where we are. Industries we serve, problems we hear, and the launch cohort that shapes what ships next.",
});

export default function CustomersPage() {
  if (isLaunchHidden(SITE_ROUTES.customers)) notFound();
  return <CustomersProductPage />;
}
