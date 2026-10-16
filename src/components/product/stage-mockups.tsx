/**
 * One mockup per stage of the approval lifecycle — the drawing of the featured
 * voucher's journey. Both the homepage's "How it works" section and
 * /product/how-it-works render these (through `STAGE_MOCKUPS`), so the
 * journey is drawn once. Each reflects the actual platform UI for its stage,
 * and every person, time and amount comes from the demo fixtures.
 */

import type { ComponentType } from "react";
import type { LifecycleStageKey } from "@/lib/approval-lifecycle";
import { LEAD_CURRENCY } from "@/lib/market";
import { amountInWords } from "@/lib/money";
import { capitaliseFirst } from "@/lib/number-words";
import {
  FEATURED_VOUCHER,
  PURCHASE_ORDER,
  demoAmount,
  featuredTrailEntry,
  formatDemoDayTime,
  formatDemoTime,
  personWithRole,
  roleLabel,
} from "./demo-fixtures";
import {
  ApprovalTimeline,
  ButtonRow,
  CompletedMark,
  DocumentHeading,
  MockButton,
  PreviewBody,
  PreviewCard,
  PreviewLabel,
} from "./previews/preview-primitives";


/** A filled form field: its label, and the value in an input-like box. */
function FormField({
  label,
  value,
  note,
  emphasis = "regular",
  monospace = false,
}: {
  label: string;
  value: string;
  note?: string;
  emphasis?: "amount" | "regular" | "compact";
  monospace?: boolean;
}) {
  const valueStyle = {
    amount: { padding: "10px 12px", fontSize: "var(--text-xl)", fontWeight: 500, fontFeatureSettings: '"tnum" 1' },
    regular: { padding: "10px 12px", fontSize: "var(--text-sm)", minHeight: "40px" },
    compact: { padding: "8px 10px", fontSize: "var(--text-xs)" },
  }[emphasis];
  return (
    <div>
      <PreviewLabel marginBottom="5px">{label}</PreviewLabel>
      <div
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xs)",
          fontFamily: monospace ? "var(--font-mono)" : undefined,
          color: "var(--color-text-primary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          ...valueStyle,
        }}
      >
        {value}
      </div>
      {note ? <p style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", margin: "4px 0 0" }}>{note}</p> : null}
    </div>
  );
}

// ── Stage 01 — Submit ────────────────────────────────────────────────

export function SubmitStageMockup() {
  return (
    <PreviewBody>
      <h3 style={{ fontWeight: 400, fontSize: "var(--text-3xl)", color: "var(--color-text-primary)", margin: "0 0 4px" }}>
        New payment voucher
      </h3>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", margin: "0 0 18px" }}>
        Step 2 of 4 · Payment info
      </p>

      {/* Step dots */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {[0, 1, 2, 3].map((step) => (
          <div
            key={step}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "var(--radius-2xs)",
              backgroundColor: step <= 1 ? "var(--color-gold)" : "var(--color-border)",
            }}
          />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
        <FormField
          label={`Amount (${LEAD_CURRENCY})`}
          value={demoAmount(FEATURED_VOUCHER.amount)}
          note={capitaliseFirst(amountInWords(FEATURED_VOUCHER.amount, LEAD_CURRENCY))}
          emphasis="amount"
        />
        <FormField label="Purpose" value={FEATURED_VOUCHER.purpose} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <FormField label="Department" value={FEATURED_VOUCHER.department} emphasis="compact" />
          <FormField label="Cost code" value={FEATURED_VOUCHER.costCode} emphasis="compact" monospace />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <MockButton variant="secondary">← Back</MockButton>
        <MockButton variant="primary" style={{ padding: "8px 18px" }}>
          Continue →
        </MockButton>
      </div>
    </PreviewBody>
  );
}

// ── Stage 02 — Review (query state) ─────────────────────────────────

export function ReviewStageMockup() {
  const submitted = featuredTrailEntry("submit");
  const reviewer = featuredTrailEntry("review").person;
  return (
    <PreviewBody>
      <DocumentHeading
        reference={FEATURED_VOUCHER.reference}
        typeTag="PV"
        status={{ label: "Under review", tone: "pending" }}
        note={roleLabel(reviewer)}
      />

      {/* Summary */}
      <PreviewCard padding="12px 14px" marginBottom="12px">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-text-primary)" }}>
            {FEATURED_VOUCHER.payee}
          </span>
          <span style={{ fontFeatureSettings: '"tnum" 1', fontSize: "var(--text-md)", fontWeight: 500, color: "var(--color-text-primary)" }}>
            {demoAmount(FEATURED_VOUCHER.amount)}
          </span>
        </div>
        <p style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", margin: 0 }}>
          {FEATURED_VOUCHER.purpose} · {FEATURED_VOUCHER.department} · Submitted by {submitted.person.name}
        </p>
      </PreviewCard>

      {/* Query composition */}
      <PreviewCard marginBottom="12px">
        <PreviewLabel marginBottom="8px">Query the submitter</PreviewLabel>
        <div
          style={{
            backgroundColor: "var(--color-bg-light)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xs)",
            padding: "10px 12px",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-primary)",
            lineHeight: 1.55,
          }}
        >
          Can you attach the quotation for the 10,000L diesel order? The price per litre looks above the last quote from{" "}
          {PURCHASE_ORDER.vendorShortName}.
        </div>
      </PreviewCard>

      {/* Action panel */}
      <PreviewCard>
        <PreviewLabel>Your decision</PreviewLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          <MockButton variant="secondary" fill>
            Approve
          </MockButton>
          <MockButton variant="accent" fill>
            Send query
          </MockButton>
          <MockButton variant="danger" fill>
            Return
          </MockButton>
        </div>
      </PreviewCard>
    </PreviewBody>
  );
}

