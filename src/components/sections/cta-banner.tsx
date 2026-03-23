"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/lib/animations";

export function CtaBanner() {
  return (
    <section style={{ backgroundColor: "#0f172a", padding: "96px 24px" }}>
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
        <motion.h2
          {...fadeUp}
          style={{
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "36px",
            color: "#ffffff",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Ready to bring structure to your financial operations?
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
          }}
        >
          Request access and we will set up your organisation within 24 hours.
        </motion.p>
        <motion.div {...stagger(2)}>
          <Button variant="primary" href="/contact">
            Request access &rarr;
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
