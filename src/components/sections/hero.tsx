"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/lib/animations";

export function Hero() {
  return (
    <section style={{ backgroundColor: "#0f172a", padding: "120px 24px 100px" }}>
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "64px", alignItems: "center" }}
        className="lg:grid-cols-[1.5fr_1fr]"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <motion.span
            {...stagger(0)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#C68B2F",
            }}
          >
            APPROVAL WORKFLOW INFRASTRUCTURE
          </motion.span>

          <motion.h1
            {...stagger(1)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "0.01em",
              color: "#ffffff",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Your money moves on your terms.
          </motion.h1>

          <motion.p
            {...stagger(2)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              color: "#94a3b8",
              maxWidth: "480px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            AVRENTIS gives every payment voucher and purchase order a structured
            path from submission to approval — with a permanent record of every
            action.
          </motion.p>

          <motion.div
            {...stagger(3)}
            style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
          >
            <Button variant="primary" size="lg" href="/contact">
              Request access
            </Button>
            <Button variant="navy" size="lg" href={process.env.NEXT_PUBLIC_APP_URL ?? "https://app.avrentis.com"}>
              Sign in
            </Button>
          </motion.div>
        </div>

        <motion.div
          {...fadeUp}
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            border: "0.5px solid rgba(198,139,47,0.2)",
            aspectRatio: "16/10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
            Product preview
          </span>
        </motion.div>
      </div>
    </section>
  );
}
