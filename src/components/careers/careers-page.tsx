"use client";

/**
 * CareersProductPage — the /careers page. Early-stage honest: a small
 * team, no open roles listed right now, with a clear "register interest"
 * path and a vision of the kind of people we want to hear from. When
 * real roles open, this component accepts a non-empty `OPEN_ROLES`
 * array to render the usual roles block.
 */

import { useRef } from "react";
import Link from "next/link";
import { m, useScroll, useTransform } from "framer-motion";
import {
  Compass,
  ShieldCheck,
  Handshake,
  Globe,
  Mail,
  ArrowRight,
} from "lucide-react";
import { fadeUpOnScroll, fadeUpOnLoad } from "@/lib/animations";
import { DarkHeroBackdrop } from "@/components/ui/dark-hero-backdrop";
import { ButtonLink, buttonProps } from "@/components/ui/button";
import { Eyebrow, SectionIntro } from "@/components/ui/section-intro";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { contactHref } from "@/app/contact/tabs";
import { SITE_ROUTES } from "@/lib/routes";
import { Z_INDEX } from "@/lib/layers";
import { cardGridProps } from "@/lib/card-grid";


const PRINCIPLES = [
  {
    icon: Compass,
    title: "Structure over speed.",
    body:
      "We ship carefully. A broken approval costs a customer real money and real credibility. We prefer one well-considered release over three rushed ones.",
  },
  {
    icon: ShieldCheck,
    title: "Authority is earned, not assumed.",
    body:
      "Every person on the team has real ownership of a real surface. Decisions are written down; reversals have reasons; credit is specific.",
  },
  {
    icon: Handshake,
    title: "Customers before narrative.",
    body:
      "If a feature isn't moving an actual operator closer to their outcome, we don't build it. If an early partner tells us we got it wrong, we fix it — quickly and without defensiveness.",
  },
  {
    icon: Globe,
    title: "Built for Africa, standard-setting globally.",
    body:
      "We build first for African organisations that have been under-served for decades. We build for their reality — and we hold the engineering standard as high as anywhere in the world.",
  },
];

const LOOKING_FOR = [
  "Engineers who want to own a domain end-to-end, from schema to CSS.",
  "Product-minded designers who care about interfaces decision-makers can trust.",
  "Go-to-market operators who’ve worked inside African finance, ops, or audit teams.",
  "Customer engineers who can walk an MD through an approval chain without a script.",
];

/** When real openings land, populate this array — the page renders the
 *  roles section automatically once it has entries. `applyHref` accepts
 *  any URL, but should route through /contact?intent=careers (or a
 *  per-role variant) so applications go through a single funnel. */
const OPEN_ROLES: { title: string; location: string; summary: string; applyHref: string }[] = [];

