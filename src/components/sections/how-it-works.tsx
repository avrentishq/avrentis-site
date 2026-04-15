"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { Zap, Smartphone, Lock, Globe } from "lucide-react";

const STEPS = [
  {
    title: "Submit",
    body: "Any team member raises a request directly in Avrentis — payment voucher, purchase order, or any operational approval. They complete a structured form, attach supporting documents, and submit. The request enters the defined approval chain immediately — no emails, no chasing, no ambiguity about where it goes next.",
  },
  {
    title: "Approve",
    body: "The right person is notified instantly — via the platform, email, WhatsApp, or SMS. They review the complete request and approve or reject with a single action from any device, anywhere in the world. Decision makers are never a bottleneck because they are never out of reach.",
  },
  {
    title: "Record",
    body: "The moment a decision is made, Avrentis creates a complete, timestamped, tamper-proof record. Supporting documents are generated automatically. Every action is permanently attributed to a person, a time, and a decision. Your organisation builds institutional memory with every transaction — across every department, every team, every location.",
  },
];

const FEATURES = [
  { icon: Zap, label: "Real-time notifications" },
  { icon: Smartphone, label: "Approve from any device" },
  { icon: Lock, label: "Tamper-proof records" },
  { icon: Globe, label: "Works across any location" },
];

/* ── Mockup components ─────────────────────────────────── */

function SubmitMockup() {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 0 40px rgba(198,139,47,0.06), 0 16px 40px rgba(0,0,0,0.3)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: "14px",
          color: "#FFFFFF",
          display: "block",
          marginBottom: "20px",
        }}
      >
        New Request
      </span>

      {/* Document Type */}
      <div style={{ marginBottom: "14px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#475569", display: "block", marginBottom: "6px" }}>
          Document Type
        </span>
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            padding: "10px 12px",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "#FFFFFF",
            fontWeight: 500,
          }}
        >
          Payment Voucher
        </div>
      </div>

      {/* Vendor */}
      <div style={{ marginBottom: "14px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#475569", display: "block", marginBottom: "6px" }}>
          Vendor
        </span>
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            padding: "10px 12px",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "#64748b",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Select vendor&hellip;</span>
          <span style={{ fontSize: "10px", color: "#475569" }}>&#9662;</span>
        </div>
      </div>

      {/* Amount */}
      <div style={{ marginBottom: "14px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#475569", display: "block", marginBottom: "6px" }}>
          Amount
        </span>
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            padding: "10px 12px",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          &#x20A6; 0.00
        </div>
      </div>

      {/* Purpose */}
      <div style={{ marginBottom: "20px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#475569", display: "block", marginBottom: "6px" }}>
          Purpose
        </span>
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            padding: "10px 12px",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "#64748b",
            minHeight: "40px",
          }}
        >
          Describe purpose&hellip;
        </div>
      </div>

      {/* Submit button */}
      <div
        style={{
          backgroundColor: "#C68B2F",
          color: "#0f172a",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: "13px",
          borderRadius: "6px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "0.02em",
        }}
      >
        Submit Request
      </div>
    </div>
  );
}

function ApproveMockup() {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 0 40px rgba(198,139,47,0.06), 0 16px 40px rgba(0,0,0,0.3)",
      }}
    >
      {/* Notification badge */}
      <div
        style={{
          display: "inline-block",
          backgroundColor: "rgba(198,139,47,0.1)",
          border: "1px solid rgba(198,139,47,0.2)",
          borderRadius: "4px",
          padding: "5px 10px",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "11px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#C68B2F",
          }}
        >
          New Approval Request
        </span>
      </div>

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#475569" }}>Reference</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#FFFFFF", fontWeight: 600 }}>PV-2026-0041</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#475569" }}>Amount</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#FFFFFF", fontWeight: 600 }}>&#x20A6;850,000</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#475569" }}>Vendor</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#FFFFFF", fontWeight: 500 }}>Brightpath Technologies</span>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }} />

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "13px",
            backgroundColor: "rgba(52,199,89,0.15)",
            color: "#34C759",
            border: "1px solid rgba(52,199,89,0.3)",
            borderRadius: "8px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: "0.02em",
          }}
        >
          Approve
        </div>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "13px",
            backgroundColor: "transparent",
            color: "#FF3B30",
            border: "1px solid rgba(255,59,48,0.3)",
            borderRadius: "8px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: "0.02em",
          }}
        >
          Reject
        </div>
      </div>
    </div>
  );
}

