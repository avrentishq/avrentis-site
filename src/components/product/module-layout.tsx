"use client";

/**
 * ProductModuleLayout — shared template for every Avrentis module product
 * page (Payables / Procurement / Records / Compliance / Guard / Grants / Integrations). Each page passes
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
import {
  BRAND,
  BRAND_COLORS,
  MODULE_STATUS_LABELS,
  MODULES,
  isModulePublic,
  moduleHref,
  moduleName,
  type ModuleKey,
  type ModuleStatus,
  SITE_PAGES,
} from "@/lib/brand";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import { m, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/sections/cta-banner";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { START_TRIAL_CTA } from "@/lib/trial-terms";
import { contactHref } from "@/app/contact/tabs";
import type { PlanFeatureKey } from "@avrentishq/core/billing/features";
import { EVERY_PLAN_NOTE, planScopeNote, type FeaturePlans } from "@/lib/plan-names";

/**
 * Which plans a card's capability is on. `planFeature` names the plan feature
 * that gates it, and the layout says which plans carry it, from the pricing
 * API — unless that is exactly the module's own plans, which the table already
 * shows. `everyPlan` marks a capability no feature gates, so it is on every plan
 * the module is; say it only where it is worth stressing.
 */
interface PlanScoped {
  planFeature?: PlanFeatureKey;
  everyPlan?: true;
}

export interface ModulePillar extends PlanScoped {
  icon: LucideIcon;
  title: string;
  body: string;
}

export interface ModuleUseCase extends PlanScoped {
  title: string;
  body: string;
}

export interface ModulePlan {
  plan: string;
  included: boolean;
  note?: string;
  /** The trial row, which is not a plan of its own. */
  isTrial?: boolean;
}

/** Each item's body with its plan sentence appended, where one says something the table does not. */
function withPlanScope<Item extends PlanScoped & { body: string }>(
  items: Item[],
  featurePlans: FeaturePlans,
  planAvailability: ModulePlan[],
): Item[] {
  const planRows = planAvailability.filter((row) => !row.isTrial);
  const allPlanNames = planRows.map((row) => row.plan);
  const modulePlanNames = planRows.filter((row) => row.included).map((row) => row.plan);
  const sameSet = (left: readonly string[], right: readonly string[]) =>
    left.length === right.length && left.every((name) => right.includes(name));
  return items.map((item) => {
    let note = "";
    if (item.everyPlan) note = EVERY_PLAN_NOTE;
    else if (item.planFeature) {
      const names = featurePlans[item.planFeature] ?? [];
      if (!sameSet(names, modulePlanNames)) note = planScopeNote(names, allPlanNames);
    }
    return note ? { ...item, body: `${item.body} ${note}` } : item;
  });
}

export interface ModuleRelated {
  moduleKey: ModuleKey;
  /** How that module completes this one — the name and link come from the key. */
  desc: string;
}

/**
 * A module page's own words. Its name, status, link and breadcrumb all follow
 * from `moduleKey`, so a page cannot disagree with the catalogue about any of them.
 */
export interface ModuleConfig {
  moduleKey: ModuleKey;
  headline: string;
  description: string;
  /** Caption path above the preview frame, after the brand name: `vouchers / PV-2026-0184`. */
  previewPath: string;
  /** React node for the browser-frame preview. Rendered inside a `MockupShell`-style container. */
  preview: React.ReactNode;
  pillars: ModulePillar[];
  useCases: ModuleUseCase[];
  relatedModules: ModuleRelated[];
  /** Overrides the default CTA based on status. */
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

const STATUS_RIBBON_STYLES: Record<ModuleStatus, { bg: string; color: string; border: string }> = {
  available: {
    bg: "rgba(var(--color-available-rgb), 0.12)",
    color: "var(--color-available-on-dark)",
    border: "1px solid rgba(var(--color-available-rgb), 0.3)",
  },
  partial: {
    bg: "rgba(var(--color-gold-rgb), 0.12)",
    color: "var(--color-gold)",
    border: "1px solid rgba(var(--color-gold-rgb), 0.3)",
  },
};

function StatusRibbon({ status }: { status: ModuleStatus }) {
  const style = STATUS_RIBBON_STYLES[status];
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
        color: style.color,
        backgroundColor: style.bg,
        border: style.border,
        borderRadius: "3px",
        padding: "4px 10px",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: style.color,
          display: "inline-block",
        }}
      />
      {MODULE_STATUS_LABELS[status]}
    </span>
  );
}

