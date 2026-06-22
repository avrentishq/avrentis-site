"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";

/**
 * Branded route error boundary. Must be a Client Component (Next.js
 * requirement). Standalone centred screen with a "Try again" (reset) action
 * and a route home. Leads with an <h1> for a11y. We don't claim "we've been
 * notified" — the marketing site has no error-tracking pipeline.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "520px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            margin: "0 0 16px",
          }}
        >
          Something went wrong
        </p>
        <h1
          data-page-title
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "32px",
            color: "#ffffff",
            lineHeight: 1.2,
            margin: "0 0 16px",
          }}
        >
          This page hit an unexpected error.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "#94a3b8",
            lineHeight: 1.7,
            margin: "0 auto 28px",
            maxWidth: "440px",
          }}
        >
          Try again in a moment. If it keeps happening, email{" "}
          <a href={`mailto:${BRAND.contactEmail}`} style={{ color: "var(--color-gold)", textDecoration: "none" }}>
            {BRAND.contactEmail}
          </a>{" "}
          and we&rsquo;ll take a look.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "14px",
              backgroundColor: "var(--color-gold)",
              color: "#0f172a",
              border: "none",
              borderRadius: "6px",
              padding: "0 22px",
              height: "44px",
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "14px",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "6px",
              padding: "0 22px",
              height: "44px",
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            Back to home
          </Link>
        </div>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: "9px",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "#334155",
            margin: "40px 0 0",
          }}
        >
          {BRAND.poweredBy}
        </p>
      </div>
    </main>
  );
}
