import type { Metadata } from "next";
import { PayModulePage } from "@/components/product/pages/pay-module-page";

export const metadata: Metadata = {
  title: "Avrentis Payables — Structured payment approvals",
  description:
    "Every payment voucher submitted, reviewed, and sanctioned through a defined approval chain — with a bank-ready PDF and permanent record at the end. Replace the email trail with structured authority.",
  openGraph: {
    title: "Avrentis Payables — Structured payment approvals",
    description:
      "Submit, approve, and authorise every payment through a defined chain. Bank-ready exports and a permanent record, without the paper.",
    url: "https://avrentis.com/product/pay",
    type: "website",
  },
};

export default function ProductPayPage() {
  return <PayModulePage />;
}
