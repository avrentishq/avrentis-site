"use client";

/**
 * SecurityProductPage — the full /product/security deep-dive.
 *
 * Not a module page — security is cross-cutting. Uses the same visual
 * language and motion spec as /product/how-it-works (dark hero, light
 * stack rows with browser-framed mockups, honest framing).
 *
 * Content is grounded in the platform's actual implementation: RLS,
 * RBAC/ABAC, Redis-backed session revocation, MFA, IP allowlist, SCIM,
 * immutable audit trail. No certification claims — controls-aligned
 * framing only, per the stated trust posture.
 */

import { useRef } from "react";
import Link from "next/link";
import { m, useScroll, useTransform } from "framer-motion";
import {
  Database,
  ShieldCheck,
  KeyRound,
  FileSearch,
  UserCog,
  Lock,
  Check,
  Mail,
} from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { SECURITY_FAQS } from "@/lib/security-faqs";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/sections/cta-banner";
import {
  IsolationMockup,
  AuthorityMockup,
  SessionMockup,
  AuditMockup,
  LifecycleMockup,
  InfraMockup,
} from "./security-mockups";

const PILLARS = [
  {
    icon: Database,
    title: "Your data is yours — always",
    body:
      "Each customer's workspace is walled off from every other, directly inside the database. Not a rule we enforce with the app — a rule enforced by the database engine itself. There is no path from one customer's session to another's.",
  },
  {
    icon: UserCog,
    title: "Real authority, not just a role label",
    body:
      "Roles don't just hide buttons — they decide what every single action is allowed to do. Plus a second layer of rules on top: who can approve what, within which department, up to what amount. Checked on every click.",
  },
  {
    icon: FileSearch,
    title: "Every action is permanent",
    body:
      "Every submission, approval, question, and role change is recorded. Nobody can edit the record after the fact — not us, not your administrator, not even the database's top-level user. The history is the history.",
  },
  {
    icon: KeyRound,
    title: "Access that keeps up with your people",
    body:
      "When someone joins, they get what their role requires — automatically, from your identity system. When someone leaves or changes role, their access ends within seconds. Auditors and board-level guests get a clear start date and expiry.",
  },
];

