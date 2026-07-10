import Image, { type StaticImageData } from "next/image";

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
const SCRIM: Record<"dark" | "light", string> = {
  dark: "linear-gradient(180deg, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.90) 100%)",
  light:
    "linear-gradient(180deg, rgba(241,245,249,0.88) 0%, rgba(241,245,249,0.94) 100%)",
};

interface SectionBackdropProps {
  /** A static image import (preferred — content-hashed) or a path under /public. */
  src: string | StaticImageData;
  /** Scrim tint — matches the section's surface so text stays legible. */
  scrim?: "dark" | "light";
  /** Backdrop image opacity (the scrim does the rest of the legibility work). */
  opacity?: number;
  /** CSS object-position for the cover crop. */
  objectPosition?: string;
  /** Set on above-the-fold sections only. */
  priority?: boolean;
}

export function SectionBackdrop({
  src,
  scrim = "dark",
  opacity = 0.5,
  objectPosition = "center",
  priority = false,
}: SectionBackdropProps) {
  return (
    <>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        priority={priority}
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition, opacity, zIndex: -1 }}
      />
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: -1, background: SCRIM[scrim] }}
      />
    </>
  );
}
