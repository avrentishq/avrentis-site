/**
 * Where browsers send a report when the Content-Security-Policy blocks
 * something — a Sentry project's security endpoint, the same service the app
 * and the console report errors to.
 *
 * The address is configuration (`CSP_REPORT_URI`, set per environment in the
 * hosting env), never committed. Unset or not https → no reporting directives at
 * all, so a missing value can never break the policy. Each report is tagged with
 * the environment so production and previews stay apart in Sentry.
 */

/** The report address with the environment tag, or null when reporting is off. */
export function cspReportUrl(configured: string | undefined, environment: string): string | null {
  if (!configured) return null;
  let url: URL;
  try {
    url = new URL(configured.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  url.searchParams.set("sentry_environment", environment);
  return url.toString();
}

/** The name the policy and the Reporting-Endpoints header agree on. */
export const CSP_REPORT_GROUP = "csp-endpoint";

/** Directives to append to the policy: `report-uri` (older browsers) and `report-to` (current ones). */
export function cspReportingDirectives(reportUrl: string | null): string[] {
  return reportUrl ? [`report-uri ${reportUrl}`, `report-to ${CSP_REPORT_GROUP}`] : [];
}

/** The `Reporting-Endpoints` header naming the report group, or none when reporting is off. */
export function reportingEndpointsHeader(reportUrl: string | null): { key: string; value: string }[] {
  return reportUrl ? [{ key: "Reporting-Endpoints", value: `${CSP_REPORT_GROUP}="${reportUrl}"` }] : [];
}
