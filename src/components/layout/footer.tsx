"use client";

import Link from "next/link";
import { AvrentisLogo } from "@/components/ui/logo";
import { BRAND, MODULES, moduleName, publicModuleKeys } from "@/lib/brand";
import { isLaunchVisible } from "@/lib/launch";
import { LOGIN_URL } from "@/lib/platform";

// Derived from the brand SSOT — excludes not-yet-public modules (Requests) automatically.
const PRODUCT_LINKS = publicModuleKeys().map((key) => ({
  label: moduleName(key),
  href: `/product/${MODULES[key].slug}`,
}));

const PLATFORM_LINKS = [
  { label: "How it works", href: "/product/how-it-works" },
  { label: "Security", href: "/product/security" },
  { label: "Integrations", href: "/product/integrations" },
  { label: "Pricing", href: "/pricing" },
];

const RESOURCES_LINKS = [
  { label: "Documentation", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
  { label: "Status", href: "/status" },
  { label: "Customers", href: "/customers" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Trust centre", href: "/trust" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

const START_LINKS = [
  { label: "Start trial", href: "/trial" },
  { label: "Contact us", href: "/contact" },
  { label: "Login", href: LOGIN_URL },
];

// Hidden-at-launch links are filtered out; fully-empty columns are dropped.
const FOOTER_COLUMNS = [
  { label: "PRODUCT", links: PRODUCT_LINKS },
  { label: "PLATFORM", links: PLATFORM_LINKS },
  { label: "RESOURCES", links: RESOURCES_LINKS },
  { label: "COMPANY", links: COMPANY_LINKS },
  { label: "GET STARTED", links: START_LINKS },
]
  .map((col) => ({ ...col, links: col.links.filter((link) => isLaunchVisible(link.href)) }))
  .filter((col) => col.links.length > 0);

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
  color: "var(--color-gold)",
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
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-gold)"; }}
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
        borderTop: "0.5px solid rgba(var(--color-gold-rgb), 0.1)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Four-column grid */}
        <div
          style={{
            display: "grid",
            gap: "40px",
            marginBottom: "40px",
            // auto-fit fills the full width with however many columns are live
            // (launch-hidden columns collapse instead of leaving a gap).
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <AvrentisLogo variant="transparent-gold" size={28} wordmarkColor="var(--color-gold)" />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                fontSize: "10px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
              }}
            >
              {BRAND.tagline}
            </span>
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
              {BRAND.positioningStatement} for organisations across Nigeria and Africa.
            </span>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <FooterColumn key={col.label} label={col.label} links={col.links} />
          ))}
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
            &copy; 2026 {BRAND.name} All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
