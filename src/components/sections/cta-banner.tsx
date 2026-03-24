"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/lib/animations";

export function CtaBanner() {
  return (
    <section
      style={{
        backgroundColor: "#0f172a",
        borderTop: "0.5px solid rgba(198,139,47,0.2)",
        padding: "100px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <motion.h2
          {...fadeUp}
          style={{
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "40px",
            color: "#ffffff",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Your money should move on your terms.
        </motion.h2>
        <motion.p
          {...stagger(1)}
          style={{
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            color: "#94a3b8",
            lineHeight: 1.65,
            margin: 0,
            maxWidth: "480px",
          }}
        >
          Give your organisation the approval infrastructure it needs. Structured
          decisions. Permanent records. Total command.
        </motion.p>
        <motion.div {...stagger(2)}>
          <Button variant="primary" size="lg" href="/contact">
            Request access
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
