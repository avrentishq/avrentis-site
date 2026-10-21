"use client";

/**
 * LegalPageShell — shared layout for /privacy and /terms. Long-form
 * policy text deserves a calm, readable surface — soft background,
 * tight max-width, prose-style typography — not the marketing hero
 * treatment used elsewhere on the site.
 */

import { m } from "framer-motion";
import { Eyebrow, SectionIntro } from "@/components/ui/section-intro";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { fadeUpOnScroll, fadeUpOnLoad } from "@/lib/animations";

export interface LegalSection {
  id: string;
  heading: string;
  body: React.ReactNode;
}

interface LegalPageShellProps {
  eyebrow: string;
  title: string;
  lede: string;
  effectiveDate: string;
  sections: LegalSection[];
  footerNote?: React.ReactNode;
}


export function LegalPageShell({ eyebrow, title, lede, effectiveDate, sections, footerNote }: LegalPageShellProps) {
  return (
    <>
      <Navbar />
      <main
        style={{
          backgroundColor: "var(--color-bg-light)",
          padding: "100px 32px 120px",
          minHeight: "70vh",
        }}
      >
        <div style={{ maxWidth: "var(--layout-prose-width)", margin: "0 auto" }}>
          <SectionIntro
            reveal="load"
            eyebrow={eyebrow}
            eyebrowStyle={{ marginBottom: "16px" }}
            titleAs="h1"
            title={title}
            titleStyle={{
              fontWeight: 500,
              fontSize: "var(--text-display-xs)",
              lineHeight: 1.2,
              margin: "0 0 18px",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-display-xl"
            lede={lede}
            ledeStyle={{
              fontSize: "var(--text-xl)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.75,
              margin: "0 0 8px",
            }}
          />

          <m.p
            {...fadeUpOnLoad(3)}
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
              margin: "0 0 40px",
            }}
          >
            Effective {effectiveDate}
          </m.p>

          {/* Section anchor nav */}
          <m.nav
            {...fadeUpOnLoad(4)}
            aria-label="Document sections"
            style={{
              backgroundColor: "var(--color-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "20px 24px",
              marginBottom: "56px",
            }}
          >
            <Eyebrow size="legal" style={{ display: "block", marginBottom: "12px" }}>
              Contents
            </Eyebrow>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: "8px",
                counterReset: "section",
              }}
              className="grid-cols-1 md:grid-cols-2"
            >
              {sections.map((s, i) => (
                <li key={s.id} style={{ counterIncrement: "section" }}>
                  <a
                    href={`#${s.id}`}
                    style={{
                      fontSize: "var(--text-md)",
                      color: "var(--color-text-primary)",
                      textDecoration: "none",
                      display: "inline-flex",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "var(--color-text-muted)", fontVariantNumeric: "tabular-nums" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </m.nav>

          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {sections.map((s, i) => (
              <m.section
                key={s.id}
                id={s.id}
                {...fadeUpOnScroll()}
                style={{ scrollMarginTop: "90px", position: "relative", overflow: "hidden", isolation: "isolate" }}
              >
                <h2
                  style={{
                    fontWeight: 600,
                    fontSize: "var(--text-heading-xs)",
                    color: "var(--color-text-primary)",
                    margin: "0 0 16px",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.06em",
                      color: "var(--color-gold-on-light)",
                      fontWeight: 500,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.heading}
                </h2>
                <div
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--color-text-body)",
                    lineHeight: 1.75,
                  }}
                  className="legal-prose"
                >
                  {s.body}
                </div>
              </m.section>
            ))}
          </div>

          {footerNote && (
            <m.div
              {...fadeUpOnScroll()}
              style={{
                marginTop: "64px",
                padding: "20px 24px",
                backgroundColor: "var(--color-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                lineHeight: 1.65,
              }}
            >
              {footerNote}
            </m.div>
          )}
        </div>

        {/* Inline prose polish — scoped via `.legal-prose` so it doesn't
            bleed into marketing sections that happen to use <p>/<ul>. */}
        <style>{`
          .legal-prose p { margin: 0 0 14px; }
          .legal-prose p:last-child { margin-bottom: 0; }
          .legal-prose ul { margin: 0 0 14px; padding-left: 20px; list-style: disc; }
          .legal-prose ul li { margin-bottom: 6px; }
          .legal-prose a { color: var(--color-gold-on-light); text-decoration: none; }
          .legal-prose a:hover { text-decoration: underline; }
          .legal-prose strong { color: var(--color-text-primary); font-weight: 600; }
          .legal-prose code {
            font-family: var(--font-mono);
            font-size: 0.9em;
            background: var(--color-bg);
            padding: 1px 6px;
            border-radius: var(--radius-xs);
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
