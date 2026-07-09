/**
 * AVRENTIS Gate Mark — architectural two-post gate with beam, ledger,
 * document slot, and full-bleed ledger line.
 *
 * Four variants:
 *   primary          — the default lockup: FIXED navy mark on gold container in
 *                      BOTH themes (navbars, sidebars, auth panels). Its surfaces
 *                      are always navy chrome, so the gold lockup must not invert.
 *                      Driven by the theme-invariant --color-logo-* tokens.
 *   reversed         — navy mark on gold container (fixed, both themes)
 *   transparent-gold — gold mark, no background (dark surfaces)
 *   transparent-navy — navy mark, no background (light surfaces)
 *
 * All proportions derived from a single base unit: U = size × 0.10
 */

import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { type MarkVariant, getProps, WORDMARK_SPEC } from "@avrentishq/core/brand";

// The gate-mark geometry (getProps), the wordmark spec, and the variant type
// come from the brand SSOT. The standalone SVG-string serializer is re-exported
// so existing `@/components/ui/logo` importers keep working.
export { avrentisMarkSvgString } from "@avrentishq/core/brand";

interface AvrentisMarkProps {
  size?: number;
  variant?: MarkVariant;
  className?: string;
}

interface AvrentisLogoProps extends AvrentisMarkProps {
  showWordmark?: boolean;
  wordmarkColor?: string;
}

// ── Colour engine ─────────────────────────────────────────────────────────────
// (Proportion engine `getProps` lives in @avrentishq/core/brand — imported above.)

function getColors(variant: MarkVariant) {
  switch (variant) {
    case "primary":
      // FIXED navy-on-gold lockup in both themes (gold container + navy gate),
      // via the theme-invariant --color-logo-* tokens (globals.css). The mark
      // only sits on always-navy chrome, so it must NOT invert per theme.
      // CSS-driven so it works in server components without a JS theme read.
      return {
        container: "var(--color-logo-container)",
        stroke: "var(--color-logo-mark)",
        slot: "var(--color-logo-mark)",
        slotOpacity: 0.35,
        border: "color-mix(in srgb, var(--color-logo-mark) 20%, transparent)",
        transparent: false,
      };
    case "reversed":
      return {
        container: "var(--color-accent)",
        stroke: "var(--color-primary-800)",
        slot: "var(--color-primary-800)",
        slotOpacity: 0.35,
        border: "none",
        transparent: false,
      };
    case "transparent-gold":
      return {
        container: "none",
        stroke: "var(--color-accent)",
        slot: "var(--color-accent)",
        slotOpacity: 0.35,
        border: "none",
        transparent: true,
      };
    case "transparent-navy":
      return {
        container: "none",
        stroke: "var(--color-primary-800)",
        slot: "var(--color-primary-800)",
        slotOpacity: 0.35,
        border: "none",
        transparent: true,
      };
  }
}

// ── Mark component ────────────────────────────────────────────────────────────

export function AvrentisMark({ size = 44, variant = "primary", className }: AvrentisMarkProps) {
  const p = getProps(size);
  const c = getColors(variant);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AVRENTIS"
      role="img"
    >
      {/* Container */}
      {c.container !== "none" && (
        <rect
          width={size}
          height={size}
          rx={p.rx}
          fill={c.container}
          stroke={c.border !== "none" ? c.border : undefined}
          strokeWidth={c.border !== "none" ? 0.5 : undefined}
        />
      )}

      {/* Beam */}
      <rect x={p.beamX} y={p.beamY} width={p.beamW} height={p.beamH} fill={c.stroke} />

      {/* Left post */}
      <rect x={p.leftPostX} y={p.postY} width={p.leftPostW} height={p.postH} fill={c.stroke} />

      {/* Right post — optically narrower */}
      <rect x={p.rightPostX} y={p.postY} width={p.rightPostW} height={p.postH} fill={c.stroke} />

      {/* Document slot — golden ratio position, suppressed below 48px */}
      {size >= 48 && (
        <rect
          x={p.slotX}
          y={p.slotY}
          width={p.slotW}
          height={p.slotH}
          fill={c.slot}
          opacity={c.slotOpacity}
        />
      )}

      {/* Ledger — ALWAYS full-bleed (edge-to-edge), every variant */}
      <rect x={p.ledgerX} y={p.ledgerY} width={p.ledgerW} height={p.ledgerH} fill={c.stroke} />
    </svg>
  );
}

// ── Logo (mark + wordmark) ────────────────────────────────────────────────────

export function AvrentisLogo({
  size = 44,
  variant = "primary",
  showWordmark = true,
  wordmarkColor,
  className,
}: AvrentisLogoProps) {
  const defaultWordmarkColor =
    variant === "transparent-navy" ? "var(--color-primary-800)" : "#ffffff";
  const wColor = wordmarkColor ?? defaultWordmarkColor;

  return (
    <div
      className={cn("flex items-end", className)}
      style={{ gap: Math.round(size * WORDMARK_SPEC.gapFactor) }}
    >
      <AvrentisMark size={size} variant={variant} />
      {showWordmark && (
        <span
          className="av-wordmark"
          style={{
            fontFamily: 'var(--font-wordmark, "Helvetica Neue"), Helvetica, Arial, sans-serif',
            fontWeight: WORDMARK_SPEC.weight,
            fontSize: size * WORDMARK_SPEC.sizeFactor,
            letterSpacing: `${WORDMARK_SPEC.tracking}em`,
            color: wColor,
            lineHeight: 1,
            textTransform: "uppercase" as const,
            // Lift the cap-trimmed wordmark so its baseline lands on the gate
            // mark's ledger bottom (lift === size × WORDMARK_SPEC.baselineLiftFactor).
            marginBottom: size * WORDMARK_SPEC.baselineLiftFactor,
          }}
        >
          {BRAND.name}
        </span>
      )}
    </div>
  );
}

export default AvrentisLogo;