// ── Stage 03 — Sanction (MD signs off) ──────────────────────────────

export function SanctionStageMockup() {
  const priorSteps = [featuredTrailEntry("submit"), featuredTrailEntry("review")];
  const sanctioner = featuredTrailEntry("sanction").person;
  return (
    <PreviewBody>
      <DocumentHeading
        reference={FEATURED_VOUCHER.reference}
        typeTag="PV"
        status={{ label: `${roleLabel(sanctioner)} sanction pending`, tone: "pending" }}
      />

      {/* Prior approvers */}
      <PreviewCard padding="12px 14px" marginBottom="12px">
        <PreviewLabel>Prior approvals</PreviewLabel>
        {priorSteps.map((step) => (
          <div key={step.stage} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "4px 0" }}>
            <CompletedMark size={18} />
            <span style={{ flex: 1, fontSize: "var(--text-xs)", color: "var(--color-text-primary)" }}>
              {step.label} <span style={{ color: "var(--color-text-muted)" }}>— {personWithRole(step.person)}</span>
            </span>
            <span style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", fontFeatureSettings: '"tnum" 1' }}>
              {formatDemoTime(step.at)}
            </span>
          </div>
        ))}
      </PreviewCard>

      {/* Signature capture + MD action */}
      <PreviewCard>
        <PreviewLabel>Your sanction</PreviewLabel>
        <div
          style={{
            backgroundColor: "var(--color-bg-light)",
            border: "1px dashed var(--color-border)",
            borderRadius: "var(--radius-badge)",
            padding: "16px 14px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", margin: "0 0 2px" }}>Saved signature</p>
            <p
              style={{
                fontFamily: "var(--font-signature)",
                fontSize: "var(--text-heading-sm)",
                color: "var(--color-text-primary)",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {sanctioner.name}
            </p>
          </div>
          <span style={{ fontSize: "var(--text-2xs)", color: "var(--color-gold-on-light)", fontWeight: 500 }}>Change →</span>
        </div>
        <MockButton variant="primary" style={{ width: "100%", fontSize: "var(--text-sm)", padding: "10px 0" }}>
          Sanction {demoAmount(FEATURED_VOUCHER.amount)}
        </MockButton>
      </PreviewCard>
    </PreviewBody>
  );
}

// ── Stage 04 — Record ───────────────────────────────────────────────

export function RecordStageMockup() {
  return (
    <PreviewBody>
      <DocumentHeading
        reference={FEATURED_VOUCHER.reference}
        status={{ label: "Approved", tone: "success" }}
        note="Tamper-evident"
        marginBottom="12px"
      />

      <PreviewCard marginBottom="12px">
        <PreviewLabel>Approval timeline</PreviewLabel>
        <ApprovalTimeline
          steps={FEATURED_VOUCHER.trail.map((entry) => ({
            label: entry.label,
            actor: personWithRole(entry.person),
            when: formatDemoDayTime(entry.at),
          }))}
        />
      </PreviewCard>

      <ButtonRow>
        <MockButton variant="primary" fill style={{ padding: "9px 0" }}>
          Bank instruction
        </MockButton>
        <MockButton variant="secondary" fill style={{ padding: "9px 0" }}>
          Voucher PDF
        </MockButton>
        <MockButton variant="secondary" fill style={{ padding: "9px 0" }}>
          Audit export
        </MockButton>
      </ButtonRow>
    </PreviewBody>
  );
}

/**
 * Each lifecycle stage's drawing and the in-app path its frame captions.
 * Keyed by the lifecycle registry, so a surface that renders the stages
 * cannot drop, add or reorder a drawing.
 */
export const STAGE_MOCKUPS: Record<LifecycleStageKey, { Mockup: ComponentType; previewPath: string }> = {
  submit: { Mockup: SubmitStageMockup, previewPath: "vouchers / new" },
  review: { Mockup: ReviewStageMockup, previewPath: "approvals" },
  sanction: { Mockup: SanctionStageMockup, previewPath: `vouchers / ${FEATURED_VOUCHER.reference}` },
  record: { Mockup: RecordStageMockup, previewPath: `vouchers / ${FEATURED_VOUCHER.reference}` },
};
