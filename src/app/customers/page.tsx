import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomersProductPage } from "@/components/customers/customers-page";
import { isLaunchHidden } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Customers — Avrentis",
  description:
    "Organisations that chose structure over speed. Who Avrentis is built for, the patterns we hear in every discovery call, and how the launch-partner programme works.",
  alternates: { canonical: "/customers" },
  openGraph: {
    title: "Avrentis customers & launch partners",
    description:
      "Honest about where we are. Industries we serve, problems we hear, and the launch cohort that shapes what ships next.",
    url: "https://avrentis.com/customers",
    type: "website",
  },
};

export default function CustomersPage() {
  if (isLaunchHidden("/customers")) notFound();
  return <CustomersProductPage />;
}
