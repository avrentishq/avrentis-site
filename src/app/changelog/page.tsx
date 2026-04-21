import type { Metadata } from "next";
import { ChangelogProductPage } from "@/components/changelog/changelog-page";

export const metadata: Metadata = {
  title: "Changelog — Avrentis",
  description:
    "Release notes for the Avrentis platform. Notable changes, new capabilities, and platform-level shifts, written for operators — not a commit log.",
  openGraph: {
    title: "Avrentis changelog",
    description:
      "What we've shipped — notable changes and new capabilities, newest first.",
    url: "https://avrentis.com/changelog",
    type: "website",
  },
};

export default function ChangelogPage() {
  return <ChangelogProductPage />;
}
