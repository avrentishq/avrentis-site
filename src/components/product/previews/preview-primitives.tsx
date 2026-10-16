/**
 * The building blocks every product mockup is drawn with — the browser frame,
 * the document heading, cards, labels, tables, tags and buttons that mirror the
 * real platform UI.
 *
 * Each module preview, the lifecycle stage mockups and the homepage section
 * used to hand-roll the same frame, pill and card styles inline, so the "same"
 * status badge drifted by a pixel or a colour from page to page. Draw a mockup
 * from these and it matches every other one.
 */

import type { CSSProperties, ReactNode } from "react";
import { BRAND } from "@/lib/brand";
import { Z_INDEX } from "@/lib/layers";

const TABULAR_FIGURES = '"tnum" 1';

/* ── Browser frame ───────────────────────────────────────────────── */

/** "Avrentis / vouchers / new" — the frame caption for an in-app path. */
export function appCaption(path: string): string {
  return `${BRAND.name} / ${path}`;
}

/**
 * What the frame sits on: a dark section (soft gold glow), a light section
 * (navy drop shadow), or the hero's frosted glass over the backdrop.
 */
type FrameSurface = "dark" | "light" | "glass";

const FRAME_SURFACES: Record<FrameSurface, CSSProperties> = {
  dark: {
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-white-border)",
    backgroundColor: "var(--color-bg-light)",
    boxShadow: "0 0 60px var(--color-gold-ghost), 0 30px 60px rgba(var(--color-shadow-rgb), 0.45)",
  },
  light: {
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-bg-light)",
    boxShadow:
      "0 20px 50px rgba(var(--color-navy-primary-rgb), 0.08), 0 4px 10px rgba(var(--color-navy-primary-rgb), 0.04)",
  },
  glass: {
    borderRadius: "var(--radius-2xl)",
    border: "1px solid rgba(var(--color-white-rgb), 0.45)",
    backgroundColor: "rgba(var(--color-bg-light-rgb), 0.72)",
    backdropFilter: "blur(24px) saturate(1.4)",
    WebkitBackdropFilter: "blur(24px) saturate(1.4)",
    boxShadow:
      "inset 0 1px 0 rgba(var(--color-white-rgb), 0.65), 0 0 60px var(--color-gold-ghost), 0 30px 60px rgba(var(--color-shadow-rgb), 0.5)",
  },
};

