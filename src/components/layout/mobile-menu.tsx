"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { BRAND_COLORS, moduleName, publicModuleKeys, MODULES } from "@/lib/brand";
import { AvrentisLogo } from "@/components/ui/logo";
import { isLaunchVisible } from "@/lib/launch";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
  signinUrl: string;
  pathname: string;
}

// Derived from the brand SSOT — excludes internal modules (HR) automatically.
const PRODUCT_MODULES = publicModuleKeys().map((key) => ({
  name: moduleName(key),
  href: `/product/${MODULES[key].slug}`,
}));

const PRODUCT_PLATFORM = [
  { name: "How it works", href: "/product/how-it-works" },
  { name: "Security", href: "/product/security" },
  { name: "Trust centre", href: "/trust" },
];

const FONT = "'IBM Plex Sans', system-ui, sans-serif";

export function MobileMenu({
  open,
  onClose,
  navLinks,
  signinUrl,
  pathname,
}: MobileMenuProps) {
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Close on Escape while the menu is open (keyboard accessibility).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#0f172a",
            zIndex: 70,
            display: "flex",
            flexDirection: "column",
            padding: "24px",
            overflow: "auto",
          }}
        >
          {/* ── Header ──────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <AvrentisLogo size={28} variant="primary" wordmarkColor="#ffffff" />
            <button
              onClick={onClose}
              aria-label="Close menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={24} color={BRAND_COLORS.gold} />
            </button>
          </div>

          {/* ── Content ─────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              marginTop: "32px",
              flex: 1,
            }}
          >
            {/* Product section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
              {/* Section header */}
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: "10px",
                  color: "var(--color-gold)",
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  marginBottom: "16px",
                }}
              >
                Product
              </div>

              {/* Module links */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {PRODUCT_MODULES.map((mod) => (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    onClick={onClose}
                    style={{
                      fontFamily: FONT,
                      fontWeight: 400,
                      fontSize: "16px",
                      color: isActive(mod.href) ? "var(--color-gold)" : "#ffffff",
                      textDecoration: "none",
                    }}
                  >
                    {mod.name}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  backgroundColor: "rgba(var(--color-gold-rgb), 0.15)",
                  margin: "8px 0",
                }}
              />

              {/* Platform links */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {PRODUCT_PLATFORM.filter((item) => isLaunchVisible(item.href)).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    style={{
                      fontFamily: FONT,
                      fontWeight: 400,
                      fontSize: "15px",
                      color: isActive(item.href) ? "var(--color-gold)" : "#94a3b8",
                      textDecoration: "none",
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Top-level links other than Product (Product is expanded above) */}
            {navLinks
              .filter((link) => link.label !== "Product")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 400,
                    fontSize: "16px",
                    color: isActive(link.href) ? "var(--color-gold)" : "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          {/* ── Bottom section ──────────────────────────────────────── */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(var(--color-gold-rgb), 0.15)",
            }}
          >
            <a
              href={signinUrl}
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "14px",
                color: "#94a3b8",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Login
            </a>
            <Link
              href="/contact?intent=demo"
              onClick={onClose}
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "14px",
                letterSpacing: "0.04em",
                backgroundColor: "transparent",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                width: "100%",
              }}
            >
              Book demo
            </Link>
            <Link
              href="/trial"
              onClick={onClose}
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "14px",
                letterSpacing: "0.04em",
                backgroundColor: "var(--color-gold)",
                color: "#0f172a",
                borderRadius: "6px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                width: "100%",
              }}
            >
              Start trial &rarr;
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
