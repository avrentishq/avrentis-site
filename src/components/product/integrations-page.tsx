"use client";

/**
 * IntegrationsCataloguePage — /product/integrations. Replaces the stub
 * with an honest catalogue of what connects today, what's coming, and
 * what we'll build for enterprise engagements. Availability labels map
 * to the platform's actual capability, not marketing ambition.
 */

import { PLAN_ORDER } from "@edidi-hq/core/billing/catalog";
import { PLAN_CAPACITY } from "@edidi-hq/core/billing/capacity";
import type { PlanFeatureKey } from "@edidi-hq/core/billing/features";
import { planScopeNote, type FeaturePlans } from "@/lib/plan-names";
import { useRef } from "react";
import Link from "next/link";
import { m, useScroll, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import {
  KeyRound,
  UserCog,
  MessagesSquare,
  Receipt,
  Landmark,
  Webhook,
  ArrowRight,
} from "lucide-react";
import { fadeUpOnScroll, fadeUpOnLoad } from "@/lib/animations";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { contactHref } from "@/app/contact/tabs";
import { ACCESS_ENDS } from "@/lib/compliance-posture";
import { LEAD_CURRENCY } from "@/lib/market";
import { toMinorUnits } from "@/lib/money";
import { FEATURED_VOUCHER, featuredTrailEntry } from "./demo-fixtures";
import { DarkHeroBackdrop } from "@/components/ui/dark-hero-backdrop";
import { ButtonLink } from "@/components/ui/button";
import { SectionIntro } from "@/components/ui/section-intro";
import { Z_INDEX } from "@/lib/layers";

/**
 * The sample delivery: the featured demo voucher being sanctioned. Every value
 * that describes the voucher comes from the demo fixtures, so the sample's
 * reference, amount, currency, approver and time match the mockups on every
 * other page; the amount is in minor units, as the real payload carries it.
 */
const sanction = featuredTrailEntry("sanction");
const sanctionedAt = new Date(sanction.at);
const WEBHOOK_SAMPLE = [
  "content-type: application/json",
  "webhook-id: 6f1c2a9e-4b7d-4e21-9c55-0d3a8e7b1f42",
  `webhook-timestamp: ${Math.floor(sanctionedAt.getTime() / 1000)}`,
  "webhook-signature: v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4=",
  "",
  JSON.stringify(
    {
      eventId: "evt_8c1f0b6e2d4a…",
      type: "document.sanctioned",
      tenantId: "0d9e4c1a-…",
      createdAt: sanctionedAt.toISOString(),
      data: {
        documentType: FEATURED_VOUCHER.documentType,
        referenceNumber: FEATURED_VOUCHER.reference,
        amountMinor: toMinorUnits(FEATURED_VOUCHER.amount, LEAD_CURRENCY),
        currency: LEAD_CURRENCY,
        sanctionedBy: { name: sanction.person.name, role: sanction.person.role },
        sanctionedAt: sanctionedAt.toISOString(),
        departmentName: FEATURED_VOUCHER.department,
      },
    },
    null,
    2,
  ),
].join("\n");


// Only what ships is listed. Unbuilt "talk to us" items, banking connectors and
// the custom-connector offer were removed: the page names nothing the product
// does not do today (`integrations-claims.lock.test.ts`).
type Availability = "available";

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
  /** Plan feature that gates this category; its plans are named after the lede. */
  planFeature?: PlanFeatureKey;
  integrations: Integration[];
}

/** WhatsApp and SMS ride every plan's monthly message allowance (core's capacity), so say so only while every plan has one. */
const MESSAGING_ON_EVERY_PLAN = PLAN_ORDER.every((planKey) => PLAN_CAPACITY[planKey].monthlyMessageCap > 0);

