import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BRAND, statusUrl } from "@/lib/brand";
import { pageTitle } from "@/lib/seo";

// The live, externally-monitored status page is the source of truth. We redirect
// rather than serve a hand-curated snapshot so status is never stale or faked.
// Core owns the status page's origin (BRAND.statusUrl).
const EXTERNAL_STATUS_URL = statusUrl();

export const metadata: Metadata = {
  title: pageTitle("Status"),
  description: `Live ${BRAND.name} platform status — subsystem health, incident history, and notification subscriptions.`,
  alternates: { canonical: EXTERNAL_STATUS_URL },
};

export default function StatusPage() {
  redirect(EXTERNAL_STATUS_URL);
}
