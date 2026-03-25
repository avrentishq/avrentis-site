#!/usr/bin/env node
/**
 * AVRENTIS Logo Asset Generator
 *
 * Generates all logo variants as standalone SVG files.
 * Uses the exact same proportion and colour engine as logo.tsx.
 *
 * Output:
 *   mark-{variant}-{size}.svg      — Gate Mark only
 *   lockup-{variant}-{size}.svg    — Mark + wordmark
 *   wordmark-{color}.svg           — Wordmark text only
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    ledgerXContained: 0, ledgerWContained: size,
    ledgerXTransparent: padH, ledgerWTransparent: markW,
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
  const ledgerX = c.transparent ? p.ledgerXTransparent : p.ledgerXContained;
  const ledgerW = c.transparent ? p.ledgerWTransparent : p.ledgerWContained;

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

function generateWordmark(color, fontSize) {
  const text = "AVRENTIS";
  const letterSpacing = fontSize * 0.15;
  const width = fontSize * 5.2; // approximate width
  const height = fontSize * 1.2;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="${fontSize}" font-family="'Hanken Grotesk', 'Inter', system-ui, sans-serif" font-weight="700" font-size="${fontSize}" letter-spacing="${letterSpacing}px" fill="${color}" dominant-baseline="auto">${text}</text>
</svg>`;
}

function generateLockup(size, variant) {
  const p = getProps(size);
  const c = VARIANTS[variant];
  const ledgerX = c.transparent ? p.ledgerXTransparent : p.ledgerXContained;
  const ledgerW = c.transparent ? p.ledgerWTransparent : p.ledgerWContained;

  const gap = Math.round(size * 0.25);
  const wordmarkFontSize = size * 0.46;
  const letterSpacing = wordmarkFontSize * 0.15;
  const wordmarkWidth = wordmarkFontSize * 5.2;
  const totalWidth = size + gap + wordmarkWidth;
  const wordmarkY = size / 2 + wordmarkFontSize * 0.35; // vertical centre

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

  // Wordmark
  svg += `  <text x="${size + gap}" y="${wordmarkY}" font-family="'Hanken Grotesk', 'Inter', system-ui, sans-serif" font-weight="700" font-size="${wordmarkFontSize}" letter-spacing="${letterSpacing}px" fill="${c.wordmark}">AVRENTIS</text>\n`;

  svg += `</svg>`;
  return svg;
}

// ── Generate all assets ─────────────────────────────────────────────────────

const SIZES = [48, 64, 128, 256, 512];
const variants = Object.keys(VARIANTS);
let count = 0;

// Marks at all sizes × all variants
for (const variant of variants) {
  for (const size of SIZES) {
    const svg = generateMark(size, variant);
    const filename = `mark-${variant}-${size}.svg`;
    writeFileSync(join(__dirname, filename), svg);
    count++;
  }
}

// Lockups at select sizes × all variants
const LOCKUP_SIZES = [48, 64, 128, 256];
for (const variant of variants) {
  for (const size of LOCKUP_SIZES) {
    const svg = generateLockup(size, variant);
    const filename = `lockup-${variant}-${size}.svg`;
    writeFileSync(join(__dirname, filename), svg);
    count++;
  }
}

// Standalone wordmarks
const WORDMARK_CONFIGS = [
  { color: "#ffffff", name: "white", fontSize: 24 },
  { color: "#0f172a", name: "navy", fontSize: 24 },
  { color: "#C68B2F", name: "gold", fontSize: 24 },
  { color: "#ffffff", name: "white-lg", fontSize: 48 },
  { color: "#0f172a", name: "navy-lg", fontSize: 48 },
  { color: "#C68B2F", name: "gold-lg", fontSize: 48 },
];

for (const { color, name, fontSize } of WORDMARK_CONFIGS) {
  const svg = generateWordmark(color, fontSize);
  const filename = `wordmark-${name}.svg`;
  writeFileSync(join(__dirname, filename), svg);
  count++;
}

console.log(`Generated ${count} SVG files in ${__dirname}`);
