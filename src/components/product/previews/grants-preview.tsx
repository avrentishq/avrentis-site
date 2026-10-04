/**
 * GrantsPreview — browser-frame for /product/grants. Shows a grant burn card:
 * the grant's donor + currency, allocated-vs-spent-vs-remaining, and utilisation
 * per budget line. Figures are illustrative.
 */

export function GrantsPreview() {
  const lines = [
    { name: "Personnel", pct: 78 },
    { name: "Equipment & supplies", pct: 45 },
    { name: "Travel & logistics", pct: 30 },
    { name: "Monitoring & evaluation", pct: 12 },
  ];

  const barColor = (pct: number) =>
    pct >= 90 ? "var(--color-critical)" : pct >= 70 ? "var(--color-warning)" : "var(--color-success)";

  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "14px" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "18px", color: "var(--color-text-primary)", margin: "0 0 2px" }}>
            Rural WASH Programme
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-muted)", margin: 0 }}>
            Donor: Sahel Development Fund · Currency: USD
          </p>
        </div>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "12px",
            backgroundColor: "var(--color-navy-primary)",
            color: "var(--color-white)",
            borderRadius: "3px",
            padding: "6px 14px",
          }}
        >
          Generate report
        </span>
      </div>

      {/* Burn summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
          marginBottom: "14px",
        }}
      >
        {[
          { label: "Allocated", value: "$500,000", color: "var(--color-text-primary)" },
          { label: "Spent", value: "$312,400", color: "var(--color-warning)" },
          { label: "Remaining", value: "$187,600", color: "var(--color-success)" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: "var(--color-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "4px",
              padding: "10px 12px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 500,
                color: "var(--color-text-muted)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                margin: "0 0 4px",
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                fontWeight: 500,
                color: stat.color,
                margin: 0,
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Budget lines */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "12px 14px" }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            margin: "0 0 10px",
          }}
        >
          Budget lines · 62% utilised
        </p>
        {lines.map((line) => (
          <div key={line.name} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-primary)" }}>{line.name}</span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  fontFeatureSettings: '"tnum" 1',
                }}
              >
                {line.pct}%
              </span>
            </div>
            <div style={{ height: "6px", backgroundColor: "var(--color-bg)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${line.pct}%`, height: "100%", backgroundColor: barColor(line.pct) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
