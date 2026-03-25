"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { AvrentisLogo } from "@/components/ui/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.avrentis.com";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "64px",
          backgroundColor: "#0f172a",
          borderBottom: "0.5px solid rgba(198,139,47,0.2)",
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" aria-label="AVRENTIS home">
            <AvrentisLogo variant="primary" size={36} wordmarkColor="#ffffff" />
          </Link>

          <div className="hidden md:flex" style={{ gap: "32px", alignItems: "center" }}>
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: active ? "#ffffff" : "#94a3b8",
                    textDecoration: "none",
                    paddingBottom: "4px",
                    borderBottom: active ? "2px solid #C68B2F" : "2px solid transparent",
                    transition: "border-color 150ms ease, color 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderBottomColor = "#C68B2F";
                      e.currentTarget.style.color = "#ffffff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderBottomColor = "transparent";
                      e.currentTarget.style.color = "#94a3b8";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex" style={{ gap: "16px", alignItems: "center" }}>
            <a
              href={`${APP_URL}/login`}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "14px",
                color: "#94a3b8",
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; }}
            >
              Sign in
            </a>
            <a
              href="/contact"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                letterSpacing: "0.05em",
                borderRadius: "3px",
                cursor: "pointer",
                transition: "background-color 150ms ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                lineHeight: 1,
                backgroundColor: "#C68B2F",
                color: "#0f172a",
                border: "none",
                height: "32px",
                padding: "0 16px",
                fontSize: "13px",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#A87425"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#C68B2F"; }}
            >
              Request access
            </a>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
          >
            <Menu size={18} color="#94a3b8" strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      <div style={{ height: "64px" }} />

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={NAV_LINKS}
        signinUrl={`${APP_URL}/login`}
        pathname={pathname}
      />
    </>
  );
}
