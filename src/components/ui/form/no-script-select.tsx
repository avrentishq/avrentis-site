/**
 * A native <select> shown only when JavaScript is off, standing in for a
 * script-driven picker (ChoiceGroup, SearchableSelect) that does nothing then.
 *
 * Render it BEFORE the picker's hidden input: both carry the same `name`, and
 * the server action reads the first value in document order. With scripts on,
 * a <noscript> body is inert, so only the hidden input posts.
 */

const sans = "var(--font-sans)";

const selectStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "14px",
  color: "var(--color-text-primary)",
  width: "100%",
  height: "42px",
  border: "1px solid var(--color-border)",
  borderRadius: "6px",
  padding: "0 12px",
  backgroundColor: "var(--color-white)",
};

export function NoScriptSelect({
  name,
  value,
  options,
  ariaLabel,
  placeholder,
}: {
  name: string;
  value: string;
  options: readonly { value: string; label: string }[];
  ariaLabel: string;
  /** Shown as an empty first choice when nothing is picked yet. */
  placeholder?: string;
}) {
  return (
    <noscript>
      <select name={name} defaultValue={value} aria-label={ariaLabel} style={selectStyle}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </noscript>
  );
}
