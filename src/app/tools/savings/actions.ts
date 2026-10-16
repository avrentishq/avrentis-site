"use server";

/**
 * emailEstimate — emails a visitor their own savings estimate and notifies the
 * internal inbox of the lead. No data is persisted; the emails are the record.
 *
 * Security posture mirrors the contact action: honeypot, Turnstile, strict
 * validation, length caps, HTML-escaping, and CRLF stripping in the subject.
 * Numbers are re-parsed and clamped server-side — the client's arithmetic is
 * never trusted. The report body is a fixed branded template (no free-text
 * from the user), so this can't be used to relay arbitrary messages.
 */

import { sendEmail } from "@/lib/email";
import { STATIC_COLORS } from "@/lib/static-colors";
import {
  emailLink,
  emailParagraph,
  emailRow,
  emailShell,
  escapeHtml,
  eyebrowRow,
  headerSafe,
  labelledRow,
} from "@/lib/email-html";
import { humanCheckRefusal, screenSubmission } from "@/lib/submission-guard";
import { formatCount } from "@/lib/money";
import { BOUNDS, clampInt, computeSavings, EFFICIENCY, formatSavings } from "./compute";
import { ESTIMATE_FIELDS, type EstimateEmailState } from "./state";
import { submittedValues } from "@/lib/submitted-values";
import { canonical } from "@/lib/seo";
import { START_TRIAL_CTA } from "@/lib/trial-terms";
import { BRAND, SITE_PAGES } from "@/lib/brand";
import { errorSummary } from "@/lib/safe-log";
import { exceedsLimit, hasEmailShape, tooLongMessage } from "@/lib/form-rules";

export async function emailEstimate(
  _previous: EstimateEmailState,
  formData: FormData,
): Promise<EstimateEmailState> {
  const answer = await answerEstimateEmail(formData);
  return answer.status === "error"
    ? { ...answer, values: submittedValues(formData, ESTIMATE_FIELDS) }
    : answer;
}

async function answerEstimateEmail(formData: FormData): Promise<EstimateEmailState> {
  // The rate limit caps bursts: this action emails an address the visitor types.
  const screen = await screenSubmission(formData, "savingsEstimate");
  // A filled decoy field: answer as if it succeeded, and send nothing.
  if (screen.outcome === "decoy") return { status: "success", message: "Sent — check your inbox." };
  if (screen.outcome === "refused") return { status: "error", message: screen.message };

  const email = String(formData.get("email") ?? "").trim();
  const consent = formData.get("consent") === "on";

  if (!email || !hasEmailShape(email)) {
    return { status: "error", fieldErrors: { email: "Enter a valid email so we can send it." } };
  }
  if (exceedsLimit(email, "email")) {
    return { status: "error", fieldErrors: { email: tooLongMessage("email", "email") } };
  }
  if (!consent) {
    return { status: "error", fieldErrors: { consent: "We need your consent to email you." } };
  }

  const humanRefusal = await humanCheckRefusal(formData);
  if (humanRefusal) return { status: "error", message: humanRefusal };

  // Re-parse and clamp every number server-side — never trust client math.
  const approvals = clampInt(formData.get("approvals"), BOUNDS.approvals);
  const minutes = clampInt(formData.get("minutes"), BOUNDS.minutes);
  const cost = clampInt(formData.get("cost"), BOUNDS.cost);
  const result = computeSavings({ approvals, minutes, cost });

  const efficiencyPercent = Math.round(EFFICIENCY * 100);
  const reportTitle = `Your ${BRAND.name} savings estimate`;

  const reportHtml = emailShell(
    [
      eyebrowRow(reportTitle, 8),
      emailRow(
        `${formatSavings(result.moneyPerYear)} <span style="font-size:14px;font-weight:400;color:${STATIC_COLORS.textMuted};">saved per year</span>`,
        "padding:0 0 16px;font-size:20px;font-weight:700;",
      ),
      labelledRow(
        "Time back",
        `${formatCount(result.hoursPerMonth)} hours / month &middot; ${formatCount(result.hoursPerYear)} hours / year`,
        { bottomGap: 16 },
      ),
      labelledRow(
        "Based on your inputs",
        `${formatCount(approvals)} approvals/month &middot; ${minutes} min coordination each &middot; ${formatSavings(cost)}/hour`,
        { bottomGap: 16 },
      ),
      emailRow(
        `Assumes structured approvals remove about ${efficiencyPercent}% of coordination time — a conservative estimate. Your inputs, your numbers.`,
        `padding:0 0 16px;font-size:12px;color:${STATIC_COLORS.textSubtle};line-height:1.5;`,
      ),
      emailRow(emailLink(canonical(SITE_PAGES.trial()), `${START_TRIAL_CTA} →`, "font-weight:600;"), "padding:8px 0 0;"),
    ],
    560,
  );

  try {
    // Send the visitor their estimate.
    await sendEmail({ to: email, subject: reportTitle, html: reportHtml });
    // Notify the internal inbox of the lead.
    await sendEmail({
      subject: `[${BRAND.name} — Savings estimate] ${headerSafe(email)}`,
      html: emailParagraph(
        `Estimate requested by <strong>${escapeHtml(email)}</strong>: ${formatSavings(result.moneyPerYear)}/yr, ${formatCount(result.hoursPerYear)} hrs/yr — from ${formatCount(approvals)} approvals/mo, ${minutes} min each, ${formatSavings(cost)}/hr.`,
      ),
      replyTo: email,
    });
  } catch (error) {
    console.error("Estimate email failed:", errorSummary(error));
    return {
      status: "error",
      message: "Something went wrong sending your estimate. Please try again shortly.",
    };
  }

  return { status: "success", message: "Sent — it's on its way to your inbox." };
}
