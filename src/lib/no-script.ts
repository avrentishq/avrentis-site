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
 *
 * Two markers serve forms that must work without JavaScript:
 *   - `data-js-only` — a control that does nothing without script (a chip
 *     group, a custom picker, a step's Continue/Back). Hidden; a native
 *     fallback rendered in <noscript> stands in for it.
 *   - `data-form-step` — one step of a multi-step form. Every step is shown,
 *     so the form reads as one page and posts in one go.
 */

/** The inline-style fragments of an element that starts hidden for an entry animation. */
const HIDDEN_ENTRY_INFIX = "opacity:0;";
const HIDDEN_ENTRY_SUFFIX = "opacity:0";

/** Whether a server-rendered inline style is a hidden entry state (mirrors the CSS selector). */
export function startsHidden(style: string): boolean {
  return style.includes(HIDDEN_ENTRY_INFIX) || style.endsWith(HIDDEN_ENTRY_SUFFIX);
}

const JS_ONLY_ATTRIBUTE = "data-js-only";
const FORM_STEP_ATTRIBUTE = "data-form-step";

/** Spread onto a control that does nothing without script; hidden when scripts are off. */
export const JS_ONLY = { [JS_ONLY_ATTRIBUTE]: "" } as const;
/** Spread onto one step of a multi-step form; every step shows when scripts are off. */
export const FORM_STEP = { [FORM_STEP_ATTRIBUTE]: "" } as const;

export const NO_SCRIPT_CSS = [
  `[style*="${HIDDEN_ENTRY_INFIX}"],[style$="${HIDDEN_ENTRY_SUFFIX}"]{opacity:1!important;transform:none!important}`,
  `[${JS_ONLY_ATTRIBUTE}]{display:none!important}`,
  `[${FORM_STEP_ATTRIBUTE}]{display:flex!important}`,
].join("\n");