function resolveCtas(config: ModuleConfig, status: ModuleStatus): {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
} {
  if (status === "partial") {
    return {
      primary: config.primaryCta ?? { label: "Join the beta", href: contactHref("beta") },
      secondary: config.secondaryCta ?? { label: "Talk to us", href: contactHref() },
    };
  }
  return {
    primary: config.primaryCta ?? { label: START_TRIAL_CTA, href: SITE_PAGES.trial() },
    secondary: config.secondaryCta ?? { label: "See how it works", href: "/product/how-it-works" },
  };
}

/**
 * What the pricing API says about a module page — which plans include the
 * module, and which plans carry each plan feature. Every module route builds it
 * with `modulePageData(key, pricingData)`; never written by hand.
 */
export interface ModulePageData {
  planAvailability: ModulePlan[];
  featurePlans: FeaturePlans;
}

/** A module page: its own words (`config`) plus the derived `ModulePageData`. */
export function ProductModuleLayout({
  config,
  planAvailability,
  featurePlans,
}: ModulePageData & { config: ModuleConfig }) {
  const pillars = withPlanScope(config.pillars, featurePlans, planAvailability);
  const useCases = withPlanScope(config.useCases, featurePlans, planAvailability);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const isMobile = useIsMobile();
  const { name, status } = MODULES[config.moduleKey];
  const { primary, secondary } = resolveCtas(config, status);
  const relatedModules = config.relatedModules.filter((related) => isModulePublic(related.moduleKey));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Platform", path: "/product" },
          { name, path: moduleHref(config.moduleKey) },
        ])}
      />
      <Navbar />
      <main id="main">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
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
        <SectionBackdrop src={SECTION_BACKDROPS.moduleHero} scrim="dark" />
        <AmbientGlow top="-120px" left="-100px" size={520} intensity={0.22} duration={32} />
        <AmbientGlow bottom="-140px" right="-80px" size={560} intensity={0.18} duration={38} delay={0.5} />

        <m.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(rgba(var(--color-white-rgb), 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--color-white-rgb), 0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            y: isMobile ? 0 : gridY,
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
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
              }}
            >
              {name}
            </m.span>

            <m.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(1)}
            >
              <StatusRibbon status={status} />
            </m.div>

            <m.h1
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(2)}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "34px",
                color: "var(--color-white)",
                lineHeight: 1.15,
                margin: 0,
              }}
              className="lg:!text-[48px]"
            >
              {config.headline}
            </m.h1>

            <m.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(3)}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "17px",
                color: "var(--color-text-subtle)",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: "480px",
              }}
            >
              {config.description}
            </m.p>

            <m.div
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
                  backgroundColor: "var(--color-gold)",
                  color: "var(--color-text-primary)",
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
                  color: "var(--color-white)",
                  border: "1px solid rgba(var(--color-white-rgb), 0.2)",
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
            </m.div>
          </div>

          {/* Right: preview */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ...fadeUpTransition, delay: 0.3 }}
          >
            <div
              style={{
                borderRadius: "10px",
                border: "1px solid rgba(var(--color-white-rgb), 0.10)",
                backgroundColor: "var(--color-bg-light)",
                boxShadow: "0 0 60px rgba(var(--color-gold-rgb), 0.06), 0 30px 60px rgba(var(--color-shadow-rgb), 0.45)",
                overflow: "hidden",
              }}
            >
              {/* Browser chrome */}
              <div
                style={{
                  backgroundColor: "var(--color-navy-primary)",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderBottom: "1px solid rgba(var(--color-white-rgb), 0.06)",
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
                        backgroundColor: "rgba(var(--color-white-rgb), 0.15)",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(var(--color-white-rgb), 0.06)",
                    borderRadius: "5px",
                    padding: "4px 10px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    color: "var(--color-text-subtle)",
                    textAlign: "center",
                  }}
                >
                  {BRAND.name} / {config.previewPath}
                </div>
              </div>
              <div>{config.preview}</div>
            </div>
          </m.div>
        </div>
      </section>

      {/* ── PILLARS ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.modulePillars} scrim="light" />
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
              marginBottom: "12px",
            }}
          >
            CAPABILITIES
          </m.span>
          <m.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "32px",
              color: "var(--color-text-primary)",
              lineHeight: 1.2,
              margin: "0 0 48px",
              maxWidth: "560px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            What this module does for your organisation.
          </m.h2>

          <div
            style={{ display: "grid", gap: "20px" }}
            className="grid-cols-1 md:grid-cols-2"
          >
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <m.div
                  key={pillar.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={staggerDelay(i + 2)}
                  style={{
                    backgroundColor: "var(--color-bg-light)",
                    border: "1px solid var(--color-border)",
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
                      backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "18px",
                      color: "var(--color-text-primary)",
                      margin: "4px 0 0",
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {pillar.body}
                  </p>
                </m.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-bg)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.moduleUseCases} scrim="light" />
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
              marginBottom: "12px",
            }}
          >
            OUTCOMES
          </m.span>
          <m.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "32px",
              color: "var(--color-text-primary)",
              lineHeight: 1.2,
              margin: "0 0 48px",
              maxWidth: "560px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            What changes operationally.
          </m.h2>

          {/* An odd last card spans both columns, so the row fills the width at any count. */}
          <div
            style={{ display: "grid", gap: "16px" }}
            className="grid-cols-1 md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2"
          >
            {useCases.map((uc, i) => (
              <m.div
                key={uc.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 2)}
                style={{
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "6px",
                  padding: "24px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "var(--color-text-primary)",
                    margin: "0 0 6px",
                  }}
                >
                  {uc.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {uc.body}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLAN AVAILABILITY + RELATED MODULES ──────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.modulePlan} scrim="light" />
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "48px" }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* Plans */}
          <m.div
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
                color: "var(--color-gold-on-light)",
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
                color: "var(--color-text-primary)",
                margin: "0 0 24px",
              }}
            >
              Included in these plans.
            </h3>
            <div
              style={{
                backgroundColor: "var(--color-bg-light)",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
              }}
            >
              {planAvailability.map((p, i) => (
                <div
                  key={p.plan}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "14px 18px",
                    borderTop: i === 0 ? "none" : "1px solid var(--color-border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      flexShrink: 0,
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
                        color: "var(--color-success)",
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
                          backgroundColor: "var(--color-success)",
                        }}
                      />
                      {p.note ?? "Included"}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        color: "var(--color-text-subtle)",
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
                color: "var(--color-gold-on-light)",
                textDecoration: "none",
                marginTop: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              See full pricing <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </m.div>

          {/* Related modules */}
          <m.div
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
                color: "var(--color-gold-on-light)",
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
                color: "var(--color-text-primary)",
                margin: "0 0 24px",
              }}
            >
              Other modules that complete the picture.
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {relatedModules.map((related) => (
                <Link
                  key={related.moduleKey}
                  href={moduleHref(related.moduleKey)}
                  style={{
                    backgroundColor: "var(--color-bg-light)",
                    border: "1px solid var(--color-border)",
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
                        color: "var(--color-text-primary)",
                        margin: "0 0 2px",
                      }}
                    >
                      {moduleName(related.moduleKey)}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                        margin: 0,
                      }}
                    >
                      {related.desc}
                    </p>
                  </div>
                  <ArrowRight size={16} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
