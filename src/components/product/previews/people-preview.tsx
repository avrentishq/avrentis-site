/**
 * PeoplePreview — browser-frame for /product/people. Shows an expense
 * claim review screen: employee info, category, amount, receipts, purpose,
 * approver decision panel.
 */

export function PeoplePreview() {
  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Reference + badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontFeatureSettings: '"tnum" 1', fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)" }}>
          ER-2026-0042
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            backgroundColor: "var(--color-navy-primary)",
            color: "var(--color-gold)",
            borderRadius: "3px",
            padding: "1px 5px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          EXPENSE
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            backgroundColor: "rgba(var(--color-gold-rgb), 0.08)",
            color: "var(--color-warning)",
            borderRadius: "3px",
            padding: "2px 6px",
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "var(--color-gold)" }} />
          Pending approval
        </span>
      </div>

      {/* Employee block */}
      <div
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          padding: "14px 16px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "var(--color-navy-primary)",
            color: "var(--color-white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          IN
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 2px" }}>
            Ifeoma Nwachukwu
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-muted)", margin: 0 }}>
            Administrator · Operations · Joined Feb 2024
          </p>
        </div>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, color: "var(--color-text-muted)" }}>
          2 receipts
        </span>
      </div>

      {/* Request details */}
      <div
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          padding: "14px 16px",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", rowGap: "6px", fontFamily: "var(--font-sans)", fontSize: "11px" }}>
          <span style={{ color: "var(--color-text-muted)" }}>Type</span>
          <span style={{ color: "var(--color-text-primary)" }}>Travel</span>
          <span style={{ color: "var(--color-text-muted)" }}>Amount</span>
          <span style={{ color: "var(--color-text-primary)", fontFeatureSettings: '"tnum" 1' }}>₦84,500</span>
          <span style={{ color: "var(--color-text-muted)" }}>Purpose</span>
          <span style={{ color: "var(--color-text-primary)" }}>Client site visit, Abuja</span>
          <span style={{ color: "var(--color-text-muted)" }}>Paid to</span>
          <span style={{ color: "var(--color-text-primary)" }}>Ifeoma Nwachukwu (employee payee)</span>
        </div>
      </div>

      {/* Action panel */}
      <div
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          padding: "14px 16px",
        }}
      >
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, color: "var(--color-text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", margin: "0 0 10px" }}>
          Your decision
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
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
              padding: "8px 0",
              cursor: "default",
            }}
          >
            Approve
          </button>
          <button
            type="button"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "12px",
              backgroundColor: "var(--color-white)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              borderRadius: "3px",
              padding: "8px 0",
              cursor: "default",
            }}
          >
            Request changes
          </button>
        </div>
      </div>
    </div>
  );
}
