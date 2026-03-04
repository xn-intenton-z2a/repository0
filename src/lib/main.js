#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

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
    // create a function of x that evaluates the expression in a Math-prelude scope
    /* eslint-disable no-new-func */
    return Function("x", fnBody);
  } catch (e) {
    throw new Error(`Invalid expression: ${e.message}`);
  }
}

export function parseRange(rangeStr) {
  if (!rangeStr) return null;
  const parts = String(rangeStr).split(":");
  if (parts.length !== 2) throw new Error(`Range must be in format min:max, got '${rangeStr}'`);
  const min = Number(parts[0]);
  const max = Number(parts[1]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) throw new Error(`Range values must be numbers`);
  if (min === max) throw new Error("Range min and max must differ");
  return { min, max };
}

export function generateTimeSeries(expr, rangeStr, points = 200) {
  const parsed = parseExpression(expr);
  if (!parsed) throw new Error("No expression provided");
  const range = parseRange(rangeStr);
  if (!range) throw new Error("No range provided");
  const fn = buildEvaluator(parsed);
  const out = [];
  const step = (range.max - range.min) / (points - 1);
  for (let i = 0; i < points; i++) {
    const x = range.min + step * i;
    let y;
    try {
      y = fn(x);
      if (typeof y !== "number" || !Number.isFinite(y)) {
        y = NaN;
      }
    } catch (e) {
      y = NaN;
    }
    out.push({ x, y });
  }
  return out;
}

function niceNumber(v) {
  return Number.isFinite(v) ? +v.toFixed(6) : v;
}

export function generateSVG(points, options = {}) {
  const width = options.width || 800;
  const height = options.height || 400;
  const margin = 40;
  const bg = options.bg || "#ffffff";
  const stroke = options.stroke || "#1f77b4";
  const strokeWidth = options.strokeWidth || 2;
  if (!Array.isArray(points) || points.length === 0) {
    throw new Error("No points to plot");
  }
  const xs = points.map(p => p.x).filter(Number.isFinite);
  const ys = points.map(p => p.y).filter(Number.isFinite);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const xScale = v => {
    return margin + ((v - xMin) / (xMax - xMin)) * (width - margin * 2);
  };
  const yScale = v => {
    // flip y for SVG coordinate system
    return margin + (1 - (v - yMin) / (yMax - yMin)) * (height - margin * 2);
  };
  const pathParts = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (!Number.isFinite(p.y)) continue;
    const sx = xScale(p.x);
    const sy = yScale(p.y);
    pathParts.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(2)} ${sy.toFixed(2)}`);
  }
  const path = pathParts.join(' ');

  const xTicks = 5;
  const yTicks = 5;
  const xTickVals = Array.from({ length: xTicks }, (_, i) => xMin + (i / (xTicks - 1)) * (xMax - xMin));
  const yTickVals = Array.from({ length: yTicks }, (_, i) => yMin + (i / (yTicks - 1)) * (yMax - yMin));

  const svg = [];
  svg.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`);
  svg.push(`<rect width="100%" height="100%" fill="${bg}"/>`);

  // axes
  svg.push(`<g stroke="#333" stroke-width="1" fill="none">`);
  // x axis
  svg.push(`<line x1="${margin}" y1="${height - margin}" x2="${width - margin}" y2="${height - margin}"/>`);
  // y axis
  svg.push(`<line x1="${margin}" y1="${margin}" x2="${margin}" y2="${height - margin}"/>`);
  svg.push(`</g>`);

  // ticks and labels
  svg.push(`<g fill="#333" font-size="10">`);
  for (const v of xTickVals) {
    const tx = xScale(v);
    svg.push(`<line x1="${tx}" y1="${height - margin}" x2="${tx}" y2="${height - margin + 6}" stroke="#333"/>`);
    svg.push(`<text x="${tx}" y="${height - margin + 18}" text-anchor="middle">${niceNumber(v)}</text>`);
  }
  for (const v of yTickVals) {
    const ty = yScale(v);
    svg.push(`<line x1="${margin - 6}" y1="${ty}" x2="${margin}" y2="${ty}" stroke="#333"/>`);
    svg.push(`<text x="${margin - 10}" y="${ty + 4}" text-anchor="end">${niceNumber(v)}</text>`);
  }
  svg.push(`</g>`);

  // path
  svg.push(`<path d="${path}" stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`);

  svg.push(`</svg>`);
  return svg.join('\n');
}

export async function cli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || !args.expression || !args.range) {
    const help = [`Usage: plot --expression "y=sin(x)" --range "-6.28:6.28" --file output.svg`, `Options:`, `  --expression, -e   Expression to plot (e.g. "y=sin(x)")`, `  --range, -r        Range as min:max (e.g. "-1:1")`, `  --file, -f         Output file (defaults to stdout)`, `  --points           Number of sample points (default 200)`, `  --width            SVG width in pixels (default 800)`, `  --height           SVG height in pixels (default 400)`, `  --bg               Background color`, `  --stroke           Stroke color`, `  --stroke-width     Stroke width`].join('\n');
    // eslint-disable-next-line no-console
    console.log(help);
    return 0;
  }
  const pointsN = args.points || 200;
  const series = generateTimeSeries(args.expression, args.range, pointsN);
  const svg = generateSVG(series, { width: args.width, height: args.height, bg: args.bg, stroke: args.stroke, strokeWidth: args.strokeWidth });
  const outFile = args.file;
  if (outFile) {
    await fs.promises.mkdir(path.dirname(outFile), { recursive: true });
    await fs.promises.writeFile(outFile, svg, "utf8");
    // eslint-disable-next-line no-console
    console.log(`Wrote ${outFile}`);
    return 0;
  }
  // print to stdout
  // eslint-disable-next-line no-console
  console.log(svg);
  return 0;
}

if (process.argv[1] && process.argv[1].endsWith('main.js') && process.argv[0].includes('node')) {
  // invoked directly
  /* eslint-disable no-console */
  cli().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
