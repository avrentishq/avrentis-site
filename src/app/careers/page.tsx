import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareersProductPage } from "@/components/careers/careers-page";
import { isLaunchHidden } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Careers — Avrentis",
  description:
    "Build the platform that runs African organisations. Small team, deliberate hiring, long-term horizon. Register your interest — it's how we hire.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers at Avrentis",
    description:
      "Structure over speed. Customers before narrative. Built for Africa, standard-setting globally.",
    url: "https://avrentis.com/careers",
    type: "website",
  },
};

export default function CareersPage() {
  if (isLaunchHidden("/careers")) notFound();
  return <CareersProductPage />;
}
