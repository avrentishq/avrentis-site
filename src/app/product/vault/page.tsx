import type { Metadata } from "next";
import { VaultModulePage } from "@/components/product/pages/vault-module-page";

export const metadata: Metadata = {
  title: "Avrentis Documents — Institutional memory, searchable",
  description:
    "Every approved document in one tagged, searchable repository. Replace scattered drives, physical files, and lost email attachments with a single source of truth for your organisation.",
  alternates: { canonical: "/product/vault" },
  openGraph: {
    title: "Avrentis Documents — Institutional memory, searchable",
    description:
      "Centralised, tagged, searchable document repository. Every approved record — instantly retrievable, permanently preserved.",
    url: "https://avrentis.com/product/vault",
    type: "website",
  },
};

export default function ProductVaultPage() {
  return <VaultModulePage />;
}
