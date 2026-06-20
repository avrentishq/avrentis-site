"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerDelay } from "@/lib/animations";
import { CountUp } from "@/components/ui/count-up";

const METRICS = [
  { value: "100%", label: "Approval chain compliance" },
  { value: "0", label: "Lost approvals since launch" },
  { value: "< 2 min", label: "Average approval notification time" },
  { value: "100%", label: "Audit trail completeness" },
];

export function StatsBar() {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        borderTop: "2px solid var(--color-gold)",
        padding: "60px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0",
          textAlign: "center",
        }}
      >
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(i)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              padding: "0 24px",
              borderRight: i < METRICS.length - 1 ? "0.5px solid #e2e8f0" : "none",
            }}
          >
            <CountUp
              value={metric.value}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: "40px",
                color: "#0f172a",
                letterSpacing: "0.01em",
                lineHeight: 1,
                fontFeatureSettings: '"tnum" 1',
              }}
            />

            <span
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "13px",
                color: "#475569",
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
