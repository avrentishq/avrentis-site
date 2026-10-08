"use client";

/**
 * SearchableSelect — a combobox that keeps a native-select's submitted value
 * (an opaque code, e.g. an ISO country code) while letting the user filter by
 * label. Answers "is my country in here?" with a type-to-find box instead of a
 * long scroll. Posts the value via a hidden input so it works inside a <form>.
 */

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { JS_ONLY } from "@/lib/no-script";
import { NoScriptSelect } from "./no-script-select";

const sans = "var(--font-sans)";

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel: string;
  placeholder?: string;
  invalid?: boolean;
  /** Space-separated ids of the error or hint text describing the control. */
  describedBy?: string;
}

export function SearchableSelect({
  name,
  value,
  onChange,
  options,
  ariaLabel,
  placeholder = "Select…",
  invalid = false,
  describedBy,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const optionId = (i: number) => `${listboxId}-opt-${i}`;

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [query, options]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[activeIdx];
      if (opt) choose(opt.value);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <NoScriptSelect
        name={name}
        value={value}
        options={options}
        ariaLabel={ariaLabel}
        placeholder={value ? undefined : "Select…"}
      />
      <input type="hidden" name={name} value={value} />
      {/* Select-only combobox (WAI-ARIA APG): the trigger carries the field's
          name, value, invalid state and description; the listbox opens below. */}
      <button
        {...JS_ONLY}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((o) => !o)}
        style={{
          fontFamily: sans,
          fontSize: "14px",
          width: "100%",
          height: "42px",
          border: `1px solid ${invalid ? "rgba(var(--color-danger-rgb), 0.5)" : "var(--color-border)"}`,
          borderRadius: "6px",
          padding: "0 12px 0 14px",
          backgroundColor: "var(--color-white)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ color: selected ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} style={{ color: "var(--color-text-muted)" }} aria-hidden="true" />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 30,
            backgroundColor: "var(--color-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            boxShadow: "0 12px 32px rgba(var(--color-navy-primary-rgb), 0.14)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", borderBottom: "1px solid var(--color-bg)" }}>
            <Search size={14} style={{ color: "var(--color-text-subtle)" }} aria-hidden="true" />
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={filtered.length ? optionId(activeIdx) : undefined}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIdx(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search countries…"
              aria-label="Search countries"
              style={{
                fontFamily: sans,
                fontSize: "14px",
                border: "none",
                width: "100%",
                color: "var(--color-text-primary)",
                backgroundColor: "transparent",
              }}
            />
          </div>
          <ul id={listboxId} role="listbox" aria-label={ariaLabel} style={{ listStyle: "none", margin: 0, padding: "4px", maxHeight: "220px", overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <li style={{ fontFamily: sans, fontSize: "13px", color: "var(--color-text-muted)", padding: "10px 12px" }}>
                No matches
              </li>
            ) : (
              filtered.map((o, i) => {
                const isSelected = o.value === value;
                const isActive = i === activeIdx;
                return (
                  <li
                    key={o.value}
                    id={optionId(i)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      choose(o.value);
                    }}
                    style={{
                      fontFamily: sans,
                      fontSize: "14px",
                      color: "var(--color-text-primary)",
                      padding: "9px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      backgroundColor: isActive
                        ? "rgba(var(--color-gold-rgb), 0.08)"
                        : "transparent",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {o.label}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
