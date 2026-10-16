/**
 * Organisation-size options — single source of truth for the whole site.
 *
 * The trial form, its server action and the contact form all present and
 * accept these bands. (The platform stores the trial's band as text and does
 * not check it against a list of its own.) "21–50" carries an honest "Most common" marker and
 * is the trial's pre-selected default.
 */

export const ORG_SIZES = ["1–20", "21–50", "51–200", "200+"] as const;

export type OrgSize = (typeof ORG_SIZES)[number];

export const DEFAULT_ORG_SIZE: OrgSize = "21–50";

/** Whether a posted value is one of the bands. */
export function isOrgSize(value: string): value is OrgSize {
  return (ORG_SIZES as readonly string[]).includes(value);
}

export interface OrgSizeOption {
  value: string;
  label: string;
  badge?: string;
}

export const ORG_SIZE_OPTIONS: OrgSizeOption[] = ORG_SIZES.map((value) => ({
  value,
  label: value,
  badge: value === DEFAULT_ORG_SIZE ? "Most common" : undefined,
}));
