/**
 * How long Avrentis keeps things — the one place the site states it.
 *
 * Two different promises, and copy must never blur them:
 *
 *   - The AUDIT TRAIL (every action, decision and approval event) is kept for
 *     the life of the account and never purged while it is active.
 *   - DOCUMENTS (vouchers, purchase orders, attached files) are kept for the
 *     plan's retention period, never less than the legal minimum. They are NOT
 *     kept forever.
 *
 * The trail is tamper-EVIDENT (any change would show), not "immutable".
 * `record-keeping.lock.test.ts` fails on copy that says otherwise.
 */
import { BRAND } from "@/lib/brand";

/** Completes "…an audit trail of every decision, ___". */
export const AUDIT_TRAIL_KEPT = "kept for the life of your account";

/** Completes "Attachments are ___". */
export const DOCUMENTS_KEPT = "kept for your plan's retention period, never less than the legal minimum";

/** Site-wide meta description: root layout and the SoftwareApplication schema. */
export const SITE_DESCRIPTION =
  `${BRAND.name} replaces scattered emails, paper trails, and manual processes with structure, ` +
  `authority, and a tamper-evident audit trail of every decision your organisation makes — ${AUDIT_TRAIL_KEPT}.`;
