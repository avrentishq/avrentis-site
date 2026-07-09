"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import Image from "next/image";

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
  /** Optional trailing control (e.g. the interactive Approve button on row 1). */
  action?: React.ReactNode;
}

// Status presets mirroring STATUS_CONFIG in the real platform
const STATUS = {
  underReview: {
    label: "Under review",
    bg: "rgba(var(--color-gold-rgb), 0.08)",
    text: "#92400e",
    dot: "var(--color-gold)",
  },
  submitted: {
    label: "Submitted",
    bg: "rgba(180,83,9,0.08)",
    text: "#78350f",
    dot: "#b45309",
  },
  queried: {
    label: "Queried",
    bg: "rgba(91,33,182,0.08)",
    text: "#3B0764",
    dot: "#5B21B6",
  },
  approved: {
    label: "Approved",
    bg: "rgba(4,120,87,0.08)",
    text: "#047857",
    dot: "#047857",
  },
  recorded: {
    label: "Recorded",
    bg: "rgba(4,120,87,0.08)",
    text: "#047857",
    dot: "#047857",
  },
} as const;

// The one-click CTA offered on a row depends on where it is in the flow, so
// the demo shows a realistic mix (not just "Approve"). Whatever the verb, the
// outcome is the same product promise: a permanent, audited record.
const CTA_VERB: Record<string, string> = {
  "Under review": "Approve",
  Submitted: "Review",
  Queried: "Respond",
};

// The full feed the list rotates through. First four are the default (and
// reduced-motion) view; a mix of business and NGO / donor-funded flows so the
// hero speaks to both — same approval authority and audit trail either way.
const POOL: Omit<ApprovalRowProps, "hideDivider" | "action">[] = [
  {
    reference: "PV-2026-0184",
    type: "PV",
    status: STATUS.underReview,
    label: "Brightpath Technologies",
    submittedBy: "Fatima Abubakar",
    submittedWhen: "2h ago",
    amount: "₦850,000",
    department: "Operations",
  },
  {
    reference: "PV-2026-0181",
    type: "PV",
    status: STATUS.underReview,
    label: "Kano field office — beneficiary stipends",
    submittedBy: "Amina Bello",
    submittedWhen: "3h ago",
    amount: "₦1,450,000",
    department: "Programmes",
  },
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
    reference: "PV-2026-0183",
    type: "PV",
    status: STATUS.queried,
    label: "Sahara Engineering Services",
    submittedBy: "Chinelo Adeyemi",
    submittedWhen: "Yesterday",
    amount: "₦420,000",
    department: "Facilities",
  },
  {
    reference: "PV-2026-0175",
    type: "PV",
    status: STATUS.submitted,
    label: "WASH project — Q2 grant expense",
    submittedBy: "Grace Eze",
    submittedWhen: "Yesterday",
    amount: "₦2,310,000",
    department: "Grants & Compliance",
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
    reference: "PV-2026-0171",
    type: "PV",
    status: STATUS.underReview,
    label: "Enugu outreach — medical supplies",
    submittedBy: "Chidi Okonkwo",
    submittedWhen: "1d ago",
    amount: "₦1,180,000",
    department: "Programmes",
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
  {
    reference: "PO-2026-0088",
    type: "PO",
    status: STATUS.submitted,
    label: "Lagos clinic — vaccine cold-chain units",
    submittedBy: "Ngozi Umeh",
    submittedWhen: "5h ago",
    amount: "₦3,120,000",
    department: "Programmes",
  },
  {
    reference: "PV-2026-0169",
    type: "PV",
    status: STATUS.underReview,
    label: "Scholarship disbursement — 2026 cohort",
    submittedBy: "Yusuf Aliyu",
    submittedWhen: "1d ago",
    amount: "₦4,750,000",
    department: "Grants & Compliance",
  },
  {
    reference: "PV-2026-0167",
    type: "PV",
    status: STATUS.submitted,
    label: "Ikeja HQ — annual software renewal",
    submittedBy: "Blessing Obi",
    submittedWhen: "2d ago",
    amount: "₦1,920,000",
    department: "IT",
  },
  {
    reference: "PV-2026-0164",
    type: "PV",
    status: STATUS.underReview,
    label: "Farmers' co-op — input subsidy batch 3",
    submittedBy: "Hauwa Sani",
    submittedWhen: "2d ago",
    amount: "₦2,680,000",
    department: "Programmes",
  },
  {
    reference: "PO-2026-0085",
    type: "PO",
    status: STATUS.submitted,
    label: "Port Harcourt depot — fuel & logistics",
    submittedBy: "Emeka Nwosu",
    submittedWhen: "2d ago",
    amount: "₦940,000",
    department: "Operations",
  },
  {
    reference: "PV-2026-0162",
    type: "PV",
    status: STATUS.queried,
    label: "Staff medical retainer — Q3",
    submittedBy: "Zainab Bello",
    submittedWhen: "3d ago",
    amount: "₦560,000",
    department: "People",
  },
];

