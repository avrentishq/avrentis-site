"use client";

import Link from "next/link";
import Logo from "@/components/ui/logo";

const FOOTER_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#020617",
        padding: "64px 24px 32px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          <Logo variant="horizontal" theme="primary" size="md" />

          <div style={{ display: "flex", gap: "24px" }}>
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#94a3b8",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "0.5px solid rgba(198, 139, 47, 0.2)",
            margin: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              &copy; 2026 AVRENTIS. All rights reserved.
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              Built for Nigerian Oil &amp; Gas operations.
            </span>
          </div>

          <span
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "12px",
              color: "#475569",
              maxWidth: "360px",
            }}
          >
            Data processed in accordance with the Nigeria Data Protection
            Regulation (NDPR).
          </span>
        </div>
      </div>
    </footer>
  );
}
