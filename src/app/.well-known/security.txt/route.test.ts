import { describe, expect, it } from "vitest";

import { GET, securityTxt } from "./route";

describe("security.txt", () => {
  it("names the security contact, the policy and a canonical URL", () => {
    const text = securityTxt(new Date("2026-10-04T00:00:00Z"));
    expect(text).toContain("Contact: mailto:security@avrentis.com\n");
    expect(text).toContain("Policy: https://avrentis.com/trust\n");
    expect(text).toContain("Canonical: https://avrentis.com/.well-known/security.txt\n");
  });

  it("expires within the one-year maximum the standard allows", () => {
    const now = new Date("2026-10-04T00:00:00Z");
    const expires = new Date(securityTxt(now).match(/^Expires: (.+)$/m)![1]!);
    const days = (expires.getTime() - now.getTime()) / 86_400_000;
    expect(days).toBeGreaterThan(300);
    expect(days).toBeLessThanOrEqual(366);
  });

  it("is served as plain text", async () => {
    const response = GET();
    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toMatch(/^Contact: /);
  });
});
