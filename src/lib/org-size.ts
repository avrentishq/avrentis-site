/**
 * Organisation-size options — single source of truth for the whole site.
 *
 * The bands mirror the platform's trial allow-list (the trial form is the SSOT),
 * so the trial UI, the trial server-action validation, and the contact form all
 * present the same choices. "21–50" carries an honest "Most common" marker and
 * is the trial's pre-selected default.
 */

export const ORG_SIZES = ["1–20", "21–50", "51–200", "200+"] as const;

export const DEFAULT_ORG_SIZE: string = "21–50";

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
