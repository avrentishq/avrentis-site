/**
 * ProcurePreview — browser-frame content for the /product/procure hero.
 * Mirrors the real PO detail view: reference + PO tag + status, vendor
 * card with bank info, line-item table, and the "Issue to vendor" export.
 */

import { formatCount } from "@/lib/money";
import { PURCHASE_ORDER, PURCHASE_ORDER_TOTAL, demoAmount, lineTotal } from "@/components/product/demo-fixtures";
import {
  ButtonRow,
  DocumentHeading,
  MockButton,
  PreviewBody,
  PreviewCard,
  PreviewLabel,
  PreviewTable,
} from "./preview-primitives";

export function ProcurePreview() {
  return (
    <PreviewBody>
      <DocumentHeading
        reference={PURCHASE_ORDER.reference}
        typeTag="PO"
        status={{ label: "Issued", tone: "success" }}
        note={`${formatCount(PURCHASE_ORDER.lineItems.length)} line items`}
      />

      <PreviewCard marginBottom="12px">
        <PreviewLabel marginBottom="6px">Vendor</PreviewLabel>
        <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 2px" }}>
          {PURCHASE_ORDER.vendor}
        </p>
        <p style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", margin: "0 0 10px" }}>
          {PURCHASE_ORDER.vendorRegistration} · {PURCHASE_ORDER.vendorBank} · {PURCHASE_ORDER.vendorAccountNumber}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid var(--color-border)", paddingTop: "10px" }}>
          <span style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)" }}>Total</span>
          <span
            style={{
              fontFeatureSettings: '"tnum" 1',
              fontSize: "var(--text-3xl)",
              fontWeight: 500,
              color: "var(--color-text-primary)",
            }}
          >
            {demoAmount(PURCHASE_ORDER_TOTAL)}
          </span>
        </div>
      </PreviewCard>

      <PreviewTable
        columns={[{ label: "Item" }, { label: "Qty", align: "right" }, { label: "Total", align: "right" }]}
        gridTemplateColumns="1fr 50px 80px"
        rowPadding="10px 14px"
        fontSize="var(--text-xs)"
        marginBottom="12px"
        rows={PURCHASE_ORDER.lineItems.map((line) => ({
          key: line.description,
          cells: (
            <>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{line.description}</span>
              <span style={{ textAlign: "right", fontFeatureSettings: '"tnum" 1', color: "var(--color-text-muted)" }}>
                {formatCount(line.quantity)}
              </span>
              <span style={{ textAlign: "right", fontFeatureSettings: '"tnum" 1', fontWeight: 500 }}>{demoAmount(lineTotal(line))}</span>
            </>
          ),
        }))}
      />

      <ButtonRow>
        <MockButton variant="primary" fill>
          Issue to vendor
        </MockButton>
        <MockButton variant="secondary" fill>
          PO PDF
        </MockButton>
      </ButtonRow>
    </PreviewBody>
  );
}
