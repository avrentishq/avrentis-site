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

type MarkVariant = "primary" | "reversed" | "transparent-gold" | "transparent-navy";

interface AvrentisMarkProps {
  size?: number;
  variant?: MarkVariant;
  className?: string;
}

interface AvrentisLogoProps extends AvrentisMarkProps {
  showWordmark?: boolean;
  wordmarkColor?: string;
}

// ── Proportion engine ─────────────────────────────────────────────────────────

function getProps(size: number) {
  const postH = size * 0.52;
  const passageW = size * 0.321;
  const leftPostW = size * 0.09;
  const rightPostW = size * 0.086;
  const beamH = size * 0.05;
  const ledgerH = size * 0.05;
  const overhang = size * 0.016;
  const rx = size * 0.16;

  const markW = overhang + leftPostW + passageW + rightPostW + overhang;
  const markH = beamH + postH + ledgerH;

  const padH = (size - markW) / 2;
  const padV = (size - markH) / 2;

  const beamX = padH;
  const beamY = padV;
  const beamW = markW;

  const leftPostX = padH + overhang;
  const rightPostX = padH + overhang + leftPostW + passageW;
  const postY = padV + beamH;

  const slotX = leftPostX + leftPostW;
  const slotY = postY + postH * 0.618;
  const slotW = passageW;
  const slotH = Math.max(2, size * 0.004);

  const ledgerY = postY + postH;

  // The ledger is ALWAYS full-bleed — edge-to-edge across the mark's box (0 → size)
  // in every variant, contained AND transparent. The wide base is the Gate Mark's
  // signature; the beam still spans only the posts, so the silhouette stays
  // narrow-top / wide-base. Ledger thickness === beam thickness (both size × 0.05).
  const ledgerX = 0;
  const ledgerW = size;

  return {
    rx,
    beamX,
    beamY,
    beamW,
    beamH,
    leftPostX,
    rightPostX,
    postY,
    leftPostW,
    rightPostW,
    postH,
    slotX,
    slotY,
    slotW,
    slotH,
    ledgerY,
    ledgerH,
    ledgerX,
    ledgerW,
  };
}

// ── Colour engine ─────────────────────────────────────────────────────────────

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
    <div className={cn("flex items-center", className)} style={{ gap: Math.round(size * 0.25) }}>
      <AvrentisMark size={size} variant={variant} />
      {showWordmark && (
        <span
          style={{
            fontFamily: 'var(--font-wordmark, "Helvetica Neue"), Helvetica, Arial, sans-serif',
            fontWeight: 700,
            fontSize: size * 0.46,
            letterSpacing: "0.15em",
            color: wColor,
            lineHeight: 1,
            textTransform: "uppercase" as const,
          }}
        >
          {BRAND.name}
        </span>
      )}
    </div>
  );
}

export default AvrentisLogo;
