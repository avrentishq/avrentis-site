"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const CAPABILITIES = [
  "Structured decision chains",
  "Permanent institutional records",
  "Authority by role",
];

export function TrustBar() {
  return (
    <motion.section
      {...fadeUp}
      style={{
        backgroundColor: "#ffffff",
        borderTop: "2px solid #C68B2F",
        height: "80px",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            color: "#475569",
          }}
        >
          Financial decision infrastructure for Nigerian business
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
          {CAPABILITIES.map((cap, i) => (
            <span key={cap} style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 500,
                  fontSize: "12px",
                  color: "#475569",
                }}
              >
                {cap}
              </span>
              {i < CAPABILITIES.length - 1 && (
                <span style={{ margin: "0 12px", color: "#C68B2F", fontSize: "12px" }}>
                  |
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
