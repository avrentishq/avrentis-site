"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

const PAIN_POINTS = [
  {
    heading: "Approvals over WhatsApp and email",
    body: "Decisions made in chat threads leave no structured record. There is no chain of authority — only assumption.",
  },
  {
    heading: "No audit trail when it matters",
    body: "When a query arises, there is no document showing who approved what, when, and why. Compliance becomes impossible to demonstrate.",
  },
  {
    heading: "The MD is the only control",
    body: "Without structured approval chains, every decision defaults upward. The MD becomes a bottleneck for every payment.",
  },
];

export function Problem() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "100px 24px" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "64px",
        }}
        className="lg:grid-cols-2"
      >
        {/* Left — Intro copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#C68B2F",
            }}
          >
            THE PROBLEM
          </motion.span>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "36px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Most Nigerian businesses make financial decisions without structure.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              color: "#475569",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Financial decisions made in chat threads. Approvals given verbally. Authority assumed, not defined. When something goes wrong, there is nothing on record and no structure to point to.
          </motion.p>
        </div>

        {/* Right — Pain points with gold left border */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {PAIN_POINTS.map((point, i) => (
            <motion.div
              key={point.heading}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(i + 3)}
              style={{
                borderLeft: "3px solid #C68B2F",
                paddingLeft: "20px",
              }}
            >
              <h3
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "15px",
                  color: "#0f172a",
                  margin: "0 0 8px",
                }}
              >
                {point.heading}
              </h3>
              <p
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#475569",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {point.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
