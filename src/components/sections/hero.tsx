"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FADE_UP_VIEWPORT, MOTION_DURATION, MOTION_EASE, STAGGER_STEP, fadeUp, fadeUpOnScroll, fadeUpTransition, staggerDelay, cssTransition } from "@/lib/animations";
import { isMobileViewport } from "@/lib/hooks/use-is-mobile";
import { isReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { buttonProps } from "@/components/ui/button";
import { DarkHeroBackdrop } from "@/components/ui/dark-hero-backdrop";
import { Eyebrow } from "@/components/ui/section-intro";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import { BRAND, SITE_PAGES } from "@/lib/brand";
import { START_TRIAL_CTA, NO_CARD_REQUIRED, TRIAL_SETUP_TIME } from "@/lib/trial-terms";
import { MARKET_SCOPE } from "@/lib/market";
import { INBOX_DOCUMENTS, demoAmount, formatDemoRelative, type InboxStatus } from "@/components/product/demo-fixtures";
import { BrowserFrame, TypeTag, appCaption } from "@/components/product/previews/preview-primitives";
import { Z_INDEX } from "@/lib/layers";

interface ApprovalRowStatus {
  label: string;
  bg: string;
  text: string;
  dot: string;
}

interface ApprovalRowProps {
  reference: string;
  type: "PV" | "PO";
  status: ApprovalRowStatus;
  label: string;
  submittedBy: string;
  /** ISO instant; shown relative to the demo's "now". */
  submittedAt: string;
  /** Major units in the lead currency. */
  amount: number;
  department: string;
  hideDivider?: boolean;
  /** Optional trailing control (e.g. the interactive Approve button on row 1). */
  action?: React.ReactNode;
}

// Status presets mirroring STATUS_CONFIG in the real platform
const STATUS = {
  underReview: {
    label: "Under review",
    bg: "var(--color-gold-ghost)",
    text: "var(--color-warning)",
    dot: "var(--color-gold)",
  },
  submitted: {
    label: "Submitted",
    bg: "rgba(var(--color-warning-accent-rgb), 0.08)",
    text: "var(--color-warning-strong)",
    dot: "var(--color-warning-accent)",
  },
  queried: {
    label: "Queried",
    bg: "rgba(var(--color-queried-accent-rgb), 0.08)",
    text: "var(--color-queried)",
    dot: "var(--color-queried-accent)",
  },
  recorded: {
    label: "Recorded",
    bg: "var(--color-success-wash)",
    text: "var(--color-success)",
    dot: "var(--color-success)",
  },
} as const satisfies Record<InboxStatus | "recorded", ApprovalRowStatus>;

// The one-click CTA offered on a row depends on where it is in the flow, so
// the demo shows a realistic mix (not just "Approve"). Whatever the verb, the
// outcome is the same product promise: the decision lands on the audit trail.
const CTA_VERB: Record<InboxStatus, string> = {
  underReview: "Approve",
  submitted: "Review",
  queried: "Respond",
};

/** How many inbox rows show at once — the default (and reduced-motion) view is the feed's first four. */
const VISIBLE_ROWS = 4;

function LiveInbox({
  approved,
  onApprove,
}: {
  approved: boolean;
  onApprove: () => void;
}) {
  // The whole list is a live feed: every few seconds all four visible slots
  // advance one step through INBOX_DOCUMENTS, cross-fading in a staggered cascade so the
  // list reads as continuously updating rather than one twitching row.
  // Rotation freezes once the visitor approves the top row (their action is
  // acknowledged) and is disabled entirely under reduced-motion.
  const [tick, setTick] = useState(0);
  // Which visible slot currently offers a one-click CTA. Starts at the top
  // (deterministic, so SSR and first client render agree) then hops to a
  // random row each tick — the button is never pinned to one row or action.
  const [activeRow, setActiveRow] = useState(0);
  // The slot the visitor acted on — frozen into a "Recorded" done-state.
  const [engagedRow, setEngagedRow] = useState<number | null>(null);

  useEffect(() => {
    // Don't run the rotating demo on mobile — it stacks below the fold and the
    // interval just burns main-thread/battery. Static initial state instead.
    if (isReducedMotion() || isMobileViewport() || approved) return;

    const timer = setInterval(() => {
      setTick((t) => (t + 1) % INBOX_DOCUMENTS.length);
      setActiveRow(Math.floor(Math.random() * VISIBLE_ROWS));
    }, 4000);

    return () => clearInterval(timer);
  }, [approved]);

  const rows = Array.from(
    { length: VISIBLE_ROWS },
    (_, i) => INBOX_DOCUMENTS[(tick + i) % INBOX_DOCUMENTS.length]!,
  );

  const handleEngage = (rowIndex: number) => {
    setEngagedRow(rowIndex);
    onApprove();
  };

  return (
    <div
      style={{
        // Liquid glass: frosted translucent card so the light-trails refract
        // through the list too. Kept light enough (compounds with the frosted
        // window behind it) that the dark row text stays legible.
        backgroundColor: "rgba(var(--color-white-rgb), 0.64)",
        backdropFilter: "blur(22px) saturate(1.4)",
        WebkitBackdropFilter: "blur(22px) saturate(1.4)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid rgba(var(--color-white-rgb), 0.55)",
        boxShadow:
          "inset 0 1px 0 rgba(var(--color-white-rgb), 0.6), 0 1px 2px rgba(var(--color-shadow-rgb), 0.05)",
      }}
    >
      {rows.map((entry, i) => {
        const isLast = i === VISIBLE_ROWS - 1;
        // The acted-on row freezes into a neutral "Recorded" state — whatever
        // the verb was, the payoff is the same: the decision lands on the audit trail.
        const isDone = engagedRow === i;
        const status = isDone ? STATUS.recorded : STATUS[entry.status];
        // One live CTA at a time, on a random slot; verb depends on the row's
        // stage (Approve / Review / Respond). Any click freezes the feed and
        // reveals the reciprocity nudge.
        const showCta = !approved && i === activeRow;
        return (
          <AnimatePresence key={`slot-${i}`} mode="wait" initial={false}>
            <m.div
              key={entry.reference}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={staggerDelay(i)}
            >
              <ApprovalRow
                {...entry}
                status={status}
                hideDivider={isLast}
                action={
                  showCta ? (
                    <ApproveButton
                      onApprove={() => handleEngage(i)}
                      reference={entry.reference}
                      label={CTA_VERB[entry.status]}
                    />
                  ) : undefined
                }
              />
            </m.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
}

/**
 * ApprovalRow — visually mirrors BulkApprovalList rows in the real platform.
 * Accent bar on the left, reference + type tag + status badge inline, label,
 * submitter + relative time underneath, amount + department on the right.
 *
 * The details and the amount column wrap: where the row is too narrow for both
 * side by side (a phone), the amount, department and action drop beneath the
 * details instead of squeezing the reference onto three lines and the payee
 * down to a few letters.
 */
function ApprovalRow({
  reference,
  type,
  status,
  label,
  submittedBy,
  submittedAt,
  amount,
  department,
  hideDivider = false,
  action,
}: ApprovalRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "12px",
        padding: "14px 16px",
        borderBottom: hideDivider ? "none" : "1px solid var(--color-navy-hairline)",
      }}
    >
      {/* Accent urgency bar */}
      <div
        style={{
          width: "4px",
          minHeight: "36px",
          borderRadius: "var(--radius-2xs)",
          backgroundColor: "var(--color-gold)",
          flexShrink: 0,
        }}
      />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          columnGap: "12px",
          rowGap: "8px",
        }}
      >
        <div style={{ flex: "1 1 190px", minWidth: 0 }}>
          {/* Reference + type + status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "2px",
            }}
          >
            <span
              style={{
                fontFeatureSettings: '"tnum" 1',
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                color: "var(--color-text-primary)",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {reference}
            </span>
            <TypeTag>{type}</TypeTag>
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={status.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "var(--text-3xs)",
                  fontWeight: 500,
                  backgroundColor: status.bg,
                  color: status.text,
                  borderRadius: "var(--radius-xs)",
                  padding: "2px 6px",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "var(--radius-circle)",
                    backgroundColor: status.dot,
                    display: "inline-block",
                  }}
                />
                {status.label}
              </m.span>
            </AnimatePresence>
          </div>

          {/* Label */}
          <p
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              color: "var(--color-text-primary)",
              margin: "0 0 2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </p>

          {/* Submitter + time */}
          <p
            style={{
              fontSize: "var(--text-2xs)",
              color: "var(--color-text-muted)",
              margin: 0,
            }}
          >
            Submitted by {submittedBy} &middot; {formatDemoRelative(submittedAt)}
          </p>
        </div>

        {/* Amount + department, then the action — pushed right, wrapping beneath on a phone */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFeatureSettings: '"tnum" 1',
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--color-text-primary)",
                margin: "0 0 2px",
                whiteSpace: "nowrap",
              }}
            >
              {demoAmount(amount)}
            </p>
            <p
              style={{
                fontSize: "var(--text-2xs)",
                color: "var(--color-text-muted)",
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              {department}
            </p>
          </div>

          {action}
        </div>
      </div>
    </div>
  );
}

/**
 * ApproveButton — the one genuinely interactive control in the hero mock.
 * Lets a visitor action the top approval with no signup (reciprocity: value
 * before the ask). Motion stays within brand rules (opacity/colour only).
 */
function ApproveButton({
  onApprove,
  reference,
  label = "Approve",
}: {
  onApprove: () => void;
  reference: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onApprove}
      aria-label={`${label} ${reference}`}
      {...buttonProps({ size: "xs", style: { marginLeft: "4px", flexShrink: 0 } })}
    >
      {label}
    </button>
  );
}

