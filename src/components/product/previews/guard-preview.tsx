/**
 * GuardPreview — browser-frame for /product/guard. Shows the Guard flags
 * inbox: each flag carries a rule type, the document/vendor it concerns, a
 * severity, and where it is in the review-and-resolve loop. Data is illustrative
 * and PII-free — mirrors the real inbox, which never renders bank/payee detail.
 */

export function GuardPreview() {
  const rows = [
    {
      rule: "DUPLICATE_PAYMENT",
      entity: "PV-2026-0188",
      severity: "High",
      status: "Open",
      ruleBg: "rgba(180,83,9,0.08)",
      ruleColor: "#78350f",
    },
    {
      rule: "VENDOR_BANK_CHANGE",
      entity: "Vendor · MegaSupplies Ltd",
      severity: "High",
      status: "Open",
      ruleBg: "rgba(190,18,60,0.08)",
      ruleColor: "#9f1239",
    },
    {
      rule: "THRESHOLD_GAMING",
      entity: "PV-2026-0181",
      severity: "Medium",
      status: "Under review",
      ruleBg: "rgba(var(--color-gold-rgb), 0.08)",
      ruleColor: "#92400e",
    },
    {
      rule: "DUPLICATE_INVOICE",
      entity: "PO-2026-0074",
      severity: "Medium",
      status: "Cleared",
      ruleBg: "rgba(4,120,87,0.08)",
      ruleColor: "#047857",
    },
  ];

  const statusColor: Record<string, string> = {
    Open: "#9f1239",
    "Under review": "#92400e",
    Cleared: "#047857",
  };

  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "18px", color: "#0f172a", margin: "0 0 2px" }}>
            Guard flags
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: 0 }}>
            3 open · caught before approval
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
          Review &amp; resolve
        </span>
      </div>

      {/* Flag rows */}
      <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1.2fr 0.7fr 0.9fr",
            gap: "10px",
            padding: "8px 14px",
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #e2e8f0",
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            color: "#64748b",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span>Rule</span>
          <span>Concerns</span>
          <span>Severity</span>
          <span style={{ textAlign: "right" }}>Status</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={`${row.rule}-${i}`}
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1.2fr 0.7fr 0.9fr",
              gap: "10px",
              padding: "8px 14px",
              borderTop: i === 0 ? "none" : "1px solid #e2e8f0",
              alignItems: "center",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                fontWeight: 500,
                padding: "2px 6px",
                borderRadius: "3px",
                backgroundColor: row.ruleBg,
                color: row.ruleColor,
                justifySelf: "start",
                letterSpacing: "0.02em",
              }}
            >
              {row.rule}
            </span>
            <span style={{ color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.entity}
            </span>
            <span style={{ color: "#64748b" }}>{row.severity}</span>
            <span style={{ color: statusColor[row.status] ?? "#64748b", textAlign: "right", fontWeight: 500 }}>
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
