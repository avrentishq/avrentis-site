import type { Metadata } from "next";
import { PeopleModulePage } from "@/components/product/pages/people-module-page";

export const metadata: Metadata = {
  title: "Avrentis People — HR approvals on the same rails",
  description:
    "Leave requests, onboarding, and policy acknowledgements structured through the same approval engine as your financial decisions. People operations with an audit trail.",
  openGraph: {
    title: "Avrentis People — HR approvals on the same rails",
    description:
      "Leave, onboarding, acknowledgements — structured, routed, and permanently on record.",
    url: "https://avrentis.com/product/people",
    type: "website",
  },
};

export default function ProductPeoplePage() {
  return <PeopleModulePage />;
}
