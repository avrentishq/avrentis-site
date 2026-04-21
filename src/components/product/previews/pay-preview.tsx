/**
 * PayPreview — browser-frame content for the /product/pay hero.
 * Mirrors the real voucher detail view in the platform: reference + PV tag +
 * status, amount + payee summary, approval timeline, and the bank-ready
 * export affordance that Pay users reach for.
 */

export function PayPreview() {
  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Reference + badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontFeatureSettings: '"tnum" 1',
            fontSize: "13px",
            fontWeight: 500,
            color: "#0f172a",
          }}
        >
          PV-2026-0184
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
          PV
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            backgroundColor: "rgba(4,120,87,0.08)",
            color: "#047857",
            borderRadius: "3px",
            padding: "2px 6px",
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#047857" }} />
          Approved
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: "10px", color: "#64748b" }}>
          Bank-ready
        </span>
      </div>

      {/* Summary block */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          padding: "14px 16px",
          marginBottom: "12px",
        }}
      >
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "#0f172a", margin: "0 0 2px" }}>
          Brightpath Technologies
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontFeatureSettings: '"tnum" 1',
            fontSize: "22px",
            fontWeight: 500,
            color: "#0f172a",
            margin: "0 0 12px",
          }}
        >
          ₦850,000
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "88px 1fr", rowGap: "5px", fontFamily: "var(--font-sans)", fontSize: "11px" }}>
          <span style={{ color: "#64748b" }}>Purpose</span>
          <span style={{ color: "#0f172a" }}>Diesel supply — November</span>
          <span style={{ color: "#64748b" }}>Account</span>
          <span style={{ color: "#0f172a", fontFeatureSettings: '"tnum" 1' }}>GTB · 0123456789</span>
          <span style={{ color: "#64748b" }}>Department</span>
          <span style={{ color: "#0f172a" }}>Operations</span>
        </div>
      </div>

      {/* Approval timeline */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          padding: "14px 16px",
          marginBottom: "12px",
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
            margin: "0 0 10px",
          }}
        >
          Approval chain
        </p>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "9px",
              top: "8px",
              bottom: "8px",
              width: "1px",
              backgroundColor: "#e2e8f0",
            }}
          />
          {[
            { role: "Submitted", actor: "Fatima Abubakar · Staff", when: "09:14" },
            { role: "Reviewed", actor: "Chinedu Okafor · Finance", when: "11:02" },
            { role: "Sanctioned", actor: "Aisha Danjuma · MD", when: "14:32" },
          ].map((s) => (
            <div key={s.role} style={{ position: "relative", display: "flex", gap: "12px", padding: "4px 0" }}>
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #047857",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                <span style={{ color: "#047857", fontSize: "10px", lineHeight: 1 }}>✓</span>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "#0f172a", margin: 0 }}>
                  {s.role} <span style={{ color: "#64748b", fontWeight: 400 }}>— {s.actor}</span>
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: "1px 0 0" }}>
                  {s.when}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export affordances */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          style={{
            flex: 1,
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
          Bank instruction
        </button>
        <button
          type="button"
          style={{
            flex: 1,
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
          Voucher PDF
        </button>
      </div>
    </div>
  );
}
