/**
 * ProductSuiteLayout — the shared template for the four suite pages
 * (`/product/spend`, `/oversight`, `/evidence`, `/infrastructure`).
 *
 * The navigation lists suites now, not modules, so this page carries the weight
 * the dropdown used to: it says what a group of modules is for, what they share,
 * and what each one adds on its own — then hands off to the module's own page.
 *
 * A SERVER component, deliberately, unlike `module-layout.tsx`. That one is
 * "use client" because it animates on scroll and embeds interactive previews;
 * this page has neither, and making it a client component would ship framer-
 * motion to render four headings and some prose. It borrows the same visual
 * language — navy hero, light body, gold eyebrow — without the machinery.
 *
 * Copy lives in `@/lib/product-suites`; nothing here is written inline, so the
 * lock test can hold a suite to having words for every module it contains.
 */

import Link from "next/link";

import { BRAND_COLORS, MODULES, SUITES, moduleName, type ModuleSuite } from "@/lib/brand";
import { SUITE_PAGES, suiteModuleKeys } from "@/lib/product-suites";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/sections/cta-banner";
import { AmbientGlow } from "@/components/ui/ambient-glow";

export function ProductSuiteLayout({ suite }: { suite: ModuleSuite }) {
  const config = SUITE_PAGES[suite];
  const meta = SUITES.find((s) => s.key === suite)!;
  const moduleKeys = suiteModuleKeys(suite);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Platform", path: "/product" },
          { name: meta.label, path: `/product/${suite}` },
        ])}
      />
      <Navbar />
      <main id="main">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#0f172a",
          padding: "112px 40px 88px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <AmbientGlow top="-140px" left="-110px" size={520} intensity={0.2} duration={34} />
        <div style={{ maxWidth: "820px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              display: "block",
              marginBottom: "18px",
            }}
          >
            {meta.label}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "34px",
              color: "#FFFFFF",
              lineHeight: 1.18,
              margin: "0 0 22px",
            }}
            className="lg:!text-[46px]"
          >
            {config.headline}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "17px",
              color: "#94a3b8",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "640px",
            }}
          >
            {config.description}
          </p>
        </div>
      </section>

      {/* ── WHAT THEY SHARE ────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f1f5f9", padding: "88px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "30px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 40px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[36px]"
          >
            {config.sharedTitle}
          </h2>
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {config.shared.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={20} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "17px",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {point.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      color: "#64748b",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {point.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHAT EACH ONE ADDS ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "88px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "30px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 8px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[36px]"
          >
            {moduleKeys.length === 1 ? "What it adds" : "What each one adds"}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "#64748b",
              margin: "0 0 40px",
              maxWidth: "620px",
            }}
          >
            Each is bought and switched on separately. Everything above is true of all of them.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {moduleKeys.map((key) => {
              const blurb = config.modules[key];
              // A module with no copy is a lock-test failure, not a blank card.
              if (!blurb) return null;
              const Icon = blurb.icon;
              return (
                <Link
                  key={key}
                  href={`/product/${MODULES[key].slug}`}
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "28px",
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                    textDecoration: "none",
                    transition: "border-color 200ms ease",
                  }}
                  className="hover:!border-[rgba(var(--color-gold-rgb),0.4)]"
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "18px",
                        color: "#0f172a",
                        margin: "0 0 2px",
                      }}
                    >
                      {moduleName(key)}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        color: "var(--color-gold-on-light)",
                        margin: "0 0 10px",
                        fontWeight: 500,
                      }}
                    >
                      {blurb.claim}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "14px",
                        color: "#64748b",
                        lineHeight: 1.65,
                        margin: "0 0 12px",
                      }}
                    >
                      {blurb.body}
                    </p>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#0f172a",
                      }}
                    >
                      Explore {moduleName(key).replace("Avrentis ", "")}{" "}
                      &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              margin: "32px 0 0",
            }}
          >
            <Link href="/product" style={{ color: "#0f172a", fontWeight: 500 }}>
              See the whole platform &rarr;
            </Link>
          </p>
        </div>
      </section>

      </main>
      <CtaBanner />
      <Footer />
    </>
  );
}
