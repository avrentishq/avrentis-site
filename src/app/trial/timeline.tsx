"use client";

/**
 * TrialTimeline — an honest, public-safe schedule of the 30-day trial.
 *
 * Transparency / "no dark patterns": the exact lifecycle is stated up front,
 * including the heads-up before the trial ends and the grace period after it.
 * Every milestone maps to real product behaviour (30-day trial → read-only →
 * 30-day grace → close at day 60). Deliberately omits internal cadence,
 * mechanisms, and infrastructure — only what a customer needs to feel in
 * control appears here.
 */

import { m } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

const sans = "var(--font-sans)";

interface Milestone {
  when: string;
  title: string;
  detail: string;
}

const MILESTONES: Milestone[] = [
  {
    when: "Today",
    title: "Full Business features, instantly",
    detail:
      "Full Business features on your own data — a 5-seat pilot workspace, with a sample approval already waiting. No card.",
  },
  {
    when: "Days 1–29",
    title: "We keep you moving",
    detail:
      "A few getting-started nudges, a mid-trial summary, and a heads-up the day before it ends.",
  },
  {
    when: "Day 30",
    title: "Read-only — not gone",
    detail:
      "Keep viewing and exporting everything. Creating resumes the moment you upgrade.",
  },
  {
    when: "Day 60",
    title: "Nothing removed without warning",
    detail:
      "A 30-day grace period after read-only — and a clear heads-up before any data is removed.",
  },
];

export function TrialTimeline() {
  return (
    <section>
      <m.span
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        transition={fadeUpTransition}
        style={{
          fontFamily: sans,
          fontWeight: 600,
          fontSize: "12px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--color-gold-on-light)",
          display: "block",
          marginBottom: "20px",
        }}
      >
        How the 30 days work
      </m.span>

      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {MILESTONES.map((ms, i) => {
          const isLast = i === MILESTONES.length - 1;
          const isNow = i === 0;
          return (
            <m.li
              key={ms.when}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(Math.min(i, 4))}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                columnGap: "20px",
                position: "relative",
              }}
            >
              {/* Rail: dot + connecting line */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    marginTop: "4px",
                    flexShrink: 0,
                    // Today is "now" — filled. Future days stay hollow.
                    backgroundColor: isNow ? "var(--color-gold)" : "#FFFFFF",
                    border: isNow ? "none" : "1.5px solid #cbd5e1",
                    boxShadow: isNow
                      ? "0 0 0 4px rgba(var(--color-gold-rgb), 0.12)"
                      : "none",
                  }}
                />
                {!isLast && (
                  <span
                    aria-hidden="true"
                    style={{
                      width: "1.5px",
                      flex: 1,
                      minHeight: "24px",
                      backgroundColor: "#e2e8f0",
                      marginTop: "6px",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: isLast ? 0 : "22px" }}>
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-gold-on-light)",
                    display: "block",
                    marginBottom: "3px",
                  }}
                >
                  {ms.when}
                </span>
                <h3
                  style={{
                    fontFamily: sans,
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: "0 0 5px",
                    lineHeight: 1.35,
                  }}
                >
                  {ms.title}
                </h3>
                <p
                  style={{
                    fontFamily: sans,
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {ms.detail}
                </p>
              </div>
            </m.li>
          );
        })}
      </ol>
    </section>
  );
}
