import type { ModuleStatus } from "@/lib/brand";

/**
 * The colours of a module's status chip ("Available now" / "Partly available"),
 * per surface it sits on — the one home for what three files each typed. Each
 * pair reads at 4.5:1 or better: on light surfaces the chip has no fill behind
 * the green (a green tint pulled it under 4.5:1); on the ink shell it uses the
 * on-dark green and gold.
 */
export interface StatusChipStyle {
  bg: string;
  color: string;
  border: string;
}

export const MODULE_STATUS_CHIP: Record<"light" | "dark", Record<ModuleStatus, StatusChipStyle>> = {
  light: {
    available: {
      bg: "transparent",
      color: "var(--color-available)",
      border: "1px solid var(--color-success-border)",
    },
    partial: {
      bg: "var(--color-gold-tint)",
      color: "var(--color-gold-on-light)",
      border: "1px solid var(--color-gold-divider)",
    },
  },
  dark: {
    available: {
      bg: "rgba(var(--color-available-rgb), 0.12)",
      color: "var(--color-available-on-dark)",
      border: "1px solid rgba(var(--color-available-rgb), 0.3)",
    },
    partial: {
      bg: "var(--color-gold-tint)",
      color: "var(--color-gold)",
      border: "1px solid var(--color-gold-border)",
    },
  },
};
