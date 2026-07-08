"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Lock, Check, Zap, Globe } from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { AmbientGlow } from "@/components/ui/ambient-glow";

const trustSignals = [
  { icon: Globe, label: "Pan-African platform" },
  { icon: Lock, label: "Enterprise-grade security" },
  { icon: Zap, label: "Immutable audit trail" },
  { icon: Check, label: "Data protection compliant" },
];

export function CtaBanner() {
  return (
    <section
      style={{
        backgroundColor: "#0f172a",
        padding: "120px 40px",
        textAlign: "center",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow frames the CTA from behind. Two offset glows keep the
          motion asymmetric so the cycle never looks mechanical. */}
      <AmbientGlow top="-80px" left="20%" size={520} intensity={0.22} duration={38} />
      <AmbientGlow bottom="-60px" right="15%" size={480} intensity={0.18} duration={44} delay={0.5} />

      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Headline */}
        <m.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={fadeUpTransition}
          className="lg:!text-[42px]"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "36px",
            color: "#FFFFFF",
            lineHeight: 1.2,
            margin: "0 0 16px",
          }}
        >
          Your organisation&rsquo;s decisions deserve better than an email
          thread.
        </m.h2>

        {/* Subheadline */}
        <m.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(1)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "16px",
            color: "#64748b",
            lineHeight: 1.7,
            margin: "0 0 32px",
          }}
        >
          Join the organisations across Africa that have replaced paper,
          email, and assumption with structure, authority, and permanent record.
        </m.p>

        {/* CTAs */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(2)}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/trial"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "16px",
              backgroundColor: "var(--color-gold)",
              color: "#0f172a",
              border: "none",
              borderRadius: "9999px",
              height: "52px",
              padding: "0 32px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              cursor: "pointer",
              transition: "background-color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-gold-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-gold)";
            }}
          >
            Start your 14-day trial
          </Link>
          <Link
            href="/contact"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "16px",
              backgroundColor: "transparent",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "9999px",
              height: "48px",
              padding: "0 32px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              cursor: "pointer",
              transition: "border-color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            Contact us &rarr;
          </Link>
        </m.div>

        {/* Micro copy */}
        <m.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(3)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "13px",
            color: "#475569",
            marginTop: "20px",
          }}
        >
          14 days. No credit card required. Setup takes less than 10
          minutes &mdash; your first approval can happen today.
        </m.p>

        {/* Trust signals */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(4)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            marginTop: "32px",
          }}
        >
          {trustSignals.map(({ icon: Icon, label }) => (
            <span
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              <Icon size={14} color={BRAND_COLORS.gold} strokeWidth={2} />
              {label}
            </span>
          ))}
        </m.div>
      </div>
    </section>
  );
}
