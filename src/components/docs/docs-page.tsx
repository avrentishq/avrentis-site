"use client";

/**
 * DocsHubPage — the /docs landing. Avrentis ships product copy that's
 * already quite explanatory, so the docs hub's first job is to route
 * readers to the right existing surface — Security, Integrations, How
 * it works, individual modules — rather than duplicate that material.
 *
 * Sections that don't exist yet (full how-tos, API reference) are
 * flagged honestly as in-progress with a direct contact route.
 */

import { useRef } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  BookOpen,
  Compass,
  ShieldCheck,
  Plug,
  FileCheck,
  ClipboardCheck,
  Users,
  Webhook,
  Mail,
  ArrowRight,
  Clock,
} from "lucide-react";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const sans = "var(--font-sans)";
const mono = "'IBM Plex Mono', monospace";

type ItemStatus = "live" | "wip";

interface DocsItem {
  title: string;
  body: string;
  href: string;
  status: ItemStatus;
}

interface DocsCategory {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  lede: string;
  items: DocsItem[];
}

const CATEGORIES: DocsCategory[] = [
  {
    icon: Compass,
    eyebrow: "GETTING STARTED",
    title: "Set up your workspace in under ten minutes.",
    lede:
      "A quick orientation for the first admin: create the tenant, provision users, configure your first approval chain, and sanction your first document.",
    items: [
      {
        title: "The complete approval lifecycle",
        body: "Submit → Review → Sanction → Record, with mockups of every stage.",
        href: "/product/how-it-works",
        status: "live",
      },
      {
        title: "Platform overview",
        body: "The six modules and how they compose the unified approval engine.",
        href: "/product",
        status: "live",
      },
      {
        title: "First-tenant setup guide",
        body: "Step-by-step: creating your organisation, inviting admins, configuring roles.",
        href: "/contact?intent=demo",
        status: "wip",
      },
      {
        title: "Importing existing vendors and documents",
        body: "CSV shapes, mapping columns, running a dry-run before import.",
        href: "/contact?intent=demo",
        status: "wip",
      },
    ],
  },
  {
    icon: BookOpen,
    eyebrow: "CORE CONCEPTS",
    title: "The primitives behind every workflow.",
    lede:
      "Approvals, roles, queries, separation of duties — learn the vocabulary the platform is built around so the rest of the product reads quickly.",
    items: [
      {
        title: "Roles, permissions, and ABAC",
        body: "54 permissions across 10 roles with attribute-based overlays.",
        href: "/product/security",
        status: "live",
      },
      {
        title: "Document state machines",
        body: "Every transition a voucher or PO can take, and the roles that can cause them.",
        href: "/product/how-it-works",
        status: "live",
      },
      {
        title: "Querying and delegation",
        body: "Pausing an approval, asking the submitter a question, re-entering the chain.",
        href: "/contact?intent=demo",
        status: "wip",
      },
    ],
  },
  {
    icon: FileCheck,
    eyebrow: "MODULES",
    title: "How each module operates.",
    lede:
      "Deep-dive pages for every module — capabilities, use cases, plan availability, pairs-well-with.",
    items: [
      { title: "Avrentis Pay", body: "Structured payment approvals.", href: "/product/pay", status: "live" },
      { title: "Avrentis Procurement", body: "Procurement on record.", href: "/product/procure", status: "live" },
      { title: "Avrentis Records", body: "Institutional memory.", href: "/product/vault", status: "live" },
      { title: "Avrentis Audit", body: "Compliance & accountability.", href: "/product/audit", status: "live" },
      { title: "Avrentis HR", body: "Workforce structure.", href: "/product/people", status: "live" },
      { title: "Avrentis Integrations", body: "External systems.", href: "/product/connect", status: "live" },
    ],
  },
  {
    icon: ShieldCheck,
    eyebrow: "PLATFORM & SECURITY",
    title: "The stack that protects every tenant.",
    lede:
      "Isolation, authority, session integrity, audit trail, lifecycle, encryption. The same content your CISO will read during a review.",
    items: [
      { title: "Security overview", body: "The six-layer stack with diagrams.", href: "/product/security", status: "live" },
      { title: "Trust centre", body: "Controls framework, sub-processors, data residency, DPA.", href: "/trust", status: "live" },
      { title: "Privacy policy", body: "What we collect, why, and your data-subject rights.", href: "/privacy", status: "live" },
      { title: "Terms of service", body: "The contract governing use of the service.", href: "/terms", status: "live" },
    ],
  },
  {
    icon: ClipboardCheck,
    eyebrow: "ADMINISTRATION",
    title: "Running Avrentis inside your organisation.",
    lede:
      "User provisioning, SSO configuration, IP allowlisting, MFA, custom domains. Written for admins and internal IT.",
    items: [
      {
        title: "SSO configuration (SAML + OIDC)",
        body: "Okta, Entra, Google Workspace setup walk-throughs.",
        href: "/product/integrations#identity",
        status: "wip",
      },
      {
        title: "SCIM 2.0 provisioning",
        body: "Automated user lifecycle from your IdP.",
        href: "/product/integrations#provisioning",
        status: "wip",
      },
      {
        title: "IP allowlist configuration",
        body: "Per-tenant CIDR rules for IPv4 and IPv6.",
        href: "/contact?intent=security",
        status: "wip",
      },
      {
        title: "MFA enforcement",
        body: "TOTP and bcrypt-hashed recovery codes.",
        href: "/product/security",
        status: "live",
      },
    ],
  },
  {
    icon: Plug,
    eyebrow: "INTEGRATIONS",
    title: "Connecting Avrentis to your stack.",
    lede:
      "The catalogue page has the full list. These guides cover the configuration details for each one.",
    items: [
      {
        title: "Integrations catalogue",
        body: "Every integration with honest availability labels.",
        href: "/product/integrations",
        status: "live",
      },
      { title: "Email notifications", body: "Configuring sender domains and templates.", href: "/contact?intent=demo", status: "wip" },
      { title: "WhatsApp notifications", body: "Setting up business-account routing.", href: "/contact?intent=demo", status: "wip" },
      { title: "SMS via Termii", body: "Adding sender IDs and international routing.", href: "/contact?intent=demo", status: "wip" },
    ],
  },
  {
    icon: Webhook,
    eyebrow: "API & WEBHOOKS",
    title: "Build on top of Avrentis.",
    lede:
      "Authenticated REST API and per-tenant webhook subscriptions. Public API reference is being prepared — launch partners get early access.",
    items: [
      {
        title: "Webhook payload reference",
        body: "Event types, signing, retries.",
        href: "/product/integrations#developer",
        status: "live",
      },
      { title: "REST API reference (v1)", body: "Full resource docs being finalised for public release.", href: "/contact?intent=demo", status: "wip" },
      { title: "Audit export format", body: "The signed, regulator-ready bundle schema.", href: "/contact?intent=security", status: "wip" },
    ],
  },
  {
    icon: Users,
    eyebrow: "GOVERNANCE",
    title: "Board views, auditor access, maker-checker.",
    lede:
      "How Avrentis surfaces company-level governance — the Company Board, auditor role, board provisioning workflow.",
    items: [
      { title: "Company Board View", body: "The governance dashboard for MDs and directors.", href: "/product/audit", status: "live" },
      { title: "Auditor role", body: "Time-bound, read-only access for external reviews.", href: "/product/security", status: "live" },
      {
        title: "Board provisioning (maker-checker)",
        body: "How provisional access becomes confirmed access.",
        href: "/contact?intent=security",
        status: "wip",
      },
    ],
  },
];

