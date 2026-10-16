/**
 * PayPreview — browser-frame content for the /product/pay hero.
 * Mirrors the real voucher detail view in the platform: reference + PV tag +
 * status, amount + payee summary, approval timeline, and the bank-ready
 * export affordance that Pay users reach for.
 */

import { FEATURED_VOUCHER, demoAmount, formatDemoTime, personWithRole } from "@/components/product/demo-fixtures";
import {
  ApprovalTimeline,
  ButtonRow,
  DetailGrid,
  DocumentHeading,
  MockButton,
  PreviewBody,
  PreviewCard,
  PreviewLabel,
} from "./preview-primitives";

export function PayPreview() {
  return (
    <PreviewBody>
      <DocumentHeading
        reference={FEATURED_VOUCHER.reference}
        typeTag="PV"
        status={{ label: "Approved", tone: "success" }}
        note="Bank-ready"
      />

      <PreviewCard marginBottom="12px">
        <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 2px" }}>
          {FEATURED_VOUCHER.payee}
        </p>
        <p
          style={{
            fontFeatureSettings: '"tnum" 1',
            fontSize: "var(--text-heading-sm)",
            fontWeight: 500,
            color: "var(--color-text-primary)",
            margin: "0 0 12px",
          }}
        >
          {demoAmount(FEATURED_VOUCHER.amount)}
        </p>
        <DetailGrid
          labelWidth="88px"
          rowGap="5px"
          items={[
            { label: "Purpose", value: FEATURED_VOUCHER.purpose },
            { label: "Account", value: `${FEATURED_VOUCHER.bankShortName} · ${FEATURED_VOUCHER.accountNumber}`, numeric: true },
            { label: "Department", value: FEATURED_VOUCHER.department },
          ]}
        />
      </PreviewCard>

      <PreviewCard marginBottom="12px">
        <PreviewLabel>Approval chain</PreviewLabel>
        <ApprovalTimeline
          steps={FEATURED_VOUCHER.trail.map((entry) => ({
            label: entry.label,
            actor: personWithRole(entry.person),
            when: formatDemoTime(entry.at),
          }))}
        />
      </PreviewCard>

      <ButtonRow>
        <MockButton variant="primary" fill>
          Bank instruction
        </MockButton>
        <MockButton variant="secondary" fill>
          Voucher PDF
        </MockButton>
      </ButtonRow>
    </PreviewBody>
  );
}
