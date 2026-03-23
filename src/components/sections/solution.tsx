"use client";

import { motion } from "framer-motion";
import { Shield, FileCheck, Clock } from "lucide-react";
import { fadeUp, stagger } from "@/lib/animations";

const BENEFITS = [
  {
    icon: Shield,
    title: "Structured authority",
    description:
      "Every document follows a defined approval chain. Staff submit. HODs review. Finance verify. MD sanctions.",
  },
  {
    icon: FileCheck,
    title: "Permanent record",
    description:
      "Every action timestamped and attributed. Who approved it. When. From where. Immutable and audit-ready.",
  },
  {
    icon: Clock,
    title: "Real-time visibility",
    description:
      "See exactly where every payment voucher and purchase order is at any moment. No chasing. No guessing.",
  },
];

export function Solution() {
  return (
    <section style={{ backgroundColor: "#FDF8EF", padding: "96px 24px" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <div style={{ maxWidth: "640px" }}>
          <motion.h2
            {...fadeUp}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "36px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 12px",
            }}
          >
            What AVRENTIS gives you
          </motion.h2>
          <motion.p
            {...stagger(1)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              color: "#64748b",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            A structured approval chain for every document your organisation
            raises — with every action permanently on record.
          </motion.p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
          }}
        >
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              {...stagger(i + 2)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(198, 139, 47, 0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <benefit.icon
                  size={20}
                  color="#C68B2F"
                  strokeWidth={1.5}
                />
              </div>
              <h3
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "18px",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {benefit.title}
              </h3>
              <p
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#64748b",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
