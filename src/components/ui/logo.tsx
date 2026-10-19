/**
 * The brand mark and lockup (mark + wordmark).
 *
 * The mark is DRAWING DATA owned by core (`BRAND_MARK`): role-tagged shapes on
 * a square canvas. This component only decides the colour of each role — the
 * shapes come from `markShapesAt(size)`, so a new logo is a new drawing in core,
 * never an edit here.
 *
 * Variants:
 *   primary          — the default lockup: accent container, primary mark, FIXED
 *                      in both themes (navbars, sidebars, auth panels sit on
 *                      always-dark chrome). Theme-invariant `--color-logo-*` tokens.
 *   reversed         — primary container, accent mark (core's MARK_VARIANTS).
 *   transparent-gold — accent mark, no container (dark surfaces).
 *   transparent-navy — primary mark, no container (light surfaces; flips with the
 *                      theme so it stays readable in dark mode).
 */

import {
  BRAND,
  type MarkRole,
  type MarkShape,
  type MarkVariant,
  BRAND_MARK,
  markShapesAt,
  WORDMARK_SPEC,
} from "@/lib/brand";

// The standalone SVG-string serializer, re-exported so existing
// `@/components/ui/logo` importers keep one import path.
export { brandMarkSvgString } from "@/lib/brand";

interface BrandMarkProps {
  size?: number;
  variant?: MarkVariant;
  className?: string;
}

interface BrandLogoProps extends BrandMarkProps {
  showWordmark?: boolean;
  wordmarkColor?: string;
}

interface VariantColors {
  /** `none` → the container shape is not drawn. */
  container: string;
  stroke: string;
  slot: string;
  /** Hairline round the container, or `none`. */
  border: string;
}

// ── Colour engine: which colour each role is painted in ─────────────────────
// CSS-driven, so it works in server components without a JS theme read.

function getColors(variant: MarkVariant): VariantColors {
  switch (variant) {
    case "primary":
      return {
        container: "var(--color-logo-container)",
        stroke: "var(--color-logo-mark)",
        slot: "var(--color-logo-mark)",
        border: "color-mix(in srgb, var(--color-logo-mark) 20%, transparent)",
      };
    case "reversed":
      return {
        container: "var(--color-logo-mark)",
        stroke: "var(--color-logo-container)",
        slot: "var(--color-logo-container)",
        border: "color-mix(in srgb, var(--color-logo-container) 20%, transparent)",
      };
    case "transparent-gold":
      return {
        container: "none",
        stroke: "var(--color-accent)",
        slot: "var(--color-accent)",
        border: "none",
      };
    case "transparent-navy":
      return {
        container: "none",
        stroke: "var(--color-primary-800)",
        slot: "var(--color-primary-800)",
        border: "none",
      };
  }
}

function fillFor(role: MarkRole, colors: VariantColors): string {
  if (role === "container") return colors.container;
  return role === "slot" ? colors.slot : colors.stroke;
}

function Shape({
  shape,
  colors,
  hairline,
}: {
  shape: MarkShape;
  colors: VariantColors;
  hairline: number;
}) {
  const fill = fillFor(shape.role, colors);
  if (shape.kind === "path") return <path d={shape.d} fill={fill} opacity={shape.opacity} />;
  const outlined = shape.role === "container" && colors.border !== "none";
  return (
    <rect
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      rx={shape.radius}
      fill={fill}
      opacity={shape.opacity}
      stroke={outlined ? colors.border : undefined}
      strokeWidth={outlined ? hairline : undefined}
    />
  );
}

// ── Mark ────────────────────────────────────────────────────────────────────

export function BrandMark({ size = 44, variant = "primary", className }: BrandMarkProps) {
  const colors = getColors(variant);
  const shapes = markShapesAt(size, { includeContainer: colors.container !== "none" });
  // A 0.5px hairline, expressed in canvas units (the SVG scales the canvas to `size`).
  const hairline = 0.5 * (BRAND_MARK.canvas / size);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${BRAND_MARK.canvas} ${BRAND_MARK.canvas}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={BRAND.name}
      role="img"
    >
      {shapes.map((shape, index) => (
        <Shape key={index} shape={shape} colors={colors} hairline={hairline} />
      ))}
    </svg>
  );
}

// ── Logo (mark + wordmark) ──────────────────────────────────────────────────

export function BrandLogo({
  size = 44,
  variant = "primary",
  showWordmark = true,
  wordmarkColor,
  className,
}: BrandLogoProps) {
  const defaultWordmarkColor =
    variant === "transparent-navy" ? "var(--color-primary-800)" : "var(--color-white)";

  return (
    <div
      className={["flex items-end", className].filter(Boolean).join(" ")}
      style={{ gap: Math.round(size * WORDMARK_SPEC.gapFactor) }}
    >
      <BrandMark size={size} variant={variant} />
      {showWordmark && (
        <span
          className="av-wordmark"
          style={{
            fontFamily: "var(--font-wordmark)",
            fontWeight: WORDMARK_SPEC.weight,
            fontSize: size * WORDMARK_SPEC.sizeFactor,
            letterSpacing: `${WORDMARK_SPEC.tracking}em`,
            color: wordmarkColor ?? defaultWordmarkColor,
            lineHeight: 1,
            textTransform: "uppercase" as const,
            // Lift the cap-trimmed wordmark so its baseline lands where the mark
            // drawing says (lift === size × WORDMARK_SPEC.baselineLiftFactor).
            marginBottom: size * WORDMARK_SPEC.baselineLiftFactor,
          }}
        >
          {BRAND.name}
        </span>
      )}
    </div>
  );
}

export default BrandLogo;
