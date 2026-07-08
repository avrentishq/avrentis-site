import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Pricing } from "@/components/sections/pricing";
import { CtaBanner } from "@/components/sections/cta-banner";
import { fetchPricingData } from "@/lib/pricing";

const DESCRIPTION =
  "Simple, transparent plans for Nigerian and African organisations — Starter, Business, and Enterprise. Every plan includes the approval engine, permanent audit trail, and full security stack.";

export const metadata: Metadata = {
  title: "Pricing — Avrentis",
  description: DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Avrentis pricing — Starter, Business, Enterprise",
    description: DESCRIPTION,
    url: "https://avrentis.com/pricing",
    type: "website",
  },
};

export default async function PricingPage() {
  const pricingData = await fetchPricingData();

  return (
    <>
      <Navbar />
      <main id="main">
        <Pricing data={pricingData} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
