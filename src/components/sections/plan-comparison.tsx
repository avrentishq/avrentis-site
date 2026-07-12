"use client";

/**
 * PlanComparison — collapsible feature-comparison matrix for the pricing page.
 *
 * Grouping is NOT authored here: it consumes `data.featureGroups`, derived
 * server-side by the pricing API from the module→feature ownership SSOT
 * (deduped, orphan-free, coverage-complete). Cells read the per-plan boolean
 * `plan.features[key]`; row labels come from `data.featureLabels`. So a feature
 * newly sold on a plan appears automatically with no list to hand-maintain.
 *
 * Layout: one plan-name header + a native <details> accordion per group (all
 * open by default), the whole matrix behind a top-level <details> toggle.
 * Mobile (≤720px) swaps the 3-column matrix for a 2-plan picker to stay legible
 * at 390px.
 *
 * Styling follows the site convention (see every sibling in ./): structural +
 * colour styles are INLINE so they ship in this component's chunk and the
 * section stays legible even if the global stylesheet is stale or fails to
 * load. Only what inline can't express — the <details> disclosure markers and
 * row :hover — lives in globals.css under the `.pc-*` selectors that remain on
 * the elements below. Do NOT move structural styling back into globals: that
 * makes the whole table collapse to unstyled default-HTML on any CSS hiccup.
 */

import { useState } from "react";
import type { CSSProperties } from "react";
import type { Plan, PricingData } from "@/lib/pricing";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

const FIRST_COL = "42%";

// Use the API's precomputed labels — the raw numbers use `0` to mean unlimited.
const LIMIT_ROWS: { label: string; get: (plan: Plan) => string }[] = [
  { label: "Team members", get: (p) => p.limits.maxUsersLabel ?? "—" },
  { label: "Documents", get: (p) => p.limits.maxDocumentsPerMonthLabel ?? "—" },
  { label: "Storage", get: (p) => p.limits.maxStorageBytesLabel ?? "—" },
  { label: "Data retention", get: (p) => p.limits.documentRetentionDaysLabel ?? "—" },
];

// Structural + colour styles, inline per the site convention. CSS custom
// properties resolve here too, so theme tokens stay the source of truth.
const SANS = "var(--font-sans)";
const S = {
  section: {
    background: "var(--color-bg-light)",
    borderTop: "1px solid var(--color-border)",
    padding: "56px 0",
  },
  inner: { maxWidth: "1000px", margin: "0 auto", padding: "0 24px" },
  title: {
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: "24px",
    color: "var(--color-text-primary)",
    textAlign: "center",
    margin: "0 0 24px",
  },
  toggle: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-card)",
    background: "var(--color-white)",
    overflow: "hidden",
  },
  // Shared summary bits inline; the disclosure marker/::before stays in globals.
  summaryBase: {
    cursor: "pointer",
    listStyle: "none",
    fontFamily: SANS,
    fontWeight: 600,
    color: "var(--color-text-primary)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    userSelect: "none",
  },
  toggleSummary: {
    padding: "16px 20px",
    fontSize: "16px",
    background: "var(--color-gold-surface)",
  },
  groupSummary: {
    padding: "12px 20px",
    fontSize: "13px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--color-text-muted)",
    background: "var(--color-bg-light)",
  },
  header: {
    background: "var(--color-white)",
    boxShadow: "0 1px 0 var(--color-border)",
  },
  corner: { background: "var(--color-white)" },
  plan: {
    padding: "14px 12px",
    textAlign: "center",
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: "15px",
    color: "var(--color-navy-primary)",
  },
  group: { borderTop: "1px solid var(--color-border)" },
  feat: {
    padding: "11px 20px",
    textAlign: "left",
    fontFamily: SANS,
    fontWeight: 400,
    fontSize: "14px",
    color: "var(--color-text-secondary)",
  },
  cell: { padding: "11px 12px", textAlign: "center", verticalAlign: "middle" },
  yes: { color: "var(--color-gold-on-light)", fontWeight: 700, fontSize: "15px" },
  no: { color: "var(--color-text-subtle)" },
  limit: { fontSize: "13px", color: "var(--color-text-primary)", fontWeight: 500 },
  picker: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    borderBottom: "1px solid var(--color-border)",
    flexWrap: "wrap",
  },
  pickerField: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: SANS,
    fontSize: "13px",
    color: "var(--color-text-muted)",
  },
  pickerSelect: {
    fontFamily: SANS,
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--color-navy-primary)",
    padding: "6px 10px",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    background: "var(--color-white)",
  },
  pickerVs: { fontSize: "13px", color: "var(--color-text-subtle)" },
  sr: {
    position: "absolute",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
  },
} satisfies Record<string, CSSProperties>;

