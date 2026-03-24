/**
 * AVRENTIS Logo System — Gate Mark
 *
 * An architectural two-post gate with beam, ledger, document slot,
 * and full-bleed ledger line. All geometry derived from a single
 * `size` parameter.
 */

import { cn } from "@/lib/utils";

// ── Brand colours ──────────────────────────────────────────────

const NAVY = "#0f172a";
const GOLD = "#C68B2F";

// ── Types ──────────────────────────────────────────────────────

type MarkVariant = "primary" | "reversed" | "transparent-gold" | "transparent-navy";

interface VariantColours {
  containerFill: string | null;
  stroke: string;
  containerBorder: string | null;
  wordmark: string;
  ledgerFullBleed: boolean;
}

// ── Variant colour map ─────────────────────────────────────────

function getVariantColours(variant: MarkVariant): VariantColours {
  switch (variant) {
    case "primary":
      return {
        containerFill: NAVY,
        stroke: GOLD,
        containerBorder: "rgba(198,139,47,0.2)",
        wordmark: "#ffffff",
        ledgerFullBleed: true,
      };
    case "reversed":
      return {
        containerFill: GOLD,
        stroke: NAVY,
        containerBorder: null,
        wordmark: NAVY,
        ledgerFullBleed: true,
      };
    case "transparent-gold":
      return {
        containerFill: null,
        stroke: GOLD,
        containerBorder: null,
        wordmark: "#ffffff",
        ledgerFullBleed: false,
      };
    case "transparent-navy":
      return {
        containerFill: null,
        stroke: NAVY,
        containerBorder: null,
        wordmark: NAVY,
        ledgerFullBleed: false,
      };
  }
}

// ── Geometry engine ────────────────────────────────────────────

function computeGateGeometry(size: number) {
  const postH = size * 0.52;
  const passageW = size * 0.321;
  const leftPostW = size * 0.09;
  const rightPostW = size * 0.086;
  const beamH = size * 0.05;
  const ledgerH = size * 0.05;
  const overhang = size * 0.016;
  const cornerRadius = size * 0.16;

  // Total mark dimensions
  const markW = overhang + leftPostW + passageW + rightPostW + overhang;
  const markH = beamH + postH + ledgerH;

  // Center the mark in the container
  const offsetX = (size - markW) / 2;
  const offsetY = (size - markH) / 2;

  // Beam (top horizontal bar)
  const beam = {
    x: offsetX,
    y: offsetY,
    w: markW,
    h: beamH,
  };

  // Left post
  const leftPost = {
    x: offsetX + overhang,
    y: offsetY + beamH,
    w: leftPostW,
    h: postH,
  };

  // Right post
  const rightPost = {
    x: offsetX + overhang + leftPostW + passageW,
    y: offsetY + beamH,
    w: rightPostW,
    h: postH,
  };

  // Document slot (golden ratio from top of posts)
  const slotY = offsetY + beamH + postH * 0.618;
  const slotH = Math.max(2, size * 0.004);
  const slot = {
    x: offsetX + overhang + leftPostW,
    y: slotY,
    w: passageW,
    h: slotH,
    visible: size >= 48,
  };

  // Ledger line
  const ledger = {
    y: offsetY + beamH + postH,
    h: ledgerH,
    // Full-bleed uses size, mark-width uses markW
    fullBleedX: 0,
    fullBleedW: size,
    markX: offsetX,
    markW: markW,
  };

  return {
    cornerRadius,
    beam,
    leftPost,
    rightPost,
    slot,
    ledger,
  };
}

// ── AvrentisMark ───────────────────────────────────────────────

interface AvrentisMarkProps {
  variant?: MarkVariant;
  size?: number;
  className?: string;
}

export function AvrentisMark({
  variant = "primary",
  size = 44,
  className,
}: AvrentisMarkProps) {
  const colours = getVariantColours(variant);
  const geo = computeGateGeometry(size);
  const hasContainer = colours.containerFill !== null;

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
      {/* Container background */}
      {hasContainer && (
        <rect
          width={size}
          height={size}
          rx={geo.cornerRadius}
          fill={colours.containerFill!}
          stroke={colours.containerBorder ?? "none"}
          strokeWidth={colours.containerBorder ? 0.5 : 0}
        />
      )}

      {/* Beam */}
      <rect
        x={geo.beam.x}
        y={geo.beam.y}
        width={geo.beam.w}
        height={geo.beam.h}
        fill={colours.stroke}
      />

      {/* Left post */}
      <rect
        x={geo.leftPost.x}
        y={geo.leftPost.y}
        width={geo.leftPost.w}
        height={geo.leftPost.h}
        fill={colours.stroke}
      />

      {/* Right post */}
      <rect
        x={geo.rightPost.x}
        y={geo.rightPost.y}
        width={geo.rightPost.w}
        height={geo.rightPost.h}
        fill={colours.stroke}
      />

      {/* Document slot */}
      {geo.slot.visible && (
        <rect
          x={geo.slot.x}
          y={geo.slot.y}
          width={geo.slot.w}
          height={geo.slot.h}
          fill={colours.stroke}
          opacity={0.35}
        />
      )}

      {/* Ledger line */}
      <rect
        x={colours.ledgerFullBleed ? geo.ledger.fullBleedX : geo.ledger.markX}
        y={geo.ledger.y}
        width={colours.ledgerFullBleed ? geo.ledger.fullBleedW : geo.ledger.markW}
        height={geo.ledger.h}
        fill={colours.stroke}
      />
    </svg>
  );
}

// ── AvrentisLogo (mark + wordmark) ─────────────────────────────

interface AvrentisLogoProps {
  variant?: MarkVariant;
  size?: number;
  className?: string;
}

export function AvrentisLogo({
  variant = "primary",
  size = 44,
  className,
}: AvrentisLogoProps) {
  const colours = getVariantColours(variant);
  const gap = size * 0.25;
  const fontSize = size * 0.46;

  return (
    <span
      role="img"
      aria-label="AVRENTIS"
      className={cn("inline-flex items-center", className)}
      style={{ gap }}
    >
      <AvrentisMark variant={variant} size={size} />
      <span
        style={{
          fontFamily: "var(--font-wordmark), 'Hanken Grotesk', system-ui, sans-serif",
          fontWeight: 700,
          fontSize,
          letterSpacing: "0.15em",
          color: colours.wordmark,
          lineHeight: 1,
          textTransform: "uppercase" as const,
        }}
      >
        AVRENTIS
      </span>
    </span>
  );
}

// ── Default export for backward compat ─────────────────────────

export default AvrentisLogo;
