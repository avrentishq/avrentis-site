import { describe, expect, it } from "vitest";

import { cspReportUrl, cspReportingDirectives, reportingEndpointsHeader } from "./csp-reporting";

const ENDPOINT = "https://example.ingest.test/api/1/security/?sentry_key=public";

describe("CSP reporting", () => {
  it("is off when unset, malformed or not https", () => {
    for (const configured of [undefined, "", "not a url", "http://example.ingest.test/api/1/security/"]) {
      expect(cspReportUrl(configured, "production")).toBeNull();
    }
    expect(cspReportingDirectives(null)).toEqual([]);
    expect(reportingEndpointsHeader(null)).toEqual([]);
  });

  it("tags reports with the environment and keeps the key", () => {
    const url = new URL(cspReportUrl(ENDPOINT, "preview")!);
    expect(url.searchParams.get("sentry_environment")).toBe("preview");
    expect(url.searchParams.get("sentry_key")).toBe("public");
  });

  it("names the same group in the policy and the header", () => {
    const url = cspReportUrl(ENDPOINT, "production");
    expect(cspReportingDirectives(url)).toEqual([`report-uri ${url}`, "report-to csp-endpoint"]);
    expect(reportingEndpointsHeader(url)).toEqual([{ key: "Reporting-Endpoints", value: `csp-endpoint="${url}"` }]);
  });
});
