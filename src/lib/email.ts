import "server-only";
import { Resend } from "resend";
import { BRAND } from "@/lib/brand";
import { CONTACT_EMAIL } from "@/lib/contacts";

/**
 * Thin wrapper around Resend so the rest of the site doesn't need to know
 * which provider we use. Never throws for missing env at module load — we
 * check at send-time so local development without a key still renders pages.
 */

const FROM = process.env.CONTACT_FROM ?? `${BRAND.emailSenderDefault} <${CONTACT_EMAIL.general}>`;
const INBOX = process.env.CONTACT_INBOX ?? CONTACT_EMAIL.general;

/**
 * A send the provider refused. Carries only the provider's error name as
 * `code` — its message can echo the recipient's address, so it is dropped.
 */
export class EmailSendError extends Error {
  readonly code: string;
  constructor(code: string) {
    super(`Email provider refused the send (${code})`);
    this.name = "EmailSendError";
    this.code = code;
  }
}

interface SendParams {
  subject: string;
  html: string;
  replyTo?: string;
}

type Recipients = string | string[];

/** Low-level send. `to` defaults to the internal inbox. */
export async function sendEmail({
  to,
  cc,
  subject,
  html,
  replyTo,
}: SendParams & { to?: Recipients; cc?: Recipients }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new EmailSendError("not_configured");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: to ?? INBOX,
    cc,
    subject,
    html,
    replyTo,
  });

  if (error) {
    throw new EmailSendError(error.name);
  }
}

/**
 * The address a contact topic's inbox resolves to. The general inbox can be
 * overridden per environment (`CONTACT_INBOX`), as can the security inbox
 * (`CONTACT_SECURITY_INBOX`); otherwise each is the published address.
 */
function inboxAddress(inbox: keyof typeof CONTACT_EMAIL): string {
  if (inbox === "general") return INBOX;
  if (inbox === "security") return process.env.CONTACT_SECURITY_INBOX ?? CONTACT_EMAIL.security;
  return CONTACT_EMAIL[inbox];
}

/**
 * Sends an inbound notification to a topic's inbox (default: general). A topic
 * routed elsewhere copies the general inbox too, so a report is never lost to a
 * mailbox nobody is watching yet.
 */
export async function sendContactEmail(
  params: SendParams & { inbox?: "general" | "security" },
): Promise<void> {
  const { inbox = "general", ...message } = params;
  const to = inboxAddress(inbox);
  await sendEmail({ ...message, to, cc: to === INBOX ? undefined : INBOX });
}

/**
 * Adds a subscriber to the updates mailing list — a Resend segment named by
 * `RESEND_UPDATES_SEGMENT_ID`; broadcasts sent to it carry the provider's
 * unsubscribe link. Returns false when no list is configured, so the caller
 * can fall back to emailing the team; throws `EmailSendError` when the
 * provider refuses.
 */
export async function addToUpdatesList(subscriber: { email: string; firstName?: string }): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_UPDATES_SEGMENT_ID;
  if (!apiKey || !segmentId) return false;

  const resend = new Resend(apiKey);
  const { error } = await resend.contacts.create({
    email: subscriber.email,
    firstName: subscriber.firstName || undefined,
    // No `unsubscribed` flag: a new contact starts subscribed, and sending
    // `false` could re-subscribe someone who has opted out.
    segments: [{ id: segmentId }],
  });
  if (error) throw new EmailSendError(error.name);
  return true;
}
