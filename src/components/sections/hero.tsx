"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { RoleBadge } from "@/components/ui/role-badge";
import { StatusBadge } from "@/components/ui/status-badge";

export function Hero() {
  return (
    <section style={{ backgroundColor: "#0f172a", padding: "140px 40px 120px", borderBottom: "0.5px solid rgba(198,139,47,0.1)" }}>
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "48px", alignItems: "center" }}
        className="lg:grid-cols-2"
      >
        {/* Left — Copy */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <motion.span
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-40px" }} transition={fadeUpTransition}
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C68B2F", marginBottom: "16px" }}
          >
            FINANCIAL DECISION INFRASTRUCTURE
          </motion.span>

          <motion.h1
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(1)}
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "28px", color: "#ffffff", lineHeight: 1.3, margin: "0 0 20px" }}
          >
            Every decision, structured.{"\n"}Every approval, <span style={{ color: "#C68B2F" }}>on record.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(2)}
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: "0 0 32px", maxWidth: "480px" }}
          >
            AVRENTIS gives every financial decision a defined path — from the Staff who raises it to the MD who sanctions it — with a permanent institutional record of every action, at every stage.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(3)}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
          >
            <a href="/contact" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1, backgroundColor: "#C68B2F", color: "#0f172a", border: "none", borderRadius: "3px", height: "36px", padding: "0 20px", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", cursor: "pointer", transition: "background-color 150ms ease" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#A87425"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#C68B2F"; }}>
              REQUEST A DEMO
            </a>
            <a href="#the-structure" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1, backgroundColor: "transparent", color: "#C68B2F", border: "0.5px solid rgba(198,139,47,0.4)", borderRadius: "3px", height: "36px", padding: "0 20px", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", cursor: "pointer", transition: "border-color 150ms ease" }}>
              SEE HOW IT WORKS
            </a>
          </motion.div>
        </div>

        {/* Right — Approval chain widget */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(4)}
          style={{ background: "#1e293b", borderRadius: "8px", border: "0.5px solid rgba(198,139,47,0.2)", padding: "24px" }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase", color: "#C68B2F", display: "block", marginBottom: "20px" }}>
            APPROVAL CHAINS — LIVE
          </span>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Payment Voucher chain */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "4px" }}>
                PAYMENT VOUCHER
              </span>
              {[
                { role: "staff" as const, action: "Raised PV-2026-0041", status: "approved" as const },
                { role: "finance" as const, action: "Reviewing", status: "under_review" as const },
                { role: "md" as const, action: "Final sanction", status: "draft" as const },
              ].map((node, i, arr) => (
                <div key={node.role}>
                  <div style={{ background: "#0f172a", border: "0.5px solid rgba(198,139,47,0.15)", borderRadius: "6px", padding: "12px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                    <RoleBadge role={node.role} />
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#94a3b8" }}>{node.action}</span>
                    <StatusBadge status={node.status} />
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                      <span style={{ fontSize: "10px", color: "rgba(198,139,47,0.4)" }}>&#9662;</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Purchase Order chain */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "4px" }}>
                PURCHASE ORDER
              </span>
              {[
                { role: "staff" as const, action: "Raised PO-2026-0012", status: "approved" as const },
                { role: "hod" as const, action: "Reviewing", status: "under_review" as const },
                { role: "md" as const, action: "Final sanction", status: "draft" as const },
              ].map((node, i, arr) => (
                <div key={node.role}>
                  <div style={{ background: "#0f172a", border: "0.5px solid rgba(198,139,47,0.15)", borderRadius: "6px", padding: "12px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                    <RoleBadge role={node.role} />
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#94a3b8" }}>{node.action}</span>
                    <StatusBadge status={node.status} />
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                      <span style={{ fontSize: "10px", color: "rgba(198,139,47,0.4)" }}>&#9662;</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
            {["Immutable audit record", "Authority by role", "Real-time visibility"].map((item, i, arr) => (
              <span key={item} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.05em", color: "#C68B2F" }}>{item}</span>
                {i < arr.length - 1 && <span style={{ margin: "0 8px", color: "rgba(198,139,47,0.3)", fontSize: "10px" }}>|</span>}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
