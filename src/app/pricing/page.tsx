import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Pricing } from "@/components/sections/pricing";
import { PlanComparison } from "@/components/sections/plan-comparison";
import { CtaBanner } from "@/components/sections/cta-banner";
import { fetchPricingData, formatPlanList, planNames } from "@/lib/pricing";
import { AUDIT_TRAIL_KEPT } from "@/lib/record-keeping";
import { canonical } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  // Tier names come from the pricing API (same cached fetch the page renders),
  // so the description cannot name a plan that is not sold.
  const names = planNames(await fetchPricingData());
  const description = `Simple, transparent plans for Nigerian and African organisations — ${formatPlanList(names)}. Every plan includes the approval engine, a tamper-evident audit trail ${AUDIT_TRAIL_KEPT}, and the full security stack.`;
  return {
    title: "Pricing — Avrentis",
    description,
    alternates: { canonical: "/pricing" },
    openGraph: {
      title: `Avrentis pricing — ${names.join(", ")}`,
      description,
      url: canonical("/pricing"),
      type: "website",
    },
  };
}

export default async function PricingPage() {
  const pricingData = await fetchPricingData();

  return (
    <>
      <Navbar />
      <main id="main">
        <Pricing data={pricingData} headingAs="h1" />
        <PlanComparison data={pricingData} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
