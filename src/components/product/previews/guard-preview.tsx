/**
 * GuardPreview — browser-frame for /product/guard. Shows the Guard flags
 * inbox: each flag carries a rule type, the document/vendor it concerns, a
 * severity, and where it is in the review-and-resolve loop. Data is illustrative
 * and PII-free — mirrors the real inbox, which never renders bank/payee detail.
 */

import { FLAGGED_SUBJECTS, STIPEND_VOUCHER } from "@/components/product/demo-fixtures";
import { formatCount } from "@/lib/money";
import { CodeTag, HeaderAction, PreviewBody, PreviewHeader, PreviewTable } from "./preview-primitives";

type FlagStatus = "Open" | "Under review" | "Cleared";

const STATUS_COLOUR: Record<FlagStatus, string> = {
  Open: "var(--color-critical)",
  "Under review": "var(--color-warning)",
  Cleared: "var(--color-success)",
};

const FLAGS: readonly {
  rule: string;
  concerns: string;
  severity: string;
  status: FlagStatus;
  ruleBackground: string;
  ruleColour: string;
}[] = [
  {
    rule: "DUPLICATE_PAYMENT",
    concerns: FLAGGED_SUBJECTS.duplicatePaymentReference,
    severity: "High",
    status: "Open",
    ruleBackground: "rgba(var(--color-warning-accent-rgb), 0.08)",
    ruleColour: "var(--color-warning-strong)",
  },
  {
    rule: "VENDOR_BANK_CHANGE",
    concerns: `Vendor · ${FLAGGED_SUBJECTS.bankChangeVendor}`,
    severity: "High",
    status: "Open",
    ruleBackground: "rgba(var(--color-critical-tint-rgb), 0.08)",
    ruleColour: "var(--color-critical)",
  },
  {
    rule: "THRESHOLD_GAMING",
    concerns: STIPEND_VOUCHER.reference,
    severity: "Medium",
    status: "Under review",
    ruleBackground: "var(--color-gold-ghost)",
    ruleColour: "var(--color-warning)",
  },
  {
    rule: "DUPLICATE_INVOICE",
    concerns: FLAGGED_SUBJECTS.duplicateInvoiceReference,
    severity: "Medium",
    status: "Cleared",
    ruleBackground: "var(--color-success-wash)",
    ruleColour: "var(--color-success)",
  },
];

/** Flags still waiting on a decision ("Under review" counts — it is not resolved). */
const UNRESOLVED_COUNT = FLAGS.filter((flag) => flag.status !== "Cleared").length;

export function GuardPreview() {
  return (
    <PreviewBody>
      <PreviewHeader
        title="Guard flags"
        subtitle={`${formatCount(UNRESOLVED_COUNT)} open · caught before approval`}
        action={<HeaderAction>Review &amp; resolve</HeaderAction>}
      />

      <PreviewTable
        columns={[{ label: "Rule" }, { label: "Concerns" }, { label: "Severity" }, { label: "Status", align: "right" }]}
        gridTemplateColumns="1.3fr 1.2fr 0.7fr 0.9fr"
        rows={FLAGS.map((flag) => ({
          key: `${flag.rule}-${flag.concerns}`,
          cells: (
            <>
              <CodeTag background={flag.ruleBackground} color={flag.ruleColour}>
                {flag.rule}
              </CodeTag>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{flag.concerns}</span>
              <span style={{ color: "var(--color-text-muted)" }}>{flag.severity}</span>
              <span style={{ color: STATUS_COLOUR[flag.status], textAlign: "right", fontWeight: 500 }}>{flag.status}</span>
            </>
          ),
        }))}
      />
    </PreviewBody>
  );
}
