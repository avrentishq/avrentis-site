import "server-only";
import { EMAIL_FONT_STACK, STATIC_COLORS } from "@/lib/static-colors";

/**
 * The pieces the site's outbound emails are built from — one escape, one
 * header-safe text rule, one table shell and one row shape — so every template
 * renders the same way and none can forget to escape a visitor's words.
 *
 * Mail clients ignore stylesheets and CSS variables, so styles are inline and
 * colours come from `static-colors.ts`.
 */

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Text made safe to place in HTML, inside an element or an attribute value. */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]!);
}

/** Text made safe for an email header (a subject): line breaks become spaces, so no header can be added. */
export function headerSafe(text: string): string {
  return text.replace(/[\r\n]+/g, " ");
}

/** One table row; `contentHtml` must already be escaped. */
export function emailRow(contentHtml: string, style: string): string {
  return `<tr><td style="${style}">${contentHtml}</td></tr>`;
}

/** The small upper-case line that opens an email. `text` is escaped here. */
export function eyebrowRow(text: string, bottomGap: number): string {
  return emailRow(
    escapeHtml(text),
    `padding:0 0 ${bottomGap}px;font-size:12px;color:${STATIC_COLORS.textMuted};letter-spacing:0.08em;text-transform:uppercase;`,
  );
}

interface LabelledRowOptions {
  /** Space below the value, in pixels. */
  bottomGap?: number;
  /** Extra inline style for the value cell (e.g. keeping a message's line breaks). */
  valueStyle?: string;
}

/** A muted label above its value. `label` is escaped here; `valueHtml` must already be. */
export function labelledRow(
  label: string,
  valueHtml: string,
  { bottomGap = 12, valueStyle = "" }: LabelledRowOptions = {},
): string {
  return (
    emailRow(escapeHtml(label), `padding:0 0 4px;color:${STATIC_COLORS.textMuted};font-size:12px;`) +
    emailRow(valueHtml, `padding:0 0 ${bottomGap}px;${valueStyle}`)
  );
}

/** The table every email body sits in. */
export function emailShell(rowsHtml: string[], maxWidth: number): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:${EMAIL_FONT_STACK};font-size:14px;color:${STATIC_COLORS.textPrimary};max-width:${maxWidth}px;">${rowsHtml.join("")}</table>`;
}

/** A single paragraph email body; `contentHtml` must already be escaped. */
export function emailParagraph(contentHtml: string): string {
  return `<p style="font-family:${EMAIL_FONT_STACK};font-size:14px;color:${STATIC_COLORS.textPrimary};">${contentHtml}</p>`;
}

/** A gold link; `href` and `text` are escaped here. */
export function emailLink(href: string, text: string, extraStyle = ""): string {
  return `<a href="${escapeHtml(href)}" style="color:${STATIC_COLORS.gold};text-decoration:none;${extraStyle}">${escapeHtml(text)}</a>`;
}
