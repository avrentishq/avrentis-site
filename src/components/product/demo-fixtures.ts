/**
 * The demo organisation every mockup on the site draws from — its people, its
 * documents, their amounts and the approval trail of the featured voucher.
 *
 * The same voucher used to tell different stories on different pages: one
 * mockup had it submitted, reviewed and sanctioned by three people at three
 * times, the security page by three other people at other times, the homepage
 * gave the same story a different reference, and the webhook sample carried an
 * amount fifteen hundred times larger. Amounts were typed as finished strings,
 * so a total could disagree with its line items. Now every surface reads this
 * file: amounts are numbers in major units, formatted in the lead currency by
 * `demoAmount`; totals are calculated; times are ISO instants formatted in one
 * fixed zone, so the server render and every browser print the same clock.
 *
 * Illustrative data only — invented names, no real organisation.
 */

import type { Role } from "@/components/ui/role-badge";
import { ROLE_LABELS } from "@/components/ui/role-badge";
import { LEAD_CURRENCY } from "@/lib/market";
import { formatCurrencyAmount } from "@/lib/money";

/* ── Formatting ──────────────────────────────────────────────────── */

/** An amount in major units, in the lead currency — every demo figure prints through this. */
export function demoAmount(amount: number): string {
  return formatCurrencyAmount(amount, LEAD_CURRENCY);
}

/** The demo organisation's clock. Fixed, so the server and every visitor's browser agree. */
const DEMO_TIME_ZONE = "Africa/Lagos";

const TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: DEMO_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const TIME_WITH_SECONDS_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: DEMO_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
const DAY_FORMAT = new Intl.DateTimeFormat("en-GB", { timeZone: DEMO_TIME_ZONE, day: "numeric", month: "short" });
/** en-CA prints the calendar date as YYYY-MM-DD — used only to count calendar days. */
const CALENDAR_DATE_FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: DEMO_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "14:32", or "14:32:17" with seconds (an audit log line). */
export function formatDemoTime(isoInstant: string, options: { seconds?: boolean } = {}): string {
  return (options.seconds ? TIME_WITH_SECONDS_FORMAT : TIME_FORMAT).format(new Date(isoInstant));
}

/** "15 Apr, 14:32". */
export function formatDemoDayTime(isoInstant: string): string {
  const instant = new Date(isoInstant);
  return `${DAY_FORMAT.format(instant)}, ${TIME_FORMAT.format(instant)}`;
}

/**
 * The moment the demo inbox is looked at — two hours after the featured
 * voucher was submitted, after Finance reviewed it and before the MD sanctions
 * it, which is the state the homepage inbox shows it in.
 */
export const DEMO_NOW = "2026-04-15T11:20:00+01:00";

function calendarDayNumber(instant: Date): number {
  const [year, month, day] = CALENDAR_DATE_FORMAT.format(instant).split("-").map(Number);
  return Date.UTC(year!, month! - 1, day!) / 86_400_000;
}

/**
 * "2h ago", "Yesterday", "3d ago" relative to `DEMO_NOW` — built by hand
 * rather than with `Intl.RelativeTimeFormat`, whose short forms differ between
 * runtimes and would make the server and browser renders disagree.
 */
export function formatDemoRelative(isoInstant: string): string {
  const instant = new Date(isoInstant);
  const now = new Date(DEMO_NOW);
  const daysAgo = calendarDayNumber(now) - calendarDayNumber(instant);
  if (daysAgo === 0) {
    const minutesAgo = Math.floor((now.getTime() - instant.getTime()) / 60_000);
    return minutesAgo < 60 ? `${minutesAgo}m ago` : `${Math.floor(minutesAgo / 60)}h ago`;
  }
  return daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;
}

/* ── People ──────────────────────────────────────────────────────── */

export interface DemoPerson {
  name: string;
  role: Role;
}

export const DEMO_PEOPLE = {
  submitter: { name: "Fatima Abubakar", role: "staff" },
  reviewer: { name: "Chinedu Okafor", role: "finance" },
  sanctioner: { name: "Aisha Danjuma", role: "md" },
  administrator: { name: "Tunde Bello", role: "admin" },
} as const satisfies Record<string, DemoPerson>;

