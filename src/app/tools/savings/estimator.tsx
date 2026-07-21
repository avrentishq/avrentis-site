"use client";

/**
 * SavingsEstimator — an ungated, interactive calculator (reciprocity: real
 * value before any ask). Results update live on the page with no email
 * required; the email capture below is optional and only sends a copy.
 *
 * All numbers are the visitor's own inputs run through a transparent formula
 * (see ./compute). No proprietary benchmarks appear here.
 */

import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Script from "next/script";
import Link from "next/link";
import { m } from "framer-motion";
import { Check } from "lucide-react";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { BOUNDS, EFFICIENCY, clampInt, computeSavings } from "./compute";
import { emailEstimate } from "./actions";
import { INITIAL_STATE } from "./state";

const sans = "var(--font-sans)";
const pct = Math.round(EFFICIENCY * 100);

const labelStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "12px",
  fontWeight: 500,
  color: "#0f172a",
  letterSpacing: "0.02em",
  display: "block",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "15px",
  color: "#0f172a",
  width: "100%",
  height: "44px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "0 14px",
  backgroundColor: "#FFFFFF",
};

const hintStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "12px",
  color: "#64748b",
  marginTop: "5px",
  display: "block",
};

const nairaFmt = (n: number) => `₦${Math.round(n).toLocaleString()}`;
const hrsFmt = (n: number) => Math.round(n).toLocaleString();

function NumberField({
  id,
  label,
  hint,
  prefix,
  value,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  hint: string;
  prefix?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {prefix && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: sans,
              fontSize: "15px",
              color: "#64748b",
            }}
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={id}
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          style={{ ...inputStyle, paddingLeft: prefix ? "30px" : "14px" }}
        />
      </div>
      <span style={hintStyle}>{hint}</span>
    </div>
  );
}

