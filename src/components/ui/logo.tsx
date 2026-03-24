/**
 * Avrentis Logo System — Geometric Triangle Mark
 *
 * The mark is a nested triangle construction: an outer triangle containing
 * a smaller inner triangle with a horizontal crossbar at the golden ratio.
 * The crossbar extends beyond the inner diagonals on both sides.
 *
 * All geometry is derived from proportional constants — no hardcoded pixels.
 */

import { cn } from "@/lib/utils";

// ── Brand colours ────────────────────────────────────────────────────────

const NAVY_HEX = "#0F172A";
const GOLD_HEX = "#C68B2F";
const WHITE = "var(--color-inverse)";
const NAVY_VAR = "var(--color-primary-800)";
const BLACK = "#000000";
const TRANSPARENT = "transparent";

// ── Types ────────────────────────────────────────────────────────────────

type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoVariant = "horizontal" | "stacked" | "mark" | "wordmark";
type LogoTheme = "primary" | "reversed" | "mono-dark" | "mono-light";

// ── Size scale ───────────────────────────────────────────────────────────

const MARK_SIZES: Record<LogoSize, number> = {
  sm: 24,
  md: 36,
  lg: 48,
  xl: 64,
};

const WORDMARK_SIZES: Record<LogoSize, number> = {
  sm: 13,
  md: 14,
  lg: 18,
  xl: 24,
};

const GAP_SIZES: Record<LogoSize, number> = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 18,
};

const STACKED_GAP: Record<LogoSize, number> = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
};

// ── Theme colours ────────────────────────────────────────────────────────

function getThemeColors(theme: LogoTheme) {
  switch (theme) {
    case "primary":
      return {
        containerFill: NAVY_HEX,
        stroke: GOLD_HEX,
        wordmark: WHITE,
        containerBorder: "rgba(198,139,47,0.2)",
        ghost: true,
      };
    case "reversed":
      return {
        containerFill: GOLD_HEX,
        stroke: NAVY_HEX,
        wordmark: NAVY_VAR,
        containerBorder: undefined,
        ghost: false,
      };
    case "mono-dark":
      return {
        containerFill: BLACK,
        stroke: "#FFFFFF",
        wordmark: WHITE,
        containerBorder: undefined,
        ghost: false,
      };
    case "mono-light":
      return {
        containerFill: TRANSPARENT,
        stroke: NAVY_HEX,
        wordmark: NAVY_VAR,
        containerBorder: NAVY_HEX,
        ghost: false,
      };
  }
}

// ── Geometry computation — equalized proportion system ────────────────────

function computeMarkGeometry(size: number) {
  // ── Proportional constants ─────────────────────────────
  const CONTAINER_PADDING = 0.14;
  const INNER_SCALE = 0.52;
  const INNER_TOP_OFFSET = 0.18;
  const GOLDEN_RATIO = 0.382;
  const CROSSBAR_EXTENSION = 0.07;
  const OPTICAL_SHIFT = 0.02;
  const CONTAINER_RX = 0.2;
  const STROKE_OUTER = 0.055;
  const STROKE_INNER = 0.038;
  const GHOST_PADDING = 0.07;

  // ── Derived values ─────────────────────────────────────
  const cx = size / 2;

  // Outer triangle
  const pad = size * CONTAINER_PADDING;
  const triW = size - pad * 2;
  const triH = triW * (Math.sqrt(3) / 2);

  // Optical centre correction
  const shift = size * OPTICAL_SHIFT;
  const topY = (size - triH) / 2 - shift;
  const botY = topY + triH;
  const leftX = cx - triW / 2;
  const rightX = cx + triW / 2;

  // Inner triangle
  const iW = triW * INNER_SCALE;
  const iH = iW * (Math.sqrt(3) / 2);
  const iTopY = topY + triH * INNER_TOP_OFFSET;
  const iBotY = iTopY + iH;

  // Crossbar
  const cbY = iTopY + iH * GOLDEN_RATIO;
  const prog = (cbY - iTopY) / (iBotY - iTopY);
  const cbLi = cx + (cx - iW / 2 - cx) * prog;
  const cbRi = cx + (cx + iW / 2 - cx) * prog;
  const ext = iW * CROSSBAR_EXTENSION;
  const cbX1 = cbLi - ext;
  const cbX2 = cbRi + ext;

  // Ghost triangle
  const gPad = size * GHOST_PADDING;
  const gW = size - gPad * 2;
  const gH = gW * (Math.sqrt(3) / 2);
  const gTopY = (size - gH) / 2 - shift;
  const gBotY = gTopY + gH;
  const gLX = cx - gW / 2;
  const gRX = cx + gW / 2;

  // Derived stroke weights and radius
  const rx = size * CONTAINER_RX;
  const sw1 = size * STROKE_OUTER;
  const sw2 = size * STROKE_INNER;
  const gSW = size * 0.015;

  return {
    container: { rx, sw: 0.5 },
    outer: {
      apex: { x: cx, y: topY },
      left: { x: leftX, y: botY },
      right: { x: rightX, y: botY },
      sw: sw1,
    },
    inner: {
      apex: { x: cx, y: iTopY },
      left: { x: cx - iW / 2, y: iBotY },
      right: { x: cx + iW / 2, y: iBotY },
      sw: sw2,
    },
    crossbar: { y: cbY, x1: cbX1, x2: cbX2, sw: sw2 },
    ghost: {
      apex: { x: cx, y: gTopY },
      left: { x: gLX, y: gBotY },
      right: { x: gRX, y: gBotY },
      sw: gSW,
    },
  };
}

