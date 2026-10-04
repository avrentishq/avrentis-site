/**
 * VaultPreview — browser-frame for /product/vault. Shows the Records list as
 * it is in the product: every financial record of four types, filterable by
 * type, with each record's supporting-file count and status.
 */

import { FileText, Search } from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";

export function VaultPreview() {
  // Shaped like the real Records list: one row per record (not per PDF), its
  // type, how many supporting files it carries, and its status. Records has no
  // tags and does not hold contracts or reports — the preview must not imply it.
  const documents = [
    {
      name: "PV-2026-0184 · Brightpath Technologies",
      category: "Payment voucher",
      files: "2 files",
      tag: "Paid",
      tagColor: "var(--color-success)",
      tagBg: "rgba(var(--color-success-rgb), 0.08)",
      added: "Today",
    },
    {
      name: "INV-88213 · Greenfields Logistics",
      category: "Supplier invoice",
      files: "1 file",
      tag: "Matched",
      tagColor: "var(--color-success)",
      tagBg: "rgba(var(--color-success-rgb), 0.08)",
      added: "Yesterday",
    },
    {
      name: "GRN-2026-0042 · Diesel supply",
      category: "Goods receipt",
      files: "3 files",
      tag: "Received",
      tagColor: "var(--color-text-muted)",
      tagBg: "rgba(var(--color-text-subtle-rgb), 0.12)",
      added: "2 days ago",
    },
    {
      name: "PO-2026-0091 · Diesel supply",
      category: "Purchase order",
      files: "1 file",
      tag: "Issued",
      tagColor: "var(--color-gold)",
      tagBg: "rgba(var(--color-gold-rgb), 0.08)",
      added: "3 days ago",
    },
  ];

  return (
    <div style={{ padding: "22px 24px" }}>
      {/* Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          padding: "8px 12px",
          marginBottom: "12px",
        }}
      >
        <Search size={14} strokeWidth={1.8} style={{ color: "var(--color-text-subtle)" }} aria-hidden="true" />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--color-text-subtle)" }}>
          Filter by reference, payee, department…
        </span>
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
        {["All", "Payment vouchers", "Purchase orders", "Goods receipts", "Supplier invoices"].map((cat, i) => (
          <span
            key={cat}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              fontWeight: 500,
              padding: "4px 10px",
              borderRadius: "3px",
              backgroundColor: i === 0 ? "var(--color-navy-primary)" : "var(--color-white)",
              color: i === 0 ? "var(--color-white)" : "var(--color-navy-primary)",
              border: i === 0 ? "1px solid var(--color-navy-primary)" : "1px solid var(--color-border)",
            }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Document list */}
      <div
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
        }}
      >
        {documents.map((doc, i) => (
          <div
            key={doc.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderTop: i === 0 ? "none" : "1px solid var(--color-border)",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "4px",
                backgroundColor: "rgba(var(--color-gold-rgb), 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={14} strokeWidth={1.8} color={BRAND_COLORS.gold} aria-hidden="true" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                  margin: "0 0 1px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {doc.name}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-muted)", margin: 0 }}>
                {doc.category} · {doc.files} · {doc.added}
              </p>
            </div>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 500,
                backgroundColor: doc.tagBg,
                color: doc.tagColor,
                borderRadius: "3px",
                padding: "2px 6px",
              }}
            >
              {doc.tag}
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-subtle)", margin: "10px 0 0", textAlign: "right" }}>
        Showing 4 of 1,284 records
      </p>
    </div>
  );
}
