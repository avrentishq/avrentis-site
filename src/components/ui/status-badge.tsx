import { cn } from "@/lib/utils";

type DocumentStatus = "draft" | "pending_review" | "under_review" | "approved";

const STATUS_CONFIG: Record<DocumentStatus, { label: string; dot: string; text: string; bg: string; border?: string }> = {
  draft: {
    label: "Draft",
    dot: "#94a3b8",
    text: "#475569",
    bg: "rgba(148,163,184,0.10)",
  },
  pending_review: {
    label: "Pending review",
    dot: "#b45309",
    text: "#78350f",
    bg: "rgba(180,83,9,0.08)",
  },
  under_review: {
    label: "Under review",
    dot: "var(--color-gold)",
    text: "#92400e",
    bg: "rgba(var(--color-gold-rgb), 0.08)",
    border: "rgba(var(--color-gold-rgb), 0.4)",
  },
  approved: {
    label: "Approved",
    dot: "#047857",
    text: "#047857",
    bg: "rgba(4,120,87,0.08)",
  },
};

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const c = STATUS_CONFIG[status];
  return (
    <span
      className={cn("inline-flex items-center whitespace-nowrap", className)}
      style={{
        gap: "5px",
        padding: "3px 8px",
        backgroundColor: c.bg,
        color: c.text,
        fontSize: "11px",
        fontWeight: 500,
        fontFamily: "var(--font-sans)",
        letterSpacing: "0.04em",
        lineHeight: 1,
        borderRadius: "4px",
        border: c.border ? `0.5px solid ${c.border}` : "0.5px solid transparent",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: c.dot,
          flexShrink: 0,
        }}
      />
      {c.label}
    </span>
  );
}

export type { DocumentStatus };
