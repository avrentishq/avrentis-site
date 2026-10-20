import { afterEach, describe, expect, it, vi } from "vitest";

import { BRAND } from "@/lib/brand";

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

import * as launch from "@/lib/launch";
import { GET, securityTxt } from "./route";

afterEach(() => vi.restoreAllMocks());

describe("security.txt", () => {
  it("names the security contact, the policy and a canonical URL", () => {
    const text = securityTxt(new Date("2026-10-04T00:00:00Z"));
    expect(text).toContain(`Contact: mailto:${BRAND.securityEmail}\n`);
    expect(text).toMatch(new RegExp(`^Policy: ${escape(BRAND.siteUrl)}/(trust|product/security)$`, "m"));
    expect(text).toContain(`Canonical: ${BRAND.siteUrl}/.well-known/security.txt\n`);
  });

  it("points the policy at the security overview while the trust centre is launch-hidden", () => {
    vi.spyOn(launch, "isLaunchHidden").mockImplementation((path) => path === "/trust");
    expect(securityTxt()).toContain(`Policy: ${BRAND.siteUrl}/product/security\n`);
  });

  it("points the policy at the trust centre once it is shown, with no other edit", () => {
    vi.spyOn(launch, "isLaunchHidden").mockReturnValue(false);
    expect(securityTxt()).toContain(`Policy: ${BRAND.siteUrl}/trust\n`);
  });

  it("never names a page the launch gate hides today", () => {
    const policy = securityTxt().match(new RegExp(`^Policy: ${escape(BRAND.siteUrl)}(\\S+)$`, "m"))![1]!;
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
