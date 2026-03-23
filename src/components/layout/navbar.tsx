"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/mobile-menu";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.avrentis.com";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "64px",
          backgroundColor: "#ffffff",
          borderBottom: "0.5px solid #e2e8f0",
          boxShadow: scrolled
            ? "0 1px 3px rgba(0,0,0,0.05)"
            : "none",
          zIndex: 50,
          transition: "box-shadow 150ms ease",
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
            <Logo variant="horizontal" theme="mono-light" size="md" />
          </Link>

          <div
            className="hidden md:flex"
            style={{ gap: "32px", alignItems: "center" }}
          >
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#0f172a",
                    textDecoration: "none",
                    paddingBottom: "4px",
                    borderBottom: active
                      ? "2px solid #C68B2F"
                      : "2px solid transparent",
                    transition: "border-color 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderBottomColor = "#C68B2F";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderBottomColor = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div
            className="hidden md:flex"
            style={{ gap: "16px", alignItems: "center" }}
          >
            <a
              href={`${APP_URL}/login`}
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                color: "#64748b",
                textDecoration: "none",
              }}
            >
              Sign in
            </a>
            <Button variant="nav-cta" href="/contact">
              Request access
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            <Menu size={24} color="#0f172a" />
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
