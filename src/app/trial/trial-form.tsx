"use client";

/**
 * TrialForm — the interactive /trial page. Uses `useActionState` to
 * call the server action, renders per-field validation errors, and
 * swaps into one of three terminal states when the request completes:
 *
 *   verification_sent — Path A success: "check your email"
 *   queued_for_review — Path B success: 4-hour SLA commitment
 *   hard_blocked      — Rule 1 hard block: terminal error surface
 *
 * The visual language mirrors /contact and /product/how-it-works —
 * Navbar + Footer wrapper, soft slate-50 main, card-styled form.
 */

import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Script from "next/script";
import { m } from "framer-motion";
import { Check, Mail, Clock, ArrowLeft, AlertCircle } from "lucide-react";
import { ChoiceGroup } from "@/components/ui/form/choice-group";
import { SearchableSelect } from "@/components/ui/form/searchable-select";
import { ORG_SIZE_OPTIONS, DEFAULT_ORG_SIZE } from "@/lib/org-size";
import { BRAND_COLORS } from "@/lib/brand";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { submitTrialRequest } from "./actions";
import { INITIAL_STATE, type TrialFormState } from "./state";
import { COUNTRIES } from "@/data/countries";
import { TrialStepper } from "./stepper";
import { TrialTimeline } from "./timeline";

// ────────────────────────────────────────────────────────────────────
// Free-email domain list — Option B: nudge, not block.
// Free-email provider list used for the soft nudge below.
// ────────────────────────────────────────────────────────────────────
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "mail.com",
  "gmx.com",
  "gmx.de",
  "yandex.com",
  "yandex.ru",
]);

/** 15-minute window in milliseconds for duplicate-submission detection. */
const RECENT_SUBMISSION_TTL = 15 * 60 * 1000;

interface RecentSubmission {
  email: string;
  submittedAt: number;
}

const RECENT_SUBMISSION_KEY = "avrentis-recent-trial";

