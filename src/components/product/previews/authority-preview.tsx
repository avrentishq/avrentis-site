/**
 * AuthorityPreview — browser-frame for /product/authority. Shows the
 * delegation-of-authority matrix: who may approve what, up to which limit, and
 * what happens above it. Data is illustrative and PII-free — roles, not people,
 * which is also how the real engine holds authority.
 */

export function AuthorityPreview() {
  const rows = [
    {
      role: "Officer",
      limit: "Up to ₦250,000",
      then: "Routes to Head of Department",
      tone: "#64748b",
    },
    {
      role: "Head of Department",
      limit: "Up to ₦2,000,000",
      then: "Routes to Finance",
      tone: "#64748b",
    },
    {
      role: "Finance Manager",
      limit: "Up to ₦10,000,000",
      then: "Routes to Managing Director",
      tone: "#64748b",
    },
    {
      role: "Managing Director",
      limit: "No ceiling",
      then: "Final approval",
      tone: "#047857",
    },
  ];

  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "18px",
              color: "#0f172a",
              margin: "0 0 2px",
            }}
          >
            Approval authority
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: 0 }}>
            Payment vouchers · enforced on every submission
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
          Edit policy
        </span>
      </div>

      {/* Authority rows */}
      <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr 1.3fr",
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
          <span>Role</span>
          <span>May approve</span>
          <span>Above that</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.role}
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr 1.3fr",
              gap: "10px",
              padding: "9px 14px",
              borderTop: i === 0 ? "none" : "1px solid #e2e8f0",
              alignItems: "center",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
            }}
          >
            <span style={{ color: "#0f172a", fontWeight: 500 }}>{row.role}</span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                color: "#0f172a",
              }}
            >
              {row.limit}
            </span>
            <span style={{ color: row.tone, fontWeight: row.tone === "#047857" ? 500 : 400 }}>
              {row.then}
            </span>
          </div>
        ))}
      </div>

      {/* Separation-of-duties footnote — the rule people forget they need. */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "10px",
          color: "#64748b",
          margin: "10px 2px 0",
        }}
      >
        Nobody approves their own request, at any limit.
      </p>
    </div>
  );
}
