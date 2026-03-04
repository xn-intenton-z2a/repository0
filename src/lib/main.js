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
    // new Function creates a function with parameter x
    return Function("x", fnBody);
  } catch (e) {
    throw new Error(`Invalid expression: ${e.message}`);
  }
}

export function parseRange(rangeStr, defaultPoints = 200) {
  // Accepts forms like "x=-1:1" or "x=-1:1,points=300" or just "-1:1"
  if (!rangeStr) return { x: { min: -1, max: 1, points: defaultPoints } };
  let r = rangeStr.trim();
  const out = {};
  // allow shorthand "-1:1"
  if (!r.includes("=") && r.includes(":")) {
    const [a, b] = r.split(":").map(Number);
    out.x = { min: a, max: b, points: defaultPoints };
    return out;
  }
  // split by commas for multiple key=.. fragments
  const parts = r.split(",").map(s => s.trim());
  for (const p of parts) {
    if (p.startsWith("x=")) {
      const val = p.slice(2);
      const [a, b] = val.split(":").map(Number);
      out.x = { min: a, max: b, points: defaultPoints };
    } else if (p.startsWith("points=")) {
      const pts = Number(p.slice(7));
      if (!out.x) out.x = { min: -1, max: 1, points: pts || defaultPoints };
      else out.x.points = pts || out.x.points;
    }
  }
  if (!out.x) out.x = { min: -1, max: 1, points: defaultPoints };
  return out;
}

export function generateSeries(evaluator, xRange, points = 200) {
  const series = [];
  const { min, max } = xRange;
  const n = Math.max(2, Math.floor(points));
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = min + t * (max - min);
    let y;
    try {
      y = evaluator(x);
      if (!Number.isFinite(y)) y = NaN;
    } catch (e) {
      y = NaN;
    }
    series.push({ x, y });
  }
  return series;
}

function niceExtent(values) {
  const finite = values.filter(Number.isFinite);
  if (finite.length === 0) return { min: -1, max: 1 };
  let min = Math.min(...finite);
  let max = Math.max(...finite);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  return { min, max };
}

export function renderSVG(series, width = 800, height = 400, opts = {}) {
  const xs = series.map(p => p.x);
  const ys = series.map(p => p.y);
  const xExt = niceExtent(xs);
  const yExt = niceExtent(ys);
  const pad = 20;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  function sx(x) {
    return pad + ((x - xExt.min) / (xExt.max - xExt.min)) * innerW;
  }
  function sy(y) {
    // invert y for SVG coordinates
    return pad + innerH - ((y - yExt.min) / (yExt.max - yExt.min)) * innerH;
  }

  const points = series
    .map(p => (Number.isFinite(p.y) ? `${sx(p.x)},${sy(p.y)}` : null))
    .filter(Boolean)
    .join(" ");

  const bg = opts.bg || "#ffffff";
  const stroke = opts.stroke || "#0000ff";
  const strokeWidth = opts.strokeWidth != null ? opts.strokeWidth : 2;
  const fill = opts.fill || "none";

  const svg = [];
  svg.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  svg.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Plot">`
  );
  svg.push(`<rect width="100%" height="100%" fill="${bg}"/>`);
  svg.push(
    `<polyline fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" points="${points}" stroke-linejoin="round" stroke-linecap="round"/>`
  );
  // axes
  svg.push(
    `<line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="#333" stroke-width="1"/>`
  );
  svg.push(
    `<line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="#333" stroke-width="1"/>`
  );
  svg.push(`</svg>`);
  return svg.join("\n");
}

export function saveFile(path, content) {
  fs.writeFileSync(path, content, "utf8");
}

export function usage() {
  return `plot-code-lib

Usage:
  --expression, -e   expression, e.g. "y=sin(x)" or "sin(x)"
  --range, -r        x range, e.g. "x=-1:1" or "-1:1"
  --points           number of points (default 200)
  --file, -f         output file path (defaults to stdout)
  --width            output width (px)
  --height           output height (px)
  --bg               background color
  --stroke           stroke color
  --stroke-width     stroke width
  --help, -h         show help
`;
}

export async function main(argv = null) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log(usage());
    return 0;
  }
  const expr = parseExpression(args.expression || process.env.EXPRESSION);
  if (!expr) {
    console.error("No expression provided. Use --expression \"y=sin(x)\" or -e 'sin(x)'");
    console.log(usage());
    return 1;
  }
  const evaluator = buildEvaluator(expr);
  const range = parseRange(args.range || "-1:1", args.points || 200);
  const points = args.points || (range.x && range.x.points) || 200;
  const series = generateSeries(evaluator, range.x, points);
  const width = args.width || 800;
  const height = args.height || 400;
  const svg = renderSVG(series, width, height, {
    bg: args.bg,
    stroke: args.stroke,
    strokeWidth: args.strokeWidth,
    fill: args.fill
  });
  if (args.file) {
    saveFile(args.file, svg);
    console.log(`Wrote ${args.file}`);
    return 0;
  }
  // print to stdout
  console.log(svg);
  return 0;
}

if (process.argv[1] && process.argv[1].endsWith('main.js') && process.argv.includes('--run')) {
  // allow running as script: node src/lib/main.js --run --expression "sin(x)"
  main().catch(err => {
    console.error(err);
    process.exit(2);
  });
}
