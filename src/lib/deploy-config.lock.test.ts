import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The hosting config must stay deployable and keep the token out of URLs.
 *
 * Vercel rejects an `installCommand` longer than 256 characters before the
 * build starts (it happened: the credential-helper command was 270 long), so the
 * install steps live in `scripts/vercel-install.sh`. That script must never put
 * GITHUB_TOKEN into a git URL, where a failed clone would print it in the log.
 *
 * Only `main` (production) and `staging` (the one review environment) build;
 * every other branch push is skipped by `ignoreCommand` (exit 0 = skip, 1 =
 * build). Not `git.deploymentEnabled`: its patterns are globs, `*` does not
 * match a branch with a slash, and which of two matching patterns wins is
 * unspecified — a wider pattern could switch off `main`.
 */
const root = process.cwd();
const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8")) as Record<string, string>;
const installScript = readFileSync(join(root, "scripts", "vercel-install.sh"), "utf8");

describe("hosting config", () => {
  it("keeps every command within Vercel's 256-character limit", () => {
    for (const key of ["installCommand", "buildCommand", "ignoreCommand"]) {
      expect(vercel[key]!.length, key).toBeLessThanOrEqual(256);
    }
  });

  it("installs through the script", () => {
    expect(vercel.installCommand).toBe("sh scripts/vercel-install.sh");
  });

  it("never writes the token into a URL", () => {
    const TOKEN_IN_URL = /https:\/\/[^\s"']*\$\{?GITHUB_TOKEN/;
    expect(TOKEN_IN_URL.test('url."https://x-access-token:${GITHUB_TOKEN}@github.com/"')).toBe(true);
    expect(TOKEN_IN_URL.test(installScript)).toBe(false);
    expect(installScript).toContain("credential.helper");
  });

  it("builds only main and staging", () => {
    const builds = (branch: string) =>
      spawnSync("sh", ["-c", vercel.ignoreCommand!], {
        env: { ...process.env, VERCEL_GIT_COMMIT_REF: branch },
      }).status === 1;
    expect(builds("main")).toBe(true);
    expect(builds("staging")).toBe(true);
    expect(builds("fix/platform-origin-trailing-slash")).toBe(false);
    expect(builds("feature")).toBe(false);
    expect(builds("staging-old")).toBe(false);
    expect(builds("")).toBe(false);
  });
});
