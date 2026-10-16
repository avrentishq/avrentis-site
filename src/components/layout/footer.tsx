"use client";

import Link from "next/link";
import { AvrentisLogo } from "@/components/ui/logo";
import { Eyebrow } from "@/components/ui/section-intro";
import { BRAND } from "@/lib/brand";
import { FOOTER_COLUMNS } from "@/lib/site-nav";
import { MARKET_SCOPE } from "@/lib/market";
import { cssTransition } from "@/lib/animations";

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 400,
  fontSize: "12px",
  color: "var(--color-text-muted)",
  textDecoration: "none",
  display: "block",
  marginBottom: "8px",
  transition: cssTransition("color"),
};

function FooterColumn({ label, links }: { label: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <Eyebrow as="div" surface="dark" size={10} style={{ marginBottom: "14px" }}>
        {label}
      </Eyebrow>
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          style={linkStyle}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-gold)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-muted)"; }}
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
        backgroundColor: "var(--color-navy-deep)",
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
            {/* The platform lockup: gold container, navy gate, white wordmark.
                Was a bare gold gate with a gold wordmark. */}
            <AvrentisLogo variant="primary" size={28} wordmarkColor="var(--color-white)" />
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
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
                maxWidth: "200px",
              }}
            >
              {BRAND.positioningStatement} for {MARKET_SCOPE}.
            </span>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <FooterColumn key={col.label} label={col.label} links={col.links} />
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "0.5px solid rgba(var(--color-white-rgb), 0.04)",
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
              color: "var(--color-text-faint)",
            }}
          >
            {BRAND.copyrightChrome}
          </span>
        </div>
      </div>
    </footer>
  );
}
