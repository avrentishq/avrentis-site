"use client";

/**
 * VerifyResult — renders the outcome of a magic-link verification. The
 * success path is handled server-side via redirect; this component
 * covers the four non-success states:
 *
 *   expired     — the token timed out; offer a one-click re-issue
 *   not_found   — token hash doesn't match any submission
 *   rejected    — admin rejected the underlying submission
 *   error       — network / platform error; try again later
 */

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail, AlertCircle, Clock, RefreshCcw } from "lucide-react";
import { BRAND_COLORS, SITE_PAGES } from "@/lib/brand";
import { reissueTrialToken } from "../../actions";
import { FormAlert } from "@/components/ui/form/form-alert";
import { submitWithoutReset } from "@/components/ui/form/submit";
import { useFocusAfterFailure } from "@/components/ui/form/focus-after-failure";
import { contactHref } from "@/app/contact/tabs";

const sans = "var(--font-sans)";
const REISSUE_ERROR_ID = "reissue-error";

interface Props {
  status: string;
  message: string;
  token: string;
}

export function VerifyResult({ status, message, token }: Props) {
  const [reissueState, reissueAction, reissuePending] = useActionState(
    reissueTrialToken,
    { status: "idle" as const },
  );
  // After a failed resend, focus the message (the form has no fields to fix).
  const reissueFormRef = useRef<HTMLFormElement>(null);
  useFocusAfterFailure(reissueFormRef, reissueState, reissueState.status === "error", REISSUE_ERROR_ID);

  if (reissueState.status === "sent") {
    return (
      <Card
        variant="success"
        icon={<Mail size={26} color={BRAND_COLORS.gold} strokeWidth={1.8} />}
        title="A new link is on its way."
        message={reissueState.message ?? "Check your inbox in the next minute."}
      />
    );
  }

  if (status === "expired") {
    return (
      <Card
        variant="warning"
        icon={<Clock size={26} color={BRAND_COLORS.gold} strokeWidth={1.8} />}
        title="This link has expired."
        message={message}
      >
        <form
          ref={reissueFormRef}
          action={reissueAction}
          onSubmit={submitWithoutReset(reissueAction)}
          style={{ marginTop: "16px" }}
        >
          <input type="hidden" name="token" value={token} />
          <ReissueButton pending={reissuePending} />
          {reissueState.status === "error" && reissueState.message && (
            <FormAlert
              id={REISSUE_ERROR_ID}
              pending={reissuePending}
              style={{
                fontFamily: sans,
                fontSize: "12px",
                color: "var(--color-danger)",
                marginTop: "10px",
              }}
            >
              {reissueState.message}
            </FormAlert>
          )}
        </form>
      </Card>
    );
  }

  if (status === "rejected") {
    return (
      <Card
        variant="error"
        icon={<AlertCircle size={26} style={{ color: "var(--color-danger)" }} strokeWidth={1.8} />}
        title="This request couldn't be provisioned."
        message={message}
      >
        <Link
          href={contactHref("demo")}
          style={{
            marginTop: "16px",
            fontFamily: sans,
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-gold-on-light)",
            textDecoration: "none",
          }}
        >
          Talk to us →
        </Link>
      </Card>
    );
  }

  // Default: not_found / error / anything else
  return (
    <Card
      variant="error"
      icon={<AlertCircle size={26} style={{ color: "var(--color-danger)" }} strokeWidth={1.8} />}
      title="We couldn't verify this link."
      message={message}
    >
      <Link
        href={SITE_PAGES.trial()}
        style={{
          marginTop: "16px",
          fontFamily: sans,
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--color-gold-on-light)",
          textDecoration: "none",
        }}
      >
        Start over →
      </Link>
    </Card>
  );
}

function ReissueButton({ pending }: { pending: boolean }) {
  // Cooldown guards against spam-clicking: each press disables the button
  // for ~3s. Combined with `pending`, this debounces rapid re-issues.
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(false), 3000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const disabled = pending || cooldown;

  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={() => setCooldown(true)}
      style={{
        fontFamily: sans,
        fontWeight: 600,
        fontSize: "13px",
        backgroundColor: disabled ? "var(--color-gold-hover)" : "var(--color-gold)",
        color: "var(--color-text-primary)",
        border: "none",
        borderRadius: "9999px",
        padding: "0 20px",
        height: "40px",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <RefreshCcw size={14} strokeWidth={2} aria-hidden="true" />
      {pending ? "Sending…" : "Send me a new link"}
    </button>
  );
}

function Card({
  variant,
  icon,
  title,
  message,
  children,
}: {
  variant: "success" | "warning" | "error";
  icon: React.ReactNode;
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  const bg =
    variant === "success"
      ? "rgba(var(--color-success-rgb), 0.10)"
      : variant === "warning"
        ? "rgba(var(--color-gold-rgb), 0.12)"
        : "rgba(var(--color-danger-rgb), 0.10)";
  return (
    <div
      style={{
        backgroundColor: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "10px",
        padding: "48px 40px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <h2
        style={{
          fontFamily: sans,
          fontWeight: 500,
          fontSize: "20px",
          color: "var(--color-text-primary)",
          margin: 0,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: sans,
          fontSize: "14px",
          color: "var(--color-text-muted)",
          lineHeight: 1.65,
          margin: 0,
          maxWidth: "420px",
        }}
      >
        {message}
      </p>
      {children}
    </div>
  );
}