/** The role's label — "Finance", "MD". */
export function roleLabel(person: DemoPerson): string {
  return ROLE_LABELS[person.role];
}

/** "Chinedu Okafor · Finance". */
export function personWithRole(person: DemoPerson): string {
  return `${person.name} · ${roleLabel(person)}`;
}

/** "Chinedu O." — how a dense log line names someone. */
export function abbreviatedName(person: DemoPerson): string {
  const [first, ...rest] = person.name.split(" ");
  const last = rest.at(-1);
  return last ? `${first} ${last.charAt(0)}.` : person.name;
}

/* ── The featured voucher ────────────────────────────────────────── */

export interface TrailEntry {
  /** The lifecycle stage this action completed (see `@/lib/approval-lifecycle`). */
  stage: "submit" | "review" | "sanction";
  /** "Submitted", "Reviewed", "Sanctioned". */
  label: string;
  /** The audit log's event name for the action. */
  auditAction: string;
  person: DemoPerson;
  at: string;
}

export const FEATURED_VOUCHER = {
  reference: "PV-2026-0184",
  documentType: "payment_voucher",
  payee: "Brightpath Technologies",
  purpose: "Diesel supply — November",
  department: "Operations",
  costCode: "OPS-FUEL-Q4",
  bankShortName: "GTB",
  accountNumber: "0123456789",
  amount: 850_000,
  trail: [
    { stage: "submit", label: "Submitted", auditAction: "PV_SUBMITTED", person: DEMO_PEOPLE.submitter, at: "2026-04-15T09:14:08+01:00" },
    { stage: "review", label: "Reviewed", auditAction: "PV_APPROVED", person: DEMO_PEOPLE.reviewer, at: "2026-04-15T11:02:41+01:00" },
    { stage: "sanction", label: "Sanctioned", auditAction: "PV_SANCTIONED", person: DEMO_PEOPLE.sanctioner, at: "2026-04-15T14:32:17+01:00" },
  ] satisfies readonly TrailEntry[],
} as const;

/** The featured voucher's trail entry for one stage. */
export function featuredTrailEntry(stage: TrailEntry["stage"]): TrailEntry {
  const entry = FEATURED_VOUCHER.trail.find((candidate) => candidate.stage === stage);
  if (!entry) throw new Error(`The featured voucher has no ${stage} entry`);
  return entry;
}

/* ── The purchase order ──────────────────────────────────────────── */

export interface PurchaseOrderLine {
  description: string;
  quantity: number;
  /** Major units. */
  unitPrice: number;
}

export const PURCHASE_ORDER = {
  reference: "PO-2026-0091",
  vendor: "Greenfields Logistics Ltd.",
  /** How people refer to the vendor in a sentence. */
  vendorShortName: "Greenfields",
  vendorRegistration: "RC 1245890",
  vendorBank: "Zenith Bank",
  vendorAccountNumber: "2012345678",
  department: "Supply Chain",
  lineItems: [
    { description: "Industrial diesel · 10,000L", quantity: 10_000, unitPrice: 720 },
    { description: "Fuel-grade additive (premium)", quantity: 50, unitPrice: 18_000 },
    { description: "On-site delivery · November", quantity: 1, unitPrice: 140_000 },
  ] satisfies readonly PurchaseOrderLine[],
} as const;

export function lineTotal(line: PurchaseOrderLine): number {
  return line.quantity * line.unitPrice;
}

/** The order's total — always the sum of its lines, never typed. */
export const PURCHASE_ORDER_TOTAL = PURCHASE_ORDER.lineItems.reduce((sum, line) => sum + lineTotal(line), 0);

/**
 * An earlier procurement that has run its whole course — ordered, received,
 * invoiced and paid — so the Records preview can show a finished chain without
 * contradicting the inbox, where PO-2026-0091 is still awaiting approval and
 * the featured voucher is still under review.
 */