export function CareersProductPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <>
      <Navbar />
      <main id="main">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          backgroundColor: "var(--color-navy-primary)",
          padding: "120px 40px 96px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.careersHero} scrim="dark" />
        <DarkHeroBackdrop glows="hero" grid gridY={gridY} />
        <div style={{ maxWidth: "var(--layout-reading-width)", margin: "0 auto", textAlign: "center", position: "relative", zIndex: Z_INDEX.content }}>
          <SectionIntro
            surface="dark"
            reveal="load"
            titleAs="h1"
            eyebrow="CAREERS"
            eyebrowStyle={{ display: "inline-block", marginBottom: "20px" }}
            title="Build the platform that runs African organisations."
            titleStyle={{ fontWeight: 700, fontSize: "var(--text-display-xs)", lineHeight: 1.15, margin: "0 0 24px" }}
            titleClassName="lg:!text-display-4xl"
            lede={
              <>
                We are small, deliberate, and building for the long run. If
                you&rsquo;ve ever looked at how an African organisation handles
                approvals, procurement, or audit and thought &ldquo;this should
                work properly&rdquo; — we&rsquo;d like to hear from you.
              </>
            }
            ledeStyle={{
              fontSize: "var(--text-2xl)",
              color: "var(--color-text-subtle)",
              lineHeight: 1.7,
              margin: "0 auto 32px",
              maxWidth: "var(--measure)",
            }}
          />
          <m.a {...fadeUpOnLoad(3)} href="#register-interest" {...buttonProps()}>
            Register your interest
          </m.a>
        </div>
      </section>

      {/* ── PRINCIPLES ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.careersPrinciples} scrim="light" />
        <div style={{ maxWidth: "var(--layout-max-width)", margin: "0 auto" }}>
          <SectionIntro
            eyebrow="HOW WE WORK"
            eyebrowStyle={{ marginBottom: "12px" }}
            title="Four principles that shape every decision."
            titleStyle={{
              fontWeight: 400,
              fontSize: "var(--text-heading-2xl)",
              lineHeight: 1.2,
              margin: "0 0 40px",
              maxWidth: "var(--measure)",
              letterSpacing: "0.01em",
            }}
            titleClassName="lg:!text-display-sm"
          />

          <div {...cardGridProps(PRINCIPLES.length, { max: 2 }, { gap: "20px" })}>
            {PRINCIPLES.map((p, i) => {
              const Icon = p.icon;
              return (
                <m.div
                  key={p.title}
                  {...fadeUpOnScroll(i + 2)}
                  style={{
                    backgroundColor: "var(--color-bg-light)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-gold-tint)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.8} color="var(--color-gold)" aria-hidden="true" />
                  </div>
                  <h3
                    style={{
                      fontWeight: 600,
                      fontSize: "var(--text-2xl)",
                      color: "var(--color-text-primary)",
                      margin: "4px 0 0",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-muted)", lineHeight: 1.65, margin: 0 }}>
                    {p.body}
                  </p>
                </m.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHO WE WANT ────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--color-bg)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.careersWhoWeWant} scrim="light" />
        <div style={{ maxWidth: "var(--measure-wide)", margin: "0 auto" }}>
          <SectionIntro
            eyebrow="WHO WE WANT TO HEAR FROM"
            eyebrowStyle={{ marginBottom: "12px" }}
            title={<>We&rsquo;re deliberate about who joins — here&rsquo;s what we look for.</>}
            titleStyle={{ fontWeight: 400, fontSize: "var(--text-heading-xl)", lineHeight: 1.25, margin: "0 0 28px", letterSpacing: "0.01em" }}
            titleClassName="lg:!text-display-xs"
          />

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {LOOKING_FOR.map((line, i) => (
              <m.li
                key={line}
                {...fadeUpOnScroll(i + 2)}
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--color-text-body)",
                  lineHeight: 1.7,
                  paddingLeft: "20px",
                  position: "relative",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "12px",
                    width: "5px",
                    height: "5px",
                    borderRadius: "var(--radius-circle)",
                    background: "var(--color-gold)",
                  }}
                />
                {line}
              </m.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── OPEN ROLES / HONEST NO-ROLES STATE ─────────────── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <SectionBackdrop src={SECTION_BACKDROPS.careersOpenRoles} scrim="light" />
        <div style={{ maxWidth: "var(--measure-wide)", margin: "0 auto" }}>
          <Eyebrow reveal="scroll" style={{ display: "block", marginBottom: "12px" }}>
            OPEN ROLES
          </Eyebrow>

          {OPEN_ROLES.length === 0 ? (
            <m.div
              {...fadeUpOnScroll(1)}
              style={{
                backgroundColor: "var(--color-bg-light)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "32px 36px",
              }}
            >
              <h2
                style={{
                  fontWeight: 500,
                  fontSize: "var(--text-heading-sm)",
                  color: "var(--color-text-primary)",
                  margin: "0 0 10px",
                  letterSpacing: "0.01em",
                }}
              >
                No open roles right now.
              </h2>
              <p style={{ fontSize: "var(--text-lg)", color: "var(--color-text-muted)", lineHeight: 1.75, margin: 0 }}>
                We open roles deliberately. When a seat is ready, we run a
                short, respectful process — and we reach out to the people
                who&rsquo;ve already registered interest first. Leave your
                details below and we&rsquo;ll get in touch when something that
                matches lands.
              </p>
            </m.div>
          ) : (
            <m.div
              {...fadeUpOnScroll(1)}
              style={{
                backgroundColor: "var(--color-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              {OPEN_ROLES.map((role, i) => (
                <div
                  key={role.title}
                  style={{
                    padding: "22px 26px",
                    borderTop: i === 0 ? "none" : "1px solid var(--color-bg)",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <h3
                      style={{
                        fontWeight: 600,
                        fontSize: "var(--text-xl)",
                        color: "var(--color-text-primary)",
                        margin: "0 0 4px",
                      }}
                    >
                      {role.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--color-gold-on-light)", margin: "0 0 8px" }}>
                      {role.location}
                    </p>
                    <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-muted)", lineHeight: 1.65, margin: 0 }}>
                      {role.summary}
                    </p>
                  </div>
                  <ButtonLink href={role.applyHref} size="sm">
                    Apply
                  </ButtonLink>
                </div>
              ))}
            </m.div>
          )}
        </div>
      </section>

      {/* ── REGISTER INTEREST ──────────────────────────────── */}
      <section
        id="register-interest"
        style={{
          backgroundColor: "var(--color-navy-primary)",
          padding: "100px 40px",
          scrollMarginTop: "80px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <SectionBackdrop src={SECTION_BACKDROPS.careersRegisterInterest} scrim="dark" />
        <DarkHeroBackdrop glows="closing" />

        <div style={{ maxWidth: "var(--layout-prose-width)", margin: "0 auto", position: "relative", zIndex: Z_INDEX.content, textAlign: "center" }}>
          <m.h2
            {...fadeUpOnScroll()}
            style={{
              fontWeight: 400,
              fontSize: "var(--text-heading-xl)",
              color: "var(--color-white)",
              lineHeight: 1.2,
              margin: "0 0 16px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-display-xs"
          >
            Register your interest — it&rsquo;s how we hire.
          </m.h2>
          <m.p
            {...fadeUpOnScroll(1)}
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text-subtle)",
              lineHeight: 1.75,
              margin: "0 auto 28px",
              maxWidth: "var(--measure-snug)",
            }}
          >
            Send a short note through our{" "}
            <Link href={contactHref("careers")} style={{ color: "var(--color-gold)", textDecoration: "none" }}>
              register-interest form
            </Link>{" "}
            telling us what you&rsquo;re drawn to, a link to something
            you&rsquo;re proud of, and what kind of work you&rsquo;d want to own
            here. We read every message.
          </m.p>
          <m.div
            {...fadeUpOnScroll(2)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <ButtonLink href={contactHref("careers")}>
              <Mail size={16} strokeWidth={1.8} aria-hidden="true" />
              Register my interest
            </ButtonLink>
            <ButtonLink href={SITE_ROUTES.about} variant="secondary" surface="dark">
              About the team
              <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
            </ButtonLink>
          </m.div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
