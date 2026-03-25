"use client";

import Link from "next/link";
import { AvrentisLogo, AvrentisWordmark } from "@/components/ui/logo";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#020617", padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        {/* Top — 3-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
          }}
          className="md:grid-cols-3"
        >
          {/* Column 1 — Logo + tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <AvrentisLogo size={36} variant="primary" />
            <span
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "13px",
                color: "#475569",
                lineHeight: 1.6,
                maxWidth: "280px",
              }}
            >
              Every decision, structured. Every approval, on record.
            </span>
          </div>

          {/* Column 2 — Nav links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  color: "#475569",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#C68B2F"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Column 3 — NDPR note */}
          <div>
            <p
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "11px",
                color: "#475569",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              AVRENTIS is built in compliance with the Nigeria Data Protection Regulation (NDPR).
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: "none", borderTop: "0.5px solid rgba(198, 139, 47, 0.2)", margin: 0 }} />

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "11px",
              color: "#475569",
            }}
          >
            &copy; 2026 AVRENTIS. All rights reserved.
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.10em",
              color: "#C68B2F",
              textTransform: "uppercase",
            }}
          >
            POWERED BY <AvrentisWordmark color="gold" />
          </div>
        </div>
      </div>
    </footer>
  );
}