export function BrowserFrame({
  caption,
  surface,
  style,
  children,
}: {
  /** The address-bar text: `appCaption(path)` for an in-app page, or a plain description. */
  caption: string;
  surface: FrameSurface;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div style={{ ...FRAME_SURFACES[surface], overflow: "hidden", ...style }}>
      <div
        style={{
          backgroundColor: "var(--color-navy-primary)",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderBottom: "1px solid var(--color-white-border)",
        }}
      >
        <div aria-hidden="true" style={{ display: "flex", gap: "6px" }}>
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              style={{ width: "10px", height: "10px", borderRadius: "var(--radius-circle)", backgroundColor: "rgba(var(--color-white-rgb), 0.15)" }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: "var(--color-white-border)",
            borderRadius: "var(--radius-md)",
            padding: "4px 10px",
            fontSize: "var(--text-2xs)",
            color: "var(--color-text-subtle)",
            textAlign: "center",
            // One line, like a real address bar: a long path is cut, never wrapped.
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {caption}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ── Layout ──────────────────────────────────────────────────────── */

/** The padded page area inside a frame. */
export function PreviewBody({ children }: { children: ReactNode }) {
  return <div style={{ padding: "22px 24px" }}>{children}</div>;
}

/** A white, bordered card — a panel on the mockup's page. */
export function PreviewCard({
  children,
  padding = "14px 16px",
  marginBottom,
  style,
}: {
  children: ReactNode;
  padding?: string;
  marginBottom?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-badge)",
        padding,
        marginBottom,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** The small uppercase label above a panel or field. */
export function PreviewLabel({ children, marginBottom = "10px" }: { children: ReactNode; marginBottom?: string }) {
  return (
    <p
      style={{
        fontSize: "var(--text-3xs)",
        fontWeight: 500,
        color: "var(--color-text-muted)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        margin: `0 0 ${marginBottom}`,
      }}
    >
      {children}
    </p>
  );
}

/** A page heading: title, one-line subtitle, and an optional action on the right. */
export function PreviewHeader({
  title,
  subtitle,
  action,
  marginBottom = "12px",
}: {
  title: ReactNode;
  subtitle: ReactNode;
  action?: ReactNode;
  marginBottom?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom }}>
      <div style={{ minWidth: 0 }}>
        <h3 style={{ fontWeight: 400, fontSize: "var(--text-3xl)", color: "var(--color-text-primary)", margin: "0 0 2px" }}>
          {title}
        </h3>
        <p style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", margin: 0 }}>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

/** The solid action shown in a page heading ("Edit policy", "Export PDF"). */
export function HeaderAction({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontWeight: 500,
        fontSize: "var(--text-xs)",
        backgroundColor: "var(--color-navy-primary)",
        color: "var(--color-white)",
        borderRadius: "var(--radius-xs)",
        padding: "6px 14px",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

/* ── Document heading ────────────────────────────────────────────── */

export type StatusTone = "success" | "pending";

const STATUS_TONES: Record<StatusTone, { background: string; color: string; dot: string }> = {
  success: {
    background: "var(--color-success-wash)",
    color: "var(--color-success)",
    dot: "var(--color-success)",
  },
  pending: {
    background: "var(--color-gold-ghost)",
    color: "var(--color-warning)",
    dot: "var(--color-gold)",
  },
};

/** A status badge with a dot — "Approved", "Under review". */
export function StatusPill({ label, tone }: { label: string; tone: StatusTone }) {
  const colours = STATUS_TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "var(--text-3xs)",
        fontWeight: 500,
        backgroundColor: colours.background,
        color: colours.color,
        borderRadius: "var(--radius-xs)",
        padding: "2px 6px",
      }}
    >
      <span style={{ width: "5px", height: "5px", borderRadius: "var(--radius-circle)", backgroundColor: colours.dot }} />
      {label}
    </span>
  );
}

/** The navy document-type tag — "PV", "PO". */
export function TypeTag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontSize: "var(--text-3xs)",
        fontWeight: 500,
        backgroundColor: "var(--color-navy-primary)",
        color: "var(--color-gold)",
        borderRadius: "var(--radius-xs)",
        padding: "1px 5px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

/** Reference, type tag and status in one line, with an optional note pushed right. */
export function DocumentHeading({
  reference,
  typeTag,
  status,
  note,
  marginBottom = "10px",
}: {
  reference: string;
  typeTag?: string;
  status: { label: string; tone: StatusTone };
  note?: ReactNode;
  marginBottom?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom }}>
      <span
        style={{
          fontFeatureSettings: TABULAR_FIGURES,
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: "var(--color-text-primary)",
          whiteSpace: "nowrap",
        }}
      >
        {reference}
      </span>
      {typeTag ? <TypeTag>{typeTag}</TypeTag> : null}
      <StatusPill label={status.label} tone={status.tone} />
      {note ? (
        <span style={{ marginLeft: "auto", fontSize: "var(--text-3xs)", color: "var(--color-text-muted)" }}>{note}</span>
      ) : null}
    </div>
  );
}

/* ── Tags ────────────────────────────────────────────────────────── */

/** A plain coloured tag with no dot — a record's state, a key's status. */
export function Tag({ children, background, color }: { children: ReactNode; background: string; color: string }) {
  return (
    <span
      style={{
        fontSize: "var(--text-3xs)",
        fontWeight: 500,
        backgroundColor: background,
        color,
        borderRadius: "var(--radius-xs)",
        padding: "2px 6px",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

/** A monospace event or rule name — "PV_SANCTIONED", "DUPLICATE_PAYMENT". */
export function CodeTag({ children, background, color }: { children: ReactNode; background: string; color: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-3xs)",
        fontWeight: 500,
        padding: "2px 6px",
        borderRadius: "var(--radius-xs)",
        backgroundColor: background,
        color,
        justifySelf: "start",
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </span>
  );
}

/** A row of filter chips, the first one selected. */
export function FilterChips({ options, size }: { options: readonly string[]; size: "compact" | "regular" }) {
  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: size === "compact" ? "10px" : "12px" }}>
      {options.map((option, index) => (
        <span
          key={option}
          style={{
            fontSize: "var(--text-2xs)",
            fontWeight: 500,
            padding: size === "compact" ? "3px 8px" : "4px 10px",
            borderRadius: "var(--radius-xs)",
            backgroundColor: index === 0 ? "var(--color-navy-primary)" : "var(--color-white)",
            color: index === 0 ? "var(--color-white)" : "var(--color-navy-primary)",
            border: index === 0 ? "1px solid var(--color-navy-primary)" : "1px solid var(--color-border)",
          }}
        >
          {option}
        </span>
      ))}
    </div>
  );
}

/* ── Tables and lists ────────────────────────────────────────────── */

export interface PreviewColumn {
  label: string;
  align?: "right";
}

/**
 * A bordered table: a tinted uppercase header row, then one grid row per
 * entry, divided by hairlines. Cells are the caller's own elements.
 */
export function PreviewTable({
  columns,
  gridTemplateColumns,
  rows,
  rowPadding = "8px 14px",
  fontSize = "var(--text-2xs)",
  marginBottom,
}: {
  columns: readonly PreviewColumn[];
  gridTemplateColumns: string;

  rows: readonly { key: string; cells: ReactNode }[];
  rowPadding?: string;
  fontSize?: string;
  marginBottom?: string;
}) {
  return (
    <PreviewCard padding="0" marginBottom={marginBottom} style={{ overflow: "hidden" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns,
          gap: "10px",
          padding: "8px 14px",
          backgroundColor: "var(--color-bg-light)",
          borderBottom: "1px solid var(--color-border)",
          fontSize: "var(--text-3xs)",
          fontWeight: 500,
          color: "var(--color-text-muted)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {columns.map((column) => (
          <span key={column.label} style={column.align ? { textAlign: column.align } : undefined}>
            {column.label}
          </span>
        ))}
      </div>
      {rows.map((row, index) => (
        <div
          key={row.key}
          style={{
            display: "grid",
            gridTemplateColumns,
            gap: "10px",
            padding: rowPadding,
            borderTop: index === 0 ? "none" : "1px solid var(--color-border)",
            alignItems: "center",
            fontSize,
            color: "var(--color-text-primary)",
          }}
        >
          {row.cells}
        </div>
      ))}
    </PreviewCard>
  );
}

