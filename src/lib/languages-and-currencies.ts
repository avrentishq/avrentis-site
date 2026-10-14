import { CURRENCIES, SUPPORTED_CURRENCY_CODES } from "@avrentishq/core/money/types";
import { LOCALES } from "@avrentishq/core/locales";

/**
 * The currencies a document can be raised in and the languages the product's
 * interface reads in — both read from core, the lists the product itself uses,
 * so a currency or language added there reaches the site's copy with no edit.
 *
 * Formatted in a fixed British English locale (the site's own), never the
 * visitor's: the server render and the browser must produce the same words.
 */

const englishList = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" });
const languageNames = new Intl.DisplayNames(["en-GB"], { type: "language", fallback: "none" });

/** How many currencies a document can be raised in. */
export const SUPPORTED_CURRENCY_COUNT = SUPPORTED_CURRENCY_CODES.length;

/** "Nigerian Naira, US Dollar, … and West African CFA Franc". */
export const SUPPORTED_CURRENCY_NAMES = englishList.format(
  SUPPORTED_CURRENCY_CODES.map((code) => CURRENCIES[code].name),
);

/** "English, French and Portuguese". */
export const INTERFACE_LANGUAGE_NAMES = englishList.format(
  LOCALES.map((locale) => {
    const name = languageNames.of(locale);
    if (!name) throw new Error(`No English name for interface language "${locale}"`);
    return name;
  }),
);
