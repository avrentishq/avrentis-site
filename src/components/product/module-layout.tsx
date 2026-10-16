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
import { BrowserFrame, appCaption } from "./previews/preview-primitives";
import { fadeUpOnScroll, cssTransition } from "@/lib/animations";
import { DarkHeroBackdrop } from "@/components/ui/dark-hero-backdrop";
import { Eyebrow, SectionIntro } from "@/components/ui/section-intro";
import { ButtonLink } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/sections/cta-banner";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { START_TRIAL_CTA } from "@/lib/trial-terms";
import { contactHref } from "@/app/contact/tabs";
import type { PlanFeatureKey } from "@avrentishq/core/billing/features";
import { EVERY_PLAN_NOTE, planScopeNote, type FeaturePlans } from "@/lib/plan-names";
import { SITE_ROUTES } from "@/lib/routes";

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
  /** Caption path above the preview frame, after the brand name: `vouchers / new`. */
  previewPath: string;
  /** React node for the browser-frame preview. Rendered inside a `BrowserFrame`. */
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
    secondary: config.secondaryCta ?? { label: "See how it works", href: SITE_ROUTES.howItWorks },
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
  const { name, status } = MODULES[config.moduleKey];
  const { primary, secondary } = resolveCtas(config, status);
  const relatedModules = config.relatedModules.filter((related) => isModulePublic(related.moduleKey));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Platform", path: SITE_ROUTES.product },
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
        <DarkHeroBackdrop glows="hero" grid gridY={gridY} />

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
            <Eyebrow surface="dark" reveal="scroll">
              {name}
            </Eyebrow>

            <m.div
              {...fadeUpOnScroll(1)}
            >
              <StatusRibbon status={status} />
            </m.div>

            <m.h1
              {...fadeUpOnScroll(2)}
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
              {...fadeUpOnScroll(3)}
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
              {...fadeUpOnScroll(4)}
              style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}
            >
              <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
              <ButtonLink href={secondary.href} variant="secondary" surface="dark">
                {secondary.label} →
              </ButtonLink>
            </m.div>
          </div>

          {/* Right: preview */}
          <m.div {...fadeUpOnScroll(4)}>
            <BrowserFrame caption={appCaption(config.previewPath)} surface="dark">
              {config.preview}
            </BrowserFrame>
          </m.div>
        </div>
      </section>

      {/* ── PILLARS ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.modulePillars} scrim="light" />
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionIntro
            eyebrow="CAPABILITIES"
            eyebrowStyle={{ marginBottom: "12px" }}
            title="What this module does for your organisation."
            titleStyle={{
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1.2,
              margin: "0 0 48px",
              maxWidth: "560px",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-[38px]"
          />

          <div
            style={{ display: "grid", gap: "20px" }}
            className="grid-cols-1 md:grid-cols-2"
          >
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <m.div
                  key={pillar.title}
                  {...fadeUpOnScroll(i + 2)}
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
          <SectionIntro
            eyebrow="OUTCOMES"
            eyebrowStyle={{ marginBottom: "12px" }}
            title="What changes operationally."
            titleStyle={{
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1.2,
              margin: "0 0 48px",
              maxWidth: "560px",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-[38px]"
          />

          {/* An odd last card spans both columns, so the row fills the width at any count. */}
          <div
            style={{ display: "grid", gap: "16px" }}
            className="grid-cols-1 md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2"
          >
            {useCases.map((uc, i) => (
              <m.div
                key={uc.title}
                {...fadeUpOnScroll(i + 2)}
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
            {...fadeUpOnScroll()}
          >
            <SectionIntro
              reveal="none"
              eyebrow="AVAILABILITY"
              eyebrowStyle={{ marginBottom: "12px" }}
              titleAs="h3"
              title="Included in these plans."
              titleStyle={{ fontWeight: 400, fontSize: "24px", margin: "0 0 24px" }}
            />
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
              href={SITE_ROUTES.pricing}
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
            {...fadeUpOnScroll(1)}
          >
            <SectionIntro
              reveal="none"
              eyebrow="PAIRS WELL WITH"
              eyebrowStyle={{ marginBottom: "12px" }}
              titleAs="h3"
              title="Other modules that complete the picture."
              titleStyle={{ fontWeight: 400, fontSize: "24px", margin: "0 0 24px" }}
            />
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
                    transition: cssTransition(["border-color", "background-color"]),
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
