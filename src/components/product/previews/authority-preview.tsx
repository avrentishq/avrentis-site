/**
 * AuthorityPreview — browser-frame for /product/authority. Shows the
 * delegation-of-authority matrix: who may approve what, up to which limit, and
 * what happens above it. Data is illustrative and PII-free — roles, not people,
 * which is also how the real engine holds authority.
 */

import { AUTHORITY_LIMITS, demoAmount } from "@/components/product/demo-fixtures";
import { HeaderAction, PreviewBody, PreviewHeader, PreviewTable } from "./preview-primitives";

export function AuthorityPreview() {
  return (
    <PreviewBody>
      <PreviewHeader
        title="Approval authority"
        subtitle="Payment vouchers · enforced on every submission"
        action={<HeaderAction>Edit policy</HeaderAction>}
      />

      <PreviewTable
        columns={[{ label: "Role" }, { label: "May approve" }, { label: "Above that" }]}
        gridTemplateColumns="1.1fr 1fr 1.3fr"
        rowPadding="9px 14px"
        rows={AUTHORITY_LIMITS.map((row, index) => {
          // What happens above a limit is the next row up; the top row is final.
          const next = AUTHORITY_LIMITS[index + 1];
          return {
            key: row.role,
            cells: (
              <>
                <span style={{ fontWeight: 500 }}>{row.role}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)" }}>
                  {row.limit === null ? "No ceiling" : `Up to ${demoAmount(row.limit)}`}
                </span>
                {next ? (
                  <span style={{ color: "var(--color-text-muted)" }}>Routes to {next.role}</span>
                ) : (
                  <span style={{ color: "var(--color-success)", fontWeight: 500 }}>Final approval</span>
                )}
              </>
            ),
          };
        })}
      />

      {/* Separation-of-duties footnote — the rule people forget they need. */}
      <p
        style={{
          fontSize: "var(--text-3xs)",
          color: "var(--color-text-muted)",
          margin: "10px 2px 0",
        }}
      >
        Nobody approves their own request, at any limit.
      </p>
    </PreviewBody>
  );
}
