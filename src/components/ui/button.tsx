import type { CSSProperties, ComponentProps } from "react";
import Link from "next/link";
import { cssTransition } from "@/lib/animations";

/**
 * The site's call-to-action buttons — the one home of the gold primary and
 * the outlined secondary. Every CTA renders through `ButtonLink` (a next/link)
 * or spreads `buttonProps(...)` onto the element it must stay (`<a>`,
 * `<button>`, `m.a`). ui-kit.lock.test.ts fails on a gold-background button
 * style typed anywhere else.
 *
 * Hover is CSS, not script: `data-button` keys the `:hover` rules in
 * globals.css, so it works in server components and before hydration. The
 * focus ring comes from the surface (src/lib/surfaces.ts), never from here.
 */

export type ButtonVariant = "primary" | "secondary";
/** The background the button sits on — decides the secondary's colours. */
export type ButtonSurface = "light" | "dark";
/**
 * xs: a one-click action inside a mockup row · nav: the navbar pill ·
 * sm: a card or banner action · md: the standard page CTA ·
 * lg: the home hero · xl: the closing banner.
 */
export type ButtonSize = "xs" | "nav" | "sm" | "md" | "lg" | "xl";

export interface ButtonOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  surface?: ButtonSurface;
  fullWidth?: boolean;
  /** A primary that cannot be pressed yet (form not complete, request pending). */
  disabled?: boolean;
  /** Layout-only additions at the call site (margin, flex-shrink). */
  style?: CSSProperties;
}

const SIZES: Record<ButtonSize, CSSProperties> = {
  xs: { height: "30px", padding: "0 16px", fontSize: "var(--text-xs)", lineHeight: 1 },
  nav: {
    height: "32px",
    padding: "0 16px",
    fontSize: "var(--text-2xs)",
    lineHeight: 1,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  sm: { height: "40px", padding: "0 18px", fontSize: "var(--text-sm)" },
  md: { height: "44px", padding: "0 22px", fontSize: "var(--text-md)" },
  lg: { height: "48px", padding: "0 28px", fontSize: "var(--text-xl)", lineHeight: 1 },
  xl: { height: "52px", padding: "0 32px", fontSize: "var(--text-xl)" },
};

/** Every button is square-cornered: the brand is flat and institutional, not soft. */
const BUTTON_RADIUS = "var(--radius-2xs)";

const SECONDARY: Record<ButtonSurface, CSSProperties> = {
  dark: {
    backgroundColor: "transparent",
    color: "var(--color-white)",
    border: "1px solid var(--color-white-border-strong)",
  },
  light: {
    backgroundColor: "transparent",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-border-strong)",
  },
};

/** The `data-button` value globals.css keys each hover rule on. */
export type ButtonHoverKey = "primary" | "secondary-on-dark" | "secondary-on-light";

function hoverKey(variant: ButtonVariant, surface: ButtonSurface): ButtonHoverKey {
  return variant === "primary" ? "primary" : `secondary-on-${surface}`;
}

export function buttonStyle({
  variant = "primary",
  size = "md",
  surface = "dark",
  fullWidth = false,
  disabled = false,
  style,
}: ButtonOptions = {}): CSSProperties {
  const colours: CSSProperties =
    variant === "primary"
      ? {
          backgroundColor: disabled ? "var(--color-gold-hover)" : "var(--color-gold)",
          color: "var(--color-text-primary)",
          border: "none",
        }
      : SECONDARY[surface];
  return {
    // The navbar button is set lighter: at 11px uppercase, 600 reads as shouting.
    fontWeight: variant === "primary" && size !== "nav" ? 600 : 500,
    display: fullWidth ? "flex" : "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    textDecoration: "none",
    borderRadius: BUTTON_RADIUS,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: cssTransition(["background-color", "border-color"]),
    ...SIZES[size],
    ...colours,
    ...(fullWidth ? { width: "100%" } : null),
    ...(disabled ? { opacity: 0.6 } : null),
    ...style,
  };
}

/** Spread on an `<a>`, `<button>` or `m.*` element: its style and hover hook. */
export function buttonProps(options: ButtonOptions = {}) {
  return {
    style: buttonStyle(options),
    "data-button": hoverKey(options.variant ?? "primary", options.surface ?? "dark"),
  };
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "style"> & ButtonOptions;

/** A next/link styled as a CTA. */
export function ButtonLink({
  variant,
  size,
  surface,
  fullWidth,
  disabled,
  style,
  ...linkProps
}: ButtonLinkProps) {
  return (
    <Link
      {...linkProps}
      {...buttonProps({ variant, size, surface, fullWidth, disabled, style })}
    />
  );
}
