"use client";

/**
 * TrustProductPage — the /trust centre. A single surface where an
 * enterprise reviewer finds the things they ask for in the procurement
 * cycle: controls framework alignment, sub-processor list, data
 * residency, DPA-on-request, responsible disclosure.
 *
 * Cross-links to /product/security for the deep technical detail and
 * /privacy + /terms for the legal documents. The goal is that a CISO
 * or procurement team can complete their security review without
 * needing to email sales first.
 */

import { useRef } from "react";
import Link from "next/link";
import { m, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  ScrollText,
  Lock,
  AlertOctagon,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { BRAND_COLORS, LEGAL_PAGES } from "@/lib/brand";
import { fadeUpOnScroll, fadeUpOnLoad } from "@/lib/animations";
import { DarkHeroBackdrop } from "@/components/ui/dark-hero-backdrop";
import { ButtonLink } from "@/components/ui/button";
import { SectionIntro } from "@/components/ui/section-intro";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CONTACT_EMAIL, SECURITY_TRIAGE_TIME } from "@/lib/contacts";
import { COMPLIANCE_FRAMEWORKS, complianceStatusLine } from "@/lib/compliance-posture";
import {
  DATA_RESIDENCY,
  DATA_RESIDENCY_SUMMARY,
  RESIDENCY_REQUEST_LINE,
  SUBPROCESSOR_CATEGORIES,
} from "@/lib/subprocessors";
import { contactHref } from "@/app/contact/tabs";
import { SITE_ROUTES } from "@/lib/routes";

const sans = "var(--font-sans)";
const mono = "'IBM Plex Mono', monospace";

const DOCUMENTS = [
  {
    icon: ShieldCheck,
    title: "Security overview",
    body: "The full posture — tenant isolation, role and request-level authority, session integrity, audit, encryption.",
    cta: { label: "Read the stack", href: LEGAL_PAGES.security },
  },
  {
    icon: Lock,
    title: "Data Processing Agreement",
    body: "GDPR + UK GDPR-aligned DPA with standard contractual clauses. Signable as-is or negotiated for enterprise.",
    cta: { label: "Request the DPA", href: contactHref("security") },
  },
  {
    icon: FileText,
    title: "Privacy policy",
    body: "What we collect, why, how long we keep it, and your rights as a data subject.",
    cta: { label: "Read the policy", href: LEGAL_PAGES.privacy },
  },
  {
    icon: ScrollText,
    title: "Terms of service",
    body: "Service description, acceptable use, data ownership, liability, termination.",
    cta: { label: "Read the terms", href: LEGAL_PAGES.terms },
  },
  {
    icon: AlertOctagon,
    title: "Responsible disclosure",
    body: `Report security issues to ${CONTACT_EMAIL.security}. We triage ${SECURITY_TRIAGE_TIME}.`,
    cta: { label: "Report a vulnerability", href: contactHref("disclosure") },
  },
  {
    icon: MapPin,
    title: "Data residency",
    body: `Primary data in the ${DATA_RESIDENCY.primary} today. Need it to stay in a specific country or region? Talk to us.`,
    cta: { label: "Talk to us about residency", href: contactHref("security") },
  },
];

