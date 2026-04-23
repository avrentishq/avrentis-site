"use client";

/**
 * IntegrationsCataloguePage — /product/integrations. Replaces the stub
 * with an honest catalogue of what connects today, what's coming, and
 * what we'll build for enterprise engagements. Availability labels map
 * to the platform's actual capability, not marketing ambition.
 */

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  KeyRound,
  UserCog,
  MessagesSquare,
  Receipt,
  Landmark,
  Webhook,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const sans = "var(--font-sans)";
const mono = "'IBM Plex Mono', monospace";

type Availability = "available" | "request";

interface Integration {
  name: string;
  summary: string;
  availability: Availability;
  note?: string;
}

interface Category {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  lede: string;
  integrations: Integration[];
}

const CATEGORIES: Category[] = [
  {
    id: "identity",
    icon: KeyRound,
    eyebrow: "IDENTITY & SINGLE SIGN-ON",
    title: "Sign in with the identity provider you already run.",
    lede:
      "Avrentis speaks the standard identity protocols — no per-provider hacks. Sessions, revocation, and MFA all work the same whether you're on Okta, Entra, or Google Workspace.",
    integrations: [
      { name: "SAML 2.0", summary: "Federated sign-in for any SAML-compliant IdP.", availability: "available" },
      { name: "OpenID Connect (OIDC)", summary: "OIDC flow for modern identity providers.", availability: "available" },
      { name: "Okta", summary: "Pre-configured SAML + OIDC flows.", availability: "available" },
      { name: "Microsoft Entra ID", summary: "SAML app gallery entry + OIDC setup.", availability: "available" },
      { name: "Google Workspace", summary: "SAML federation with Workspace directory.", availability: "available" },
      { name: "Apple Business Manager", summary: "OIDC sign-in for Apple-managed workforces.", availability: "request" },
    ],
  },
  {
    id: "provisioning",
    icon: UserCog,
    eyebrow: "DIRECTORY PROVISIONING",
    title: "Users flow from your IdP — and leave when they should.",
    lede:
      "SCIM 2.0 keeps Avrentis in sync with your directory. Add a user in Okta, they land here. Mark them inactive, their session is revoked within seconds.",
    integrations: [
      { name: "SCIM 2.0", summary: "Full protocol — user create, update, deactivate, group sync.", availability: "available" },
      { name: "Okta SCIM", summary: "Verified integration with Okta's lifecycle engine.", availability: "available" },
      { name: "Entra ID SCIM", summary: "Outbound provisioning from Entra.", availability: "available" },
      { name: "Google Workspace SCIM", summary: "Provisioning from Workspace groups.", availability: "available" },
      { name: "JumpCloud", summary: "Standard SCIM integration.", availability: "available" },
      { name: "Rippling / BambooHR", summary: "HRIS-first provisioning bridges.", availability: "request" },
    ],
  },
  {
    id: "notifications",
    icon: MessagesSquare,
    eyebrow: "NOTIFICATIONS",
    title: "Approvers hear about requests wherever they already look.",
    lede:
      "Every stage of the approval lifecycle can dispatch to the channels your approvers actually check. Multi-channel by default, all tracked to the audit trail.",
    integrations: [
      { name: "Email (transactional)", summary: "Approval-quality emails with deep links, delivered by an enterprise-grade email provider.", availability: "available" },
      { name: "WhatsApp", summary: "Approval cards with one-tap review, on Starter and above.", availability: "available" },
      { name: "SMS", summary: "Critical alerts to Nigerian and international numbers.", availability: "available" },
      { name: "In-app inbox", summary: "Live badge + typed workspace inbox on every page.", availability: "available" },
      { name: "Slack", summary: "Approval shortcuts + alerts into team channels.", availability: "request" },
      { name: "Microsoft Teams", summary: "Adaptive cards for approvals in Teams chat.", availability: "request" },
    ],
  },
  {
    id: "accounting",
    icon: Receipt,
    eyebrow: "ACCOUNTING & ERP",
    title: "Vouchers and POs flow into the system of record.",
    lede:
      "Avrentis owns the approval chain. The final record can flow into the ledger or ERP of your choice through native connectors or CSV / API exchange.",
    integrations: [
      { name: "CSV export", summary: "Period-bounded exports with full approval trail per line.", availability: "available" },
      { name: "QuickBooks Online", summary: "Voucher + PO sync with account mapping.", availability: "request" },
      { name: "Xero", summary: "Bill and PO sync for Xero-led finance stacks.", availability: "request" },
      { name: "Sage Intacct", summary: "API bridge for mid-market finance teams.", availability: "request" },
      { name: "SAP Business One", summary: "Certified connector for SAP-led procurement.", availability: "request" },
      { name: "Oracle NetSuite", summary: "PO and voucher synchronisation.", availability: "request" },
    ],
  },
  {
    id: "banking",
    icon: Landmark,
    eyebrow: "BANKING",
    title: "Bank-ready documents today. Live banking next.",
    lede:
      "Every sanctioned voucher produces a formally formatted bank letter with the MD's signature, accepted by commercial banks across the region. Native banking APIs are on the roadmap.",
    integrations: [
      { name: "Bank-ready PDF letter", summary: "Per-voucher letter with MD signature + letterhead.", availability: "available" },
      { name: "SWIFT-format payment batches", summary: "Batched export for treasury teams.", availability: "request" },
      {
        name: "Nigerian bank connectors (GTBank, Zenith, Access)",
        summary: "Direct payment initiation for Nigeria-based tenants.",
        availability: "request",
      },
      {
        name: "Pan-African banking (Mono / Okra)",
        summary: "Aggregator-based balance + payment rails.",
        availability: "request",
      },
      { name: "Stripe Treasury", summary: "For USD-denominated payouts.", availability: "request" },
    ],
  },
  {
    id: "developer",
    icon: Webhook,
    eyebrow: "DEVELOPER PLATFORM",
    title: "Build on top of your approval record.",
    lede:
      "Everything you see in the UI is available over an authenticated REST API, with webhooks for every state transition. For Enterprise customers we also issue tenant-scoped service tokens.",
    integrations: [
      { name: "REST API (v1)", summary: "Documents, approvals, users, audit events, reports.", availability: "available" },
      { name: "Webhooks", summary: "Per-tenant event subscriptions with retries + signing.", availability: "available" },
      { name: "Audit export (signed)", summary: "Regulator-ready bundles, signed and downloadable.", availability: "available" },
      { name: "Zapier", summary: "No-code workflow bridge into 6,000+ apps.", availability: "request" },
      { name: "n8n / Make", summary: "Trigger-node integration for ops teams.", availability: "request" },
    ],
  },
];

