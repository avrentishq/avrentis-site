import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { Eyebrow, SectionIntro } from "@/components/ui/section-intro";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { BRAND } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { contactHref } from "@/app/contact/tabs";
import { ENQUIRY_PROMISE } from "@/lib/contacts";
import { MARKET_NEED, MARKET_REGION, MARKET_SCOPE } from "@/lib/market";
import { SITE_ROUTES } from "@/lib/routes";
import { cardGridProps } from "@/lib/card-grid";

const ABOUT_DESCRIPTION = `Why we built ${BRAND.name} — the ${BRAND.positioningStatement} for ${MARKET_SCOPE} ${MARKET_NEED}.`;

export const metadata: Metadata = pageMetadata({
  path: SITE_ROUTES.about,
  title: "About",
  description: ABOUT_DESCRIPTION,
  socialTitle: `About ${BRAND.name}`,
});

const VALUES = [
  {
    title: "Structure over speed",
    body: "We never ship fast at the cost of correctness. The organisations that trust us are making decisions that move money. Every feature must be reliable.",
  },
  {
    title: "Authority by design",
    body: "We build software that enforces authority — not assumes it. Every permission, every workflow, every record is intentional.",
  },
  {
    title: "Transparency always",
    body: "We communicate directly with our users, our team, and our stakeholders. No ambiguity. No hidden terms.",
  },
  {
    title: "Built for Africa, built for the world",
    body: "We started in Africa because that is where we saw the problem most clearly. We build for every organisation that faces it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        {/* ── Hero ── */}
        <section
          style={{
            backgroundColor: "var(--color-navy-primary)",
            padding: "120px 40px 80px",
            position: "relative",
            overflow: "hidden",
            isolation: "isolate",
          }}
        >
          <SectionBackdrop src={SECTION_BACKDROPS.aboutHero} scrim="dark" />
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <SectionIntro
              surface="dark"
              reveal="none"
              titleAs="h1"
              eyebrow={`About ${BRAND.name}`}
              eyebrowStyle={{ margin: "0 0 16px" }}
              title="We believe every organisation deserves operational structure."
              titleStyle={{ fontSize: "var(--text-display-xs)", fontWeight: 400, margin: "0 0 16px", lineHeight: 1.3 }}
              lede="Regardless of industry, size, or geography."
              ledeStyle={{ color: "var(--color-text-muted)", fontSize: "var(--text-3xl)", fontWeight: 400, margin: 0 }}
            />
          </div>
        </section>

        {/* ── Mission & Story ── */}
        <section
          style={{
            backgroundColor: "var(--color-white)",
            padding: "80px 40px",
            position: "relative",
            overflow: "hidden",
            isolation: "isolate",
          }}
        >
          <SectionBackdrop src={SECTION_BACKDROPS.aboutMission} scrim="light" />
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                lineHeight: 1.8,
                margin: "0 0 24px",
              }}
            >
              {BRAND.name} was built after watching capable organisations operate
              below their potential — not because of a lack of talent or
              ambition, but because their internal processes had no structure.
              Decisions were made over email. Approvals were lost in inboxes.
              Authority was assumed, not enforced.
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                lineHeight: 1.8,
                margin: "0 0 48px",
              }}
            >
              We built {BRAND.name} to change that — for every organisation, across{" "}
              {MARKET_REGION}.
            </p>

            <Eyebrow as="p" size="group" style={{ margin: "0 0 12px" }}>
              THE VISION
            </Eyebrow>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              A world where every organisation — from a ten-person professional
              services firm to a thousand-person manufacturing operation — has
              the operational structure to make decisions with confidence,
              enforce authority with clarity, and build institutional memory that
              outlasts any individual.
            </p>
          </div>
        </section>

        {/* ── Values ── */}
        <section
          style={{
            backgroundColor: "var(--color-bg)",
            padding: "80px 40px",
            position: "relative",
            overflow: "hidden",
            isolation: "isolate",
          }}
        >
          <SectionBackdrop src={SECTION_BACKDROPS.aboutValues} scrim="light" />
          <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto" }}>
            <Eyebrow as="p" style={{ textAlign: "center", margin: "0 0 32px" }}>
              OUR VALUES
            </Eyebrow>
            <div {...cardGridProps(VALUES.length, { max: 2 }, { gap: "20px" })}>
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  style={{
                    backgroundColor: "var(--color-white)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-card)",
                    padding: 24,
                  }}
                >
                  <p
                    style={{
                      color: "var(--color-text-primary)",
                      fontSize: "var(--text-xl)",
                      fontWeight: 600,
                      margin: "0 0 8px",
                    }}
                  >
                    {v.title}
                  </p>
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "var(--text-md)",
                      fontWeight: 400,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Join Us ── */}
        <section
          style={{
            backgroundColor: "var(--color-white)",
            padding: "80px 40px",
            position: "relative",
            overflow: "hidden",
            isolation: "isolate",
          }}
        >
          <SectionBackdrop src={SECTION_BACKDROPS.aboutJoinUs} scrim="light" />
          <div
            style={{
              maxWidth: "var(--measure)",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <SectionIntro
              reveal="none"
              eyebrow="JOIN THE TEAM"
              eyebrowStyle={{ margin: "0 0 16px" }}
              title={
                <>
                  We are building the team that will bring operational structure to
                  organisations everywhere.
                </>
              }
              titleStyle={{ fontSize: "var(--text-heading-md)", fontWeight: 400, lineHeight: 1.4, margin: "0 0 16px" }}
              lede={
                <>
                  No open roles right now — but we are always interested in
                  exceptional people. If you are passionate about building enterprise
                  software that solves real operational problems, we want to hear
                  from you.
                </>
              }
              ledeStyle={{ fontSize: "var(--text-lg)", fontWeight: 400, lineHeight: 1.7, margin: "0 0 24px" }}
            />
            <ButtonLink href={contactHref("careers")} variant="secondary" surface="light" size="sm">
              Get in touch
            </ButtonLink>
          </div>
        </section>

        {/* ── Contact ── */}
        <section
          style={{
            backgroundColor: "var(--color-navy-primary)",
            padding: "80px 40px",
            position: "relative",
            overflow: "hidden",
            isolation: "isolate",
          }}
        >
          <SectionBackdrop src={SECTION_BACKDROPS.aboutContact} scrim="dark" />
          <div
            style={{
              maxWidth: "var(--measure)",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                color: "var(--color-white)",
                fontSize: "var(--text-heading-lg)",
                fontWeight: 400,
                margin: "0 0 16px",
              }}
            >
              Get in touch
            </h2>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-lg)",
                fontWeight: 400,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Whether you have questions about {BRAND.name}, want to discuss how it
              can work for your organisation, or need support — we are here.
            </p>
            <Link
              href={contactHref()}
              style={{
                display: "inline-block",
                color: "var(--color-gold)",
                fontSize: "var(--text-xl)",
                fontWeight: 500,
                marginTop: 20,
                textDecoration: "none",
              }}
            >
              Start a conversation &rarr;
            </Link>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-sm)",
                fontWeight: 400,
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              {ENQUIRY_PROMISE}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
