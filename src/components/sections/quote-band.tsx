"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

export function QuoteBand() {
  return (
    <section style={{ backgroundColor: "#0f172a", padding: "64px 24px" }}>
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
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={fadeUpTransition}
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
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(1)}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 400,
            fontSize: "12px",
            color: "#C68B2F",
            letterSpacing: "0.06em",
          }}
        >
          AVRENTIS — The structure every African business runs on.
        </motion.span>
      </div>
    </section>
  );
}
