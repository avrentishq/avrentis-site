"use client";

/**
 * ChangelogPage — hand-curated release notes for the Avrentis platform.
 * Entries are listed newest-first with a date + tag + short narrative +
 * bullet list of user-facing changes. Deliberately brief — the real
 * audience is operators wondering "is the thing I asked for live?",
 * not developers reading API diffs.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const sans = "var(--font-sans)";
const mono = "'IBM Plex Mono', monospace";

type Tag = "feature" | "improvement" | "security" | "pricing" | "platform";

interface Entry {
  date: string;
  tag: Tag;
  title: string;
  body: string;
  bullets: string[];
  link?: { label: string; href: string };
}

const TAG_STYLES: Record<Tag, { label: string; color: string; bg: string; border: string }> = {
  feature: { label: "FEATURE", color: "#C68B2F", bg: "rgba(198,139,47,0.10)", border: "rgba(198,139,47,0.28)" },
  improvement: {
    label: "IMPROVEMENT",
    color: "#0369a1",
    bg: "rgba(3,105,161,0.08)",
    border: "rgba(3,105,161,0.22)",
  },
  security: { label: "SECURITY", color: "#047857", bg: "rgba(4,120,87,0.10)", border: "rgba(4,120,87,0.28)" },
  pricing: { label: "PRICING", color: "#7c2d12", bg: "rgba(124,45,18,0.08)", border: "rgba(124,45,18,0.22)" },
  platform: { label: "PLATFORM", color: "#475569", bg: "rgba(71,85,105,0.08)", border: "rgba(71,85,105,0.22)" },
};

const ENTRIES: Entry[] = [
  {
    date: "April 2026",
    tag: "pricing",
    title: "Trial-led pricing replaces the free tier.",
    body:
      "Every plan now begins with a 14-day trial — full access, no credit card, no feature gates. The previous free tier retires in favour of a single, honest conversion funnel.",
    bullets: [
      "14-day trial on all plans, no card required",
      "Trial data preserved for 30 days after expiry",
      "Exports carry a trial watermark until upgrade",
    ],
    link: { label: "See the pricing", href: "/pricing" },
  },
  {
    date: "April 2026",
    tag: "improvement",
    title: "Module names made clearer.",
    body:
      "Renamed the six product modules to labels that match how operators actually describe them. Avrentis Procure → Procurement, Vault → Records, People → HR, Connect → Integrations.",
    bullets: [
      "Procure → Procurement",
      "Vault → Records",
      "People → HR",
      "Connect → Integrations",
    ],
    link: { label: "See the modules", href: "/product" },
  },
  {
    date: "March 2026",
    tag: "feature",
    title: "Board views — company and platform.",
    body:
      "Two dedicated board-level surfaces: the Company Board (governance dashboard for your MD and non-executive directors) and the Platform Board (SaaS metrics for Avrentis operators). Both backed by a new aggregation layer.",
    bullets: [
      "Company Board View for tenant governance",
      "Platform Board View for Avrentis operators",
      "Maker-checker workflow for board-user provisioning",
      "Every 15-minute aggregation of key metrics",
    ],
  },
  {
    date: "February 2026",
    tag: "platform",
    title: "Platform operations — webhooks, incidents, allowlists, domains.",
    body:
      "A set of enterprise-facing operational capabilities landed together: webhook subscriptions per tenant, incident management, IP allowlisting with per-tenant CIDR rules, custom domains for tenant portals, and bulk user import.",
    bullets: [
      "Tenant-scoped webhook subscriptions with HMAC signing",
      "Incident management in the admin board",
      "IP allowlisting (IPv4 + IPv6 CIDR) per tenant",
      "Custom domains with DNS verification",
      "Bulk user import",
    ],
    link: { label: "Integrations catalogue", href: "/product/integrations" },
  },
  {
    date: "January 2026",
    tag: "security",
    title: "Enterprise security stack shipped.",
    body:
      "Tenant isolation at the database (Postgres RLS), role-based authority with ABAC overlays, Redis-backed session revocation, SCIM 2.0 provisioning, TOTP MFA with recovery codes, and an immutable audit trail. Every control documented on the security page.",
    bullets: [
      "Postgres RLS across every tenant-scoped table",
      "54 permissions × 10 roles + ABAC constraints",
      "SCIM 2.0 for Okta, Entra, Google Workspace",
      "TOTP MFA with bcrypt-hashed recovery codes",
      "DB triggers blocking UPDATE/DELETE on audit rows",
    ],
    link: { label: "Read the security stack", href: "/product/security" },
  },
  {
    date: "December 2025",
    tag: "feature",
    title: "Notifications system — multi-channel.",
    body:
      "Every workflow transition dispatches notifications through the channels approvers actually check. Email via Resend, SMS via Termii, WhatsApp for operators in the field, and a live in-app inbox.",
    bullets: [
      "Email (transactional, via Resend)",
      "SMS (via Termii) for Nigerian and international numbers",
      "WhatsApp approval cards with one-tap review",
      "In-app live inbox with per-user preferences",
    ],
  },
  {
    date: "November 2025",
    tag: "feature",
    title: "Approval engine, digital signatures, bank-ready exports.",
    body:
      "The state machine that moves documents from draft to permanent record. Digital signatures captured once and stamped on every sanctioned document. Bank-ready PDF letters generated the moment the MD signs.",
    bullets: [
      "Configurable approval chains with out-of-office delegation",
      "Amount thresholds + separation of duties enforced",
      "Digital signatures re-usable with re-confirmation",
      "Bank-ready payment letters with company letterhead",
    ],
    link: { label: "See how it works", href: "/product/how-it-works" },
  },
  {
    date: "October 2025",
    tag: "feature",
    title: "Vendors, payment vouchers, purchase orders.",
    body:
      "The operational core: structured vendor records, payment vouchers routed through a multi-level chain, and purchase orders with line items, budgets, and HOD confirmation.",
    bullets: [
      "Vendor directory with qualification workflow",
      "Payment voucher wizard with attachments + cost codes",
      "Purchase orders with line items and budget checks",
      "Draft-save at every step of every wizard",
    ],
  },
  {
    date: "September 2025",
    tag: "platform",
    title: "Multi-tenant platform with role-based access.",
    body:
      "The foundation: Next.js App Router on Neon-managed Postgres, per-tenant isolation from day one, role-based access with a configurable permission matrix.",
    bullets: [
      "Multi-tenant Postgres with session-scoped isolation",
      "8-role hierarchy (later expanded to 10)",
      "NextAuth.js for identity",
      "Admin tooling for tenant provisioning",
    ],
  },
];

function Badge({ tag }: { tag: Tag }) {
  const s = TAG_STYLES[tag];
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.06em",
        color: s.color,
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "3px",
        padding: "3px 8px",
      }}
    >
      {s.label}
    </span>
  );
}

export function ChangelogProductPage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 32px 64px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
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
              display: "block",
              marginBottom: "16px",
            }}
          >
            CHANGELOG
          </motion.span>
          <motion.h1
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
            What we&rsquo;ve shipped.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(2)}
            style={{
              fontFamily: sans,
              fontSize: "16px",
              color: "#475569",
              lineHeight: 1.75,
              margin: 0,
              maxWidth: "600px",
            }}
          >
            Notable changes, new capabilities, and platform-level shifts,
            written in the language an operator would actually use. Ordered
            newest first. Ask us for the full commit-level changelog if you
            need it.
          </motion.p>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8fafc", padding: "64px 32px 100px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {ENTRIES.map((entry) => (
            <motion.article
              key={entry.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={fadeUpTransition}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "28px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: mono, fontSize: "11px", color: "#64748b", letterSpacing: "0.04em" }}>
                  {entry.date}
                </span>
                <Badge tag={entry.tag} />
              </div>
              <h2
                style={{
                  fontFamily: sans,
                  fontWeight: 500,
                  fontSize: "20px",
                  color: "#0f172a",
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                {entry.title}
              </h2>
              <p style={{ fontFamily: sans, fontSize: "15px", color: "#475569", lineHeight: 1.7, margin: 0 }}>
                {entry.body}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {entry.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      fontFamily: sans,
                      fontSize: "14px",
                      color: "#334155",
                      lineHeight: 1.6,
                      paddingLeft: "16px",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "10px",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: "#C68B2F",
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
              {entry.link && (
                <Link
                  href={entry.link.href}
                  style={{
                    fontFamily: sans,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#C68B2F",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "4px",
                  }}
                >
                  {entry.link.label} <ArrowRight size={13} strokeWidth={1.8} aria-hidden="true" />
                </Link>
              )}
            </motion.article>
          ))}

          {/* Subscribe footer */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              marginTop: "32px",
              backgroundColor: "#FFFFFF",
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
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Sparkles size={20} strokeWidth={1.8} color="#C68B2F" aria-hidden="true" style={{ marginTop: "3px", flexShrink: 0 }} />
              <div>
                <h3
                  style={{
                    fontFamily: sans,
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "#0f172a",
                    margin: "0 0 4px",
                  }}
                >
                  Want the release notes in your inbox?
                </h3>
                <p style={{ fontFamily: sans, fontSize: "13px", color: "#64748b", lineHeight: 1.6, margin: 0, maxWidth: "420px" }}>
                  We send a short email when something notable ships. No
                  promotions — just changelog.
                </p>
              </div>
            </div>
            <Link
              href="/contact?intent=subscribe"
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
              Subscribe
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
