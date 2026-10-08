import { afterEach, describe, expect, it, vi } from "vitest";

import * as launch from "@/lib/launch";
import { GET, securityTxt } from "./route";

afterEach(() => vi.restoreAllMocks());

describe("security.txt", () => {
  it("names the security contact, the policy and a canonical URL", () => {
    const text = securityTxt(new Date("2026-10-04T00:00:00Z"));
    expect(text).toContain("Contact: mailto:security@avrentis.com\n");
    expect(text).toMatch(/^Policy: https:\/\/avrentis\.com\/(trust|product\/security)$/m);
    expect(text).toContain("Canonical: https://avrentis.com/.well-known/security.txt\n");
  });

  it("points the policy at the security overview while the trust centre is launch-hidden", () => {
    vi.spyOn(launch, "isLaunchHidden").mockImplementation((path) => path === "/trust");
    expect(securityTxt()).toContain("Policy: https://avrentis.com/product/security\n");
  });

  it("points the policy at the trust centre once it is shown, with no other edit", () => {
    vi.spyOn(launch, "isLaunchHidden").mockReturnValue(false);
    expect(securityTxt()).toContain("Policy: https://avrentis.com/trust\n");
  });

  it("never names a page the launch gate hides today", () => {
    const policy = securityTxt().match(/^Policy: https:\/\/avrentis\.com(\S+)$/m)![1]!;
    expect(launch.isLaunchHidden(policy)).toBe(false);
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
