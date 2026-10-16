import type { Metadata } from "next";
import { requestTypeList } from "@/lib/module-copy";
import { HowItWorksProductPage } from "@/components/product/how-it-works-page";
import { BRAND } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { SITE_ROUTES } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  path: SITE_ROUTES.howItWorks,
  title: `How ${BRAND.name} works — the complete approval lifecycle`,
  description: `Every request — ${requestTypeList()} — travels a four-stage lifecycle: structured submission, role-enforced review, authoritative sanction, and a tamper-evident record. Here's how each stage works and what actually changes day-to-day.`,
  socialDescription: "Submit → Review → Sanction → Record. Role-enforced chains, multi-channel notifications, tamper-evident audit trail. The complete walk-through.",
});

export default function HowItWorksPage() {
  return <HowItWorksProductPage />;
}
