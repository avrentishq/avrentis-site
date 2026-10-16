/**
 * Organisation-size options — single source of truth for the whole site.
 *
 * The bands are core's (`trial/request-terms`), the list the app's trial API
 * accepts; the trial form, its server action and the contact form present them. "21–50" carries an honest "Most common" marker and
 * is the trial's pre-selected default.
 */

import { DEFAULT_ORG_SIZE, ORG_SIZES, isOrgSize, type OrgSize } from "@avrentishq/core/trial/request-terms";

export { DEFAULT_ORG_SIZE, ORG_SIZES, isOrgSize, type OrgSize };

interface OrgSizeOption {
  value: string;
  label: string;
  badge?: string;
}

export const ORG_SIZE_OPTIONS: OrgSizeOption[] = ORG_SIZES.map((value) => ({
  value,
  label: value,
  badge: value === DEFAULT_ORG_SIZE ? "Most common" : undefined,
}));
