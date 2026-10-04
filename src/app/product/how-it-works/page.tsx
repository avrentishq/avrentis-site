import type { Metadata } from "next";
import { HowItWorksProductPage } from "@/components/product/how-it-works-page";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How Avrentis works — the complete approval lifecycle",
  description:
    "Every request — payment voucher, purchase order, HR approval — travels a four-stage lifecycle: structured submission, role-enforced review, authoritative sanction, and a tamper-evident record. Here's how each stage works and what actually changes day-to-day.",
  alternates: { canonical: "/product/how-it-works" },
  openGraph: {
    title: "How Avrentis works — the complete approval lifecycle",
    description:
      "Submit → Review → Sanction → Record. Role-enforced chains, multi-channel notifications, tamper-evident audit trail. The complete walk-through.",
    url: canonical("/product/how-it-works"),
    type: "website",
  },
};

export default function HowItWorksPage() {
  return <HowItWorksProductPage />;
}
