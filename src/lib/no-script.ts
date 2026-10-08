/**
 * What the page needs when JavaScript is off. The root layout renders
 * NO_SCRIPT_CSS inside <noscript>, so none of it applies when scripts run.
 *
 * Entry animations (framer-motion `initial="hidden"`, e.g. `fadeUp`) are
 * written into the server HTML as inline `opacity:0;transform:…`, and only
 * script ever reveals them. Without JavaScript almost every page would render
 * blank: headings, copy and forms all at zero opacity. The rule below shows
 * them at their resting state instead.
 *
 * It matches the exact text React writes for a hidden entry state:
 * `opacity:0` followed by `;`, or at the end of the style. Deliberately faint
 * layers are written as `opacity:0.05`, `opacity:0.3` and so on, and never
 * match.
 */

/** The inline-style fragments of an element that starts hidden for an entry animation. */
const HIDDEN_ENTRY_INFIX = "opacity:0;";
const HIDDEN_ENTRY_SUFFIX = "opacity:0";

/** Whether a server-rendered inline style is a hidden entry state (mirrors the CSS selector). */
export function startsHidden(style: string): boolean {
  return style.includes(HIDDEN_ENTRY_INFIX) || style.endsWith(HIDDEN_ENTRY_SUFFIX);
}

export const NO_SCRIPT_CSS = [
  `[style*="${HIDDEN_ENTRY_INFIX}"],[style$="${HIDDEN_ENTRY_SUFFIX}"]{opacity:1!important;transform:none!important}`,
].join("\n");