function StatusPill({ status }: { status: ItemStatus }) {
  if (status === "live") return null;
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: "9px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#C68B2F",
        backgroundColor: "rgba(198,139,47,0.10)",
        border: "1px solid rgba(198,139,47,0.22)",
        borderRadius: "3px",
        padding: "2px 6px",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        flexShrink: 0,
      }}
    >
      <Clock size={9} strokeWidth={2} aria-hidden="true" />
      In progress
    </span>
  );
}

function Category({ category, index }: { category: DocsCategory; index: number }) {
  const Icon = category.icon;
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={fadeUpTransition}
      style={{ scrollMarginTop: "90px" }}
      id={category.eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
    >
      <div style={{ display: "grid", gap: "40px", alignItems: "start" }} className="grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "rgba(198,139,47,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={18} strokeWidth={1.8} color="#C68B2F" aria-hidden="true" />
            </div>
            <span style={{ fontFamily: mono, fontSize: "11px", color: "#C68B2F", letterSpacing: "0.08em" }}>
              {String(index + 1).padStart(2, "0")} · {category.eyebrow}
            </span>
          </div>
          <h2
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "24px",
              color: "#0f172a",
              lineHeight: 1.25,
              margin: "0 0 10px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[28px]"
          >
            {category.title}
          </h2>
          <p style={{ fontFamily: sans, fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: 0, maxWidth: "400px" }}>
            {category.lede}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {category.items.map((item, i) => {
            const isExternal = item.href.startsWith("mailto:");
            const Inner = (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <span style={{ fontFamily: sans, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                      {item.title}
                    </span>
                    <StatusPill status={item.status} />
                  </div>
                  <p style={{ fontFamily: sans, fontSize: "13px", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
                <ArrowRight size={14} strokeWidth={1.8} color="#C68B2F" aria-hidden="true" style={{ flexShrink: 0 }} />
              </>
            );
            const style: React.CSSProperties = {
              padding: "18px 22px",
              borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              justifyContent: "space-between",
              textDecoration: "none",
            };
            return isExternal ? (
              <a key={item.title} href={item.href} style={style}>
                {Inner}
              </a>
            ) : (
              <Link key={item.title} href={item.href} style={style}>
                {Inner}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

export function DocsHubPage() {
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
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
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
            DOCUMENTATION
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
            className="lg:!text-[52px]"
          >
            Everything you need to run Avrentis — in one place.
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
            A hub for admins, developers, and internal IT. Pointers to the
            deep-dive pages we already publish, and honest signals for the
            guides we&rsquo;re still writing — with a direct line to a human
            where a guide would have lived.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(3)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <a
              href="#getting-started"
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
              Start here
            </a>
            <Link
              href="/contact?intent=feedback"
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
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <Mail size={14} strokeWidth={1.8} aria-hidden="true" />
              Request a guide
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY NAV ───────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "40px 32px", borderBottom: "1px solid #e2e8f0" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 12px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: mono,
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Jump to:
          </span>
          {CATEGORIES.map((c) => (
            <a
              key={c.eyebrow}
              href={`#${c.eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              style={{
                fontFamily: sans,
                fontSize: "12px",
                color: "#0f172a",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "999px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#F8FAFC",
              }}
            >
              {c.eyebrow.charAt(0) + c.eyebrow.slice(1).toLowerCase().split(" ")[0]}
            </a>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8fafc", padding: "90px 32px" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "80px" }}>
          {CATEGORIES.map((c, i) => (
            <Category key={c.eyebrow} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* ── FEEDBACK FOOTER ────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "80px 32px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "28px 32px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: 1, minWidth: "280px" }}>
              <h3
                style={{
                  fontFamily: sans,
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#0f172a",
                  margin: "0 0 6px",
                }}
              >
                Couldn&rsquo;t find what you were looking for?
              </h3>
              <p style={{ fontFamily: sans, fontSize: "14px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                Tell us what guide would have helped. We write what customers
                actually ask for, not what marketing thinks we should publish.
              </p>
            </div>
            <Link
              href="/contact?intent=feedback"
              style={{
                fontFamily: sans,
                fontWeight: 600,
                fontSize: "13px",
                backgroundColor: "#C68B2F",
                color: "#0f172a",
                borderRadius: "6px",
                padding: "0 18px",
                height: "40px",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              Request a guide
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
