import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SavingsEstimator } from "./estimator";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { Eyebrow } from "@/components/ui/section-intro";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { pageMetadata } from "@/lib/seo";
import { SITE_ROUTES } from "@/lib/routes";
import { Z_INDEX } from "@/lib/layers";

export const metadata: Metadata = pageMetadata({
  path: SITE_ROUTES.savingsEstimator,
  title: "Approval savings estimator",
  description: "Estimate the hours and money structured approvals give your team back. Free, instant, no signup — your numbers, a transparent formula.",
  socialTitle: "What would structured approvals save you?",
  socialDescription: "A free, instant estimate of the time and cost you recover with structured approvals. No signup required.",
});

export default function SavingsToolPage() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        style={{
          backgroundColor: "var(--color-bg)",
          padding: "56px 40px 96px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.savingsHeader} scrim="light" />
        <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto", position: "relative", zIndex: Z_INDEX.raised }}>
          <div style={{ maxWidth: "var(--measure)", margin: "0 auto 48px", textAlign: "center" }}>
            <Eyebrow style={{ display: "block", marginBottom: "16px" }}>Free tool · No signup</Eyebrow>
            <h1
              style={{
                fontWeight: 400,
                fontSize: "var(--text-heading-3xl)",
                color: "var(--color-text-primary)",
                lineHeight: 1.2,
                margin: "0 0 16px",
                letterSpacing: "0.01em",
              }}
              className="lg:!text-display-lg"
            >
              What would structured approvals give you back?
            </h1>
            <p
              style={{
                fontSize: "var(--text-xl)",
                color: "var(--color-text-muted)",
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
