"use client";

/**
 * ProductModuleLayout — shared template for every Avrentis module product
 * page (Pay / Procurement / Records / Audit / HR / Integrations). Each page passes
 * a `ModuleConfig` and the layout handles hero, pillars, platform preview,
 * use cases, plan availability, and related modules in a consistent shell.
 *
 * Visual language follows the landing page:
 *   - Dark navy hero with ambient glows + scroll-parallax grid
 *   - Browser-framed real-UI preview
 *   - Light content sections with fade-up entrance
 */

import { useRef } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/sections/cta-banner";

export type ModuleStatus = "available" | "coming_soon" | "partial" | "roadmap";

export interface ModulePillar {
  icon: LucideIcon;
  title: string;
  body: string;
}

export interface ModuleUseCase {
  title: string;
  body: string;
}

export interface ModulePlan {
  plan: string;
  included: boolean;
  note?: string;
}

export interface ModuleRelated {
  slug: string;
  name: string;
  desc: string;
}

export interface ModuleConfig {
  slug: string;
  eyebrow: string;
  headline: string;
  description: string;
  status: ModuleStatus;
  /** Small caption above the preview frame, e.g. `app.avrentis.com / vouchers / PV-2026-0184`. */
  previewUrl: string;
  /** React node for the browser-frame preview. Rendered inside a `MockupShell`-style container. */
  preview: React.ReactNode;
  pillars: ModulePillar[];
  useCases: ModuleUseCase[];
  planAvailability: ModulePlan[];
  relatedModules: ModuleRelated[];
  /** Overrides the default CTA based on status. */
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

function StatusRibbon({ status }: { status: ModuleStatus }) {
  const config: Record<ModuleStatus, { label: string; bg: string; color: string; border: string }> = {
    available: {
      label: "Available now",
      bg: "rgba(39,174,96,0.12)",
      color: "#34D399",
      border: "1px solid rgba(39,174,96,0.3)",
    },
    coming_soon: {
      label: "Coming soon",
      bg: "rgba(198,139,47,0.12)",
      color: "#C68B2F",
      border: "1px solid rgba(198,139,47,0.3)",
    },
    partial: {
      label: "Currently in beta",
      bg: "rgba(198,139,47,0.12)",
      color: "#C68B2F",
      border: "1px solid rgba(198,139,47,0.3)",
    },
    roadmap: {
      label: "On the roadmap",
      bg: "rgba(148,163,184,0.10)",
      color: "#94a3b8",
      border: "1px solid rgba(148,163,184,0.25)",
    },
  };
  const c = config[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-sans)",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: c.color,
        backgroundColor: c.bg,
        border: c.border,
        borderRadius: "3px",
        padding: "4px 10px",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: c.color,
          display: "inline-block",
        }}
      />
      {c.label}
    </span>
  );
}

function resolveCtas(config: ModuleConfig): {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
} {
  if (config.primaryCta && config.secondaryCta) {
    return { primary: config.primaryCta, secondary: config.secondaryCta };
  }
  switch (config.status) {
    case "available":
      return {
        primary: config.primaryCta ?? { label: "Start your 14-day trial", href: "/trial" },
        secondary: config.secondaryCta ?? { label: "See how it works", href: "/product/how-it-works" },
      };
    case "coming_soon":
      return {
        primary: config.primaryCta ?? { label: "Get notified at launch", href: "/contact?intent=notify" },
        secondary: config.secondaryCta ?? { label: "See the full roadmap", href: "/contact?intent=roadmap" },
      };
    case "partial":
      return {
        primary: config.primaryCta ?? { label: "Join the beta", href: "/contact?intent=beta" },
        secondary: config.secondaryCta ?? { label: "Talk to us", href: "/contact" },
      };
    case "roadmap":
      return {
        primary: config.primaryCta ?? { label: "Share your use case", href: "/contact?intent=roadmap" },
        secondary: config.secondaryCta ?? { label: "Talk to us", href: "/contact" },
      };
  }
}

