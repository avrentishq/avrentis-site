// AVRENTIS Logo — variant usage guide
//
// primary          → navy container + gold mark
//                    use: sidebar, topbar, dark section backgrounds
//
// reversed         → gold container + navy mark
//                    use: gold CTA surfaces only
//
// transparent-gold → no container, gold mark
//                    use: any dark surface (#0f172a, #020617, dark photography)
//
// transparent-navy → no container, navy mark
//                    use: any light surface (#ffffff, #f1f5f9, #FDF8EF)
//
// WORDMARK COLOURS
//   on dark:  #ffffff (white)
//   on light: #0f172a (navy)
//   never:    gold (#C68B2F) on white navbar surface
//
// SIZES
//   favicon:         16px  (document slot suppresses automatically)
//   sidebar/navbar:  36–40px
//   marketing:       48–64px
//   hero/display:    80–120px
//
// LOCKUP GAP
//   Always: size × 0.10 — never a fixed pixel value

import { cn } from "@/lib/utils";

type MarkVariant =
  | "primary"
  | "reversed"
  | "transparent-gold"
  | "transparent-navy";

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
  const ledgerXContained = 0;
  const ledgerWContained = size;
  const ledgerXTransparent = padH;
  const ledgerWTransparent = markW;

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
    ledgerXContained,
    ledgerWContained,
    ledgerXTransparent,
    ledgerWTransparent,
  };
}

// ── Colour engine ─────────────────────────────────────────────────────────────

function getColors(variant: MarkVariant) {
  switch (variant) {
    case "primary":
      return {
        container: "#0f172a",
        stroke: "#C68B2F",
        slot: "#C68B2F",
        slotOpacity: 0.35,
        border: "rgba(198,139,47,0.2)",
        transparent: false,
      };
    case "reversed":
      return {
        container: "#C68B2F",
        stroke: "#0f172a",
        slot: "#0f172a",
        slotOpacity: 0.35,
        border: "none",
        transparent: false,
      };
    case "transparent-gold":
      return {
        container: "none",
        stroke: "#C68B2F",
        slot: "#C68B2F",
        slotOpacity: 0.35,
        border: "none",
        transparent: true,
      };
    case "transparent-navy":
      return {
        container: "none",
        stroke: "#0f172a",
        slot: "#0f172a",
        slotOpacity: 0.35,
        border: "none",
        transparent: true,
      };
  }
}

// ── Mark ──────────────────────────────────────────────────────────────────────

export function AvrentisMark({
  size = 40,
  variant = "primary",
  className,
}: AvrentisMarkProps) {
  const p = getProps(size);
  const c = getColors(variant);

  const ledgerX = c.transparent ? p.ledgerXTransparent : p.ledgerXContained;
  const ledgerW = c.transparent ? p.ledgerWTransparent : p.ledgerWContained;

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

      <rect
        x={p.beamX}
        y={p.beamY}
        width={p.beamW}
        height={p.beamH}
        fill={c.stroke}
      />
      <rect
        x={p.leftPostX}
        y={p.postY}
        width={p.leftPostW}
        height={p.postH}
        fill={c.stroke}
      />
      <rect
        x={p.rightPostX}
        y={p.postY}
        width={p.rightPostW}
        height={p.postH}
        fill={c.stroke}
      />

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

      <rect
        x={ledgerX}
        y={p.ledgerY}
        width={ledgerW}
        height={p.ledgerH}
        fill={c.stroke}
      />
    </svg>
  );
}

// ── Wordmark only ─────────────────────────────────────────────────────────────

interface AvrentisWordmarkProps {
  size?: number;
  color?: string;
  className?: string;
}

export function AvrentisWordmark({
  size = 15,
  color = "#C68B2F",
  className,
}: AvrentisWordmarkProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-wordmark)",
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "0.10em",
        color,
        lineHeight: 1,
        textTransform: "uppercase",
        display: "inline-block",
      }}
    >
      AVRENTIS
    </span>
  );
}

// ── Full lockup (mark + wordmark) ─────────────────────────────────────────────

export function AvrentisLogo({
  size = 40,
  variant = "primary",
  showWordmark = true,
  wordmarkColor,
  className,
}: AvrentisLogoProps) {
  const defaultWordmarkColor =
    variant === "transparent-navy"
      ? "#0f172a"
      : variant === "reversed"
        ? "#0f172a"
        : "#ffffff";

  const wColor = wordmarkColor ?? defaultWordmarkColor;

  return (
    <div
      className={cn("flex items-center", className)}
      style={{ gap: Math.round(size * 0.25) }}
    >
      <AvrentisMark size={size} variant={variant} />
      {showWordmark && (
        <span
          style={{
            fontFamily: "var(--font-wordmark)",
            fontWeight: 700,
            fontSize: size * 0.46,
            letterSpacing: "0.15em",
            color: wColor,
            lineHeight: 1,
            textTransform: "uppercase" as const,
          }}
        >
          AVRENTIS
        </span>
      )}
    </div>
  );
}

export default AvrentisLogo;
