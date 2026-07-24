import type { Metadata } from "next";
import { redirect } from "next/navigation";

// The live, externally-monitored status page is the source of truth. We redirect
// rather than serve a hand-curated snapshot so status is never stale or faked.
const EXTERNAL_STATUS_URL = "https://status.avrentis.com/";

export const metadata: Metadata = {
  title: "Status — Avrentis",
  description:
    "Live Avrentis platform status — subsystem health, incident history, and notification subscriptions.",
  alternates: { canonical: EXTERNAL_STATUS_URL },
};

export default function StatusPage() {
  redirect(EXTERNAL_STATUS_URL);
}
