"use client";

import { motion } from "framer-motion";
import {
  GitBranch,
  Eye,
  Shield,
  Lock,
  FileText,
  Download,
} from "lucide-react";
import { FeatureCard } from "@/components/ui/card";
import { stagger } from "@/lib/animations";
import { fadeUp } from "@/lib/animations";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Sequential approval chains",
    description:
      "Define who approves what, in what order. Staff submit. HODs review. Finance verify. MD sanctions. In sequence, every time.",
  },
  {
    icon: Eye,
    title: "Real-time document status",
    description:
      "See exactly where every payment voucher and purchase order is at any moment — Draft, Pending, Under review, Approved, Bank ready.",
  },
  {
    icon: Shield,
    title: "Permanent audit trail",
    description:
      "Every action timestamped and attributed. Who approved it. When. From where. Immutable and audit-ready before they ask.",
  },
  {
    icon: Lock,
    title: "Role-based access control",
    description:
      "Five levels of access — Staff, HOD, Finance, MD, Admin. Each sees only what they should. Each can only do what they must.",
  },
  {
    icon: FileText,
    title: "Purchase order workflow",
    description:
      "Raise and track purchase orders through the same structured approval chain. Required-by dates, vendor details, department tracking.",
  },
  {
    icon: Download,
    title: "Bank-ready document exports",
    description:
      "Approved documents export in formats your Nigerian bank accepts. The record follows the payment.",
  },
];

export function FeaturesGrid() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "96px 24px" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <div>
          <motion.span
            {...fadeUp}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#C68B2F",
              display: "block",
              marginBottom: "12px",
            }}
          >
            WHAT IS INCLUDED
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
            Built for how Nigerian business actually works
          </motion.h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {FEATURES.map((feature, i) => (
            <motion.div key={feature.title} {...stagger(i + 2)}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
