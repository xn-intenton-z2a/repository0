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

function sanitizeExpression(expr) {
  // replace ^ with ** for power
  let s = String(expr).replace(/\^/g, "**");
  // disallow characters except numbers, operators, letters, parentheses, dot, comma, spaces, and _
  if (!/^[0-9a-zA-Z_\-+\/*%<>=!&|()\[\].,\s\*\^]+$/.test(s)) {
    throw new Error("Expression contains invalid characters");
  }
  return s;
}

export function buildEvaluator(expr) {
  if (!expr) return null;
  const cleaned = sanitizeExpression(expr);
  const prelude = `const { ${MATH_NAMES.join(",")} } = Math;`;
  const body = `${prelude}\nreturn (${cleaned});`;
  try {
    // create a function that accepts x and returns the evaluated expression
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", body);
    return (x) => {
      try {
        const v = fn(x);
        if (typeof v === 'number' && Number.isFinite(v)) return v;
        return NaN;
      } catch (e) {
        return NaN;
      }
    };
  } catch (e) {
    return null;
  }
}

export function parseRange(rangeStr) {
  if (!rangeStr) return { min: -10, max: 10 };
  // allow formats: "min:max" or "x=min:max" or "x=min:max,y=..."
  const part = rangeStr.split(",").find(p => p.includes("x=") || !p.includes("x=") );
  let r = rangeStr;
  const xMatch = rangeStr.match(/x=([^,]+)/);
  if (xMatch) r = xMatch[1];
  // if r contains :, split
  const [a, b] = r.split(":").map(s => Number(s));
  if (Number.isFinite(a) && Number.isFinite(b)) return { min: a, max: b };
  return { min: -10, max: 10 };
}

export function generateSeries(evaluator, rangeStr, points = 200) {
  const { min, max } = parseRange(rangeStr);
  const pts = Math.max(2, Math.floor(points) || 200);
  const out = [];
  const step = (max - min) / (pts - 1);
  for (let i = 0; i < pts; i++) {
    const x = min + step * i;
    let y = NaN;
    try {
      y = evaluator(x);
    } catch (e) {
      y = NaN;
    }
    out.push({ x, y: Number.isFinite(y) ? y : null });
  }
  return out;
}

function extent(values, accessor) {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    const n = accessor(v);
    if (n == null || Number.isNaN(n)) continue;
    if (n < min) min = n;
    if (n > max) max = n;
  }
  if (min === Infinity) return [0, 1];
  return [min, max];
}

export function generateSVG(points, opts = {}) {
  const width = opts.width || 800;
  const height = opts.height || 400;
  const stroke = opts.stroke || "#0074D9";
  const strokeWidth = opts.strokeWidth || 2;
  const bg = opts.bg || "#ffffff";

  const [minX, maxX] = extent(points, p => p.x);
  const [minY, maxY] = extent(points, p => p.y);
  // Add small padding
  const padX = (maxX - minX) * 0.05 || 1;
  const padY = (maxY - minY) * 0.1 || 1;
  const x0 = minX - padX;
  const x1 = maxX + padX;
  const y0 = minY - padY;
  const y1 = maxY + padY;

  const scaleX = (x) => ((x - x0) / (x1 - x0)) * width;
  const scaleY = (y) => height - ((y - y0) / (y1 - y0)) * height;

  // build path, skipping nulls
  let d = "";
  let started = false;
  for (const pt of points) {
    if (pt.y == null) {
      started = false;
      continue;
    }
    const sx = scaleX(pt.x);
    const sy = scaleY(pt.y);
    if (!started) {
      d += `M ${sx.toFixed(2)} ${sy.toFixed(2)}`;
      started = true;
    } else {
      d += ` L ${sx.toFixed(2)} ${sy.toFixed(2)}`;
    }
  }

  const viewBox = `0 0 ${width} ${height}`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">\n  <rect width="100%" height="100%" fill="${bg}"/>\n  <path d="${d}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round"/>\n</svg>`;
  return svg;
}

export function saveToFile(content, filename) {
  fs.writeFileSync(filename, content, "utf8");
}

export function helpText() {
  return (
    'plot-code-lib CLI\n\n' +
    'Usage:\n  plot --expression "sin(x)" --range "-3.14:3.14" --file out.svg\n\n' +
    'Options:\n  --expression, -e   Expression to plot, e.g., "sin(x)" or "y=sin(x)"\n' +
    '  --range, -r        Range for x as "min:max" (default -10:10)\n' +
    '  --points           Number of sample points (default 200)\n' +
    '  --file, -f         Output filename (defaults to stdout)\n'
  );
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || !args.expression) {
    console.log(helpText());
    return 0;
  }
  const expr = parseExpression(args.expression);
  if (!expr) {
    console.error('Invalid expression');
    return 2;
  }
  const evaluator = buildEvaluator(expr);
  if (!evaluator) {
    console.error('Failed to build evaluator for expression');
    return 3;
  }
  const points = generateSeries(evaluator, args.range, args.points || 200);
  const svg = generateSVG(points, { width: args.width, height: args.height, stroke: args.stroke, strokeWidth: args.strokeWidth, bg: args.bg });
  if (args.file) {
    saveToFile(svg, args.file);
    console.log('Wrote ' + args.file);
  } else {
    process.stdout.write(svg);
  }
  return 0;
}

if (process.argv[1] && process.argv[1].endsWith('main.js')) {
  // invoked directly
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
