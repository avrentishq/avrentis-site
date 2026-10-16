/**
 * VaultPreview — browser-frame for /product/vault. Shows the Records list as
 * it is in the product: every financial record of four types, filterable by
 * type, with each record's supporting-file count and status.
 */

import { FileText, Search } from "lucide-react";
import { COMPLETED_PROCUREMENT, formatDemoRelative } from "@/components/product/demo-fixtures";
import { FilterChips, PreviewBody, PreviewList, Tag } from "./preview-primitives";

// Shaped like the real Records list: one row per record (not per PDF), its
// type, how many supporting files it carries, and its status. Records has no
// tags and does not hold contracts or reports — the preview must not imply it.
const { purpose, vendor, purchaseOrder, goodsReceipt, invoice, paymentVoucher } = COMPLETED_PROCUREMENT;

const RECORDS = [
  {
    name: `${paymentVoucher.reference} · ${vendor}`,
    category: "Payment voucher",
    files: "2 files",
    tag: "Paid",
    tagColour: "var(--color-success)",
    tagBackground: "var(--color-success-wash)",
    added: formatDemoRelative(paymentVoucher.at),
  },
  {
    name: `${invoice.reference} · ${vendor}`,
    category: "Supplier invoice",
    files: "1 file",
    tag: "Matched",
    tagColour: "var(--color-success)",
    tagBackground: "var(--color-success-wash)",
    added: formatDemoRelative(invoice.at),
  },
  {
    name: `${goodsReceipt.reference} · ${purpose}`,
    category: "Goods receipt",
    files: "3 files",
    tag: "Received",
    tagColour: "var(--color-text-muted)",
    tagBackground: "rgba(var(--color-text-subtle-rgb), 0.12)",
    added: formatDemoRelative(goodsReceipt.at),
  },
  {
    name: `${purchaseOrder.reference} · ${purpose}`,
    category: "Purchase order",
    files: "1 file",
    tag: "Issued",
    tagColour: "var(--color-gold)",
    tagBackground: "var(--color-gold-ghost)",
    added: formatDemoRelative(purchaseOrder.at),
  },
] as const;

export function VaultPreview() {
  return (
    <PreviewBody>
      {/* Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-badge)",
          padding: "8px 12px",
          marginBottom: "12px",
        }}
      >
        <Search size={14} strokeWidth={1.8} style={{ color: "var(--color-text-subtle)" }} aria-hidden="true" />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-subtle)" }}>
          Filter by reference, payee, department…
        </span>
      </div>

      <FilterChips options={["All", "Payment vouchers", "Purchase orders", "Goods receipts", "Supplier invoices"]} size="regular" />

      <PreviewList
        rows={RECORDS.map((record) => ({
          key: record.name,
          content: (
            <>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "var(--radius-badge)",
                  backgroundColor: "var(--color-gold-ghost)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileText size={14} strokeWidth={1.8} color="var(--color-gold)" aria-hidden="true" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                    margin: "0 0 1px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {record.name}
                </p>
                <p style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", margin: 0 }}>
                  {record.category} · {record.files} · {record.added}
                </p>
              </div>
              <Tag background={record.tagBackground} color={record.tagColour}>
                {record.tag}
              </Tag>
            </>
          ),
        }))}
      />

      <p style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-subtle)", margin: "10px 0 0", textAlign: "right" }}>
        Showing 4 of 1,284 records
      </p>
    </PreviewBody>
  );
}
