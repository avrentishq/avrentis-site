"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

const STEPS = [
  { num: "01", title: "Register your organisation", body: "Add your organisation name, CAC number, and configure the sequential approval chain for your structure." },
  { num: "02", title: "Assign roles to your team", body: "Invite team members and assign each a defined role — Staff, HOD, Finance, MD, or Admin. Each role sees only what they need and can only act within their authority." },
  { num: "03", title: "Register your vendors", body: "Add approved vendors with bank details and CAC numbers. Purchase Orders are raised against registered vendors only." },
  { num: "04", title: "Raise your first decision", body: "Raise a Payment Voucher or Purchase Order. It enters the approval chain immediately. The record begins from the moment it is raised." },
];

export function HowItWorks() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "100px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.span
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={fadeUpTransition}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: "#C68B2F", display: "block", marginBottom: "16px" }}
        >
          GETTING STARTED
        </motion.span>

        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(1)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "22px", color: "#0f172a", lineHeight: 1.3, margin: "0 0 48px", maxWidth: "520px" }}
        >
          From configuration to first sanctioned decision in under a day.
        </motion.h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(i + 2)}
              style={{ display: "flex", flexDirection: "column", gap: "0" }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.10em", color: "#C68B2F" }}>{step.num}</span>
              <div style={{ height: "1px", backgroundColor: "rgba(198,139,47,0.2)", margin: "10px 0 16px" }} />
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "13px", color: "#0f172a", margin: "0 0 6px" }}>{step.title}</h3>
              <p style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "12px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
