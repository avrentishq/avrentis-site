"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

const slideInFromRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

interface ApprovalRowStatus {
  label: string;
  bg: string;
  text: string;
  dot: string;
}

interface ApprovalRowProps {
  reference: string;
  type: "PV" | "PO";
  status: ApprovalRowStatus;
  label: string;
  submittedBy: string;
  submittedWhen: string;
  amount: string;
  department: string;
  hideDivider?: boolean;
}

// Status presets mirroring STATUS_CONFIG in the real platform
const STATUS = {
  underReview: { label: "Under review", bg: "rgba(198,139,47,0.08)", text: "#92400e", dot: "#C68B2F" },
  submitted: { label: "Submitted", bg: "rgba(180,83,9,0.08)", text: "#78350f", dot: "#b45309" },
  queried: { label: "Queried", bg: "rgba(91,33,182,0.08)", text: "#3B0764", dot: "#5B21B6" },
  approved: { label: "Approved", bg: "rgba(4,120,87,0.08)", text: "#047857", dot: "#047857" },
} as const;

// Candidate rows the middle slot rotates through
const MIDDLE_POOL: Omit<ApprovalRowProps, "hideDivider">[] = [
  {
    reference: "PO-2026-0091",
    type: "PO",
    status: STATUS.submitted,
    label: "Greenfields Logistics Ltd.",
    submittedBy: "Tunde Okafor",
    submittedWhen: "4h ago",
    amount: "₦1,240,000",
    department: "Supply Chain",
  },
  {
    reference: "PV-2026-0182",
    type: "PV",
    status: STATUS.underReview,
    label: "Summit Office Supplies",
    submittedBy: "Ifeoma Nwachukwu",
    submittedWhen: "6h ago",
    amount: "₦215,000",
    department: "Administration",
  },
  {
    reference: "PO-2026-0090",
    type: "PO",
    status: STATUS.submitted,
    label: "Horizon Facility Services",
    submittedBy: "Adewale Bankole",
    submittedWhen: "Yesterday",
    amount: "₦680,000",
    department: "Facilities",
  },
];

function LiveInbox() {
  // Top-row status cycles between under-review and approved to create
  // subtle ambient activity without rearranging the layout.
  const [topStatus, setTopStatus] = useState<ApprovalRowStatus>(STATUS.underReview);
  // Middle slot rotates through MIDDLE_POOL entries one at a time.
  const [middleIndex, setMiddleIndex] = useState(0);

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    // Cycle the top-row status on a ~4.5s interval. Stays "Approved" for
    // 2s so the state change is legible, then resets.
    const statusTimer = setInterval(() => {
      setTopStatus(STATUS.approved);
      setTimeout(() => setTopStatus(STATUS.underReview), 2000);
    }, 4500);

    // Rotate the middle row every ~5s — slightly offset from the status
    // timer so the two events rarely overlap.
    const middleTimer = setInterval(() => {
      setMiddleIndex((i) => (i + 1) % MIDDLE_POOL.length);
    }, 5000);

    return () => {
      clearInterval(statusTimer);
      clearInterval(middleTimer);
    };
  }, []);

  const middle = MIDDLE_POOL[middleIndex]!;

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: "6px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* Row 1 — static row, animated status */}
      <ApprovalRow
        reference="PV-2026-0184"
        type="PV"
        status={topStatus}
        label="Brightpath Technologies"
        submittedBy="Fatima Abubakar"
        submittedWhen="2h ago"
        amount="₦850,000"
        department="Operations"
      />

      {/* Row 2 — rotates through MIDDLE_POOL with an AnimatePresence fade */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={middle.reference}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ApprovalRow {...middle} />
        </motion.div>
      </AnimatePresence>

      {/* Row 3 — static */}
      <ApprovalRow
        reference="PV-2026-0183"
        type="PV"
        status={STATUS.queried}
        label="Sahara Engineering Services"
        submittedBy="Chinelo Adeyemi"
        submittedWhen="Yesterday"
        amount="₦420,000"
        department="Facilities"
        hideDivider
      />
    </div>
  );
}

/**
 * ApprovalRow — visually mirrors BulkApprovalList rows in the real platform.
 * Accent bar on the left, reference + type tag + status badge inline, label,
 * submitter + relative time underneath, amount + department right-aligned.
 */
