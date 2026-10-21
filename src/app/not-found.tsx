import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ButtonLink } from "@/components/ui/button";
import { SITE_ROUTES } from "@/lib/routes";
import { NOT_FOUND_TITLE, pageTitle } from "@/lib/seo";

export const metadata: Metadata = { title: pageTitle(NOT_FOUND_TITLE) };

/**
 * Branded 404, inside the site's own menu bar and footer, so a visitor who
 * followed a dead link still has the whole site one click away. Leads with an
 * <h1> for a11y. Pages hidden for launch render this too (their tab title
 * comes from `pageMetadata`, which gives them the same title).
 */
export default function NotFound() {
  return (
    <>
    <Navbar />
    <main
      id="main"
      style={{
        minHeight: "calc(100vh - 64px)",
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
          404 · Page not found
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
          This page isn&rsquo;t here.
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
          The link may be old or mistyped. Here are a few good places to pick
          things back up.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <ButtonLink href={SITE_ROUTES.home}>Back to home</ButtonLink>
          <ButtonLink href={SITE_ROUTES.product} variant="secondary" surface="dark">
            Explore the platform →
          </ButtonLink>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
