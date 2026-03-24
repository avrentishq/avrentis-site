"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";

export function QuoteBand() {
  return (
    <section style={{ backgroundColor: "#0f172a", padding: "80px 24px" }}>
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <motion.p
          {...fadeUp}
          style={{
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "28px",
            color: "#ffffff",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Every decision, structured. Every approval, on record.
        </motion.p>
        <motion.span
          {...stagger(1)}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 400,
            fontSize: "12px",
            color: "#C68B2F",
            letterSpacing: "0.06em",
          }}
        >
          AVRENTIS — Approval workflow infrastructure for African business.
        </motion.span>
      </div>
    </section>
  );
}
