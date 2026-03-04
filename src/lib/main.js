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
  // allow forms like "y=sin(x)" or just "sin(x)"
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

export function parseRange(rangeStr) {
  // support forms like "x=-1:1" or "-1:1" or similar
  if (!rangeStr) return { xMin: -10, xMax: 10 };
  const s = rangeStr.trim();
  const raw = s.includes("=") ? s.split("=")[1] : s;
  const parts = raw.split(":");
  if (parts.length !== 2) return { xMin: -10, xMax: 10 };
  const a = Number(parts[0]);
  const b = Number(parts[1]);
  if (Number.isFinite(a) && Number.isFinite(b)) return { xMin: a, xMax: b };
  return { xMin: -10, xMax: 10 };
}

export function generateTimeSeries(evaluator, range = { xMin: -10, xMax: 10 }, points = 200) {
  if (typeof evaluator !== "function") throw new Error("Evaluator must be a function");
  const { xMin, xMax } = range;
  const pts = Math.max(2, Number(points) || 200);
  const res = [];
  for (let i = 0; i < pts; i++) {
    const t = i / (pts - 1);
    const x = xMin + t * (xMax - xMin);
    let y;
    try {
      const v = evaluator(x);
      y = typeof v === "number" && Number.isFinite(v) ? v : NaN;
    } catch (e) {
      y = NaN;
    }
    res.push({ x, y });
  }
  return res;
}

export function extents(points) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  if (minX === Infinity) return null;
  return { minX, maxX, minY, maxY };
}

export function generateSVG(points, opts = {}) {
  const width = opts.width || 800;
  const height = opts.height || 600;
  const bg = opts.bg || "white";
  const stroke = opts.stroke || "black";
  const strokeWidth = opts.strokeWidth || 2;
  const fill = opts.fill || "none";

  const ext = extents(points) || { minX: 0, maxX: 1, minY: -1, maxY: 1 };
  // add small padding
  const padX = (ext.maxX - ext.minX) * 0.05 || 1;
  const padY = (ext.maxY - ext.minY) * 0.05 || 1;
  const minX = ext.minX - padX;
  const maxX = ext.maxX + padX;
  const minY = ext.minY - padY;
  const maxY = ext.maxY + padY;

  const scaleX = (x) => ((x - minX) / (maxX - minX)) * width;
  const scaleY = (y) => height - ((y - minY) / (maxY - minY)) * height;

  const pathPoints = points
    .map((p) => (Number.isFinite(p.y) ? `${scaleX(p.x)},${scaleY(p.y)}` : null))
    .filter(Boolean);

  const d = pathPoints.length ? `M ${pathPoints.join(" L ")}` : "";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${width}\" height=\"${height}\" viewBox=\"0 0 ${width} ${height}\">\n  <rect width=\"100%\" height=\"100%\" fill=\"${bg}\"/>\n  <path d=\"${d}\" fill=\"${fill}\" stroke=\"${stroke}\" stroke-width=\"${strokeWidth}\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>\n</svg>\n`;
  return svg;
}

export function saveFile(path, content) {
  fs.writeFileSync(path, content, "utf8");
}

export function helpText() {
  return `plot-code-lib\n\nUsage:\n  --expression, -e   Expression to plot, e.g. "y=sin(x)" or "sin(x)"\n  --range, -r        x range as min:max (default -10:10)\n  --file, -f         Output file path (default: examples/output.svg)\n  --format           svg (default) or png (png requires external tool)\n  --points           Number of points to sample (default 200)\n  --width            Width in pixels (default 800)\n  --height           Height in pixels (default 600)\n  --bg               Background color (default white)\n  --stroke           Stroke color (default black)\n  --fill             Fill color for path (default none)\n  --stroke-width     Stroke width (default 2)\n`;
}

export async function runCLI(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log(helpText());
    return 0;
  }
  const exprRaw = parseExpression(args.expression || "");
  if (!exprRaw) {
    console.error("No expression provided. Use --expression \"y=sin(x)\"");
    console.log(helpText());
    return 1;
  }
  let evaluator;
  try {
    evaluator = buildEvaluator(exprRaw);
  } catch (e) {
    console.error("Failed to build evaluator:", e.message);
    return 2;
  }
  const range = parseRange(args.range);
  const pts = generateTimeSeries(evaluator, range, args.points || 200);
  const svg = generateSVG(pts, {
    width: args.width || 800,
    height: args.height || 600,
    bg: args.bg,
    stroke: args.stroke,
    fill: args.fill,
    strokeWidth: args.strokeWidth
  });
  const outFile = args.file || "examples/output.svg";
  try {
    // ensure directory
    const dir = outFile.includes('/') ? outFile.replace(/\/[^/]*$/, '') : '.';
    if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    saveFile(outFile, svg);
    console.log(`Wrote ${outFile}`);
    return 0;
  } catch (e) {
    console.error("Failed to write output:", e.message);
    return 3;
  }
}

// allow running as a script
if (process.argv[1] && process.argv[1].endsWith("main.js") && !process.env.JEST_WORKER_ID) {
  // top-level invocation
  runCLI().then((code) => process.exit(code));
}
