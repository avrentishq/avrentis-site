import type { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  ShoppingCart,
  Archive,
  ClipboardCheck,
  Users,
  Link2,
  type LucideIcon,
} from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/sections/cta-banner";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import type { ModuleStatus } from "@/components/product/module-layout";

export const metadata: Metadata = {
  title: "The Avrentis platform — six modules, one system of record",
  description:
    "Avrentis structures how your organisation makes decisions across payments, procurement, documents, compliance, people, and integrations. Six modules, one approval engine, one permanent record.",
  openGraph: {
    title: "The Avrentis platform — six modules, one system of record",
    description:
      "Six modules share one approval engine and one permanent record. Payables, Procurement, Documents, Compliance, HR, Integrations.",
    url: "https://avrentis.com/product",
    type: "website",
  },
};

interface Module {
  slug: string;
  name: string;
  subtitle: string;
  body: string;
  icon: LucideIcon;
  status: ModuleStatus;
}

const MODULES: Module[] = [
  {
    slug: "pay",
    name: "Avrentis Payables",
    subtitle: "Payment approvals & authorisation",
    body:
      "Every payment voucher submitted, reviewed, and sanctioned through a defined approval chain. Bank-ready PDFs the moment the MD signs.",
    icon: CreditCard,
    status: "available",
  },
  {
    slug: "procure",
    name: "Avrentis Procurement",
    subtitle: "Purchase orders on record",
    body:
      "Structured purchase order workflow with vendor management, line-item tracking, and role-based approval chains. Procurement without the paperwork gap.",
    icon: ShoppingCart,
    status: "available",
  },
  {
    slug: "vault",
    name: "Avrentis Documents",
    subtitle: "Institutional memory",
    body:
      "Every approved document centrally stored, tagged, and instantly retrievable. Replace scattered drives and physical files with one searchable repository.",
    icon: Archive,
    status: "coming_soon",
  },
  {
    slug: "audit",
    name: "Avrentis Compliance",
    subtitle: "Compliance & accountability",
    body:
      "A tamper-proof log of every action — submissions, approvals, queries, signatures. Meet SOC2 + internal audits without the manual scramble.",
    icon: ClipboardCheck,
    status: "available",
  },
  {
    slug: "people",
    name: "Avrentis HR",
    subtitle: "Workforce & HR approvals",
    body:
      "Extend structured approvals to leave requests, onboarding, and policy acknowledgements. The same approval engine, shaped for people processes.",
    icon: Users,
    status: "roadmap",
  },
  {
    slug: "connect",
    name: "Avrentis Integrations",
    subtitle: "External systems & integrations",
    body:
      "Push Avrentis events into your accounting, HR, or data-warehouse stack via webhooks and a typed API. Your operational record flowing where it needs to go.",
    icon: Link2,
    status: "partial",
  },
];

const STATUS_BADGE: Record<
  ModuleStatus,
  { label: string; bg: string; color: string }
> = {
  available: { label: "Available", bg: "rgba(39,174,96,0.12)", color: "#047857" },
  coming_soon: { label: "Coming soon", bg: "rgba(var(--color-gold-rgb), 0.12)", color: "var(--color-gold)" },
  partial: { label: "In beta", bg: "rgba(var(--color-gold-rgb), 0.12)", color: "var(--color-gold)" },
  roadmap: { label: "Roadmap", bg: "rgba(148,163,184,0.12)", color: "#64748b" },
};

export default function ProductOverviewPage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#0f172a",
          padding: "120px 40px 96px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AmbientGlow top="-120px" left="-100px" size={520} intensity={0.22} duration={32} />
        <AmbientGlow bottom="-140px" right="-80px" size={560} intensity={0.18} duration={38} delay={0.5} />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <span
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
            The Avrentis Platform
          </span>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "36px",
              color: "#FFFFFF",
              lineHeight: 1.15,
              margin: "0 0 24px",
            }}
            className="lg:!text-[52px]"
          >
            Six modules. One approval engine. One permanent record.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "17px",
              color: "#94a3b8",
              lineHeight: 1.7,
              margin: "0 auto 36px",
              maxWidth: "640px",
            }}
          >
            Avrentis is not a collection of unrelated tools — it is a single
            platform where every financial decision, procurement action,
            compliance event, and people process flows through the same
            approval rails and lands on the same immutable record.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/trial"
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
              Start your 14-day trial
            </Link>
            <Link
              href="/product/how-it-works"
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
              See how it works →
            </Link>
          </div>
        </div>
      </section>

      {/* ── MODULE GRID ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              display: "block",
              marginBottom: "12px",
            }}
          >
            THE MODULES
          </span>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 48px",
              maxWidth: "560px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            Each module does one thing, precisely.
          </h2>

          <div
            style={{ display: "grid", gap: "20px" }}
            className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const badge = STATUS_BADGE[mod.status];
              return (
                <Link
                  key={mod.slug}
                  href={`/product/${mod.slug}`}
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    textDecoration: "none",
                    transition: "border-color 200ms ease, transform 200ms ease",
                  }}
                  className="hover:!border-[rgba(var(--color-gold-rgb),0.4)]"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={20} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: badge.color,
                        backgroundColor: badge.bg,
                        borderRadius: "3px",
                        padding: "3px 8px",
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "18px",
                        color: "#0f172a",
                        margin: "0 0 2px",
                      }}
                    >
                      {mod.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        color: "var(--color-gold)",
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      {mod.subtitle}
                    </p>
                  </div>

                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      color: "#64748b",
                      lineHeight: 1.65,
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {mod.body}
                  </p>

                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#0f172a",
                      marginTop: "4px",
                    }}
                  >
                    Explore {mod.name.replace("Avrentis ", "")} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PLATFORM RHYTHM (how modules share the engine) ─────────── */}
      <section style={{ backgroundColor: "#f1f5f9", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              display: "block",
              marginBottom: "12px",
            }}
          >
            ONE APPROVAL ENGINE
          </span>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.25,
              margin: "0 0 24px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            Every module shares the same approval rails.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
              color: "#64748b",
              lineHeight: 1.7,
              margin: "0 0 32px",
              maxWidth: "640px",
            }}
          >
            A payment voucher, a purchase order, a leave request, and a vendor
            onboarding all travel the same authority engine: submission →
            defined approvers → immutable audit event → permanent record.
            Learn one module, you know them all. Configure a rule once, it
            applies across every approval your organisation runs.
          </p>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "32px",
              display: "grid",
              gap: "24px",
            }}
            className="grid-cols-1 md:grid-cols-4"
          >
            {[
              { step: "01", title: "Submit", body: "Any module, structured form." },
              { step: "02", title: "Approve", body: "Role-based chain, any device." },
              { step: "03", title: "Record", body: "Immutable audit log entry." },
              { step: "04", title: "Export", body: "Audit-ready PDF bundles." },
            ].map((s) => (
              <div key={s.step} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontFeatureSettings: '"tnum" 1',
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "var(--color-gold)",
                  }}
                >
                  {s.step}
                </span>
                <h4
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {s.title}
                </h4>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "#64748b",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {s.body}
                </p>
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
