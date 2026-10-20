import { BRAND_COLORS, BRAND_PALETTE } from "@/lib/brand";

/**
 * Colours for renderers that cannot read CSS variables: outbound email HTML
 * (mail clients do not resolve var()) and the Open Graph image (rendered to a
 * PNG outside the page). This is the one module in src/ allowed to write colour
 * values out. Each mirrors the @theme token named in its comment —
 * `colour-tokens.lock.test.ts` fails if they drift — and the brand colours come
 * from core, never re-typed.
 */
export const STATIC_COLORS = {
  /** --color-text-primary */
  textPrimary: BRAND_PALETTE.primary900,
  /** --color-text-muted */
  textMuted: BRAND_PALETTE.textSecondary,
  /** --color-text-subtle */
  textSubtle: BRAND_PALETTE.textSecondary,
  /** --color-white */
  white: "#ffffff",
  /** --color-gold (brand) */
  gold: BRAND_COLORS.accent,
  /** --color-navy-primary (brand) */
  navyPrimary: BRAND_COLORS.primary,
} as const;

/** The font stack outbound email HTML is set in — mail clients load no web fonts. */
export const EMAIL_FONT_STACK = "Helvetica,Arial,sans-serif";