function LiveInbox({
  approved,
  onApprove,
}: {
  approved: boolean;
  onApprove: () => void;
}) {
  // The whole list is a live feed: every few seconds all four visible slots
  // advance one step through POOL, cross-fading in a staggered cascade so the
  // list reads as continuously updating rather than one twitching row.
  // Rotation freezes once the visitor approves the top row (their action is
  // acknowledged) and is disabled entirely under reduced-motion.
  const VISIBLE = 4;
  const [tick, setTick] = useState(0);
  // Which visible slot currently offers a one-click CTA. Starts at the top
  // (deterministic, so SSR and first client render agree) then hops to a
  // random row each tick — the button is never pinned to one row or action.
  const [activeRow, setActiveRow] = useState(0);
  // The slot the visitor acted on — frozen into a "Recorded" done-state.
  const [engagedRow, setEngagedRow] = useState<number | null>(null);

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || approved) return;

    const timer = setInterval(() => {
      setTick((t) => (t + 1) % POOL.length);
      setActiveRow(Math.floor(Math.random() * VISIBLE));
    }, 4000);

    return () => clearInterval(timer);
  }, [approved]);

  const rows = Array.from(
    { length: VISIBLE },
    (_, i) => POOL[(tick + i) % POOL.length]!,
  );

  const handleEngage = (rowIndex: number) => {
    setEngagedRow(rowIndex);
    onApprove();
  };

  return (
    <div
      style={{
        // Liquid glass: frosted translucent card so the light-trails refract
        // through the list too. Kept light enough (compounds with the frosted
        // window behind it) that the dark row text stays legible.
        backgroundColor: "rgba(255,255,255,0.64)",
        backdropFilter: "blur(22px) saturate(1.4)",
        WebkitBackdropFilter: "blur(22px) saturate(1.4)",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      {rows.map((entry, i) => {
        const isLast = i === VISIBLE - 1;
        // The acted-on row freezes into a neutral "Recorded" state — whatever
        // the verb was, the payoff is the same permanent, audited record.
        const isDone = engagedRow === i;
        const status = isDone ? STATUS.recorded : entry.status;
        // One live CTA at a time, on a random slot; verb depends on the row's
        // stage (Approve / Review / Respond). Any click freezes the feed and
        // reveals the reciprocity nudge.
        const showCta = !approved && i === activeRow;
        return (
          <AnimatePresence key={`slot-${i}`} mode="wait" initial={false}>
            <m.div
              key={entry.reference}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.06 }}
            >
              <ApprovalRow
                {...entry}
                status={status}
                hideDivider={isLast}
                action={
                  showCta ? (
                    <ApproveButton
                      onApprove={() => handleEngage(i)}
                      reference={entry.reference}
                      label={CTA_VERB[entry.status.label] ?? "Approve"}
                    />
                  ) : undefined
                }
              />
            </m.div>
          </AnimatePresence>
        );
      })}
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
  action,
}: ApprovalRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        borderBottom: hideDivider ? "none" : "1px solid rgba(15,23,42,0.08)",
      }}
    >
      {/* Accent urgency bar */}
      <div
        style={{
          width: "4px",
          height: "36px",
          borderRadius: "2px",
          backgroundColor: "var(--color-gold)",
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
              color: "var(--color-gold)",
              borderRadius: "3px",
              padding: "1px 5px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {type}
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <m.span
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
            </m.span>
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

      {action}
    </div>
  );
}

/**
 * ApproveButton — the one genuinely interactive control in the hero mock.
 * Lets a visitor action the top approval with no signup (reciprocity: value
 * before the ask). Motion stays within brand rules (opacity/colour only).
 */
function ApproveButton({
  onApprove,
  reference,
  label = "Approve",
}: {
  onApprove: () => void;
  reference: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onApprove}
      aria-label={`${label} ${reference}`}
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: "12px",
        lineHeight: 1,
        backgroundColor: "var(--color-gold)",
        color: "#0f172a",
        border: "none",
        borderRadius: "9999px",
        height: "30px",
        padding: "0 16px",
        marginLeft: "4px",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background-color 150ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-gold-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-gold)";
      }}
    >
      {label}
    </button>
  );
}

