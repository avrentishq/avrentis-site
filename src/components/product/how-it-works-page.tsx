"use client";

/**
 * HowItWorksPage — the full deep-dive version of the landing page's
 * HowItWorks section. Walks through the complete approval lifecycle in
 * four detailed stages, then explains the role-enforced chains,
 * notification choreography, and contrasts the "old way" with the
 * Avrentis way. Uses the same brand motion spec (fade-up only,
 * 0.4s ease-out, no scale/rotation).
 */

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  FileCheck,
  UserCheck,
  Signature,
  Archive,
  Mail,
  MessageCircle,
  Bell,
  Smartphone,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { RoleBadge } from "@/components/ui/role-badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/sections/cta-banner";
import { SubmitStageMockup, ReviewStageMockup, SanctionStageMockup, RecordStageMockup } from "./stage-mockups";

const STAGES = [
  {
    number: "01",
    key: "submit",
    title: "Submit",
    subtitle: "Structured request, not an email.",
    icon: FileCheck,
    body: "Any team member raises a payment voucher, purchase order, or leave request through a typed form — payee details, amount, purpose, department, cost code, supporting attachments. The form rejects incomplete or invalid submissions at the boundary, so the person reviewing never sees a half-formed request.",
    bullets: [
      "Draft-save per step of the wizard — no lost work if the browser crashes",
      "Attach contracts, invoices, quotes — all stored with the document permanently",
      "Automatic reference number assigned on submit (PV-2026-0184, PO-2026-0091)",
      "Duplicate detection on vendor + amount to catch accidental re-submits",
    ],
    Mockup: SubmitStageMockup,
    previewUrl: "app.avrentis.com / vouchers / new",
  },
  {
    number: "02",
    key: "review",
    title: "Review",
    subtitle: "The right person, at the right time, with everything they need.",
    icon: UserCheck,
    body: "The request routes automatically to the first approver — Finance for payments, HOD for POs. They see the full context: payee, amount, purpose, attachments, department budget remaining. They approve, query, or return the request. A query pauses the workflow with a specific question; the original submitter responds in place and the request re-enters the same reviewer's queue.",
    bullets: [
      "Role-based routing — approvers only see what they're responsible for",
      "In-context querying — no lost Slack threads, no restart of the chain",
      "Out-of-office delegation — the approval auto-routes to a named delegate",
      "Amount-threshold shortcuts — high-value items go straight to the MD",
    ],
    Mockup: ReviewStageMockup,
    previewUrl: "app.avrentis.com / approvals",
  },
  {
    number: "03",
    key: "sanction",
    title: "Sanction",
    subtitle: "Final authority, permanently attached.",
    icon: Signature,
    body: "The Managing Director reviews the request with the full chain of prior approvals visible — what Finance or the HOD said, what the submitter answered to any queries, every signature collected so far. They sanction with their digital signature, which is stamped onto every resulting document. This is the moment authority becomes binding.",
    bullets: [
      "Digital signature captured once, re-used on every approval (with re-confirmation on high-value items)",
      "Quick-approve for amounts below a configurable MD-only threshold",
      "Separation of duties enforced — the MD cannot sanction their own submissions",
      "From phone, tablet, or desktop — approvals are never blocked by location",
    ],
    Mockup: SanctionStageMockup,
    previewUrl: "app.avrentis.com / vouchers / PV-2026-0184",
  },
  {
    number: "04",
    key: "record",
    title: "Record",
    subtitle: "Every action, permanent. Every document, bank-ready.",
    icon: Archive,
    body: "The moment the MD sanctions, Avrentis generates a formatted bank-ready PDF and an audit-ready timeline of the decision. Both are filed in Records automatically. The audit trail — including every query, every revision, every approver signature — becomes tamper-proof. No one, not even a superadmin, can edit a historical entry after the fact.",
    bullets: [
      "Bank-ready payment instruction letter with MD signature + company letterhead",
      "Voucher / PO PDF with the full approval chain printed on the document itself",
      "Immutable audit trail (DB-level trigger blocks UPDATE + DELETE on audit rows)",
      "One-click export of the full period as a regulator-ready bundle",
    ],
    Mockup: RecordStageMockup,
    previewUrl: "app.avrentis.com / vouchers / PV-2026-0184",
  },
];

const PV_CHAIN = [
  { stage: "STAGE 01", role: "staff" as const, label: "Submitter", body: "Any team member raises the voucher with payee, amount, and purpose." },
  { stage: "STAGE 02", role: "finance" as const, label: "Finance reviews", body: "Finance validates budget position and vendor standing before escalation." },
  { stage: "STAGE 03", role: "md" as const, label: "MD sanctions", body: "The MD gives final authority. Bank-ready PDF generates on sign-off." },
];

const PO_CHAIN = [
  { stage: "STAGE 01", role: "staff" as const, label: "Submitter", body: "Staff creates the purchase order with vendor, line items, and justification." },
  { stage: "STAGE 02", role: "hod" as const, label: "HOD approves", body: "Head of Department confirms department need + budget." },
  { stage: "STAGE 03", role: "md" as const, label: "MD sanctions", body: "The MD gives final authority. PO is issued to the vendor." },
];

