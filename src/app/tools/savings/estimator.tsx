"use client";

/**
 * SavingsEstimator — an ungated, interactive calculator (reciprocity: real
 * value before any ask). Results update live on the page with no email
 * required; the email capture below is optional and only sends a copy.
 *
 * All numbers are the visitor's own inputs run through a transparent formula
 * (see ./compute). No proprietary benchmarks appear here.
 */

import { useActionState, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { Check } from "lucide-react";
import { fadeUpOnLoad } from "@/lib/animations";
import { buttonProps } from "@/components/ui/button";
import { currencySymbol, formatCount } from "@/lib/money";
import { BOUNDS, EFFICIENCY, SAVINGS_CURRENCY, clampInt, computeSavings, formatSavings } from "./compute";
import { emailEstimate } from "./actions";
import { INITIAL_STATE } from "./state";
import { describedBy, useServerFieldErrors } from "@/components/ui/form/field-errors";
import { FormAlert } from "@/components/ui/form/form-alert";
import { useHydrated } from "@/components/ui/form/hydrated";
import { TurnstileWidget } from "@/components/ui/form/turnstile-widget";
import { HoneypotField } from "@/components/ui/form/honeypot-field";
import { FORM_LIMITS } from "@/lib/form-rules";
import { CONTACT_EMAIL } from "@/lib/contacts";
import { submitWithoutReset } from "@/components/ui/form/submit";
import { useFocusAfterFailure } from "@/components/ui/form/focus-after-failure";
import { TRIAL_LENGTH, NO_CARD_REQUIRED } from "@/lib/trial-terms";
import { BRAND, LEGAL_PAGES, SITE_PAGES } from "@/lib/brand";

const pct = Math.round(EFFICIENCY * 100);

const labelStyle: React.CSSProperties = {
  fontSize: "var(--text-xs)",
  fontWeight: 500,
  color: "var(--color-text-primary)",
  letterSpacing: "0.02em",
  display: "block",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  fontSize: "var(--text-lg)",
  color: "var(--color-text-primary)",
  width: "100%",
  height: "44px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-card)",
  padding: "0 14px",
  backgroundColor: "var(--color-white)",
};

const hintStyle: React.CSSProperties = {
  fontSize: "var(--text-xs)",
  color: "var(--color-text-muted)",
  marginTop: "5px",
  display: "block",
};


function NumberField({
  id,
  label,
  hint,
  prefix,
  value,
  onChange,
  onBlur,
  readOnly,
}: {
  id: string;
  label: string;
  hint: string;
  prefix?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  /** Read-only until the page runs script: without it nothing recalculates. */
  readOnly: boolean;
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
              fontSize: "var(--text-lg)",
              color: "var(--color-text-muted)",
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
          readOnly={readOnly}
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
        backgroundColor: featured ? "var(--color-navy-primary)" : "var(--color-white)",
        border: featured ? "1px solid var(--color-gold-border)" : "1px solid var(--color-border)",
        borderRadius: "var(--radius-xl)",
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: featured ? "var(--text-heading-xl)" : "var(--text-heading-md)",
          color: featured ? "var(--color-gold)" : "var(--color-text-primary)",
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "var(--text-xs)",
          color: featured ? "var(--color-text-subtle)" : "var(--color-text-muted)",
          marginTop: "6px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SubmitButton({ disabled, pending }: { disabled: boolean; pending: boolean }) {
  const off = pending || disabled;
  return (
    <button
      type="submit"
      disabled={off}
      {...buttonProps({ size: "md", disabled: off, style: { flexShrink: 0 } })}
    >
      {pending ? "Sending…" : "Email it to me"}
    </button>
  );
}

/** The one message line under the form — a field's error or the form's. */
const ESTIMATE_ERROR_ID = "estimate-form-error";

export function SavingsEstimator() {
  const [approvalsStr, setApprovalsStr] = useState(String(BOUNDS.approvals.default));
  const [minutesStr, setMinutesStr] = useState(String(BOUNDS.minutes.default));
  const [costStr, setCostStr] = useState(String(BOUNDS.cost.default));

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

  const [state, action, isPending] = useActionState(emailEstimate, INITIAL_STATE);
  const hydrated = useHydrated();
  // A refusal hands back what was posted. Fields start from it, which only
  // matters for a page rendered without JavaScript (with it, state persists).
  const posted = state.status === "error" ? (state.values ?? {}) : {};
  const [consent, setConsent] = useState(posted.consent === "on");
  // A server error steps aside once its field is edited (field-errors.ts).
  const { errors: fieldErrors, clear: clearFieldError } = useServerFieldErrors(state.fieldErrors);
  const fieldError = fieldErrors.email ?? fieldErrors.consent;
  // After a failed send, focus the field in error, else the message line.
  const formRef = useRef<HTMLFormElement>(null);
  useFocusAfterFailure(formRef, state, state.status === "error", ESTIMATE_ERROR_ID);

  return (
    <m.div
      {...fadeUpOnLoad()}
      style={{ display: "grid", gap: "40px", alignItems: "start" }}
      className="grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1.1fr]"
    >
      {/* Left — inputs */}
      <div
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-2xl)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <noscript>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
            The calculator needs JavaScript to work with your own numbers. Without it, the estimate
            below uses these typical figures, and that is the estimate we email you.
          </p>
        </noscript>
        <NumberField
          id="approvals"
          label="Approvals your team runs each month"
          hint="Payment vouchers, POs, reimbursements — anything that needs a sign-off."
          value={approvalsStr}
          onChange={setApprovalsStr}
          onBlur={snap(approvalsStr, "approvals", setApprovalsStr)}
          readOnly={!hydrated}
        />
        <NumberField
          id="minutes"
          label="Minutes spent coordinating each one today"
          hint="Chasing sign-offs, forwarding emails, re-sending attachments."
          value={minutesStr}
          onChange={setMinutesStr}
          onBlur={snap(minutesStr, "minutes", setMinutesStr)}
          readOnly={!hydrated}
        />
        <NumberField
          id="cost"
          label="Loaded cost per hour"
          prefix={currencySymbol(SAVINGS_CURRENCY)}
          hint="A rough blended rate for the people involved. Your number."
          value={costStr}
          onChange={setCostStr}
          onBlur={snap(costStr, "cost", setCostStr)}
          readOnly={!hydrated}
        />
      </div>

      {/* Right — results + email capture */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{ display: "grid", gap: "12px" }}
          className="grid-cols-1 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <StatTile value={`${formatSavings(result.moneyPerYear)} / yr`} label="Estimated cost recovered per year" featured />
          </div>
          <StatTile value={`${formatCount(result.hoursPerMonth)} hrs`} label="Time back per month" />
          <StatTile value={`${formatCount(result.hoursPerYear)} hrs`} label="Time back per year" />
        </div>

        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6, margin: 0 }}>
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
              backgroundColor: "var(--color-success-wash)",
              border: "1px solid var(--color-success-border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <Check size={18} strokeWidth={2.2} style={{ color: "var(--color-success)" }} aria-hidden="true" />
            <span style={{ fontSize: "var(--text-md)", color: "var(--color-text-primary)" }}>
              {state.message}
            </span>
          </div>
        ) : (
          <form
            ref={formRef}
            action={action}
            onSubmit={submitWithoutReset(action)}
            style={{
              backgroundColor: "var(--color-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-2xl)",
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            noValidate
          >
            <span style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-text-primary)" }}>
              Want a copy? We&rsquo;ll email your {formatSavings(result.moneyPerYear)}/yr estimate — no sales call required.
            </span>

            {/* Server recomputes from these; hidden so the emailed copy matches. */}
            <input type="hidden" name="approvals" value={inputs.approvals} />
            <input type="hidden" name="minutes" value={inputs.minutes} />
            <input type="hidden" name="cost" value={inputs.cost} />
            <HoneypotField />

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={posted.email}
                required
                maxLength={FORM_LIMITS.email}
                autoComplete="email"
                placeholder="you@company.com"
                aria-label="Your email"
                aria-invalid={!!fieldErrors.email || undefined}
                aria-describedby={describedBy(!!fieldErrors.email && ESTIMATE_ERROR_ID)}
                onChange={() => clearFieldError("email")}
                style={{ ...inputStyle, flex: 1, minWidth: "200px" }}
              />
              <SubmitButton disabled={hydrated && !consent} pending={isPending} />
            </div>

            <label
              htmlFor="consent"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-body)",
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
                aria-invalid={!!fieldErrors.consent || undefined}
                aria-describedby={describedBy(!!fieldErrors.consent && ESTIMATE_ERROR_ID)}
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  clearFieldError("consent");
                }}
                style={{ marginTop: "2px", accentColor: "var(--color-gold)", width: "15px", height: "15px" }}
              />
              <span>
                Email me this estimate and occasional {BRAND.name} updates, per the{" "}
                <Link href={LEGAL_PAGES.privacy} style={{ color: "var(--color-gold-on-light)", textDecoration: "none" }}>
                  privacy policy
                </Link>
                .
              </span>
            </label>

            {(fieldError || (state.status === "error" && !state.fieldErrors && state.message)) && (
              <FormAlert
                id={ESTIMATE_ERROR_ID}
                pending={isPending}
                style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}
              >
                {fieldError ?? state.message}
              </FormAlert>
            )}

            <TurnstileWidget fallbackEmail={CONTACT_EMAIL.general} />
          </form>
        )}

        <Link
          href={SITE_PAGES.trial()}
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--color-gold-on-light)",
            textDecoration: "none",
            marginTop: "2px",
          }}
        >
          Or just start the {TRIAL_LENGTH} trial &mdash; {NO_CARD_REQUIRED}, nothing to cancel &rarr;
        </Link>
      </div>
    </m.div>
  );
}