const CATEGORIES: Category[] = [
  {
    id: "identity",
    icon: KeyRound,
    eyebrow: "IDENTITY & SINGLE SIGN-ON",
    title: "Sign in with the identity provider you already run.",
    lede:
      `${BRAND.name} speaks the standard identity protocols — OpenID Connect and SAML 2.0 — with no per-provider hacks. Sessions, revocation, and MFA all work the same whether you're on Okta, Entra, or Google Workspace, and each person keeps one sign-in across every company they work in.`,
    planFeature: "sso",
    integrations: [
      { name: "SAML 2.0", summary: "Federated sign-in with signed assertions, for any SAML identity provider.", availability: "available" },
      { name: "OpenID Connect (OIDC)", summary: "OIDC flow for modern identity providers.", availability: "available" },
      { name: "Okta", summary: "Sign-in over OIDC or SAML 2.0.", availability: "available" },
      { name: "Microsoft Entra ID", summary: "Sign-in over OIDC or SAML 2.0.", availability: "available" },
      { name: "Google Workspace", summary: "OIDC federation with Workspace directory.", availability: "available" },
      { name: "Required single sign-on", summary: "Make your identity provider the way your people sign in, with a password kept for administrators.", availability: "available" },
      { name: "One provider for a group", summary: "Companies in a group can accept the sign-in of the group's identity provider.", availability: "available" },
    ],
  },
  {
    id: "provisioning",
    icon: UserCog,
    eyebrow: "DIRECTORY PROVISIONING",
    title: "Users flow from your IdP — and leave when they should.",
    lede:
      `SCIM 2.0 keeps ${BRAND.name} in sync with your directory. Add a user in Okta, they land here. Mark them inactive, their session is revoked ${ACCESS_ENDS}. Directory groups can ask for roles — but beyond basic staff access, a person in your organisation approves each one first.`,
    planFeature: "sso",
    integrations: [
      { name: "SCIM 2.0", summary: "User provisioning — create, update, and deactivate.", availability: "available" },
      { name: "Okta SCIM", summary: "Tested against Okta's lifecycle provisioning.", availability: "available" },
      { name: "Entra ID SCIM", summary: "User provisioning from Entra.", availability: "available" },
      { name: "Google Workspace SCIM", summary: "User provisioning from Workspace.", availability: "available" },
      { name: "Groups mapped to roles", summary: "Directory groups request roles; anything beyond staff waits for a person to approve it.", availability: "available" },
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
      { name: "WhatsApp", summary: `Approval alerts with a secure review link${MESSAGING_ON_EVERY_PLAN ? ", on every plan" : ""}.`, availability: "available" },
      { name: "SMS", summary: "Critical alerts to Nigerian and international numbers.", availability: "available" },
      { name: "In-app inbox", summary: "Live badge + typed workspace inbox on every page.", availability: "available" },
    ],
  },
  {
    id: "accounting",
    icon: Receipt,
    eyebrow: "ACCOUNTING & ERP",
    title: "Approved spending lands in your ledger, coded your way.",
    lede:
      `Vouchers and order lines carry your own accounting codes, and approved vouchers and payments become balanced journal entries in a file your accounting system imports — each entry exported once, so nothing is posted twice. Use a ready-made layout where your system has one; any other ledger takes the standard CSV, and plans with API access can also read the entries over our API.`,
    planFeature: "budgetCodes",
    integrations: [
      { name: "Your chart of accounts", summary: "Accounts, cost centres, projects and funds on every voucher and order line.", availability: "available" },
      { name: "QuickBooks Online", summary: "Journal entries in QuickBooks Online's import layout.", availability: "available" },
      { name: "Zoho Books", summary: "Journal entries in Zoho Books' manual-journal import.", availability: "available" },
      { name: "Sage Accounting", summary: "Journal entries in Sage Accounting's journal import template.", availability: "available" },
      { name: "Standard CSV journal", summary: "Every field, for any ledger that reads a CSV.", availability: "available" },
      { name: "CSV export", summary: "Period-bounded exports with full approval trail per line.", availability: "available" },
      { name: "Other accounting systems", summary: "Import the standard CSV journal — and tell us which system you use.", availability: "available" },
    ],
  },
  {
    id: "banking",
    icon: Landmark,
    eyebrow: "BANKING",
    title: "Bank letters and payment files, in your bank's own scheme.",
    lede:
      "Every sanctioned voucher produces a formally formatted bank letter with the MD's signature, and approved payments go out as a payment file in your bank's own scheme — upload it, and the money moves on your rails.",
    integrations: [
      { name: "Bank-ready PDF letter", summary: "Per-voucher letter with MD signature + letterhead.", availability: "available" },
      { name: "NIBSS Direct Credit", summary: "Naira batch files accepted by most Nigerian banks, plus GTBank and Access Bank portal imports.", availability: "available" },
      { name: "SEPA Credit Transfer", summary: "Euro payments to any IBAN, as an ISO 20022 file.", availability: "available" },
      { name: "Bacs Direct Credit (Standard 18)", summary: "Sterling payments to UK sort codes and account numbers.", availability: "available" },
      { name: "ACH credits (NACHA)", summary: "US dollar payments, each marked checking or savings from the payee's account.", availability: "available" },
    ],
  },
  {
    id: "developer",
    icon: Webhook,
    eyebrow: "DEVELOPER PLATFORM",
    title: "Build on top of your approval record.",
    lede:
      "A read-access REST API exposes your documents, users, vendors, budgets, accounting codes, journal entries, audit events, and reports, with webhooks for every state transition. Each API key permission opens exactly the endpoints it names, and long lists come back a page at a time.",
    planFeature: "apiAccess",
    integrations: [
      { name: "REST API (v1)", summary: "Read access to documents, users, vendors, budgets, journal entries, audit events, and reports.", availability: "available" },
      { name: "Webhooks", summary: "Per-tenant event subscriptions with retries, signed to the Standard Webhooks scheme.", availability: "available" },
      { name: "Audit export", summary: "Regulator-ready audit bundles, downloadable for any period.", availability: "available" },
    ],
  },
];

