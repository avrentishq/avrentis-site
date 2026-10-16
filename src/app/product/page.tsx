import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_COLORS,
  MODULE_STATUS_LABELS,
  MODULES,
  moduleHref,
  moduleShortName,
  SUITES,
  type ModuleKey,
  type ModuleStatus,
  SITE_PAGES,
  BRAND,
} from "@/lib/brand";
import { MODULE_COPY } from "@/lib/module-copy";
import { suiteModuleKeys } from "@/lib/product-suites";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ButtonLink } from "@/components/ui/button";
import { DarkHeroBackdrop } from "@/components/ui/dark-hero-backdrop";
import { SectionIntro } from "@/components/ui/section-intro";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { pageMetadata } from "@/lib/seo";
import { START_TRIAL_CTA } from "@/lib/trial-terms";
import { SITE_ROUTES } from "@/lib/routes";
import { APPROVAL_LIFECYCLE, lifecycleStepNumber } from "@/lib/approval-lifecycle";
import { cssTransition } from "@/lib/animations";

export const metadata: Metadata = pageMetadata({
  path: SITE_ROUTES.product,
  title: `The ${BRAND.name} platform — spend, oversight, evidence, on one record`,
  description: `${BRAND.name} structures how your organisation spends, who is allowed to approve it, and the record that proves what happened — four suites on one delegation-of-authority engine, one tamper-evident record.`,
  socialDescription: "Spend, Oversight, Evidence and Infrastructure — four suites sharing one approval engine and one tamper-evident record.",
});

const STATUS_BADGE: Record<ModuleStatus, { bg: string; color: string }> = {
  available: { bg: "rgba(var(--color-available-rgb), 0.12)", color: "var(--color-success)" },
  partial: { bg: "rgba(var(--color-gold-rgb), 0.12)", color: "var(--color-gold-on-light)" },
};

