/* ── Plan limit lines, formatted on the site from the numbers ───── */

import { formatByteSize, isUnlimited } from "@avrentishq/core/billing/limit-format";

/**
 * Every limit line the site prints — the comparison table, the generated
 * fallback's labels and the plan highlights — comes from these, fed the raw
 * numbers (`0` = unlimited, core's convention for every capacity figure).
 *
 * WHY NOT THE API'S LABELS. The pricing API used to ship precomputed strings
 * ("10 GB storage") and the table printed them. That made the label shape part
 * of the contract, and the label was wrong: the figure is 10 × 1024³ bytes, a
 * gibibyte count, printed with the decimal unit. Formatting here from the
 * numbers works whatever the API does with its labels, and storage goes through
 * core's `formatByteSize`, which writes the unit the arithmetic is in (GiB).
 */

/** `null` is read as unlimited too: an older payload typed some limits nullable. */
function unlimited(limit: number | null): boolean {
  return limit === null || isUnlimited(limit);
}

/** "Up to 10 users" / "Unlimited users". */
export function userLimitLine(maxUsers: number | null): string {
  return unlimited(maxUsers) ? "Unlimited users" : `Up to ${maxUsers} users`;
}

/** "Unlimited documents" / "200 documents/month". */
export function documentLimitLine(maxDocumentsPerMonth: number | null): string {
  return unlimited(maxDocumentsPerMonth)
    ? "Unlimited documents"
    : `${maxDocumentsPerMonth} documents/month`;
}

/** "10 GiB storage" / "Unlimited storage". */
export function storageLimitLine(maxStorageBytes: number | null): string {
  return unlimited(maxStorageBytes)
    ? "Unlimited storage"
    : `${formatByteSize(maxStorageBytes as number)} storage`;
}

/** Whole years when the window is at least a year, else days. */
function retentionSpan(days: number): { count: number; unit: "year" | "day" } {
  return days >= 365 ? { count: Math.round(days / 365), unit: "year" } : { count: days, unit: "day" };
}

/** "7 years retention" / "Unlimited retention". */
export function retentionLimitLine(documentRetentionDays: number | null): string {
  if (unlimited(documentRetentionDays)) return "Unlimited retention";
  const { count, unit } = retentionSpan(documentRetentionDays as number);
  return `${count} ${unit}${count === 1 ? "" : "s"} retention`;
}

/** The adjective form for running copy: "7-year", "90-day". Unlimited → null. */
export function retentionAdjective(documentRetentionDays: number | null): string | null {
  if (unlimited(documentRetentionDays)) return null;
  const { count, unit } = retentionSpan(documentRetentionDays as number);
  return `${count}-${unit}`;
}
