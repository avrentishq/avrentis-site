"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";

const STEPS = [
  {
    number: "01",
    title: "Set up your organisation",
    description: "Add your company details, configure your approval chain, and register your team by role.",
  },
  {
    number: "02",
    title: "Invite your team",
    description: "Staff, HODs, Finance, and your MD each receive access matched to their authority level.",
  },
  {
    number: "03",
    title: "Raise your first document",
    description: "Create a payment voucher or purchase order. It enters the approval chain immediately.",
  },
  {
    number: "04",
    title: "Approve and record",
    description: "Each approver acts in sequence. The MD sanctions. The record is permanent.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{ backgroundColor: "#0f172a", padding: "100px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ textAlign: "center" }}>
          <motion.span
            {...fadeUp}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#C68B2F",
              display: "block",
              marginBottom: "16px",
            }}
          >
            GET STARTED
          </motion.span>
          <motion.h2
            {...stagger(1)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "36px",
              color: "#ffffff",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Up and running in one day.
          </motion.h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0",
            position: "relative",
          }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              {...stagger(i + 2)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: "24px",
                position: "relative",
              }}
            >
              {i < STEPS.length - 1 && (
                <div
                  className="hidden lg:block"
                  style={{
                    position: "absolute",
                    top: "36px",
                    right: "0",
                    width: "100%",
                    height: "0.5px",
                    backgroundColor: "rgba(198, 139, 47, 0.2)",
                    zIndex: 0,
                  }}
                />
              )}

              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 400,
                  fontSize: "11px",
                  color: "#C68B2F",
                  lineHeight: 1,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {step.number}
              </span>
              <h3
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#94a3b8",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
