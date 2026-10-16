/**
 * GrantsPreview — browser-frame for /product/grants. Shows a grant burn card:
 * the grant's donor + currency, allocated-vs-spent-vs-remaining, and utilisation
 * per budget line. Figures are illustrative; remaining and utilisation are
 * calculated from allocated and spent, never typed.
 */

import { GRANT } from "@/components/product/demo-fixtures";
import { formatCurrencyAmount } from "@/lib/money";
import { HeaderAction, PreviewBody, PreviewCard, PreviewHeader, PreviewLabel } from "./preview-primitives";

const REMAINING = GRANT.allocated - GRANT.spent;
const UTILISED_PERCENT = Math.round((GRANT.spent / GRANT.allocated) * 100);

function barColour(utilisedPercent: number): string {
  if (utilisedPercent >= 90) return "var(--color-critical)";
  if (utilisedPercent >= 70) return "var(--color-warning)";
  return "var(--color-success)";
}

export function GrantsPreview() {
  const stats = [
    { label: "Allocated", value: GRANT.allocated, colour: "var(--color-text-primary)" },
    { label: "Spent", value: GRANT.spent, colour: "var(--color-warning)" },
    { label: "Remaining", value: REMAINING, colour: "var(--color-success)" },
  ];

  return (
    <PreviewBody>
      <PreviewHeader
        title={GRANT.name}
        subtitle={`Donor: ${GRANT.donor} · Currency: ${GRANT.currency}`}
        action={<HeaderAction>Generate report</HeaderAction>}
        marginBottom="14px"
      />

      {/* Burn summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
        {stats.map((stat) => (
          <PreviewCard key={stat.label} padding="10px 12px">
            <PreviewLabel marginBottom="4px">{stat.label}</PreviewLabel>
            <p
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 500,
                color: stat.colour,
                margin: 0,
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              {formatCurrencyAmount(stat.value, GRANT.currency)}
            </p>
          </PreviewCard>
        ))}
      </div>

      {/* Budget lines */}
      <PreviewCard padding="12px 14px">
        <PreviewLabel>Budget lines · {UTILISED_PERCENT}% utilised</PreviewLabel>
        {GRANT.budgetLines.map((line) => (
          <div key={line.name} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
              <span style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-primary)" }}>{line.name}</span>
              <span style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", fontFeatureSettings: '"tnum" 1' }}>
                {line.utilisedPercent}%
              </span>
            </div>
            <div style={{ height: "6px", backgroundColor: "var(--color-bg)", borderRadius: "var(--radius-xs)", overflow: "hidden" }}>
              <div style={{ width: `${line.utilisedPercent}%`, height: "100%", backgroundColor: barColour(line.utilisedPercent) }} />
            </div>
          </div>
        ))}
      </PreviewCard>
    </PreviewBody>
  );
}
