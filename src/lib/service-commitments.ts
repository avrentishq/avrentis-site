/* ── Service commitments: their own comparison group ───────────── */

// Relative and package imports only: the fallback generator loads this file
// through jiti, outside the Next/Vitest alias config.
import { SERVICE_COMMITMENT_KEYS } from "@avrentishq/core/billing/features";
import type { PricingData } from "./pricing";

/**
 * Dedicated onboarding and priority support are promises a person keeps, not
 * capabilities the product enforces, so the comparison table shows them under
 * their own heading rather than among "Workflow & platform" features.
 *
 * Which keys are service commitments is core's `SERVICE_COMMITMENT_KEYS`. Which
 * plan carries which is read from the payload's per-plan `serviceCommitments`
 * array when present (the current API and the generated fallback), and from
 * `plan.features` otherwise — an older payload listed them only there, under
 * the platform group. Either way the output is the same: the keys removed from
 * every other group, one `service` group appended, and each plan's boolean set
 * from the authoritative list. Pure; returns a new object.
 */

export const SERVICE_GROUP_KEY = "service";
export const SERVICE_GROUP_LABEL = "Service & support";

const SERVICE_KEYS: readonly string[] = SERVICE_COMMITMENT_KEYS;

export function withServiceCommitmentGroup(data: PricingData): PricingData {
  const plans = data.plans.map((plan) => {
    const carried = plan.serviceCommitments ?? SERVICE_KEYS.filter((key) => plan.features[key] === true);
    return {
      ...plan,
      serviceCommitments: [...carried],
      features: {
        ...plan.features,
        ...Object.fromEntries(SERVICE_KEYS.map((key) => [key, carried.includes(key)])),
      },
    };
  });

  const offered = SERVICE_KEYS.filter((key) => plans.some((plan) => plan.features[key]));
  const otherGroups = (data.featureGroups ?? [])
    .filter((group) => group.key !== SERVICE_GROUP_KEY)
    .map((group) => ({ ...group, featureKeys: group.featureKeys.filter((key) => !SERVICE_KEYS.includes(key)) }))
    .filter((group) => group.featureKeys.length > 0);

  return {
    ...data,
    plans,
    featureGroups:
      offered.length > 0
        ? [...otherGroups, { key: SERVICE_GROUP_KEY, label: SERVICE_GROUP_LABEL, featureKeys: offered }]
        : otherGroups,
  };
}
