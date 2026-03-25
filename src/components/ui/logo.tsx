// AVRENTIS Logo — uses pre-rendered assets from /logos/
//
// Assets follow the naming convention:
//   mark-{variant}-{size}.svg      — gate mark only
//   lockup-{variant}-{size}.svg    — mark + wordmark
//   wordmark-{color}.svg           — wordmark text only
//
// Variants: primary, reversed, transparent-gold, transparent-navy
// Mark sizes: 48, 64, 128, 256, 512
// Lockup sizes: 48, 64, 128, 256
// Wordmark colours: gold, navy, white (+ lg variants)

import { cn } from "@/lib/utils"

type MarkVariant = "primary" | "reversed" | "transparent-gold" | "transparent-navy"

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Pick the closest available asset size (rounding up) */
const MARK_SIZES = [48, 64, 128, 256, 512]
const LOCKUP_SIZES = [48, 64, 128, 256]

function closestSize(target: number, available: number[]): number {
  for (const s of available) {
    if (s >= target) return s
  }
  return available[available.length - 1]
}

// ── AvrentisMark ──────────────────────────────────────────────────────────────

interface AvrentisMarkProps {
  size?: number
  variant?: MarkVariant
  className?: string
}

export function AvrentisMark({
  size = 40,
  variant = "primary",
  className,
}: AvrentisMarkProps) {
  const assetSize = closestSize(size, MARK_SIZES)
  const src = `/logos/mark-${variant}-${assetSize}.svg`

  return (
    <img
      src={src}
      alt="AVRENTIS"
      width={size}
      height={size}
      className={cn("flex-shrink-0", className)}
      style={{ width: size, height: size }}
    />
  )
}

// ── AvrentisWordmark ──────────────────────────────────────────────────────────

type WordmarkColor = "gold" | "navy" | "white"

interface AvrentisWordmarkProps {
  color?: WordmarkColor
  large?: boolean
  className?: string
}

export function AvrentisWordmark({
  color = "gold",
  large = false,
  className,
}: AvrentisWordmarkProps) {
  const src = `/logos/wordmark-${color}${large ? "-lg" : ""}.svg`

  return (
    <img
      src={src}
      alt="AVRENTIS"
      className={cn("flex-shrink-0", className)}
      style={{ height: large ? "auto" : "auto" }}
    />
  )
}

// ── AvrentisLogo (lockup: mark + wordmark) ────────────────────────────────────

interface AvrentisLogoProps {
  size?: number
  variant?: MarkVariant
  className?: string
}

export function AvrentisLogo({
  size = 40,
  variant = "primary",
  className,
}: AvrentisLogoProps) {
  const assetSize = closestSize(size, LOCKUP_SIZES)
  const src = `/logos/lockup-${variant}-${assetSize}.svg`

  return (
    <img
      src={src}
      alt="AVRENTIS"
      className={cn("flex-shrink-0", className)}
      style={{ height: size }}
    />
  )
}

export default AvrentisLogo
