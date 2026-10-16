import type { Metadata } from "next";
import { PayModulePage } from "@/components/product/pages/pay-module-page";
import { fetchPricingData } from "@/lib/pricing";
import { modulePageData } from "@/lib/module-availability";
import { canonical } from "@/lib/seo";
import { notFoundUnlessPublic } from "@/lib/module-route";
import { moduleName } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${moduleName("pay")} — Structured payment approvals`,
  description:
    "Every payment voucher submitted, reviewed, and sanctioned through a defined approval chain — with a bank-ready PDF and a tamper-evident audit trail at the end. Replace the email trail with structured authority.",
  alternates: { canonical: "/product/pay" },
  openGraph: {
    title: `${moduleName("pay")} — Structured payment approvals`,
    description:
      "Submit, approve, and authorise every payment through a defined chain. Bank-ready exports and a full audit trail, without the paper.",
    url: canonical("/product/pay"),
    type: "website",
  },
};

export default async function ProductPayPage() {
  notFoundUnlessPublic("pay");
  const pricingData = await fetchPricingData();
  return <PayModulePage {...modulePageData("pay", pricingData)} />;
}
