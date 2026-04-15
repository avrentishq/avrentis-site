"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

type ButtonVariant = "primary" | "navy" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#F5A623",
    color: "#0A2540",
    border: "none",
  },
  navy: {
    backgroundColor: "#0A2540",
    color: "#F5A623",
    border: "0.5px solid rgba(245,166,35,0.4)",
  },
  outline: {
    backgroundColor: "transparent",
    color: "#0A2540",
    border: "0.5px solid #8492A6",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#F5A623",
    border: "none",
    padding: "0",
  },
};

const HOVER_STYLES: Partial<Record<ButtonVariant, { backgroundColor?: string; borderColor?: string; opacity?: number }>> = {
  primary: { backgroundColor: "#D4891E" },
  navy: { backgroundColor: "#0D2D4E" },
  outline: { borderColor: "#0A2540" },
};

const SIZES: Record<ButtonSize, { height: string; padding: string }> = {
  sm: { height: "32px", padding: "0 16px" },
  md: { height: "36px", padding: "0 20px" },
  lg: { height: "40px", padding: "0 24px" },
};

const BASE_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  fontSize: "11px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  borderRadius: "3px",
  cursor: "pointer",
  transition: "background-color 150ms ease, border-color 150ms ease, opacity 150ms ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  lineHeight: 1,
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  onClick,
}: ButtonProps) {
  const sizeStyles = variant === "ghost" ? {} : SIZES[size];
  const style: React.CSSProperties = {
    ...BASE_STYLE,
    ...VARIANTS[variant],
    ...sizeStyles,
  };

  const sharedProps = {
    className: cn("group", className),
    style,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const hover = HOVER_STYLES[variant];
      if (hover) {
        if (hover.backgroundColor) {
          (e.currentTarget as HTMLElement).style.backgroundColor = hover.backgroundColor;
        }
        if (hover.borderColor) {
          (e.currentTarget as HTMLElement).style.borderColor = hover.borderColor;
        }
      }
      if (variant === "ghost") {
        (e.currentTarget as HTMLElement).style.opacity = "0.8";
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      el.style.backgroundColor = (VARIANTS[variant].backgroundColor as string) ?? "transparent";
      if (variant === "outline") {
        el.style.borderColor = "#8492A6";
      }
      if (variant === "ghost") {
        el.style.opacity = "1";
      }
    },
  };

  if (href) {
    return (
      <Link href={href} {...sharedProps}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} {...sharedProps}>
      {children}
    </button>
  );
}
