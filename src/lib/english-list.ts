/**
 * Join words into an English list — "A, B and C" / "A, B or C" — in the site's
 * fixed British locale, never the visitor's, so the server render and the
 * browser produce the same words. The one list formatter every sentence uses.
 */
const FORMATTERS = {
  conjunction: new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" }),
  disjunction: new Intl.ListFormat("en-GB", { style: "long", type: "disjunction" }),
} as const;

export function formatEnglishList(
  items: readonly string[],
  joiner: keyof typeof FORMATTERS = "conjunction",
): string {
  return FORMATTERS[joiner].format(items);
}
