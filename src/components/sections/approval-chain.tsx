"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { StatusBadge, RoleBadge } from "@/components/ui/badge";
import { fadeUp, stagger } from "@/lib/animations";

const CHAIN_STEPS: {
  role: "staff" | "hod" | "finance" | "md";
  action: string;
  status: "draft" | "submitted" | "under_review" | "approved";
}[] = [
  { role: "staff", action: "Raises document", status: "draft" },
  { role: "hod", action: "Reviews and approves", status: "submitted" },
  { role: "finance", action: "Verifies and approves", status: "under_review" },
  { role: "md", action: "Sanctions", status: "approved" },
];

export function ApprovalChain() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "96px 24px" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "640px" }}>
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
            A structured path for every document
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
            From submission to final approval — every step on record.
          </motion.p>
        </div>

        <motion.div
          {...stagger(2)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            width: "100%",
            maxWidth: "800px",
          }}
          className="lg:flex-row lg:items-center lg:justify-between"
        >
          {CHAIN_STEPS.map((step, i) => (
            <div
              key={step.role}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
              }}
              className="flex-col lg:flex-row"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  padding: "24px 20px",
                  backgroundColor: "#ffffff",
                  border: "0.5px solid #e2e8f0",
                  borderRadius: "8px",
                  minWidth: "150px",
                  textAlign: "center",
                }}
              >
                <RoleBadge role={step.role} />
                <span
                  style={{
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: 1.4,
                  }}
                >
                  {step.action}
                </span>
                <StatusBadge status={step.status} />
              </div>

              {i < CHAIN_STEPS.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px",
                  }}
                  className="rotate-90 lg:rotate-0"
                >
                  <ArrowRight
                    size={16}
                    color="rgba(198,139,47,0.4)"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          {...stagger(3)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            backgroundColor: "rgba(91,33,182,0.04)",
            border: "0.5px solid rgba(91,33,182,0.15)",
            borderRadius: "8px",
            maxWidth: "480px",
          }}
        >
          <StatusBadge status="queried" />
          <span
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            At any stage, an approver can raise a query. The document pauses
            until the creator responds.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
