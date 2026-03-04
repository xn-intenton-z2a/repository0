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
    // parts[2] can be step or points if prefixed with 'p'
    if (parts[2].startsWith("p")) {
      points = Number(parts[2].slice(1)) || defaultPoints;
      step = (stop - start) / Math.max(points - 1, 1);
    } else {
      step = Number(parts[2]);
      points = Math.max(Math.ceil((stop - start) / step) + 1, 2);
    }
  } else {
    points = defaultPoints;
    step = (stop - start) / Math.max(points - 1, 1);
  }
  return { varName, start, stop, step, points };
}

export function generateTimeSeries(evaluator, rangeObj) {
  const pts = [];
  for (let i = 0; i < rangeObj.points; i++) {
    const x = rangeObj.start + i * rangeObj.step;
    let y;
    try {
      y = evaluator(x);
      if (!Number.isFinite(y)) y = NaN;
    } catch (err) {
      y = NaN;
    }
    pts.push({ x, y });
  }
  return pts;
}

export function generateSVG(points, opts = {}) {
  const width = opts.width || 800;
  const height = opts.height || 400;
  const bg = opts.bg || "transparent";
  const stroke = opts.stroke || "black";
  const fill = opts.fill || "none";
  const strokeWidth = opts.strokeWidth != null ? opts.strokeWidth : 2;

  // compute bounds
  const xs = points.map((p) => p.x).filter((v) => Number.isFinite(v));
  const ys = points.map((p) => p.y).filter((v) => Number.isFinite(v));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const dx = maxX - minX || 1;
  const dy = maxY - minY || 1;

  function sx(x) {
    return ((x - minX) / dx) * width;
  }
  function sy(y) {
    return height - ((y - minY) / dy) * height;
  }

  const path = points
    .map((p, i) => {
      if (!Number.isFinite(p.y)) return null;
      const cmd = i === 0 ? "M" : "L";
      return `${cmd}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`;
    })
    .filter(Boolean)
    .join(" ");

  const svg = `<?xml version="1.0" encoding="utf-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n` +
    (bg && bg !== 'transparent' ? `<rect width="100%" height="100%" fill="${bg}"/>\n` : '') +
    `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round"/>\n` +
    `</svg>`;
  return svg;
}

export async function generatePNG(svg, opts = {}) {
  // use sharp to convert svg to png buffer; require dynamically so tests don't fail when sharp isn't installed
  const width = opts.width || 800;
  const height = opts.height || 400;
  let sharp;
  try {
    sharp = await import('sharp');
  } catch (err) {
    throw new Error('sharp is not available; install sharp to generate PNGs');
  }
  try {
    const buf = await sharp.default(Buffer.from(svg)).png().toBuffer();
    return buf;
  } catch (err) {
    throw new Error(`PNG generation failed: ${err.message}`);
  }
}

export function usage() {
  return `Usage: node main.js --expression "y=sin(x)" --range "x=-3.14:3.14:p200" --file out.svg --format svg|png --width 800 --height 400 --bg white --stroke black --fill none --stroke-width 2`;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || !args.expression) {
    console.log(usage());
    return 0;
  }
  const expr = parseExpression(args.expression);
  if (!expr) throw new Error('No expression provided');
  const evaluator = buildEvaluator(expr);
  const range = parseRange(args.range, args.points || 200);
  const pts = generateTimeSeries(evaluator, range);

  const opts = {
    width: args.width || 800,
    height: args.height || 400,
    bg: args.bg,
    stroke: args.stroke,
    fill: args.fill,
    strokeWidth: args.strokeWidth
  };

  const svg = generateSVG(pts, opts);

  const outFile = args.file || (args.format === 'png' ? 'out.png' : 'out.svg');
  const format = (args.format || path.extname(outFile).slice(1) || 'svg').toLowerCase();

  if (format === 'svg') {
    fs.writeFileSync(outFile, svg, 'utf8');
    console.log(`Wrote ${outFile}`);
    return 0;
  } else if (format === 'png') {
    const buf = await generatePNG(svg, opts);
    fs.writeFileSync(outFile, buf);
    console.log(`Wrote ${outFile}`);
    return 0;
  } else {
    throw new Error(`Unsupported format: ${format}`);
  }
}

// If run directly
if (process.argv[1].endsWith(path.basename(fileURLToPath(import.meta.url)))) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
