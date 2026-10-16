"use client";

import { m } from "framer-motion";
import { fadeUpOnScroll, cssTransition } from "@/lib/animations";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SectionIntro } from "@/components/ui/section-intro";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import {
  BRAND_COLORS,
  MODULE_STATUS_LABELS,
  MODULES,
  moduleName,
  publicModuleKeys,
  type ModuleStatus,
} from "@/lib/brand";
import { MODULE_COPY } from "@/lib/module-copy";
import { cardGridColumns } from "@avrentishq/core/ui/card-grid";

const BADGE_STYLES: Record<ModuleStatus, { bg: string; color: string; border: string }> = {
  available: {
    bg: "rgba(var(--color-available-rgb), 0.1)",
    color: "var(--color-available)",
    border: "1px solid rgba(var(--color-available-rgb), 0.2)",
  },
  partial: {
    bg: "rgba(var(--color-gold-rgb), 0.1)",
    color: "var(--color-gold-on-light)",
    border: "1px solid rgba(var(--color-gold-rgb), 0.2)",
  },
};

export function FeaturesGrid() {
  const moduleKeys = publicModuleKeys();
  return (
    <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <SectionBackdrop src={SECTION_BACKDROPS.featuresGrid} scrim="light" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionIntro
          align="center"
          eyebrow="THE PLATFORM"
          eyebrowStyle={{ marginBottom: "16px" }}
          title="One approval engine. Every operational process."
          titleStyle={{
            fontWeight: 400,
            fontSize: "36px",
            lineHeight: 1.3,
            margin: "0 auto 12px",
          }}
          titleClassName="lg:!text-[42px]"
          lede={
            <>
              Avrentis is built as a suite of interconnected modules — each solving a
              distinct operational challenge, all working together on one shared
              approval engine. For any organisation. In any industry.
            </>
          }
          ledeStyle={{
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: 1.7,
            margin: "0 auto 40px",
            maxWidth: "640px",
          }}
        />

        <div className="card-grid" style={{ gap: "20px" }} {...cardGridColumns(moduleKeys.length, { min: "22rem" })}>
          {moduleKeys.map((moduleKey, i) => {
            const { icon: Icon, tagline, summary } = MODULE_COPY[moduleKey];
            const { status } = MODULES[moduleKey];
            const badge = BADGE_STYLES[status];
            return (
              <m.div
                key={moduleKey}
                {...fadeUpOnScroll(i + 3)}
                style={{
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  padding: "24px",
                  transition:
                    cssTransition(["box-shadow", "border-left"]),
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(var(--color-shadow-rgb), 0.08)";
                  e.currentTarget.style.borderLeft = "3px solid var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderLeft = "1px solid var(--color-border)";
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "var(--color-navy-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    color={BRAND_COLORS.gold}
                    aria-hidden="true"
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "var(--color-text-primary)",
                    margin: "0 0 4px",
                  }}
                >
                  {moduleName(moduleKey)}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  {tagline}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {summary}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "16px",
                    fontSize: "11px",
                    fontWeight: 500,
                    fontFamily: "var(--font-sans)",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    backgroundColor: badge.bg,
                    color: badge.color,
                    border: badge.border,
                  }}
                >
                  {MODULE_STATUS_LABELS[status]}
                </span>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
