"use client";

/**
 * ContactForm — the interactive half of /contact. Uses `useActionState`
 * to call the server action, shows per-field validation errors, and
 * swaps into a success state without a full page navigation.
 *
 * The form is intent-aware — `?intent=<kind>` query parameters set the
 * intent field and adjust the headline micro-copy. Trial requests live
 * on the dedicated /trial page; this form handles sales, security,
 * legal, privacy, disclosure, careers, feedback, subscribe, and roadmap.
 */

import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Script from "next/script";
import { m } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { ChoiceGroup } from "@/components/ui/form/choice-group";
import { SearchableSelect } from "@/components/ui/form/searchable-select";
import { ORG_SIZE_OPTIONS } from "@/lib/org-size";
import { COUNTRIES } from "@/data/countries";
import { submitContact } from "@/app/contact/actions";
import {
  INITIAL_STATE,
  type ContactFormState,
  type ContactIntent,
} from "@/app/contact/state";
import { CONTACT_TABS, tabForIntent } from "@/app/contact/tabs";

interface IntentCopy {
  eyebrow: string;
  headline: string;
  lede: string;
  cta: string;
}

const INTENT_COPY: Record<ContactIntent, IntentCopy> = {
  demo: {
    eyebrow: "CONTACT US",
    headline: "Talk to our team.",
    lede:
      "Tell us what you're evaluating or what you need — a walkthrough, a question, or a use case. A real person replies within one business day.",
    cta: "Contact us",
  },
  security: {
    eyebrow: "SECURITY REVIEW",
    headline: "Talk to us about the security posture.",
    lede:
      "We'll walk your CISO or security team through the stack — isolation, authority, audit, access lifecycle, encryption — and answer anything the page hasn't.",
    cta: "Book a security review",
  },
  disclosure: {
    eyebrow: "RESPONSIBLE DISCLOSURE",
    headline: "Report a security vulnerability.",
    lede:
      "Thank you for looking. Describe what you found, how to reproduce it, and what impact you think it has. We triage security reports within two business days and do not pursue legal action against good-faith research.",
    cta: "Submit report",
  },
  privacy: {
    eyebrow: "DATA-PROTECTION ENQUIRY",
    headline: "Privacy, data-subject rights, or a DPA.",
    lede:
      "Whether you're exercising a right under GDPR / NDPR / CCPA, requesting our DPA, or asking a privacy-policy question — describe what you need and we'll route it to the right person.",
    cta: "Send privacy enquiry",
  },
  legal: {
    eyebrow: "LEGAL ENQUIRY",
    headline: "Notices, agreements, and legal questions.",
    lede:
      "Contract redlines, notices under our Terms of Service, vendor onboarding paperwork — send it here and our team will respond promptly.",
    cta: "Send legal enquiry",
  },
  careers: {
    eyebrow: "REGISTER YOUR INTEREST",
    headline: "Tell us what you\u2019d like to own.",
    lede:
      "We hire deliberately. Share a short note about what draws you to Avrentis, a link to something you're proud of, and the kind of work you want to do. We read every message.",
    cta: "Register my interest",
  },
  feedback: {
    eyebrow: "DOCS FEEDBACK",
    headline: "What guide would have helped?",
    lede:
      "Tell us what you were looking for, what you couldn't find, and what you'd expect it to cover. We write docs that customers actually ask for.",
    cta: "Send feedback",
  },
  subscribe: {
    eyebrow: "SUBSCRIBE TO UPDATES",
    headline: "Get notable changes in your inbox.",
    lede:
      "We send a short email when something material ships — release notes, security updates, and service-impacting incidents. No promotional material.",
    cta: "Subscribe me",
  },
  notify: {
    eyebrow: "LAUNCH NOTIFICATION",
    headline: "Be the first to know when this launches.",
    lede:
      "Drop your details and we'll reach out as soon as this module is generally available — plus a chance to join an early-access cohort.",
    cta: "Notify me at launch",
  },
  beta: {
    eyebrow: "BETA ACCESS",
    headline: "Join the beta.",
    lede:
      "Early-access users get hands-on support, a shorter feedback loop with our product team, and pricing locked at launch terms.",
    cta: "Request beta access",
  },
  roadmap: {
    eyebrow: "SHARE YOUR USE CASE",
    headline: "Shape what we build next.",
    lede:
      "Tell us the approval or record-keeping problem you're trying to solve. We'll share where it sits on our roadmap and, where it fits, loop you in early.",
    cta: "Share my use case",
  },
  general: {
    eyebrow: "CONTACT US",
    headline: "Let's talk.",
    lede:
      "Whether you're evaluating Avrentis, have a question our product pages didn't answer, or want to partner — we read every message and reply within one business day.",
    cta: "Contact us",
  },
};

// Same bands as the trial (shared SSOT); prepend an opt-out for this optional field.
const SIZE_OPTIONS = [{ value: "", label: "Prefer not to say" }, ...ORG_SIZE_OPTIONS];

