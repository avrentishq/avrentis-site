#!/usr/bin/env node
/**
 * Text contrast, measured on the rendered site — every page in the sitemap
 * (plus the not-found page), at desktop and phone widths.
 *
 *   pnpm build && pnpm check:contrast          # starts `next start` itself
 *   pnpm check:contrast --url http://localhost:3000   # an already-running site
 *
 * WHY IT MEASURES PIXELS. The token tests compare colour VALUES, which is only
 * the truth on a flat surface. Text on this site once failed over photographic
 * section textures while every token pairing passed — the colour behind a word
 * was whatever the photo was there. So this check hides all text, screenshots
 * the page, and compares each run of text with the pixels actually behind it.
 * A run passes when the worst 10% of its area still meets WCAG AA (4.5:1, or
 * 3:1 for large text) — see `scripts/wcag-contrast.mjs`.
 *
 * Skipped, as WCAG skips them: disabled controls, and text that is not visible
 * (closed disclosure panels, `visibility: hidden`, zero opacity, clipped away).
 *
 * The detector proves itself on every run: it plants one run of text known to
 * fail on the first page and refuses to report a pass unless it catches it.
 *
 * Exit 0 = every run passes; 1 = failures (listed); 2 = the check could not run.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { chromium } from "playwright";

import { CONTRAST_SOURCE_FOR_BROWSER } from "./wcag-contrast.mjs";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
];
const NOT_FOUND_PROBE = "/contrast-check-not-found";
const CANARY_TEXT = "contrast-check canary";
const SERVER_READY_TIMEOUT_MS = 90_000;
/** How long a page may keep animating before it is reported as unmeasurable. */
const SETTLE_TIMEOUT_MS = 15_000;
const SETTLE_INTERVAL_MS = 500;
/** Chrome's canvas cannot hold a taller full-page screenshot. */
const MAX_CANVAS_HEIGHT = 32_000;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(2);
}

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

/** Start `next start` on a free port; resolves once it answers, fails closed. */
async function startServer() {
  if (!existsSync(join(process.cwd(), ".next", "BUILD_ID"))) {
    fail("no production build — run `pnpm build` first (or pass --url)");
  }
  const port = await freePort();
  // Next's own entry point under this node, so the PID we hold IS the server.
  const nextBin = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  const child = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  let exited = false;
  child.on("exit", () => (exited = true));
  // Whatever ends this process — a pass, a failure, `fail()` — stops the server.
  process.on("exit", () => {
    if (!exited) child.kill("SIGTERM");
  });
  const base = `http://localhost:${port}`;
  const deadline = Date.now() + SERVER_READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (exited) fail("the site server exited before it was ready");
    try {
      const response = await fetch(base);
      if (response.ok) return { base, stop: () => child.kill("SIGTERM") };
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  child.kill("SIGTERM");
  fail(`the site server did not answer within ${SERVER_READY_TIMEOUT_MS / 1000}s`);
}

/** Every page the site publishes, from its own sitemap — never a typed list. */
async function sitemapPaths(base) {
  const response = await fetch(`${base}/sitemap.xml`);
  if (!response.ok) fail(`sitemap.xml answered ${response.status}`);
  const xml = await response.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  if (paths.length === 0) fail("sitemap.xml lists no pages");
  return [...new Set(paths)];
}

/** Collect every visible run of text with its colour, size and box (page coordinates). */
function collectTextRuns() {
  const runs = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent.trim();
    if (text.length === 0) continue;
    const element = node.parentElement;
    if (!element || element.closest("script, style, noscript, svg")) continue;
    if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) continue;
    if (element.closest("button:disabled, input:disabled, select:disabled, textarea:disabled, [aria-disabled='true']")) continue;
    if (element.closest("details:not([open])") && !element.closest("summary")) continue;

    const range = document.createRange();
    range.selectNodeContents(node);
    let box = range.getBoundingClientRect();
    // Clip to every ancestor that hides its overflow.
    let left = box.left;
    let top = box.top;
    let right = box.right;
    let bottom = box.bottom;
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      if (style.overflowX !== "visible" || style.overflowY !== "visible") {
        const clip = ancestor.getBoundingClientRect();
        left = Math.max(left, clip.left);
        top = Math.max(top, clip.top);
        right = Math.min(right, clip.right);
        bottom = Math.min(bottom, clip.bottom);
      }
    }
    if (right - left < 1 || bottom - top < 1) continue;

    let opacity = 1;
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      opacity *= Number(getComputedStyle(ancestor).opacity);
    }
    const style = getComputedStyle(element);
    runs.push({
      text: text.slice(0, 60),
      color: style.color,
      opacity,
      fontSize: parseFloat(style.fontSize),
      fontWeight: Number(style.fontWeight),
      box: { left: left + scrollX, top: top + scrollY, width: right - left, height: bottom - top },
    });
  }
  return runs;
}

