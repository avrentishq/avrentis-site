import Image, { type StaticImageData } from "next/image";
import type { SectionBackdropSource } from "@/lib/section-backdrops";

/**
 * SectionBackdrop — full-bleed image backdrop + legibility scrim for a landing
 * section, mirroring the hero's treatment (a `next/image` `fill` layer under a
 * gradient scrim). Drop it as the first child of a section styled
 * `position: relative; overflow: hidden; isolation: isolate` — the isolate
 * makes the section a stacking context so this backdrop (z-index -1) sits
 * behind the section's normal content automatically, no content-lifting needed.
 *
 * Image source: pass a static import from `@/lib/section-backdrops`
 * (`SECTION_BACKDROPS.*`) — the single place every section's image is declared.
 * Static imports are content-hashed by Next, so swapping a file in
 * `public/sections/` never serves a stale cached copy. `scrim` picks the tint
 * that keeps that section's text legible: "light" for pale sections (dark body
 * text), "dark" for navy sections (white text).
 */
const SCRIM: Record<"dark" | "light" | "hero", string> = {
  dark: "linear-gradient(180deg, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.90) 100%)",
  light:
    "linear-gradient(180deg, rgba(241,245,249,0.88) 0%, rgba(241,245,249,0.94) 100%)",
  // Directional navy scrim: heaviest on the left so the hero's left-aligned
  // copy stays legible over the light-trails, easing to near-clear on the
  // right where the product mock sits.
  hero: "linear-gradient(90deg, rgba(15,23,42,0.93) 0%, rgba(15,23,42,0.74) 42%, rgba(15,23,42,0.4) 100%), linear-gradient(180deg, rgba(15,23,42,0.32) 0%, rgba(15,23,42,0.68) 100%)",
};

const DEFAULT_OPACITY = 0.5;
const DEFAULT_OBJECT_POSITION = "center";

/** A `SECTION_BACKDROPS.*` entry (bare image or `{src, opacity?, objectPosition?}`) or a /public path string. */
type BackdropInput = string | SectionBackdropSource;

/** Split a registry entry into its image + optional per-section opacity/crop. */
function resolveSource(src: BackdropInput | null | undefined): {
  image: string | StaticImageData | null;
  opacity?: number;
  objectPosition?: string;
} {
  // A backdrop is decoration — a missing/mistyped SECTION_BACKDROPS key must
  // degrade to "no image, scrim only", never crash the whole page.
  if (src == null) return { image: null };
  if (typeof src === "string") return { image: src };
  // A bare StaticImageData carries `height`/`width`; the object form does not.
  if ("height" in src) return { image: src };
  return { image: src.src, opacity: src.opacity, objectPosition: src.objectPosition };
}

interface SectionBackdropProps {
  /** A `SECTION_BACKDROPS.*` entry (preferred — content-hashed) or a path under /public. */
  src: BackdropInput;
  /** Scrim tint — matches the section's surface so text stays legible. */
  scrim?: "dark" | "light" | "hero";
  /** Image opacity override. Falls back to the registry entry's `opacity`, then the default. */
  opacity?: number;
  /** CSS object-position override. Falls back to the registry entry's `objectPosition`, then centre. */
  objectPosition?: string;
  /** Set on above-the-fold sections only. */
  priority?: boolean;
}

export function SectionBackdrop({
  src,
  scrim = "dark",
  opacity,
  objectPosition,
  priority = false,
}: SectionBackdropProps) {
  const resolved = resolveSource(src);
  // Precedence: explicit prop → per-section registry value → default.
  const resolvedOpacity = opacity ?? resolved.opacity ?? DEFAULT_OPACITY;
  const resolvedObjectPosition =
    objectPosition ?? resolved.objectPosition ?? DEFAULT_OBJECT_POSITION;
  return (
    <>
      {resolved.image != null && (
        <Image
          src={resolved.image}
          alt=""
          aria-hidden="true"
          fill
          priority={priority}
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: resolvedObjectPosition,
            opacity: resolvedOpacity,
            zIndex: -1,
          }}
        />
      )}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: -1, background: SCRIM[scrim] }}
      />
    </>
  );
}
