/**
 * AuditPreview — browser-frame for /product/audit. Shows the audit trail
 * table with action labels, actor names, entity refs and timestamps, plus an
 * export action. The featured voucher's events come from its trail, so the
 * times and people match every other page that shows it.
 */

import {
  AUDIT_DAY_EVENTS,
  FEATURED_VOUCHER,
  featuredTrailEntry,
  formatDemoTime,
  personWithRole,
  type DemoPerson,
} from "@/components/product/demo-fixtures";
import { CodeTag, FilterChips, HeaderAction, PreviewBody, PreviewHeader, PreviewList, PreviewTable } from "./preview-primitives";

interface AuditRow {
  action: string;
  person: DemoPerson;
  entity: string;
  at: string;
  actionBackground: string;
  actionColour: string;
}

const sanctioned = featuredTrailEntry("sanction");
const reviewed = featuredTrailEntry("review");
const submitted = featuredTrailEntry("submit");

const ROWS: readonly AuditRow[] = [
  {
    action: sanctioned.auditAction,
    person: sanctioned.person,
    entity: FEATURED_VOUCHER.reference,
    at: sanctioned.at,
    actionBackground: "rgba(var(--color-success-rgb), 0.08)",
    actionColour: "var(--color-success)",
  },
  {
    action: reviewed.auditAction,
    person: reviewed.person,
    entity: FEATURED_VOUCHER.reference,
    at: reviewed.at,
    actionBackground: "rgba(var(--color-gold-rgb), 0.08)",
    actionColour: "var(--color-warning)",
  },
  {
    action: AUDIT_DAY_EVENTS.voucherQueried.auditAction,
    person: AUDIT_DAY_EVENTS.voucherQueried.person,
    entity: AUDIT_DAY_EVENTS.voucherQueried.document,
    at: AUDIT_DAY_EVENTS.voucherQueried.at,
    actionBackground: "rgba(var(--color-queried-accent-rgb), 0.08)",
    actionColour: "var(--color-queried)",
  },
  {
    action: AUDIT_DAY_EVENTS.roleChanged.auditAction,
    person: AUDIT_DAY_EVENTS.roleChanged.person,
    entity: AUDIT_DAY_EVENTS.roleChanged.document,
    at: AUDIT_DAY_EVENTS.roleChanged.at,
    actionBackground: "rgba(var(--color-identity-tint-rgb), 0.08)",
    actionColour: "var(--color-identity)",
  },
  {
    action: submitted.auditAction,
    person: submitted.person,
    entity: FEATURED_VOUCHER.reference,
    at: submitted.at,
    actionBackground: "rgba(var(--color-warning-accent-rgb), 0.08)",
    actionColour: "var(--color-warning-strong)",
  },
];

export function AuditPreview() {
  return (
    <PreviewBody>
      <PreviewHeader title="Audit trail" subtitle="1,284 events · Tamper-evident" action={<HeaderAction>Export PDF</HeaderAction>} />

      <FilterChips options={["All events", "Payments", "Procurement", "Access", "Compliance"]} size="compact" />

      {/* A phone-width frame cannot hold four columns, so it reads the same
          events as a two-line log: what happened and when, then to what. */}
      <div className="sm:hidden">
        <PreviewList
          rows={ROWS.map((row) => ({
            key: `${row.action}-${row.at}`,
            content: (
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <CodeTag background={row.actionBackground} color={row.actionColour}>
                    {row.action}
                  </CodeTag>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-muted)", fontFeatureSettings: '"tnum" 1' }}>
                    {formatDemoTime(row.at)}
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {row.entity} · {personWithRole(row.person)}
                </span>
              </div>
            ),
          }))}
        />
      </div>

      <div className="max-sm:hidden">
      <PreviewTable
        columns={[{ label: "Action" }, { label: "Actor" }, { label: "Entity" }, { label: "Time", align: "right" }]}
        gridTemplateColumns="minmax(124px, 1.1fr) minmax(0, 1.2fr) minmax(86px, 0.9fr) 44px"
        rows={ROWS.map((row) => ({
          key: `${row.action}-${row.at}`,
          cells: (
            <>
              <CodeTag background={row.actionBackground} color={row.actionColour}>
                {row.action}
              </CodeTag>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{personWithRole(row.person)}</span>
              <span
                style={{
                  color: "var(--color-text-muted)",
                  fontFeatureSettings: '"tnum" 1',
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.entity}
              </span>
              <span style={{ color: "var(--color-text-muted)", textAlign: "right", fontFeatureSettings: '"tnum" 1' }}>
                {formatDemoTime(row.at)}
              </span>
            </>
          ),
        }))}
      />
      </div>
    </PreviewBody>
  );
}
