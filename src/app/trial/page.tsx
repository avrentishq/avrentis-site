import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { TrialForm } from "./trial-form";

export const metadata: Metadata = {
  title: "Start your 14-day trial — Avrentis",
  description:
    "Provision an Avrentis workspace in under two minutes. Full Business tier, no credit card, your real organisational data.",
  alternates: { canonical: "/trial" },
  openGraph: {
    title: "Start your 14-day Avrentis trial",
    description:
      "Provision in under two minutes. Full Business tier. Your organisation's data, not a demo.",
    url: "https://avrentis.com/trial",
    type: "website",
  },
};

export default function TrialPage() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        style={{
          backgroundColor: "#f1f5f9",
          padding: "56px 40px 96px",
          minHeight: "70vh",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.trialForm} scrim="light" />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <TrialForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
