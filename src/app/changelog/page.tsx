import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChangelogProductPage } from "@/components/changelog/changelog-page";
import { isLaunchHidden } from "@/lib/launch";
import { BRAND } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { SITE_ROUTES } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  path: SITE_ROUTES.changelog,
  title: "Changelog",
  description: `Release notes for the ${BRAND.name} platform. Notable changes, new capabilities, and platform-level shifts, written for operators — not a commit log.`,
  socialTitle: `${BRAND.name} changelog`,
  socialDescription: "What we've shipped — notable changes and new capabilities, newest first.",
});

export default function ChangelogPage() {
  if (isLaunchHidden(SITE_ROUTES.changelog)) notFound();
  return <ChangelogProductPage />;
}
