"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { useIsMobile, isMobileViewport } from "@/lib/hooks/use-is-mobile";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { Zap, Smartphone, Lock, Globe } from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";
import { APPROVAL_LIFECYCLE, type LifecycleStageKey } from "@/lib/approval-lifecycle";
import { capitalisedNumberInWords } from "@/lib/number-words";
import { STAGE_MOCKUPS } from "@/components/product/stage-mockups";
import { BrowserFrame, appCaption } from "@/components/product/previews/preview-primitives";

/**
 * The homepage's own words for each lifecycle stage. The stages — titles,
 * order and count — come from `APPROVAL_LIFECYCLE`, and the drawing for each
 * from `STAGE_MOCKUPS`, the same one /product/how-it-works shows.
 */
const STAGE_BODY: Record<LifecycleStageKey, string> = {
  submit:
    "Any team member raises a request directly in Avrentis — payment voucher, purchase order, or any operational approval. They complete a structured form, attach supporting documents, and submit. The request enters the defined approval chain immediately — no emails, no chasing, no ambiguity about where it goes next.",
  review:
    "The right person is notified instantly — via the platform, email, WhatsApp, or SMS. They review the complete request and approve, query, or return it with a single action from any device, anywhere in the world. Decision makers are never a bottleneck because they are never out of reach.",
  sanction:
    "Final authority signs it off. The Managing Director sees every approval collected along the way and sanctions with a saved signature, stamped onto every document the request produces. Authority becomes binding — and the record shows exactly who gave it.",
  record:
    "The moment a decision is made, Avrentis creates a complete, timestamped, tamper-evident record. Supporting documents are generated automatically. Every action is permanently attributed to a person, a time, and a decision. Your organisation builds institutional memory with every transaction — across every department, every team, every location.",
};

const FEATURES = [
  { icon: Zap, label: "Real-time notifications" },
  { icon: Smartphone, label: "Approve from any device" },
  { icon: Lock, label: "Tamper-evident records" },
  { icon: Globe, label: "Works across any location" },
];

