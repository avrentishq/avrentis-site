"use client";

import { ButtonLink, buttonProps } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { CONTACT_EMAIL } from "@/lib/contacts";
import { SITE_ROUTES } from "@/lib/routes";

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
        backgroundColor: "var(--color-navy-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "var(--measure-short)", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: "var(--text-xs)",
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
            fontWeight: 400,
            fontSize: "var(--text-heading-2xl)",
            color: "var(--color-white)",
            lineHeight: 1.2,
            margin: "0 0 16px",
          }}
        >
          This page hit an unexpected error.
        </h1>
        <p
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--color-text-subtle)",
            lineHeight: 1.7,
            margin: "0 auto 28px",
            maxWidth: "var(--measure-compact)",
          }}
        >
          Try again in a moment. If it keeps happening, email{" "}
          <a href={`mailto:${CONTACT_EMAIL.general}`} style={{ color: "var(--color-gold)", textDecoration: "none" }}>
            {CONTACT_EMAIL.general}
          </a>{" "}
          and we&rsquo;ll take a look.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" onClick={reset} {...buttonProps({ size: "md" })}>
            Try again
          </button>
          <ButtonLink href={SITE_ROUTES.home} variant="secondary" surface="dark">
            Back to home
          </ButtonLink>
        </div>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: "var(--text-4xs)",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--color-text-subtle)",
            margin: "40px 0 0",
          }}
        >
          {BRAND.poweredBy}
        </p>
      </div>
    </main>
  );
}
