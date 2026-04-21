"use client";

/**
 * TrustProductPage — the /trust centre. A single surface where an
 * enterprise reviewer finds the things they ask for in the procurement
 * cycle: controls framework alignment, sub-processor list, data
 * residency, DPA-on-request, responsible disclosure.
 *
 * Cross-links to /product/security for the deep technical detail and
 * /privacy + /terms for the legal documents. The goal is that a CISO
 * or procurement team can complete their security review without
 * needing to email sales first.
 */

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  ScrollText,
  Lock,
  AlertOctagon,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const sans = "var(--font-sans)";
const mono = "'IBM Plex Mono', monospace";

const FRAMEWORKS = [
  {
    name: "SOC 2 (Type II)",
    status: "Controls aligned · audit not yet completed",
    body:
      "Access management, change management, logical security, availability monitoring, and incident response are designed to meet SOC 2 Type II criteria. We can walk your team through each control on a review call.",
  },
  {
    name: "ISO 27001",
    status: "Controls aligned · certification not in place",
    body:
      "Information-security management follows Annex A control families relevant to a SaaS operator — access control, asset management, cryptography, operations, supplier relationships, compliance.",
  },
  {
    name: "GDPR & UK GDPR",
    status: "Designed-for · DPA available",
    body:
      "Data-subject rights (access, rectification, erasure, portability) are supported in-product. A Data Processing Agreement is available for signature on request.",
  },
  {
    name: "NDPR (Nigeria)",
    status: "Designed-for",
    body:
      "The platform's controls reflect the Nigeria Data Protection Regulation's expectations around lawful basis, data minimisation, security, and breach response.",
  },
  {
    name: "CCPA / CPRA",
    status: "Designed-for",
    body:
      "Consumer rights to know, delete, and opt-out of sale are supported. Avrentis does not sell personal data under any definition of the term.",
  },
];

const SUBPROCESSORS = [
  { name: "Neon", purpose: "Managed PostgreSQL for application data", region: "EU", dpa: true },
  { name: "Vercel", purpose: "Application hosting and edge compute", region: "Global edge", dpa: true },
  { name: "Cloudflare", purpose: "CDN and R2 object storage for document attachments", region: "Global", dpa: true },
  { name: "Upstash", purpose: "Managed Redis for sessions and rate-limiting", region: "EU / US (configurable)", dpa: true },
  { name: "Resend", purpose: "Transactional email delivery", region: "US", dpa: true },
  { name: "Termii", purpose: "SMS notification delivery (where enabled)", region: "Nigeria", dpa: true },
  { name: "Sentry", purpose: "Error and performance monitoring", region: "EU", dpa: true },
];

const DOCUMENTS = [
  {
    icon: ShieldCheck,
    title: "Security overview",
    body: "The full stack — tenant isolation, RBAC + ABAC, session integrity, audit, encryption.",
    cta: { label: "Read the stack", href: "/product/security" },
  },
  {
    icon: Lock,
    title: "Data Processing Agreement",
    body: "GDPR + UK GDPR-aligned DPA with standard contractual clauses. Signable as-is or negotiated for enterprise.",
    cta: { label: "Request the DPA", href: "/contact?intent=security" },
  },
  {
    icon: FileText,
    title: "Privacy policy",
    body: "What we collect, why, how long we keep it, and your rights as a data subject.",
    cta: { label: "Read the policy", href: "/privacy" },
  },
  {
    icon: ScrollText,
    title: "Terms of service",
    body: "Service description, acceptable use, data ownership, liability, termination.",
    cta: { label: "Read the terms", href: "/terms" },
  },
  {
    icon: AlertOctagon,
    title: "Responsible disclosure",
    body: "Report security issues to security@avrentis.com. We triage within two business days.",
    cta: { label: "Report a vulnerability", href: "/contact?intent=disclosure" },
  },
  {
    icon: MapPin,
    title: "Data residency",
    body: "Primary data in the EU today. In-country/in-region hosting available as an enterprise engagement.",
    cta: { label: "Talk to us about residency", href: "/contact?intent=security" },
  },
];

