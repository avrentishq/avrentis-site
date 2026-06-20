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
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Compass,
  ShieldCheck,
  Handshake,
  Globe,
  Mail,
  ArrowRight,
} from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const sans = "var(--font-sans)";
const mono = "'IBM Plex Mono', monospace";

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
      "Our first customers are African organisations that have been under-served for decades. We build for their reality — and we hold the engineering standard as high as anywhere in the world.",
  },
];

const LOOKING_FOR = [
  "Engineers who want to own a domain end-to-end, from schema to CSS.",
  "Product-minded designers who care about interfaces decision-makers can trust.",
  "Go-to-market operators who&rsquo;ve worked inside African finance, ops, or audit teams.",
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

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          backgroundColor: "#0f172a",
          padding: "120px 40px 96px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AmbientGlow top="-120px" left="-100px" size={520} intensity={0.22} duration={32} />
        <AmbientGlow bottom="-140px" right="-80px" size={560} intensity={0.18} duration={38} delay={0.5} />
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            y: gridY,
            zIndex: 1,
          }}
        />
        <div style={{ maxWidth: "840px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
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
              color: "var(--color-gold)",
              display: "inline-block",
              marginBottom: "20px",
            }}
          >
            CAREERS
          </motion.span>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 700,
              fontSize: "36px",
              color: "#FFFFFF",
              lineHeight: 1.15,
              margin: "0 0 24px",
            }}
            className="lg:!text-[56px]"
          >
            Build the platform that runs African organisations.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(2)}
            style={{
              fontFamily: sans,
              fontSize: "17px",
              color: "#94a3b8",
              lineHeight: 1.7,
              margin: "0 auto 32px",
              maxWidth: "640px",
            }}
          >
            We are small, deliberate, and building for the long run. If
            you&rsquo;ve ever looked at how an African organisation handles
            approvals, procurement, or audit and thought &ldquo;this should
            work properly&rdquo; — we&rsquo;d like to hear from you.
          </motion.p>
          <motion.a
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={staggerDelay(3)}
            href="#register-interest"
            style={{
              fontFamily: sans,
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
            Register your interest
          </motion.a>
        </div>
      </section>

      {/* ── PRINCIPLES ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              display: "block",
              marginBottom: "12px",
            }}
          >
            HOW WE WORK
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "32px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 40px",
              maxWidth: "620px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[38px]"
          >
            Four principles that shape every decision.
          </motion.h2>

          <div style={{ display: "grid", gap: "20px" }} className="grid-cols-1 md:grid-cols-2">
            {PRINCIPLES.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={staggerDelay(i + 2)}
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
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
                      borderRadius: "6px",
                      backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
                  </div>
                  <h3
                    style={{
                      fontFamily: sans,
                      fontWeight: 600,
                      fontSize: "17px",
                      color: "#0f172a",
                      margin: "4px 0 0",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: sans, fontSize: "14px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                    {p.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHO WE WANT ────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f1f5f9", padding: "100px 40px" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              display: "block",
              marginBottom: "12px",
            }}
          >
            WHO WE WANT TO HEAR FROM
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "30px",
              color: "#0f172a",
              lineHeight: 1.25,
              margin: "0 0 28px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[36px]"
          >
            We&rsquo;re deliberate about who joins — here&rsquo;s what we look for.
          </motion.h2>

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
              <motion.li
                key={line}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 2)}
                style={{
                  fontFamily: sans,
                  fontSize: "15px",
                  color: "#334155",
                  lineHeight: 1.7,
                  paddingLeft: "20px",
                  position: "relative",
                }}
                dangerouslySetInnerHTML={{ __html: `<span style="position:absolute;left:0;top:12px;width:5px;height:5px;border-radius:50%;background:var(--color-gold);"></span>${line}` }}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* ── OPEN ROLES / HONEST NO-ROLES STATE ─────────────── */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "100px 40px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              display: "block",
              marginBottom: "12px",
            }}
          >
            OPEN ROLES
          </motion.span>

          {OPEN_ROLES.length === 0 ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(1)}
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "32px 36px",
              }}
            >
              <h2
                style={{
                  fontFamily: sans,
                  fontWeight: 500,
                  fontSize: "22px",
                  color: "#0f172a",
                  margin: "0 0 10px",
                  letterSpacing: "0.01em",
                }}
              >
                No open roles right now.
              </h2>
              <p style={{ fontFamily: sans, fontSize: "15px", color: "#64748b", lineHeight: 1.75, margin: 0 }}>
                We open roles deliberately. When a seat is ready, we run a
                short, respectful process — and we reach out to the people
                who&rsquo;ve already registered interest first. Leave your
                details below and we&rsquo;ll get in touch when something that
                matches lands.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(1)}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {OPEN_ROLES.map((role, i) => (
                <div
                  key={role.title}
                  style={{
                    padding: "22px 26px",
                    borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
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
                        fontFamily: sans,
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#0f172a",
                        margin: "0 0 4px",
                      }}
                    >
                      {role.title}
                    </h3>
                    <p style={{ fontFamily: mono, fontSize: "11px", color: "var(--color-gold)", margin: "0 0 8px" }}>
                      {role.location}
                    </p>
                    <p style={{ fontFamily: sans, fontSize: "14px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                      {role.summary}
                    </p>
                  </div>
                  <Link
                    href={role.applyHref}
                    style={{
                      fontFamily: sans,
                      fontSize: "13px",
                      fontWeight: 600,
                      backgroundColor: "var(--color-gold)",
                      color: "#0f172a",
                      borderRadius: "6px",
                      padding: "0 18px",
                      height: "40px",
                      display: "inline-flex",
                      alignItems: "center",
                      textDecoration: "none",
                    }}
                  >
                    Apply
                  </Link>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── REGISTER INTEREST ──────────────────────────────── */}
      <section
        id="register-interest"
        style={{
          backgroundColor: "#0f172a",
          padding: "100px 40px",
          scrollMarginTop: "80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AmbientGlow top="20%" left="-120px" size={420} intensity={0.15} duration={34} />
        <AmbientGlow bottom="-80px" right="-100px" size={480} intensity={0.13} duration={40} delay={0.5} />

        <div style={{ maxWidth: "780px", margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "30px",
              color: "#FFFFFF",
              lineHeight: 1.2,
              margin: "0 0 16px",
              letterSpacing: "0.01em",
            }}
            className="lg:!text-[36px]"
          >
            Register your interest — it&rsquo;s how we hire.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: sans,
              fontSize: "15px",
              color: "#94a3b8",
              lineHeight: 1.75,
              margin: "0 auto 28px",
              maxWidth: "600px",
            }}
          >
            Send a short note through our{" "}
            <Link href="/contact?intent=careers" style={{ color: "var(--color-gold)", textDecoration: "none" }}>
              register-interest form
            </Link>{" "}
            telling us what you&rsquo;re drawn to, a link to something
            you&rsquo;re proud of, and what kind of work you&rsquo;d want to own
            here. We read every message.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/contact?intent=careers"
              style={{
                fontFamily: sans,
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: "var(--color-gold)",
                color: "#0f172a",
                borderRadius: "6px",
                padding: "0 22px",
                height: "44px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <Mail size={16} strokeWidth={1.8} aria-hidden="true" />
              Register my interest
            </Link>
            <Link
              href="/about"
              style={{
                fontFamily: sans,
                fontWeight: 500,
                fontSize: "14px",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                padding: "0 22px",
                height: "44px",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                gap: "8px",
              }}
            >
              About the team
              <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
