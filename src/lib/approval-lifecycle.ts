/**
 * The approval lifecycle every request travels — the one statement of its
 * stages, their order and their names.
 *
 * It used to be told three ways: the how-it-works page said Submit → Review →
 * Sanction → Record, the product overview said Submit → Approve → Record →
 * Export, and the homepage said Submit → Approve → Record. A surface may keep
 * longer copy of its own for a stage (keyed by `key`), but the titles, the
 * order and the count come from here, and step numbers come from the index.
 */

export const APPROVAL_LIFECYCLE = [
  { key: "submit", title: "Submit", summary: "A structured request from any module." },
  { key: "review", title: "Review", summary: "Routed by role to the right approver." },
  { key: "sanction", title: "Sanction", summary: "Final authority signs it off." },
  { key: "record", title: "Record", summary: "Sealed on the tamper-evident trail, ready to export." },
] as const;

export type LifecycleStage = (typeof APPROVAL_LIFECYCLE)[number];
export type LifecycleStageKey = LifecycleStage["key"];

/** "01", "02"… — a stage's number, from its position in the lifecycle. */
export function lifecycleStepNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
