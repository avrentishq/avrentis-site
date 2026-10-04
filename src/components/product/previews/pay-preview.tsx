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
            color: "var(--color-text-primary)",
          }}
        >
          PV-2026-0184
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
            backgroundColor: "rgba(var(--color-success-rgb), 0.08)",
            color: "var(--color-success)",
            borderRadius: "3px",
            padding: "2px 6px",
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "var(--color-success)" }} />
          Approved
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--color-text-muted)" }}>
          Bank-ready
        </span>
      </div>

      {/* Summary block */}
      <div
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          padding: "14px 16px",
          marginBottom: "12px",
        }}
      >
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 2px" }}>
          Brightpath Technologies
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontFeatureSettings: '"tnum" 1',
            fontSize: "22px",
            fontWeight: 500,
            color: "var(--color-text-primary)",
            margin: "0 0 12px",
          }}
        >
          ₦850,000
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "88px 1fr", rowGap: "5px", fontFamily: "var(--font-sans)", fontSize: "11px" }}>
          <span style={{ color: "var(--color-text-muted)" }}>Purpose</span>
          <span style={{ color: "var(--color-text-primary)" }}>Diesel supply — November</span>
          <span style={{ color: "var(--color-text-muted)" }}>Account</span>
          <span style={{ color: "var(--color-text-primary)", fontFeatureSettings: '"tnum" 1' }}>GTB · 0123456789</span>
          <span style={{ color: "var(--color-text-muted)" }}>Department</span>
          <span style={{ color: "var(--color-text-primary)" }}>Operations</span>
        </div>
      </div>

      {/* Approval timeline */}
      <div
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
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
            color: "var(--color-text-muted)",
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
              backgroundColor: "var(--color-border)",
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
                  backgroundColor: "var(--color-white)",
                  border: "1.5px solid var(--color-success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                <span style={{ color: "var(--color-success)", fontSize: "10px", lineHeight: 1 }}>✓</span>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
                  {s.role} <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>— {s.actor}</span>
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-muted)", margin: "1px 0 0" }}>
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
            backgroundColor: "var(--color-navy-primary)",
            color: "var(--color-white)",
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
            backgroundColor: "var(--color-white)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
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