function Colgroup({ count }: { count: number }) {
  const each = `${(100 - parseFloat(FIRST_COL)) / count}%`;
  return (
    <colgroup>
      <col style={{ width: FIRST_COL }} />
      {Array.from({ length: count }, (_, i) => (
        <col key={i} style={{ width: each }} />
      ))}
    </colgroup>
  );
}

const tableStyle: CSSProperties = {
  width: "100%",
  tableLayout: "fixed",
  borderCollapse: "collapse",
  fontFamily: SANS,
};

export function PlanComparison({ data }: { data: PricingData }) {
  const groups = data.featureGroups ?? [];
  const planKeys = data.planOrder;
  const isMobile = useMediaQuery("(max-width: 720px)");
  // Default the mobile picker to the two most-differentiated tiers (top two).
  const [planA, setPlanA] = useState(() => planKeys[Math.max(0, planKeys.length - 2)]);
  const [planB, setPlanB] = useState(() => planKeys[planKeys.length - 1]);

  if (groups.length === 0) return null;

  const byKey = (k: string) => data.plans.find((p) => p.key === k);
  const effectiveB = planB === planA ? (planKeys.find((k) => k !== planA) ?? planB) : planB;
  const visibleKeys = isMobile ? [planA, effectiveB] : planKeys;
  const visiblePlans = visibleKeys.map(byKey).filter((p): p is Plan => !!p);
  const n = visiblePlans.length;

  const cell = (plan: Plan, featureKey: string) =>
    plan.features[featureKey] ? (
      <span style={S.yes} aria-label="Included">
        ✓
      </span>
    ) : (
      <span style={S.no} aria-label="Not included">
        —
      </span>
    );

  // A render helper, NOT a nested component — calling it inlines the <details>
  // into the parent tree so its (uncontrolled) open state survives re-renders
  // (e.g. changing the mobile plan picker). A nested component would remount and
  // reset every accordion the user had collapsed.
  const renderGroup = (
    key: string,
    label: string,
    rows: { key: string; label: string; render: (plan: Plan) => React.ReactNode }[],
  ) => (
    <details key={key} className="pc-group" style={S.group} open>
      <summary className="pc-group-summary" style={{ ...S.summaryBase, ...S.groupSummary }}>
        {label}
      </summary>
      <table style={tableStyle}>
        <Colgroup count={n} />
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.key}
              className="pc-row"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-border)" }}
            >
              <th scope="row" style={S.feat}>
                {row.label}
              </th>
              {visiblePlans.map((plan) => (
                <td key={plan.key} style={S.cell}>
                  {row.render(plan)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );

  return (
    <section style={S.section} aria-labelledby="pc-heading">
      <div style={S.inner}>
        <h2 id="pc-heading" style={S.title}>
          Compare plans in detail
        </h2>
        <details className="pc-toggle" style={S.toggle}>
          <summary className="pc-toggle-summary" style={{ ...S.summaryBase, ...S.toggleSummary }}>
            Compare all features
          </summary>

          <div>
            {isMobile && (
              <div style={S.picker}>
                <label style={S.pickerField}>
                  <span>Compare</span>
                  <select style={S.pickerSelect} value={planA} onChange={(e) => setPlanA(e.target.value)}>
                    {planKeys.map((k) => (
                      <option key={k} value={k}>
                        {byKey(k)?.name ?? k}
                      </option>
                    ))}
                  </select>
                </label>
                <span style={S.pickerVs}>vs</span>
                <label style={S.pickerField}>
                  <select
                    style={S.pickerSelect}
                    value={effectiveB}
                    onChange={(e) => setPlanB(e.target.value)}
                  >
                    {planKeys
                      .filter((k) => k !== planA)
                      .map((k) => (
                        <option key={k} value={k}>
                          {byKey(k)?.name ?? k}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
            )}

            {/* Plan-name header — shared column widths keep the group tables
                below it aligned (table-layout: fixed + identical colgroup). */}
            <table style={{ ...tableStyle, ...S.header }}>
              <Colgroup count={n} />
              <thead>
                <tr>
                  <th scope="col" style={S.corner}>
                    <span style={S.sr}>Feature</span>
                  </th>
                  {visiblePlans.map((plan) => (
                    <th key={plan.key} scope="col" style={S.plan}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>

            {renderGroup(
              "limits",
              "Plan limits",
              LIMIT_ROWS.map((r) => ({
                key: r.label,
                label: r.label,
                render: (plan: Plan) => <span style={S.limit}>{r.get(plan)}</span>,
              })),
            )}

            {groups.map((group) =>
              renderGroup(
                group.key,
                group.label,
                group.featureKeys.map((fk) => ({
                  key: fk,
                  label: data.featureLabels[fk] ?? fk,
                  render: (plan: Plan) => cell(plan, fk),
                })),
              ),
            )}
          </div>
        </details>
      </div>
    </section>
  );
}