function RecordMockup() {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 0 40px rgba(198,139,47,0.06), 0 16px 40px rgba(0,0,0,0.3)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: "14px",
          color: "#FFFFFF",
          display: "block",
          marginBottom: "20px",
        }}
      >
        Completed Record
      </span>

      {/* Approval chain */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
        {[
          { role: "Submitted by", person: "Staff" },
          { role: "Approved by", person: "Finance" },
          { role: "Sanctioned by", person: "MD" },
        ].map((item) => (
          <div key={item.role} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "rgba(52,199,89,0.15)",
                border: "1px solid rgba(52,199,89,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#34C759", fontSize: "11px", lineHeight: 1 }}>&#10003;</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#475569" }}>{item.role}</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#FFFFFF", fontWeight: 500 }}>{item.person}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Timestamp */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "14px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#475569" }}>Completed</span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
          15 Apr 2026, 14:32 WAT
        </span>
      </div>

      {/* Download button */}
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#FFFFFF",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: "13px",
          borderRadius: "6px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "0.02em",
        }}
      >
        Download PDF
      </div>
    </div>
  );
}

const MOCKUPS = [SubmitMockup, ApproveMockup, RecordMockup];

/* ── Main section ──────────────────────────────────────── */

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const ActiveMockup = MOCKUPS[active];

  return (
    <section id="how-it-works" style={{ backgroundColor: "#0f172a", padding: "120px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ── Header ──────────────────────────────────── */}
        <motion.span
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={fadeUpTransition}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#C68B2F",
            display: "block",
            marginBottom: "16px",
          }}
        >
          HOW IT WORKS
        </motion.span>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(1)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "36px",
            color: "#FFFFFF",
            lineHeight: 1.2,
            margin: "0 0 16px",
            maxWidth: "600px",
          }}
          className="lg:!text-[42px]"
        >
          Three steps. Zero paper. Complete record.
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(2)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "16px",
            color: "#64748b",
            lineHeight: 1.7,
            margin: "0 0 56px",
            maxWidth: "600px",
          }}
        >
          Everything your organisation currently does manually — Avrentis structures, tracks, and permanently records automatically.
        </motion.p>

        {/* ── Step Selector ───────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(3)}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            marginBottom: "56px",
            position: "relative",
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", position: "relative", flex: 1, maxWidth: "200px" }}
              onClick={() => setActive(i)}
              role="button"
              tabIndex={0}
              aria-label={`Step ${i + 1}: ${step.title}`}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); } }}
            >
              {/* Connecting line — between circles */}
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "50%",
                    right: "-50%",
                    height: "2px",
                    backgroundColor: i < active ? "#C68B2F" : "rgba(132,146,166,0.25)",
                    zIndex: 0,
                    transition: "background-color 0.3s ease",
                  }}
                />
              )}

              {/* Circle */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: i === active ? "#C68B2F" : "transparent",
                  border: i === active ? "2px solid #C68B2F" : "2px solid rgba(132,146,166,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: i === active ? "#0f172a" : "#64748b",
                    transition: "color 0.3s ease",
                  }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Title */}
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: i === active ? 600 : 500,
                  fontSize: "14px",
                  color: i === active ? "#FFFFFF" : "#64748b",
                  marginTop: "10px",
                  transition: "color 0.3s ease",
                }}
              >
                {step.title}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Content Area ────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gap: "48px",
            alignItems: "center",
            marginBottom: "64px",
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* Left — Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#64748b",
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: "480px",
                }}
              >
                {STEPS[active].body}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Right — Mockup */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mockup-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: "400px", width: "100%" }}
              className="lg:justify-self-end"
            >
              <ActiveMockup />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Feature Callout Strip ───────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(4)}
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "10px",
            padding: "20px 32px",
            display: "grid",
            gap: "16px",
          }}
          className="grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Icon size={16} strokeWidth={1.8} color="#C68B2F" aria-hidden="true" />
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "13px",
                    color: "#64748b",
                  }}
                >
                  {feat.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
