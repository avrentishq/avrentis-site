import { cn } from "@/lib/utils";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline-light" | "nav-cta";

interface ButtonProps {
  variant?: ButtonVariant;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#C68B2F",
    color: "#0f172a",
    border: "none",
  },
  secondary: {
    backgroundColor: "transparent",
    color: "#0f172a",
    border: "0.5px solid #0f172a",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#C68B2F",
    border: "none",
    padding: 0,
  },
  "outline-light": {
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "0.5px solid #ffffff",
  },
  "nav-cta": {
    backgroundColor: "#0f172a",
    color: "#C68B2F",
    border: "0.5px solid rgba(198,139,47,0.2)",
  },
};

const HOVER_BG: Partial<Record<ButtonVariant, string>> = {
  primary: "#A87425",
  "nav-cta": "#1e293b",
};

const BASE_STYLE: React.CSSProperties = {
  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
  fontWeight: 500,
  fontSize: "14px",
  letterSpacing: "0.02em",
  padding: "12px 24px",
  borderRadius: "3px",
  cursor: "pointer",
  transition: "background-color 150ms ease, border-color 150ms ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  lineHeight: 1,
};

export function Button({
  variant = "primary",
  href,
  children,
  className,
  onClick,
}: ButtonProps) {
  const style = { ...BASE_STYLE, ...VARIANTS[variant] };

  if (variant === "ghost") {
    style.padding = "0";
  }

  const sharedProps = {
    className: cn("group", className),
    style,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const hoverBg = HOVER_BG[variant];
      if (hoverBg) {
        (e.currentTarget as HTMLElement).style.backgroundColor = hoverBg;
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.backgroundColor =
        VARIANTS[variant].backgroundColor as string;
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
