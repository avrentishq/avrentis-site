import Link from "next/link";
import { BRAND } from "@/lib/brand";

/**
 * Branded 404. Standalone centred screen (no Navbar/Footer) so it renders
 * cleanly even when something upstream is wrong. Leads with an <h1> for a11y.
 */
export default function NotFound() {
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
          404 · Page not found
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
          This page isn&rsquo;t here.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "#94a3b8",
            lineHeight: 1.7,
            margin: "0 auto 28px",
            maxWidth: "420px",
          }}
        >
          The link may be old or mistyped. Here are a few good places to pick
          things back up.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "14px",
              backgroundColor: "var(--color-gold)",
              color: "#0f172a",
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
          <Link
            href="/product"
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
            Explore the platform →
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
