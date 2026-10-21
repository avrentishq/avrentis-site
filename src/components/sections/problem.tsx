"use client";

import { m } from "framer-motion";
import { fadeUpOnScroll } from "@/lib/animations";
import { SectionIntro } from "@/components/ui/section-intro";
import {
  Mail,
  Printer,
  FolderOpen,
  HelpCircle,
  ShieldOff,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Z_INDEX } from "@/lib/layers";
import { cardGridProps } from "@/lib/card-grid";
import { BRAND } from "@/lib/brand";

const CARDS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Mail,
    title: "Approvals buried in email",
    body: "Request emails get missed, forgotten, or replied to days later. There is no structure, no visibility, and no trail.",
  },
  {
    icon: Printer,
    title: "Manual signatures on paper",
    body: "Every important document requires someone to print it, physically sign it, scan it, and file it. Every single time. Regardless of where the approver is.",
  },
  {
    icon: FolderOpen,
    title: "Documents lost in physical files",
    body: "Approved records pile up in cabinets. Finding anything from months ago means searching manually through folders — if the document was filed correctly at all.",
  },
  {
    icon: HelpCircle,
    title: "Nobody knows what is pending",
    body: "Teams do not know if their request was seen. Managers do not know what is waiting for them. Leadership has no visibility into what is stalled.",
  },
  {
    icon: ShieldOff,
    title: "Authority assumed, not enforced",
    body: "Anyone can approve anything. There are no defined authority levels. When something goes wrong, nobody can prove who authorised what.",
  },
  {
    icon: BarChart3,
    title: "Audit preparation is a crisis",
    body: "When compliance reviews or audits arrive, the scramble begins. Records are incomplete, trails are broken, and reconstruction takes weeks of manual work.",
  },
];

export function Problem() {
  return (
    // Continues the hero's ink field: the public tagline, then the six problems
    // it answers, as one flat band of hairline-ruled cells.
    <section style={{ backgroundColor: "var(--color-navy-primary)", padding: "0 var(--page-side-padding) 112px", position: "relative", isolation: "isolate" }}>
      <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto", position: "relative", zIndex: Z_INDEX.raised }}>
        <div style={{ height: "1px", backgroundColor: "var(--color-white-border)", marginBottom: "56px" }} />
        <SectionIntro
          surface="dark"
          title={BRAND.publicTagline}
          titleStyle={{
            fontSize: "var(--text-display-xs)",
            color: "var(--color-text-on-shell)",
            lineHeight: 1.2,
            margin: "0 0 12px",
          }}
          titleClassName="lg:!text-display-lg"
          lede="This is how most organisations still operate — across industries, places and sizes."
          ledeStyle={{
            fontSize: "var(--text-xl)",
            color: "var(--color-text-inverse-muted)",
            lineHeight: 1.7,
            margin: "0 0 40px",
            maxWidth: "var(--measure-narrow)",
          }}
        />

        <div
          {...cardGridProps(
            CARDS.length,
            { max: 3 },
            {
              gap: "0",
              borderTop: "1px solid var(--color-white-border-strong)",
              borderLeft: "1px solid var(--color-white-border-strong)",
            },
          )}
        >
          {CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <m.div
                key={card.title}
                {...fadeUpOnScroll(index + 2)}
                style={{
                  borderRight: "1px solid var(--color-white-border-strong)",
                  borderBottom: "1px solid var(--color-white-border-strong)",
                  padding: "24px",
                }}
              >
                <Icon size={18} strokeWidth={1.5} color="var(--color-gold)" aria-hidden="true" style={{ marginBottom: "14px" }} />
                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: "var(--text-md)",
                    color: "var(--color-text-on-shell)",
                    margin: "0 0 6px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-inverse-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </m.div>
            );
          })}
        </div>

        <m.p
          {...fadeUpOnScroll(9)}
          style={{
            fontWeight: 500,
            fontSize: "var(--text-3xl)",
            color: "var(--color-text-on-shell)",
            textAlign: "center",
            marginTop: "48px",
            marginBottom: 0,
          }}
        >
          {BRAND.name} was built to solve all of this — for every organisation, in
          every industry.
        </m.p>
      </div>
    </section>
  );
}
