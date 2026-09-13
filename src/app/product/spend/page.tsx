import type { Metadata } from "next";

import { ProductSuiteLayout } from "@/components/product/suite-layout";

export const metadata: Metadata = {
  title: "Avrentis Spend — payments, purchase orders and restricted funds",
  description:
    "Payments, purchase orders and restricted funds on one approval path — routed to whoever is allowed to approve the amount, and kept on record permanently.",
  alternates: { canonical: "/product/spend" },
  openGraph: {
    title: "Avrentis Spend — payments, purchase orders and restricted funds",
    description: "Nothing leaves the account without a decision behind it.",
    url: "https://avrentis.com/product/spend",
    type: "website",
  },
};

export default function ProductSpendSuitePage() {
  return <ProductSuiteLayout suite="spend" />;
}
