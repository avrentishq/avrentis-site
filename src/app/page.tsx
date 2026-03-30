import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { Problem } from "@/components/sections/problem";
import { ApprovalChain } from "@/components/sections/approval-chain";
import { SolutionRow } from "@/components/sections/solution-row";
import { FeaturesGrid } from "@/components/sections/features-grid";
import { HowItWorks } from "@/components/sections/how-it-works";
import { QuoteBand } from "@/components/sections/quote-band";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <ApprovalChain />

        <section style={{ backgroundColor: "#ffffff", padding: "100px 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "10px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "#C68B2F",
                display: "block",
                marginBottom: "16px",
              }}
            >
              THE PLATFORM
            </span>
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "22px",
                color: "#0f172a",
                lineHeight: 1.3,
                margin: "0 0 48px",
              }}
            >
              Two document types. One structured decision chain.
            </h2>

            <SolutionRow type="pv" />

            <div style={{ borderTop: "0.5px solid #e2e8f0", paddingTop: "48px", marginTop: "48px" }} />

            <SolutionRow type="po" />
          </div>
        </section>

        <FeaturesGrid />
        <HowItWorks />
        <QuoteBand />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
