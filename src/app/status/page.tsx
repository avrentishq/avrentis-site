import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatusProductPage } from "@/components/status/status-page";
import { isLaunchHidden } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Status — Avrentis",
  description:
    "Current Avrentis platform status. Subsystem health, recent incidents, and how to subscribe to incident notifications.",
  openGraph: {
    title: "Avrentis platform status",
    description:
      "All systems operational. Subscribe to incident notifications at status@avrentis.com.",
    url: "https://avrentis.com/status",
    type: "website",
  },
};

export default function StatusPage() {
  if (isLaunchHidden("/status")) notFound();
  return <StatusProductPage />;
}
