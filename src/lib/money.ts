/* ── Money display ───────────────────────────────────────────── */

import { formatMoney } from "@avrentishq/core/money/format";
import { CURRENCIES, isCurrencyCode } from "@avrentishq/core/money/types";

// Its own module, not part of `@/lib/pricing`: the pricing card is a client
// component, and a formatter imported from there would hand the browser bundle
// the module that holds the cold-start fallback JSON and the API origin.

/**
 * A whole-unit price for display: "₦300,000", "$215".
 *
 * Goes through core's `formatMoney` — the product's one money formatter — fed
 * minor units, so the site and the app print the same figure the same way. The
 * old local version kept its own symbol table and called `toLocaleString()` with
 * no locale, which grouped digits by the VISITOR's browser language (a server
 * render and a French browser could disagree on the same card). A currency core
 * does not know is printed by its code rather than guessed.
 */
export function formatCurrencyAmount(amount: number, currency: string): string {
  if (!isCurrencyCode(currency)) {
    return `${currency} ${new Intl.NumberFormat("en").format(amount)}`;
  }
  const minorUnits = Math.round(amount * 10 ** CURRENCIES[currency].minorUnit);
  return formatMoney({ amount: minorUnits, currency }, { showDecimals: false });
}

/** Whole counts are grouped one way everywhere, never by the visitor's browser language. */
const COUNT_FORMAT = new Intl.NumberFormat("en", { maximumFractionDigits: 0 });

/**
 * A whole count for display — "1,250" — rounded, and grouped identically on
 * the server and in every browser (a bare `toLocaleString()` follows the
 * visitor's language, so a French browser and the server render disagree).
 */
export function formatCount(value: number): string {
  return COUNT_FORMAT.format(Math.round(value));
}

/** The symbol core prints for `currency` — for a money input's prefix. */
export function currencySymbol(currency: string): string {
  return isCurrencyCode(currency) ? CURRENCIES[currency].symbol : currency;
}
