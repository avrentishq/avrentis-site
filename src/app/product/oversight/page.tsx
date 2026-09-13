import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";

export const metadata: Metadata = {
  title: "Avrentis Oversight — approval authority, enforced and monitored",
  description:
    "Define who can approve what, up to how much — enforced on every request automatically, and monitored for the patterns that mean somebody is working around it.",
  alternates: { canonical: "/product/oversight" },
  openGraph: {
    title: "Avrentis Oversight — approval authority, enforced and monitored",
    description: "The rules are written down, enforced, and watched.",
    url: "https://avrentis.com/product/oversight",
    type: "website",
  },
};

export default function ProductOversightSuitePage() {
  return <ProductSuiteLayout suite="oversight" />;
}
