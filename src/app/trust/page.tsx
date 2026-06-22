import type { Metadata } from "next";
import { TrustProductPage } from "@/components/trust/trust-page";

export const metadata: Metadata = {
  title: "Trust centre — Avrentis",
  description:
    "Controls framework alignment, sub-processors, data residency, DPA on request, responsible disclosure. Everything a CISO, legal, or procurement reviewer needs to evaluate Avrentis — on one honest page.",
  alternates: { canonical: "/trust" },
  openGraph: {
    title: "Avrentis trust centre",
    description:
      "Frameworks we align to, sub-processors, residency, DPA, responsible disclosure — one page, honest about where we are.",
    url: "https://avrentis.com/trust",
    type: "website",
  },
};

export default function TrustPage() {
  return <TrustProductPage />;
}
