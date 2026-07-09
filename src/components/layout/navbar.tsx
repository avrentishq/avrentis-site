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
import { MobileMenu } from "@/components/layout/mobile-menu";
import {
  BRAND,
  BRAND_COLORS,
  MODULES as PRODUCT_MODULES,
  isModulePublic,
} from "@/lib/brand";
import { isLaunchVisible } from "@/lib/launch";
import { LOGIN_URL } from "@/lib/platform";

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
      color: active ? "var(--color-gold)" : scrolled ? "#0f172a" : "#ffffff",
      textDecoration: "none",
      transition: "color 150ms ease",
      borderBottom: active
        ? "2px solid var(--color-gold)"
        : "2px solid transparent",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Transparent when scrolled so the inner container reads as a floating
          // pill; solid navy at the top so it stays legible over any page.
          backgroundColor: scrolled ? "transparent" : "#0f172a",
          borderBottom: scrolled
            ? "0.5px solid transparent"
            : "0.5px solid rgba(var(--color-gold-rgb), 0.2)",
          zIndex: 50,
          transition: "background-color 300ms ease, border-color 300ms ease",
        }}
      >
        <div
          style={{
            // On scroll this container morphs into a centered frosted pill.
            width: "100%",
            maxWidth: scrolled ? "920px" : "1200px",
            margin: "0 auto",
            padding: scrolled ? "0 24px" : "0 40px",
            height: scrolled ? "48px" : "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: scrolled
              ? "rgba(247, 246, 242, 0.9)"
              : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
            borderRadius: scrolled ? "9999px" : "0",
            border: scrolled
              ? "1px solid rgba(15, 23, 42, 0.08)"
              : "1px solid transparent",
            boxShadow: scrolled ? "0 8px 32px rgba(0, 0, 0, 0.28)" : "none",
            transition:
              "max-width 300ms ease, height 300ms ease, padding 300ms ease, background-color 300ms ease, border-color 300ms ease, box-shadow 300ms ease, border-radius 300ms ease",
          }}
        >
          {/* ── Logo ──────────────────────────────────────────────── */}
          <Link href="/" aria-label={`${BRAND.name} home`}>
            {/* Dark bar: reversed mark (gold badge, navy gate) + white
                wordmark. Off-white pill: bare navy gate (no box) + navy
                wordmark. Both assets live in /public/logos; the Link carries
                the accessible name, so the images are decorative. */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: scrolled ? "7px" : "9px",
                transition: "gap 300ms ease",
              }}
            >
              <img
                src={
                  scrolled
                    ? "/logos/mark-transparent-navy-256.svg"
                    : "/logos/mark-transparent-gold-256.svg"
                }
                alt=""
                aria-hidden="true"
                style={{
                  height: scrolled ? "30px" : "36px",
                  width: "auto",
                  display: "block",
                  transition: "height 300ms ease",
                }}
              />
              <img
                src={
                  scrolled
                    ? "/logos/wordmark-navy.svg"
                    : "/logos/wordmark-gold.svg"
                }
                alt=""
                aria-hidden="true"
                style={{
                  height: scrolled ? "18px" : "24px",
                  width: "auto",
                  display: "block",
                  transition: "height 300ms ease",
                }}
              />
            </span>
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
              onFocus={openDropdown}
              onBlur={(e) => {
                // Close when focus leaves the whole dropdown (keyboard tab-out).
                if (!e.currentTarget.contains(e.relatedTarget as Node))
                  closeDropdown();
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") closeDropdownImmediate();
              }}
              style={{ position: "relative" }}
            >
              <Link
                href="/product"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
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
                    e.currentTarget.style.color = scrolled
                      ? "#0f172a"
                      : "#ffffff";
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
                      {MODULES.filter((mod) => isModulePublic(mod.key)).map(
                        (mod) => {
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
                                  backgroundColor:
                                    "rgba(var(--color-gold-rgb), 0.08)",
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
                        },
                      )}
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
                      {PLATFORM.filter((item) =>
                        isLaunchVisible(item.href),
                      ).map((item) => (
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
                  e.currentTarget.style.color = scrolled
                    ? "#0f172a"
                    : "#ffffff";
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
            {/* Collapse to a single CTA once the bar morphs into the pill. */}
            {!scrolled && (
              <>
                <a
                  href={LOGIN_URL}
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
              </>
            )}

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
                borderRadius: "9999px",
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
                e.currentTarget.style.backgroundColor =
                  "var(--color-gold-hover)";
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
            aria-expanded={mobileOpen}
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
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
        signinUrl={LOGIN_URL}
        pathname={pathname}
      />
    </>
  );
}
