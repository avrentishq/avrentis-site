"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { AvrentisLogo } from "@/components/ui/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";

const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
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
          height: "56px",
          backgroundColor: "#0f172a",
          borderBottom: "0.5px solid rgba(198,139,47,0.2)",
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 40px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" aria-label="AVRENTIS home">
            <AvrentisLogo variant="primary" size={28} wordmarkColor="#ffffff" />
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
                    fontSize: "12px",
                    color: active ? "#ffffff" : "#94a3b8",
                    textDecoration: "none",
                    transition: "color 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <a
            href="/contact"
            className="hidden md:inline-flex"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "11px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              lineHeight: 1,
              backgroundColor: "#C68B2F",
              color: "#0f172a",
              border: "none",
              borderRadius: "3px",
              height: "32px",
              padding: "0 16px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              cursor: "pointer",
              transition: "background-color 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#A87425"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#C68B2F"; }}
          >
            REQUEST DEMO
          </a>

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

      <div style={{ height: "56px" }} />

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={NAV_LINKS}
        signinUrl="https://app.avrentis.com/login"
        pathname={pathname}
      />
    </>
  );
}
