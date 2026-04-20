import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { HowItWorks } from "@/components/sections/how-it-works";
import { SocialProof } from "@/components/sections/social-proof";
import { FeaturesGrid } from "@/components/sections/features-grid";
import { Pricing } from "@/components/sections/pricing";
import { CtaBanner } from "@/components/sections/cta-banner";
import { fetchPricingData } from "@/lib/pricing";

export default async function Home() {
  const pricingData = await fetchPricingData();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <SocialProof />
        <FeaturesGrid />
        <Pricing data={pricingData} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
