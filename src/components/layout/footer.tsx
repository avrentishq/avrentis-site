"use client";

import Link from "next/link";
import { AvrentisLogo } from "@/components/ui/logo";

const PLATFORM_LINKS = [
  { label: "Avrentis Pay", href: "/product" },
  { label: "Avrentis Procure", href: "/product" },
  { label: "Avrentis Vault", href: "/product" },
  { label: "Avrentis Audit", href: "/product" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy policy", href: "/privacy" },
];

const START_LINKS = [
  { label: "Start for free", href: "/contact" },
  { label: "Book a demo", href: "/contact" },
  { label: "Log in", href: "https://app.avrentis.com/login" },
];

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 400,
  fontSize: "12px",
  color: "#8492A6",
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
  color: "#F5A623",
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
          onMouseEnter={(e) => { e.currentTarget.style.color = "#F5A623"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#8492A6"; }}
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
        backgroundColor: "#061B2E",
        padding: "64px 40px 32px",
        borderTop: "0.5px solid rgba(245,166,35,0.1)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Four-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
            marginBottom: "40px",
          }}
          className="md:grid-cols-[1.5fr_1fr_1fr_1fr]"
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <AvrentisLogo variant="primary" size={28} wordmarkColor="#ffffff" />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "12px",
                color: "#8492A6",
                lineHeight: 1.6,
                maxWidth: "200px",
              }}
            >
              Operational authority platform for organisations worldwide.
            </span>
          </div>

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
              color: "#1A3A5C",
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
              color: "#F5A623",
            }}
          >
            POWERED BY AVRENTIS
          </span>
        </div>
      </div>
    </footer>
  );
}
