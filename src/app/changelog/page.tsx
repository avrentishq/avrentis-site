import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChangelogProductPage } from "@/components/changelog/changelog-page";
import { isLaunchHidden } from "@/lib/launch";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Changelog — Avrentis",
  description:
    "Release notes for the Avrentis platform. Notable changes, new capabilities, and platform-level shifts, written for operators — not a commit log.",
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: "Avrentis changelog",
    description:
      "What we've shipped — notable changes and new capabilities, newest first.",
    url: canonical("/changelog"),
    type: "website",
  },
};

export default function ChangelogPage() {
  if (isLaunchHidden("/changelog")) notFound();
  return <ChangelogProductPage />;
}