const STATUS_STYLES: Record<Availability, { label: string; color: string; bg: string; border: string }> = {
  available: {
    label: "Available",
    color: "var(--color-success)",
    bg: "var(--color-success-tint)",
    border: "rgba(var(--color-success-rgb), 0.28)",
  },
};

function Badge({ availability }: { availability: Availability }) {
  const s = STATUS_STYLES[availability];
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-3xs)",
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: s.color,
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "var(--radius-xs)",
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
          borderRadius: "var(--radius-circle)",
          backgroundColor: s.color,
          display: "inline-block",
        }}
      />
      {s.label}
    </span>
  );
}

function CategoryBlock({ category, index, planNote }: { category: Category; index: number; planNote: string }) {
  const Icon = category.icon;
  return (
    <m.section
      {...fadeUpOnScroll()}
      id={category.id}
      style={{ scrollMarginTop: "90px", position: "relative", overflow: "hidden", isolation: "isolate" }}
    >
      <SectionBackdrop src={SECTION_BACKDROPS.integrationsCategoryBlock} scrim="light" />
      <div style={{ display: "grid", gap: "40px", alignItems: "start" }} className="grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-card)",
                backgroundColor: "var(--color-gold-tint)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={18} strokeWidth={1.8} color="var(--color-gold)" aria-hidden="true" />
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-2xs)",
                color: "var(--color-gold-on-light)",
                letterSpacing: "0.08em",
              }}
            >
              {String(index + 1).padStart(2, "0")} · {category.eyebrow}
            </span>
          </div>
          <h2
            style={{
              fontWeight: 400,
              fontSize: "var(--text-heading-md)",
              color: "var(--color-text-primary)",
              lineHeight: 1.25,
              margin: "0 0 12px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-heading-xl"
          >
            {category.title}
          </h2>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--color-text-muted)", lineHeight: 1.7, margin: 0, maxWidth: "var(--measure-compact)" }}>
            {category.lede}
            {planNote ? ` ${planNote}` : null}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--color-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {category.integrations.map((integration, i) => (
            <div
              key={integration.name}
              style={{
                padding: "18px 22px",
                borderTop: i === 0 ? "none" : "1px solid var(--color-bg)",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                    {integration.name}
                  </span>
                </div>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.55, margin: 0 }}>
                  {integration.summary}
                </p>
              </div>
              <Badge availability={integration.availability} />
            </div>
          ))}
        </div>
      </div>
    </m.section>
  );
}

/** `featurePlans` and `allPlanNames` come from the pricing API through the route. SCIM
 *  provisioning rides on `sso`; the chart of accounts and journal export on `budgetCodes`. */