const NOTIFICATIONS = [
  { icon: Mail, channel: "Email", desc: "Structured approval request with all context + a one-click review link" },
  { icon: MessageCircle, channel: "WhatsApp", desc: "Approver can review and sanction from WhatsApp on their phone" },
  { icon: Bell, channel: "In-app", desc: "Live badge on the approvals inbox with full detail" },
  { icon: Smartphone, channel: "Mobile web", desc: "No native app required — the dashboard works from any browser" },
];

const COMPARISON = [
  {
    old: "Approver A emails approver B, who emails back the requester, who forwards to approver C…",
    avrentis: "One submission travels the defined chain automatically. No one guesses where it is.",
  },
  {
    old: "Printed paper voucher signed in pen, scanned, emailed, filed somewhere.",
    avrentis: "Digital signature attached at sanction. Bank-ready PDF and audit trail generated instantly.",
  },
  {
    old: "\"Who approved this?\" requires an archaeology expedition through 6 months of email.",
    avrentis: "Every action is on the immutable audit trail with actor, role, time, IP, and payload.",
  },
  {
    old: "Quarterly audit means 2 weeks of manual reconciliation and explaining missing records.",
    avrentis: "One-click export delivers a regulator-ready bundle for any period. Auditors show up once, leave satisfied.",
  },
];

function StageRow({ stage, index }: { stage: (typeof STAGES)[number]; index: number }) {
  const reverse = index % 2 === 1;
  const Mockup = stage.Mockup;
  const Icon = stage.icon;
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={fadeUpTransition}
      style={{
        display: "grid",
        gap: "56px",
        alignItems: "center",
      }}
      className={`grid-cols-1 lg:grid-cols-2 ${reverse ? "lg:[direction:rtl] [&>*]:[direction:ltr]" : ""}`}
    >
      {/* Copy */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              backgroundColor: "rgba(198,139,47,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={20} strokeWidth={1.8} color="#C68B2F" aria-hidden="true" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12px",
                fontWeight: 500,
                color: "#C68B2F",
                letterSpacing: "0.06em",
              }}
            >
              STAGE {stage.number}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "28px",
                color: "#0f172a",
                margin: 0,
                letterSpacing: "0.01em",
                lineHeight: 1.2,
              }}
              className="lg:!text-[36px]"
            >
              {stage.title}
            </h2>
          </div>
        </div>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "17px",
            fontWeight: 500,
            color: "#0f172a",
            lineHeight: 1.5,
            margin: "0 0 14px",
          }}
        >
          {stage.subtitle}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "#64748b",
            lineHeight: 1.75,
            margin: "0 0 20px",
          }}
        >
          {stage.body}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          {stage.bullets.map((b) => (
            <li
              key={b}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                color: "#334155",
                lineHeight: 1.6,
              }}
            >
              <Check size={16} strokeWidth={2} color="#C68B2F" style={{ marginTop: "2px", flexShrink: 0 }} aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mockup */}
      <div
        style={{
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#F8FAFC",
          boxShadow: "0 20px 50px rgba(15,23,42,0.08), 0 4px 10px rgba(15,23,42,0.04)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#0f172a",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "6px" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: "10px",
                  height: "10px",
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
              borderRadius: "5px",
              padding: "4px 10px",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            {stage.previewUrl}
          </div>
        </div>
        <Mockup />
      </div>
    </motion.div>
  );
}

type ChainNode = (typeof PV_CHAIN)[number] | (typeof PO_CHAIN)[number];

function ChainCard({
  node,
  index,
  baseDelay,
  active,
}: {
  node: ChainNode;
  index: number;
  baseDelay: number;
  active?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={staggerDelay(baseDelay + index)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        background: "#1e293b",
        border: active ? "1px solid rgba(198,139,47,0.4)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        padding: "20px 18px",
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 500,
          fontSize: "10px",
          letterSpacing: "0.08em",
          color: "#475569",
        }}
      >
        {node.stage}
      </span>
      <RoleBadge role={node.role} />
      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "14px", color: "#ffffff", margin: "2px 0 0" }}>
        {node.label}
      </h3>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
        {node.body}
      </p>
    </motion.div>
  );
}

