import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareersProductPage } from "@/components/careers/careers-page";
import { isLaunchHidden } from "@/lib/launch";
import { BRAND } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { SITE_ROUTES } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  path: SITE_ROUTES.careers,
  title: "Careers",
  description: "Build the platform that runs African organisations. Small team, deliberate hiring, long-term horizon. Register your interest — it's how we hire.",
  socialTitle: `Careers at ${BRAND.name}`,
  socialDescription: "Structure over speed. Customers before narrative. Built for Africa, standard-setting globally.",
});

export default function CareersPage() {
  if (isLaunchHidden(SITE_ROUTES.careers)) notFound();
  return <CareersProductPage />;
}
