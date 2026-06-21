"use client";

/**
 * LegalPageShell — shared layout for /privacy and /terms. Long-form
 * policy text deserves a calm, readable surface — soft background,
 * tight max-width, prose-style typography — not the marketing hero
 * treatment used elsewhere on the site.
 */

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

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

const sans = "var(--font-sans)";

export function LegalPageShell({ eyebrow, title, lede, effectiveDate, sections, footerNote }: LegalPageShellProps) {
  return (
    <>
      <Navbar />
      <main
        style={{
          backgroundColor: "#f8fafc",
          padding: "100px 32px 120px",
          minHeight: "70vh",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-gold-on-light)",
              display: "block",
              marginBottom: "16px",
            }}
          >
            {eyebrow}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 500,
              fontSize: "36px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 18px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[44px]"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(2)}
            style={{
              fontFamily: sans,
              fontSize: "16px",
              color: "#475569",
              lineHeight: 1.75,
              margin: "0 0 8px",
            }}
          >
            {lede}
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(3)}
            style={{
              fontFamily: sans,
              fontSize: "13px",
              color: "#94a3b8",
              margin: "0 0 40px",
            }}
          >
            Effective {effectiveDate}
          </motion.p>

          {/* Section anchor nav */}
          <motion.nav
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(4)}
            aria-label="Document sections"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "20px 24px",
              marginBottom: "56px",
            }}
          >
            <span
              style={{
                fontFamily: sans,
                fontWeight: 600,
                fontSize: "11px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "var(--color-gold-on-light)",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Contents
            </span>
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
                      fontFamily: sans,
                      fontSize: "14px",
                      color: "#0f172a",
                      textDecoration: "none",
                      display: "inline-flex",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </motion.nav>

          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {sections.map((s, i) => (
              <motion.section
                key={s.id}
                id={s.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                transition={fadeUpTransition}
                style={{ scrollMarginTop: "90px" }}
              >
                <h2
                  style={{
                    fontFamily: sans,
                    fontWeight: 600,
                    fontSize: "20px",
                    color: "#0f172a",
                    margin: "0 0 16px",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "12px",
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
                    fontFamily: sans,
                    fontSize: "15px",
                    color: "#334155",
                    lineHeight: 1.75,
                  }}
                  className="legal-prose"
                >
                  {s.body}
                </div>
              </motion.section>
            ))}
          </div>

          {footerNote && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={fadeUpTransition}
              style={{
                marginTop: "64px",
                padding: "20px 24px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                fontFamily: sans,
                fontSize: "13px",
                color: "#64748b",
                lineHeight: 1.65,
              }}
            >
              {footerNote}
            </motion.div>
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
          .legal-prose strong { color: #0f172a; font-weight: 600; }
          .legal-prose code {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.9em;
            background: #f1f5f9;
            padding: 1px 6px;
            border-radius: 3px;
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
