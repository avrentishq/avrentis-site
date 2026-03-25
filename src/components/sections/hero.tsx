"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerDelay } from "@/lib/animations";

export function Hero() {
  return (
    <section style={{ backgroundColor: "#0f172a", padding: "160px 24px 120px" }}>
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "64px", alignItems: "center" }}
        className="lg:grid-cols-[1.5fr_1fr]"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(0)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#C68B2F",
            }}
          >
            APPROVAL WORKFLOW INFRASTRUCTURE
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "0.01em",
              color: "#ffffff",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Your money moves on your terms.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              color: "#94a3b8",
              maxWidth: "480px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Give every financial decision in your organisation a defined structure — from the moment it is raised to the moment it is permanently on record.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(3)}
            style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
          >
            <Button variant="primary" size="lg" href="/contact">
              Request access
            </Button>
            <Button variant="navy" size="lg" href={process.env.NEXT_PUBLIC_APP_URL ?? "https://app.avrentis.com"}>
              Sign in
            </Button>
          </motion.div>
        </div>

        {/* Right — Compact approval chain visual */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(4)}
          style={{
            background: "#1e293b",
            borderRadius: "8px",
            border: "0.5px solid rgba(198,139,47,0.2)",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Header label */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#C68B2F",
            }}
          >
            Live approval chain
          </span>

          {/* Four approval nodes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
            className="lg:grid-cols-4"
          >
            {[
              { role: "Staff", roleBg: "#f1f5f9", roleText: "#475569", action: "Raises PV", status: "Pending review", statusBg: "rgba(180,83,9,0.08)", statusText: "#78350f", statusDot: "#b45309" },
              { role: "HOD", roleBg: "#FDF8EF", roleText: "#78350f", roleBorder: "#C68B2F", action: "Reviews", status: "Under review", statusBg: "rgba(198,139,47,0.08)", statusText: "#92400e", statusDot: "#C68B2F", statusBorder: "rgba(198,139,47,0.4)" },
              { role: "Finance", roleBg: "rgba(4,120,87,0.08)", roleText: "#047857", action: "Validates", status: "Queried", statusBg: "rgba(91,33,182,0.08)", statusText: "#3B0764", statusDot: "#5B21B6", statusBorder: "rgba(91,33,182,0.4)", pulse: true },
              { role: "MD", roleBg: "#1e293b", roleText: "#C68B2F", roleBorder: "#C68B2F", action: "Sanctions", status: "Approved", statusBg: "rgba(4,120,87,0.08)", statusText: "#047857", statusDot: "#047857" },
            ].map((node) => (
              <div
                key={node.role}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  textAlign: "center",
                }}
              >
                {/* Role badge */}
                <span
                  style={{
                    padding: "3px 8px",
                    backgroundColor: node.roleBg,
                    color: node.roleText,
                    fontSize: "11px",
                    fontWeight: 500,
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    borderRadius: "4px",
                    border: node.roleBorder ? `0.5px solid ${node.roleBorder}` : "0.5px solid transparent",
                  }}
                >
                  {node.role}
                </span>

                {/* Action */}
                <span style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "11px", color: "#94a3b8" }}>
                  {node.action}
                </span>

                {/* Status badge */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 6px",
                    backgroundColor: node.statusBg,
                    color: node.statusText,
                    fontSize: "10px",
                    fontWeight: 500,
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    borderRadius: "4px",
                    border: node.statusBorder ? `0.5px solid ${node.statusBorder}` : "0.5px solid transparent",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: node.statusDot,
                      flexShrink: 0,
                      ...(node.pulse && { animation: "avrentis-pulse 1.4s ease-in-out infinite" }),
                    }}
                  />
                  {node.status}
                </span>
              </div>
            ))}
          </div>

          {/* Footer callouts */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", flexWrap: "wrap" }}>
            {["Immutable audit record", "Role-based authority", "Real-time visibility"].map((item, i, arr) => (
              <span key={item} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, color: "#C68B2F", letterSpacing: "0.06em" }}>
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ margin: "0 10px", color: "rgba(198,139,47,0.2)", fontSize: "10px" }}>|</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
