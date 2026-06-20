/**
 * VaultPreview — browser-frame for /product/vault. Shows a searchable
 * document list with categories and tags, matching how the real Records
 * module will surface documents once it ships.
 */

import { FileText, Search } from "lucide-react";
import { BRAND_COLORS } from "@/lib/brand";

export function VaultPreview() {
  const documents = [
    {
      name: "PV-2026-0184 · Brightpath Technologies.pdf",
      category: "Payment Voucher",
      tag: "Approved",
      tagColor: "#047857",
      tagBg: "rgba(4,120,87,0.08)",
      size: "216 KB",
      added: "Today",
    },
    {
      name: "Vendor contract — Greenfields Logistics.pdf",
      category: "Contract",
      tag: "Signed",
      tagColor: "#047857",
      tagBg: "rgba(4,120,87,0.08)",
      size: "1.4 MB",
      added: "Yesterday",
    },
    {
      name: "Q3 compliance report — auditor copy.pdf",
      category: "Audit",
      tag: "Archived",
      tagColor: "#64748b",
      tagBg: "rgba(148,163,184,0.12)",
      size: "842 KB",
      added: "2 days ago",
    },
    {
      name: "PO-2026-0091 · Diesel supply.pdf",
      category: "Purchase Order",
      tag: "Issued",
      tagColor: "var(--color-gold)",
      tagBg: "rgba(var(--color-gold-rgb), 0.08)",
      size: "304 KB",
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
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          padding: "8px 12px",
          marginBottom: "12px",
        }}
      >
        <Search size={14} strokeWidth={1.8} color="#94a3b8" aria-hidden="true" />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#94a3b8" }}>
          Search vouchers, contracts, reports…
        </span>
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
        {["All", "Payments", "Procurement", "Contracts", "Audit"].map((cat, i) => (
          <span
            key={cat}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              fontWeight: 500,
              padding: "4px 10px",
              borderRadius: "3px",
              backgroundColor: i === 0 ? "#0f172a" : "#FFFFFF",
              color: i === 0 ? "#FFFFFF" : "#0f172a",
              border: i === 0 ? "1px solid #0f172a" : "1px solid #e2e8f0",
            }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Document list */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #e2e8f0",
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
              borderTop: i === 0 ? "none" : "1px solid #e2e8f0",
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
                  color: "#0f172a",
                  margin: "0 0 1px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {doc.name}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#64748b", margin: 0 }}>
                {doc.category} · {doc.size}
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
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                color: "#64748b",
                minWidth: "72px",
                textAlign: "right",
              }}
            >
              {doc.added}
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#94a3b8", margin: "10px 0 0", textAlign: "right" }}>
        Showing 4 of 1,284 documents
      </p>
    </div>
  );
}
