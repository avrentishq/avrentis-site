import type { Metadata } from "next";
import { SecurityProductPage } from "@/components/product/security-page";
import { JsonLd, canonical, faqPageSchema } from "@/lib/seo";
import { SECURITY_FAQS } from "@/lib/security-faqs";

export const metadata: Metadata = {
  title: "Security — authority at every layer",
  description:
    "Avrentis is built for organisations where every approval carries weight. Tenant isolation enforced by the database, role-based access with separation of duties and per-request rules, sessions that end within seconds of a role change, a tamper-evident audit trail sealed daily, automated user provisioning and per-company encryption — the complete security posture, explained honestly.",
  alternates: { canonical: "/product/security" },
  openGraph: {
    title: "Avrentis security — authority at every layer",
    description:
      "Tenant isolation at the database. Role + attribute-based authority. Tamper-evident audit, sealed daily. Lifecycle-bound access. Per-company encryption. No marketing — the actual stack.",
    url: canonical("/product/security"),
    type: "website",
  },
};

export default function SecurityPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(SECURITY_FAQS)} />
      <SecurityProductPage />
    </>
  );
}
