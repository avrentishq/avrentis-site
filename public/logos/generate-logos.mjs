#!/usr/bin/env node
/**
 * AVRENTIS Logo Asset Generator
 *
 * Generates all logo variants as standalone SVG files (+ PNG for the
 * text-bearing families). Uses the exact same proportion and colour engine
 * as logo.tsx for the Gate Mark.
 *
 * The wordmark is rendered as OUTLINED VECTOR PATHS, not live <text>:
 *   - The viewBox is sized to the real glyph advance, so no character is ever
 *     clipped (the historical "fontSize * 5.2" guess was ~12px too narrow and
 *     chopped the trailing "S", making the logo read "AVRENTI").
 *   - There is no font dependency, so the asset renders identically on any
 *     external service (favicon generators, social/OG, email, app stores)
 *     regardless of whether Hanken Grotesk is installed there.
 *
 * Run:  pnpm generate:logos   (or: node public/logos/generate-logos.mjs)
 *
 * Output (in this directory):
 *   mark-{variant}-{size}.svg       — Gate Mark only (pure geometry; SVG only)
 *   lockup-{variant}-{size}.svg/png — Mark + outlined wordmark
 *   wordmark-{color}.svg/png        — Outlined wordmark only
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import opentype from "opentype.js";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Brand wordmark constants ─────────────────────────────────────────────────

const WORDMARK_TEXT = "AVRENTIS";
const LETTER_SPACING_RATIO = 0.15; // mirrors logo.tsx ("0.15em")

// Hanken Grotesk 700 — the brand wordmark face (matches next/font/google in
// src/app/layout.tsx). Cached locally; downloaded on first run from the same
// Google Fonts source next/font uses, so the binary is never committed.
const FONT_URL =
  "https://fonts.gstatic.com/s/hankengrotesk/v12/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_NcVGFa4Q.ttf";
const FONT_CACHE_DIR = join(__dirname, "..", "..", "node_modules", ".cache", "avrentis-fonts");
const FONT_PATH = join(FONT_CACHE_DIR, "HankenGrotesk-Bold.ttf");

async function loadFont() {
  if (!existsSync(FONT_PATH)) {
    mkdirSync(FONT_CACHE_DIR, { recursive: true });
    const res = await fetch(FONT_URL);
    if (!res.ok) throw new Error(`Failed to download Hanken Grotesk: HTTP ${res.status}`);
    writeFileSync(FONT_PATH, Buffer.from(await res.arrayBuffer()));
  }
  const buf = readFileSync(FONT_PATH);
  return opentype.parse(new Uint8Array(buf).buffer);
}

const round = (n) => Math.round(n * 1000) / 1000;

/**
 * Build the outlined wordmark as a single opentype Path, advancing per glyph
 * with letter-spacing. We use charToGlyph per character to bypass opentype@2's
 * GSUB/ccmp processing (which throws on this font) — "AVRENTIS" needs no
 * ligatures or contextual substitution anyway.
 */
function buildWordmarkPath(font, fontSize, baselineY) {
  const letterSpacing = fontSize * LETTER_SPACING_RATIO;
  let x = 0;
  const path = new opentype.Path();
  for (const ch of WORDMARK_TEXT) {
    const glyph = font.charToGlyph(ch);
    path.extend(glyph.getPath(x, baselineY, fontSize));
    x += (glyph.advanceWidth / font.unitsPerEm) * fontSize + letterSpacing;
  }
  const advance = x - letterSpacing; // drop trailing letter-spacing
  return { path, advance, bbox: path.getBoundingBox() };
}

// ── Proportion engine (mirrors logo.tsx exactly) ────────────────────────────

function getProps(size) {
  const postH = size * 0.52;
  const passageW = size * 0.321;
  const leftPostW = size * 0.09;
  const rightPostW = size * 0.086;
  const beamH = size * 0.05;
  const ledgerH = size * 0.05;
  const overhang = size * 0.016;
  const rx = size * 0.16;

  const markW = overhang + leftPostW + passageW + rightPostW + overhang;
  const markH = beamH + postH + ledgerH;

  const padH = (size - markW) / 2;
  const padV = (size - markH) / 2;

  const beamX = padH;
  const beamY = padV;
  const beamW = markW;

  const leftPostX = padH + overhang;
  const rightPostX = padH + overhang + leftPostW + passageW;
  const postY = padV + beamH;

  const slotX = leftPostX + leftPostW;
  const slotY = postY + postH * 0.618;
  const slotW = passageW;
  const slotH = Math.max(2, size * 0.004);

  const ledgerY = postY + postH;

  return {
    rx, beamX, beamY, beamW, beamH,
    leftPostX, rightPostX, postY, leftPostW, rightPostW, postH,
    slotX, slotY, slotW, slotH,
    ledgerY, ledgerH,
    // Ledger is ALWAYS full-bleed (edge-to-edge, 0 → size) in every variant.
    ledgerX: 0, ledgerW: size,
  };
}

