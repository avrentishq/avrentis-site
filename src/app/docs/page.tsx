import type { Metadata } from "next";
import { DocsHubPage } from "@/components/docs/docs-page";

export const metadata: Metadata = {
  title: "Documentation — Avrentis",
  description:
    "Avrentis documentation hub. Getting started, core concepts, modules, security, administration, integrations, API & webhooks, and governance.",
  openGraph: {
    title: "Avrentis documentation",
    description:
      "Everything you need to run Avrentis, in one place — with honest signals for guides still in progress.",
    url: "https://avrentis.com/docs",
    type: "website",
  },
};

export default function DocsPage() {
  return <DocsHubPage />;
}