export function TrustProductPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <>
      <Navbar />
      <main id="main">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          backgroundColor: "var(--color-navy-primary)",
          padding: "120px 40px 96px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.trustHero} scrim="dark" />
        <DarkHeroBackdrop glows="hero" grid gridY={gridY} />
        <div style={{ maxWidth: "880px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <SectionIntro
            surface="dark"
            reveal="load"
            titleAs="h1"
            eyebrow="TRUST CENTRE"
            eyebrowStyle={{ display: "inline-block", marginBottom: "20px" }}
            title="Where the controls live."
            titleStyle={{ fontWeight: 700, fontSize: "36px", lineHeight: 1.15, margin: "0 0 24px" }}
            titleClassName="lg:!text-[56px]"
            lede={
              <>
                Everything your security, legal, or procurement team usually asks for,
                on one page: the standards we hold ourselves to, the companies we
                work with to run the service, where your data lives, how to sign
                a data-protection agreement, and how to report a vulnerability.
                Honest and straight to the point.
              </>
            }
            ledeStyle={{
              fontSize: "17px",
              color: "var(--color-text-subtle)",
              lineHeight: 1.7,
              margin: "0 auto 32px",
              maxWidth: "640px",
            }}
          />
          <m.div
            {...fadeUpOnLoad(3)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <ButtonLink href={contactHref("security")}>Request a DPA or security review</ButtonLink>
            <ButtonLink href={LEGAL_PAGES.security} variant="secondary" surface="dark">
              Read the security stack →
            </ButtonLink>
          </m.div>
        </div>
      </section>

      {/* ── FRAMEWORKS ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.trustFrameworks} scrim="light" />
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionIntro
            eyebrow="FRAMEWORKS WE ALIGN TO"
            eyebrowStyle={{ marginBottom: "12px" }}
            title={<>We don&rsquo;t hold certifications today. Here&rsquo;s what we do.</>}
            titleStyle={{
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1.2,
              margin: "0 0 14px",
              maxWidth: "640px",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-[38px]"
            lede={
              <>
                Avrentis has not yet completed a SOC 2 or ISO 27001 audit. Our
                policies follow SOC 2 structure, and we&rsquo;re transparent about
                where we are with each framework.
              </>
            }
            ledeStyle={{ fontSize: "15px", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "640px" }}
          />

          {/* Wrapping flex: every row's cards grow to fill it, whatever the count. */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {COMPLIANCE_FRAMEWORKS.map((f, i) => (
              <m.div
                key={f.name}
                {...fadeUpOnScroll(i + 3)}
                style={{
                  flex: "1 1 300px",
                  backgroundColor: "var(--color-bg-light)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "10px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: "16px", color: "var(--color-text-primary)", margin: 0 }}>
                    {f.name}
                  </h3>
                  <CheckCircle2 size={16} color={BRAND_COLORS.gold} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-gold-on-light)",
                  }}
                >
                  {complianceStatusLine(f)}
                </span>
                <p style={{ fontFamily: sans, fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.65, margin: 0 }}>
                  {f.body}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUB-PROCESSORS ─────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-bg)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.trustSubprocessors} scrim="light" />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionIntro
            eyebrow="SUB-PROCESSORS"
            eyebrowStyle={{ marginBottom: "12px" }}
            title={<>The providers that help us run the service.</>}
            titleStyle={{
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1.2,
              margin: "0 0 14px",
              maxWidth: "640px",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-[38px]"
            lede={
              <>
                We engage established infrastructure providers and limit each to
                the data it needs to perform its function. We notify customers of
                new sub-processors before onboarding them where we have that
                obligation under your contract.
              </>
            }
            ledeStyle={{ fontSize: "15px", lineHeight: 1.7, margin: "0 0 32px", maxWidth: "640px" }}
          />

          <m.div
            {...fadeUpOnScroll(3)}
            style={{
              backgroundColor: "var(--color-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 1.5fr",
                padding: "14px 20px",
                backgroundColor: "var(--color-bg-light)",
                borderBottom: "1px solid var(--color-border)",
                gap: "14px",
              }}
            >
              {["Category", "Region"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {SUBPROCESSOR_CATEGORIES.map((sp, i) => (
              <div
                key={sp.purpose}
                style={{
                  display: "grid",
                  gridTemplateColumns: "3fr 1.5fr",
                  padding: "14px 20px",
                  borderTop: i === 0 ? "none" : "1px solid var(--color-bg)",
                  gap: "14px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontFamily: sans, fontSize: "13px", color: "var(--color-text-primary)", lineHeight: 1.5 }}>
                  {sp.purpose}
                </span>
                <span style={{ fontFamily: sans, fontSize: "13px", color: "var(--color-text-muted)" }}>{sp.region}</span>
              </div>
            ))}
          </m.div>

          <m.div
            {...fadeUpOnScroll(4)}
            style={{
              marginTop: "24px",
              padding: "22px 26px",
              backgroundColor: "var(--color-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontFamily: sans, fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>
                Need the named vendor list?
              </div>
              <div style={{ fontFamily: sans, fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                The specific providers in each category — and any changes — are
                shared with prospective customers on request, typically
                alongside a Data Processing Agreement.
              </div>
            </div>
            <ButtonLink href={contactHref("privacy")} size="sm" style={{ flexShrink: 0 }}>
              Request the list
            </ButtonLink>
          </m.div>

          <m.p
            {...fadeUpOnScroll(5)}
            style={{
              fontFamily: sans,
              fontSize: "13px",
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              margin: "16px 0 0",
            }}
          >
            Subscribe to sub-processor change notifications through our{" "}
            <Link href={contactHref("subscribe")} style={{ color: "var(--color-gold-on-light)", textDecoration: "none" }}>
              update subscription form
            </Link>
            .
          </m.p>
        </div>
      </section>

      {/* ── DOCUMENTS ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.trustDocuments} scrim="light" />
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionIntro
            eyebrow="DOCUMENTS &amp; DIRECT LINES"
            eyebrowStyle={{ marginBottom: "12px" }}
            title={<>What to read and who to email.</>}
            titleStyle={{
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1.2,
              margin: "0 0 40px",
              maxWidth: "640px",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-[38px]"
          />

          <div style={{ display: "grid", gap: "16px" }} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {DOCUMENTS.map((d, i) => {
              const Icon = d.icon;
              const isExternal = d.cta.href.startsWith("mailto:");
              return (
                <m.div
                  key={d.title}
                  {...fadeUpOnScroll(i + 2)}
                  style={{
                    backgroundColor: "var(--color-bg-light)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "10px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
                  </div>
                  <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: "16px", color: "var(--color-text-primary)", margin: "4px 0 0" }}>
                    {d.title}
                  </h3>
                  <p style={{ fontFamily: sans, fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.65, margin: 0, flex: 1 }}>
                    {d.body}
                  </p>
                  {isExternal ? (
                    <a
                      href={d.cta.href}
                      style={{
                        fontFamily: sans,
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--color-gold-on-light)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "6px",
                      }}
                    >
                      {d.cta.label}
                      <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      href={d.cta.href}
                      style={{
                        fontFamily: sans,
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--color-gold-on-light)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "6px",
                      }}
                    >
                      {d.cta.label}
                      <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
                    </Link>
                  )}
                </m.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DATA RESIDENCY ─────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-bg)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.trustDataResidency} scrim="light" />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionIntro
            eyebrow="DATA RESIDENCY"
            eyebrowStyle={{ marginBottom: "12px" }}
            title={<>Where your data lives.</>}
            titleStyle={{
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1.2,
              margin: "0 0 14px",
              maxWidth: "640px",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-[38px]"
            lede={
              <>
                Residency matters for regulated organisations and for customers
                whose policies require data to stay in a specific jurisdiction.
                Here is the honest picture.
              </>
            }
            ledeStyle={{ fontSize: "15px", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "680px" }}
          />

          <div style={{ display: "grid", gap: "20px" }} className="grid-cols-1 md:grid-cols-2">
            {[
              {
                label: "Today · default",
                title: DATA_RESIDENCY.primary,
                body: `${DATA_RESIDENCY_SUMMARY} The categories are listed below.`,
              },
              {
                label: "Other regions",
                title: "Need your data somewhere else?",
                body: RESIDENCY_REQUEST_LINE,
              },
            ].map((r, i) => (
              <m.div
                key={r.title}
                {...fadeUpOnScroll(i + 3)}
                style={{
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "10px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-gold-on-light)",
                  }}
                >
                  {r.label}
                </span>
                <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: "17px", color: "var(--color-text-primary)", margin: "2px 0 0" }}>
                  {r.title}
                </h3>
                <p style={{ fontFamily: sans, fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.65, margin: 0 }}>
                  {r.body}
                </p>
              </m.div>
            ))}
          </div>

          <m.div
            {...fadeUpOnScroll(6)}
            style={{
              marginTop: "28px",
              padding: "20px 24px",
              backgroundColor: "var(--color-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "10px",
              fontFamily: sans,
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "var(--color-text-primary)" }}>Cross-border transfers.</strong>{" "}
            Where personal data moves between regions, we rely on Standard
            Contractual Clauses (SCCs) and equivalent mechanisms recognised
            under applicable law. Our DPA sets out these terms in full.
          </m.div>
        </div>
      </section>

      {/* ── STATUS + CONTACT ───────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-navy-primary)",
          padding: "100px 40px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.trustStatusContact} scrim="dark" />
        <DarkHeroBackdrop glows="closing" />

        <div style={{ maxWidth: "880px", margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
          <SectionIntro
            surface="dark"
            eyebrow="OPERATIONAL TRANSPARENCY"
            eyebrowStyle={{ display: "inline-block", marginBottom: "16px" }}
            title="All systems operational."
            titleStyle={{ fontWeight: 400, fontSize: "30px", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "0.01em" }}
            titleClassName="lg:!text-[36px]"
            lede={
              <>
                Current subsystem status is published on the status page, with
                incident history as it accrues. Enterprise customers receive
                incident notifications under their order form; email to be added
                to the general notification list.
              </>
            }
            ledeStyle={{
              fontSize: "15px",
              color: "var(--color-text-subtle)",
              lineHeight: 1.7,
              margin: "0 auto 28px",
              maxWidth: "600px",
            }}
          />
          <m.div
            {...fadeUpOnScroll(3)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <ButtonLink href={SITE_ROUTES.status}>Open the status page</ButtonLink>
            <ButtonLink href={contactHref("security")} variant="secondary" surface="dark">
              Talk to our team →
            </ButtonLink>
          </m.div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