export function Hero() {
  // Whether the visitor has approved the sample document in the hero mock.
  const [approved, setApproved] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // Scroll-linked parallax on the grid texture — drifts up by 60px across
  // the section's full scroll, giving a subtle depth cue.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "var(--color-navy-primary)",
        padding: "140px 40px 120px",
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Backdrop — night light-trails: every action, captured and recorded.
          Held well back with a directional navy scrim so the headline stays
          legible and the warm trails read as navy/gold rather than red. */}
      <SectionBackdrop src={SECTION_BACKDROPS.hero} scrim="hero" priority />

      {/* Ambient glows + grid texture with scroll-linked parallax */}
      <DarkHeroBackdrop glows="hero" grid gridY={gridY} />

      <div
        style={{
          maxWidth: "var(--layout-max-width)",
          margin: "0 auto",
          display: "grid",
          gap: "48px",
          alignItems: "center",
          position: "relative",
          zIndex: Z_INDEX.content,
        }}
        className="grid-cols-1 lg:grid-cols-2"
      >
        {/* Left — Copy */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Eyebrow surface="dark" size="hero" reveal="scroll" style={{ marginBottom: "20px" }}>
            {BRAND.positioningStatement}
          </Eyebrow>

          <m.h1
            initial="hidden"
            whileInView="visible"
            viewport={FADE_UP_VIEWPORT}
            variants={{ visible: { transition: { staggerChildren: STAGGER_STEP } } }}
            style={{
              fontWeight: 700,
              fontSize: "var(--text-display-xs)",
              color: "var(--color-white)",
              lineHeight: 1.15,
              margin: "0 0 24px",
            }}
            className="lg:!text-display-4xl"
          >
            {/* Positioning line. Leads with the PROOF (what a buyer must be able
                to show an auditor) and the SCOPE (across companies) — the part no
                single accounting or ERP system can answer, because none of them
                is installed in every entity. Word-by-word stagger is preserved;
                the em dash closes the first line rather than opening the second,
                so the break reads as a pause, not a hyphenated word. */}
            {/* The em dash is bound to "what" as ONE span, never its own word: at
                390px a standalone dash wrapped onto a line by itself and read as a
                stray horizontal rule rather than punctuation. Caught by eye on
                mobile — the desktop view hides it. An inline-block span cannot
                break internally, so the pairing is what guarantees the fix. */}
            {["Prove", "who", "authorised", "what —"].map((word, i) => (
              <m.span
                key={`top-${i}`}
                variants={fadeUp}
                transition={fadeUpTransition}
                style={{ display: "inline-block", marginRight: "0.3em" }}
              >
                {word}
              </m.span>
            ))}
            <br />
            <m.span
              variants={fadeUp}
              transition={fadeUpTransition}
              style={{ display: "inline-block" }}
            >
              across every company you run.
            </m.span>
          </m.h1>

          <m.p
            {...fadeUpOnScroll(2)}
            style={{
              fontWeight: 400,
              fontSize: "var(--text-3xl)",
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              margin: "0 0 36px",
              maxWidth: "var(--measure-short)",
            }}
          >
            Most organisations run on scattered emails, informal approvals, and
            no clear record of who was allowed to approve what. {BRAND.name} makes
            authority explicit — every decision routed to the right approver,
            enforced, and on record permanently.
          </m.p>

          <m.div
            {...fadeUpOnScroll(3)}
            style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
          >
            <a
              href={SITE_PAGES.trial()}
              {...buttonProps({ size: "lg" })}
            >
              {START_TRIAL_CTA}
            </a>
            <a
              href="#how-it-works"
              style={{
                fontWeight: 500,
                fontSize: "var(--text-xl)",
                lineHeight: 1,
                backgroundColor: "var(--color-white-border)",
                backdropFilter: "blur(12px) saturate(1.4)",
                WebkitBackdropFilter: "blur(12px) saturate(1.4)",
                color: "var(--color-white)",
                border: "1px solid var(--color-white-border-strong)",
                boxShadow: "inset 0 1px 0 rgba(var(--color-white-rgb), 0.18)",
                borderRadius: "var(--radius-pill)",
                height: "48px",
                padding: "0 28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                cursor: "pointer",
                transition:
                  cssTransition(["border-color", "background-color"]),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(var(--color-white-rgb), 0.4)";
                e.currentTarget.style.backgroundColor =
                  "rgba(var(--color-white-rgb), 0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-white-border-strong)";
                e.currentTarget.style.backgroundColor =
                  "var(--color-white-border)";
              }}
            >
              See how it works &rarr;
            </a>
          </m.div>

          <m.p
            {...fadeUpOnScroll(4)}
            style={{
              fontWeight: 400,
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
              marginTop: "24px",
              lineHeight: 1.5,
            }}
          >
            {NO_CARD_REQUIRED} &middot; Set up {TRIAL_SETUP_TIME} &middot; Built for{" "}
            {MARKET_SCOPE}
          </m.p>
        </div>

        {/* Right — Desktop approval inbox preview (mirrors the real platform UI) */}
        <m.div
          {...fadeUpOnScroll(4)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Browser window frame — liquid glass: a frosted translucent
              surface that refracts the light-trails behind it, with a
              specular top edge. The inbox card inside stays opaque so the
              product UI reads crisply. */}
          <BrowserFrame caption={appCaption("approvals")} surface="glass" style={{ width: "100%", maxWidth: "var(--measure-narrow)" }}>
            {/* Page content — tighter side padding on a phone so the rows keep their width */}
            <div style={{ padding: "24px 16px" }} className="sm:!px-[28px]">
              {/* Page heading */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontWeight: 400,
                      fontSize: "var(--text-heading-xs)",
                      color: "var(--color-text-primary)",
                      margin: 0,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Approvals
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                      margin: "2px 0 0",
                    }}
                  >
                    {VISIBLE_ROWS} documents awaiting your review
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "var(--text-2xs)",
                    fontWeight: 500,
                    color: "var(--color-gold-on-light)",
                    backgroundColor: "var(--color-gold-ghost)",
                    border: "1px solid var(--color-gold-divider)",
                    borderRadius: "var(--radius-xs)",
                    padding: "3px 8px",
                  }}
                >
                  MD review
                </span>
              </div>

              {/* Inbox list — a live feed of glass rows. All four slots rotate
                  through the pool every few seconds; a single one-click CTA
                  (Approve / Review / Respond) hops to a random row. Acting on
                  any of them freezes the feed and reveals the nudge below. */}
              <LiveInbox
                approved={approved}
                onApprove={() => setApproved(true)}
              />

              {/* Post-approval nudge — the reciprocity payoff: they used the
                  loop, now the ask. */}
              {approved ? (
                <m.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={fadeUpTransition}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: "14px 0 0",
                    padding: "10px 12px",
                    backgroundColor: "var(--color-success-wash)",
                    border: "1px solid var(--color-success-border)",
                    borderRadius: "var(--radius-card)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ color: "var(--color-success)", fontWeight: 700, flexShrink: 0 }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-body)",
                      lineHeight: 1.5,
                    }}
                  >
                    Recorded &mdash; on an audit trail kept for the life of your account.
                    That&rsquo;s the core loop.{" "}
                    <a
                      href={SITE_PAGES.trial()}
                      style={{
                        color: "var(--color-gold-on-light)",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Run it on your own approvals &rarr;
                    </a>
                  </span>
                </m.div>
              ) : (
                <p
                  style={{
                    fontSize: "var(--text-2xs)",
                    color: "var(--color-text-subtle)",
                    margin: "14px 0 0",
                    textAlign: "right",
                  }}
                >
                  Showing {VISIBLE_ROWS} of {VISIBLE_ROWS} &middot; Act on one &mdash; your decision
                  stays on record
                </p>
              )}
            </div>
          </BrowserFrame>
        </m.div>
      </div>
    </section>
  );
}