// ── LogoMark (geometric triangle) ────────────────────────────────────────

interface LogoMarkProps {
  theme?: LogoTheme;
  size?: number;
  className?: string;
}

export function LogoMark({ theme = "primary", size = 36, className }: LogoMarkProps) {
  const colors = getThemeColors(theme);
  const geo = computeMarkGeometry(size);

  const outerPath = `M${geo.outer.apex.x},${geo.outer.apex.y} L${geo.outer.left.x},${geo.outer.left.y} L${geo.outer.right.x},${geo.outer.right.y} Z`;
  const innerPath = `M${geo.inner.apex.x},${geo.inner.apex.y} L${geo.inner.left.x},${geo.inner.left.y} L${geo.inner.right.x},${geo.inner.right.y} Z`;
  const ghostPath = `M${geo.ghost.apex.x},${geo.ghost.apex.y} L${geo.ghost.right.x},${geo.ghost.right.y} L${geo.ghost.left.x},${geo.ghost.left.y} Z`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
      aria-hidden="true"
    >
      {/* 1. Container */}
      <rect
        width={size}
        height={size}
        rx={geo.container.rx}
        fill={colors.containerFill}
        stroke={colors.containerBorder}
        strokeWidth={colors.containerBorder ? geo.container.sw : 0}
      />

      {/* 2. Ghost triangle — primary only */}
      {colors.ghost && (
        <path
          d={ghostPath}
          fill="rgba(198,139,47,0.07)"
          stroke="rgba(198,139,47,0.18)"
          strokeWidth={geo.ghost.sw}
          strokeLinejoin="round"
        />
      )}

      {/* 3. Outer triangle */}
      <path
        d={outerPath}
        stroke={colors.stroke}
        strokeWidth={geo.outer.sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* 4. Inner triangle */}
      <path
        d={innerPath}
        stroke={colors.stroke}
        strokeWidth={geo.inner.sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* 5. Crossbar */}
      <line
        x1={geo.crossbar.x1}
        y1={geo.crossbar.y}
        x2={geo.crossbar.x2}
        y2={geo.crossbar.y}
        stroke={colors.stroke}
        strokeWidth={geo.crossbar.sw}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── LogoWordmark (text only) ─────────────────────────────────────────────

interface LogoWordmarkProps {
  theme?: LogoTheme;
  size?: LogoSize;
  /** When paired with the mark (sidebar, login), uses heavier weight */
  paired?: boolean;
  className?: string;
}

export function LogoWordmark({
  theme = "primary",
  size = "md",
  paired = false,
  className,
}: LogoWordmarkProps) {
  const colors = getThemeColors(theme);

  const fontSize = paired ? 15 : WORDMARK_SIZES[size];
  const color = paired && theme === "primary" ? GOLD_HEX : colors.wordmark;

  return (
    <span
      role="img"
      aria-label="Avrentis"
      className={cn("inline-block", className)}
      style={{
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        fontWeight: 600,
        fontSize,
        letterSpacing: "0.10em",
        color,
        lineHeight: 1,
        textTransform: "uppercase" as const,
      }}
    >
      AVRENTIS
    </span>
  );
}

// ── Logo (full system) ───────────────────────────────────────────────────

interface LogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  size?: LogoSize;
  className?: string;
}

export default function Logo({
  variant = "horizontal",
  theme = "primary",
  size = "md",
  className,
}: LogoProps) {
  const markSize = MARK_SIZES[size];

  if (variant === "mark") {
    return (
      <span role="img" aria-label="Avrentis" className={className}>
        <LogoMark theme={theme} size={markSize} />
      </span>
    );
  }

  if (variant === "wordmark") {
    return <LogoWordmark theme={theme} size={size} className={className} />;
  }

  if (variant === "stacked") {
    return (
      <span
        role="img"
        aria-label="Avrentis"
        className={cn("inline-flex flex-col items-center", className)}
        style={{ gap: STACKED_GAP[size] }}
      >
        <LogoMark theme={theme} size={markSize} />
        <LogoWordmark theme={theme} size={size} paired />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label="Avrentis"
      className={cn("inline-flex items-center", className)}
      style={{ gap: GAP_SIZES[size] }}
    >
      <LogoMark theme={theme} size={markSize} />
      <LogoWordmark theme={theme} size={size} paired />
    </span>
  );
}

export { Logo };
