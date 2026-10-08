"use client";

/**
 * ChoiceGroup — a single-select control rendered as tappable chips or icon
 * cards instead of a native <select>. Converts a dropdown (a "what's in here?"
 * question) into visible options with a sensible default already lit
 * (smart defaults + easy-question framing).
 *
 * Restrained navy/gold, not the bubbly reference aesthetic. Renders a proper
 * ARIA radiogroup with roving-tabindex arrow-key navigation, plus a hidden
 * input so the value posts with the surrounding <form>/server action.
 */

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { JS_ONLY } from "@/lib/no-script";
import { NoScriptSelect } from "./no-script-select";

const sans = "var(--font-sans)";

export interface ChoiceOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  /** Small honest marker, e.g. "Most common". */
  badge?: string;
}

interface ChoiceGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: ChoiceOption[];
  ariaLabel: string;
  variant?: "chips" | "cards";
  /** Grid columns for the "cards" variant. */
  columns?: number;
  invalid?: boolean;
  /** Space-separated ids of the error or hint text describing the group. */
  describedBy?: string;
  /**
   * Render a native <select> for when JavaScript is off (default true). Turn
   * off only for a group outside any form, where a select would post nothing.
   */
  noScriptFallback?: boolean;
  /** The empty first choice of that select when nothing is picked yet. */
  noScriptPlaceholder?: string;
}

export function ChoiceGroup({
  name,
  value,
  onChange,
  options,
  ariaLabel,
  variant = "chips",
  columns = 3,
  invalid = false,
  describedBy,
  noScriptFallback = true,
  noScriptPlaceholder,
}: ChoiceGroupProps) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isCards = variant === "cards";
  const hasIcons = options.some((o) => o.icon);

  const move = (from: number, dir: 1 | -1) => {
    const next = (from + dir + options.length) % options.length;
    onChange(options[next]!.value);
    btnRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(i, 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(i, -1);
    }
  };

  return (
    <>
    {noScriptFallback && (
      <NoScriptSelect
        name={name}
        value={value}
        options={options}
        ariaLabel={ariaLabel}
        placeholder={value ? undefined : noScriptPlaceholder ?? "Select…"}
      />
    )}
    <div
      {...(noScriptFallback ? JS_ONLY : {})}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      style={
        isCards
          ? {
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: "10px",
            }
          : { display: "flex", flexWrap: "wrap", gap: "8px" }
      }
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        const Icon = opt.icon;
        const tabIndex = selected || (!value && i === 0) ? 0 : -1;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={tabIndex}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            style={{
              position: "relative",
              fontFamily: sans,
              cursor: "pointer",
              textAlign: "center",
              display: isCards ? "flex" : "inline-flex",
              flexDirection: isCards ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              // Chips grow to fill the row rather than clustering at the left.
              flex: isCards ? undefined : "1 1 auto",
              gap: isCards ? "8px" : "0",
              padding: isCards ? (hasIcons ? "16px 10px" : "13px 14px") : "0 16px",
              height: isCards ? "auto" : "40px",
              minHeight: isCards ? (hasIcons ? "88px" : "48px") : undefined,
              fontSize: "14px",
              fontWeight: selected ? 600 : 500,
              color: selected ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              backgroundColor: selected ? "rgba(var(--color-gold-rgb), 0.08)" : "var(--color-white)",
              border: `1px solid ${
                selected
                  ? "var(--color-gold)"
                  : invalid
                    ? "rgba(var(--color-danger-rgb), 0.5)"
                    : "var(--color-border)"
              }`,
              borderRadius: isCards ? "10px" : "9999px",
              boxShadow: selected ? "0 0 0 3px rgba(var(--color-gold-rgb), 0.10)" : "none",
              transition: "border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease",
            }}
            onMouseEnter={(e) => {
              if (!selected) e.currentTarget.style.borderColor = "var(--color-border-strong)";
            }}
            onMouseLeave={(e) => {
              if (!selected) e.currentTarget.style.borderColor = invalid ? "rgba(var(--color-danger-rgb), 0.5)" : "var(--color-border)";
            }}
          >
            {Icon && (
              <Icon
                size={isCards ? 20 : 16}
                strokeWidth={1.8}
                color={selected ? "var(--color-gold-on-light)" : "var(--color-text-muted)"}
                aria-hidden="true"
              />
            )}
            <span>{opt.label}</span>
            {opt.badge && (
              <span
                style={{
                  position: "absolute",
                  top: isCards ? "6px" : "-9px",
                  right: isCards ? "6px" : "8px",
                  fontFamily: sans,
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--color-gold-on-light)",
                  backgroundColor: "var(--color-gold-surface)",
                  border: "1px solid rgba(var(--color-gold-rgb), 0.3)",
                  borderRadius: "9999px",
                  padding: "1px 6px",
                  lineHeight: 1.4,
                  whiteSpace: "nowrap",
                }}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
      <input type="hidden" name={name} value={value} />
    </div>
    </>
  );
}
