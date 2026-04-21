import type { Metadata } from "next";
import { AuditModulePage } from "@/components/product/pages/audit-module-page";

export const metadata: Metadata = {
  title: "Avrentis Audit — Compliance without the scramble",
  description:
    "An immutable, regulator-ready audit trail of every action in your organisation. Structured events, one-click exports, and SOC2-aligned controls baked into the platform.",
  openGraph: {
    title: "Avrentis Audit — Compliance without the scramble",
    description:
      "Tamper-proof audit trail, structured events, regulator-ready PDF + CSV exports. Every action permanently on record.",
    url: "https://avrentis.com/product/audit",
    type: "website",
  },
};

export default function ProductAuditPage() {
  return <AuditModulePage />;
}
