/**
 * Stage-by-stage browser-frame mockups for /product/how-it-works.
 * Each mockup reflects the actual platform UI for that stage of the
 * approval lifecycle — not a fictional abstraction.
 */

// ── Stage 01 — Submit ────────────────────────────────────────────────

export function SubmitStageMockup() {
  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Heading */}
      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "18px", color: "#0f172a", margin: "0 0 4px" }}>
        New payment voucher
      </h3>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#64748b", margin: "0 0 18px" }}>
        Step 2 of 4 · Payment info
      </p>

      {/* Step dots */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              backgroundColor: i <= 1 ? "var(--color-gold)" : "#e2e8f0",
            }}
          />
        ))}
      </div>

      {/* Amount */}
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            color: "#64748b",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "5px",
          }}
        >
          Amount (NGN)
        </label>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #e2e8f0",
            borderRadius: "3px",
            padding: "10px 12px",
            fontFamily: "var(--font-sans)",
            fontFeatureSettings: '"tnum" 1',
            fontSize: "16px",
            fontWeight: 500,
            color: "#0f172a",
          }}
        >
          ₦850,000
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: "4px 0 0" }}>
          Eight hundred and fifty thousand naira
        </p>
      </div>

      {/* Purpose */}
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            color: "#64748b",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "5px",
          }}
        >
          Purpose
        </label>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #e2e8f0",
            borderRadius: "3px",
            padding: "10px 12px",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "#0f172a",
            minHeight: "40px",
          }}
        >
          Diesel supply — November
        </div>
      </div>

      {/* Department + cost code */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        <div>
          <label
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 500,
              color: "#64748b",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Department
          </label>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "3px",
              padding: "8px 10px",
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "#0f172a",
            }}
          >
            Operations
          </div>
        </div>
        <div>
          <label
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 500,
              color: "#64748b",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Cost code
          </label>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "3px",
              padding: "8px 10px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              color: "#0f172a",
            }}
          >
            OPS-FUEL-Q4
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
            padding: "8px 16px",
            cursor: "default",
          }}
        >
          ← Back
        </button>
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
            padding: "8px 18px",
            cursor: "default",
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ── Stage 02 — Review (query state) ─────────────────────────────────

export function ReviewStageMockup() {
  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Reference + status */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontFeatureSettings: '"tnum" 1', fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>
          PV-2026-0184
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            backgroundColor: "#0f172a",
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
            backgroundColor: "rgba(var(--color-gold-rgb), 0.08)",
            color: "#92400e",
            borderRadius: "3px",
            padding: "2px 6px",
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "var(--color-gold)" }} />
          Under review
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: "10px", color: "#64748b" }}>
          Finance
        </span>
      </div>

      {/* Summary */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          padding: "12px 14px",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "#0f172a" }}>
            Brightpath Technologies
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontFeatureSettings: '"tnum" 1',
              fontSize: "14px",
              fontWeight: 500,
              color: "#0f172a",
            }}
          >
            ₦850,000
          </span>
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: 0 }}>
          Diesel supply — November · Operations · Submitted by Fatima Abubakar
        </p>
      </div>

      {/* Query composition */}
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
            margin: "0 0 8px",
          }}
        >
          Query the submitter
        </p>
        <div
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid #e2e8f0",
            borderRadius: "3px",
            padding: "10px 12px",
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            color: "#0f172a",
            lineHeight: 1.55,
          }}
        >
          Can you attach the quotation for the 10,000L diesel order? The
          price per litre looks above the last quote from Greenfields.
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
          Your decision
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
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
            Approve
          </button>
          <button
            type="button"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "12px",
              backgroundColor: "var(--color-gold)",
              color: "#0f172a",
              border: "none",
              borderRadius: "3px",
              padding: "8px 0",
              cursor: "default",
            }}
          >
            Send query
          </button>
          <button
            type="button"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "12px",
              backgroundColor: "#FFFFFF",
              color: "#b91c1c",
              border: "1px solid rgba(185,28,28,0.3)",
              borderRadius: "3px",
              padding: "8px 0",
              cursor: "default",
            }}
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stage 03 — Sanction (MD signs off) ──────────────────────────────

export function SanctionStageMockup() {
  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Reference + status */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontFeatureSettings: '"tnum" 1', fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>
          PV-2026-0184
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            backgroundColor: "#0f172a",
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
            backgroundColor: "rgba(var(--color-gold-rgb), 0.08)",
            color: "#92400e",
            borderRadius: "3px",
            padding: "2px 6px",
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "var(--color-gold)" }} />
          MD sanction pending
        </span>
      </div>

      {/* Prior approvers */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          padding: "12px 14px",
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
          Prior approvals
        </p>
        {[
          { role: "Submitted", actor: "Fatima Abubakar · Staff", when: "09:14" },
          { role: "Reviewed", actor: "Chinedu Okafor · Finance", when: "11:02" },
        ].map((s) => (
          <div key={s.role} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "4px 0" }}>
            <span
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #047857",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#047857", fontSize: "9px", lineHeight: 1 }}>✓</span>
            </span>
            <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: "12px", color: "#0f172a" }}>
              {s.role} <span style={{ color: "#64748b" }}>— {s.actor}</span>
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", fontFeatureSettings: '"tnum" 1' }}>
              {s.when}
            </span>
          </div>
        ))}
      </div>

      {/* Signature capture + MD action */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          padding: "14px 16px",
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
          Your sanction
        </p>
        <div
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px dashed #e2e8f0",
            borderRadius: "4px",
            padding: "16px 14px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: "0 0 2px" }}>
              Saved signature
            </p>
            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "22px",
                color: "#0f172a",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              Aisha Danjuma
            </p>
          </div>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              color: "var(--color-gold-on-light)",
              fontWeight: 500,
            }}
          >
            Change →
          </span>
        </div>
        <button
          type="button"
          style={{
            width: "100%",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "13px",
            backgroundColor: "#0f172a",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "3px",
            padding: "10px 0",
            cursor: "default",
          }}
        >
          Sanction ₦850,000
        </button>
      </div>
    </div>
  );
}

// ── Stage 04 — Record ───────────────────────────────────────────────

export function RecordStageMockup() {
  const stages = [
    { role: "Submitted", actor: "Fatima Abubakar · Staff", when: "15 Apr, 09:14" },
    { role: "Reviewed", actor: "Chinedu Okafor · Finance", when: "15 Apr, 11:02" },
    { role: "Sanctioned", actor: "Aisha Danjuma · MD", when: "15 Apr, 14:32" },
  ];
  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Status strip */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>
          PV-2026-0184
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
          Immutable
        </span>
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
          Approval timeline
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
          {stages.map((s) => (
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
            padding: "9px 0",
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
            padding: "9px 0",
            cursor: "default",
          }}
        >
          Voucher PDF
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
            padding: "9px 0",
            cursor: "default",
          }}
        >
          Audit export
        </button>
      </div>
    </div>
  );
}
