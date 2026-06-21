"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import {
  Mail,
  Printer,
  FolderOpen,
  HelpCircle,
  ShieldOff,
  BarChart3,
} from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";
import type { LucideIcon } from "lucide-react";

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
            color: "var(--color-gold)",
            display: "block",
            marginBottom: "16px",
          }}
        >
          SOUND FAMILIAR?
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
            fontSize: "36px",
            color: "#0f172a",
            lineHeight: 1.3,
            margin: "0 0 12px",
            maxWidth: "600px",
          }}
          className="lg:!text-[42px]"
        >
          This is how most organisations still operate.
        </motion.h2>

        <motion.p
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
            margin: "0 0 40px",
            maxWidth: "580px",
          }}
        >
          Across industries, geographies, and organisation sizes — the same
          operational problems keep showing up.
        </motion.p>

        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
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
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(var(--color-gold-rgb), 0.08)",
                    border: "1px solid rgba(var(--color-gold-rgb), 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    color={BRAND_COLORS.gold}
                    aria-hidden="true"
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#0f172a",
                    margin: "0 0 6px",
                  }}
                >
                  {card.title}
                </h3>
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
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(9)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "18px",
            color: "#0f172a",
            textAlign: "center",
            marginTop: "48px",
            marginBottom: 0,
          }}
        >
          Avrentis was built to solve all of this — for every organisation, in
          every industry.
        </motion.p>
      </div>
    </section>
  );
}
