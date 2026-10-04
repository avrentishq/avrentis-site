/**
 * ProcurePreview — browser-frame content for the /product/procure hero.
 * Mirrors the real PO detail view: reference + PO tag + status, vendor
 * card with bank info, line-item table, and the "Issue to vendor" export.
 */

export function ProcurePreview() {
  const lineItems = [
    { description: "Industrial diesel · 10,000L", qty: 10000, unit: "₦720", total: "₦7,200,000" },
    { description: "Fuel-grade additive (premium)", qty: 50, unit: "₦18,000", total: "₦900,000" },
    { description: "On-site delivery · November", qty: 1, unit: "₦140,000", total: "₦140,000" },
  ];

  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Reference + badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontFeatureSettings: '"tnum" 1', fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)" }}>
          PO-2026-0091
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
          PO
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
          Issued
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--color-text-muted)" }}>
          3 line items
        </span>
      </div>

      {/* Vendor + total */}
      <div
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          padding: "14px 16px",
          marginBottom: "12px",
        }}
      >
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, color: "var(--color-text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", margin: "0 0 6px" }}>
          Vendor
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 2px" }}>
          Greenfields Logistics Ltd.
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-muted)", margin: "0 0 10px" }}>
          RC 1245890 · Zenith Bank · 2012345678
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid var(--color-border)", paddingTop: "10px" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-muted)" }}>Total</span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontFeatureSettings: '"tnum" 1',
              fontSize: "18px",
              fontWeight: 500,
              color: "var(--color-text-primary)",
            }}
          >
            ₦8,240,000
          </span>
        </div>
      </div>

      {/* Line items table */}
      <div
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          marginBottom: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 50px 80px",
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
          <span>Item</span>
          <span style={{ textAlign: "right" }}>Qty</span>
          <span style={{ textAlign: "right" }}>Total</span>
        </div>
        {lineItems.map((item) => (
          <div
            key={item.description}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 50px 80px",
              gap: "10px",
              padding: "10px 14px",
              borderBottom: "1px solid var(--color-border)",
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "var(--color-text-primary)",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.description}</span>
            <span style={{ textAlign: "right", fontFeatureSettings: '"tnum" 1', color: "var(--color-text-muted)" }}>
              {item.qty.toLocaleString()}
            </span>
            <span style={{ textAlign: "right", fontFeatureSettings: '"tnum" 1', fontWeight: 500 }}>{item.total}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
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
          Issue to vendor
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
          PO PDF
        </button>
      </div>
    </div>
  );
}
