import { cn } from "@/lib/utils";

type Role = "staff" | "hod" | "finance" | "md" | "admin";

const ROLE_LABELS: Record<Role, string> = {
  staff: "Staff",
  hod: "HOD",
  finance: "Finance",
  md: "MD",
  admin: "Admin",
};

const ROLE_STYLES: Record<Role, { bg: string; text: string; border?: string }> = {
  staff: { bg: "var(--color-bg)", text: "var(--color-text-secondary)" },
  hod: { bg: "var(--color-gold-surface)", text: "var(--color-warning-strong)", border: "var(--color-gold)" },
  finance: { bg: "rgba(var(--color-success-rgb), 0.08)", text: "var(--color-success)" },
  md: { bg: "var(--color-navy-primary)", text: "var(--color-gold)", border: "var(--color-gold)" },
  admin: { bg: "var(--color-navy-mid)", text: "var(--color-text-inverse-muted)", border: "var(--color-navy-light)" },
};

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const s = ROLE_STYLES[role];
  return (
    <span
      className={cn("inline-flex items-center whitespace-nowrap", className)}
      style={{
        padding: "3px 8px",
        backgroundColor: s.bg,
        color: s.text,
        fontSize: "11px",
        fontWeight: 500,
        fontFamily: "var(--font-sans)",
        letterSpacing: "0.04em",
        lineHeight: 1,
        borderRadius: "4px",
        border: s.border ? `0.5px solid ${s.border}` : "0.5px solid transparent",
      }}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

export type { Role };
