import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Pricing } from "@/components/sections/pricing";
import { CtaBanner } from "@/components/sections/cta-banner";
import { fetchPricingData } from "@/lib/pricing";

export default async function PricingPage() {
  const pricingData = await fetchPricingData();

  return (
    <>
      <Navbar />
      <main>
        <Pricing data={pricingData} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