export function HowItWorksProductPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <>
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          backgroundColor: "#0f172a",
          padding: "120px 40px 96px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AmbientGlow top="-120px" left="-100px" size={520} intensity={0.22} duration={32} />
        <AmbientGlow bottom="-140px" right="-80px" size={560} intensity={0.18} duration={38} delay={0.5} />
        <motion.div
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

        <div style={{ maxWidth: "880px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
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
              display: "inline-block",
              marginBottom: "20px",
            }}
          >
            HOW AVRENTIS WORKS
          </motion.span>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
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
            From request to permanent record —
            <br />
            the complete lifecycle.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "17px",
              color: "#94a3b8",
              lineHeight: 1.7,
              margin: "0 auto 32px",
              maxWidth: "640px",
            }}
          >
            Every payment voucher, purchase order, and HR approval travels the
            same four-stage lifecycle. Structured at submission, routed by
            role, sanctioned by authority, recorded permanently. No email
            threads. No lost approvals. No guessing what changed.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(3)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/contact?intent=trial"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: "#C68B2F",
                color: "#0f172a",
                borderRadius: "6px",
                padding: "0 22px",
                height: "44px",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              Start your 14-day trial
            </Link>
            <a
              href="#lifecycle"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "14px",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                padding: "0 22px",
                height: "44px",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              See the lifecycle →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── LIFECYCLE STAGES ───────────────────────────────── */}
      <section
        id="lifecycle"
        style={{ backgroundColor: "#FFFFFF", padding: "120px 40px", scrollMarginTop: "80px" }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "120px" }}>
          {STAGES.map((stage, i) => (
            <StageRow key={stage.key} stage={stage} index={i} />
          ))}
        </div>
      </section>

      {/* ── APPROVAL CHAINS ────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#0f172a",
          padding: "120px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AmbientGlow top="20%" left="-120px" size={460} intensity={0.15} duration={34} />
        <AmbientGlow bottom="-80px" right="-100px" size={520} intensity={0.13} duration={40} delay={0.5} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
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
            ROLE-ENFORCED AUTHORITY
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
              fontSize: "32px",
              color: "#FFFFFF",
              lineHeight: 1.2,
              margin: "0 0 16px",
              maxWidth: "640px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            Two document types. Two defined chains.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "#94a3b8",
              lineHeight: 1.7,
              margin: "0 0 48px",
              maxWidth: "640px",
            }}
          >
            Payment vouchers follow one authority chain. Purchase orders follow
            another. Each chain is role-enforced, separation-of-duties-safe,
            and permanently on record. Authority at every stage.
          </motion.p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="md:!gap-[32px] lg:!gap-[48px]">
            <div>
              <motion.h3
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(3)}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#C68B2F",
                  marginBottom: "16px",
                }}
              >
                Payment Voucher Chain
              </motion.h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {PV_CHAIN.map((node, i) => (
                  <ChainCard key={node.stage} node={node} index={i} baseDelay={4} active={i === 1} />
                ))}
              </div>
            </div>

            <div>
              <motion.h3
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(3)}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#C68B2F",
                  marginBottom: "16px",
                }}
              >
                Purchase Order Chain
              </motion.h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {PO_CHAIN.map((node, i) => (
                  <ChainCard key={node.stage} node={node} index={i} baseDelay={7} active={i === 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTIFICATIONS ──────────────────────────────────── */}
      <section style={{ backgroundColor: "#f1f5f9", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
            NOTIFICATION CHOREOGRAPHY
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
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 14px",
              maxWidth: "600px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            Approvers hear about requests wherever they are.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "#64748b",
              lineHeight: 1.7,
              margin: "0 0 40px",
              maxWidth: "640px",
            }}
          >
            Every stage of the lifecycle dispatches notifications through the
            channels your approvers actually check. Decision makers are never
            a bottleneck because they are never out of reach.
          </motion.p>

          <div style={{ display: "grid", gap: "16px" }} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {NOTIFICATIONS.map((n, i) => {
              const Icon = n.icon;
              return (
                <motion.div
                  key={n.channel}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={staggerDelay(i + 3)}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(198,139,47,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} strokeWidth={1.8} color="#C68B2F" aria-hidden="true" />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                    {n.channel}
                  </h3>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                    {n.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BEFORE vs AFTER ────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
              marginBottom: "14px",
            }}
          >
            THE CONTRAST
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
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 48px",
              maxWidth: "600px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            What actually changes day-to-day.
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {/* Header row */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "16px 22px",
                borderRight: "1px solid #e2e8f0",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <X size={16} strokeWidth={2} color="#b91c1c" aria-hidden="true" />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                The old way
              </span>
            </div>
            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "16px 22px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ShieldCheck size={16} strokeWidth={1.8} color="#C68B2F" aria-hidden="true" />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0f172a",
                }}
              >
                With Avrentis
              </span>
            </div>

            {COMPARISON.map((row, i) => (
              <div key={row.avrentis} style={{ display: "contents" }}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={staggerDelay(i + 2)}
                  style={{
                    padding: "20px 22px",
                    borderRight: "1px solid #e2e8f0",
                    borderBottom: i < COMPARISON.length - 1 ? "1px solid #e2e8f0" : "none",
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: 1.6,
                  }}
                >
                  {row.old}
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={staggerDelay(i + 2)}
                  style={{
                    padding: "20px 22px",
                    borderBottom: i < COMPARISON.length - 1 ? "1px solid #e2e8f0" : "none",
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#0f172a",
                    lineHeight: 1.6,
                  }}
                >
                  {row.avrentis}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </>
  );
}
