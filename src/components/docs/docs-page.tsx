"use client";

/**
 * DocsHubPage — the /docs landing. The platform ships product copy that's
 * already quite explanatory, so the docs hub's first job is to route
 * readers to the right existing surface — Security, Integrations, How
 * it works, individual modules — rather than duplicate that material.
 *
 * Sections that don't exist yet (full how-tos, API reference) are
 * flagged honestly as in-progress with a direct contact route.
 */

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BRAND, MODULES, moduleHref, moduleName, publicModuleKeys, LEGAL_PAGES } from "@/lib/brand";
import { MODULE_COPY } from "@/lib/module-copy";
import { m } from "framer-motion";
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
import { fadeUpOnScroll, fadeUpOnLoad } from "@/lib/animations";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { contactHref } from "@/app/contact/tabs";
import { TRIAL_SETUP_TIME } from "@/lib/trial-terms";
import { SITE_ROUTES } from "@/lib/routes";
import { ButtonLink, buttonProps } from "@/components/ui/button";
import { SectionIntro } from "@/components/ui/section-intro";
import { Z_INDEX } from "@/lib/layers";


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
    title: `Set up your workspace ${TRIAL_SETUP_TIME}.`,
    lede:
      "A quick orientation for the first admin: create the tenant, provision users, configure your first approval chain, and sanction your first document.",
    items: [
      {
        title: "The complete approval lifecycle",
        body: "Submit → Review → Sanction → Record, with mockups of every stage.",
        href: SITE_ROUTES.howItWorks,
        status: "live",
      },
      {
        title: "Platform overview",
        body:
          "The four suites, the modules inside them, and the approval engine they share.",
        href: SITE_ROUTES.product,
        status: "live",
      },
      {
        title: "First-tenant setup guide",
        body: "Step-by-step: creating your organisation, inviting admins, configuring roles.",
        href: contactHref("demo"),
        status: "wip",
      },
      {
        title: "Importing existing vendors and documents",
        body: "CSV shapes, mapping columns, running a dry-run before import.",
        href: contactHref("demo"),
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
        title: "Roles, permissions, and approval rules",
        body: "A fine-grained permission system with extra rules for department scope and amount thresholds.",
        href: LEGAL_PAGES.security,
        status: "live",
      },
      {
        title: "Document state machines",
        body: "Every transition a voucher or PO can take, and the roles that can cause them.",
        href: SITE_ROUTES.howItWorks,
        status: "live",
      },
      {
        title: "Querying and delegation",
        body: "Pausing an approval, asking the submitter a question, re-entering the chain.",
        href: contactHref("demo"),
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
    items: publicModuleKeys().map((moduleKey) => ({
      title: moduleName(moduleKey),
      body: `${MODULE_COPY[moduleKey].tagline}.`,
      href: moduleHref(moduleKey),
      status: MODULES[moduleKey].status === "available" ? ("live" as const) : ("wip" as const),
    })),
  },
  {
    icon: ShieldCheck,
    eyebrow: "PLATFORM & SECURITY",
    title: "The stack that protects every tenant.",
    lede:
      "Isolation, authority, session integrity, audit trail, lifecycle, encryption. The same content your CISO will read during a review.",
    items: [
      { title: "Security overview", body: "The six-layer stack with diagrams.", href: LEGAL_PAGES.security, status: "live" },
      { title: "Trust centre", body: "Controls framework, sub-processors, data residency, DPA.", href: LEGAL_PAGES.trust, status: "live" },
      { title: "Privacy policy", body: "What we collect, why, and your data-subject rights.", href: LEGAL_PAGES.privacy, status: "live" },
      { title: "Terms of service", body: "The contract governing use of the service.", href: LEGAL_PAGES.terms, status: "live" },
    ],
  },
  {
    icon: ClipboardCheck,
    eyebrow: "ADMINISTRATION",
    title: `Running ${BRAND.name} inside your organisation.`,
    lede:
      "User provisioning, SSO configuration, IP allowlisting and MFA. Written for admins and internal IT.",
    items: [
      {
        title: "SSO configuration (OIDC and SAML)",
        body: "Okta, Entra, Google Workspace setup walk-throughs.",
        href: `${SITE_ROUTES.integrations}#identity`,
        status: "wip",
      },
      {
        title: "SCIM 2.0 provisioning",
        body: "Automated user lifecycle from your IdP.",
        href: `${SITE_ROUTES.integrations}#provisioning`,
        status: "wip",
      },
      {
        title: "IP allowlist configuration",
        body: "Per-tenant CIDR rules for IPv4 and IPv6.",
        href: contactHref("security"),
        status: "wip",
      },
      {
        title: "MFA enforcement",
        body: "Two-factor sign-in with secured recovery codes.",
        href: LEGAL_PAGES.security,
        status: "live",
      },
    ],
  },
  {
    icon: Plug,
    eyebrow: "INTEGRATIONS",
    title: `Connecting ${BRAND.name} to your stack.`,
    lede:
      "The catalogue page has the full list. These guides cover the configuration details for each one.",
    items: [
      {
        title: "Integrations catalogue",
        body: "Every integration with honest availability labels.",
        href: SITE_ROUTES.integrations,
        status: "live",
      },
      { title: "Email notifications", body: "Configuring sender domains and templates.", href: contactHref("demo"), status: "wip" },
      { title: "WhatsApp notifications", body: "Setting up business-account routing.", href: contactHref("demo"), status: "wip" },
      { title: "SMS notifications", body: "Adding sender IDs and international routing.", href: contactHref("demo"), status: "wip" },
    ],
  },
  {
    icon: Webhook,
    eyebrow: "API & WEBHOOKS",
    title: `Build on top of ${BRAND.name}.`,
    lede:
      "Authenticated REST API and per-tenant webhook subscriptions. Public API reference is being prepared — launch partners get early access.",
    items: [
      {
        title: "Webhook payload reference",
        body: "Event types, signing, retries.",
        href: `${SITE_ROUTES.integrations}#developer`,
        status: "live",
      },
      { title: "REST API reference (v1)", body: "Full resource docs being finalised for public release.", href: contactHref("demo"), status: "wip" },
      { title: "Audit export format", body: "The regulator-ready audit bundle schema.", href: contactHref("security"), status: "wip" },
    ],
  },
  {
    icon: Users,
    eyebrow: "GOVERNANCE",
    title: "Board views, auditor access, maker-checker.",
    lede:
      `How ${BRAND.name} surfaces company-level governance — the Company Board, auditor role, board provisioning workflow.`,
    items: [
      { title: "Company Board View", body: "The governance dashboard for MDs and directors.", href: moduleHref("audit"), status: "live" },
      { title: "Auditor role", body: "Time-bound, read-only access for external reviews.", href: LEGAL_PAGES.security, status: "live" },
      {
        title: "Board provisioning (maker-checker)",
        body: "How provisional access becomes confirmed access.",
        href: contactHref("security"),
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
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-4xs)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--color-gold-on-light)",
        backgroundColor: "var(--color-gold-tint)",
        border: "1px solid var(--color-gold-divider)",
        borderRadius: "var(--radius-xs)",
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
    <m.section
      {...fadeUpOnScroll()}
      style={{ scrollMarginTop: "90px", position: "relative", overflow: "hidden", isolation: "isolate" }}
      id={category.eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
    >
      <div style={{ display: "grid", gap: "40px", alignItems: "start" }} className="grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
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
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--color-gold-on-light)", letterSpacing: "0.08em" }}>
              {String(index + 1).padStart(2, "0")} · {category.eyebrow}
            </span>
          </div>
          <h2
            style={{
              fontWeight: 400,
              fontSize: "var(--text-heading-md)",
              color: "var(--color-text-primary)",
              lineHeight: 1.25,
              margin: "0 0 10px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-heading-lg"
          >
            {category.title}
          </h2>
          <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-muted)", lineHeight: 1.7, margin: 0, maxWidth: "var(--measure-compact)" }}>
            {category.lede}
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
          {category.items.map((item, i) => {
            const isExternal = item.href.startsWith("mailto:");
            const Inner = (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <span style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {item.title}
                    </span>
                    <StatusPill status={item.status} />
                  </div>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.55, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
                <ArrowRight size={14} strokeWidth={1.8} color="var(--color-gold)" aria-hidden="true" style={{ flexShrink: 0 }} />
              </>
            );
            const style: React.CSSProperties = {
              padding: "18px 22px",
              borderTop: i === 0 ? "none" : "1px solid var(--color-bg)",
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
    </m.section>
  );
}

export function DocsHubPage() {

  return (
    <>
      <Navbar />
      <main id="main">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-navy-primary)",
          padding: "120px 40px 96px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <div style={{ maxWidth: "var(--measure-wide)", margin: "0 auto", textAlign: "center", position: "relative", zIndex: Z_INDEX.content }}>
          <SectionIntro
            surface="dark"
            reveal="load"
            titleAs="h1"
            eyebrow="DOCUMENTATION"
            eyebrowStyle={{
              display: "inline-block",
              marginBottom: "20px",
            }}
            title={`Everything you need to run ${BRAND.name} — in one place.`}
            titleStyle={{
              fontWeight: 700,
              fontSize: "var(--text-display-xs)",
              lineHeight: 1.15,
              margin: "0 0 24px",
            }}
            titleClassName="lg:!text-display-3xl"
            lede={
              <>
                A hub for admins, developers, and internal IT. Pointers to the
                deep-dive pages we already publish, and honest signals for the
                guides we&rsquo;re still writing — with a direct line to a human
                where a guide would have lived.
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
            <a
              href="#getting-started"
              {...buttonProps({ size: "md" })}
            >
              Start here
            </a>
            <ButtonLink
              href={contactHref("feedback")}
              variant="secondary"
              surface="dark"
              size="md"
            >
              <Mail size={14} strokeWidth={1.8} aria-hidden="true" />
              Request a guide
            </ButtonLink>
          </m.div>
        </div>
      </section>

      {/* ── CATEGORY NAV ───────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "40px 32px", borderBottom: "1px solid var(--color-border)", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <div
          style={{
            maxWidth: "var(--layout-max-width)",
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
            <a
              key={c.eyebrow}
              href={`#${c.eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-bg-light)",
              }}
            >
              {c.eyebrow.charAt(0) + c.eyebrow.slice(1).toLowerCase().split(" ")[0]}
            </a>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-bg-light)", padding: "90px 32px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "80px" }}>
          {CATEGORIES.map((c, i) => (
            <Category key={c.eyebrow} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* ── FEEDBACK FOOTER ────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "80px 32px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <div style={{ maxWidth: "var(--layout-reading-width)", margin: "0 auto" }}>
          <m.div
            {...fadeUpOnScroll()}
            style={{
              backgroundColor: "var(--color-bg-light)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
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
                  fontWeight: 600,
                  fontSize: "var(--text-xl)",
                  color: "var(--color-text-primary)",
                  margin: "0 0 6px",
                }}
              >
                Couldn&rsquo;t find what you were looking for?
              </h3>
              <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-muted)", lineHeight: 1.65, margin: 0 }}>
                Tell us what guide would have helped. We write what customers
                actually ask for, not what marketing thinks we should publish.
              </p>
            </div>
            <ButtonLink
              href={contactHref("feedback")}
              size="sm"
            >
              Request a guide
            </ButtonLink>
          </m.div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
