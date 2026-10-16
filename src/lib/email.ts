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

/** Low-level send. `to` defaults to the internal inbox. */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendParams & { to?: string | string[] }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new EmailSendError("not_configured");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: to ?? INBOX,
    subject,
    html,
    replyTo,
  });

  if (error) {
    throw new EmailSendError(error.name);
  }
}

/** Sends an inbound notification to the internal inbox. */
export async function sendContactEmail(params: SendParams): Promise<void> {
  await sendEmail(params);
}
