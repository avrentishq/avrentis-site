"use client";

import Link from "next/link";
import { AvrentisLogo } from "@/components/ui/logo";

const PRODUCT_LINKS = [
  { label: "Avrentis Pay", href: "/product/pay" },
  { label: "Avrentis Procurement", href: "/product/procure" },
  { label: "Avrentis Records", href: "/product/vault" },
  { label: "Avrentis Audit", href: "/product/audit" },
];

const PLATFORM_LINKS = [
  { label: "How it works", href: "/product/how-it-works" },
  { label: "Security", href: "/product/security" },
  { label: "Integrations", href: "/product/integrations" },
  { label: "Pricing", href: "/pricing" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

const START_LINKS = [
  { label: "Start for free", href: "/contact" },
  { label: "Login", href: "https://app.avrentis.com/login" },
];

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 400,
  fontSize: "12px",
  color: "#64748b",
  textDecoration: "none",
  display: "block",
  marginBottom: "8px",
  transition: "color 150ms ease",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  fontSize: "10px",
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "#C68B2F",
  marginBottom: "14px",
};

function FooterColumn({ label, links }: { label: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          style={linkStyle}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#C68B2F"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#020617",
        padding: "64px 40px 32px",
        borderTop: "0.5px solid rgba(198,139,47,0.1)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Four-column grid */}
        <div
          style={{
            display: "grid",
            gap: "40px",
            marginBottom: "40px",
          }}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]"
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <AvrentisLogo variant="primary" size={28} wordmarkColor="#ffffff" />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "12px",
                color: "#64748b",
                lineHeight: 1.6,
                maxWidth: "200px",
              }}
            >
              Operational authority platform for organisations across Africa and beyond.
            </span>
          </div>

          <FooterColumn label="PRODUCT" links={PRODUCT_LINKS} />
          <FooterColumn label="PLATFORM" links={PLATFORM_LINKS} />
          <FooterColumn label="COMPANY" links={COMPANY_LINKS} />
          <FooterColumn label="GET STARTED" links={START_LINKS} />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "0.5px solid rgba(255,255,255,0.04)",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "11px",
              color: "#334155",
            }}
          >
            &copy; 2026 AVRENTIS. All rights reserved.
          </span>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              fontSize: "9px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#C68B2F",
            }}
          >
            POWERED BY AVRENTIS
          </span>
        </div>
      </div>
    </footer>
  );
}
