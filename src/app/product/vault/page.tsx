import type { Metadata } from "next";
import { VaultModulePage } from "@/components/product/pages/vault-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { planAvailabilityFor } from "@/lib/module-availability";

export const metadata: Metadata = {
  title: "Avrentis Records — Institutional memory, searchable",
  description:
    "Every voucher, purchase order, goods receipt and supplier invoice in one list, with its files and version history. Replace scattered drives, paper files and lost email attachments with one place to find what was approved.",
  alternates: { canonical: "/product/vault" },
  openGraph: {
    title: "Avrentis Records — Institutional memory, searchable",
    description:
      "Every financial record in one list, with its files and history — findable in seconds and kept for at least seven years.",
    url: "https://avrentis.com/product/vault",
    type: "website",
  },
};

export default async function ProductVaultPage() {
  const pricingData = await fetchPricingData();
  return <VaultModulePage planAvailability={planAvailabilityFor("vault", pricingData)} />;
}
