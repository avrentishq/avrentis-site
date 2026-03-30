"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

export function CtaBanner() {
  return (
    <section style={{ backgroundColor: "#0f172a", padding: "120px 40px", textAlign: "center" }}>
      <div style={{ maxWidth: "440px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.span
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={fadeUpTransition}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: "#C68B2F", marginBottom: "12px" }}
        >
          FINANCIAL AUTHORITY, PROPERLY STRUCTURED
        </motion.span>

        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(1)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "24px", color: "#ffffff", lineHeight: 1.3, margin: "0 0 12px" }}
        >
          The structure everything runs on.
        </motion.h2>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(2)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: "0 0 32px" }}
        >
          Built for any Nigerian organisation where financial decisions require structured authority. Request a demo and see the full approval chain in action.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(3)}
          style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}
        >
          <a href="/contact" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1, backgroundColor: "#C68B2F", color: "#0f172a", border: "none", borderRadius: "3px", height: "36px", padding: "0 20px", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", cursor: "pointer", transition: "background-color 150ms ease" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#A87425"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#C68B2F"; }}>
            REQUEST A DEMO
          </a>
          <a href="#the-structure" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1, backgroundColor: "transparent", color: "#C68B2F", border: "0.5px solid rgba(198,139,47,0.4)", borderRadius: "3px", height: "36px", padding: "0 20px", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", cursor: "pointer" }}>
            VIEW THE AUDIT RECORD
          </a>
        </motion.div>
      </div>
    </section>
  );
}
