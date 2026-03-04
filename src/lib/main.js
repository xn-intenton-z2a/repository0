#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

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
  const safeExpr = expr;
  const prelude = "const { " + MATH_NAMES.join(",") + " } = Math;";
  const fnBody = prelude + "return (" + safeExpr + ");";
  return Function("x", fnBody);
}

export function parseRange(rangeStr, defaultPoints = 200) {
  if (!rangeStr)
    return { varName: "x", start: 0, stop: 1, step: 1 / defaultPoints, points: defaultPoints };
  let varName = "x";
  let body = rangeStr;
  if (rangeStr.includes("=")) {
    [varName, body] = rangeStr.split("=").map((s) => s.trim());
  }
  const parts = body.split(":").map((s) => s.trim()).filter(Boolean);
  const start = Number(parts[0] || 0);
  const stop = Number(parts[1] ?? (start + 1));
  let points = defaultPoints;
  let step;
  if (parts[2]) {
    step = Number(parts[2]);
    points = Math.max(2, Math.ceil((stop - start) / step) + 1);
  } else {
    step = (stop - start) / (points - 1);
  }
  return { varName, start, stop, step, points };
}

export function generateTimeSeries(expr, rangeSpec, points = 200) {
  const expression = parseExpression(expr);
  const range = typeof rangeSpec === "string" ? parseRange(rangeSpec, points) : rangeSpec;
  const fn = buildEvaluator(expression);
  const out = [];
  for (let i = 0; i < range.points; i++) {
    const x = range.start + i * range.step;
    let y;
    try {
      y = fn(x);
    } catch (e) {
      y = NaN;
    }
    if (typeof y !== "number" || !Number.isFinite(y)) continue;
    out.push({ x, y });
  }
  return out;
}

export function generateSVG(points, opts = { width: 800, height: 400, stroke: "#007acc", fill: "none", strokeWidth: 2 }) {
  if (!points || points.length === 0) return "<svg/>";
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = opts.width,
    height = opts.height,
    pad = 20;
  const scaleX = (x) => pad + ((x - minX) / (maxX - minX || 1)) * (width - 2 * pad);
  const scaleY = (y) => pad + (1 - (y - minY) / (maxY - minY || 1)) * (height - 2 * pad);
  const path = points
    .map((p, i) => (i === 0 ? `M ${scaleX(p.x)} ${scaleY(p.y)}` : `L ${scaleX(p.x)} ${scaleY(p.y)}`))
    .join(" ");
  const svg = `<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n  <rect width="100%" height="100%" fill="${opts.bg || "white"}"/>\n  <path d="${path}" fill="${opts.fill}" stroke="${opts.stroke}" stroke-width="${opts.strokeWidth}" stroke-linejoin="round" stroke-linecap="round"/>\n</svg>\n`;
  return svg;
}

export function main(args) {
  const parsed = parseArgs(args);
  if (!parsed || parsed.help || (!parsed.expression && !parsed.file)) {
    console.log('Usage: --expression "<expr>" --range "x=0:6.283" --file output.svg --points 200');
    return;
  }
  const points = generateTimeSeries(parsed.expression, parsed.range, parsed.points || 200);
  const svg = generateSVG(points);
  if (parsed.file) {
    const outPath = path.resolve(parsed.file);
    fs.writeFileSync(outPath, svg, "utf8");
    console.log(`Wrote ${outPath}`);
  } else {
    console.log(svg);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
