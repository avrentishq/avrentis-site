import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PeopleModulePage } from "@/components/product/pages/people-module-page";
import { isLaunchHidden } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Avrentis Requests — leave & expense approvals on the same rails",
  description:
    "Leave requests and staff expense claims structured through the same approval engine and audit trail as your financial decisions. People requests, permanently on record.",
  alternates: { canonical: "/product/people" },
  openGraph: {
    title: "Avrentis Requests — leave & expense approvals on the same rails",
    description:
      "Leave and staff expense claims — structured, routed, and permanently on record.",
    url: "https://avrentis.com/product/people",
    type: "website",
  },
};

export default function ProductPeoplePage() {
  if (isLaunchHidden("/product/people")) notFound();
  return <PeopleModulePage />;
}
