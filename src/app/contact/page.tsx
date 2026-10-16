import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { isContactIntent, SITE_PAGES, type ContactIntent, BRAND } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { contactHref } from "@/app/contact/tabs";
import { ENQUIRY_REPLY_TIME } from "@/lib/contacts";

export const metadata: Metadata = pageMetadata({
  path: contactHref(),
  title: "Contact",
  description: `Talk to ${BRAND.name}. Contact us for a walkthrough, request a security review, or share a use case. A real person replies ${ENQUIRY_REPLY_TIME}. To start a trial, use ${SITE_PAGES.trial()}.`,
  socialTitle: `Contact ${BRAND.name}`,
  socialDescription: `Contact us or talk to our team. Real humans, a reply ${ENQUIRY_REPLY_TIME}.`,
});

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
