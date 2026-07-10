"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Database, Landmark, MapPin } from "lucide-react";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { BRAND_COLORS } from "@/lib/brand";
import type { LucideIcon } from "lucide-react";

// Pre-launch, no customers yet — so no testimonials and no invented metrics.
// This section earns trust the honest way: verifiable architecture a security,
// finance, or audit reviewer can check for themselves.
const TRUST_PILLARS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Every action on an immutable record",
    body: "Submissions, approvals, queries, and signatures are written to a tamper-proof audit trail no user — not even an administrator — can alter or delete.",
  },
  {
    icon: Database,
    title: "Your data, isolated at the database",
    body: "Postgres row-level security enforces tenant isolation in the database itself, not just the application layer. Your organisation's records stay yours.",
  },
  {
    icon: Landmark,
    title: "We structure the approval — your bank moves the money",
    body: "Avrentis is a workflow tool, not a payment processor. Final money movement is handed to your licensed bank. Clear authority, clean separation of duties.",
  },
  {
    icon: MapPin,
    title: "Built for African finance teams",
    body: "Naira-first, with USD, GBP, and EUR for international payables — designed for how mid-market organisations here actually operate.",
  },
];

export function SocialProof() {
  return (
    <section style={{ backgroundColor: "#f1f5f9", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <SectionBackdrop src={SECTION_BACKDROPS.socialProof} scrim="light" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <m.span
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={fadeUpTransition}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--color-gold-on-light)",
            display: "block",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          WHY TEAMS TRUST AVRENTIS
        </m.span>

        {/* Headline */}
        <m.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(1)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "36px",
            color: "#0f172a",
            lineHeight: 1.3,
            margin: "0 auto 12px",
            textAlign: "center",
          }}
          className="lg:!text-[42px]"
        >
          Authority you can verify — down to the database.
        </m.h2>

        {/* Subheadline */}
        <m.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(2)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "16px",
            color: "#64748b",
            lineHeight: 1.7,
            margin: "0 auto 40px",
            maxWidth: "620px",
            textAlign: "center",
          }}
        >
          No fabricated metrics, no borrowed logos. Here is what actually protects
          your organisation&rsquo;s decisions — the things your security, finance,
          and audit teams can check for themselves.
        </m.p>

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
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 3)}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "28px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    flexShrink: 0,
                    borderRadius: "8px",
                    backgroundColor: "#0f172a",
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
                      color: "#0f172a",
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
                      color: "#64748b",
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
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(6)}
          style={{
            backgroundColor: "#0f172a",
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
                color: "#FFFFFF",
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
                color: "#94a3b8",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Work directly with the team building Avrentis and help shape what
              ships next. Honest about where we are — serious about where we&rsquo;re going.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/contact?intent=demo"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: "var(--color-gold)",
                color: "#0f172a",
                borderRadius: "6px",
                padding: "0 22px",
                height: "44px",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              Talk to us
            </Link>
            <Link
              href="/product/security"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "14px",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                padding: "0 22px",
                height: "44px",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              See the security stack →
            </Link>
          </div>
        </m.div>
      </div>
    </section>
  );
}
