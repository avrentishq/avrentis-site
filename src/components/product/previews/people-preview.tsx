/**
 * PeoplePreview — browser-frame for /product/people. Shows an expense
 * claim review screen: employee info, category, amount, receipts, purpose,
 * approver decision panel.
 */

import { EXPENSE_CLAIM, demoAmount } from "@/components/product/demo-fixtures";
import { formatCount } from "@/lib/money";
import { DetailGrid, DocumentHeading, MockButton, PreviewBody, PreviewCard, PreviewLabel } from "./preview-primitives";

/** "IN" for "Ifeoma Nwachukwu". */
function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function PeoplePreview() {
  return (
    <PreviewBody>
      <DocumentHeading
        reference={EXPENSE_CLAIM.reference}
        typeTag="EXPENSE"
        status={{ label: "Pending approval", tone: "pending" }}
      />

      {/* Employee block */}
      <PreviewCard marginBottom="12px" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-circle)",
            backgroundColor: "var(--color-navy-primary)",
            color: "var(--color-white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
          }}
        >
          {initials(EXPENSE_CLAIM.claimant)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 2px" }}>
            {EXPENSE_CLAIM.claimant}
          </p>
          <p style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", margin: 0 }}>
            {EXPENSE_CLAIM.claimantDetail}
          </p>
        </div>
        <span style={{ fontSize: "var(--text-3xs)", fontWeight: 500, color: "var(--color-text-muted)" }}>
          {formatCount(EXPENSE_CLAIM.receiptCount)} receipts
        </span>
      </PreviewCard>

      <PreviewCard marginBottom="12px">
        <DetailGrid
          labelWidth="90px"
          rowGap="6px"
          items={[
            { label: "Type", value: EXPENSE_CLAIM.category },
            { label: "Amount", value: demoAmount(EXPENSE_CLAIM.amount), numeric: true },
            { label: "Purpose", value: EXPENSE_CLAIM.purpose },
            { label: "Paid to", value: `${EXPENSE_CLAIM.claimant} (employee payee)` },
          ]}
        />
      </PreviewCard>

      <PreviewCard>
        <PreviewLabel>Your decision</PreviewLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <MockButton variant="primary" fill>
            Approve
          </MockButton>
          <MockButton variant="secondary" fill>
            Request changes
          </MockButton>
        </div>
      </PreviewCard>
    </PreviewBody>
  );
}
