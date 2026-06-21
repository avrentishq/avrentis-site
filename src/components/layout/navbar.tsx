"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  ShoppingCart,
  Archive,
  ClipboardCheck,
  Users,
  Link2,
  ChevronDown,
  Menu,
} from "lucide-react";
import { AvrentisLogo } from "@/components/ui/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { BRAND, BRAND_COLORS, MODULES as PRODUCT_MODULES, isModulePublic } from "@/lib/brand";
import { isLaunchVisible } from "@/lib/launch";

/* ── Data ─────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Customers", href: "/customers" },
  { label: "Pricing", href: "/pricing" },
];

const MODULES = [
  {
    key: PRODUCT_MODULES.pay.key,
    name: PRODUCT_MODULES.pay.name,
    desc: "Structured payment approvals",
    href: `/product/${PRODUCT_MODULES.pay.slug}`,
    icon: CreditCard,
  },
  {
    key: PRODUCT_MODULES.procure.key,
    name: PRODUCT_MODULES.procure.name,
    desc: "Procurement on record",
    href: `/product/${PRODUCT_MODULES.procure.slug}`,
    icon: ShoppingCart,
  },
  {
    key: PRODUCT_MODULES.vault.key,
    name: PRODUCT_MODULES.vault.name,
    desc: "Institutional memory",
    href: `/product/${PRODUCT_MODULES.vault.slug}`,
    icon: Archive,
  },
  {
    key: PRODUCT_MODULES.audit.key,
    name: PRODUCT_MODULES.audit.name,
    desc: "Compliance & accountability",
    href: `/product/${PRODUCT_MODULES.audit.slug}`,
    icon: ClipboardCheck,
  },
  {
    key: PRODUCT_MODULES.people.key,
    name: PRODUCT_MODULES.people.name,
    desc: "Workforce structure",
    href: `/product/${PRODUCT_MODULES.people.slug}`,
    icon: Users,
  },
  {
    key: PRODUCT_MODULES.connect.key,
    name: PRODUCT_MODULES.connect.name,
    desc: "External systems",
    href: `/product/${PRODUCT_MODULES.connect.slug}`,
    icon: Link2,
  },
];

const PLATFORM = [
  { name: "How it works", href: "/product/how-it-works" },
  { name: "Security", href: "/product/security" },
  { name: "Trust centre", href: "/trust" },
  { name: "Integrations catalogue", href: "/product/integrations" },
];

/* ── Navbar ───────────────────────────────────────────────────────────────── */

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* scroll detection */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* dropdown helpers */
  const openDropdown = useCallback(() => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
      dropdownTimeout.current = null;
    }
    setDropdownOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  }, []);

  const closeDropdownImmediate = useCallback(() => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
      dropdownTimeout.current = null;
    }
    setDropdownOpen(false);
  }, []);

  /* active link helper */
  const isActive = (href: string) => {
    if (href === "/product") return pathname.startsWith("/product");
    return pathname === href;
  };

  const activeLinkStyle = (href: string): React.CSSProperties => {
    const active = isActive(href);
    return {
      fontFamily: "var(--font-sans)",
      fontWeight: 400,
      fontSize: "14px",
      color: active ? "var(--color-gold)" : "#ffffff",
      textDecoration: "none",
      transition: "color 150ms ease",
      borderBottom: active ? "2px solid var(--color-gold)" : "2px solid transparent",
      paddingBottom: "2px",
    };
  };

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
          borderBottom: "0.5px solid rgba(var(--color-gold-rgb), 0.2)",
          boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.15)" : "none",
          zIndex: 50,
          transition: "box-shadow 300ms ease",
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
          {/* ── Logo ──────────────────────────────────────────────── */}
          <Link href="/" aria-label={`${BRAND.name} home`}>
            <AvrentisLogo variant="primary" size={36} wordmarkColor="#ffffff" />
          </Link>

          {/* ── Center nav links ──────────────────────────────────── */}
          <div
            className="hidden md:flex"
            style={{ gap: "48px", alignItems: "center" }}
          >
            {/* Product (with dropdown) */}
            <div
              ref={dropdownRef}
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
              style={{ position: "relative" }}
            >
              <Link
                href="/product"
                style={{
                  ...activeLinkStyle("/product"),
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive("/product"))
                    e.currentTarget.style.color = "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/product"))
                    e.currentTarget.style.color = "#ffffff";
                }}
              >
                Product
                <ChevronDown
                  size={12}
                  style={{
                    transition: "transform 200ms ease",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </Link>

              {/* ── Mega dropdown ─────────────────────────────────── */}
              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 12px)",
                    left: "-16px",
                    width: "520px",
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(var(--color-gold-rgb), 0.15)",
                    borderRadius: "8px",
                    padding: "24px",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
                    display: "flex",
                    gap: "24px",
                    zIndex: 100,
                  }}
                >
                  {/* Left column — Modules */}
                  <div style={{ flex: "0 0 60%" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "10px",
                        color: "var(--color-gold)",
                        textTransform: "uppercase",
                        letterSpacing: "0.10em",
                        marginBottom: "12px",
                      }}
                    >
                      Modules
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      {MODULES.filter((mod) => isModulePublic(mod.key)).map((mod) => {
                        const Icon = mod.icon;
                        return (
                          <Link
                            key={mod.href}
                            href={mod.href}
                            onClick={closeDropdownImmediate}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "8px",
                              borderRadius: "6px",
                              textDecoration: "none",
                              transition: "background-color 150ms ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(var(--color-gold-rgb), 0.06)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(var(--color-gold-rgb), 0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Icon size={16} color={BRAND_COLORS.gold} />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontFamily: "var(--font-sans)",
                                  fontWeight: 500,
                                  fontSize: "14px",
                                  color: "#ffffff",
                                  lineHeight: 1.3,
                                }}
                              >
                                {mod.name}
                              </div>
                              <div
                                style={{
                                  fontFamily: "var(--font-sans)",
                                  fontWeight: 400,
                                  fontSize: "12px",
                                  color: "#64748b",
                                  lineHeight: 1.3,
                                }}
                              >
                                {mod.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right column — Platform */}
                  <div style={{ flex: "0 0 35%" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "10px",
                        color: "var(--color-gold)",
                        textTransform: "uppercase",
                        letterSpacing: "0.10em",
                        marginBottom: "12px",
                      }}
                    >
                      Platform
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      {PLATFORM.filter((item) => isLaunchVisible(item.href)).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeDropdownImmediate}
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: 400,
                            fontSize: "14px",
                            color: "#ffffff",
                            textDecoration: "none",
                            padding: "8px",
                            borderRadius: "6px",
                            transition: "background-color 150ms ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(var(--color-gold-rgb), 0.06)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <Link
              href="/pricing"
              style={activeLinkStyle("/pricing")}
              onMouseEnter={(e) => {
                if (!isActive("/pricing"))
                  e.currentTarget.style.color = "var(--color-gold)";
              }}
              onMouseLeave={(e) => {
                if (!isActive("/pricing"))
                  e.currentTarget.style.color = "#ffffff";
              }}
            >
              Pricing
            </Link>
          </div>

          {/* ── Right-side actions ─────────────────────────────────── */}
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: "24px" }}
          >
            <a
              href="https://app.avrentis.com/login"
              style={{
                fontFamily: "var(--font-sans)",
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
              Login
            </a>

            <a
              href="/contact?intent=demo"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                lineHeight: 1,
                backgroundColor: "transparent",
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "3px",
                height: "32px",
                padding: "0 14px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                cursor: "pointer",
                transition: "border-color 150ms ease, color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                e.currentTarget.style.color = "#e2e8f0";
              }}
            >
              Book demo
            </a>

            <a
              href="/trial"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                lineHeight: 1,
                backgroundColor: "var(--color-gold)",
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-gold-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-gold)";
              }}
            >
              Start trial &rarr;
            </a>
          </div>

          {/* ── Mobile hamburger ──────────────────────────────────── */}
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
            <Menu size={18} color="#64748b" strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Spacer to prevent content from sliding behind fixed nav */}
      <div style={{ height: "64px" }} />

      {/* ── Mobile menu ─────────────────────────────────────────── */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={NAV_LINKS.filter((link) => isLaunchVisible(link.href))}
        signinUrl="https://app.avrentis.com/login"
        pathname={pathname}
      />
    </>
  );
}
