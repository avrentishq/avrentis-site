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
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { BOUNDS, clampInt, computeSavings, EFFICIENCY } from "./compute";
import { type EstimateEmailState } from "./state";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const naira = (n: number) => `₦${Math.round(n).toLocaleString()}`;
const hrs = (n: number) => Math.round(n).toLocaleString();

export async function emailEstimate(
  _previous: EstimateEmailState,
  formData: FormData,
): Promise<EstimateEmailState> {
  // Honeypot — bots fill hidden fields. Silently "succeed" without sending.
  const honeypot = formData.get("fax_number");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", message: "Sent — check your inbox." };
  }

  // Rate limit the send (this action emails an arbitrary recipient, so cap
  // bursts to blunt spam-relay abuse). Best-effort, per-instance.
  if (!rateLimit(`estimate:${await clientIp()}`, 5, 10 * 60_000)) {
    return { status: "error", message: "Too many requests — please try again in a few minutes." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const consent = formData.get("consent") === "on";

  if (!email || !EMAIL_RE.test(email)) {
    return { status: "error", fieldError: "Enter a valid email so we can send it." };
  }
  if (email.length > 320) {
    return { status: "error", fieldError: "That email is too long." };
  }
  if (!consent) {
    return { status: "error", fieldError: "We need your consent to email you." };
  }

  // Bot defence — verified when Turnstile is configured.
  const turnstile = await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""));
  if (!turnstile.ok) {
    return {
      status: "error",
      message: "We couldn't verify that you're human. Please try again.",
    };
  }

  // Re-parse and clamp every number server-side — never trust client math.
  const approvals = clampInt(formData.get("approvals"), BOUNDS.approvals);
  const minutes = clampInt(formData.get("minutes"), BOUNDS.minutes);
  const cost = clampInt(formData.get("cost"), BOUNDS.cost);
  const result = computeSavings({ approvals, minutes, cost });

  const safeEmail = escape(email);
  const pct = Math.round(EFFICIENCY * 100);

  const reportHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#0f172a;max-width:560px;">
      <tr><td style="padding:0 0 8px;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase;">Your Avrentis savings estimate</td></tr>
      <tr><td style="padding:0 0 16px;font-size:20px;font-weight:700;">${naira(result.nairaPerYear)} <span style="font-size:14px;font-weight:400;color:#64748b;">saved per year</span></td></tr>
      <tr><td style="padding:0 0 4px;color:#64748b;font-size:12px;">Time back</td></tr>
      <tr><td style="padding:0 0 16px;">${hrs(result.hoursPerMonth)} hours / month &middot; ${hrs(result.hoursPerYear)} hours / year</td></tr>
      <tr><td style="padding:0 0 4px;color:#64748b;font-size:12px;">Based on your inputs</td></tr>
      <tr><td style="padding:0 0 16px;">${approvals.toLocaleString()} approvals/month &middot; ${minutes} min coordination each &middot; ${naira(cost)}/hour</td></tr>
      <tr><td style="padding:0 0 16px;font-size:12px;color:#94a3b8;line-height:1.5;">Assumes structured approvals remove about ${pct}% of coordination time — a conservative estimate. Your inputs, your numbers.</td></tr>
      <tr><td style="padding:8px 0 0;"><a href="https://avrentis.com/trial" style="color:#C68B2F;text-decoration:none;font-weight:600;">Start your 14-day trial →</a></td></tr>
    </table>
  `;

  try {
    // Send the visitor their estimate.
    await sendEmail({
      to: email,
      subject: "Your Avrentis savings estimate",
      html: reportHtml,
    });
    // Notify the internal inbox of the lead.
    await sendEmail({
      subject: `[Avrentis — Savings estimate] ${safeEmail}`,
      html: `<p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#0f172a;">Estimate requested by <strong>${safeEmail}</strong>: ${naira(result.nairaPerYear)}/yr, ${hrs(result.hoursPerYear)} hrs/yr — from ${approvals.toLocaleString()} approvals/mo, ${minutes} min each, ${naira(cost)}/hr.</p>`,
      replyTo: email,
    });
  } catch (err) {
    console.error("Estimate email failed:", err);
    return {
      status: "error",
      message: "Something went wrong sending your estimate. Please try again shortly.",
    };
  }

  return { status: "success", message: "Sent — it's on its way to your inbox." };
}