/* ── Styling primitives ──────────────────────────────────────────── */

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "12px",
  fontWeight: 500,
  color: "#0f172a",
  letterSpacing: "0.02em",
  display: "block",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
  color: "#0f172a",
  width: "100%",
  height: "42px",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "0 14px",
  backgroundColor: "#FFFFFF",
  transition: "border-color 150ms ease, box-shadow 150ms ease",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "auto",
  minHeight: "120px",
  padding: "12px 14px",
  lineHeight: 1.6,
  resize: "vertical",
};

const errorStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "12px",
  color: "#b91c1c",
  marginTop: "6px",
  display: "block",
};

function SubmitButton({ label, isValid }: { label: string; isValid: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || !isValid;
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        fontFamily: "var(--font-sans)",
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
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "background-color 150ms ease",
      }}
    >
      {pending ? "Sending…" : label}
    </button>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

export function ContactForm({ intent: initialIntent }: { intent: ContactIntent }) {
  // Intent starts from the ?intent= deep link, then becomes on-page switchable
  // via the topic tabs. It only drives copy + the hidden `intent` field.
  const [intent, setIntent] = useState<ContactIntent>(initialIntent);
  const copy = INTENT_COPY[intent];
  const [state, action] = useActionState<ContactFormState, FormData>(submitContact, INITIAL_STATE);

  const switchIntent = useCallback((next: string) => {
    const value = next as ContactIntent;
    setIntent(value);
    // Keep the URL shareable/deep-linkable without a full navigation.
    window.history.replaceState(null, "", value === "general" ? "/contact" : `/contact?intent=${value}`);
  }, []);

  // ── Cloudflare Turnstile (bot defence) ──────────────────────────────
  // Rendered only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. Bot defence —
  // verified when Turnstile is configured.
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

  // Re-render on mount (handles client-side nav where the script is already loaded
  // and onReady won't fire again).
  useEffect(() => {
    renderTurnstile();
  }, [renderTurnstile]);

  // ── Controlled field state for validity computation ─────────────────
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [organisationValue, setOrganisationValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [sizeValue, setSizeValue] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [consentValue, setConsentValue] = useState(false);

  // ── Validity derivation ─────────────────────────────────────────────
  const isValid = useMemo(
    () =>
      nameValue.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) &&
      organisationValue.trim().length > 0 &&
      messageValue.trim().length >= 10 &&
      consentValue === true,
    [nameValue, emailValue, organisationValue, messageValue, consentValue],
  );

  if (state.status === "success") {
    return (
      <m.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={fadeUpTransition}
        style={{
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
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "22px",
            color: "#0f172a",
            margin: 0,
          }}
        >
          Enquiry received.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "#64748b",
            lineHeight: 1.65,
            margin: 0,
            maxWidth: "420px",
          }}
        >
          {state.message ?? "Thanks — we'll reply within one business day."}
        </p>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-sans)",
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
      </m.div>
    );
  }

  return (
    <>
      {/* Topic tabs — the 12 fine-grained intents rolled up to 5 switchable
          topics. Deep links (?intent=disclosure etc.) still light the parent
          tab and keep their specific copy; clicking a tab picks its canonical
          intent. Sits outside <form>, so its hidden input never posts —
          the specific intent posts via the hidden field inside the form. */}
      <m.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={fadeUpTransition}
        style={{ maxWidth: "640px", margin: "0 auto 24px" }}
      >
        <ChoiceGroup
          name="contact_topic"
          value={tabForIntent(intent)}
          onChange={switchIntent}
          options={CONTACT_TABS.map((t) => ({ value: t.value, label: t.label }))}
          ariaLabel="What are you contacting us about?"
        />
      </m.div>

      {/* Centered intro header — matches the trial layout */}
      <m.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={fadeUpTransition}
        style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 44px" }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-gold-on-light)",
            display: "block",
            marginBottom: "14px",
          }}
        >
          {copy.eyebrow}
        </span>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "32px",
            color: "#0f172a",
            lineHeight: 1.2,
            margin: "0 0 12px",
            letterSpacing: "0.01em",
          }}
          className="lg:!text-[40px]"
        >
          {copy.headline}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "#64748b",
            lineHeight: 1.7,
            margin: "0 auto",
            maxWidth: "520px",
          }}
        >
          {copy.lede}
        </p>
      </m.div>

      <div
        style={{
          display: "grid",
          columnGap: "48px",
          rowGap: "40px",
          alignItems: "start",
        }}
        className="grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_1.2fr]"
      >
        {/* What happens next — after the form on mobile; left column on desktop */}
        <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1">
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "#475569",
              lineHeight: 1.7,
              borderLeft: "2px solid rgba(var(--color-gold-rgb), 0.28)",
              paddingLeft: "16px",
            }}
          >
            <div style={{ marginBottom: "10px", color: "#0f172a", fontWeight: 600, fontSize: "14px" }}>
              What happens next
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
              {[
                "A real person reads every enquiry — no routing bots.",
                "We reply within one business day.",
                "For enterprise enquiries, we can sign an NDA before the first call.",
              ].map((point) => (
                <li key={point} style={{ display: "flex", gap: "9px", alignItems: "baseline" }}>
                  <span
                    aria-hidden="true"
                    style={{ color: "var(--color-gold-on-light)", flexShrink: 0, fontWeight: 700 }}
                  >
                    •
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </m.div>
        </div>

        {/* Form — first on mobile; right column on desktop */}
        <m.form
          action={action}
          className="order-1 lg:order-none lg:col-start-2 lg:row-start-1"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(2)}
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 18px 44px rgba(15,23,42,0.07)",
          }}
          noValidate
        >
          <input type="hidden" name="intent" value={intent} />
          {/* Honeypot — hidden field that real users never fill in. Field
              name is chosen to look plausible to naive form crawlers while
              being unusual enough that browsers won't autofill it. */}
          <input
            type="text"
            name="fax_number"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
          />

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
                aria-invalid={!!state.fieldErrors?.name}
                aria-describedby={state.fieldErrors?.name ? "contact-name-error" : undefined}
                style={{
                  ...inputStyle,
                  borderColor: state.fieldErrors?.name ? "#b91c1c" : "#e2e8f0",
                }}
              />
              {state.fieldErrors?.name && <span id="contact-name-error" style={errorStyle}>{state.fieldErrors.name}</span>}
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
                aria-invalid={!!state.fieldErrors?.email}
                aria-describedby={state.fieldErrors?.email ? "contact-email-error" : undefined}
                style={{
                  ...inputStyle,
                  borderColor: state.fieldErrors?.email ? "#b91c1c" : "#e2e8f0",
                }}
              />
              {state.fieldErrors?.email && <span id="contact-email-error" style={errorStyle}>{state.fieldErrors.email}</span>}
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
              aria-invalid={!!state.fieldErrors?.organisation}
              aria-describedby={state.fieldErrors?.organisation ? "contact-org-error" : undefined}
              style={{
                ...inputStyle,
                borderColor: state.fieldErrors?.organisation ? "#b91c1c" : "#e2e8f0",
              }}
            />
            {state.fieldErrors?.organisation && <span id="contact-org-error" style={errorStyle}>{state.fieldErrors.organisation}</span>}
          </div>

          <div>
            <label style={labelStyle}>Organisation size</label>
            <ChoiceGroup
              name="size"
              variant="chips"
              value={sizeValue}
              onChange={setSizeValue}
              options={SIZE_OPTIONS}
              ariaLabel="Organisation size"
            />
          </div>

          <div>
            <label style={labelStyle}>Country (optional)</label>
            <SearchableSelect
              name="country"
              value={countryValue}
              onChange={setCountryValue}
              options={COUNTRIES.map((c) => ({ value: c.name, label: c.name }))}
              ariaLabel="Country"
              placeholder="Search your country…"
            />
          </div>

          <div>
            <label htmlFor="message" style={labelStyle}>
              Tell us about your use case
              <span style={{ color: "#dc2626", marginLeft: 4 }} aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              aria-invalid={!!state.fieldErrors?.message}
              aria-describedby={state.fieldErrors?.message ? "contact-message-error" : undefined}
              style={{
                ...textareaStyle,
                borderColor: state.fieldErrors?.message ? "#b91c1c" : "#e2e8f0",
              }}
              placeholder="What approvals or records are you trying to structure? How many people, how often?"
            />
            {state.fieldErrors?.message && <span id="contact-message-error" style={errorStyle}>{state.fieldErrors.message}</span>}
          </div>

          <div>
            <label
              htmlFor="consent"
              style={{
                fontFamily: "var(--font-sans)",
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
                I agree that Avrentis may use the details above to respond to this enquiry, in line with the{" "}
                <Link href="/privacy" style={{ color: "var(--color-gold-on-light)", textDecoration: "none" }}>
                  privacy policy
                </Link>
                .{" "}
                <span style={{ color: "#dc2626" }} aria-hidden="true">*</span>
              </span>
            </label>
            {state.fieldErrors?.consent && <span style={errorStyle}>{state.fieldErrors.consent}</span>}
          </div>

          {state.status === "error" && state.message && !state.fieldErrors && (
            <div
              role="alert"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "#b91c1c",
                backgroundColor: "rgba(185,28,28,0.06)",
                border: "1px solid rgba(185,28,28,0.2)",
                borderRadius: "6px",
                padding: "10px 12px",
              }}
            >
              {state.message}
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

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "12px", flexWrap: "wrap" }}>
            <SubmitButton label={copy.cta} isValid={isValid} />
          </div>
        </m.form>
      </div>
    </>
  );
}
