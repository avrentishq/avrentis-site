"use client";

import { motion } from "framer-motion";
import { GitBranch, Shield, Users, Bell, FileText, Activity } from "lucide-react";
import { FeatureCard } from "@/components/ui/card";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Structured decision chains",
    description: "Every financial action moves through defined stages of authority. No shortcuts. No ambiguity. Structure is enforced, not assumed.",
  },
  {
    icon: Shield,
    title: "Permanent institutional record",
    description: "Every action is timestamped, attributed, and permanently on record. The record cannot be altered.",
  },
  {
    icon: Users,
    title: "Authority by role",
    description: "Five levels of permission govern who can raise, review, approve, and sanction. Each role sees only what they need.",
  },
  {
    icon: Bell,
    title: "Real-time notifications",
    description: "Every approver is notified the moment a decision reaches their queue. No chasing. No delays.",
  },
  {
    icon: FileText,
    title: "Bank-ready documentation",
    description: "Every sanctioned decision carries an institutional record — ready for your bank without additional preparation.",
  },
  {
    icon: Activity,
    title: "Complete visibility",
    description: "Track the status of every financial decision across your organisation, in real time, from anywhere.",
  },
];

export function FeaturesGrid() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ textAlign: "center" }}>
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
              display: "block",
              marginBottom: "16px",
            }}
          >
            CAPABILITIES
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
              fontSize: "36px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Everything your organisation needs.
          </motion.h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "8px",
          }}
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(i + 2)}
            >
              <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