export function IntegrationsCataloguePage({
  featurePlans,
  allPlanNames,
}: {
  featurePlans: FeaturePlans;
  allPlanNames: string[];
}) {
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
          backgroundColor: "var(--color-navy-primary)",
          padding: "120px 40px 96px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.integrationsHero} scrim="dark" />
        <DarkHeroBackdrop glows="hero" grid gridY={gridY} />
        <div style={{ maxWidth: "var(--measure-wide)", margin: "0 auto", textAlign: "center", position: "relative", zIndex: Z_INDEX.content }}>
          <SectionIntro
            surface="dark"
            reveal="load"
            titleAs="h1"
            eyebrow="INTEGRATIONS"
            eyebrowStyle={{
              display: "inline-block",
              marginBottom: "20px",
            }}
            title={`${BRAND.name} plugs into the stack you already run.`}
            titleStyle={{
              fontWeight: 700,
              fontSize: "var(--text-display-xs)",
              lineHeight: 1.15,
              margin: "0 0 24px",
            }}
            titleClassName="lg:!text-display-4xl"
            lede={
              <>
                Identity, provisioning, notifications, accounting, banking, and a
                first-class developer platform. Everything listed here is available
                today.
              </>
            }
            ledeStyle={{
              fontSize: "var(--text-2xl)",
              color: "var(--color-text-subtle)",
              lineHeight: 1.7,
              margin: "0 auto 32px",
              maxWidth: "var(--measure)",
            }}
          />
          <m.div
            {...fadeUpOnLoad(3)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <ButtonLink
              href="#identity"
              size="md"
            >
              Explore the catalogue
            </ButtonLink>
          </m.div>
        </div>
      </section>

      {/* ── CATEGORY NAV ───────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "40px 40px", borderBottom: "1px solid var(--color-border)", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.integrationsCategoryNav} scrim="light" />
        <div
          style={{
            maxWidth: "var(--layout-max-width)",
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
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-3xs)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
            }}
          >
            Jump to:
          </span>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`#${c.id}`}
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-bg-light)",
              }}
            >
              {c.eyebrow.split(" & ")[0].toLowerCase().replace(/^\w/, (ch) => ch.toUpperCase())}
            </Link>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-bg-light)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.integrationsCategories} scrim="light" />
        <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "88px" }}>
          {CATEGORIES.map((c, i) => (
            <CategoryBlock
              key={c.id}
              category={c}
              index={i}
              planNote={c.planFeature ? planScopeNote(featurePlans[c.planFeature] ?? [], allPlanNames) : ""}
            />
          ))}
        </div>
      </section>

      {/* ── DEV TEASER ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.integrationsDevTeaser} scrim="light" />
        <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto" }}>
          <div style={{ display: "grid", gap: "48px", alignItems: "center" }} className="grid-cols-1 lg:grid-cols-2">
            <m.div
              {...fadeUpOnScroll()}
            >
              <SectionIntro
                reveal="none"
                eyebrow="DEVELOPER PLATFORM"
                eyebrowStyle={{
                  marginBottom: "12px",
                }}
                title="Every transition is an event you can subscribe to."
                titleStyle={{
                  fontWeight: 400,
                  fontSize: "var(--text-heading-xl)",
                  lineHeight: 1.2,
                  margin: "0 0 14px",
                  letterSpacing: "0.01em",
                }}
                titleClassName="lg:!text-heading-3xl"
              />
              <p style={{ fontSize: "var(--text-lg)", color: "var(--color-text-muted)", lineHeight: 1.75, margin: "0 0 16px" }}>
                Webhooks signed to the Standard Webhooks scheme, versioned
                schemas, and retries with exponential backoff that keep the same
                delivery id, so you can safely ignore repeats. Build the notifications your
                team actually wants, or sync sanctioned vouchers to your ledger
                the second the MD signs.
              </p>
              <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 24px" }}>
                Full API documentation is being finalised for public release.
                Launch partners get access today.
              </p>
              <Link
                href={contactHref("demo")}
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--color-gold-on-light)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Request API access <ArrowRight size={13} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </m.div>

            <m.div
              {...fadeUpOnScroll(1)}
              style={{
                backgroundColor: "var(--color-navy-primary)",
                borderRadius: "var(--radius-lg)",
                padding: "22px",
                boxShadow: "0 20px 50px rgba(var(--color-navy-primary-rgb), 0.18)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-3xs)",
                    color: "var(--color-text-subtle)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  POST · /webhooks/your-endpoint
                </span>
              </div>
              <pre
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-border)",
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
{WEBHOOK_SAMPLE}
              </pre>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-subtle)",
                  lineHeight: 1.6,
                  margin: "14px 0 0",
                }}
              >
                Verify <code style={{ fontFamily: "var(--font-mono)" }}>webhook-signature</code> (HMAC-SHA256 over{" "}
                <code style={{ fontFamily: "var(--font-mono)" }}>{"{webhook-id}.{webhook-timestamp}.{body}"}</code> with your
                subscription secret), reject timestamps more than five minutes off your clock, and ignore ids you have
                already processed. These three Standard Webhooks headers are the only signature a delivery carries.
              </p>
            </m.div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
