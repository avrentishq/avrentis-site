"use client";

/**
 * CustomersProductPage — the /customers page. No invented logos and no
 * invented testimonials: it surfaces the industries the platform is built
 * for, the operational patterns it addresses, and the launch-partner
 * programme, in place of a traditional logo wall.
 */

import { useRef } from "react";
import Link from "next/link";
import { m, useScroll, useTransform } from "framer-motion";
import {
  Landmark,
  Building2,
  HeartPulse,
  GraduationCap,
  Factory,
  Leaf,
  Users,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { fadeUpOnScroll, fadeUpOnLoad } from "@/lib/animations";
import { DarkHeroBackdrop } from "@/components/ui/dark-hero-backdrop";
import { ButtonLink } from "@/components/ui/button";
import { SectionIntro } from "@/components/ui/section-intro";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { contactHref } from "@/app/contact/tabs";
import { SITE_ROUTES } from "@/lib/routes";
import { Z_INDEX } from "@/lib/layers";
import { cardGridProps } from "@/lib/card-grid";
import { BRAND } from "@/lib/brand";


const INDUSTRIES = [
  {
    icon: Landmark,
    title: "NGOs & non-profits",
    body:
      "Grant-funded teams with strict donor reporting, multi-signatory approvals, and field-office spend that must be traceable back to the funding line.",
  },
  {
    icon: Building2,
    title: "SME & mid-market organisations",
    body:
      "Growing teams that have outgrown email approvals but aren't ready for six-figure ERP implementations — and shouldn't need to be.",
  },
  {
    icon: Factory,
    title: "Manufacturing & logistics",
    body:
      "Purchase orders that fund production, bank letters that pay suppliers, HOD-level authority that keeps the line running.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare & pharma",
    body:
      "Regulated procurement with mandatory audit, separation of duties between clinical and finance leadership, and vendor qualification workflows.",
  },
  {
    icon: GraduationCap,
    title: "Education & academic institutions",
    body:
      "Multi-department budgets, board-level sign-off on capital projects, and auditor access for annual financial reviews.",
  },
  {
    icon: Leaf,
    title: "Energy, agri & extractives",
    body:
      "Remote operations where approvers work across time zones and a paper voucher signed in a field office can't reliably make it back to HQ.",
  },
];

const PATTERNS = [
  {
    title: "Approvals that live in email chains",
    body:
      "Five-way reply-alls with PDFs attached, approvals given in one-liners, the actual decision buried somewhere in the middle of the thread.",
  },
  {
    title: "Signatures scanned, printed, re-scanned",
    body:
      "A wet signature travels through photocopiers, WhatsApp, and email — eventually arriving in a form the bank will accept, usually the day after the deadline.",
  },
  {
    title: "Audits that trigger an archaeology expedition",
    body:
      "When the external auditor asks for the approval trail of a specific voucher from 11 months ago, finance spends a week reconstructing what actually happened.",
  },
  {
    title: "Delegation without deletion of accountability",
    body:
      "The MD is out of office. Someone needs to sign now. The only options are wait, delegate informally by phone, or forge the signature — and the record doesn't reflect reality either way.",
  },
];

const PARTNER_BENEFITS = [
  {
    title: "Founder-level attention",
    body:
      "You get direct access to the team building the product. Your feedback shapes what ships in the next cycle.",
  },
  {
    title: "Pricing locked at launch terms",
    body:
      "Launch partners keep the pricing tier they joined at for the lifetime of the engagement, even as list pricing evolves.",
  },
  {
    title: "Dedicated onboarding & migration",
    body:
      "We walk your team through rolling off paper or email, mapping your approval chains, importing historical data, and training approvers.",
  },
  {
    title: "Priority on the roadmap",
    body:
      "Integrations your organisation needs, reports your auditor asks for, localisation for your jurisdiction — launch partners get first priority.",
  },
];

export function CustomersProductPage() {
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
        <SectionBackdrop src={SECTION_BACKDROPS.customersHero} scrim="dark" />
        <DarkHeroBackdrop glows="hero" grid gridY={gridY} />
        <div style={{ maxWidth: "var(--measure-wide)", margin: "0 auto", textAlign: "center", position: "relative", zIndex: Z_INDEX.content }}>
          <SectionIntro
            surface="dark"
            reveal="load"
            titleAs="h1"
            eyebrow="CUSTOMERS"
            eyebrowStyle={{ display: "inline-block", marginBottom: "20px" }}
            title="Organisations that chose structure over speed."
            titleStyle={{ fontWeight: 700, fontSize: "var(--text-display-xs)", lineHeight: 1.15, margin: "0 0 24px" }}
            titleClassName="lg:!text-display-4xl"
            lede={
              <>
                {BRAND.name} is early. Rather than claim credit for logos we
                haven&rsquo;t yet earned, here&rsquo;s an honest picture of who
                we&rsquo;re built for, the patterns we hear in every discovery
                call, and how our launch-partner programme works.
              </>
            }
            ledeStyle={{
              fontSize: "var(--text-2xl)",
              color: "var(--color-text-subtle)",
              lineHeight: 1.7,
              margin: "0 auto 32px",
              maxWidth: "var(--measure)",
            }}
          />
          <m.div
            {...fadeUpOnLoad(3)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <ButtonLink href={contactHref()}>Contact us</ButtonLink>
            <ButtonLink href="#launch-partners" variant="secondary" surface="dark">
              About the launch programme →
            </ButtonLink>
          </m.div>
        </div>
      </section>

      {/* ── INDUSTRIES ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.customersIndustries} scrim="light" />
        <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto" }}>
          <SectionIntro
            eyebrow="WHO WE BUILT THIS FOR"
            eyebrowStyle={{ marginBottom: "12px" }}
            title={<>Six organisation types. One common problem.</>}
            titleStyle={{
              fontWeight: 400,
              fontSize: "var(--text-heading-2xl)",
              lineHeight: 1.2,
              margin: "0 0 14px",
              maxWidth: "var(--measure)",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-display-sm"
            lede={
              <>
                {BRAND.name} is deliberately narrow. We serve organisations where
                approval chains matter, audit trails are non-negotiable, and
                authority cannot be left to email.
              </>
            }
            ledeStyle={{ fontSize: "var(--text-lg)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "var(--measure)" }}
          />

          <div {...cardGridProps(INDUSTRIES.length, { max: 3 }, { gap: "20px" })}>
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <m.div
                  key={ind.title}
                  {...fadeUpOnScroll(i + 3)}
                  style={{
                    backgroundColor: "var(--color-bg-light)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-gold-tint)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.8} color="var(--color-gold)" aria-hidden="true" />
                  </div>
                  <h3 style={{ fontWeight: 600, fontSize: "var(--text-2xl)", color: "var(--color-text-primary)", margin: "4px 0 0" }}>
                    {ind.title}
                  </h3>
                  <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-muted)", lineHeight: 1.65, margin: 0 }}>
                    {ind.body}
                  </p>
                </m.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMMON PATTERNS ────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-bg)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.customersPatterns} scrim="light" />
        <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto" }}>
          <SectionIntro
            eyebrow="WHAT WE HEAR, OVER AND OVER"
            eyebrowStyle={{ marginBottom: "12px" }}
            title={<>The same four problems, in every discovery call.</>}
            titleStyle={{
              fontWeight: 400,
              fontSize: "var(--text-heading-2xl)",
              lineHeight: 1.2,
              margin: "0 0 14px",
              maxWidth: "var(--measure)",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-display-sm"
            lede={
              <>
                We&rsquo;ve sat through dozens of conversations with finance leads,
                HODs, MDs, and internal auditors. The details change; the shape of
                the problem does not.
              </>
            }
            ledeStyle={{ fontSize: "var(--text-lg)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "var(--measure)" }}
          />

          <div {...cardGridProps(PATTERNS.length, { max: 2 }, { gap: "16px" })}>
            {PATTERNS.map((p, i) => (
              <m.div
                key={p.title}
                {...fadeUpOnScroll(i + 3)}
                style={{
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <h3 style={{ fontWeight: 600, fontSize: "var(--text-xl)", color: "var(--color-text-primary)", margin: 0 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-muted)", lineHeight: 1.65, margin: 0 }}>
                  {p.body}
                </p>
              </m.div>
            ))}
          </div>

          <m.p
            {...fadeUpOnScroll(PATTERNS.length + 3)}
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              margin: "28px 0 0",
              fontStyle: "italic",
            }}
          >
            These are not quotes. They&rsquo;re the composite of patterns we
            hear in discovery calls. Real customer stories, with names, will
            live on this page as our launch partners publish them.
          </m.p>
        </div>
      </section>

      {/* ── LAUNCH PARTNERS ────────────────────────────────── */}
      <section
        id="launch-partners"
        style={{
          backgroundColor: "var(--color-white)",
          padding: "120px 40px",
          scrollMarginTop: "80px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.customersLaunchPartners} scrim="light" />
        <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto" }}>
          <div style={{ display: "grid", gap: "48px", alignItems: "start" }} className="grid-cols-1 lg:grid-cols-2">
            <m.div
              {...fadeUpOnScroll()}
            >
              <SectionIntro
                reveal="none"
                eyebrow="LAUNCH PARTNER PROGRAMME"
                eyebrowStyle={{ marginBottom: "12px" }}
                title="Shape the platform. Keep your pricing."
                titleStyle={{ fontWeight: 400, fontSize: "var(--text-heading-2xl)", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "0.01em" }}
                titleClassName="lg:!text-display-sm"
                lede={
                  <>
                    We&rsquo;re running a small cohort of launch partners through
                    2026. These are organisations that help us prove the platform
                    in production — and in return, keep a direct line to the team,
                    locked pricing, and priority on the roadmap.
                  </>
                }
                ledeStyle={{ fontSize: "var(--text-lg)", lineHeight: 1.75, margin: "0 0 20px" }}
              />
              <p
                style={{
                  fontSize: "var(--text-md)",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.7,
                  margin: "0 0 24px",
                  borderLeft: "2px solid var(--color-gold-border)",
                  paddingLeft: "14px",
                }}
              >
                Cohort is intentionally small. If you&rsquo;re an operations,
                finance, or audit leader looking at a six-figure ERP evaluation
                and wondering whether a focused tool would do the job faster,
                this is the route.
              </p>
              <ButtonLink href={contactHref("demo")}>
                Apply to the launch cohort
                <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
              </ButtonLink>
            </m.div>

            <m.div
              {...fadeUpOnScroll(1)}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {PARTNER_BENEFITS.map((b, i) => (
                <m.div
                  key={b.title}
                  {...fadeUpOnScroll(i + 2)}
                  style={{
                    backgroundColor: "var(--color-bg-light)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-card)",
                    padding: "18px 20px",
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "var(--radius-circle)",
                      backgroundColor: "var(--color-gold-tint)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <Check size={14} color="var(--color-gold)" strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: "var(--text-lg)", color: "var(--color-text-primary)", margin: "0 0 4px" }}>
                      {b.title}
                    </h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.6, margin: 0 }}>
                      {b.body}
                    </p>
                  </div>
                </m.div>
              ))}
            </m.div>
          </div>
        </div>
      </section>

      {/* ── COMING SOON: STORIES ───────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-bg)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.customersStories} scrim="light" />
        <div style={{ maxWidth: "var(--measure-wide)", margin: "0 auto", textAlign: "center" }}>
          <m.div
            {...fadeUpOnScroll()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--color-gold-on-light)",
              backgroundColor: "var(--color-gold-tint)",
              border: "1px solid var(--color-gold-divider)",
              borderRadius: "var(--radius-3xl)",
              padding: "6px 14px",
              marginBottom: "20px",
            }}
          >
            <Sparkles size={14} strokeWidth={1.8} aria-hidden="true" />
            Partner stories — in progress
          </m.div>
          <m.h2
            {...fadeUpOnScroll(1)}
            style={{
              fontWeight: 400,
              fontSize: "var(--text-heading-lg)",
              color: "var(--color-text-primary)",
              lineHeight: 1.3,
              margin: "0 0 16px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-heading-2xl"
          >
            Real numbers. Real names. Soon.
          </m.h2>
          <m.p
            {...fadeUpOnScroll(2)}
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text-muted)",
              lineHeight: 1.75,
              margin: "0 auto 28px",
              maxWidth: "var(--measure-narrow)",
            }}
          >
            Our earliest partners are onboarding now. The case studies we
            publish here will be signed off by real operators — with the
            metrics that matter to them — not marketing boilerplate.
          </m.p>
          <m.div
            {...fadeUpOnScroll(3)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <ButtonLink href={contactHref("demo")}>Become a launch partner</ButtonLink>
            <ButtonLink href={SITE_ROUTES.howItWorks} variant="secondary" surface="light">
              See how {BRAND.name} works →
            </ButtonLink>
          </m.div>
        </div>
      </section>

      {/* ── QUIET FOOTER BAND ──────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-white)",
          padding: "80px 40px",
          borderTop: "1px solid var(--color-border)",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.customersFooterBand} scrim="light" />
        <div style={{ maxWidth: "var(--measure-wide)", margin: "0 auto" }}>
          <m.div
            {...fadeUpOnScroll()}
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            <Users size={20} color="var(--color-gold)" strokeWidth={1.8} aria-hidden="true" style={{ flexShrink: 0, marginTop: "4px" }} />
            <div>
              <h3
                style={{
                  fontWeight: 600,
                  fontSize: "var(--text-xl)",
                  color: "var(--color-text-primary)",
                  margin: "0 0 6px",
                }}
              >
                Already reviewing {BRAND.name} inside your organisation?
              </h3>
              <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-muted)", lineHeight: 1.7, margin: "0 0 12px" }}>
                We share a security review pack, a draft DPA, and a tailored
                rollout plan for any team that asks. No gating, no pretend
                wait-times.
              </p>
              <Link
                href={contactHref("security")}
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--color-gold-on-light)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Request the review pack <ArrowRight size={13} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </div>
          </m.div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
