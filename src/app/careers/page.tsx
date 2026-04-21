import type { Metadata } from "next";
import { CareersProductPage } from "@/components/careers/careers-page";

export const metadata: Metadata = {
  title: "Careers — Avrentis",
  description:
    "Build the platform that runs African organisations. Small team, deliberate hiring, long-term horizon. Register your interest — it's how we hire.",
  openGraph: {
    title: "Careers at Avrentis",
    description:
      "Structure over speed. Customers before narrative. Built for Africa, standard-setting globally.",
    url: "https://avrentis.com/careers",
    type: "website",
  },
};

export default function CareersPage() {
  return <CareersProductPage />;
}
