import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsHubPage } from "@/components/docs/docs-page";
import { isLaunchHidden } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Documentation — Avrentis",
  description:
    "Avrentis documentation hub. Getting started, core concepts, modules, security, administration, integrations, API & webhooks, and governance.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "Avrentis documentation",
    description:
      "Everything you need to run Avrentis, in one place — with honest signals for guides still in progress.",
    url: "https://avrentis.com/docs",
    type: "website",
  },
};

export default function DocsPage() {
  if (isLaunchHidden("/docs")) notFound();
  return <DocsHubPage />;
}
