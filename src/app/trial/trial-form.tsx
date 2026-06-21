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

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Mail, Clock, ArrowLeft, AlertCircle } from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { submitTrialRequest } from "./actions";
import { INITIAL_STATE, type TrialFormState } from "./state";
import { COUNTRIES } from "@/data/countries";

// ────────────────────────────────────────────────────────────────────
// Free-email domain list — Option B: nudge, not block.
// Keep in sync with avrentis-app's free-email guard if it grows.
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

const ROLES = [
  "CFO",
  "Finance Director",
  "MD",
  "Finance Manager",
  "Operations Manager",
  "Other",
];

const SIZES = ["1–20", "21–50", "51–200", "200+"];

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
  outline: "none",
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
        borderRadius: "6px",
        padding: "0 22px",
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
  const [orgSizeValue, setOrgSizeValue] = useState("");
  // country defaults to "NG" which is a valid selection.
  const [countryValue, setCountryValue] = useState("NG");
  const [consentValue, setConsentValue] = useState(false);

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
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={fadeUpTransition}
      style={{ display: "grid", gap: "48px", alignItems: "start" }}
      className="grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_1.2fr]"
    >
      {/* Left — intent copy */}
      <div>
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
            color: "var(--color-gold-on-light)",
            display: "block",
            marginBottom: "16px",
          }}
        >
          14-DAY TRIAL
        </motion.span>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={staggerDelay(1)}
          style={{
            fontFamily: sans,
            fontWeight: 400,
            fontSize: "32px",
            color: "#0f172a",
            lineHeight: 1.2,
            margin: "0 0 16px",
            letterSpacing: "0.01em",
          }}
          className="lg:!text-[40px]"
        >
          Start your 14-day Avrentis trial.
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={staggerDelay(2)}
          style={{
            fontFamily: sans,
            fontSize: "15px",
            color: "#64748b",
            lineHeight: 1.75,
            margin: "0 0 24px",
          }}
        >
          Full Business tier. No credit card. Your organisation&rsquo;s data, not
          a demo environment. Most teams have their first sanction inside the
          platform within fifteen minutes of submitting this form.
        </motion.p>
        <motion.ul
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={staggerDelay(3)}
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {[
            "You'll receive a verification email within 30 seconds.",
            "Click the link and your workspace is provisioned in under a minute.",
            "Your first approval is already waiting — sanction it to see the full loop.",
            "Data is preserved for 30 days after trial end if you decide not to upgrade.",
          ].map((line) => (
            <li
              key={line}
              style={{
                fontFamily: sans,
                fontSize: "13px",
                color: "#334155",
                lineHeight: 1.6,
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
              }}
            >
              <Check
                size={14}
                color={BRAND_COLORS.gold}
                strokeWidth={2.5}
                style={{ marginTop: "3px", flexShrink: 0 }}
                aria-hidden="true"
              />
              <span>{line}</span>
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Right — form */}
      <motion.form
        action={action}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={staggerDelay(2)}
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
        noValidate
      >
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

        <div style={{ display: "grid", gap: "14px" }} className="grid-cols-1 md:grid-cols-2">
          <div>
            <label htmlFor="role" style={labelStyle}>
              Your role
              <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">*</span>
            </label>
            <select
              id="role"
              name="role"
              required
              value={roleValue}
              onChange={(e) => setRoleValue(e.target.value)}
              style={{ ...inputStyle, padding: "0 12px" }}
            >
              <option value="" disabled>
                Choose…
              </option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {fieldErrors?.role && <span style={errorStyle}>{fieldErrors.role}</span>}
            {!fieldErrors?.role && (
              <span style={hintStyle}>
                Helps us tailor your demo. You&apos;ll set up team roles after signing in.
              </span>
            )}
          </div>
          <div>
            <label htmlFor="orgSize" style={labelStyle}>
              Organisation size
              <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">*</span>
            </label>
            <select
              id="orgSize"
              name="orgSize"
              required
              value={orgSizeValue}
              onChange={(e) => setOrgSizeValue(e.target.value)}
              style={{ ...inputStyle, padding: "0 12px" }}
            >
              <option value="" disabled>
                Choose…
              </option>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} employees
                </option>
              ))}
            </select>
            {fieldErrors?.orgSize && <span style={errorStyle}>{fieldErrors.orgSize}</span>}
          </div>
        </div>

        <div>
          <label htmlFor="country" style={labelStyle}>
            Country
            <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">*</span>
          </label>
          <select
            id="country"
            name="country"
            required
            value={countryValue}
            onChange={(e) => setCountryValue(e.target.value)}
            style={{ ...inputStyle, padding: "0 12px" }}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {fieldErrors?.country && <span style={errorStyle}>{fieldErrors.country}</span>}
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

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <SubmitButton isValid={isValid} />
          <span style={{ fontFamily: sans, fontSize: "12px", color: "#94a3b8" }}>
            No credit card required · 14-day trial · Data preserved for 30 days after trial end.
          </span>
        </div>
      </motion.form>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Terminal-state cards
// ────────────────────────────────────────────────────────────────────

function VerificationSentCard({ email, message }: { email: string; message: string }) {
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
      <p style={{ fontFamily: sans, fontSize: "12px", color: "#94a3b8", marginTop: "12px" }}>
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
  );
}

function QueuedCard({ message, email }: { message: string; email?: string }) {
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
