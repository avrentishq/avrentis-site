import { cn } from "@/lib/utils";

type DocumentStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "queried"
  | "approved"
  | "rejected"
  | "bank_ready";

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  dot: string;
  border: string | null;
  pulseDot: boolean;
}

const STATUS_CONFIG: Record<DocumentStatus, StatusConfig> = {
  draft: {
    label: "Draft",
    bg: "rgba(148,163,184,0.10)",
    text: "#475569",
    dot: "#94a3b8",
    border: null,
    pulseDot: false,
  },
  submitted: {
    label: "Pending review",
    bg: "rgba(180,83,9,0.08)",
    text: "#78350f",
    dot: "#b45309",
    border: null,
    pulseDot: false,
  },
  under_review: {
    label: "Under review",
    bg: "rgba(198,139,47,0.08)",
    text: "#92400e",
    dot: "#C68B2F",
    border: "rgba(198,139,47,0.4)",
    pulseDot: false,
  },
  queried: {
    label: "Queried",
    bg: "rgba(91,33,182,0.08)",
    text: "#3B0764",
    dot: "#5B21B6",
    border: "rgba(91,33,182,0.4)",
    pulseDot: true,
  },
  approved: {
    label: "Approved",
    bg: "rgba(4,120,87,0.08)",
    text: "#047857",
    dot: "#047857",
    border: null,
    pulseDot: false,
  },
  rejected: {
    label: "Returned",
    bg: "rgba(185,28,28,0.08)",
    text: "#7f1d1d",
    dot: "#b91c1c",
    border: null,
    pulseDot: false,
  },
  bank_ready: {
    label: "Bank ready",
    bg: "rgba(29,78,216,0.08)",
    text: "#1e3a8a",
    dot: "#1d4ed8",
    border: null,
    pulseDot: false,
  },
};

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn("inline-flex items-center whitespace-nowrap", className)}
      style={{
        gap: "5px",
        padding: "3px 8px",
        backgroundColor: config.bg,
        color: config.text,
        fontSize: "11px",
        fontWeight: 500,
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        letterSpacing: "0.04em",
        lineHeight: 1,
        borderRadius: "4px",
        border: config.border
          ? `0.5px solid ${config.border}`
          : "0.5px solid transparent",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: config.dot,
          flexShrink: 0,
          ...(config.pulseDot && {
            animation: "avrentis-pulse 1.4s ease-in-out infinite",
          }),
        }}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}

type Role = "staff" | "hod" | "finance" | "md" | "admin";

const ROLE_LABELS: Record<Role, string> = {
  staff: "Staff",
  hod: "HOD",
  finance: "Finance",
  md: "MD",
  admin: "Admin",
};

const ROLE_STYLES: Record<Role, { bg: string; text: string; border?: string }> =
  {
    staff: { bg: "#f1f5f9", text: "#475569" },
    hod: { bg: "#FDF8EF", text: "#78350f", border: "#C68B2F" },
    finance: { bg: "rgba(4,120,87,0.08)", text: "#047857" },
    md: { bg: "#1e293b", text: "#C68B2F", border: "#C68B2F" },
    admin: { bg: "#1e293b", text: "#cbd5e1", border: "#334155" },
  };

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const style = ROLE_STYLES[role];

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap",
        className,
      )}
      style={{
        padding: "3px 8px",
        backgroundColor: style.bg,
        color: style.text,
        fontSize: "11px",
        fontWeight: 500,
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        letterSpacing: "0.04em",
        lineHeight: 1,
        borderRadius: "4px",
        border: style.border
          ? `0.5px solid ${style.border}`
          : "0.5px solid transparent",
      }}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

export type { DocumentStatus, Role };
