"use client";

import { useEffect, useRef, useState } from "react";
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

/* ── Mockup components — mirror the real platform UI ───────────────── */

/**
 * Shared shell for every mockup: a light browser-framed card on the dark
 * section background, matching how the real Avrentis dashboard renders.
 */
function MockupShell({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.10)",
        backgroundColor: "#F8FAFC",
        boxShadow: "0 0 40px rgba(198,139,47,0.06), 0 20px 50px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          backgroundColor: "#0f172a",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", gap: "5px" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderRadius: "4px",
            padding: "3px 10px",
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}

function SubmitMockup() {
  return (
    <MockupShell url="app.avrentis.com / vouchers / new">
      <div style={{ padding: "20px 22px" }}>
        {/* Page heading */}
        <h3
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "18px",
            color: "#0f172a",
            margin: "0 0 4px",
            letterSpacing: "0.01em",
          }}
        >
          New payment voucher
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            color: "#64748b",
            margin: "0 0 18px",
          }}
        >
          Step 1 of 4 &middot; Payee details
        </p>

        {/* Step dots */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "3px",
                borderRadius: "2px",
                backgroundColor: i === 0 ? "#C68B2F" : "#e2e8f0",
              }}
            />
          ))}
        </div>

        {/* Fields */}
        <MockupField label="Payee name" value="Brightpath Technologies" filled />
        <MockupField label="Bank" value="Guaranty Trust Bank" filled />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <MockupField label="Account number" value="0123456789" filled />
          <MockupField label="Account name" value="Brightpath Technologies Ltd." filled compact />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "18px" }}>
          <button
            type="button"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "12px",
              backgroundColor: "#FFFFFF",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
              borderRadius: "3px",
              padding: "8px 16px",
              cursor: "default",
            }}
          >
            Save draft
          </button>
          <button
            type="button"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "12px",
              backgroundColor: "#0f172a",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "3px",
              padding: "8px 18px",
              cursor: "default",
            }}
          >
            Continue &rarr;
          </button>
        </div>
      </div>
    </MockupShell>
  );
}

function MockupField({
  label,
  value,
  filled,
  compact,
}: {
  label: string;
  value: string;
  filled?: boolean;
  compact?: boolean;
}) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "10px",
          fontWeight: 500,
          color: "#64748b",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "5px",
        }}
      >
        {label}
      </label>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "3px",
          padding: compact ? "7px 10px" : "8px 10px",
          fontFamily: "var(--font-sans)",
          fontSize: compact ? "11px" : "12px",
          color: filled ? "#0f172a" : "#94a3b8",
          fontWeight: filled ? 500 : 400,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ApproveMockup() {
  return (
    <MockupShell url="app.avrentis.com / vouchers / PV-2026-0041">
      <div style={{ padding: "20px 22px" }}>
        {/* Reference + type + status */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontFeatureSettings: '"tnum" 1',
              fontSize: "13px",
              fontWeight: 500,
              color: "#0f172a",
            }}
          >
            PV-2026-0041
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 500,
              backgroundColor: "#0f172a",
              color: "#C68B2F",
              borderRadius: "3px",
              padding: "1px 5px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            PV
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 500,
              backgroundColor: "rgba(198,139,47,0.08)",
              color: "#92400e",
              borderRadius: "3px",
              padding: "2px 6px",
            }}
          >
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#C68B2F", display: "inline-block" }} />
            Under review
          </span>
        </div>

        {/* Summary block */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            padding: "14px 16px",
            marginBottom: "14px",
          }}
        >
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "#0f172a", margin: "0 0 2px" }}>
            Brightpath Technologies
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontFeatureSettings: '"tnum" 1',
              fontSize: "20px",
              fontWeight: 500,
              color: "#0f172a",
              margin: "0 0 10px",
            }}
          >
            ₦850,000
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", rowGap: "4px", fontFamily: "var(--font-sans)", fontSize: "11px" }}>
            <span style={{ color: "#64748b" }}>Purpose</span>
            <span style={{ color: "#0f172a" }}>Diesel supply — November</span>
            <span style={{ color: "#64748b" }}>Submitted</span>
            <span style={{ color: "#0f172a" }}>Fatima Abubakar · 2h ago</span>
            <span style={{ color: "#64748b" }}>Department</span>
            <span style={{ color: "#0f172a" }}>Operations</span>
          </div>
        </div>

        {/* Approval actions panel */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            padding: "14px 16px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 500,
              color: "#64748b",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: "0 0 10px",
            }}
          >
            Your action
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            <button
              type="button"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "12px",
                backgroundColor: "#0f172a",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "3px",
                padding: "8px 0",
                cursor: "default",
              }}
            >
              Approve
            </button>
            <button
              type="button"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "12px",
                backgroundColor: "#FFFFFF",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                borderRadius: "3px",
                padding: "8px 0",
                cursor: "default",
              }}
            >
              Query
            </button>
            <button
              type="button"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "12px",
                backgroundColor: "#FFFFFF",
                color: "#b91c1c",
                border: "1px solid rgba(185,28,28,0.3)",
                borderRadius: "3px",
                padding: "8px 0",
                cursor: "default",
              }}
            >
              Return
            </button>
          </div>
        </div>
      </div>
    </MockupShell>
  );
}

