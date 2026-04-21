import "server-only";
import { Resend } from "resend";

/**
 * Thin wrapper around Resend so the rest of the site doesn't need to know
 * which provider we use. Never throws for missing env at module load — we
 * check at send-time so local development without a key still renders pages.
 */

const FROM = process.env.CONTACT_FROM ?? "Avrentis <hello@avrentis.com>";
const INBOX = process.env.CONTACT_INBOX ?? "hello@avrentis.com";

interface SendParams {
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendContactEmail({ subject, html, replyTo }: SendParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: INBOX,
    subject,
    html,
    replyTo,
  });

  if (error) {
    throw new Error(`Resend failed: ${error.message}`);
  }
}
