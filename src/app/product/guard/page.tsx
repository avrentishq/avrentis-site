import type { Metadata } from "next";
import { GuardModulePage } from "@/components/product/pages/guard-module-page";

export const metadata: Metadata = {
  title: "Avrentis Guard — Catch the bad payment before the money moves",
  description:
    "Real-time flags on the patterns that drain finance teams — duplicate payments, vendor bank-account switches, and threshold-gaming — surfaced before approval, resolved on an audited review queue.",
  alternates: { canonical: "/product/guard" },
  openGraph: {
    title: "Avrentis Guard — Catch the bad payment before the money moves",
    description:
      "Duplicate payments, vendor bank-account changes, and structuring flagged before approval — with an audited review-and-resolve queue.",
    url: "https://avrentis.com/product/guard",
    type: "website",
  },
};

export default function ProductGuardPage() {
  return <GuardModulePage />;
}
