import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsHubPage } from "@/components/docs/docs-page";
import { isLaunchHidden } from "@/lib/launch";
import { BRAND } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { SITE_ROUTES } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  path: SITE_ROUTES.docs,
  title: "Documentation",
  description: `${BRAND.name} documentation hub. Getting started, core concepts, modules, security, administration, integrations, API & webhooks, and governance.`,
  socialTitle: `${BRAND.name} documentation`,
  socialDescription: `Everything you need to run ${BRAND.name}, in one place — with honest signals for guides still in progress.`,
});

export default function DocsPage() {
  if (isLaunchHidden(SITE_ROUTES.docs)) notFound();
  return <DocsHubPage />;
}
