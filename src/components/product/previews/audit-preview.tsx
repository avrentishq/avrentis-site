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
      actionBg: "rgba(var(--color-success-rgb), 0.08)",
      actionColor: "var(--color-success)",
    },
    {
      action: "PV_APPROVED",
      actor: "Chinedu Okafor · Finance",
      entity: "PV-2026-0184",
      when: "11:02",
      actionBg: "rgba(var(--color-gold-rgb), 0.08)",
      actionColor: "var(--color-warning)",
    },
    {
      action: "PV_QUERIED",
      actor: "Chinedu Okafor · Finance",
      entity: "PV-2026-0182",
      when: "10:48",
      actionBg: "rgba(var(--color-queried-accent-rgb), 0.08)",
      actionColor: "var(--color-queried)",
    },
    {
      action: "USER_ROLE_CHANGED",
      actor: "Tunde Bello · Admin",
      entity: "user:ifeoma.n@acme.ng",
      when: "09:15",
      actionBg: "rgba(var(--color-identity-tint-rgb), 0.08)",
      actionColor: "var(--color-identity)",
    },
    {
      action: "PV_SUBMITTED",
      actor: "Fatima Abubakar · Staff",
      entity: "PV-2026-0184",
      when: "09:14",
      actionBg: "rgba(var(--color-warning-accent-rgb), 0.08)",
      actionColor: "var(--color-warning-strong)",
    },
  ];

  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "18px", color: "var(--color-text-primary)", margin: "0 0 2px" }}>
            Audit trail
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-muted)", margin: 0 }}>
            1,284 events · Tamper-evident
          </p>
        </div>
        <button
          type="button"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "12px",
            backgroundColor: "var(--color-navy-primary)",
            color: "var(--color-white)",
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
              backgroundColor: i === 0 ? "var(--color-navy-primary)" : "var(--color-white)",
              color: i === 0 ? "var(--color-white)" : "var(--color-navy-primary)",
              border: i === 0 ? "1px solid var(--color-navy-primary)" : "1px solid var(--color-border)",
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Audit rows */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "4px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.2fr 0.9fr 50px",
            gap: "10px",
            padding: "8px 14px",
            backgroundColor: "var(--color-bg-light)",
            borderBottom: "1px solid var(--color-border)",
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            color: "var(--color-text-muted)",
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
              borderTop: i === 0 ? "none" : "1px solid var(--color-border)",
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
            <span style={{ color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.actor}
            </span>
            <span style={{ color: "var(--color-text-muted)", fontFeatureSettings: '"tnum" 1', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.entity}
            </span>
            <span style={{ color: "var(--color-text-muted)", textAlign: "right", fontFeatureSettings: '"tnum" 1' }}>
              {row.when}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