function ApprovalRow({
  reference,
  type,
  status,
  label,
  submittedBy,
  submittedWhen,
  amount,
  department,
  hideDivider = false,
}: ApprovalRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        borderBottom: hideDivider ? "none" : "1px solid #e2e8f0",
      }}
    >
      {/* Accent urgency bar */}
      <div
        style={{
          width: "4px",
          height: "36px",
          borderRadius: "2px",
          backgroundColor: "#C68B2F",
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Reference + type + status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "2px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontFeatureSettings: '"tnum" 1',
              fontSize: "12px",
              fontWeight: 500,
              color: "#0f172a",
              letterSpacing: "0.02em",
            }}
          >
            {reference}
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
            {type}
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 500,
                backgroundColor: status.bg,
                color: status.text,
                borderRadius: "3px",
                padding: "2px 6px",
                letterSpacing: "0.02em",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: status.dot,
                  display: "inline-block",
                }}
              />
              {status.label}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            fontWeight: 500,
            color: "#0f172a",
            margin: "0 0 2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </p>

        {/* Submitter + time */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            color: "#64748b",
            margin: 0,
          }}
        >
          Submitted by {submittedBy} &middot; {submittedWhen}
        </p>
      </div>

      {/* Amount + department */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontFeatureSettings: '"tnum" 1',
            fontSize: "14px",
            fontWeight: 500,
            color: "#0f172a",
            margin: "0 0 2px",
          }}
        >
          {amount}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            color: "#64748b",
            margin: 0,
          }}
        >
          {department}
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      style={{
        backgroundColor: "#0f172a",
        padding: "140px 40px 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gap: "48px",
          alignItems: "center",
          position: "relative",
        }}
        className="grid-cols-1 lg:grid-cols-2"
      >
        {/* Left — Copy */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C68B2F",
              marginBottom: "20px",
            }}
          >
            OPERATIONAL AUTHORITY PLATFORM
          </motion.span>

          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "36px",
              color: "#FFFFFF",
              lineHeight: 1.15,
              margin: "0 0 24px",
            }}
            className="lg:!text-[56px]"
          >
            {["Every", "action.", "On", "record."].map((word, i) => (
              <motion.span
                key={`top-${i}`}
                variants={fadeUp}
                transition={fadeUpTransition}
                style={{ display: "inline-block", marginRight: "0.3em" }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              variants={fadeUp}
              transition={fadeUpTransition}
              style={{ display: "inline-block" }}
            >
              Permanently.
            </motion.span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "18px",
              color: "#64748b",
              lineHeight: 1.7,
              margin: "0 0 36px",
              maxWidth: "520px",
            }}
          >
            Most organisations run on scattered emails, informal approvals, and
            undocumented decisions. Avrentis brings structure, visibility, and
            accountability to every process your organisation runs —
            permanently.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(3)}
            style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
          >
            <a
              href="/contact"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: 1,
                backgroundColor: "#C68B2F",
                color: "#0f172a",
                border: "none",
                borderRadius: "6px",
                height: "48px",
                padding: "0 28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                cursor: "pointer",
                transition: "background-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#A87425";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#C68B2F";
              }}
            >
              Start for free
            </a>
            <a
              href="#how-it-works"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: 1,
                backgroundColor: "transparent",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                height: "48px",
                padding: "0 28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                cursor: "pointer",
                transition: "border-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              See how it works &rarr;
            </a>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(4)}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "13px",
              color: "#475569",
              marginTop: "24px",
              lineHeight: 1.5,
            }}
          >
            No credit card required &middot; Setup in minutes &middot;
            Organisations across Africa and beyond
          </motion.p>
        </div>

        {/* Right — Desktop approval inbox preview (mirrors the real platform UI) */}
        <motion.div
          variants={slideInFromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(4)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Browser window frame */}
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.10)",
              backgroundColor: "#F8FAFC",
              boxShadow:
                "0 0 60px rgba(198,139,47,0.06), 0 30px 60px rgba(0,0,0,0.45)",
              overflow: "hidden",
            }}
          >
            {/* Browser chrome */}
            <div
              style={{
                backgroundColor: "#0f172a",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: "5px",
                  padding: "4px 10px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "#94a3b8",
                  textAlign: "center",
                }}
              >
                app.avrentis.com / approvals
              </div>
            </div>

            {/* Page content */}
            <div style={{ padding: "24px 28px" }}>
              {/* Page heading */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 400,
                      fontSize: "20px",
                      color: "#0f172a",
                      margin: 0,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Approvals
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      color: "#64748b",
                      margin: "2px 0 0",
                    }}
                  >
                    3 documents awaiting your review
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#C68B2F",
                    backgroundColor: "rgba(198,139,47,0.08)",
                    border: "1px solid rgba(198,139,47,0.2)",
                    borderRadius: "3px",
                    padding: "3px 8px",
                  }}
                >
                  MD review
                </span>
              </div>

              {/* Inbox list — white card with divide-y rows. The top row
                  cycles its status badge between "Under review" → "Approved"
                  to create subtle ambient activity; the middle row rotates
                  through a small pool of realistic entries every few seconds. */}
              <LiveInbox />


              {/* Footer hint */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "#94a3b8",
                  margin: "14px 0 0",
                  textAlign: "right",
                }}
              >
                Showing 3 of 3 &middot; Every action is permanently recorded
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