// ── Colour engine ───────────────────────────────────────────────────────────

const VARIANTS = {
  primary: {
    container: "#0f172a", stroke: "#C68B2F", slot: "#C68B2F",
    slotOpacity: 0.35, border: "rgba(198,139,47,0.2)", transparent: false,
    wordmark: "#ffffff",
  },
  reversed: {
    container: "#C68B2F", stroke: "#0f172a", slot: "#0f172a",
    slotOpacity: 0.35, border: "none", transparent: false,
    wordmark: "#0f172a",
  },
  "transparent-gold": {
    container: "none", stroke: "#C68B2F", slot: "#C68B2F",
    slotOpacity: 0.35, border: "none", transparent: true,
    wordmark: "#C68B2F",
  },
  "transparent-navy": {
    container: "none", stroke: "#0f172a", slot: "#0f172a",
    slotOpacity: 0.35, border: "none", transparent: true,
    wordmark: "#0f172a",
  },
};

// ── SVG generators ──────────────────────────────────────────────────────────

function generateMark(size, variant) {
  const p = getProps(size);
  const c = VARIANTS[variant];
  const ledgerX = p.ledgerX;
  const ledgerW = p.ledgerW;

  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">\n`;

  // Container
  if (c.container !== "none") {
    const borderAttr = c.border !== "none"
      ? ` stroke="${c.border}" stroke-width="0.5"`
      : "";
    svg += `  <rect width="${size}" height="${size}" rx="${p.rx}" fill="${c.container}"${borderAttr}/>\n`;
  }

  // Beam
  svg += `  <rect x="${p.beamX}" y="${p.beamY}" width="${p.beamW}" height="${p.beamH}" fill="${c.stroke}"/>\n`;
  // Left post
  svg += `  <rect x="${p.leftPostX}" y="${p.postY}" width="${p.leftPostW}" height="${p.postH}" fill="${c.stroke}"/>\n`;
  // Right post
  svg += `  <rect x="${p.rightPostX}" y="${p.postY}" width="${p.rightPostW}" height="${p.postH}" fill="${c.stroke}"/>\n`;
  // Document slot (only at 48px+)
  if (size >= 48) {
    svg += `  <rect x="${p.slotX}" y="${p.slotY}" width="${p.slotW}" height="${p.slotH}" fill="${c.slot}" opacity="${c.slotOpacity}"/>\n`;
  }
  // Ledger
  svg += `  <rect x="${ledgerX}" y="${p.ledgerY}" width="${ledgerW}" height="${p.ledgerH}" fill="${c.stroke}"/>\n`;

  svg += `</svg>`;
  return svg;
}

