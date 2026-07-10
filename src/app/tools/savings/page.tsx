import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SavingsEstimator } from "./estimator";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";

export const metadata: Metadata = {
  title: "Approval savings estimator — Avrentis",
  description:
    "Estimate the hours and money structured approvals give your team back. Free, instant, no signup — your numbers, a transparent formula.",
  alternates: { canonical: "/tools/savings" },
  openGraph: {
    title: "What would structured approvals save you?",
    description:
      "A free, instant estimate of the time and cost you recover with structured approvals. No signup required.",
    url: "https://avrentis.com/tools/savings",
    type: "website",
  },
};

export default function SavingsToolPage() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        style={{
          backgroundColor: "#f1f5f9",
          padding: "56px 40px 96px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.savingsHeader} scrim="light" />
        <div style={{ maxWidth: "1080px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "640px", margin: "0 auto 48px", textAlign: "center" }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-gold-on-light)",
                display: "block",
                marginBottom: "16px",
              }}
            >
              Free tool · No signup
            </span>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "34px",
                color: "#0f172a",
                lineHeight: 1.2,
                margin: "0 0 16px",
                letterSpacing: "0.01em",
              }}
              className="lg:!text-[42px]"
            >
              What would structured approvals give you back?
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                color: "#64748b",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Adjust the three numbers below and watch the estimate update. It&rsquo;s
              your data and a formula we show you — no email needed to see it.
            </p>
          </div>

          <SavingsEstimator />
        </div>
      </main>
      <Footer />
    </>
  );
}