const STACK = [
  {
    number: "01",
    key: "isolation",
    title: "Isolation",
    subtitle: "Your data is yours — no other customer can ever see it. Enforced by the database itself, not just by the app.",
    body:
      "Every tenant-scoped query runs inside a transactional context that sets a Postgres session variable. Row-level security policies on every table match on that variable before returning a row. Cross-tenant access is impossible by construction — a query that forgets the tenant context returns nothing rather than another tenant's rows.",
    icon: Database,
    bullets: [
      "Postgres RLS policies applied to every tenant-scoped table",
      "Tenant-scoped SQL is routed through a context wrapper — bare queries fail RLS by design",
      "Queries fail closed: without an explicit tenant context, row-level security returns no rows",
      "Drizzle migrations are gated by a safety check that blocks policy drops",
    ],
    Mockup: IsolationMockup,
    previewUrl: "tenant isolation · database layer",
  },
  {
    number: "02",
    key: "authority",
    title: "Authority",
    subtitle: "Two layers of control: what your role lets you do in general, and what's allowed for this specific request — in this specific department, at this specific amount.",
    body:
      "RBAC determines the set of capabilities a role can exercise — a fine-grained permission system with clean separation between administrative and operational capability. ABAC then evaluates the specific request: can the submitter approve their own document, is the Head of Department acting within their department, does the amount exceed their threshold.",
    icon: UserCog,
    bullets: [
      "A fine-grained permission system with clean separation between administrative and operational capability",
      "Separation of duties — submitters cannot approve their own requests",
      "Department scope — Heads of Department act only on their own department",
      "Amount thresholds — high-value requests auto-escalate to the MD",
    ],
    Mockup: AuthorityMockup,
    previewUrl: "role-based authority · attribute overlays",
  },
  {
    number: "03",
    key: "session",
    title: "Session integrity",
    subtitle: "When a role changes or a user leaves, their active sessions are invalid within seconds.",
    body:
      "Every active session is checked against a revocation signal on every request. A role change, deactivation, password change, access expiry, or tenant-wide revocation forces re-authentication on the next request. Two-factor sign-in uses standard time-based codes with secured recovery codes. Per-tenant IP allowlisting (both IPv4 and IPv6) is available as a hard sign-in gate.",
    icon: ShieldCheck,
    bullets: [
      "Active sessions end within seconds of a role change, deactivation, or password change",
      "Two-factor sign-in with recovery codes; required for platform administrators",
      "Per-tenant IP allowlist (IPv4 and IPv6) available as a hard sign-in gate",
      "Single sign-on via OpenID Connect (OIDC); SAML 2.0 on the enterprise roadmap. Sensitive tokens encrypted at rest",
    ],
    Mockup: SessionMockup,
    previewUrl: "session revocation · identity controls",
  },
  {
    number: "04",
    key: "audit",
    title: "Audit trail",
    subtitle: "Every action, permanent. Every export, regulator-ready.",
    body:
      "The audit log records actor, role, action, entity, IP, user-agent, and payload for every meaningful event. Role changes and board-access lifecycle events have their own dedicated immutable trails. Database triggers block UPDATE and DELETE on audit rows — the only way to remove them would be to drop the table, which requires DDL that is not granted to the application user.",
    icon: FileSearch,
    bullets: [
      "Every approval, query, and role change written to an append-only log",
      "Dedicated trail for role changes, capturing who changed what and why",
      "Board-access lifecycle fully tracked — provisioning, approval, expiry, renewal, revocation",
      "One-click regulator-ready export for any period",
    ],
    Mockup: AuditMockup,
    previewUrl: "immutable audit trail · role-change log",
  },
  {
    number: "05",
    key: "lifecycle",
    title: "Access lifecycle",
    subtitle: "People come and go — access keeps up. Joiners get what they need; leavers lose access within seconds.",
    body:
      "User provisioning flows in automatically from your identity provider (Okta, Microsoft Entra, Google Workspace). Auditor and board-level guests get a clear start date and expiry — access is withdrawn on the dot without manual clean-up. Document retention follows your plan; the audit trail itself is never purged while the account is active.",
    icon: KeyRound,
    bullets: [
      "Automated user provisioning (SCIM) with Okta, Microsoft Entra, and Google Workspace",
      "Time-bound access for auditors and provisional board members, with automatic revocation",
      "Per-plan document retention, with the audit trail itself never purged",
      "Attachments served through short-lived, per-upload URLs",
    ],
    Mockup: LifecycleMockup,
    previewUrl: "access lifecycle · SCIM provisioning",
  },
  {
    number: "06",
    key: "infra",
    title: "Encryption & infrastructure",
    subtitle: "Encrypted from your browser all the way to our database — and again on top of that, for the most sensitive pieces like two-factor codes and single sign-on tokens.",
    body:
      "All traffic is encrypted with modern TLS. The application database is managed PostgreSQL with encryption at rest and automated daily snapshots. Sensitive application secrets — two-factor codes, single sign-on tokens — are encrypted again at the application layer before being written, so even a database leak would not expose them. Attachments live in encrypted object storage and are delivered through short-lived, per-upload URLs.",
    icon: Lock,
    bullets: [
      "Modern TLS in transit, with strict browser-side policies",
      "Managed PostgreSQL with encryption at rest and daily snapshots",
      "Application-layer encryption on top for sensitive secrets (AES-256-GCM)",
      "Encrypted object storage with short-lived, per-upload delivery URLs",
    ],
    Mockup: InfraMockup,
    previewUrl: "encryption · platform infrastructure",
  },
];

const COMPLIANCE = [
  {
    framework: "SOC 2",
    status: "Controls aligned",
    body:
      "The platform's access, audit, change-management, and encryption controls are designed to meet SOC 2 Type II criteria. A formal audit has not been completed yet.",
  },
  {
    framework: "ISO 27001",
    status: "Controls aligned",
    body:
      "Information-security management practices follow the ISO 27001 Annex A control families relevant to a SaaS operator. Formal certification is not in place today.",
  },
  {
    framework: "GDPR & NDPR",
    status: "Designed-for",
    body:
      "Data-subject rights (access, rectification, deletion, export) are supported through the audit-log export and admin tooling. A DPA is available for signature on request.",
  },
];

const FAQS = SECURITY_FAQS;

function StackRow({ stage, index }: { stage: (typeof STACK)[number]; index: number }) {
  const reverse = index % 2 === 1;
  const Mockup = stage.Mockup;
  const Icon = stage.icon;
  return (
    <m.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={fadeUpTransition}
      style={{ display: "grid", gap: "56px", alignItems: "center" }}
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
              backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={20} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--color-gold-on-light)",
                letterSpacing: "0.06em",
              }}
            >
              LAYER {stage.number}
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
              <Check size={16} strokeWidth={2} color={BRAND_COLORS.gold} style={{ marginTop: "2px", flexShrink: 0 }} aria-hidden="true" />
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
    </m.div>
  );
}

