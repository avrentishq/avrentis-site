"use client";

import { m } from "framer-motion";
import { fadeUpOnScroll } from "@/lib/animations";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SectionIntro } from "@/components/ui/section-intro";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
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
    <section style={{ backgroundColor: "var(--color-bg)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <SectionBackdrop src={SECTION_BACKDROPS.problem} scrim="light" />
      <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto", position: "relative", zIndex: Z_INDEX.raised }}>
        <SectionIntro
          eyebrow="SOUND FAMILIAR?"
          eyebrowStyle={{ marginBottom: "16px" }}
          title="This is how most organisations still operate."
          titleStyle={{
            fontWeight: 400,
            fontSize: "var(--text-display-xs)",
            lineHeight: 1.3,
            margin: "0 0 12px",
            maxWidth: "var(--measure-snug)",
          }}
          titleClassName="lg:!text-display-lg"
          lede={
            <>
              Across industries, geographies, and organisation sizes — the same
              operational problems keep showing up.
            </>
          }
          ledeStyle={{
            fontWeight: 400,
            fontSize: "var(--text-xl)",
            lineHeight: 1.7,
            margin: "0 0 40px",
            maxWidth: "var(--measure-narrow)",
          }}
        />

        <div {...cardGridProps(CARDS.length, { max: 3 }, { gap: "20px" })}>
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <m.div
                key={card.title}
                {...fadeUpOnScroll(i + 3)}
                style={{
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-card)",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(var(--color-shadow-rgb), 0.04)",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-gold-ghost)",
                    border: "1px solid var(--color-gold-divider)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    color="var(--color-gold)"
                    aria-hidden="true"
                  />
                </div>
                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: "var(--text-md)",
                    color: "var(--color-text-primary)",
                    margin: "0 0 6px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
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
            color: "var(--color-text-primary)",
            textAlign: "center",
            marginTop: "48px",
            marginBottom: 0,
          }}
        >
          Avrentis was built to solve all of this — for every organisation, in
          every industry.
        </m.p>
      </div>
    </section>
  );
}
