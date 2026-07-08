import { describe, it, expect } from "vitest";
import { isLaunchHidden, isLaunchVisible } from "@/lib/launch";

describe("launch gate", () => {
  it("hides listed pre-launch routes", () => {
    expect(isLaunchHidden("/trust")).toBe(true);
    expect(isLaunchVisible("/trust")).toBe(false);
    expect(isLaunchHidden("/product/integrations")).toBe(true);
  });

  it("shows live routes", () => {
    expect(isLaunchVisible("/trial")).toBe(true);
    expect(isLaunchVisible("/pricing")).toBe(true);
    expect(isLaunchVisible("/product/pay")).toBe(true);
    expect(isLaunchHidden("/pricing")).toBe(false);
  });
});
