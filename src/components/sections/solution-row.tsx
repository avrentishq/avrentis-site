"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

interface SolutionRowProps {
  label: string;
  headline: string;
  body: string;
  features: string[];
  bg: string;
  reversed?: boolean;
}

export function SolutionRow({
  label,
  headline,
  body,
  features,
  bg,
  reversed = false,
}: SolutionRowProps) {
  return (
    <section style={{ backgroundColor: bg, padding: "100px 24px" }}>
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
        {/* Copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            order: reversed ? 2 : 1,
          }}
          className={reversed ? "lg:order-2" : "lg:order-1"}
        >
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#C68B2F",
            }}
          >
            {label}
          </motion.span>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {headline}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "15px",
              color: "#475569",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {body}
          </motion.p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
            {features.map((feature, i) => (
              <motion.div
                key={feature}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 3)}
                style={{
                  borderLeft: "3px solid #C68B2F",
                  paddingLeft: "12px",
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#475569",
                }}
              >
                {feature}
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(6)}
          >
            <Button variant="ghost">
              See how it works &rarr;
            </Button>
          </motion.div>
        </div>

        {/* Screenshot placeholder */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={fadeUpTransition}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "0.5px solid #e2e8f0",
            aspectRatio: "16/10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            order: reversed ? 1 : 2,
          }}
          className={reversed ? "lg:order-1" : "lg:order-2"}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              color: "#94a3b8",
            }}
          >
            Product screenshot
          </span>
        </motion.div>
      </div>
    </section>
  );
}
