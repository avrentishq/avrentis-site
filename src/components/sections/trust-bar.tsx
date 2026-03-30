"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition } from "@/lib/animations";

const ITEMS = [
  "BUILT FOR NIGERIAN BUSINESS",
  "SEQUENTIAL APPROVAL CHAIN",
  "WHATSAPP & EMAIL NOTIFICATION",
  "AUDIT-READY AT ALL TIMES",
  "NDPR COMPLIANT",
];

export function TrustBar() {
  return (
    <motion.section
      variants={fadeUp} initial="hidden" whileInView="visible"
      viewport={{ once: true, margin: "-40px" }} transition={fadeUpTransition}
      style={{ height: "72px", backgroundColor: "#ffffff", borderBottom: "0.5px solid #e2e8f0", display: "flex", alignItems: "center", padding: "0 40px" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
        {ITEMS.map((item) => (
          <span key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "rgba(198,139,47,0.4)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#94a3b8" }}>
              {item}
            </span>
          </span>
        ))}
      </div>
    </motion.section>
  );
}
