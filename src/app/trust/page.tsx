import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrustProductPage } from "@/components/trust/trust-page";
import { isLaunchHidden } from "@/lib/launch";
import { canonical } from "@/lib/seo";
import { LEGAL_PAGES } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Trust centre — Avrentis",
  description:
    "Where we stand on SOC 2, sub-processors, data residency, DPA on request, responsible disclosure. Everything a CISO, legal, or procurement reviewer needs to evaluate Avrentis — on one honest page.",
  alternates: { canonical: LEGAL_PAGES.trust },
  openGraph: {
    title: "Avrentis trust centre",
    description:
      "Frameworks we align to, sub-processors, residency, DPA, responsible disclosure — one page, honest about where we are.",
    url: canonical(LEGAL_PAGES.trust),
    type: "website",
  },
};

export default function TrustPage() {
  // Launch-gated (see src/lib/launch.ts) — re-enable by removing the trust path from HIDDEN_AT_LAUNCH.
  if (isLaunchHidden(LEGAL_PAGES.trust)) notFound();
  return <TrustProductPage />;
}
