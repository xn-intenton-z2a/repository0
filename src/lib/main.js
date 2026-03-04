#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import fs from "fs";

export function parseArgs(argv) {
  const out = {};
  const args = Array.isArray(argv) ? argv : process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--expression" || a === "-e") {
      out.expression = args[++i];
    } else if (a === "--range" || a === "-r") {
      out.range = args[++i];
    } else if (a === "--file" || a === "-f") {
      out.file = args[++i];
    } else if (a === "--format") {
      out.format = args[++i];
    } else if (a === "--points") {
      out.points = Number(args[++i]);
    } else if (a === "--width") {
      out.width = Number(args[++i]);
    } else if (a === "--height") {
      out.height = Number(args[++i]);
    } else if (a === "--bg") {
      out.bg = args[++i];
    } else if (a === "--stroke") {
      out.stroke = args[++i];
    } else if (a === "--fill") {
      out.fill = args[++i];
    } else if (a === "--stroke-width") {
      out.strokeWidth = Number(args[++i]);
    } else if (a === "--help" || a === "-h") {
      out.help = true;
    }
  }
  return out;
}

export function parseExpression(expr) {
  if (!expr) return null;
  expr = expr.trim();
  if (expr.includes("=")) expr = expr.split("=").slice(1).join("=").trim();
  return expr;
}

const MATH_NAMES = [
  "abs",
  "acos",
  "asin",
  "atan",
  "atan2",
  "ceil",
  "cos",
  "exp",
  "floor",
  "log",
  "max",
  "min",
  "pow",
  "round",
  "sin",
  "sqrt",
  "tan",
  "PI",
  "E",
  "sign"
];
export function buildEvaluator(expr) {
  if (!expr) return null;
  const safeExpr = expr;
  const prelude = `const { ${MATH_NAMES.join(",")} } = Math;`;
  const fnBody = prelude + `\nreturn (${safeExpr});`;
  try {
    return Function("x", fnBody);
  } catch (e) {
    throw new Error(`Invalid expression: ${e.message}`);
  }
}

export function parseRange(rangeStr, defaultPoints = 200) {
  // Accept formats: "x=start:stop[:points]" or "start:stop[:points]" or the third part as step
  if (!rangeStr) return { varName: "x", start: 0, stop: 1, points: defaultPoints, step: (1 / (defaultPoints - 1)) };
  let s = rangeStr.trim();
  let varName = "x";
  // If key=val style like x=0:1:0.25
  if (s.includes("=")) {
    const [maybeName, rest] = s.split("=").map((p) => p.trim());
    if (/^[a-zA-Z]+$/.test(maybeName)) varName = maybeName;
    s = rest;
  }
  // If leading like x:0:1
  if (/^[a-zA-Z]:/.test(s)) {
    varName = s[0];
    s = s.slice(2);
  }
  const parts = s.split(":").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return { varName: "x", start: 0, stop: 1, points: defaultPoints, step: (1 / (defaultPoints - 1)) };
  const start = Number(parts[0]);
  const stop = Number(parts[1]);
  let points = defaultPoints;
  let step = (stop - start) / Math.max(1, points - 1);
  if (parts.length >= 3) {
    const third = parts[2];
    const v = Number(third);
    if (third.includes('.') || (v > 0 && v < 1)) {
      // treat as step size
      step = v;
      points = Math.floor(Math.abs((stop - start) / step)) + 1;
    } else if (!Number.isNaN(v)) {
      // treat as number of points
      points = Math.max(2, Math.floor(v));
      step = (stop - start) / Math.max(1, points - 1);
    }
  }
  return { varName, start, stop, points, step };
}

export function generateTimeSeries(evaluator, range) {
  const pts = [];
  const { start, stop, points } = range;
  const n = Math.max(2, points || 200);
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = start + t * (stop - start);
    let y;
    try {
      y = evaluator(x);
      if (!isFinite(y) || y === null || y === undefined) y = NaN;
    } catch (e) {
      y = NaN;
    }
    pts.push({ x, y });
  }
  return pts;
}

export function bounds(points) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  if (minX === Infinity) minX = 0;
  if (maxX === -Infinity) maxX = 1;
  if (minY === Infinity) minY = 0;
  if (maxY === -Infinity) maxY = 1;
  if (minY === maxY) {
    minY -= 1;
    maxY += 1;
  }
  return { minX, maxX, minY, maxY };
}

export function renderSVG(points, opts = {}) {
  const width = opts.width || 800;
  const height = opts.height || 400;
  const bg = opts.bg || "white";
  const stroke = opts.stroke || "black";
  const fill = opts.fill || "none";
  const strokeWidth = opts.strokeWidth != null ? opts.strokeWidth : 2;
  const m = { left: 40, right: 20, top: 20, bottom: 40 };
  const innerW = width - m.left - m.right;
  const innerH = height - m.top - m.bottom;

  const b = bounds(points);
  const scaleX = (x) => m.left + ((x - b.minX) / (b.maxX - b.minX)) * innerW;
  const scaleY = (y) => m.top + innerH - ((y - b.minY) / (b.maxY - b.minY)) * innerH;

  const pathParts = [];
  for (const p of points) {
    if (!Number.isFinite(p.y)) {
      pathParts.push("M NaN NaN");
      continue;
    }
    const sx = scaleX(p.x);
    const sy = scaleY(p.y);
    if (pathParts.length === 0 || pathParts[pathParts.length - 1].startsWith("M NaN")) {
      pathParts.push(`M ${sx.toFixed(2)} ${sy.toFixed(2)}`);
    } else {
      pathParts.push(`L ${sx.toFixed(2)} ${sy.toFixed(2)}`);
    }
  }
  const path = pathParts.join(" ");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n` +
    `<rect width="100%" height="100%" fill="${bg}" />\n` +
    `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round" />\n` +
    `</svg>`;
  return svg;
}

export function saveFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || !args.expression) {
    const help = `Usage: plot-code-lib --expression "y=sin(x)" --range "-3.14:3.14" --file output.svg\n`;
    console.log(help);
    return 0;
  }
  const expr = parseExpression(args.expression);
  const range = parseRange(args.range, args.points || 200);
  const evaluator = buildEvaluator(expr);
  const series = generateTimeSeries(evaluator, range);
  const svg = renderSVG(series, { width: args.width, height: args.height, bg: args.bg, stroke: args.stroke, fill: args.fill, strokeWidth: args.strokeWidth });
  const outFile = args.file || `plot.${args.format || 'svg'}`;
  saveFile(outFile, svg);
  console.log(`Wrote ${outFile}`);
  return 0;
}

// If run as CLI
if (process.argv[1] && process.argv[1].endsWith('src/lib/main.js')) {
  // do not await to keep CLI simple
  main();
}

export const generateSVG = renderSVG;

export default { parseArgs, parseExpression, buildEvaluator, parseRange, generateTimeSeries, renderSVG, generateSVG, main };
