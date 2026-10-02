/**
 * ISO 3166-1 alpha-2 country options for the trial form. Only valid alpha-2
 * codes are offered; display names via Intl.DisplayNames.
 *
 * The countries the platform sets up on its own — currency, tax, bank-account
 * formats, working week, retention — are core's `COUNTRY_CODES`
 * (`@avrentishq/core/region/countries`, type-only imports, so no peer
 * dependencies). They are offered first. Any other country is still accepted:
 * the platform queues that request for its team to choose the setup.
 */

import { COUNTRY_CODES } from "@avrentishq/core/region/countries";

const ISO_3166_ALPHA2_CODES = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT",
  "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI",
  "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY",
  "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
  "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM",
  "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK",
  "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL",
  "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM",
  "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR",
  "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN",
  "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS",
  "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK",
  "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW",
  "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP",
  "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM",
  "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
  "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM",
  "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF",
  "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW",
  "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI",
  "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW",
] as const;

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

export interface CountryOption {
  code: string;
  name: string;
}

const byName = (a: CountryOption, b: CountryOption) => a.name.localeCompare(b.name);
const optionFor = (code: string): CountryOption => ({ code, name: regionNames?.of(code) ?? code });
const SERVED = new Set<string>(COUNTRY_CODES);

/** Countries the platform sets up automatically, sorted by display name. */
export const SERVED_COUNTRIES: CountryOption[] = COUNTRY_CODES.map(optionFor).sort(byName);

/** Every selectable country: the served ones first, then the rest, each sorted by name. */
export const COUNTRIES: CountryOption[] = [
  ...SERVED_COUNTRIES,
  ...ISO_3166_ALPHA2_CODES.filter((code) => !SERVED.has(code))
    .map(optionFor)
    .sort(byName),
];

const SELECTABLE = new Set<string>(ISO_3166_ALPHA2_CODES);

/** Whether `code` (upper-case alpha-2) is one the form offers — the server action's check. */
export function isSelectableCountry(code: string): boolean {
  return SELECTABLE.has(code);
}

/** Whether the platform sets `code` up on its own (vs. a request its team completes). */
export function isServedCountry(code: string): boolean {
  return SERVED.has(code);
}
