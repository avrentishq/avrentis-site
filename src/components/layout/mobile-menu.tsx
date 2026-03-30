"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { AvrentisLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
  signinUrl: string;
  pathname: string;
}

export function MobileMenu({
  open,
  onClose,
  navLinks,
  signinUrl,
  pathname,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 60,
            }}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "280px",
              backgroundColor: "#0f172a",
              zIndex: 70,
              display: "flex",
              flexDirection: "column",
              padding: "24px",
            }}
          >
            {/* Header — logo + close */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                marginTop: "24px",
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  style={{
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    color:
                      pathname === link.href ? "#C68B2F" : "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <a
                href={signinUrl}
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#94a3b8",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Sign in
              </a>
              <Button variant="primary" href="/contact">
                Request access
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
