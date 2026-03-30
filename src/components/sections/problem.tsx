"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { AlertTriangle, ShieldOff, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CARDS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: AlertTriangle,
    title: "No permanent record",
    body: "Financial decisions sanctioned verbally or via WhatsApp leave nothing permanently on record. When questions arise, there is nothing to show.",
  },
  {
    icon: ShieldOff,
    title: "Authority bypassed",
    body: "Without enforced role gates, financial decisions are sanctioned by the wrong person — or by no one at all. Structure is assumed, not enforced.",
  },
  {
    icon: EyeOff,
    title: "MD without command",
    body: "The MD has no live view of what financial decisions are pending, what has moved, or the total exposure currently in the approval chain.",
  },
];

export function Problem() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "100px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.span
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={fadeUpTransition}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: "#C68B2F", display: "block", marginBottom: "16px" }}
        >
          THE PROBLEM
        </motion.span>

        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(1)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "22px", color: "#0f172a", lineHeight: 1.3, margin: "0 0 12px", maxWidth: "520px" }}
        >
          Financial authority in most Nigerian businesses is assumed, not enforced.
        </motion.h2>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(2)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "480px" }}
        >
          When financial decisions live in chat threads and verbal sign-offs, there is no structure, no defined authority, and no permanent record. A single unchecked payment can expose the entire organisation.
        </motion.p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(i + 3)}
                style={{ border: "0.5px solid #e2e8f0", borderRadius: "8px", padding: "20px" }}
              >
                <div style={{ width: "28px", height: "28px", borderRadius: "4px", backgroundColor: "rgba(185,28,28,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  <Icon size={16} strokeWidth={1.5} color="#b91c1c" aria-hidden="true" />
                </div>
                <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "13px", color: "#0f172a", margin: "0 0 6px" }}>{card.title}</h3>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "12px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{card.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
