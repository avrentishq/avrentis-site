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
 * Layout: one sticky plan-name header + a native <details> accordion per group
 * (all open by default), the whole matrix behind a top-level <details> toggle.
 * Mobile (≤720px) swaps the 3-column matrix for a 2-plan picker to stay legible
 * at 390px.
 */

import { useState } from "react";
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

const tableStyle: React.CSSProperties = {
  width: "100%",
  tableLayout: "fixed",
  borderCollapse: "collapse",
  fontFamily: "var(--font-sans)",
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
      <span className="pc-yes" aria-label="Included">
        ✓
      </span>
    ) : (
      <span className="pc-no" aria-label="Not included">
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
    <details key={key} className="pc-group" open>
      <summary className="pc-group-summary">{label}</summary>
      <table style={tableStyle}>
        <Colgroup count={n} />
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="pc-row">
              <th scope="row" className="pc-feat">
                {row.label}
              </th>
              {visiblePlans.map((plan) => (
                <td key={plan.key} className="pc-cell">
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
    <section className="pc-section" aria-labelledby="pc-heading">
      <div className="pc-inner">
        <h2 id="pc-heading" className="pc-title">
          Compare plans in detail
        </h2>
        <details className="pc-toggle">
          <summary className="pc-toggle-summary">Compare all features</summary>

          <div className="pc-scroll">
            {isMobile && (
              <div className="pc-picker">
                <label className="pc-picker-field">
                  <span>Compare</span>
                  <select value={planA} onChange={(e) => setPlanA(e.target.value)}>
                    {planKeys.map((k) => (
                      <option key={k} value={k}>
                        {byKey(k)?.name ?? k}
                      </option>
                    ))}
                  </select>
                </label>
                <span className="pc-picker-vs">vs</span>
                <label className="pc-picker-field">
                  <select value={effectiveB} onChange={(e) => setPlanB(e.target.value)}>
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

            {/* Sticky plan-name header — shared column widths keep the group
                tables below it aligned (table-layout: fixed + identical colgroup). */}
            <table style={tableStyle} className="pc-header">
              <Colgroup count={n} />
              <thead>
                <tr>
                  <th className="pc-corner" scope="col">
                    <span className="pc-sr">Feature</span>
                  </th>
                  {visiblePlans.map((plan) => (
                    <th key={plan.key} scope="col" className="pc-plan">
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
                render: (plan: Plan) => <span className="pc-limit">{r.get(plan)}</span>,
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
