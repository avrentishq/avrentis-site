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

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Mail, AlertCircle, Clock, RefreshCcw } from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";
import { reissueTrialToken } from "../../actions";

const sans = "var(--font-sans)";

interface Props {
  status: string;
  message: string;
  token: string;
}

export function VerifyResult({ status, message, token }: Props) {
  const [reissueState, reissueAction] = useActionState(
    reissueTrialToken,
    { status: "idle" as const },
  );

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
        <form action={reissueAction} style={{ marginTop: "16px" }}>
          <input type="hidden" name="token" value={token} />
          <ReissueButton />
          {reissueState.status === "error" && reissueState.message && (
            <p
              style={{
                fontFamily: sans,
                fontSize: "12px",
                color: "#b91c1c",
                marginTop: "10px",
              }}
            >
              {reissueState.message}
            </p>
          )}
        </form>
      </Card>
    );
  }

  if (status === "rejected") {
    return (
      <Card
        variant="error"
        icon={<AlertCircle size={26} color="#b91c1c" strokeWidth={1.8} />}
        title="This request couldn't be provisioned."
        message={message}
      >
        <Link
          href="/contact?intent=demo"
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
      icon={<AlertCircle size={26} color="#b91c1c" strokeWidth={1.8} />}
      title="We couldn't verify this link."
      message={message}
    >
      <Link
        href="/trial"
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

function ReissueButton() {
  const { pending } = useFormStatus();
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
        color: "#0f172a",
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
      ? "rgba(4,120,87,0.10)"
      : variant === "warning"
        ? "rgba(var(--color-gold-rgb), 0.12)"
        : "rgba(185,28,28,0.10)";
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #e2e8f0",
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
          color: "#0f172a",
          margin: 0,
        }}
      >
        {title}
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
      {children}
    </div>
  );
}
