"use client";

import { m } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import {
  CreditCard,
  ShoppingCart,
  Archive,
  ClipboardCheck,
  Users,
  Link2,
} from "lucide-react";
import { BRAND_COLORS, moduleName, isModulePublic, type ModuleKey } from "@/lib/brand";
import type { LucideIcon } from "lucide-react";

type BadgeStatus = "available" | "coming_soon" | "partial" | "roadmap";

// Marketing content per module. The customer-facing NAME is sourced from the
// brand SSOT (`moduleName`); availability is driven by `isModulePublic` so a
// non-public module (HR) never renders here.
const MODULE_CARDS: {
  key: ModuleKey;
  icon: LucideIcon;
  subtitle: string;
  body: string;
  status: BadgeStatus;
}[] = [
  {
    key: "pay",
    icon: CreditCard,
    subtitle: "Payment & Approval Management",
    body: "Structure every payment decision your organisation makes. From submission through defined approval levels to final authorisation — tracked, documented, and permanently on record.",
    status: "available",
  },
  {
    key: "procure",
    icon: ShoppingCart,
    subtitle: "Purchase Order Management",
    body: "Bring structure and visibility to every procurement action. Generate, approve, and track purchase orders without email chains, manual paperwork, or process gaps.",
    status: "available",
  },
  {
    key: "vault",
    icon: Archive,
    subtitle: "Institutional Memory",
    body: "Replace physical and scattered digital filing with a centralised, searchable, role-controlled document system. Every approved record — instantly retrievable, permanently preserved.",
    status: "available",
  },
  {
    key: "audit",
    icon: ClipboardCheck,
    subtitle: "Compliance & Accountability",
    body: "A complete, tamper-proof log of every action across your organisation. Meet compliance requirements and face every audit with confidence — not scrambling.",
    status: "available",
  },
  {
    // HR is not yet public → filtered out by isModulePublic.
    key: "people",
    icon: Users,
    subtitle: "HR Approvals & Workforce Management",
    body: "Extend operational structure to your workforce processes. Leave approvals, onboarding, policy acknowledgements — all structured, tracked, and on record.",
    status: "available",
  },
  {
    key: "connect",
    icon: Link2,
    subtitle: "External Systems",
    body: "Connect Avrentis to the systems your organisation already uses. Your structured operational data flowing where it needs to go — without manual intervention.",
    status: "available",
  },
];

const BADGE_STYLES: Record<
  BadgeStatus,
  { label: string; bg: string; color: string; border: string }
> = {
  available: {
    label: "Available now",
    bg: "rgba(39,174,96,0.1)",
    color: "#27AE60",
    border: "1px solid rgba(39,174,96,0.2)",
  },
  coming_soon: {
    label: "Coming soon",
    bg: "rgba(100,116,139,0.1)",
    color: "#64748b",
    border: "1px solid rgba(100,116,139,0.2)",
  },
  partial: {
    label: "Partially available",
    bg: "rgba(var(--color-gold-rgb), 0.1)",
    color: "var(--color-gold-on-light)",
    border: "1px solid rgba(var(--color-gold-rgb), 0.2)",
  },
  roadmap: {
    label: "On the roadmap",
    bg: "rgba(132,146,166,0.1)",
    color: "#64748b",
    border: "1px solid rgba(132,146,166,0.2)",
  },
};

export function FeaturesGrid() {
  return (
    <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
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
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          THE PLATFORM
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
            fontSize: "36px",
            color: "#0f172a",
            lineHeight: 1.3,
            margin: "0 auto 12px",
            textAlign: "center",
          }}
          className="lg:!text-[42px]"
        >
          One approval engine. Every operational process.
        </m.h2>

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
            textAlign: "center",
            maxWidth: "640px",
          }}
        >
          Avrentis is built as a suite of interconnected modules — each solving a
          distinct operational challenge, all working together on one shared
          approval engine. For any organisation. In any industry.
        </m.p>

        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {MODULE_CARDS.filter((mod) => isModulePublic(mod.key)).map((mod, i) => {
            const Icon = mod.icon;
            const badge = BADGE_STYLES[mod.status];
            return (
              <m.div
                key={mod.key}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 3)}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "24px",
                  transition:
                    "box-shadow 150ms ease, border-left 150ms ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderLeft = "3px solid var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderLeft = "1px solid #e2e8f0";
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "#0f172a",
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
                    color: "#0f172a",
                    margin: "0 0 4px",
                  }}
                >
                  {moduleName(mod.key)}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#64748b",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  {mod.subtitle}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {mod.body}
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
                  {badge.label}
                </span>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
