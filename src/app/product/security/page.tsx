import type { Metadata } from "next";
import { SecurityProductPage } from "@/components/product/security-page";

export const metadata: Metadata = {
  title: "Security — authority at every layer",
  description:
    "Avrentis is built for organisations where every approval carries weight. Postgres RLS, 10-role RBAC layered with ABAC, Redis-backed session revocation, immutable audit trails, SCIM provisioning, AES-256-GCM encryption — the complete security stack, explained honestly.",
  openGraph: {
    title: "Avrentis security — authority at every layer",
    description:
      "Tenant isolation at the database. Role + attribute-based authority. Immutable audit. Lifecycle-bound access. Encryption end to end. No marketing — the actual stack.",
    url: "https://avrentis.com/product/security",
    type: "website",
  },
};

export default function SecurityPage() {
  return <SecurityProductPage />;
}
