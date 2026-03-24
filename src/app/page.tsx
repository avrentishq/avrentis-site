import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnnouncementStrip } from "@/components/sections/announcement-strip";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { Problem } from "@/components/sections/problem";
import { ApprovalChain } from "@/components/sections/approval-chain";
import { SolutionRow } from "@/components/sections/solution-row";
import { FeaturesGrid } from "@/components/sections/features-grid";
import { HowItWorks } from "@/components/sections/how-it-works";
import { StatsBar } from "@/components/sections/stats-bar";
import { QuoteBand } from "@/components/sections/quote-band";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function Home() {
  return (
    <>
      <AnnouncementStrip />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <ApprovalChain />

        <SolutionRow
          label="PAYMENT VOUCHERS"
          headline="Structure every payment before it moves."
          body="Every payment voucher raised in AVRENTIS travels a defined path — from the staff member who raises it, through HOD review, finance validation, and MD sanction. No shortcuts. No WhatsApp. Every step on record."
          features={[
            "Sequential approval chain — Staff → HOD → Finance → MD",
            "Permanent record of every action and timestamp",
            "Audit-ready before any query arises",
          ]}
          bg="#FDF8EF"
        />

        <SolutionRow
          label="PURCHASE ORDERS"
          headline="Raise, review, and record every purchase order."
          body="From vendor selection to MD approval, every purchase order in AVRENTIS is traceable. Vendor details, amounts, cost centres — all structured, all on record."
          features={[
            "Registered vendor database with bank details",
            "Full approval chain with role-based authority",
            "Reference numbers in IBM Plex Mono for every document",
          ]}
          bg="#ffffff"
          reversed
        />

        <SolutionRow
          label="AUDIT TRAIL"
          headline="An immutable record of everything."
          body="Every action across your organisation — who submitted, who reviewed, who approved, who returned — permanently on record. The audit trail cannot be edited. It cannot be deleted. It exists because it must."
          features={[
            "Every action timestamped and attributed",
            "Exportable for regulatory review",
            "NDPR-compliant data handling",
          ]}
          bg="#FDF8EF"
        />

        <FeaturesGrid />
        <HowItWorks />
        <StatsBar />
        <QuoteBand />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