export const COMPLETED_PROCUREMENT = {
  purpose: "Generator servicing",
  vendor: "Delta Power Services Ltd.",
  purchaseOrder: { reference: "PO-2026-0079", at: "2026-04-12T10:00:00+01:00" },
  goodsReceipt: { reference: "GRN-2026-0042", at: "2026-04-13T14:30:00+01:00" },
  invoice: { reference: "INV-88213", at: "2026-04-14T09:00:00+01:00" },
  paymentVoucher: { reference: "PV-2026-0158", at: "2026-04-15T10:05:00+01:00" },
} as const;

/* ── The approvals inbox ─────────────────────────────────────────── */

export type InboxStatus = "underReview" | "submitted" | "queried";

export interface InboxDocument {
  reference: string;
  type: "PV" | "PO";
  status: InboxStatus;
  /** Payee, vendor or what the money is for. */
  label: string;
  submittedBy: string;
  submittedAt: string;
  /** Major units. */
  amount: number;
  department: string;
}

const featuredSubmission = featuredTrailEntry("submit");

/** The voucher Finance queried (the audit preview logs the query). */
export const QUERIED_VOUCHER: InboxDocument = {
  reference: "PV-2026-0183",
  type: "PV",
  status: "queried",
  label: "Sahara Engineering Services",
  submittedBy: "Chinelo Adeyemi",
  submittedAt: "2026-04-14T15:40:00+01:00",
  amount: 420_000,
  department: "Facilities",
};

/** A stipend run Integrity flagged as split to stay under an approval limit. */
export const STIPEND_VOUCHER: InboxDocument = {
  reference: "PV-2026-0181",
  type: "PV",
  status: "underReview",
  label: "Kano field office — beneficiary stipends",
  submittedBy: "Amina Bello",
  submittedAt: "2026-04-15T08:14:00+01:00",
  amount: 1_450_000,
  department: "Programmes",
};

/**
 * The feed the homepage inbox rotates through. The first four are its default
 * (and reduced-motion) view; a mix of business and NGO flows.
 */
export const INBOX_DOCUMENTS: readonly InboxDocument[] = [
  {
    reference: FEATURED_VOUCHER.reference,
    type: "PV",
    status: "underReview",
    label: FEATURED_VOUCHER.payee,
    submittedBy: featuredSubmission.person.name,
    submittedAt: featuredSubmission.at,
    amount: FEATURED_VOUCHER.amount,
    department: FEATURED_VOUCHER.department,
  },
  STIPEND_VOUCHER,
  {
    reference: PURCHASE_ORDER.reference,
    type: "PO",
    status: "submitted",
    label: PURCHASE_ORDER.vendor,
    submittedBy: "Tunde Okafor",
    submittedAt: "2026-04-15T07:14:00+01:00",
    amount: PURCHASE_ORDER_TOTAL,
    department: PURCHASE_ORDER.department,
  },
  QUERIED_VOUCHER,
  { reference: "PV-2026-0175", type: "PV", status: "submitted", label: "WASH project — Q2 grant expense", submittedBy: "Grace Eze", submittedAt: "2026-04-14T12:05:00+01:00", amount: 2_310_000, department: "Grants & Compliance" },
  { reference: "PV-2026-0182", type: "PV", status: "underReview", label: "Summit Office Supplies", submittedBy: "Ifeoma Nwachukwu", submittedAt: "2026-04-15T05:10:00+01:00", amount: 215_000, department: "Administration" },
  { reference: "PV-2026-0171", type: "PV", status: "underReview", label: "Enugu outreach — medical supplies", submittedBy: "Chidi Okonkwo", submittedAt: "2026-04-14T10:30:00+01:00", amount: 1_180_000, department: "Programmes" },
  { reference: "PO-2026-0090", type: "PO", status: "submitted", label: "Horizon Facility Services", submittedBy: "Adewale Bankole", submittedAt: "2026-04-14T16:20:00+01:00", amount: 680_000, department: "Facilities" },
  { reference: "PO-2026-0088", type: "PO", status: "submitted", label: "Lagos clinic — vaccine cold-chain units", submittedBy: "Ngozi Umeh", submittedAt: "2026-04-15T06:14:00+01:00", amount: 3_120_000, department: "Programmes" },
  { reference: "PV-2026-0169", type: "PV", status: "underReview", label: "Scholarship disbursement — 2026 cohort", submittedBy: "Yusuf Aliyu", submittedAt: "2026-04-14T09:45:00+01:00", amount: 4_750_000, department: "Grants & Compliance" },
  { reference: "PV-2026-0167", type: "PV", status: "submitted", label: "Ikeja HQ — annual software renewal", submittedBy: "Blessing Obi", submittedAt: "2026-04-13T14:00:00+01:00", amount: 1_920_000, department: "IT" },
  { reference: "PV-2026-0164", type: "PV", status: "underReview", label: "Farmers' co-op — input subsidy batch 3", submittedBy: "Hauwa Sani", submittedAt: "2026-04-13T11:00:00+01:00", amount: 2_680_000, department: "Programmes" },
  { reference: "PO-2026-0085", type: "PO", status: "submitted", label: "Port Harcourt depot — fuel & logistics", submittedBy: "Emeka Nwosu", submittedAt: "2026-04-13T09:30:00+01:00", amount: 940_000, department: "Operations" },
  { reference: "PV-2026-0162", type: "PV", status: "queried", label: "Staff medical retainer — Q3", submittedBy: "Zainab Bello", submittedAt: "2026-04-12T10:00:00+01:00", amount: 560_000, department: "People" },
];