/* ── Main section ──────────────────────────────────────── */

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const activeStage = APPROVAL_LIFECYCLE[active]!;
  const { Mockup: ActiveMockup, previewPath } = STAGE_MOCKUPS[activeStage.key];

  // Auto-advance through steps every 6s. Pauses permanently once the user
  // clicks a step number (so the page doesn't fight their intent). Also
  // respects `prefers-reduced-motion`.
  useEffect(() => {
    if (!autoAdvance) return;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // Skip auto-advance on mobile — same reasoning as the hero demo.
    if (reducedMotion || isMobileViewport()) return;

    const timer = setInterval(() => {
      setActive((i) => (i + 1) % APPROVAL_LIFECYCLE.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoAdvance]);

  function selectStep(i: number) {
    setActive(i);
    setAutoAdvance(false);
  }

  // Scroll-linked parallax on the grid overlay; travels up ~80px over the
  // section's full scroll range.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const isMobile = useIsMobile();

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        backgroundColor: "var(--color-navy-primary)",
        padding: "120px 40px",
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <SectionBackdrop src={SECTION_BACKDROPS.howItWorks} scrim="dark" />
      {/* Ambient background layers */}
      <AmbientGlow
        top="10%"
        left="-150px"
        size={520}
        intensity={0.18}
        duration={34}
      />
      <AmbientGlow
        bottom="-80px"
        right="-120px"
        size={460}
        intensity={0.15}
        duration={40}
        delay={0.5}
      />
      <m.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "linear-gradient(rgba(var(--color-white-rgb), 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--color-white-rgb), 0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          y: isMobile ? 0 : gridY,
          zIndex: 1,
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "48px",
            alignItems: "flex-start",
            width: "100%",
          }}
          className="lg:!flex-row lg:!items-center"
        >
          {/* ── Left Panel ──────────────────────────────────── */}
          <div className="w-full lg:flex-1">
            {/* ── Header ──────────────────────────────────── */}
            <m.span
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={fadeUpTransition}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                display: "block",
                marginBottom: "16px",
              }}
            >
              HOW IT WORKS
            </m.span>
            <m.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(1)}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "24px",
                color: "var(--color-white)",
                lineHeight: 1.2,
                margin: "0 0 16px",
                maxWidth: "600px",
              }}
              className="lg:!text-[42px]"
            >
              {capitalisedNumberInWords(APPROVAL_LIFECYCLE.length)} steps. Zero paper. Complete record.
            </m.h2>

            {/* Left — Text. Reserved height so the mode="wait" swap (old
                paragraph unmounts before the new one mounts) can't collapse the
                block to zero and jump the step selector below it. Sized to the
                tallest body: ~204px on mobile (narrower wrap), ~128px on lg. */}
            <div className="min-h-[204px] lg:min-h-[128px]">
              <AnimatePresence mode="wait">
                <m.div
                  key={`text-${active}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                    margin: 0,
                    maxWidth: "480px",
                  }}
                >
                  {STAGE_BODY[activeStage.key]}
                </p>
                </m.div>
              </AnimatePresence>
            </div>

            {/* ── Step Selector ───────────────────────────── */}
            <m.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(3)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: "56px",
                position: "relative",
              }}
            >
              {APPROVAL_LIFECYCLE.map((step, i) => (
                <div
                  key={step.key}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    cursor: "pointer",
                    position: "relative",
                    width: "100%",
                    minHeight: "60px",
                  }}
                  onClick={() => selectStep(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Step ${i + 1}: ${step.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectStep(i);
                    }
                  }}
                >
                  {/* Connecting line — between circles */}
                  {i < APPROVAL_LIFECYCLE.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "16px",
                        top: "50%",
                        bottom: "-50%",
                        width: "2px",
                        backgroundColor:
                          i < active
                            ? "var(--color-gold)"
                            : "rgba(var(--color-neutral-tint-rgb), 0.25)",
                        zIndex: 0,
                        transition: "background-color 0.3s ease",
                      }}
                    />
                  )}
                  {/* Circle */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      backgroundColor:
                        i === active ? "var(--color-gold)" : "transparent",
                      border:
                        i === active
                          ? "2px solid var(--color-gold)"
                          : "2px solid rgba(var(--color-neutral-tint-rgb), 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 1,
                      transition: "background-color 0.3s ease, border-color 0.3s ease",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "13px",
                        color: i === active ? "var(--color-navy-primary)" : "var(--color-text-muted)",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  {/* Title */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: i === active ? 600 : 500,
                      fontSize: "14px",
                      color: i === active ? "var(--color-white)" : "var(--color-text-muted)",
                      marginLeft: "14px",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </m.div>
          </div>

          {/* ── Right Panel — Mockup ────────────────────────────── */}
          {/* Plain flex, not a 2-col grid: the panel holds a single mockup, so
              a grid-cols-2 reserved a permanently-empty second track — the dead
              whitespace on the right. Balanced lg:flex-1 halves + the mockup
              right-aligned in its half fills the width instead. */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              // Fixed render height: the tallest framed stage mockup is ~462px
              // (lg) / ~471px (mobile, the review stage); reserving 480px stops
              // the mode="wait" swap from collapsing the panel to zero and
              // jumping the section each cycle.
              minHeight: "480px",
            }}
            className="lg:flex-1 lg:justify-end"
          >
            {/* Right — Mockup */}
            <AnimatePresence mode="wait">
              <m.div
                key={`mockup-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: "460px", width: "100%" }}
              >
                <BrowserFrame caption={appCaption(previewPath)} surface="dark">
                  <ActiveMockup />
                </BrowserFrame>
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Feature Callout Strip ───────────────────── */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(4)}
          style={{
            backgroundColor: "var(--color-navy-mid)",
            borderRadius: "10px",
            padding: "20px 32px",
            marginTop: "72px",
            display: "grid",
            gap: "16px",
          }}
          className="grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Icon
                  size={16}
                  strokeWidth={1.8}
                  color={BRAND_COLORS.gold}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "13px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {feat.label}
                </span>
              </div>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
