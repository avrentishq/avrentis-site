"use client";

import { motion } from "framer-motion";
import { stagger } from "@/lib/animations";

/* Placeholder values — replace with real metrics when available */
const METRICS = [
  { value: "2,400+", label: "Payment vouchers processed" },
  { value: "12", label: "Organisations on AVRENTIS" },
  { value: "4.2", label: "Average approval time (hours)" },
  { value: "100%", label: "Audit queries resolved" },
];

export function StatsBar() {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        borderTop: "2px solid #C68B2F",
        padding: "64px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "32px",
          textAlign: "center",
        }}
      >
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            {...stagger(i)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: "36px",
                color: "#0f172a",
                letterSpacing: "0.01em",
                lineHeight: 1,
              }}
            >
              {metric.value}
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              {metric.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
