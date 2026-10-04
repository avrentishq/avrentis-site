import { BRAND_COLORS } from "@/lib/brand";

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
  textPrimary: "#0f172a",
  /** --color-text-muted */
  textMuted: "#64748b",
  /** --color-text-subtle */
  textSubtle: "#94a3b8",
  /** --color-white */
  white: "#ffffff",
  /** --color-gold (brand) */
  gold: BRAND_COLORS.gold,
  /** --color-navy-primary (brand) */
  navy: BRAND_COLORS.navy,
} as const;
