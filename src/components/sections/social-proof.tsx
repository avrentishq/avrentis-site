"use client";

import { m } from "framer-motion";
import { ShieldCheck, Database, Landmark, MapPin } from "lucide-react";
import { fadeUpOnScroll } from "@/lib/animations";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SectionIntro } from "@/components/ui/section-intro";
import { ButtonLink } from "@/components/ui/button";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { BRAND_COLORS, LEGAL_PAGES } from "@/lib/brand";
import type { LucideIcon } from "lucide-react";
import { contactHref } from "@/app/contact/tabs";
import { INTERFACE_LANGUAGE_NAMES, SUPPORTED_CURRENCY_COUNT } from "@/lib/languages-and-currencies";
import { TRAIL_SEALED } from "@/lib/record-keeping";

// No testimonials and no invented metrics — the section states what the
// platform enforces, which is verifiable, rather than borrowed credibility.
// This section earns trust the honest way: verifiable architecture a security,
// finance, or audit reviewer can check for themselves.
const TRUST_PILLARS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Every action on a tamper-evident record",
    body: `Submissions, approvals, queries, and signatures are written to a tamper-evident audit trail, ${TRAIL_SEALED}. No user — not even an administrator — can edit or remove an entry, and you can check the seal yourself.`,
  },
  {
    icon: Database,
    title: "Your data, isolated at the database",
    body: "Tenant isolation is enforced by the database itself, not just the application layer. Your organisation's records stay yours.",
  },
  {
    icon: Landmark,
    title: "We govern the authority to pay — your bank moves the money",
    body: "Avrentis governs who is allowed to approve a payment, and proves it. Your licensed bank moves the money. That clean separation — clear authority on our side, settlement on theirs — is the point.",
  },
  {
    icon: MapPin,
    title: "Built for African finance teams",
    body: `Naira-first, with documents in ${SUPPORTED_CURRENCY_COUNT} currencies for regional and international payables, and an interface in ${INTERFACE_LANGUAGE_NAMES} — designed for how mid-market organisations here actually operate.`,
  },
];

export function SocialProof() {
  return (
    <section style={{ backgroundColor: "var(--color-bg)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <SectionBackdrop src={SECTION_BACKDROPS.socialProof} scrim="light" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionIntro
          align="center"
          eyebrow="WHY TEAMS TRUST AVRENTIS"
          eyebrowStyle={{ marginBottom: "16px" }}
          title="Authority you can verify — down to the database."
          titleStyle={{ fontWeight: 400, fontSize: "36px", lineHeight: 1.3, margin: "0 auto 12px" }}
          titleClassName="lg:!text-[42px]"
          lede={
            <>
              No fabricated metrics, no borrowed logos. Here is what actually protects
              your organisation&rsquo;s decisions — the things your security, finance,
              and audit teams can check for themselves.
            </>
          }
          ledeStyle={{
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: 1.7,
            margin: "0 auto 40px",
            maxWidth: "620px",
          }}
        />

        {/* Trust pillars */}
        <div
          style={{ display: "grid", gap: "20px", marginBottom: "40px" }}
          className="grid-cols-1 md:grid-cols-2"
        >
          {TRUST_PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <m.div
                key={pillar.title}
                {...fadeUpOnScroll(i + 3)}
                style={{
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  padding: "28px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  boxShadow: "0 2px 8px rgba(var(--color-shadow-rgb), 0.04)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    flexShrink: 0,
                    borderRadius: "8px",
                    backgroundColor: "var(--color-navy-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} strokeWidth={1.6} color={BRAND_COLORS.gold} aria-hidden="true" />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "17px",
                      color: "var(--color-text-primary)",
                      margin: "0 0 6px",
                      lineHeight: 1.35,
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 400,
                      fontSize: "14px",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {pillar.body}
                  </p>
                </div>
              </m.div>
            );
          })}
        </div>

        {/* Founding-partner band — honest, in place of customer proof */}
        <m.div
          {...fadeUpOnScroll(6)}
          style={{
            backgroundColor: "var(--color-navy-primary)",
            borderRadius: "10px",
            padding: "32px",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: "640px" }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "18px",
                color: "var(--color-white)",
                margin: "0 0 6px",
                lineHeight: 1.4,
              }}
            >
              We&rsquo;re onboarding a small group of founding customers.
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "14px",
                color: "var(--color-text-subtle)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Work directly with the team building Avrentis and help shape what
              ships next. Honest about where we are — serious about where we&rsquo;re going.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <ButtonLink href={contactHref("demo")}>Talk to us</ButtonLink>
            <ButtonLink href={LEGAL_PAGES.security} variant="secondary" surface="dark">
              See the security stack →
            </ButtonLink>
          </div>
        </m.div>
      </div>
    </section>
  );
}