export function TrustProductPage() {
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
            animate="visible"
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C68B2F",
              display: "inline-block",
              marginBottom: "20px",
            }}
          >
            TRUST CENTRE
          </motion.span>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 700,
              fontSize: "36px",
              color: "#FFFFFF",
              lineHeight: 1.15,
              margin: "0 0 24px",
            }}
            className="lg:!text-[56px]"
          >
            Where the controls live.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(2)}
            style={{
              fontFamily: sans,
              fontSize: "17px",
              color: "#94a3b8",
              lineHeight: 1.7,
              margin: "0 auto 32px",
              maxWidth: "640px",
            }}
          >
            Everything a security, legal, or procurement reviewer typically asks
            for — frameworks we align to, who processes data on our behalf,
            where it lives, how to get a signed DPA, and how to report a
            vulnerability. One page, honest.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(3)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/contact?intent=security"
              style={{
                fontFamily: sans,
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
              Request a DPA or security review
            </Link>
            <Link
              href="/product/security"
              style={{
                fontFamily: sans,
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
              Read the security stack →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FRAMEWORKS ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#C68B2F",
              display: "block",
              marginBottom: "12px",
            }}
          >
            FRAMEWORKS WE ALIGN TO
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 14px",
              maxWidth: "640px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            We don&rsquo;t hold certifications today. Here&rsquo;s what we do.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: sans,
              fontSize: "15px",
              color: "#64748b",
              lineHeight: 1.7,
              margin: "0 0 40px",
              maxWidth: "640px",
            }}
          >
            Avrentis has not yet completed a SOC 2 or ISO 27001 audit. The
            platform is built with the controls those frameworks measure and
            we&rsquo;re transparent about where we are in each journey.
          </motion.p>

          <div style={{ display: "grid", gap: "16px" }} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {FRAMEWORKS.map((f, i) => (
              <motion.div
                key={f.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 3)}
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: "16px", color: "#0f172a", margin: 0 }}>
                    {f.name}
                  </h3>
                  <CheckCircle2 size={16} color="#C68B2F" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#C68B2F",
                  }}
                >
                  {f.status}
                </span>
                <p style={{ fontFamily: sans, fontSize: "13px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUB-PROCESSORS ─────────────────────────────────── */}
      <section style={{ backgroundColor: "#f1f5f9", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#C68B2F",
              display: "block",
              marginBottom: "12px",
            }}
          >
            SUB-PROCESSORS
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 14px",
              maxWidth: "640px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            The providers that help us run the service.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: sans,
              fontSize: "15px",
              color: "#64748b",
              lineHeight: 1.7,
              margin: "0 0 32px",
              maxWidth: "640px",
            }}
          >
            Each provider has a data-processing agreement in place with
            Avrentis. We notify customers of new sub-processors before
            onboarding them where we have that obligation under your contract.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(3)}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 2.2fr 1.3fr 0.8fr",
                padding: "14px 20px",
                backgroundColor: "#F8FAFC",
                borderBottom: "1px solid #e2e8f0",
                gap: "14px",
              }}
            >
              {["Provider", "Purpose", "Region", "DPA"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    color: "#64748b",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {SUBPROCESSORS.map((sp, i) => (
              <div
                key={sp.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 2.2fr 1.3fr 0.8fr",
                  padding: "14px 20px",
                  borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
                  gap: "14px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                  {sp.name}
                </span>
                <span style={{ fontFamily: sans, fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                  {sp.purpose}
                </span>
                <span style={{ fontFamily: sans, fontSize: "13px", color: "#64748b" }}>{sp.region}</span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    color: sp.dpa ? "#047857" : "#94a3b8",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: sp.dpa ? "#047857" : "#cbd5e1",
                    }}
                  />
                  {sp.dpa ? "SIGNED" : "PENDING"}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(4)}
            style={{
              fontFamily: sans,
              fontSize: "13px",
              color: "#64748b",
              lineHeight: 1.7,
              margin: "20px 0 0",
            }}
          >
            Subscribe to sub-processor change notifications through our{" "}
            <Link href="/contact?intent=subscribe" style={{ color: "#C68B2F", textDecoration: "none" }}>
              update subscription form
            </Link>
            .
          </motion.p>
        </div>
      </section>

      {/* ── DOCUMENTS ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#C68B2F",
              display: "block",
              marginBottom: "12px",
            }}
          >
            DOCUMENTS &amp; DIRECT LINES
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 40px",
              maxWidth: "640px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            What to read and who to email.
          </motion.h2>

          <div style={{ display: "grid", gap: "16px" }} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {DOCUMENTS.map((d, i) => {
              const Icon = d.icon;
              const isExternal = d.cta.href.startsWith("mailto:");
              return (
                <motion.div
                  key={d.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={staggerDelay(i + 2)}
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "24px",
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
                      backgroundColor: "rgba(198,139,47,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.8} color="#C68B2F" aria-hidden="true" />
                  </div>
                  <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: "16px", color: "#0f172a", margin: "4px 0 0" }}>
                    {d.title}
                  </h3>
                  <p style={{ fontFamily: sans, fontSize: "13px", color: "#64748b", lineHeight: 1.65, margin: 0, flex: 1 }}>
                    {d.body}
                  </p>
                  {isExternal ? (
                    <a
                      href={d.cta.href}
                      style={{
                        fontFamily: sans,
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#C68B2F",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "6px",
                      }}
                    >
                      {d.cta.label}
                      <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      href={d.cta.href}
                      style={{
                        fontFamily: sans,
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#C68B2F",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "6px",
                      }}
                    >
                      {d.cta.label}
                      <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DATA RESIDENCY ─────────────────────────────────── */}
      <section style={{ backgroundColor: "#f1f5f9", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#C68B2F",
              display: "block",
              marginBottom: "12px",
            }}
          >
            DATA RESIDENCY
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 14px",
              maxWidth: "640px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            Where your data lives — today and on the roadmap.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: sans,
              fontSize: "15px",
              color: "#64748b",
              lineHeight: 1.7,
              margin: "0 0 40px",
              maxWidth: "680px",
            }}
          >
            Residency matters for regulated organisations and for customers
            whose policies require data to stay in a specific jurisdiction.
            Here is the honest picture.
          </motion.p>

          <div style={{ display: "grid", gap: "20px" }} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Today · default",
                title: "European Union",
                body:
                  "Primary application database (Neon Postgres) and backups are hosted in the EU. Document attachments flow through Cloudflare R2 at the region configured for our infrastructure tier. The marketing site and edge compute run on Vercel's global edge.",
              },
              {
                label: "Enterprise · on request",
                title: "In-region / in-country hosting",
                body:
                  "We can provision a dedicated infrastructure tier in another region as part of an enterprise engagement — useful when your policy, regulator, or customer contract mandates data remain in a specific jurisdiction.",
              },
              {
                label: "Roadmap",
                title: "Multi-region failover",
                body:
                  "Active-passive replication across regions with Customer-selectable primary and documented RPO/RTO. In scoping now; enterprise partners are helping us shape the requirements.",
              },
            ].map((r, i) => (
              <motion.div
                key={r.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 3)}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#C68B2F",
                  }}
                >
                  {r.label}
                </span>
                <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: "17px", color: "#0f172a", margin: "2px 0 0" }}>
                  {r.title}
                </h3>
                <p style={{ fontFamily: sans, fontSize: "13px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                  {r.body}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(6)}
            style={{
              marginTop: "28px",
              padding: "20px 24px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontFamily: sans,
              fontSize: "13px",
              color: "#475569",
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "#0f172a" }}>Cross-border transfers.</strong>{" "}
            Where personal data moves between regions, we rely on Standard
            Contractual Clauses (SCCs) and equivalent mechanisms recognised
            under applicable law. Our DPA sets out these terms in full.
          </motion.div>
        </div>
      </section>

      {/* ── STATUS + CONTACT ───────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#0f172a",
          padding: "100px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AmbientGlow top="20%" left="-120px" size={420} intensity={0.15} duration={34} />
        <AmbientGlow bottom="-80px" right="-100px" size={480} intensity={0.13} duration={40} delay={0.5} />

        <div style={{ maxWidth: "880px", margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C68B2F",
              display: "inline-block",
              marginBottom: "16px",
            }}
          >
            OPERATIONAL TRANSPARENCY
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "30px",
              color: "#FFFFFF",
              lineHeight: 1.2,
              margin: "0 0 16px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[36px]"
          >
            All systems operational.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: sans,
              fontSize: "15px",
              color: "#94a3b8",
              lineHeight: 1.7,
              margin: "0 auto 28px",
              maxWidth: "600px",
            }}
          >
            Current subsystem status is published on the status page, with
            incident history as it accrues. Enterprise customers receive
            incident notifications under their order form; email to be added
            to the general notification list.
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
              href="/status"
              style={{
                fontFamily: sans,
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
              Open the status page
            </Link>
            <Link
              href="/contact?intent=security"
              style={{
                fontFamily: sans,
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
              Talk to our team →
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