function RecordMockup() {
  const stages = [
    { role: "Submitted", actor: "Fatima Abubakar · Staff", when: "15 Apr, 09:14" },
    { role: "Reviewed", actor: "Chinedu Okafor · Finance", when: "15 Apr, 11:02" },
    { role: "Sanctioned", actor: "Aisha Danjuma · MD", when: "15 Apr, 14:32" },
  ];
  return (
    <MockupShell url="app.avrentis.com / vouchers / PV-2026-0041">
      <div style={{ padding: "20px 22px" }}>
        {/* Status strip */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>
            PV-2026-0041
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 500,
              backgroundColor: "rgba(4,120,87,0.08)",
              color: "#047857",
              borderRadius: "3px",
              padding: "2px 6px",
            }}
          >
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#047857" }} />
            Approved
          </span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: "10px", color: "#64748b" }}>
            Permanently on record
          </span>
        </div>

        {/* Approval timeline card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            padding: "14px 16px",
            marginBottom: "12px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 500,
              color: "#64748b",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: "0 0 12px",
            }}
          >
            Approval timeline
          </p>
          <div style={{ position: "relative" }}>
            {/* Vertical rail */}
            <div
              style={{
                position: "absolute",
                left: "9px",
                top: "10px",
                bottom: "10px",
                width: "1px",
                backgroundColor: "#e2e8f0",
              }}
            />
            {stages.map((s) => (
              <div
                key={s.role}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "6px 0",
                }}
              >
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #047857",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  <span style={{ color: "#047857", fontSize: "10px", lineHeight: 1 }}>✓</span>
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {s.role} <span style={{ color: "#64748b", fontWeight: 400 }}>— {s.actor}</span>
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: "2px 0 0" }}>
                    {s.when}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export row */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            style={{
              flex: 1,
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "12px",
              backgroundColor: "#FFFFFF",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
              borderRadius: "3px",
              padding: "8px 0",
              cursor: "default",
            }}
          >
            Download PDF
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "12px",
              backgroundColor: "#FFFFFF",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
              borderRadius: "3px",
              padding: "8px 0",
              cursor: "default",
            }}
          >
            Bank instruction
          </button>
        </div>
      </div>
    </MockupShell>
  );
}

const MOCKUPS = [SubmitMockup, ApproveMockup, RecordMockup];

/* ── Main section ──────────────────────────────────────── */

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const ActiveMockup = MOCKUPS[active];

  // Auto-advance through steps every 6s. Pauses permanently once the user
  // clicks a step number (so the page doesn't fight their intent). Also
  // respects `prefers-reduced-motion`.
  useEffect(() => {
    if (!autoAdvance) return;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const timer = setInterval(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoAdvance]);

  function selectStep(i: number) {
    setActive(i);
    setAutoAdvance(false);
  }

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{ backgroundColor: "#0f172a", padding: "120px 40px" }}
    >
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
              onClick={() => selectStep(i)}
              role="button"
              tabIndex={0}
              aria-label={`Step ${i + 1}: ${step.title}`}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectStep(i); } }}
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