function readRecentSubmission(): RecentSubmission | null {
  try {
    const raw = localStorage.getItem(RECENT_SUBMISSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RecentSubmission;
    if (Date.now() - parsed.submittedAt > RECENT_SUBMISSION_TTL) {
      localStorage.removeItem(RECENT_SUBMISSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function persistSubmission(email: string) {
  try {
    localStorage.setItem(
      RECENT_SUBMISSION_KEY,
      JSON.stringify({ email, submittedAt: Date.now() }),
    );
  } catch {
    // localStorage unavailable — silently skip.
  }
}

// Role — tappable cards. Ordered likeliest-first, but NOT pre-selected and NOT
// badged, so the qualifying signal stays honest (an explicit pick).
const ROLE_OPTIONS = [
  { value: "Finance Manager", label: "Finance Manager" },
  { value: "Finance Director", label: "Finance Director" },
  { value: "CFO", label: "CFO" },
  { value: "Operations Manager", label: "Operations Manager" },
  { value: "MD", label: "MD / CEO" },
  { value: "Other", label: "Other" },
];

// Org-size options + default come from the shared SSOT (@/lib/org-size).

const sans = "var(--font-sans)";

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
  fontSize: "14px",
  color: "#0f172a",
  width: "100%",
  height: "42px",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "0 14px",
  backgroundColor: "#FFFFFF",
};

const errorStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "12px",
  color: "#b91c1c",
  marginTop: "6px",
  display: "block",
};

/** Muted hint below a field — not a validation error. */
const hintStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "12px",
  color: "#64748b",
  marginTop: "5px",
  display: "block",
};

function SubmitButton({ isValid }: { isValid: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || !isValid;
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        fontFamily: sans,
        fontWeight: 600,
        fontSize: "14px",
        backgroundColor: disabled ? "var(--color-gold-hover)" : "var(--color-gold)",
        color: "#0f172a",
        border: "none",
        borderRadius: "9999px",
        padding: "0 24px",
        height: "44px",
        display: "inline-flex",
        alignItems: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {pending ? "Sending…" : "Start my trial →"}
    </button>
  );
}

export function TrialForm() {
  const [state, action] = useActionState<TrialFormState, FormData>(
    submitTrialRequest,
    INITIAL_STATE,
  );

  // ── Duplicate-submission detection ──────────────────────────────
  const [recentSubmission, setRecentSubmission] = useState<RecentSubmission | null>(null);
  // Read from localStorage once on mount (browser-only API).
  useEffect(() => {
    setRecentSubmission(readRecentSubmission());
  }, []);

  // ── Controlled field state ──────────────────────────────────────────
  // Email: controlled for free-email hint + dupe check.
  const [emailValue, setEmailValue] = useState("");
  // Remaining required fields lifted to state for validity computation.
  const [nameValue, setNameValue] = useState("");
  const [organisationValue, setOrganisationValue] = useState("");
  const [roleValue, setRoleValue] = useState("");
  const [roleOtherValue, setRoleOtherValue] = useState("");
  const [orgSizeValue, setOrgSizeValue] = useState(DEFAULT_ORG_SIZE);
  // country defaults to "NG" which is a valid selection.
  const [countryValue, setCountryValue] = useState("NG");
  const [consentValue, setConsentValue] = useState(false);

  // Two-step split: step 1 is the quick tappable setup (role/size/country,
  // all defaulted except role), step 2 collects contact details. Leading with
  // taps builds momentum before the commitment of typing (IKEA + goal-gradient).
  const [step, setStep] = useState<1 | 2>(1);
  // "Other" must be spelled out — otherwise the qualifying signal is lost.
  const step1Valid =
    roleValue !== "" &&
    orgSizeValue !== "" &&
    countryValue !== "" &&
    (roleValue !== "Other" || roleOtherValue.trim().length > 0);

  // ── Cloudflare Turnstile (bot defence) — same optional pattern as contact ──
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

  // ── Validity derivation ─────────────────────────────────────────────
  const isValid = useMemo(
    () =>
      nameValue.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) &&
      organisationValue.trim().length > 0 &&
      roleValue !== "" &&
      orgSizeValue !== "" &&
      countryValue !== "" &&
      consentValue === true,
    [nameValue, emailValue, organisationValue, roleValue, orgSizeValue, countryValue, consentValue],
  );

  // ── Persist to localStorage when a successful submission completes ──
  useEffect(() => {
    if (
      state.status === "verification_sent" ||
      state.status === "queued_for_review"
    ) {
      const submittedEmail =
        state.status === "verification_sent" ? state.email : emailValue;
      if (submittedEmail) {
        persistSubmission(submittedEmail);
        setRecentSubmission({ email: submittedEmail, submittedAt: Date.now() });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  if (state.status === "verification_sent") {
    return <VerificationSentCard email={state.email} message={state.message} />;
  }

  if (state.status === "queued_for_review") {
    return <QueuedCard message={state.message} email={emailValue || undefined} />;
  }

  if (state.status === "hard_blocked" || state.status === "auto_rejected") {
    return <HardBlockedCard message={state.message} />;
  }

  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  // ── Free-email hint ─────────────────────────────────────────────
  const emailDomain = emailValue.includes("@")
    ? emailValue.split("@").pop()?.toLowerCase() ?? ""
    : "";
  const showFreeEmailHint = emailDomain !== "" && FREE_EMAIL_DOMAINS.has(emailDomain);

  // ── Duplicate-submission warning ────────────────────────────────
  const showDuplicateWarning = recentSubmission !== null;

  return (
    <>
      {/* Page intro — centered header. The reassurance line sits as a
          subheading under the H1. */}
      <m.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={fadeUpTransition}
        style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 44px" }}
      >
        <span
          style={{
            fontFamily: sans,
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-gold-on-light)",
            display: "block",
            marginBottom: "14px",
          }}
        >
          30-DAY TRIAL
        </span>
        <h1
          style={{
            fontFamily: sans,
            fontWeight: 400,
            fontSize: "32px",
            color: "#0f172a",
            lineHeight: 1.2,
            margin: "0 0 12px",
            letterSpacing: "0.01em",
          }}
          className="lg:!text-[40px]"
        >
          Start your 30-day trial.
        </h1>
        <p
          style={{
            fontFamily: sans,
            fontWeight: 400,
            fontSize: "19px",
            color: "#334155",
            lineHeight: 1.45,
            margin: "0 0 14px",
          }}
        >
          No surprises. You&rsquo;ll always know what&rsquo;s next.
        </p>
        <p
          style={{
            fontFamily: sans,
            fontSize: "15px",
            color: "#64748b",
            lineHeight: 1.7,
            margin: "0 auto",
            maxWidth: "560px",
          }}
        >
          Full Business features on your own data — a 5-seat pilot workspace (5
          users, 2 GB storage, 25 SMS/WhatsApp messages during the trial). No
          credit card. Most teams run their first sanction within fifteen
          minutes.
        </p>
      </m.div>

      <TrialStepper current={step + 1} />
      <m.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={fadeUpTransition}
        style={{ display: "grid", columnGap: "48px", rowGap: "40px", alignItems: "start" }}
        className="grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_1.2fr]"
      >
      {/* Form — first on mobile; right column on desktop */}
      <m.form
        action={action}
        className="order-1 lg:order-none lg:col-start-2 lg:row-start-1"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={staggerDelay(2)}
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          // Focal action card: lift it off the page and pin it beside the
          // taller left-hand narrative as the visitor scrolls.
          boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 18px 44px rgba(15,23,42,0.07)",
          position: "sticky",
          top: "88px",
          alignSelf: "start",
        }}
        noValidate
      >
        {/* Honeypot — hidden; real users never fill it in. */}
        <input
          type="text"
          name="fax_number"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
        />
        {/* Back to step 1 — the stepper above conveys the position. */}
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{ alignSelf: "flex-start", fontFamily: sans, fontSize: "13px", fontWeight: 500, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "2px" }}
          >
            ← Back
          </button>
        )}

        {/* ── Step 1: setup — tappable, already defaulted ─────────────── */}
        <div style={{ display: step === 1 ? "flex" : "none", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={labelStyle}>
              Your role
              <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">*</span>
            </label>
            <ChoiceGroup
              name="role"
              variant="cards"
              columns={2}
              value={roleValue}
              onChange={setRoleValue}
              options={ROLE_OPTIONS}
              ariaLabel="Your role"
              invalid={!!fieldErrors?.role}
            />
            {fieldErrors?.role ? (
              <span style={errorStyle}>{fieldErrors.role}</span>
            ) : (
              <span style={hintStyle}>
                Helps us tailor your setup. You&apos;ll configure team roles after signing in.
              </span>
            )}
            {roleValue === "Other" && (
              <div style={{ marginTop: "10px" }}>
                <label style={labelStyle}>
                  Specify your role
                  <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  name="roleOther"
                  value={roleOtherValue}
                  onChange={(e) => setRoleOtherValue(e.target.value)}
                  placeholder="Tell us your role"
                  aria-label="Specify your role"
                  aria-required="true"
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>
              Organisation size
              <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">*</span>
            </label>
            <div style={{ marginTop: "8px" }}>
              <ChoiceGroup
                name="orgSize"
                variant="chips"
                value={orgSizeValue}
                onChange={setOrgSizeValue}
                options={ORG_SIZE_OPTIONS}
                ariaLabel="Organisation size"
                invalid={!!fieldErrors?.orgSize}
              />
            </div>
            {fieldErrors?.orgSize && <span style={errorStyle}>{fieldErrors.orgSize}</span>}
          </div>

          <div>
            <label style={labelStyle}>
              Country
              <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">*</span>
            </label>
            <SearchableSelect
              name="country"
              value={countryValue}
              onChange={setCountryValue}
              options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
              ariaLabel="Country"
              placeholder="Search for your country…"
              invalid={!!fieldErrors?.country}
            />
            {fieldErrors?.country && <span style={errorStyle}>{fieldErrors.country}</span>}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => step1Valid && setStep(2)}
              disabled={!step1Valid}
              style={{
                fontFamily: sans,
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: step1Valid ? "var(--color-gold)" : "var(--color-gold-hover)",
                color: "#0f172a",
                border: "none",
                borderRadius: "9999px",
                padding: "0 24px",
                height: "44px",
                cursor: step1Valid ? "pointer" : "not-allowed",
                opacity: step1Valid ? 1 : 0.6,
              }}
            >
              Continue →
            </button>
            <span style={{ fontFamily: sans, fontSize: "12px", color: "#64748b" }}>
              No card required · about a minute
            </span>
          </div>
        </div>

        {/* ── Step 2: your details ────────────────────────────────────── */}
        <div style={{ display: step === 2 ? "flex" : "none", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "grid", gap: "14px" }} className="grid-cols-1 md:grid-cols-2">
          <div>
            <label htmlFor="name" style={labelStyle}>
              Full name
              <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: fieldErrors?.name ? "#b91c1c" : "#e2e8f0",
              }}
            />
            {fieldErrors?.name && <span style={errorStyle}>{fieldErrors.name}</span>}
          </div>
          <div>
            <label htmlFor="email" style={labelStyle}>
              Work email
              <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: fieldErrors?.email ? "#b91c1c" : "#e2e8f0",
              }}
            />
            {fieldErrors?.email && <span style={errorStyle}>{fieldErrors.email}</span>}
            {/* Free-email nudge — shown when domain matches a personal provider.
                Not a block; the submit button remains enabled. */}
            {showFreeEmailHint && !fieldErrors?.email && (
              <span style={hintStyle}>
                Tip: work emails get the fastest setup. Personal emails work too.
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="organisation" style={labelStyle}>
            Organisation
            <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">*</span>
          </label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            required
            autoComplete="organization"
            value={organisationValue}
            onChange={(e) => setOrganisationValue(e.target.value)}
            style={{
              ...inputStyle,
              borderColor: fieldErrors?.organisation ? "#b91c1c" : "#e2e8f0",
            }}
          />
          {fieldErrors?.organisation && (
            <span style={errorStyle}>{fieldErrors.organisation}</span>
          )}
        </div>

        <div>
          <label htmlFor="source" style={labelStyle}>
            How did you hear about us? (optional)
          </label>
          <input
            id="source"
            name="source"
            type="text"
            style={inputStyle}
            placeholder="Referral, search, colleague, event…"
          />
        </div>

        <div>
          <label
            htmlFor="consent"
            style={{
              fontFamily: sans,
              fontSize: "13px",
              color: "#334155",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              cursor: "pointer",
              lineHeight: 1.55,
            }}
          >
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              checked={consentValue}
              onChange={(e) => setConsentValue(e.target.checked)}
              style={{ marginTop: "3px", accentColor: "var(--color-gold)", width: "16px", height: "16px" }}
            />
            <span>
              I agree that Avrentis may use the details above to provision and run my trial
              workspace, in line with the{" "}
              <Link href="/privacy" style={{ color: "var(--color-gold-on-light)", textDecoration: "none" }}>
                privacy policy
              </Link>
              .{" "}
              <span style={{ color: "#dc2626" }} aria-hidden="true">*</span>
            </span>
          </label>
          {fieldErrors?.consent && <span style={errorStyle}>{fieldErrors.consent}</span>}
        </div>

        {state.status === "error" && !state.fieldErrors && state.message && (
          <div
            role="alert"
            style={{
              fontFamily: sans,
              fontSize: "13px",
              color: "#b91c1c",
              backgroundColor: "rgba(185,28,28,0.06)",
              border: "1px solid rgba(185,28,28,0.2)",
              borderRadius: "6px",
              padding: "10px 12px",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle size={14} strokeWidth={2} style={{ marginTop: "2px", flexShrink: 0 }} />
            <span>{state.message}</span>
          </div>
        )}

        {/* Duplicate-submission warning — informational, not blocking. */}
        {showDuplicateWarning && (
          <div
            role="status"
            aria-live="polite"
            style={{
              fontFamily: sans,
              fontSize: "13px",
              color: "#92400e",
              backgroundColor: "rgba(217,119,6,0.07)",
              border: "1px solid rgba(217,119,6,0.25)",
              borderRadius: "6px",
              padding: "10px 12px",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle
              size={14}
              strokeWidth={2}
              color="#b45309"
              style={{ marginTop: "2px", flexShrink: 0 }}
              aria-hidden="true"
            />
            <span>
              We already received a request from this browser at{" "}
              <strong style={{ color: "#78350f" }}>{recentSubmission!.email}</strong> a few minutes
              ago. Check that inbox first — the verification link expires in 30 minutes.
            </span>
          </div>
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

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <SubmitButton isValid={isValid} />
          <span style={{ fontFamily: sans, fontSize: "12px", color: "#64748b" }}>
            No card on file — nothing to cancel · 30-day trial · Data preserved for 30 days after trial end.
          </span>
        </div>
        </div>
      </m.form>

      {/* Timeline — after the form on mobile; left column on desktop */}
      <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1">
        <TrialTimeline />
      </div>
      </m.div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────
// Terminal-state cards
// ────────────────────────────────────────────────────────────────────

function VerificationSentCard({ email, message }: { email: string; message: string }) {
  return (
    <>
      <TrialStepper current={4} />
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "48px 40px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "rgba(var(--color-gold-rgb), 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Mail size={26} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
      </div>
      <h2
        style={{
          fontFamily: sans,
          fontWeight: 500,
          fontSize: "22px",
          color: "#0f172a",
          margin: 0,
        }}
      >
        Check your email.
      </h2>
      <p
        style={{
          fontFamily: sans,
          fontSize: "15px",
          color: "#64748b",
          lineHeight: 1.65,
          margin: 0,
          maxWidth: "420px",
        }}
      >
        We sent a verification link to{" "}
        <strong style={{ color: "#0f172a" }}>{email}</strong>. Check your inbox —
        it expires in 30 minutes.
      </p>
      <p
        style={{
          fontFamily: sans,
          fontSize: "14px",
          color: "#475569",
          lineHeight: 1.65,
          margin: 0,
          maxWidth: "420px",
        }}
      >
        {message}
      </p>
      <p style={{ fontFamily: sans, fontSize: "12px", color: "#64748b", marginTop: "12px" }}>
        <Clock
          size={11}
          strokeWidth={2}
          style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }}
          aria-hidden="true"
        />
        If the link expires, the page you land on will let you request a new
        one — no need to fill in the form again.
      </p>
    </div>
    </>
  );
}

function QueuedCard({ message, email }: { message: string; email?: string }) {
  return (
    <>
      <TrialStepper current={4} />
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "48px 40px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "rgba(4,120,87,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Check size={26} strokeWidth={2} color="#047857" aria-hidden="true" />
      </div>
      <h2
        style={{
          fontFamily: sans,
          fontWeight: 500,
          fontSize: "22px",
          color: "#0f172a",
          margin: 0,
        }}
      >
        Request received.
      </h2>
      {email && (
        <p
          style={{
            fontFamily: sans,
            fontSize: "14px",
            color: "#475569",
            lineHeight: 1.65,
            margin: 0,
            maxWidth: "440px",
          }}
        >
          We&rsquo;ll be in touch at{" "}
          <strong style={{ color: "#0f172a" }}>{email}</strong>.
        </p>
      )}
      <p
        style={{
          fontFamily: sans,
          fontSize: "15px",
          color: "#64748b",
          lineHeight: 1.65,
          margin: 0,
          maxWidth: "440px",
        }}
      >
        {message}
      </p>
      <Link
        href="/"
        style={{
          fontFamily: sans,
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--color-gold-on-light)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "8px",
        }}
      >
        <ArrowLeft size={14} strokeWidth={1.8} aria-hidden="true" />
        Back to home
      </Link>
    </div>
    </>
  );
}

function HardBlockedCard({ message }: { message: string }) {
  return (
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "48px 40px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "rgba(185,28,28,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AlertCircle size={26} strokeWidth={1.8} color="#b91c1c" aria-hidden="true" />
      </div>
      <h2
        style={{
          fontFamily: sans,
          fontWeight: 500,
          fontSize: "20px",
          color: "#0f172a",
          margin: 0,
        }}
      >
        Trial already used.
      </h2>
      <p
        style={{
          fontFamily: sans,
          fontSize: "14px",
          color: "#64748b",
          lineHeight: 1.65,
          margin: 0,
          maxWidth: "420px",
        }}
      >
        {message}
      </p>
      <Link
        href="/contact?intent=demo"
        style={{
          fontFamily: sans,
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--color-gold-on-light)",
          textDecoration: "none",
        }}
      >
        Talk to us about your options →
      </Link>
    </div>
  );
}