function StatTile({
  value,
  label,
  featured = false,
}: {
  value: string;
  label: string;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: featured ? "#0f172a" : "#FFFFFF",
        border: featured ? "1px solid rgba(var(--color-gold-rgb), 0.3)" : "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: featured ? "30px" : "24px",
          color: featured ? "var(--color-gold)" : "#0f172a",
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: sans,
          fontSize: "12px",
          color: featured ? "#94a3b8" : "#64748b",
          marginTop: "6px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const off = pending || disabled;
  return (
    <button
      type="submit"
      disabled={off}
      style={{
        fontFamily: sans,
        fontWeight: 600,
        fontSize: "14px",
        backgroundColor: off ? "var(--color-gold-hover)" : "var(--color-gold)",
        color: "#0f172a",
        border: "none",
        borderRadius: "9999px",
        padding: "0 22px",
        height: "44px",
        cursor: off ? "not-allowed" : "pointer",
        opacity: off ? 0.6 : 1,
        flexShrink: 0,
        transition: "background-color 150ms ease",
      }}
    >
      {pending ? "Sending…" : "Email it to me"}
    </button>
  );
}

export function SavingsEstimator() {
  const [approvalsStr, setApprovalsStr] = useState(String(BOUNDS.approvals.default));
  const [minutesStr, setMinutesStr] = useState(String(BOUNDS.minutes.default));
  const [costStr, setCostStr] = useState(String(BOUNDS.cost.default));
  const [consent, setConsent] = useState(false);

  const inputs = useMemo(
    () => ({
      approvals: clampInt(approvalsStr, BOUNDS.approvals),
      minutes: clampInt(minutesStr, BOUNDS.minutes),
      cost: clampInt(costStr, BOUNDS.cost),
    }),
    [approvalsStr, minutesStr, costStr],
  );
  const result = useMemo(() => computeSavings(inputs), [inputs]);

  // Snap a field to its clamped value on blur so the shown number matches the
  // number used in the calculation.
  const snap = (raw: string, key: keyof typeof BOUNDS, set: (v: string) => void) => () =>
    set(String(clampInt(raw, BOUNDS[key])));

  const [state, action] = useActionState(emailEstimate, INITIAL_STATE);

  // Cloudflare Turnstile — same optional pattern as the contact form.
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileRendered = useRef(false);
  const renderTurnstile = useCallback(() => {
    if (!turnstileSiteKey || turnstileRendered.current || !turnstileRef.current) return;
    const turnstile = (
      window as unknown as {
        turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => void };
      }
    ).turnstile;
    if (!turnstile) return;
    turnstile.render(turnstileRef.current, { sitekey: turnstileSiteKey, theme: "light" });
    turnstileRendered.current = true;
  }, [turnstileSiteKey]);
  useEffect(() => {
    renderTurnstile();
  }, [renderTurnstile]);

  return (
    <m.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={fadeUpTransition}
      style={{ display: "grid", gap: "40px", alignItems: "start" }}
      className="grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1.1fr]"
    >
      {/* Left — inputs */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <NumberField
          id="approvals"
          label="Approvals your team runs each month"
          hint="Payment vouchers, POs, reimbursements — anything that needs a sign-off."
          value={approvalsStr}
          onChange={setApprovalsStr}
          onBlur={snap(approvalsStr, "approvals", setApprovalsStr)}
        />
        <NumberField
          id="minutes"
          label="Minutes spent coordinating each one today"
          hint="Chasing sign-offs, forwarding emails, re-sending attachments."
          value={minutesStr}
          onChange={setMinutesStr}
          onBlur={snap(minutesStr, "minutes", setMinutesStr)}
        />
        <NumberField
          id="cost"
          label="Loaded cost per hour"
          prefix="₦"
          hint="A rough blended rate for the people involved. Your number."
          value={costStr}
          onChange={setCostStr}
          onBlur={snap(costStr, "cost", setCostStr)}
        />
      </div>

      {/* Right — results + email capture */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{ display: "grid", gap: "12px" }}
          className="grid-cols-1 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <StatTile value={`${nairaFmt(result.nairaPerYear)} / yr`} label="Estimated cost recovered per year" featured />
          </div>
          <StatTile value={`${hrsFmt(result.hoursPerMonth)} hrs`} label="Time back per month" />
          <StatTile value={`${hrsFmt(result.hoursPerYear)} hrs`} label="Time back per year" />
        </div>

        <p style={{ fontFamily: sans, fontSize: "12px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
          Assumes structured approvals remove about {pct}% of coordination time — a
          conservative estimate. Every other number is yours.
        </p>

        {/* Email capture */}
        {state.status === "success" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 16px",
              backgroundColor: "rgba(4,120,87,0.07)",
              border: "1px solid rgba(4,120,87,0.20)",
              borderRadius: "10px",
            }}
          >
            <Check size={18} strokeWidth={2.2} color="#047857" aria-hidden="true" />
            <span style={{ fontFamily: sans, fontSize: "14px", color: "#0f172a" }}>
              {state.message}
            </span>
          </div>
        ) : (
          <form
            action={action}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            noValidate
          >
            <span style={{ fontFamily: sans, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
              Want a copy? We&rsquo;ll email your {nairaFmt(result.nairaPerYear)}/yr estimate — no sales call required.
            </span>

            {/* Server recomputes from these; hidden so the emailed copy matches. */}
            <input type="hidden" name="approvals" value={inputs.approvals} />
            <input type="hidden" name="minutes" value={inputs.minutes} />
            <input type="hidden" name="cost" value={inputs.cost} />
            {/* Honeypot */}
            <input
              type="text"
              name="fax_number"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
            />

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                aria-label="Your email"
                style={{ ...inputStyle, flex: 1, minWidth: "200px" }}
              />
              <SubmitButton disabled={!consent} />
            </div>

            <label
              htmlFor="consent"
              style={{
                fontFamily: sans,
                fontSize: "12px",
                color: "#334155",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                cursor: "pointer",
                lineHeight: 1.5,
              }}
            >
              <input
                id="consent"
                name="consent"
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: "2px", accentColor: "var(--color-gold)", width: "15px", height: "15px" }}
              />
              <span>
                Email me this estimate and occasional Avrentis updates, per the{" "}
                <Link href="/privacy" style={{ color: "var(--color-gold-on-light)", textDecoration: "none" }}>
                  privacy policy
                </Link>
                .
              </span>
            </label>

            {(state.fieldError || (state.status === "error" && state.message)) && (
              <span style={{ fontFamily: sans, fontSize: "12px", color: "#b91c1c" }}>
                {state.fieldError ?? state.message}
              </span>
            )}

            {turnstileSiteKey && (
              <>
                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                  strategy="afterInteractive"
                  onReady={renderTurnstile}
                />
                <div ref={turnstileRef} />
              </>
            )}
          </form>
        )}

        <Link
          href="/trial"
          style={{
            fontFamily: sans,
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-gold-on-light)",
            textDecoration: "none",
            marginTop: "2px",
          }}
        >
          Or just start the 30-day trial &mdash; no card, nothing to cancel &rarr;
        </Link>
      </div>
    </m.div>
  );
}
