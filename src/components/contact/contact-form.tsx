"use client";

/**
 * ContactForm — the interactive half of /contact. Uses `useActionState`
 * to call the server action, shows per-field validation errors, and
 * swaps into a success state without a full page navigation.
 *
 * The form is intent-aware — `?intent=<kind>` query parameters set the
 * topic, and the topic decides everything the visitor sees: the words, which
 * fields appear (and which are required), the consent wording and the
 * confirmation — all from `CONTACT_TOPICS` (topics.ts), the same table the
 * Server Action validates against. Trial requests live on the /trial page.
 */

import { useActionState, useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { fadeUpOnScroll, fadeUpOnLoad, cssTransition } from "@/lib/animations";
import { ChoiceGroup } from "@/components/ui/form/choice-group";
import { buttonProps } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-intro";
import { SearchableSelect } from "@/components/ui/form/searchable-select";
import {
  describedBy,
  hasVisibleFieldErrors,
  useServerFieldErrors,
} from "@/components/ui/form/field-errors";
import { FormAlert } from "@/components/ui/form/form-alert";
import { useHydrated } from "@/components/ui/form/hydrated";
import { TurnstileWidget } from "@/components/ui/form/turnstile-widget";
import { HoneypotField } from "@/components/ui/form/honeypot-field";
import { submitWithoutReset } from "@/components/ui/form/submit";
import { useFocusAfterFailure } from "@/components/ui/form/focus-after-failure";
import { ORG_SIZE_OPTIONS } from "@/lib/org-size";
import { COUNTRIES } from "@/data/countries";
import { submitContact } from "@/app/contact/actions";
import { INITIAL_STATE, type ContactField, type ContactFormState } from "@/app/contact/state";
import { CONTACT_TABS, contactHref, tabForIntent } from "@/app/contact/tabs";
import {
  CONTACT_TOPICS,
  inputRule,
  topicEmail,
  topicInputs,
  type ContactInput,
} from "@/app/contact/topics";
import { LEGAL_PAGES, type ContactIntent } from "@/lib/brand";
import { FORM_LIMITS, hasEmailShape, isWebLink, MESSAGE_MIN_LENGTH } from "@/lib/form-rules";
import { SITE_ROUTES } from "@/lib/routes";

/** The country picker posts the alpha-2 code (as the trial does); the label is the name. */
const COUNTRY_OPTIONS = COUNTRIES.map((country) => ({ value: country.code, label: country.name }));

// Same bands as the trial (shared SSOT); prepend an opt-out for this optional field.
const SIZE_OPTIONS = [{ value: "", label: "Prefer not to say" }, ...ORG_SIZE_OPTIONS];

/** Name and email share a row on wider screens when they sit next to each other. */
function inputRows(inputs: readonly ContactInput[]): ContactInput[][] {
  const rows: ContactInput[][] = [];
  for (let index = 0; index < inputs.length; index += 1) {
    if (inputs[index] === "name" && inputs[index + 1] === "email") {
      rows.push(["name", "email"]);
      index += 1;
    } else {
      rows.push([inputs[index]!]);
    }
  }
  return rows;
}

/** The free-text inputs, their input type and the browser's autofill hint. */
type TextInput = "name" | "email" | "organisation" | "link";
const TEXT_INPUT_TYPES: Record<TextInput, "text" | "email" | "url"> = {
  name: "text",
  email: "email",
  organisation: "text",
  link: "url",
};
const AUTOCOMPLETE: Record<TextInput, string> = {
  name: "name",
  email: "email",
  organisation: "organization",
  link: "url",
};

/* ── Styling primitives ──────────────────────────────────────────── */

const labelStyle: React.CSSProperties = {
  fontSize: "var(--text-xs)",
  fontWeight: 500,
  color: "var(--color-text-primary)",
  letterSpacing: "0.02em",
  display: "block",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  fontSize: "var(--text-md)",
  color: "var(--color-text-primary)",
  width: "100%",
  height: "42px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  padding: "0 14px",
  backgroundColor: "var(--color-white)",
  transition: cssTransition(["border-color", "box-shadow"]),
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
  fontSize: "var(--text-xs)",
  color: "var(--color-danger)",
  marginTop: "6px",
  display: "block",
};

function SubmitButton({
  label,
  isValid,
  pending,
}: {
  label: string;
  isValid: boolean;
  pending: boolean;
}) {
  const disabled = pending || !isValid;
  return (
    <button
      type="submit"
      disabled={disabled}
      {...buttonProps({ size: "md", shape: "pill", disabled })}
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
  const copy = CONTACT_TOPICS[intent];
  const [state, action, isPending] = useActionState<ContactFormState, FormData>(
    submitContact,
    INITIAL_STATE,
  );
  const hydrated = useHydrated();
  // A refusal hands back what was posted. Fields start from it, which only
  // matters for a page rendered without JavaScript (with it, state persists).
  const posted = state.status === "error" ? (state.values ?? {}) : {};
  // A server error steps aside once its field is edited (field-errors.ts).
  const { errors: fieldErrors, clear: clearFieldError } = useServerFieldErrors(state.fieldErrors);
  // After a failed send, focus the first field in error, else the alert.
  const formRef = useRef<HTMLFormElement>(null);
  useFocusAfterFailure(formRef, state, state.status === "error", "contact-form-error");

  const [consentValue, setConsentValue] = useState(posted.consent === "on");
  const switchIntent = useCallback((next: string) => {
    const value = next as ContactIntent;
    setIntent(value);
    // Each topic's consent says something different, so agreement never carries over.
    setConsentValue(false);
    // Keep the URL shareable/deep-linkable without a full navigation.
    window.history.replaceState(null, "", contactHref(value));
  }, []);

  // ── Controlled field state for validity computation ─────────────────
  // One value per input; a value survives a topic switch, but only the
  // topic's own inputs render, post, or count towards validity.
  const [values, setValues] = useState<Partial<Record<ContactInput, string>>>(posted);
  const inputs = topicInputs(intent);
  const setValue = useCallback(
    (input: ContactInput, value: string) => {
      setValues((current) => ({ ...current, [input]: value }));
      clearFieldError(input);
    },
    [clearFieldError],
  );

  // ── Validity derivation (mirrors the action's checks) ───────────────
  const isValid = useMemo(
    () =>
      consentValue &&
      inputs.every((input) => {
        const value = (values[input] ?? "").trim();
        if (!value) return !inputRule(intent, input)!.required;
        if (input === "email") return hasEmailShape(value);
        if (input === "link") return isWebLink(value);
        if (input === "message") return value.length >= MESSAGE_MIN_LENGTH;
        return true;
      }),
    [consentValue, inputs, values, intent],
  );

  const errorId = (input: string) => `contact-${input}-error`;
  const fieldError = (input: ContactField) =>
    fieldErrors[input] ? (
      <span id={errorId(input)} style={errorStyle}>
        {fieldErrors[input]}
      </span>
    ) : null;
  const fieldLabel = (input: ContactInput, htmlFor?: string) => {
    const rule = inputRule(intent, input)!;
    return (
      <label htmlFor={htmlFor} style={labelStyle}>
        {rule.label}
        {rule.required ? (
          <span style={{ color: "var(--color-required)", marginLeft: 4 }} aria-hidden="true">*</span>
        ) : (
          <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}> (optional)</span>
        )}
      </label>
    );
  };
  const textInputStyle = (input: ContactInput) => ({
    ...inputStyle,
    borderColor: fieldErrors[input] ? "var(--color-danger)" : "var(--color-border)",
  });

  const renderInput = (input: ContactInput) => {
    const rule = inputRule(intent, input)!;
    const invalid = !!fieldErrors[input];
    const described = describedBy(invalid && errorId(input));
    switch (input) {
      case "size":
        return (
          <div key={input}>
            {fieldLabel(input)}
            <ChoiceGroup
              name="size"
              variant="chips"
              value={values.size ?? ""}
              onChange={(value) => setValue("size", value)}
              options={SIZE_OPTIONS}
              ariaLabel={rule.label}
              invalid={invalid}
              describedBy={described}
            />
            {fieldError(input)}
          </div>
        );
      case "relationship":
      case "requestType":
        return (
          <div key={input}>
            {fieldLabel(input)}
            <ChoiceGroup
              name={input}
              variant="chips"
              value={values[input] ?? ""}
              onChange={(value) => setValue(input, value)}
              options={rule.options ?? []}
              ariaLabel={rule.label}
              invalid={invalid}
              describedBy={described}
            />
            {fieldError(input)}
          </div>
        );
      case "country":
      case "module":
        return (
          <div key={input}>
            {fieldLabel(input)}
            <SearchableSelect
              name={input}
              value={values[input] ?? ""}
              onChange={(value) => setValue(input, value)}
              options={input === "country" ? COUNTRY_OPTIONS : (rule.options ?? [])}
              ariaLabel={rule.label}
              placeholder={rule.placeholder ?? (input === "module" ? "Choose a module…" : undefined)}
              searchLabel={input === "country" ? "countries" : "modules"}
              invalid={invalid}
              describedBy={described}
            />
            {fieldError(input)}
          </div>
        );
      case "message":
        return (
          <div key={input}>
            {fieldLabel(input, "message")}
            <textarea
              id="message"
              name="message"
              required={rule.required}
              minLength={MESSAGE_MIN_LENGTH}
              maxLength={FORM_LIMITS.message}
              value={values.message ?? ""}
              onChange={(e) => setValue("message", e.target.value)}
              aria-invalid={invalid || undefined}
              aria-describedby={described}
              style={{ ...textareaStyle, borderColor: textInputStyle(input).borderColor }}
              placeholder={rule.placeholder}
            />
            {fieldError(input)}
          </div>
        );
      default:
        return (
          <div key={input}>
            {fieldLabel(input, input)}
            <input
              id={input}
              name={input}
              type={TEXT_INPUT_TYPES[input]}
              required={rule.required}
              maxLength={FORM_LIMITS[input]}
              autoComplete={AUTOCOMPLETE[input]}
              placeholder={rule.placeholder}
              value={values[input] ?? ""}
              onChange={(e) => setValue(input, e.target.value)}
              aria-invalid={invalid || undefined}
              aria-describedby={described}
              style={textInputStyle(input)}
            />
            {fieldError(input)}
          </div>
        );
    }
  };

  if (state.status === "success") {
    return (
      <m.div
        {...fadeUpOnLoad()}
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
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
            borderRadius: "var(--radius-circle)",
            backgroundColor: "var(--color-success-tint)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={26} strokeWidth={2} style={{ color: "var(--color-success)" }} aria-hidden="true" />
        </div>
        <h2
          style={{
            fontWeight: 500,
            fontSize: "var(--text-heading-sm)",
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          {copy.successTitle}
        </h2>
        <p
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--color-text-muted)",
            lineHeight: 1.65,
            margin: 0,
            maxWidth: "var(--measure-compact)",
          }}
        >
          {state.message ?? copy.successMessage}
        </p>
        <Link
          href={SITE_ROUTES.home}
          style={{
            fontSize: "var(--text-sm)",
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
        {...fadeUpOnLoad()}
        style={{ maxWidth: "var(--measure)", margin: "0 auto 24px" }}
      >
        <ChoiceGroup
          name="contact_topic"
          value={tabForIntent(intent)}
          onChange={switchIntent}
          options={CONTACT_TABS.map((t) => ({ value: t.value, label: t.label }))}
          ariaLabel="What are you contacting us about?"
          hrefFor={(value) => contactHref(value as ContactIntent)}
        />
      </m.div>

      {/* Centered intro header — matches the trial layout */}
      <m.div
        {...fadeUpOnLoad()}
        style={{ textAlign: "center", maxWidth: "var(--measure)", margin: "0 auto 44px" }}
      >
        <Eyebrow style={{ display: "block", marginBottom: "14px" }}>{copy.eyebrow}</Eyebrow>
        <h1
          style={{
            fontWeight: 400,
            fontSize: "var(--text-heading-2xl)",
            color: "var(--color-text-primary)",
            lineHeight: 1.2,
            margin: "0 0 12px",
            letterSpacing: "0.01em",
          }}
          className="lg:!text-display-md"
        >
          {copy.headline}
        </h1>
        <p
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--color-text-muted)",
            lineHeight: 1.7,
            margin: "0 auto",
            maxWidth: "var(--measure-short)",
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
        {/* What happens next — after the form on mobile; left column on desktop,
            vertically centred against the taller form. */}
        <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:self-center">
          <m.div
            {...fadeUpOnScroll(1)}
            style={{
              fontSize: "var(--text-md)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              borderLeft: "2px solid var(--color-gold-border)",
              paddingLeft: "16px",
            }}
          >
            <div style={{ marginBottom: "10px", color: "var(--color-text-primary)", fontWeight: 600, fontSize: "var(--text-md)" }}>
              What happens next
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
              {copy.nextSteps.map((point) => (
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

          {/* Email fallback — some visitors will not use a web form at all, and
              a visible address plus an explicit no-marketing promise lowers the
              cost of getting in touch. The address is the same one the action
              falls back to when Resend fails. */}
          <m.div
            {...fadeUpOnScroll(3)}
            style={{ marginTop: "32px" }}
          >
            <div
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: "var(--color-text-primary)",
                marginBottom: "8px",
              }}
            >
              Prefer email?
            </div>
            <a
              href={`mailto:${topicEmail(intent)}`}
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 500,
                color: "var(--color-gold-on-light)",
                textDecoration: "none",
              }}
            >
              {topicEmail(intent)}
            </a>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                lineHeight: 1.7,
                margin: "12px 0 0",
                maxWidth: "300px",
              }}
            >
              {copy.emailNote}
            </p>
          </m.div>
        </div>

        {/* Form — first on mobile; right column on desktop */}
        <m.form
          ref={formRef}
          action={action}
          onSubmit={submitWithoutReset(action)}
          className="order-1 lg:order-none lg:col-start-2 lg:row-start-1"
          {...fadeUpOnScroll(2)}
          style={{
            backgroundColor: "var(--color-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-2xl)",
            padding: "var(--form-card-padding)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            boxShadow: "0 1px 3px rgba(var(--color-navy-primary-rgb), 0.04), 0 18px 44px rgba(var(--color-navy-primary-rgb), 0.07)",
          }}
          noValidate
        >
          <input type="hidden" name="intent" value={intent} />
          <HoneypotField />

          {inputRows(inputs).map((row) =>
            row.length === 1 ? (
              renderInput(row[0]!)
            ) : (
              <div key={row.join("-")} style={{ display: "grid", gap: "14px" }} className="grid-cols-1 md:grid-cols-2">
                {row.map(renderInput)}
              </div>
            ),
          )}

          <div>
            <label
              htmlFor="consent"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-body)",
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
                aria-invalid={!!fieldErrors.consent || undefined}
                aria-describedby={describedBy(!!fieldErrors.consent && "contact-consent-error")}
                checked={consentValue}
                onChange={(e) => {
                  setConsentValue(e.target.checked);
                  clearFieldError("consent");
                }}
                style={{ marginTop: "3px", accentColor: "var(--color-gold)", width: "16px", height: "16px" }}
              />
              <span>
                {copy.consent}, in line with the{" "}
                <Link href={LEGAL_PAGES.privacy} style={{ color: "var(--color-gold-on-light)", textDecoration: "none" }}>
                  privacy policy
                </Link>
                .{" "}
                <span style={{ color: "var(--color-required)" }} aria-hidden="true">*</span>
              </span>
            </label>
            {fieldErrors.consent && (
              <span id="contact-consent-error" style={errorStyle}>{fieldErrors.consent}</span>
            )}
          </div>

          {/* The summary stays while any field error is still on screen. */}
          {state.status === "error" &&
            state.message &&
            (!state.fieldErrors || hasVisibleFieldErrors(fieldErrors)) && (
            <FormAlert
              id="contact-form-error"
              pending={isPending}
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-danger)",
                backgroundColor: "var(--color-danger-wash)",
                border: "1px solid var(--color-danger-border)",
                borderRadius: "var(--radius-md)",
                padding: "10px 12px",
              }}
            >
              {state.message}
            </FormAlert>
          )}

          <TurnstileWidget fallbackEmail={topicEmail(intent)} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "12px", flexWrap: "wrap" }}>
            <SubmitButton label={copy.cta} isValid={!hydrated || isValid} pending={isPending} />
          </div>
        </m.form>
      </div>
    </>
  );
}