const STATUS_STYLES: Record<Availability, { label: string; color: string; bg: string; border: string }> = {
  available: {
    label: "Available",
    color: "#047857",
    bg: "rgba(4,120,87,0.10)",
    border: "rgba(4,120,87,0.28)",
  },
  request: {
    label: "Talk to us",
    color: "#C68B2F",
    bg: "rgba(198,139,47,0.10)",
    border: "rgba(198,139,47,0.28)",
  },
};

function Badge({ availability }: { availability: Availability }) {
  const s = STATUS_STYLES[availability];
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: s.color,
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "3px",
        padding: "3px 8px",
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: s.color,
          display: "inline-block",
        }}
      />
      {s.label}
    </span>
  );
}

function CategoryBlock({ category, index }: { category: Category; index: number }) {
  const Icon = category.icon;
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={fadeUpTransition}
      id={category.id}
      style={{ scrollMarginTop: "90px" }}
    >
      <div style={{ display: "grid", gap: "40px", alignItems: "start" }} className="grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
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
            <span
              style={{
                fontFamily: mono,
                fontSize: "11px",
                color: "#C68B2F",
                letterSpacing: "0.08em",
              }}
            >
              {String(index + 1).padStart(2, "0")} · {category.eyebrow}
            </span>
          </div>
          <h2
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "26px",
              color: "#0f172a",
              lineHeight: 1.25,
              margin: "0 0 12px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[30px]"
          >
            {category.title}
          </h2>
          <p style={{ fontFamily: sans, fontSize: "15px", color: "#64748b", lineHeight: 1.7, margin: 0, maxWidth: "440px" }}>
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
          {category.integrations.map((integration, i) => (
            <div
              key={integration.name}
              style={{
                padding: "18px 22px",
                borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontFamily: sans, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                    {integration.name}
                  </span>
                </div>
                <p style={{ fontFamily: sans, fontSize: "13px", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                  {integration.summary}
                </p>
              </div>
              <Badge availability={integration.availability} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export function IntegrationsCataloguePage() {
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
            INTEGRATIONS
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
            Avrentis plugs into the stack you already run.
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
              maxWidth: "660px",
            }}
          >
            Identity, provisioning, notifications, accounting, banking, and a
            first-class developer platform. Each integration labelled honestly —
            available today or delivered on request as part of a conversation.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(3)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="#identity"
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
              Explore the catalogue
            </Link>
            <Link
              href="/contact?intent=demo"
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
              Request a custom connector →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY NAV ───────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "40px 40px", borderBottom: "1px solid #e2e8f0" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 16px",
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
            <Link
              key={c.id}
              href={`#${c.id}`}
              style={{
                fontFamily: sans,
                fontSize: "13px",
                color: "#0f172a",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "999px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#F8FAFC",
              }}
            >
              {c.eyebrow.split(" & ")[0].toLowerCase().replace(/^\w/, (ch) => ch.toUpperCase())}
            </Link>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8fafc", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "88px" }}>
          {CATEGORIES.map((c, i) => (
            <CategoryBlock key={c.id} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* ── DEV TEASER ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gap: "48px", alignItems: "center" }} className="grid-cols-1 lg:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={fadeUpTransition}
            >
              <span
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
                DEVELOPER PLATFORM
              </span>
              <h2
                style={{
                  fontFamily: sans,
                  fontWeight: 400,
                  fontSize: "30px",
                  color: "#0f172a",
                  lineHeight: 1.2,
                  margin: "0 0 14px",
                  letterSpacing: "0.01em",
                }}
                className="lg:!text-[34px]"
              >
                Every transition is an event you can subscribe to.
              </h2>
              <p style={{ fontFamily: sans, fontSize: "15px", color: "#64748b", lineHeight: 1.75, margin: "0 0 16px" }}>
                Signed HMAC webhook payloads, versioned schemas, idempotent
                retries with exponential backoff. Build the notifications your
                team actually wants, or sync sanctioned vouchers to your ledger
                the second the MD signs.
              </p>
              <p style={{ fontFamily: sans, fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, margin: "0 0 24px" }}>
                Full API documentation is being finalised for public release.
                Launch partners get access today.
              </p>
              <Link
                href="/contact?intent=demo"
                style={{
                  fontFamily: sans,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#C68B2F",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Request API access <ArrowRight size={13} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(1)}
              style={{
                backgroundColor: "#0f172a",
                borderRadius: "10px",
                padding: "22px",
                boxShadow: "0 20px 50px rgba(15,23,42,0.18)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    color: "#94a3b8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  POST · /webhooks/your-endpoint
                </span>
              </div>
              <pre
                style={{
                  fontFamily: mono,
                  fontSize: "12px",
                  color: "#e2e8f0",
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
{`{
  "event": "voucher.sanctioned",
  "tenant": "acme-org",
  "occurred_at": "2026-04-21T14:42:17.003Z",
  "actor": {
    "id": "u_01HMPW2Q1",
    "role": "md",
    "ip": "154.113.x.x"
  },
  "entity": {
    "type": "payment_voucher",
    "id": "PV-2026-0184",
    "amount": { "currency": "NGN", "value": 12450000 }
  },
  "signature": "sha256=8f3d…"
}`}
              </pre>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CUSTOM CONNECTOR ───────────────────────────────── */}
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

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: sans,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#C68B2F",
              backgroundColor: "rgba(198,139,47,0.10)",
              border: "1px solid rgba(198,139,47,0.28)",
              borderRadius: "20px",
              padding: "6px 14px",
              marginBottom: "20px",
            }}
          >
            <Sparkles size={14} strokeWidth={1.8} aria-hidden="true" />
            Built for your stack
          </motion.div>
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
            Need something specific? We&rsquo;ll build it.
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
            Enterprise customers get purpose-built connectors for the systems
            already in production at their organisation — banking rails,
            regional HRIS, in-house document stores. Tell us what you run; we
            scope, build, and ship.
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
              href="/contact?intent=demo"
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
              Scope a custom connector
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
              How we secure integrations →
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
