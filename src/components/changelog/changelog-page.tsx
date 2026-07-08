"use client";

/**
 * ChangelogPage — hand-curated release notes for the Avrentis platform.
 * Entries are listed newest-first with a date + tag + short narrative +
 * bullet list of user-facing changes. Deliberately brief — the real
 * audience is operators wondering "is the thing I asked for live?",
 * not developers reading API diffs.
 */

import Link from "next/link";
import { m } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";
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
  feature: { label: "FEATURE", color: "var(--color-gold-on-light)", bg: "rgba(var(--color-gold-rgb), 0.10)", border: "rgba(var(--color-gold-rgb), 0.28)" },
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
    title: "Module names aligned across the platform.",
    body:
      "The six product modules now carry one name everywhere — the marketing site, the product, and your invoices all say the same thing. Pay → Payables, Vault → Documents, Audit → Compliance, People → HR, Connect → Integrations.",
    bullets: [
      "Pay → Payables",
      "Vault → Documents",
      "Audit → Compliance",
      "People → HR",
      "Connect → Integrations",
    ],
    link: { label: "See the modules", href: "/product" },
  },
  {
    date: "March 2026",
    tag: "feature",
    title: "Board views — for your company and for ours.",
    body:
      "Two new dashboards built for the people who run things. A Company Board gives your MD and non-executive directors the health-of-the-organisation view. A Platform Board gives the Avrentis team the operational view we use to run the service well. Numbers refresh regularly through the day.",
    bullets: [
      "A Company Board for your MD and directors to see organisational health at a glance",
      "Operational metrics for the Avrentis team to run the service well",
      "Board access is granted carefully — one person provisions, another approves",
      "Key numbers refresh regularly through the day",
    ],
  },
  {
    date: "February 2026",
    tag: "platform",
    title: "Platform tools for enterprise operations teams.",
    body:
      "A set of capabilities for larger customers who need tighter control. Subscribe to what's happening inside Avrentis from your own systems, track incidents in one place, restrict sign-in to your office IP addresses, use your own domain, and import users in bulk.",
    bullets: [
      "Subscribe to events inside Avrentis from your own systems",
      "Track incidents directly from the admin dashboard",
      "Restrict sign-in to your organisation's approved IP addresses",
      "Use your own domain for the Avrentis portal",
      "Import large numbers of users in a single upload",
    ],
    link: { label: "Integrations catalogue", href: "/product/integrations" },
  },
  {
    date: "January 2026",
    tag: "security",
    title: "Our enterprise security stack landed.",
    body:
      "The controls every serious customer asks about: tenant-to-tenant isolation at the database itself, roles that actually enforce what they say, sessions that end the moment someone changes role or leaves, two-factor sign-in, and a record of every action that nobody can edit.",
    bullets: [
      "Each customer's data is walled off inside the database itself — not just the app",
      "A fine-grained permission system across multiple roles, plus rules that stop people acting outside their remit",
      "Automated user provisioning from Okta, Microsoft Entra, and Google Workspace",
      "Two-factor sign-in with recovery codes, required for platform admins",
      "Once an action is recorded, no one can edit or delete it — not even us",
    ],
    link: { label: "Read the security stack", href: "/product/security" },
  },
  {
    date: "December 2025",
    tag: "feature",
    title: "Notifications in the channels approvers actually check.",
    body:
      "Every stage of an approval can now reach the approver where they already are. Email, WhatsApp, SMS, and a live in-app inbox — tuned to how decision-makers actually work.",
    bullets: [
      "Email with a one-click link straight to the approval",
      "SMS for decision-makers in Nigeria and internationally",
      "WhatsApp approval cards with one-tap review",
      "Live in-app inbox with per-user notification preferences",
    ],
  },
  {
    date: "November 2025",
    tag: "feature",
    title: "Approval engine, digital signatures, bank-ready exports.",
    body:
      "The engine that moves a document from draft to permanent record. Sign once, and your signature is stamped onto every document the approval produces. The moment the MD signs, the bank-ready letter is generated automatically.",
    bullets: [
      "Custom approval chains with out-of-office delegation",
      "Amount thresholds and separation-of-duties rules baked in",
      "Digital signatures re-used across approvals, with fresh confirmation on high-value items",
      "Bank-ready payment letters with your company letterhead",
    ],
    link: { label: "See how it works", href: "/product/how-it-works" },
  },
  {
    date: "October 2025",
    tag: "feature",
    title: "Vendors, payment vouchers, purchase orders.",
    body:
      "The operational core landed: a structured place for vendor records, payment vouchers that move through a multi-level chain, and purchase orders with line items, budgets, and Head-of-Department sign-off.",
    bullets: [
      "Vendor directory with a qualification workflow",
      "Payment voucher form with attachments and cost codes",
      "Purchase orders with line items and budget checks",
      "Auto-save at every step — nothing lost if the browser closes",
    ],
  },
  {
    date: "September 2025",
    tag: "platform",
    title: "The foundation.",
    body:
      "The starting point every later capability builds on. Each customer's workspace is cleanly separated from every other, a role system enforces who can do what, and the admin tools to get an organisation set up cleanly.",
    bullets: [
      "Each customer's workspace isolated from every other at the database layer",
      "Role hierarchy with configurable permissions",
      "Enterprise-grade sign-in with session management",
      "Admin tools for setting up new organisations cleanly",
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
      <main id="main">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 32px 64px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
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
            CHANGELOG
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
            What we&rsquo;ve shipped.
          </m.h1>
          <m.p
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
          </m.p>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8fafc", padding: "64px 32px 100px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {ENTRIES.map((entry) => (
            <m.article
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
                        backgroundColor: "var(--color-gold)",
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
                    color: "var(--color-gold-on-light)",
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
            </m.article>
          ))}

          {/* Subscribe footer */}
          <m.div
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
              <Sparkles size={20} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" style={{ marginTop: "3px", flexShrink: 0 }} />
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
              Subscribe
            </Link>
          </m.div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
