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
        {pricingData ? (
          <Pricing data={pricingData} />
        ) : (
          <section
            style={{
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "96px 24px",
              gap: "20px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "11px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "#C68B2F",
              }}
            >
              PRICING
            </span>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "36px",
                color: "#0f172a",
                margin: 0,
                textAlign: "center",
              }}
            >
              Structured pricing for every stage of growth.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "16px",
                color: "#64748b",
                margin: 0,
                textAlign: "center",
                maxWidth: "480px",
                lineHeight: 1.7,
              }}
            >
              Contact us to learn about our plans and find the right fit for
              your organisation.
            </p>
            <a
              href="/contact"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                lineHeight: 1,
                backgroundColor: "#C68B2F",
                color: "#0f172a",
                border: "none",
                borderRadius: "3px",
                height: "36px",
                padding: "0 20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                marginTop: "8px",
              }}
            >
              CONTACT US
            </a>
          </section>
        )}
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
