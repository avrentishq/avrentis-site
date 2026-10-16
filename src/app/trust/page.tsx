import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrustProductPage } from "@/components/trust/trust-page";
import { isLaunchHidden } from "@/lib/launch";
import { pageMetadata } from "@/lib/seo";
import { LEGAL_PAGES, BRAND } from "@/lib/brand";

export const metadata: Metadata = pageMetadata({
  path: LEGAL_PAGES.trust,
  title: "Trust centre",
  description: `Where we stand on SOC 2, sub-processors, data residency, DPA on request, responsible disclosure. Everything a CISO, legal, or procurement reviewer needs to evaluate ${BRAND.name} — on one honest page.`,
  socialTitle: `${BRAND.name} trust centre`,
  socialDescription: "Frameworks we align to, sub-processors, residency, DPA, responsible disclosure — one page, honest about where we are.",
});

export default function TrustPage() {
  // Launch-gated (see src/lib/launch.ts) — re-enable by removing the trust path from HIDDEN_AT_LAUNCH.
  if (isLaunchHidden(LEGAL_PAGES.trust)) notFound();
  return <TrustProductPage />;
}
