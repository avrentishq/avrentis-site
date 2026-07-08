/**
 * Approval time-saved estimator — pure math, shared by the on-page calculator
 * and the server action that emails the result, so the two can never drift.
 *
 * The model is deliberately simple and transparent (stated to the user):
 *   coordination hours/month  = approvals × minutes-per-approval ÷ 60
 *   hours saved/month         = coordination hours × EFFICIENCY
 *   money saved/year          = hours saved/year × loaded hourly cost
 *
 * EFFICIENCY is a single conservative, generic assumption — NOT a proprietary
 * benchmark. Every other number is the user's own input.
 */

export const EFFICIENCY = 0.6;

export interface Bound {
  min: number;
  max: number;
  default: number;
}

export const BOUNDS: Record<"approvals" | "minutes" | "cost", Bound> = {
  approvals: { min: 1, max: 100_000, default: 120 },
  minutes: { min: 1, max: 600, default: 25 },
  cost: { min: 1, max: 1_000_000, default: 5_000 },
};

export interface SavingsInputs {
  approvals: number;
  minutes: number;
  cost: number;
}

export interface SavingsResult {
  hoursPerMonth: number;
  hoursPerYear: number;
  nairaPerYear: number;
}

/** Coerce anything to an integer inside [min, max]; non-finite → min. */
export function clampInt(value: unknown, bound: Bound): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return bound.min;
  return Math.min(bound.max, Math.max(bound.min, n));
}

export function computeSavings({ approvals, minutes, cost }: SavingsInputs): SavingsResult {
  const coordinationHoursPerMonth = (approvals * minutes) / 60;
  const hoursPerMonth = coordinationHoursPerMonth * EFFICIENCY;
  const hoursPerYear = hoursPerMonth * 12;
  const nairaPerYear = hoursPerYear * cost;
  return { hoursPerMonth, hoursPerYear, nairaPerYear };
}