/** Measure each run against the text-free screenshot (a PNG data URL). */
async function measureRuns({ runs, screenshot, contrastSource }) {
  // The shared WCAG maths, defined in this page from its one source file.
  const { contrastRatio, composite, requiredRatio, ratioAtShare } = new Function(
    `${contrastSource}\nreturn { contrastRatio, composite, requiredRatio, ratioAtShare };`,
  )();
  const image = new Image();
  image.src = screenshot;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);

  const parse = (css) => {
    const values = css.match(/[\d.]+/g).map(Number);
    return { rgb: values.slice(0, 3), alpha: values.length > 3 ? values[3] : 1 };
  };
  const failures = [];
  for (const run of runs) {
    // Only the part of the run that is on the page.
    const x0 = Math.max(0, Math.floor(run.box.left));
    const y0 = Math.max(0, Math.floor(run.box.top));
    const width = Math.min(canvas.width, Math.ceil(run.box.left + run.box.width)) - x0;
    const height = Math.min(canvas.height, Math.ceil(run.box.top + run.box.height)) - y0;
    if (width < 1 || height < 1) continue;
    const pixels = context.getImageData(x0, y0, width, height).data;
    const step = Math.max(1, Math.floor(Math.sqrt((width * height) / 400)));
    const { rgb, alpha } = parse(run.color);
    const ratios = [];
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const offset = (y * width + x) * 4;
        const behind = [pixels[offset], pixels[offset + 1], pixels[offset + 2]];
        ratios.push(contrastRatio(composite(rgb, alpha * run.opacity, behind), behind));
      }
    }
    const measured = ratioAtShare(ratios);
    const needed = requiredRatio(run.fontSize, run.fontWeight);
    if (measured < needed) {
      failures.push({ text: run.text, measured: Math.round(measured * 100) / 100, needed, color: run.color, fontSize: run.fontSize });
    }
  }
  return failures;
}

async function checkPage(page, base, path, { plantCanary }) {
  const response = await page.goto(base + path, { waitUntil: "load" });
  if (!response) fail(`${path} did not load`);
  await page.evaluate(() => document.fonts.ready);
  // Scroll through once so in-view content starts its entrance.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
  });
  if (plantCanary) {
    // #9a9a9a on white measures about 2.8:1 — a sure failure at 14px.
    await page.evaluate((text) => {
      const canary = document.createElement("p");
      canary.textContent = text;
      // In flow after everything else, so it covers no real text.
      canary.style.cssText = "display:block;position:relative;margin:0;padding:4px;font-size:14px;color:#9a9a9a;background:#ffffff";
      document.body.appendChild(canary);
    }, CANARY_TEXT);
  }
  // Measure only once the page has settled: text caught mid-fade is
  // half-transparent and would read as a failure it is not. Two collections in
  // a row must agree (same runs, same colours, same opacity), within a deadline.
  let runs = await page.evaluate(collectTextRuns);
  const settleDeadline = Date.now() + SETTLE_TIMEOUT_MS;
  for (;;) {
    await page.waitForTimeout(SETTLE_INTERVAL_MS);
    const again = await page.evaluate(collectTextRuns);
    const signature = (list) => JSON.stringify(list.map((run) => [run.text, run.color, run.opacity.toFixed(3)]));
    const settled = signature(again) === signature(runs);
    runs = again;
    if (settled) break;
    if (Date.now() > settleDeadline) fail(`${path} never stopped changing within ${SETTLE_TIMEOUT_MS / 1000}s — cannot measure it`);
  }
  if (runs.length === 0) fail(`${path} has no visible text — the page did not render`);
  await page.addStyleTag({
    content:
      "*, *::before, *::after, ::placeholder { color: transparent !important; text-shadow: none !important; -webkit-text-stroke: 0 !important; caret-color: transparent !important; text-decoration-color: transparent !important; }",
  });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  if (height > MAX_CANVAS_HEIGHT) fail(`${path} is ${height}px tall — over what one screenshot can measure`);
  const png = await page.screenshot({ fullPage: true, animations: "disabled" });
  const screenshot = `data:image/png;base64,${png.toString("base64")}`;
  const failures = await page.evaluate(measureRuns, { runs, screenshot, contrastSource: CONTRAST_SOURCE_FOR_BROWSER });
  return { status: response.status(), checked: runs.length, failures };
}

async function main() {
  const explicitUrl = argument("--url");
  const server = explicitUrl ? { base: explicitUrl.replace(/\/$/, ""), stop: () => {} } : await startServer();
  try {
    const paths = [...(await sitemapPaths(server.base)), NOT_FOUND_PROBE];
    const browser = await chromium.launch();
    let checked = 0;
    const failures = [];
    try {
      for (const viewport of VIEWPORTS) {
        const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
        // Motion settles instantly, so nothing is measured mid-fade.
        await page.emulateMedia({ reducedMotion: "reduce" });
        for (const [index, path] of paths.entries()) {
          const plantCanary = index === 0;
          const result = await checkPage(page, server.base, path, { plantCanary });
          if (path !== NOT_FOUND_PROBE && result.status >= 400) fail(`${path} answered ${result.status}`);
          if (plantCanary) {
            const caught = result.failures.some((failure) => failure.text === CANARY_TEXT);
            if (!caught) fail(`the detector missed its planted failure on ${path} (${viewport.name}) — the check is blind`);
          }
          checked += result.checked - (plantCanary ? 1 : 0);
          for (const failure of result.failures) {
            if (failure.text !== CANARY_TEXT) failures.push({ path, viewport: viewport.name, ...failure });
          }
        }
        await page.close();
      }
    } finally {
      await browser.close();
    }

    console.log(`Contrast: ${checked} runs of text on ${paths.length} pages × ${VIEWPORTS.length} widths (detector proven live).`);
    if (failures.length === 0) {
      console.log("✓ every run meets WCAG AA");
      return 0;
    }
    console.log(`✗ ${failures.length} runs below WCAG AA:`);
    for (const failure of failures) {
      console.log(
        `  ${failure.path} [${failure.viewport}] "${failure.text}" — ${failure.measured}:1, needs ${failure.needed}:1 (${failure.color}, ${failure.fontSize}px)`,
      );
    }
    return 1;
  } finally {
    server.stop();
  }
}

process.exitCode = await main();
