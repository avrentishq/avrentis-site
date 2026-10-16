/**
 * TrialStepper — one consolidated progress control: a single track that doubles
 * as the fill bar, with step circles riding on it and the percentage inline.
 *
 * The journey: landing on /trial is step 1 ("Started") — already done, so the
 * meter opens at 33%, never 0%. "Your setup" and "Your details" are steps 2 & 3.
 *
 * `current` = the step the visitor is on: 2 = Your setup, 3 = Your details,
 * 4 = submitted (all done → 100%). Percentage = completed steps ÷ 3.
 *
 * Presentational only; safe inside client trees.
 */

import { Check } from "lucide-react";
import { cssTransition } from "@/lib/animations";

const STEPS = ["Started", "Your setup", "Your details"];

/** `current` once every step is done (the request is sent) — the meter reads 100%. */
export const TRIAL_STEPS_DONE = STEPS.length + 1;

interface TrialStepperProps {
  current: number;
}

export function TrialStepper({ current }: TrialStepperProps) {
  const pct = Math.round(((current - 1) / STEPS.length) * 100);

  return (
    <div style={{ margin: "0 auto 36px", maxWidth: "var(--measure-tight)" }}>
      {/* Header: label + live percentage */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
          Your progress
        </span>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-gold-on-light)" }}>
          {pct}% complete
        </span>
      </div>

      {/* Track + circles: the track is the progress bar; circles ride on it */}
      <div style={{ position: "relative", height: "28px" }} aria-hidden="true">
        <div style={{ position: "absolute", top: "12px", left: "14px", right: "14px", height: "4px", backgroundColor: "var(--color-border)", borderRadius: "var(--radius-pill)" }} />
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "14px",
            width: `calc((100% - 28px) * ${pct / 100})`,
            height: "4px",
            backgroundColor: "var(--color-gold)",
            borderRadius: "var(--radius-pill)",
            transition: cssTransition("width", "slow"),
          }}
        />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
          {STEPS.map((label, i) => {
            const step = i + 1;
            const done = step < current;
            const active = step === current;
            return (
              <span
                key={label}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "var(--radius-circle)",
                  border: `1.5px solid ${done || active ? "var(--color-gold)" : "var(--color-step-idle)"}`,
                  backgroundColor: done ? "var(--color-gold)" : "var(--color-bg)",
                  color: done ? "var(--color-text-primary)" : active ? "var(--color-gold-on-light)" : "var(--color-text-secondary)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  boxShadow: active ? "0 0 0 4px var(--color-gold-tint)" : "none",
                  transition: cssTransition(["border-color", "background-color", "box-shadow"], "slow"),
                }}
              >
                {done ? <Check size={14} strokeWidth={2.5} style={{ color: "var(--color-text-primary)" }} /> : step}
              </span>
            );
          })}
        </div>
      </div>

      {/* Labels aligned under their circles */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
        {STEPS.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <span
              key={label}
              aria-current={active ? "step" : undefined}
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: active ? 600 : 400,
                color: done || active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                textAlign: i === 0 ? "left" : i === STEPS.length - 1 ? "right" : "center",
                flex: 1,
                transition: cssTransition("color", "slow"),
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
