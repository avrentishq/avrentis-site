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

const STEPS = ["Started", "Your setup", "Your details"];
const sans = "var(--font-sans)";

interface TrialStepperProps {
  current: number;
}

export function TrialStepper({ current }: TrialStepperProps) {
  const pct = Math.round(((current - 1) / STEPS.length) * 100);

  return (
    <div style={{ margin: "0 auto 36px", maxWidth: "480px" }}>
      {/* Header: label + live percentage */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
        <span style={{ fontFamily: sans, fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#64748b" }}>
          Your progress
        </span>
        <span style={{ fontFamily: sans, fontSize: "12px", fontWeight: 600, color: "var(--color-gold-on-light)" }}>
          {pct}% complete
        </span>
      </div>

      {/* Track + circles: the track is the progress bar; circles ride on it */}
      <div style={{ position: "relative", height: "28px" }} aria-hidden="true">
        <div style={{ position: "absolute", top: "12px", left: "14px", right: "14px", height: "4px", backgroundColor: "#e2e8f0", borderRadius: "9999px" }} />
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "14px",
            width: `calc((100% - 28px) * ${pct / 100})`,
            height: "4px",
            backgroundColor: "var(--color-gold)",
            borderRadius: "9999px",
            transition: "width 320ms ease",
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
                  borderRadius: "50%",
                  border: `1.5px solid ${done || active ? "var(--color-gold)" : "#d8dee7"}`,
                  backgroundColor: done ? "var(--color-gold)" : "#f1f5f9",
                  color: done ? "#0f172a" : active ? "var(--color-gold-on-light)" : "#94a3b8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: sans,
                  fontSize: "12px",
                  fontWeight: 600,
                  boxShadow: active ? "0 0 0 4px rgba(var(--color-gold-rgb), 0.12)" : "none",
                  transition: "border-color 320ms ease, background-color 320ms ease, box-shadow 320ms ease",
                }}
              >
                {done ? <Check size={14} strokeWidth={2.5} color="#0f172a" /> : step}
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
                fontFamily: sans,
                fontSize: "12px",
                fontWeight: active ? 600 : 400,
                color: done || active ? "#0f172a" : "#94a3b8",
                textAlign: i === 0 ? "left" : i === STEPS.length - 1 ? "right" : "center",
                flex: 1,
                transition: "color 320ms ease",
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
