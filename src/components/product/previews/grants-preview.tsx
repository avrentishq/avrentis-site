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
    pct >= 90 ? "#9f1239" : pct >= 70 ? "#92400e" : "#047857";

  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "14px" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "18px", color: "#0f172a", margin: "0 0 2px" }}>
            Rural WASH Programme
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: 0 }}>
            Donor: Sahel Development Fund · Currency: USD
          </p>
        </div>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "12px",
            backgroundColor: "#0f172a",
            color: "#FFFFFF",
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
          { label: "Allocated", value: "$500,000", color: "#0f172a" },
          { label: "Spent", value: "$312,400", color: "#92400e" },
          { label: "Remaining", value: "$187,600", color: "#047857" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
              padding: "10px 12px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 500,
                color: "#64748b",
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
      <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #e2e8f0", borderRadius: "4px", padding: "12px 14px" }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            color: "#64748b",
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
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#0f172a" }}>{line.name}</span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "#64748b",
                  fontFeatureSettings: '"tnum" 1',
                }}
              >
                {line.pct}%
              </span>
            </div>
            <div style={{ height: "6px", backgroundColor: "#F1F5F9", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${line.pct}%`, height: "100%", backgroundColor: barColor(line.pct) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