export function ProductModuleLayout({ config }: { config: ModuleConfig }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const { primary, secondary } = resolveCtas(config);

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          backgroundColor: "#0f172a",
          padding: "120px 40px 96px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AmbientGlow top="-120px" left="-100px" size={520} intensity={0.22} duration={32} />
        <AmbientGlow bottom="-140px" right="-80px" size={560} intensity={0.18} duration={38} delay={0.5} />

        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            y: gridY,
            zIndex: 1,
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gap: "56px",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
          }}
          className="grid-cols-1 lg:grid-cols-[1fr_minmax(0,1.1fr)]"
        >
          {/* Left: copy */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <motion.span
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={fadeUpTransition}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#C68B2F",
              }}
            >
              {config.eyebrow}
            </motion.span>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(1)}
            >
              <StatusRibbon status={config.status} />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(2)}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "34px",
                color: "#FFFFFF",
                lineHeight: 1.15,
                margin: 0,
              }}
              className="lg:!text-[48px]"
            >
              {config.headline}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(3)}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "17px",
                color: "#94a3b8",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: "480px",
              }}
            >
              {config.description}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(4)}
              style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}
            >
              <Link
                href={primary.href}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "14px",
                  backgroundColor: "#C68B2F",
                  color: "#0f172a",
                  borderRadius: "6px",
                  padding: "0 22px",
                  height: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                {primary.label}
              </Link>
              <Link
                href={secondary.href}
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
                {secondary.label} →
              </Link>
            </motion.div>
          </div>

          {/* Right: preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ...fadeUpTransition, delay: 0.3 }}
          >
            <div
              style={{
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.10)",
                backgroundColor: "#F8FAFC",
                boxShadow: "0 0 60px rgba(198,139,47,0.06), 0 30px 60px rgba(0,0,0,0.45)",
                overflow: "hidden",
              }}
            >
              {/* Browser chrome */}
              <div
                style={{
                  backgroundColor: "#0f172a",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ display: "flex", gap: "6px" }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.15)",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    borderRadius: "5px",
                    padding: "4px 10px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    color: "#94a3b8",
                    textAlign: "center",
                  }}
                >
                  {config.previewUrl}
                </div>
              </div>
              <div>{config.preview}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PILLARS ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.span
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
              color: "#C68B2F",
              display: "block",
              marginBottom: "12px",
            }}
          >
            CAPABILITIES
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 48px",
              maxWidth: "560px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            What this module does for your organisation.
          </motion.h2>

          <div
            style={{ display: "grid", gap: "20px" }}
            className="grid-cols-1 md:grid-cols-2"
          >
            {config.pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={staggerDelay(i + 2)}
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
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
                      borderRadius: "6px",
                      backgroundColor: "rgba(198,139,47,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.8} color="#C68B2F" aria-hidden="true" />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "18px",
                      color: "#0f172a",
                      margin: "4px 0 0",
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      color: "#64748b",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {pillar.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f1f5f9", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.span
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
              color: "#C68B2F",
              display: "block",
              marginBottom: "12px",
            }}
          >
            OUTCOMES
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 48px",
              maxWidth: "560px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            What changes operationally.
          </motion.h2>

          <div style={{ display: "grid", gap: "16px" }} className="grid-cols-1 md:grid-cols-2">
            {config.useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 2)}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "24px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "#0f172a",
                    margin: "0 0 6px",
                  }}
                >
                  {uc.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {uc.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLAN AVAILABILITY + RELATED MODULES ──────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "48px" }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* Plans */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "#C68B2F",
                display: "block",
                marginBottom: "12px",
              }}
            >
              AVAILABILITY
            </span>
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "24px",
                color: "#0f172a",
                margin: "0 0 24px",
              }}
            >
              Included in these plans.
            </h3>
            <div
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
              }}
            >
              {config.planAvailability.map((p, i) => (
                <div
                  key={p.plan}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderTop: i === 0 ? "none" : "1px solid #e2e8f0",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#0f172a",
                    }}
                  >
                    {p.plan}
                  </span>
                  {p.included ? (
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#047857",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: "#047857",
                        }}
                      />
                      {p.note ?? "Included"}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        color: "#94a3b8",
                      }}
                    >
                      {p.note ?? "Not included"}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <Link
              href="/pricing"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 500,
                color: "#C68B2F",
                textDecoration: "none",
                marginTop: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              See full pricing <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </motion.div>

          {/* Related modules */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "#C68B2F",
                display: "block",
                marginBottom: "12px",
              }}
            >
              PAIRS WELL WITH
            </span>
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "24px",
                color: "#0f172a",
                margin: "0 0 24px",
              }}
            >
              Other modules that complete the picture.
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {config.relatedModules.map((rm) => (
                <Link
                  key={rm.slug}
                  href={`/product/${rm.slug}`}
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "16px 18px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    transition: "border-color 150ms ease, background-color 150ms ease",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#0f172a",
                        margin: "0 0 2px",
                      }}
                    >
                      {rm.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        color: "#64748b",
                        margin: 0,
                      }}
                    >
                      {rm.desc}
                    </p>
                  </div>
                  <ArrowRight size={16} strokeWidth={1.8} color="#C68B2F" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </>
  );
}