export function SecurityProductPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <>
      <Navbar />
      <main id="main">

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

        <div style={{ maxWidth: "880px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <m.span
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
              color: "var(--color-gold)",
              display: "inline-block",
              marginBottom: "20px",
            }}
          >
            SECURITY
          </m.span>
          <m.h1
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
            Authority at every layer.
            <br />
            By design.
          </m.h1>
          <m.p
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
            Avrentis is built for organisations where every approval carries
            weight. Security is not a feature bolted on later — it is the
            structural premise of the platform. Here is exactly what that
            means, layer by layer.
          </m.p>
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(3)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/contact?intent=security"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: "var(--color-gold)",
                color: "#0f172a",
                borderRadius: "6px",
                padding: "0 22px",
                height: "44px",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              Book a security review
            </Link>
            <a
              href="#stack"
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
              Read the stack →
            </a>
          </m.div>
        </div>
      </section>

      {/* ── PILLARS ────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <m.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--color-gold-on-light)",
              display: "block",
              marginBottom: "12px",
            }}
          >
            TRUST POSTURE
          </m.span>
          <m.h2
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
              maxWidth: "620px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            Four foundations. Each built in at the deepest level — not just something the app tries to do.
          </m.h2>

          <div style={{ display: "grid", gap: "20px" }} className="grid-cols-1 md:grid-cols-2">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <m.div
                  key={p.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={staggerDelay(i + 2)}
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "18px",
                      color: "#0f172a",
                      margin: "4px 0 0",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      color: "#64748b",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {p.body}
                  </p>
                </m.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STACK ──────────────────────────────────────────── */}
      <section id="stack" style={{ backgroundColor: "#FFFFFF", padding: "120px 40px", scrollMarginTop: "80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "120px" }}>
          {STACK.map((s, i) => (
            <StackRow key={s.key} stage={s} index={i} />
          ))}
        </div>
      </section>

      {/* ── COMPLIANCE POSTURE ─────────────────────────────── */}
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
          <m.span
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
              color: "var(--color-gold)",
              display: "block",
              marginBottom: "16px",
            }}
          >
            COMPLIANCE POSTURE
          </m.span>

          <m.h2
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
            Honest about what we are — and what we&rsquo;re working toward.
          </m.h2>

          <m.p
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
              maxWidth: "680px",
            }}
          >
            Avrentis does not hold formal SOC 2 or ISO 27001 certifications
            today. The platform is built with the controls that those frameworks
            measure — access, audit, encryption, change-management — and we can
            walk you through each one on a security review.
          </m.p>

          <div
            style={{ display: "grid", gap: "16px" }}
            className="grid-cols-1 md:grid-cols-3"
          >
            {COMPLIANCE.map((c, i) => (
              <m.div
                key={c.framework}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 3)}
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "10px",
                  padding: "24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "15px",
                      color: "#FFFFFF",
                    }}
                  >
                    {c.framework}
                  </span>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-gold)",
                      backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
                      border: "1px solid rgba(var(--color-gold-rgb), 0.28)",
                      borderRadius: "3px",
                      padding: "3px 8px",
                    }}
                  >
                    {c.status}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "#94a3b8",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {c.body}
                </p>
              </m.div>
            ))}
          </div>

          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(6)}
            style={{
              marginTop: "40px",
              padding: "22px 26px",
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
              }}
            >
              RESPONSIBLE DISCLOSURE
            </span>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#e2e8f0", margin: 0, lineHeight: 1.7 }}>
              Found a vulnerability?{" "}
              <Link
                href="/contact?intent=disclosure"
                style={{ color: "var(--color-gold)", textDecoration: "none" }}
              >
                Submit a responsible-disclosure report
              </Link>
              . We triage within two business days and welcome good-faith
              research. A DPA and sub-processor list are available on request.
            </p>
          </m.div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f1f5f9", padding: "100px 40px" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <m.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--color-gold-on-light)",
              display: "block",
              marginBottom: "12px",
            }}
          >
            QUESTIONS YOUR SECURITY TEAM WILL ASK
          </m.span>
          <m.h2
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
              margin: "0 0 40px",
              maxWidth: "620px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            Direct answers — the kind you&rsquo;ll want to forward to your CISO.
          </m.h2>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {FAQS.map((f, i) => (
              <m.details
                key={f.q}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 2)}
                style={{
                  borderTop: i === 0 ? "none" : "1px solid #e2e8f0",
                  padding: "18px 22px",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    listStyle: "none",
                    fontFamily: "var(--font-sans)",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#0f172a",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {f.q}
                  <span style={{ color: "var(--color-gold-on-light)", fontSize: "18px", lineHeight: 1 }} aria-hidden="true">
                    +
                  </span>
                </summary>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: 1.7,
                    margin: "12px 0 0",
                  }}
                >
                  {f.a}
                </p>
              </m.details>
            ))}
          </div>

          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(FAQS.length + 2)}
            style={{
              marginTop: "32px",
              padding: "22px 26px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Mail size={18} color={BRAND_COLORS.gold} strokeWidth={1.8} aria-hidden="true" />
              <div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  Got a question we haven&rsquo;t answered?
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#64748b" }}>
                  Talk directly with our team — we respond within one business day.
                </div>
              </div>
            </div>
            <Link
              href="/contact?intent=security"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "13px",
                backgroundColor: "var(--color-gold)",
                color: "#0f172a",
                borderRadius: "6px",
                padding: "0 18px",
                height: "40px",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              Book a security review
            </Link>
          </m.div>
        </div>
      </section>

      <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