/** A bordered list: one flex row per entry, divided by hairlines. */
export function PreviewList({ rows }: { rows: readonly { key: string; content: ReactNode }[] }) {
  return (
    <PreviewCard padding="0">
      {rows.map((row, index) => (
        <div
          key={row.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 14px",
            borderTop: index === 0 ? "none" : "1px solid var(--color-border)",
          }}
        >
          {row.content}
        </div>
      ))}
    </PreviewCard>
  );
}

/** Label–value pairs in two columns — a document's details. */
export function DetailGrid({
  items,
  labelWidth,
  rowGap,
}: {
  items: readonly { label: string; value: ReactNode; numeric?: boolean }[];
  labelWidth: string;
  rowGap: string;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `${labelWidth} 1fr`, rowGap, fontSize: "var(--text-2xs)" }}>
      {items.map((item) => (
        <DetailPair key={item.label} label={item.label} value={item.value} numeric={item.numeric} />
      ))}
    </div>
  );
}

function DetailPair({ label, value, numeric }: { label: string; value: ReactNode; numeric?: boolean }) {
  return (
    <>
      <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span style={{ color: "var(--color-text-primary)", fontFeatureSettings: numeric ? TABULAR_FIGURES : undefined }}>{value}</span>
    </>
  );
}

/* ── Approval timeline ───────────────────────────────────────────── */

/** Completed approval steps on a rail — who did what, and when. */
export function ApprovalTimeline({ steps }: { steps: readonly { label: string; actor: string; when: string }[] }) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{ position: "absolute", left: "9px", top: "8px", bottom: "8px", width: "1px", backgroundColor: "var(--color-border)" }}
      />
      {steps.map((step) => (
        <div key={step.label} style={{ position: "relative", display: "flex", gap: "12px", padding: "4px 0" }}>
          <CompletedMark size={20} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
              {step.label} <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>— {step.actor}</span>
            </p>
            <p style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", margin: "1px 0 0" }}>{step.when}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** The green ring-and-tick of a completed step. */
export function CompletedMark({ size }: { size: number }) {
  return (
    <span
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "var(--radius-circle)",
        backgroundColor: "var(--color-white)",
        border: "1.5px solid var(--color-success)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        zIndex: Z_INDEX.raised,
      }}
    >
      <span style={{ color: "var(--color-success)", fontSize: `${size / 2}px`, lineHeight: 1 }}>✓</span>
    </span>
  );
}

/* ── Buttons ─────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "accent" | "danger";

const BUTTON_VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-navy-primary)",
    color: "var(--color-white)",
    border: "none",
  },
  secondary: {
    backgroundColor: "var(--color-white)",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-border)",
  },
  accent: {
    backgroundColor: "var(--color-gold)",
    color: "var(--color-text-primary)",
    border: "none",
  },
  danger: {
    backgroundColor: "var(--color-white)",
    color: "var(--color-danger)",
    border: "1px solid rgba(var(--color-danger-rgb), 0.3)",
  },
};

/**
 * A button drawn in a mockup. `fill` stretches it across its share of a row;
 * otherwise it sizes to its label. It does nothing — the mockup is a picture.
 */
export function MockButton({
  children,
  variant,
  fill = false,
  style,
}: {
  children: ReactNode;
  variant: ButtonVariant;
  fill?: boolean;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      style={{
        fontWeight: 500,
        fontSize: "var(--text-xs)",
        borderRadius: "var(--radius-xs)",
        padding: fill ? "8px 0" : "8px 16px",
        cursor: "default",
        ...(fill ? { flex: 1 } : null),
        ...BUTTON_VARIANTS[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/** A row of mockup buttons sharing the width equally. */
export function ButtonRow({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", gap: "8px" }}>{children}</div>;
}