function generateWordmark(font, color, fontSize) {
  const baselineY = fontSize;
  const { path, advance, bbox } = buildWordmarkPath(font, fontSize, baselineY);

  const padX = fontSize * 0.08; // small breathing room each side
  const inkW = bbox.x2 - bbox.x1;
  const height = round(fontSize * 1.2);
  const tx = round(padX - bbox.x1); // left ink edge sits exactly at padX

  // advance is the true right extent of the run; never let the box clip it.
  const width = round(Math.max(padX + inkW + padX, padX + advance + padX));

  const d = path.toPathData(2);
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <path transform="translate(${tx} 0)" d="${d}" fill="${color}"/>
</svg>`;
}

function generateLockup(font, size, variant) {
  const p = getProps(size);
  const c = VARIANTS[variant];
  const ledgerX = p.ledgerX;
  const ledgerW = p.ledgerW;

  const gap = Math.round(size * 0.25);
  const wordmarkFontSize = size * 0.46;
  const wordmarkY = size / 2 + wordmarkFontSize * 0.35; // vertical centre baseline
  const { path, advance, bbox } = buildWordmarkPath(font, wordmarkFontSize, wordmarkY);

  const padRight = wordmarkFontSize * 0.08;
  const inkW = bbox.x2 - bbox.x1;
  const originX = size + gap; // left ink edge of the wordmark
  const tx = round(originX - bbox.x1);
  const totalWidth = round(Math.max(originX + inkW + padRight, originX + advance + padRight));

  let svg = `<svg width="${totalWidth}" height="${size}" viewBox="0 0 ${totalWidth} ${size}" xmlns="http://www.w3.org/2000/svg">\n`;

  // Mark
  svg += `  <g>\n`;
  if (c.container !== "none") {
    const borderAttr = c.border !== "none"
      ? ` stroke="${c.border}" stroke-width="0.5"`
      : "";
    svg += `    <rect width="${size}" height="${size}" rx="${p.rx}" fill="${c.container}"${borderAttr}/>\n`;
  }
  svg += `    <rect x="${p.beamX}" y="${p.beamY}" width="${p.beamW}" height="${p.beamH}" fill="${c.stroke}"/>\n`;
  svg += `    <rect x="${p.leftPostX}" y="${p.postY}" width="${p.leftPostW}" height="${p.postH}" fill="${c.stroke}"/>\n`;
  svg += `    <rect x="${p.rightPostX}" y="${p.postY}" width="${p.rightPostW}" height="${p.postH}" fill="${c.stroke}"/>\n`;
  if (size >= 48) {
    svg += `    <rect x="${p.slotX}" y="${p.slotY}" width="${p.slotW}" height="${p.slotH}" fill="${c.slot}" opacity="${c.slotOpacity}"/>\n`;
  }
  svg += `    <rect x="${ledgerX}" y="${p.ledgerY}" width="${ledgerW}" height="${p.ledgerH}" fill="${c.stroke}"/>\n`;
  svg += `  </g>\n`;

  // Wordmark (outlined)
  svg += `  <path transform="translate(${tx} 0)" d="${path.toPathData(2)}" fill="${c.wordmark}"/>\n`;

  svg += `</svg>`;
  return svg;
}

// ── Rasterizer ───────────────────────────────────────────────────────────────

function rasterize(svg, filename) {
  const png = new Resvg(svg, { background: "rgba(0,0,0,0)" }).render().asPng();
  writeFileSync(join(__dirname, filename), png);
}

// ── Generate all assets ─────────────────────────────────────────────────────

const SIZES = [48, 64, 128, 256, 512];
const LOCKUP_SIZES = [48, 64, 128, 256];
const variants = Object.keys(VARIANTS);

const font = await loadFont();
let svgCount = 0;
let pngCount = 0;

// Marks at all sizes × all variants (pure geometry; SVG only, unchanged)
for (const variant of variants) {
  for (const size of SIZES) {
    writeFileSync(join(__dirname, `mark-${variant}-${size}.svg`), generateMark(size, variant));
    svgCount++;
  }
}

// Lockups at select sizes × all variants (SVG + PNG)
for (const variant of variants) {
  for (const size of LOCKUP_SIZES) {
    const svg = generateLockup(font, size, variant);
    const base = `lockup-${variant}-${size}`;
    writeFileSync(join(__dirname, `${base}.svg`), svg);
    rasterize(svg, `${base}.png`);
    svgCount++; pngCount++;
  }
}

// Standalone wordmarks (SVG + PNG)
const WORDMARK_CONFIGS = [
  { color: "#ffffff", name: "white", fontSize: 24 },
  { color: "#0f172a", name: "navy", fontSize: 24 },
  { color: "#C68B2F", name: "gold", fontSize: 24 },
  { color: "#ffffff", name: "white-lg", fontSize: 48 },
  { color: "#0f172a", name: "navy-lg", fontSize: 48 },
  { color: "#C68B2F", name: "gold-lg", fontSize: 48 },
];

for (const { color, name, fontSize } of WORDMARK_CONFIGS) {
  const svg = generateWordmark(font, color, fontSize);
  writeFileSync(join(__dirname, `wordmark-${name}.svg`), svg);
  rasterize(svg, `wordmark-${name}.png`);
  svgCount++; pngCount++;
}

console.log(`Generated ${svgCount} SVG + ${pngCount} PNG files in ${__dirname}`);
