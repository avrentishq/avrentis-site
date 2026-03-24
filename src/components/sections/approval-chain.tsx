"use client";

import { motion } from "framer-motion";
import { StatusBadge, RoleBadge } from "@/components/ui/badge";
import { fadeUp, stagger } from "@/lib/animations";

const CHAIN_STEPS: {
  role: "staff" | "hod" | "finance" | "md";
  action: string;
  status: "submitted" | "under_review" | "queried" | "approved";
}[] = [
  { role: "staff", action: "Raises PV", status: "submitted" },
  { role: "hod", action: "Reviews", status: "under_review" },
  { role: "finance", action: "Validates", status: "queried" },
  { role: "md", action: "Sanctions", status: "approved" },
];

const CALLOUTS = [
  "Immutable audit record",
  "Role-based authority",
  "Real-time status tracking",
];

export function ApprovalChain() {
  return (
    <section style={{ backgroundColor: "#0f172a", padding: "100px 24px" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "560px" }}>
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
            HOW AVRENTIS WORKS
          </motion.span>
          <motion.h2
            {...stagger(1)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "36px",
              color: "#ffffff",
              lineHeight: 1.2,
              margin: "0 0 16px",
            }}
          >
            Every document follows a structured path.
          </motion.h2>
          <motion.p
            {...stagger(2)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              color: "#94a3b8",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            From the moment a payment voucher is raised to the moment it is
            sanctioned by the MD — every step is recorded, every action
            attributed.
          </motion.p>
        </div>

        {/* Chain diagram */}
        <motion.div
          {...stagger(3)}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "900px",
          }}
          className="lg:flex-row lg:items-center lg:justify-between"
        >
          {CHAIN_STEPS.map((step, i) => (
            <div
              key={step.role}
              style={{
                display: "flex",
                alignItems: "center",
              }}
              className="flex-col lg:flex-row"
            >
              {/* Step node */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  padding: "24px 20px",
                  minWidth: "140px",
                  textAlign: "center",
                }}
              >
                <RoleBadge role={step.role} />
                <span
                  style={{
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "#94a3b8",
                    lineHeight: 1.4,
                  }}
                >
                  {step.action}
                </span>
                <StatusBadge status={step.status} />
              </div>

              {/* Connecting line */}
              {i < CHAIN_STEPS.length - 1 && (
                <div
                  className="hidden lg:block"
                  style={{
                    width: "40px",
                    height: "0.5px",
                    backgroundColor: "rgba(198,139,47,0.2)",
                    flexShrink: 0,
                  }}
                />
              )}
              {i < CHAIN_STEPS.length - 1 && (
                <div
                  className="lg:hidden"
                  style={{
                    width: "0.5px",
                    height: "24px",
                    backgroundColor: "rgba(198,139,47,0.2)",
                    margin: "0 auto",
                  }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Feature callouts */}
        <motion.div
          {...stagger(4)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0",
          }}
        >
          {CALLOUTS.map((callout, i) => (
            <span key={callout} style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 500,
                  fontSize: "11px",
                  color: "#C68B2F",
                  letterSpacing: "0.06em",
                }}
              >
                {callout}
              </span>
              {i < CALLOUTS.length - 1 && (
                <span
                  style={{
                    margin: "0 16px",
                    color: "rgba(198,139,47,0.2)",
                    fontSize: "11px",
                  }}
                >
                  |
                </span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
