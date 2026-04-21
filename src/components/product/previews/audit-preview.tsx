/**
 * AuditPreview — browser-frame for /product/audit. Shows the audit trail
 * table with action labels, actor names, entity refs, IP + user-agent, and
 * timestamps, plus an export panel.
 */

export function AuditPreview() {
  const rows = [
    {
      action: "PV_SANCTIONED",
      actor: "Aisha Danjuma · MD",
      entity: "PV-2026-0184",
      when: "14:32",
      actionBg: "rgba(4,120,87,0.08)",
      actionColor: "#047857",
    },
    {
      action: "PV_APPROVED",
      actor: "Chinedu Okafor · Finance",
      entity: "PV-2026-0184",
      when: "11:02",
      actionBg: "rgba(198,139,47,0.08)",
      actionColor: "#92400e",
    },
    {
      action: "PV_QUERIED",
      actor: "Chinedu Okafor · Finance",
      entity: "PV-2026-0182",
      when: "10:48",
      actionBg: "rgba(91,33,182,0.08)",
      actionColor: "#3B0764",
    },
    {
      action: "USER_ROLE_CHANGED",
      actor: "Tunde Bello · Admin",
      entity: "user:ifeoma.n@acme.ng",
      when: "09:15",
      actionBg: "rgba(29,78,216,0.08)",
      actionColor: "#1e3a8a",
    },
    {
      action: "PV_SUBMITTED",
      actor: "Fatima Abubakar · Staff",
      entity: "PV-2026-0184",
      when: "09:14",
      actionBg: "rgba(180,83,9,0.08)",
      actionColor: "#78350f",
    },
  ];

  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "18px", color: "#0f172a", margin: "0 0 2px" }}>
            Audit trail
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: 0 }}>
            1,284 events · Immutable
          </p>
        </div>
        <button
          type="button"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "12px",
            backgroundColor: "#0f172a",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "3px",
            padding: "6px 14px",
            cursor: "default",
          }}
        >
          Export PDF
        </button>
      </div>

      {/* Filters row */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
        {["All events", "Payments", "Procurement", "Access", "Compliance"].map((f, i) => (
          <span
            key={f}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              fontWeight: 500,
              padding: "3px 8px",
              borderRadius: "3px",
              backgroundColor: i === 0 ? "#0f172a" : "#FFFFFF",
              color: i === 0 ? "#FFFFFF" : "#0f172a",
              border: i === 0 ? "1px solid #0f172a" : "1px solid #e2e8f0",
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Audit rows */}
      <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.2fr 0.9fr 50px",
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
          <span>Action</span>
          <span>Actor</span>
          <span>Entity</span>
          <span style={{ textAlign: "right" }}>Time</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={`${row.action}-${i}`}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.2fr 0.9fr 50px",
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
                backgroundColor: row.actionBg,
                color: row.actionColor,
                justifySelf: "start",
                letterSpacing: "0.02em",
              }}
            >
              {row.action}
            </span>
            <span style={{ color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.actor}
            </span>
            <span style={{ color: "#64748b", fontFeatureSettings: '"tnum" 1', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.entity}
            </span>
            <span style={{ color: "#64748b", textAlign: "right", fontFeatureSettings: '"tnum" 1' }}>
              {row.when}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
