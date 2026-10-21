/**
 * The kinds of provider that process customer data for the platform, and where —
 * the one list the privacy policy, the trust centre and the security FAQ read.
 *
 * They used to be typed separately and had drifted: the trust centre listed the
 * content-delivery edge as its own row and gave payment processing a region, the
 * privacy policy folded one and omitted the other, and the data-residency
 * paragraph was written four times. Changing an entry here changes the privacy
 * policy, so bump its effective date in the same change.
 *
 * Categories, not names: named providers are shared with prospective customers
 * on request, alongside the DPA.
 */

export const DATA_REGIONS = {
  uk: "United Kingdom (London)",
  eu: "European Union",
  us: "United States",
  edge: "Global edge",
  africaInternational: "Africa / international",
  usEu: "United States / European Union",
} as const;

export type DataRegion = (typeof DATA_REGIONS)[keyof typeof DATA_REGIONS];

export interface SubprocessorCategory {
  purpose: string;
  region: DataRegion;
  /** What a privacy reader should also know about this category. */
  detail?: string;
}

export const SUBPROCESSOR_CATEGORIES: readonly SubprocessorCategory[] = [
  { purpose: "Managed PostgreSQL for application data", region: DATA_REGIONS.uk },
  { purpose: "Application hosting and compute", region: DATA_REGIONS.uk },
  { purpose: "Content delivery network", region: DATA_REGIONS.edge },
  { purpose: "Object storage for document attachments", region: DATA_REGIONS.eu },
  { purpose: "Encrypted off-site backups with an independent provider", region: DATA_REGIONS.eu },
  {
    purpose: "Running the nightly backup job",
    region: DATA_REGIONS.us,
    detail: "The data is handled briefly, in memory, before it is encrypted, and is not kept.",
  },
  { purpose: "Managed Redis for session state and rate-limiting", region: DATA_REGIONS.uk },
  { purpose: "Background job processing", region: DATA_REGIONS.us },
  { purpose: "Transactional email delivery", region: DATA_REGIONS.us },
  {
    purpose: "WhatsApp and SMS notification delivery",
    region: DATA_REGIONS.africaInternational,
    detail:
      "WhatsApp is the primary real-time approval channel; recipient phone numbers and approval details are processed by this provider.",
  },
  {
    purpose: "Payment processing, where enabled, for plan checkout and subscription billing",
    region: DATA_REGIONS.africaInternational,
  },
  {
    purpose: "AI / large-language-model processing, where enabled",
    region: DATA_REGIONS.usEu,
    detail:
      "When you turn on optional AI features (such as receipt and document extraction), the relevant document content is processed by a language model through a model gateway configured for zero data retention.",
  },
  { purpose: "Error and performance monitoring", region: DATA_REGIONS.eu },
];

/** Where the primary data lives, attachments are kept and backups are stored — for residency sentences. */
export const DATA_RESIDENCY = {
  primary: DATA_REGIONS.uk,
  attachments: DATA_REGIONS.eu,
  backups: DATA_REGIONS.eu,
} as const;

/** The one answer to "can it stay in my country?". */
export const RESIDENCY_REQUEST_LINE =
  "If your data must stay in a specific country or region, talk to us and we will tell you plainly what we can support today.";

/**
 * Where data lives, as the public pages say it: the primary region only. The
 * full map (attachments, backups, the providers that process data elsewhere)
 * goes out on request and in the DPA, not on a page anyone can read. The
 * privacy notice keeps its own, fuller statement — the law asks it to.
 */
export const DATA_RESIDENCY_PUBLIC =
  `Primary application data is hosted in the ${DATA_RESIDENCY.primary}. ` +
  "The full list of where data is processed, and by whom, is available on request.";

