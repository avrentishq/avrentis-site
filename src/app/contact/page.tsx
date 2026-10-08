import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { isContactIntent, type ContactIntent } from "@/lib/brand";
import { canonical } from "@/lib/seo";
import { contactHref } from "@/app/contact/tabs";

export const metadata: Metadata = {
  title: "Contact — Avrentis",
  description:
    "Talk to Avrentis. Contact us for a walkthrough, request a security review, or share a use case. A real person replies within one business day. To start a trial, use /trial.",
  alternates: { canonical: contactHref() },
  openGraph: {
    title: "Contact Avrentis",
    description:
      "Contact us or talk to our team. Real humans, one-business-day reply.",
    url: canonical(contactHref()),
    type: "website",
  },
};

function resolveIntent(raw: string | string[] | undefined): ContactIntent {
  return isContactIntent(raw) ? raw : "general";
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
        id="main"
        style={{
          backgroundColor: "var(--color-bg)",
          padding: "56px 40px 96px",
          minHeight: "70vh",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.contactForm} scrim="light" />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <ContactForm intent={intent} />
        </div>
      </main>
      <Footer />
    </>
  );
}
