"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/lib/animations";

export function Hero() {
  return (
    <section
      style={{
        backgroundColor: "#0f172a",
        padding: "120px 24px 100px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "64px",
          alignItems: "center",
        }}
        className="lg:grid-cols-2"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <motion.span
            {...stagger(0)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
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
              fontWeight: 300,
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "0.01em",
              color: "#ffffff",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Every decision,
            <br />
            structured.
            <br />
            Every approval,
            <br />
            on record.
          </motion.h1>

          <motion.p
            {...stagger(2)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              color: "#94a3b8",
              maxWidth: "480px",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Give every document in your organisation a structured path — from
            submission through review to final approval — with a permanent
            record of every action taken along the way.
          </motion.p>

          <motion.div
            {...stagger(3)}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
          >
            <Button variant="primary" href="/contact">
              Request access &rarr;
            </Button>
            <Button variant="outline-light" href="#how-it-works">
              See how it works
            </Button>
          </motion.div>

          <motion.span
            {...stagger(4)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Built for Nigerian Oil &amp; Gas &middot; Trusted by operations
            teams
          </motion.span>
        </div>

        <motion.div
          {...fadeUp}
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "8px",
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
