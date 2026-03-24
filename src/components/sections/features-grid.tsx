"use client";

import { motion } from "framer-motion";
import { GitBranch, Shield, Users, Bell, FileText, Activity } from "lucide-react";
import { FeatureCard } from "@/components/ui/card";
import { fadeUp, stagger } from "@/lib/animations";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Sequential Approval Chains",
    description: "Staff → HOD → Finance → MD. Every document follows a defined path. No step can be skipped.",
  },
  {
    icon: Shield,
    title: "Permanent Audit Trail",
    description: "Every action is recorded with timestamp and attribution. The record cannot be altered.",
  },
  {
    icon: Users,
    title: "Role-Based Authority",
    description: "Each role in your organisation sees only what they need and acts only within their authority.",
  },
  {
    icon: Bell,
    title: "WhatsApp & Email Notifications",
    description: "Approvers are notified the moment a document reaches their queue. No chasing required.",
  },
  {
    icon: FileText,
    title: "Bank-Ready Documentation",
    description: "Approved documents carry an institutional stamp — ready for your bank without additional preparation.",
  },
  {
    icon: Activity,
    title: "Real-Time Status Tracking",
    description: "Every document shows its current status across the full approval chain at any moment.",
  },
];

export function FeaturesGrid() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "100px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ textAlign: "center" }}>
          <motion.span
            {...fadeUp}
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
            {...stagger(1)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "36px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Everything your approval chain needs.
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
            <motion.div key={feature.title} {...stagger(i + 2)}>
              <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
