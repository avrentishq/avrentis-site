import type { Metadata } from "next";
import { GrantsModulePage } from "@/components/product/pages/grants-module-page";

export const metadata: Metadata = {
  title: "Avrentis Grants — Prove where every donor naira went",
  description:
    "Restricted-fund accounting built into your approvals: tag every payment to a grant and budget line, track burn per donor, oversee sub-grantees, and export donor-ready reports in the grant's own currency.",
  alternates: { canonical: "/product/grants" },
  openGraph: {
    title: "Avrentis Grants — Prove where every donor naira went",
    description:
      "Restricted-fund tracking, per-grant burn, sub-grantee oversight, and donor-ready report exports — from the same approvals your finance team already runs.",
    url: "https://avrentis.com/product/grants",
    type: "website",
  },
};

export default function ProductGrantsPage() {
  return <GrantsModulePage />;
}
