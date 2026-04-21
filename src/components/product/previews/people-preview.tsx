/**
 * PeoplePreview — browser-frame for /product/people. Shows a leave
 * request review screen: employee info, leave window, reason, manager
 * approval panel. Mirrors how an HR approval will surface once People ships.
 */

export function PeoplePreview() {
  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Reference + badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontFeatureSettings: '"tnum" 1', fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>
          LV-2026-0042
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            backgroundColor: "#0f172a",
            color: "#C68B2F",
            borderRadius: "3px",
            padding: "1px 5px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          LEAVE
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            backgroundColor: "rgba(198,139,47,0.08)",
            color: "#92400e",
            borderRadius: "3px",
            padding: "2px 6px",
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#C68B2F" }} />
          Pending approval
        </span>
      </div>

      {/* Employee block */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
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
            backgroundColor: "#0f172a",
            color: "#FFFFFF",
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
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "#0f172a", margin: "0 0 2px" }}>
            Ifeoma Nwachukwu
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: 0 }}>
            Administrator · Operations · Joined Feb 2024
          </p>
        </div>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, color: "#64748b" }}>
          Balance: 14 days
        </span>
      </div>

      {/* Request details */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          padding: "14px 16px",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", rowGap: "6px", fontFamily: "var(--font-sans)", fontSize: "11px" }}>
          <span style={{ color: "#64748b" }}>Type</span>
          <span style={{ color: "#0f172a" }}>Annual leave</span>
          <span style={{ color: "#64748b" }}>Dates</span>
          <span style={{ color: "#0f172a", fontFeatureSettings: '"tnum" 1' }}>15 Dec — 22 Dec (6 working days)</span>
          <span style={{ color: "#64748b" }}>Reason</span>
          <span style={{ color: "#0f172a" }}>Year-end break with family</span>
          <span style={{ color: "#64748b" }}>Cover</span>
          <span style={{ color: "#0f172a" }}>Samuel Adeyemi (Operations)</span>
        </div>
      </div>

      {/* Action panel */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          padding: "14px 16px",
        }}
      >
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase", margin: "0 0 10px" }}>
          Your decision
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
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
              backgroundColor: "#FFFFFF",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
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
