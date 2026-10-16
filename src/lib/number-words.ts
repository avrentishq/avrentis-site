/**
 * A whole number in British English words — "eight hundred and fifty
 * thousand", "four". Used where the site writes a figure out in words (a
 * voucher's amount line, a heading that counts the lifecycle's stages) so the
 * words can never disagree with the number they spell. Written here rather
 * than through `Intl`, which has no spell-out format, so the server and every
 * browser produce the same words.
 */

const UNITS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
] as const;

const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"] as const;

const SCALES = [
  { value: 1_000_000_000, word: "billion" },
  { value: 1_000_000, word: "million" },
  { value: 1_000, word: "thousand" },
] as const;

/** 0–999 in words; `and` joins the hundreds to the rest, the British way. */
function belowThousand(value: number): string {
  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  const parts: string[] = [];
  if (hundreds > 0) parts.push(`${UNITS[hundreds]} hundred`);
  if (remainder > 0) {
    const remainderWords =
      remainder < 20
        ? UNITS[remainder]
        : `${TENS[Math.floor(remainder / 10)]}${remainder % 10 ? `-${UNITS[remainder % 10]}` : ""}`;
    parts.push(remainderWords);
  }
  return parts.join(" and ");
}

export function numberInWords(value: number): string {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`numberInWords takes a non-negative whole number, got ${value}`);
  }
  if (value === 0) return UNITS[0];

  const parts: string[] = [];
  let remaining = value;
  for (const scale of SCALES) {
    const count = Math.floor(remaining / scale.value);
    if (count > 0) {
      parts.push(`${numberInWords(count)} ${scale.word}`);
      remaining %= scale.value;
    }
  }
  if (remaining > 0) {
    // "one thousand and five": a trailing part under a hundred after a scale word takes "and".
    const tail = belowThousand(remaining);
    parts.push(parts.length > 0 && remaining < 100 ? `and ${tail}` : tail);
  }
  return parts.join(" ");
}

/** Words with a capital first letter — for the start of a sentence. */
export function capitaliseFirst(words: string): string {
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** A number in words with a capital first letter — "Four". */
export function capitalisedNumberInWords(value: number): string {
  return capitaliseFirst(numberInWords(value));
}
