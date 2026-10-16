import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PLATFORM_ORIGIN, trimOrigin } from "@/lib/platform";
import { platformFetch } from "@/lib/platform-fetch";

const BYPASS_HEADER = "x-vercel-protection-bypass";
const platform = vi.fn();

function sentHeaders(): Headers {
  return platform.mock.calls[0]![1].headers as Headers;
}

beforeEach(() => {
  platform.mockReset().mockResolvedValue(new Response("{}"));
  vi.stubGlobal("fetch", platform);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("platformFetch", () => {
  it("calls the platform origin and keeps the caller's headers", async () => {
    await platformFetch("/api/v1/public/pricing", { headers: { "Content-Type": "application/json" } });
    expect(platform.mock.calls[0]![0]).toBe(`${PLATFORM_ORIGIN}/api/v1/public/pricing`);
    expect(sentHeaders().get("content-type")).toBe("application/json");
    expect(sentHeaders().has(BYPASS_HEADER)).toBe(false);
  });

  it("adds the bypass secret on a preview build", async () => {
    vi.stubEnv("PLATFORM_BYPASS_SECRET", "preview-secret");
    vi.stubEnv("VERCEL_ENV", "preview");
    await platformFetch("/api/v1/public/trial/request", { method: "POST" });
    expect(sentHeaders().get(BYPASS_HEADER)).toBe("preview-secret");
  });

  it("never sends it from the production build, even when set", async () => {
    vi.stubEnv("PLATFORM_BYPASS_SECRET", "stray-secret");
    vi.stubEnv("VERCEL_ENV", "production");
    await platformFetch("/api/v1/public/trial/request", { method: "POST" });
    expect(sentHeaders().has(BYPASS_HEADER)).toBe(false);
  });
});

describe("trimOrigin", () => {
  it("drops trailing slashes so a path is never joined with two", () => {
    expect(trimOrigin("https://app.example.com/")).toBe("https://app.example.com");
    expect(trimOrigin("https://app.example.com//")).toBe("https://app.example.com");
    expect(trimOrigin("https://app.example.com")).toBe("https://app.example.com");
  });
});
