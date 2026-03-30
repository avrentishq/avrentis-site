"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

export function QuoteBand() {
  return (
    <section style={{ backgroundColor: "#0f172a", padding: "64px 40px", textAlign: "center", borderTop: "0.5px solid rgba(198,139,47,0.1)", borderBottom: "0.5px solid rgba(198,139,47,0.1)" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.span
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={fadeUpTransition}
          style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "rgba(198,139,47,0.3)", marginBottom: "16px", lineHeight: 1 }}
        >
          &ldquo;
        </motion.span>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(1)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "18px", color: "#ffffff", lineHeight: 1.6, margin: "0 0 20px" }}
        >
          Your money moves on your terms. Every financial decision structured. Every approval permanently on record.
        </motion.p>

        <motion.span
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(2)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: "#475569" }}
        >
          AVRENTIS — FINANCIAL DECISION INFRASTRUCTURE
        </motion.span>
      </div>
    </section>
  );
}
