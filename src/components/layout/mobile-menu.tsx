"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { AvrentisLogo } from "@/components/ui/logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
  signinUrl: string;
  pathname: string;
}

const PRODUCT_MODULES = [
  { name: "Avrentis Pay", href: "/product/pay" },
  { name: "Avrentis Procure", href: "/product/procure" },
  { name: "Avrentis Vault", href: "/product/vault" },
  { name: "Avrentis Audit", href: "/product/audit" },
  { name: "Avrentis People", href: "/product/people" },
  { name: "Avrentis Connect", href: "/product/connect" },
];

const PRODUCT_PLATFORM = [
  { name: "How it works", href: "/product/how-it-works" },
  { name: "Security", href: "/product/security" },
  { name: "Integrations", href: "/product/integrations" },
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
              <X size={24} color="#C68B2F" />
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
                  color: "#C68B2F",
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
                      color: isActive(mod.href) ? "#C68B2F" : "#ffffff",
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
                  backgroundColor: "rgba(198,139,47,0.15)",
                  margin: "8px 0",
                }}
              />

              {/* Platform links */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {PRODUCT_PLATFORM.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    style={{
                      fontFamily: FONT,
                      fontWeight: 400,
                      fontSize: "15px",
                      color: isActive(item.href) ? "#C68B2F" : "#94a3b8",
                      textDecoration: "none",
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Pricing & About */}
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
                    color: isActive(link.href) ? "#C68B2F" : "#ffffff",
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
              borderTop: "1px solid rgba(198,139,47,0.15)",
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
              href="/contact"
              onClick={onClose}
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "14px",
                letterSpacing: "0.04em",
                backgroundColor: "#C68B2F",
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
              Start free &rarr;
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
