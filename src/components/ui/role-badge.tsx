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
  staff: { bg: "#f1f5f9", text: "#475569" },
  hod: { bg: "var(--color-gold-surface)", text: "#78350f", border: "var(--color-gold)" },
  finance: { bg: "rgba(4,120,87,0.08)", text: "#047857" },
  md: { bg: "#0f172a", text: "var(--color-gold)", border: "var(--color-gold)" },
  admin: { bg: "#1e293b", text: "#cbd5e1", border: "#334155" },
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