export default function ProductOverviewPage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-navy-primary)",
          padding: "120px 40px 96px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.productHero} scrim="dark" />
        <DarkHeroBackdrop glows="hero" grid />

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <SectionIntro
            surface="dark"
            reveal="none"
            eyebrow="The Avrentis Platform"
            eyebrowStyle={{ display: "inline-block", marginBottom: "20px" }}
            titleAs="h1"
            title={
              <>
                Spend, oversight, evidence. One approval engine. One tamper-evident
                record.
              </>
            }
            titleStyle={{ fontWeight: 700, fontSize: "36px", lineHeight: 1.15, margin: "0 0 24px" }}
            titleClassName="lg:!text-[52px]"
            lede={
              <>
                Avrentis is not a collection of unrelated tools — every financial
                decision, procurement action, and compliance event flows through
                one delegation-of-authority engine: routed to the
                right approver by amount, department, and risk, enforced
                automatically, and provable on the same tamper-evident record.
              </>
            }
            ledeStyle={{
              fontSize: "17px",
              color: "var(--color-text-subtle)",
              lineHeight: 1.7,
              margin: "0 auto 36px",
              maxWidth: "640px",
            }}
          />
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <ButtonLink href={SITE_PAGES.trial()}>{START_TRIAL_CTA}</ButtonLink>
            <ButtonLink href={SITE_ROUTES.howItWorks} variant="secondary" surface="dark">
              See how it works →
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── MODULE GRID ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.productModuleGrid} scrim="light" />
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionIntro
            reveal="none"
            eyebrow="THE FOUR SUITES"
            eyebrowStyle={{ marginBottom: "12px" }}
            title="Four suites. Each module in them does one thing, precisely."
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

          {SUITES.map((suite) => {
            const modules = suiteModuleKeys(suite.key);
            // A suite the site markets nothing in renders nothing — no heading
            // over an empty row. (None today; true the day one is added.)
            if (modules.length === 0) return null;
            return (
              <div key={suite.key} style={{ marginBottom: "56px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "20px",
                    color: "var(--color-text-primary)",
                    margin: "0 0 4px",
                    letterSpacing: "0.01em",
                  }}
                >
                  {suite.label}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    color: "var(--color-text-muted)",
                    margin: "0 0 20px",
                    maxWidth: "560px",
                  }}
                >
                  {suite.blurb}
                </p>
                {/* auto-fit, not a fixed 3-up: suites hold different numbers of
                    modules, so a fixed three-column grid would leave the smaller
                    ones part-empty. auto-fit stretches whatever a suite has
                    across the full width. */}
                <div
                  style={{
                    display: "grid",
                    gap: "20px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  }}
                >
                  {modules.map((moduleKey) => (
                    <ModuleCard key={moduleKey} moduleKey={moduleKey} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PLATFORM RHYTHM (how modules share the engine) ─────────── */}
      <section style={{ backgroundColor: "var(--color-bg)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.productPlatformRhythm} scrim="light" />
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <SectionIntro
            reveal="none"
            eyebrow="ONE AUTHORITY ENGINE"
            eyebrowStyle={{ marginBottom: "12px" }}
            title="Every module runs on one delegation-of-authority engine."
            titleStyle={{
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1.25,
              margin: "0 0 24px",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-[38px]"
            lede={<>
            A payment voucher, a purchase order, a grant disbursement, and a
            vendor onboarding all travel the same authority engine: routed to the right
            approver by amount, department, and risk → enforced with no way
            around it → recorded on a tamper-evident trail. Define once who can
            approve what, up to how much, and under which conditions — every
            module obeys it. And for any decision, Avrentis shows exactly which
            rule applied and can prove what policy governed it, years later.
            </>}
            ledeStyle={{ fontSize: "16px", lineHeight: 1.7, margin: "0 0 32px", maxWidth: "640px" }}
          />

          <div
            style={{
              backgroundColor: "var(--color-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              padding: "32px",
              display: "grid",
              // One track per stage when they fit, so the strip fills the width at any stage count.
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "24px",
            }}
          >
            {APPROVAL_LIFECYCLE.map((stage, index) => (
              <div key={stage.key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontFeatureSettings: '"tnum" 1',
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "var(--color-gold-on-light)",
                  }}
                >
                  {lifecycleStepNumber(index)}
                </span>
                <h4
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    margin: 0,
                  }}
                >
                  {stage.title}
                </h4>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "var(--color-text-muted)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {stage.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </>
  );
}

/**
 * One module card. Extracted when the grid became four suite sections — the
 * card is identical in every suite, so it is a component rather than the same
 * hundred lines repeated per bucket.
 */
function ModuleCard({ moduleKey }: { moduleKey: ModuleKey }) {
  const { icon: Icon, tagline, summary } = MODULE_COPY[moduleKey];
  const { name, status } = MODULES[moduleKey];
  const badge = STATUS_BADGE[status];
  return (
    <Link
      href={moduleHref(moduleKey)}
      style={{
        backgroundColor: "var(--color-bg-light)",
        border: "1px solid var(--color-border)",
        borderRadius: "10px",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        textDecoration: "none",
        transition: cssTransition(["border-color", "transform"], "base"),
      }}
      className="hover:!border-[rgba(var(--color-gold-rgb),0.4)]"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "6px",
            backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
        </div>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: badge.color,
            backgroundColor: badge.bg,
            borderRadius: "3px",
            padding: "3px 8px",
          }}
        >
          {MODULE_STATUS_LABELS[status]}
        </span>
      </div>

      <div>
        <h3
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "18px",
            color: "var(--color-text-primary)",
            margin: "0 0 2px",
          }}
        >
          {name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            color: "var(--color-gold-on-light)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          {tagline}
        </p>
      </div>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          color: "var(--color-text-muted)",
          lineHeight: 1.65,
          margin: 0,
          flex: 1,
        }}
      >
        {summary}
      </p>

      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--color-text-primary)",
          marginTop: "4px",
        }}
      >
        Explore {moduleShortName(moduleKey)} →
      </span>
    </Link>
  );
}
