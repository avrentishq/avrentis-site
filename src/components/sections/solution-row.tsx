"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

const PV_DATA = {
  tag: { label: "PAYMENT VOUCHER", bg: "rgba(198,139,47,0.08)", color: "#92400e", border: "rgba(198,139,47,0.3)" },
  headline: "Every payment sanctioned before it moves.",
  body: "A Payment Voucher is raised by Staff, reviewed by Finance, and sanctioned by the MD — with every action timestamped and permanently on record.",
  link: "See Payment Voucher chain →",
  cardLabel: "PV-2026-0041 · Under review",
  rows: [
    { ref: "PV-2026-0041", desc: "Diesel supply — November", status: "Under review", amount: "₦850,000" },
    { ref: "PV-2026-0039", desc: "IT equipment — site 1", status: "Approved", amount: "₦500,000" },
    { ref: "PV-2026-0038", desc: "Safety equipment — site 2", status: "Approved", amount: "₦1,200,000" },
  ],
};

const PO_DATA = {
  tag: { label: "PURCHASE ORDER", bg: "rgba(29,78,216,0.08)", color: "#1e3a8a", border: "rgba(29,78,216,0.2)" },
  headline: "Every vendor engagement properly sanctioned.",
  body: "Purchase Orders are raised against registered vendors only. The Head of Department reviews, and the MD gives final sanction — every step permanently on record.",
  link: "See Purchase Order chain →",
  cardLabel: "REGISTERED VENDORS",
  rows: [
    { ref: "RC-1048392", desc: "Brightpath Technologies Ltd", status: "Zenith", amount: "2031847560" },
    { ref: "RC-0763214", desc: "Greenstone Supplies & Logistics", status: "GTBank", amount: "0148576293" },
    { ref: "RC-0591748", desc: "Northgate General Merchants", status: "Access", amount: "0762394815" },
  ],
};

interface SolutionRowProps {
  type: "pv" | "po";
}

export function SolutionRow({ type }: SolutionRowProps) {
  const data = type === "pv" ? PV_DATA : PO_DATA;
  const reversed = type === "po";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px", alignItems: "center" }} className="lg:grid-cols-2">
      {/* Copy side */}
      <div style={{ order: reversed ? 2 : 1 }} className={reversed ? "lg:order-2" : "lg:order-1"}>
        <motion.span
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={fadeUpTransition}
          style={{ display: "inline-block", padding: "3px 8px", backgroundColor: data.tag.bg, color: data.tag.color, border: `0.5px solid ${data.tag.border}`, borderRadius: "4px", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px" }}
        >
          {data.tag.label}
        </motion.span>

        <motion.h3
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(1)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "18px", color: "#0f172a", lineHeight: 1.3, margin: "0 0 12px" }}
        >
          {data.headline}
        </motion.h3>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(2)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: "0 0 20px" }}
        >
          {data.body}
        </motion.p>

        <motion.a
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(3)}
          href="#the-structure"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1, backgroundColor: "transparent", color: "#C68B2F", border: "0.5px solid rgba(198,139,47,0.4)", borderRadius: "3px", height: "32px", padding: "0 16px", display: "inline-flex", alignItems: "center", textDecoration: "none" }}
        >
          {data.link}
        </motion.a>
      </div>

      {/* Visual card side */}
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(2)}
        style={{ order: reversed ? 1 : 2, background: "#f8fafc", border: "0.5px solid #e2e8f0", borderRadius: "8px", padding: "20px" }}
        className={reversed ? "lg:order-1" : "lg:order-2"}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.06em", color: "#475569", textTransform: "uppercase", marginBottom: "16px" }}>
          {data.cardLabel}
        </div>

        {data.rows.map((row, i) => (
          <div key={row.ref} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < data.rows.length - 1 ? "0.5px solid #f1f5f9" : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, color: "#C68B2F" }}>{row.ref}</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#64748b" }}>{row.desc}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b" }}>{row.status}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 500, color: "#0f172a" }}>{row.amount}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
