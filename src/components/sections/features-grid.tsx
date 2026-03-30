"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { Shield, ClipboardList, Bell, FileText, ArrowRightLeft, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Shield,
    title: "Authority by role",
    body: "Each stage of the approval chain is locked to the correct role. Structure is enforced, not assumed.",
  },
  {
    icon: ClipboardList,
    title: "Immutable audit record",
    body: "Every action timestamped and attributed. Every financial decision permanently on record. Audit-ready before they ask.",
  },
  {
    icon: Bell,
    title: "WhatsApp & email notification",
    body: "Every approver is notified the moment a decision enters their stage — via WhatsApp or email.",
  },
  {
    icon: FileText,
    title: "Sanctioned document PDF",
    body: "Every sanctioned decision generates a stamped PDF with the complete authority record embedded.",
  },
  {
    icon: ArrowRightLeft,
    title: "Approval delegation",
    body: "Delegate authority to a named deputy during absence. The delegate inherits the delegator's full scope — department, thresholds, and position in the chain. Time-limited with automatic expiry.",
  },
  {
    icon: BarChart3,
    title: "MD command view",
    body: "The MD has total command — current financial exposure, pending decisions, turnaround status, and auto-escalation alerts. Documents exceeding approval thresholds escalate automatically.",
  },
];

export function FeaturesGrid() {
  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "80px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.span
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={fadeUpTransition}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: "#C68B2F", display: "block", textAlign: "center", marginBottom: "16px" }}
        >
          WHAT IS INCLUDED
        </motion.span>

        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(1)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "22px", color: "#0f172a", lineHeight: 1.3, margin: "0 auto 40px", textAlign: "center", maxWidth: "520px" }}
        >
          Built for any Nigerian organisation where financial decisions require structured authority.
        </motion.h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(i + 2)}
                style={{ background: "#ffffff", border: "0.5px solid #e2e8f0", borderRadius: "8px", padding: "20px" }}
              >
                <div style={{ width: "28px", height: "28px", borderRadius: "4px", backgroundColor: "rgba(198,139,47,0.08)", border: "0.5px solid rgba(198,139,47,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  <Icon size={14} strokeWidth={1.5} color="#C68B2F" aria-hidden="true" />
                </div>
                <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "13px", color: "#0f172a", margin: "0 0 6px" }}>{feat.title}</h3>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "12px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{feat.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
