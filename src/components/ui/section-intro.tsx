"use client";

import type { CSSProperties, ReactNode } from "react";
import { m } from "framer-motion";
import { fadeUpOnLoad, fadeUpOnScroll } from "@/lib/animations";

/**
 * The opening of a section: an uppercase gold eyebrow, a heading and a lede.
 *
 * `Eyebrow` is the one home of the eyebrow's type — weight, tracking, case and
 * the gold that reads on the surface beneath it ("light" sections take
 * --color-gold-on-light, navy ones --color-gold). ui-kit.lock.test.ts fails on
 * an uppercase gold label with its own letter-spacing anywhere else.
 *
 * Heading and lede sizes differ by page on purpose, so `SectionIntro` passes
 * their styles through; it owns only the order, the surface colours, the
 * alignment and the staggered fade-up.
 */

export type IntroSurface = "light" | "dark";

/** How the block appears: on scroll into view, on page load, or not animated. */
export type IntroReveal = "scroll" | "load" | "none";

export const EYEBROW_LETTER_SPACING = "0.10em";

const EYEBROW_COLOUR: Record<IntroSurface, string> = {
  light: "var(--color-gold-on-light)",
  dark: "var(--color-gold)",
};

const TITLE_COLOUR: Record<IntroSurface, string> = {
  light: "var(--color-text-primary)",
  dark: "var(--color-white)",
};

const LEDE_COLOUR: Record<IntroSurface, string> = {
  light: "var(--color-text-muted)",
  dark: "var(--color-text-secondary)",
};

/** Eyebrow sizes: a section's, a menu or card group's, a legal page's, the home hero's. */
const EYEBROW_SIZE = {
  section: "var(--text-xs)",
  group: "var(--text-3xs)",
  legal: "var(--text-2xs)",
  hero: "var(--text-sm)",
} as const;

export type EyebrowSize = keyof typeof EYEBROW_SIZE;

export function eyebrowStyle(surface: IntroSurface, size: EyebrowSize = "section"): CSSProperties {
  return {
    fontWeight: 600,
    fontSize: EYEBROW_SIZE[size],
    letterSpacing: EYEBROW_LETTER_SPACING,
    textTransform: "uppercase",
    color: EYEBROW_COLOUR[surface],
  };
}

const MOTION_TAGS = {
  span: m.span,
  p: m.p,
  div: m.div,
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
  h4: m.h4,
} as const;

type IntroTag = keyof typeof MOTION_TAGS;

function revealProps(reveal: IntroReveal, index?: number) {
  if (reveal === "scroll") return fadeUpOnScroll(index);
  if (reveal === "load") return fadeUpOnLoad(index);
  return {};
}

interface RevealTextProps {
  as: IntroTag;
  reveal: IntroReveal;
  index?: number;
  style: CSSProperties;
  className?: string;
  id?: string;
  children: ReactNode;
}

function RevealText({ as, reveal, index, style, className, id, children }: RevealTextProps) {
  if (reveal === "none") {
    const Tag = as;
    return (
      <Tag style={style} className={className} id={id}>
        {children}
      </Tag>
    );
  }
  const MotionTag = MOTION_TAGS[as];
  return (
    <MotionTag {...revealProps(reveal, index)} style={style} className={className} id={id}>
      {children}
    </MotionTag>
  );
}

interface EyebrowProps {
  children: ReactNode;
  surface?: IntroSurface;
  as?: IntroTag;
  /** Which eyebrow size (EYEBROW_SIZE); a section's by default. */
  size?: EyebrowSize;
  reveal?: IntroReveal;
  /** Stagger position; omitted = no delay. */
  index?: number;
  /** Layout only: display, margin, alignment — or a colour that follows a moving surface. */
  style?: CSSProperties;
  className?: string;
  id?: string;
}

export function Eyebrow({
  children,
  surface = "light",
  as = "span",
  size,
  reveal = "none",
  index,
  style,
  className,
  id,
}: EyebrowProps) {
  return (
    <RevealText
      as={as}
      reveal={reveal}
      index={index}
      style={{ ...eyebrowStyle(surface, size), ...style }}
      className={className}
      id={id}
    >
      {children}
    </RevealText>
  );
}

interface SectionIntroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  surface?: IntroSurface;
  align?: "start" | "center";
  reveal?: IntroReveal;
  titleAs?: IntroTag;
  ledeAs?: IntroTag;
  /** Layout for the eyebrow (display, margin). */
  eyebrowStyle?: CSSProperties;
  /** The heading's type and spacing for this page. */
  titleStyle?: CSSProperties;
  titleClassName?: string;
  titleId?: string;
  /** The lede's type and spacing for this page. */
  ledeStyle?: CSSProperties;
  ledeClassName?: string;
}

/** Eyebrow, heading and lede — fading up in that order (stagger 0, 1, 2). */
export function SectionIntro({
  eyebrow,
  title,
  lede,
  surface = "light",
  align = "start",
  reveal = "scroll",
  titleAs = "h2",
  ledeAs = "p",
  eyebrowStyle: eyebrowLayout,
  titleStyle,
  titleClassName,
  titleId,
  ledeStyle,
  ledeClassName,
}: SectionIntroProps) {
  const alignment: CSSProperties = align === "center" ? { textAlign: "center" } : {};
  return (
    <>
      {eyebrow != null && (
        <Eyebrow
          surface={surface}
          reveal={reveal}
          style={{ display: "block", ...alignment, ...eyebrowLayout }}
        >
          {eyebrow}
        </Eyebrow>
      )}
      <RevealText
        as={titleAs}
        reveal={reveal}
        index={eyebrow != null ? 1 : undefined}
        style={{
          color: TITLE_COLOUR[surface],
          ...alignment,
          ...titleStyle,
        }}
        className={titleClassName}
        id={titleId}
      >
        {title}
      </RevealText>
      {lede != null && (
        <RevealText
          as={ledeAs}
          reveal={reveal}
          index={eyebrow != null ? 2 : 1}
          style={{
            color: LEDE_COLOUR[surface],
            ...alignment,
            ...ledeStyle,
          }}
          className={ledeClassName}
        >
          {lede}
        </RevealText>
      )}
    </>
  );
}
