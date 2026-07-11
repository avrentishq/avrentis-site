"use client";

/**
 * StatusProductPage — a static operational snapshot.
 *
 * This page is deliberately not tied to a live monitoring provider yet.
 * Enterprise customers receive incident notifications under their order
 * form directly; this page gives the general audience a truthful picture
 * of subsystem health and recent incidents. When we integrate with a
 * third-party status provider (Instatus / BetterStack / Statuspage),
 * this component will become the embed shell for that feed.
 */

import Link from "next/link";
import { m } from "framer-motion";
import { CheckCircle2, CircleAlert, CircleDashed } from "lucide-react";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";

const sans = "var(--font-sans)";
const mono = "'IBM Plex Mono', monospace";

type Status = "operational" | "degraded" | "outage" | "maintenance";

const STATUS_STYLES: Record<Status, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  operational: {
    label: "Operational",
    color: "#047857",
    bg: "rgba(4,120,87,0.10)",
    icon: CheckCircle2,
  },
  degraded: {
    label: "Degraded",
    color: "var(--color-gold-on-light)",
    bg: "rgba(var(--color-gold-rgb), 0.10)",
    icon: CircleAlert,
  },
  outage: {
    label: "Outage",
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.10)",
    icon: CircleAlert,
  },
  maintenance: {
    label: "Maintenance",
    color: "#0369a1",
    bg: "rgba(3,105,161,0.10)",
    icon: CircleDashed,
  },
};

interface Subsystem {
  name: string;
  description: string;
  status: Status;
}

const SUBSYSTEMS: Subsystem[] = [
  { name: "Dashboard", description: "Web application — app.avrentis.com", status: "operational" },
  { name: "REST API", description: "Programmatic access — api.avrentis.com", status: "operational" },
  { name: "Authentication", description: "Sign-in, SSO, SCIM, MFA", status: "operational" },
  { name: "Approval engine", description: "Workflow state machine + audit trail", status: "operational" },
  { name: "Notifications", description: "Email, WhatsApp, SMS dispatch", status: "operational" },
  { name: "Document storage", description: "Attachments + bank-ready PDF generation", status: "operational" },
  { name: "Database", description: "Managed Postgres", status: "operational" },
  { name: "Background jobs", description: "Scheduled tasks — cron, retention, reports", status: "operational" },
];

const OVERALL: Status = SUBSYSTEMS.every((s) => s.status === "operational") ? "operational" : "degraded";

interface PastIncident {
  date: string;
  title: string;
  body: string;
  resolved: true;
}

const INCIDENTS: PastIncident[] = [];

export function StatusProductPage() {
  const overall = STATUS_STYLES[OVERALL];
  const OverallIcon = overall.icon;

  return (
    <>
      <Navbar />

      <main id="main" style={{ backgroundColor: "#f8fafc", padding: "100px 32px 100px", minHeight: "70vh" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <m.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-gold-on-light)",
              display: "block",
              marginBottom: "16px",
            }}
          >
            STATUS
          </m.span>

          <m.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 500,
              fontSize: "36px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 18px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[44px]"
          >
            Avrentis platform status.
          </m.h1>

          {/* ── Overall status band ────────────────────────── */}
          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(2)}
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${overall.color}33`,
              borderRadius: "12px",
              padding: "24px 28px",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: overall.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <OverallIcon size={22} strokeWidth={1.8} color={overall.color} aria-hidden="true" />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: sans,
                  fontWeight: 600,
                  fontSize: "18px",
                  color: "#0f172a",
                  margin: "0 0 4px",
                }}
              >
                All systems operational.
              </h2>
              <p style={{ fontFamily: sans, fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.55 }}>
                Current snapshot. Enterprise customers receive incident
                notifications directly under their order form —{" "}
                <Link href="/contact?intent=subscribe" style={{ color: "var(--color-gold-on-light)", textDecoration: "none" }}>
                  subscribe to general status updates
                </Link>
                .
              </p>
            </div>
          </m.div>

          {/* ── Subsystems ─────────────────────────────────── */}
          <m.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(3)}
            aria-label="Subsystem status"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "40px",
              position: "relative",
              isolation: "isolate",
            }}
          >
            <SectionBackdrop src={SECTION_BACKDROPS.statusSubsystems} scrim="light" />
            <div
              style={{
                padding: "14px 20px",
                backgroundColor: "#F8FAFC",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  color: "#64748b",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Subsystems
              </span>
              <span style={{ fontFamily: mono, fontSize: "10px", color: "#64748b", letterSpacing: "0.04em" }}>
                Last verified today
              </span>
            </div>
            {SUBSYSTEMS.map((sub, i) => {
              const s = STATUS_STYLES[sub.status];
              const Icon = s.icon;
              return (
                <div
                  key={sub.name}
                  style={{
                    padding: "16px 20px",
                    borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: sans, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                      {sub.name}
                    </div>
                    <div
                      style={{
                        fontFamily: sans,
                        fontSize: "12px",
                        color: "#64748b",
                        lineHeight: 1.5,
                        marginTop: "2px",
                      }}
                    >
                      {sub.description}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: "10px",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      color: s.color,
                      backgroundColor: s.bg,
                      border: `1px solid ${s.color}33`,
                      borderRadius: "3px",
                      padding: "4px 10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={11} strokeWidth={2} color={s.color} aria-hidden="true" />
                    {s.label.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </m.section>

          {/* ── Past incidents ─────────────────────────────── */}
          <m.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(4)}
            aria-label="Incident history"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "24px 28px",
              position: "relative",
              overflow: "hidden",
              isolation: "isolate",
            }}
          >
            <SectionBackdrop src={SECTION_BACKDROPS.statusIncidents} scrim="light" />
            <h3
              style={{
                fontFamily: sans,
                fontWeight: 600,
                fontSize: "14px",
                color: "#0f172a",
                margin: "0 0 12px",
                letterSpacing: "0.01em",
              }}
            >
              Incident history
            </h3>
            {INCIDENTS.length === 0 ? (
              <p style={{ fontFamily: sans, fontSize: "13px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                No reportable incidents in the most recent 90-day window. Future
                incidents will be posted here with timeline, impact, and a
                post-incident note.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {INCIDENTS.map((inc) => (
                  <div key={inc.title}>
                    <div style={{ fontFamily: mono, fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
                      {inc.date}
                    </div>
                    <div style={{ fontFamily: sans, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                      {inc.title}
                    </div>
                    <div style={{ fontFamily: sans, fontSize: "13px", color: "#64748b", lineHeight: 1.65, marginTop: "4px" }}>
                      {inc.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </m.section>

          {/* ── Footer note ────────────────────────────────── */}
          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(5)}
            style={{
              fontFamily: sans,
              fontSize: "12px",
              color: "#64748b",
              lineHeight: 1.7,
              margin: "32px 0 0",
              textAlign: "center",
            }}
          >
            Live uptime monitoring and a dedicated status subdomain are on the
            way. Until then this page is hand-curated and updated as conditions
            change. See the{" "}
            <Link href="/trust" style={{ color: "var(--color-gold-on-light)", textDecoration: "none" }}>
              trust centre
            </Link>{" "}
            for the controls behind the platform.
          </m.p>
        </div>
      </main>

      <Footer />
    </>
  );
}
