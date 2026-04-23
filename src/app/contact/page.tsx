import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/contact/contact-form";
import type { ContactIntent } from "./actions";

export const metadata: Metadata = {
  title: "Contact — Avrentis",
  description:
    "Talk to Avrentis. Book a personalised demo, request a security review, or share a use case. A real person replies within one business day. To start a trial, use /trial.",
  openGraph: {
    title: "Contact Avrentis",
    description:
      "Book a demo or talk to our team. Real humans, one-business-day reply.",
    url: "https://avrentis.com/contact",
    type: "website",
  },
};

const VALID_INTENTS: ContactIntent[] = [
  "demo",
  "security",
  "disclosure",
  "privacy",
  "legal",
  "careers",
  "feedback",
  "subscribe",
  "notify",
  "beta",
  "roadmap",
  "general",
];

function resolveIntent(raw: string | string[] | undefined): ContactIntent {
  if (typeof raw !== "string") return "general";
  return (VALID_INTENTS as string[]).includes(raw) ? (raw as ContactIntent) : "general";
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string | string[] }>;
}) {
  const { intent: rawIntent } = await searchParams;
  const intent = resolveIntent(rawIntent);

  return (
    <>
      <Navbar />
      <main
        style={{
          backgroundColor: "#f1f5f9",
          padding: "120px 40px",
          minHeight: "70vh",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <ContactForm intent={intent} />
        </div>
      </main>
      <Footer />
    </>
  );
}