/* ── Other documents the previews show ───────────────────────────── */

/** What Integrity flagged, beyond the inbox's own stipend voucher. */
export const FLAGGED_SUBJECTS = {
  duplicatePaymentReference: "PV-2026-0188",
  duplicateInvoiceReference: "PO-2026-0074",
  bankChangeVendor: "MegaSupplies Ltd",
} as const;

/** Other events on the audit trail the day the featured voucher went through. */
export const AUDIT_DAY_EVENTS = {
  voucherQueried: { auditAction: "PV_QUERIED", person: DEMO_PEOPLE.reviewer, document: QUERIED_VOUCHER.reference, at: "2026-04-15T10:48:05+01:00" },
  roleChanged: { auditAction: "USER_ROLE_CHANGED", person: DEMO_PEOPLE.administrator, document: "user:ifeoma.n@acme.ng", at: "2026-04-15T09:15:30+01:00" },
} as const;

export const EXPENSE_CLAIM = {
  reference: "ER-2026-0042",
  claimant: "Ifeoma Nwachukwu",
  claimantDetail: "Administrator · Operations · Joined Feb 2024",
  category: "Travel",
  purpose: "Client site visit, Abuja",
  receiptCount: 2,
  amount: 84_500,
} as const;

export const GRANT = {
  reference: "GR-2026-014",
  name: "Rural WASH Programme",
  donor: "Sahel Development Fund",
  /** A grant is held in the donor's currency, not the lead currency. */
  currency: "USD",
  allocated: 500_000,
  spent: 312_400,
  budgetLines: [
    { name: "Personnel", utilisedPercent: 78 },
    { name: "Equipment & supplies", utilisedPercent: 45 },
    { name: "Travel & logistics", utilisedPercent: 30 },
    { name: "Monitoring & evaluation", utilisedPercent: 12 },
  ],
} as const;

/**
 * The delegation-of-authority matrix the authority preview draws: who may
 * approve up to how much (major units; `null` = no ceiling). What happens
 * above a limit is the next row, so it is derived, not typed.
 */
export const AUTHORITY_LIMITS: readonly { role: string; limit: number | null }[] = [
  { role: "Officer", limit: 250_000 },
  { role: "Head of Department", limit: 2_000_000 },
  { role: "Finance Manager", limit: 10_000_000 },
  { role: "Managing Director", limit: null },
];

/** The example threshold in the audit page's "all approvals over …" use case. */
export const AUDIT_QUERY_THRESHOLD = 1_000_000;