export function Hero() {
  // Whether the visitor has approved the sample document in the hero mock.
  const [approved, setApproved] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // Scroll-linked parallax on the grid texture — drifts up by 60px across
  // the section's full scroll, giving a subtle depth cue.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "#0f172a",
        padding: "140px 40px 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Backdrop — night light-trails: every action, captured and recorded.
          Held well back with a navy scrim so the headline stays legible and
          the warm trails read as navy/gold rather than red. */}
      <Image
        src="/hero/hero-trails-6.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition: "center 45%",
          opacity: 0.62,
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "linear-gradient(90deg, rgba(15,23,42,0.93) 0%, rgba(15,23,42,0.74) 42%, rgba(15,23,42,0.4) 100%), linear-gradient(180deg, rgba(15,23,42,0.32) 0%, rgba(15,23,42,0.68) 100%)",
        }}
      />

      {/* Ambient glow layers — sit behind everything, non-interactive */}
      <AmbientGlow
        top="-120px"
        left="-120px"
        size={520}
        intensity={0.22}
        duration={32}
      />
      <AmbientGlow
        bottom="-140px"
        right="-100px"
        size={560}
        intensity={0.18}
        duration={38}
        delay={0.5}
      />

      {/* Subtle grid texture overlay with scroll-linked parallax */}
      <m.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          y: gridY,
          zIndex: 1,
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
          zIndex: 2,
        }}
        className="grid-cols-1 lg:grid-cols-2"
      >
        {/* Left — Copy */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <m.span
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
              color: "var(--color-gold)",
              marginBottom: "20px",
            }}
          >
            OPERATIONAL AUTHORITY PLATFORM
          </m.span>

          <m.h1
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
              <m.span
                key={`top-${i}`}
                variants={fadeUp}
                transition={fadeUpTransition}
                style={{ display: "inline-block", marginRight: "0.3em" }}
              >
                {word}
              </m.span>
            ))}
            <br />
            <m.span
              variants={fadeUp}
              transition={fadeUpTransition}
              style={{ display: "inline-block" }}
            >
              Permanently.
            </m.span>
          </m.h1>

          <m.p
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
          </m.p>

          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(3)}
            style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
          >
            <a
              href="/trial"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: 1,
                backgroundColor: "var(--color-gold)",
                color: "#0f172a",
                border: "none",
                borderRadius: "9999px",
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
                e.currentTarget.style.backgroundColor =
                  "var(--color-gold-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-gold)";
              }}
            >
              Start your 14-day trial
            </a>
            <a
              href="#how-it-works"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: 1,
                backgroundColor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px) saturate(1.4)",
                WebkitBackdropFilter: "blur(12px) saturate(1.4)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.22)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
                borderRadius: "9999px",
                height: "48px",
                padding: "0 28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                cursor: "pointer",
                transition:
                  "border-color 150ms ease, background-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.08)";
              }}
            >
              See how it works &rarr;
            </a>
          </m.div>

          <m.p
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
            Organisations across Nigeria and Africa
          </m.p>
        </div>

        {/* Right — Desktop approval inbox preview (mirrors the real platform UI) */}
        <m.div
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
          {/* Browser window frame — liquid glass: a frosted translucent
              surface that refracts the light-trails behind it, with a
              specular top edge. The inbox card inside stays opaque so the
              product UI reads crisply. */}
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.45)",
              backgroundColor: "rgba(248,250,252,0.72)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.65), 0 0 60px rgba(var(--color-gold-rgb), 0.06), 0 30px 60px rgba(0,0,0,0.5)",
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
                Avrentis / approvals
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
                    4 documents awaiting your review
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "var(--color-gold-on-light)",
                    backgroundColor: "rgba(var(--color-gold-rgb), 0.08)",
                    border: "1px solid rgba(var(--color-gold-rgb), 0.2)",
                    borderRadius: "3px",
                    padding: "3px 8px",
                  }}
                >
                  MD review
                </span>
              </div>

              {/* Inbox list — a live feed of glass rows. All four slots rotate
                  through the pool every few seconds; a single one-click CTA
                  (Approve / Review / Respond) hops to a random row. Acting on
                  any of them freezes the feed and reveals the nudge below. */}
              <LiveInbox
                approved={approved}
                onApprove={() => setApproved(true)}
              />

              {/* Post-approval nudge — the reciprocity payoff: they used the
                  loop, now the ask. */}
              {approved ? (
                <m.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: "14px 0 0",
                    padding: "10px 12px",
                    backgroundColor: "rgba(4,120,87,0.07)",
                    border: "1px solid rgba(4,120,87,0.20)",
                    borderRadius: "8px",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ color: "#047857", fontWeight: 700, flexShrink: 0 }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      color: "#334155",
                      lineHeight: 1.5,
                    }}
                  >
                    Recorded &mdash; permanently, with a full audit trail.
                    That&rsquo;s the core loop.{" "}
                    <a
                      href="/trial"
                      style={{
                        color: "var(--color-gold-on-light)",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Run it on your own approvals &rarr;
                    </a>
                  </span>
                </m.div>
              ) : (
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    color: "#94a3b8",
                    margin: "14px 0 0",
                    textAlign: "right",
                  }}
                >
                  Showing 4 of 4 &middot; Act on one &mdash; it&rsquo;s
                  permanently recorded
                </p>
              )}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
