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
      tone: "var(--color-text-muted)",
    },
    {
      role: "Head of Department",
      limit: "Up to ₦2,000,000",
      then: "Routes to Finance",
      tone: "var(--color-text-muted)",
    },
    {
      role: "Finance Manager",
      limit: "Up to ₦10,000,000",
      then: "Routes to Managing Director",
      tone: "var(--color-text-muted)",
    },
    {
      role: "Managing Director",
      limit: "No ceiling",
      then: "Final approval",
      tone: "var(--color-success)",
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
              color: "var(--color-text-primary)",
              margin: "0 0 2px",
            }}
          >
            Approval authority
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-muted)", margin: 0 }}>
            Payment vouchers · enforced on every submission
          </p>
        </div>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "12px",
            backgroundColor: "var(--color-navy-primary)",
            color: "var(--color-white)",
            borderRadius: "3px",
            padding: "6px 14px",
          }}
        >
          Edit policy
        </span>
      </div>

      {/* Authority rows */}
      <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "4px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr 1.3fr",
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
              borderTop: i === 0 ? "none" : "1px solid var(--color-border)",
              alignItems: "center",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
            }}
          >
            <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{row.role}</span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                color: "var(--color-text-primary)",
              }}
            >
              {row.limit}
            </span>
            <span style={{ color: row.tone, fontWeight: row.tone === "var(--color-success)" ? 500 : 400 }}>
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
          color: "var(--color-text-muted)",
          margin: "10px 2px 0",
        }}
      >
        Nobody approves their own request, at any limit.
      </p>
    </div>
  );
}
