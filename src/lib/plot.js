// SPDX-License-Identifier: MIT
// src/lib/plot.js

import fs from "fs/promises";
import { create, all } from "mathjs";

const math = create(all);

export function parseRange(rangeStr) {
  // Accept format: x=start:end[:count]
  // Example: x=-3.14:3.14:200 or x=0:6.283:100
  if (!rangeStr) return { start: -1, end: 1, count: 200 };
  const m = String(rangeStr).match(/x=([^:]+):([^:]+)(?::([^:]+))?/);
  if (!m) throw new Error("Invalid range format. Use x=start:end[:count]");
  const start = Number(m[1]);
  const end = Number(m[2]);
  const count = m[3] ? Number(m[3]) : 200;
  if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(count)) throw new Error("Range values must be numbers");
  if (count < 2) throw new Error("Range count must be at least 2");
  return { start, end, count };
}

export function prepareExpression(expr) {
  if (!expr) throw new Error("No expression provided");
  const cleaned = String(expr).trim();
  // allow "y=sin(x)" or "sin(x)"
  const rhs = cleaned.includes("=") ? cleaned.split("=").slice(1).join("=") : cleaned;
  return rhs;
}

export function generateSeries(expression, range) {
  const rhs = prepareExpression(expression);
  let node;
  try {
    node = math.parse(rhs);
  } catch (e) {
    throw new Error(`Failed to parse expression: ${e.message}`);
  }
  const code = node.compile();
  const { start, end, count } = range;
  const pts = [];
  const step = (end - start) / Math.max(1, count - 1);
  for (let i = 0; i < count; i++) {
    const x = start + step * i;
    let y;
    try {
      y = code.evaluate({ x });
      if (typeof y === "object" && y && typeof y.valueOf === "function") y = y.valueOf();
      if (!Number.isFinite(y)) y = NaN;
    } catch (e) {
      y = NaN;
    }
    pts.push({ x, y });
  }
  return pts;
}

function _map(val, inMin, inMax, outMin, outMax) {
  return outMin + ((val - inMin) * (outMax - outMin)) / (inMax - inMin || 1);
}

export function createSVG(points, opts = {}) {
  const width = Number(opts.width) || 800;
  const height = Number(opts.height) || 400;
  const padding = Number(opts.padding) || 40;

  const xs = points.map((p) => p.x).filter((v) => Number.isFinite(v));
  const ys = points.map((p) => p.y).filter((v) => Number.isFinite(v));
  const minX = xs.length ? Math.min(...xs) : 0;
  const maxX = xs.length ? Math.max(...xs) : 1;
  const minY = ys.length ? Math.min(...ys) : -1;
  const maxY = ys.length ? Math.max(...ys) : 1;

  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  // Build path: move/line only for finite y, break on NaN
  let pathParts = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (!Number.isFinite(p.y)) {
      // break segment
      pathParts.push(null);
      continue;
    }
    const px = padding + _map(p.x, minX, maxX, 0, innerW);
    const py = padding + _map(p.y, maxY, minY, 0, innerH); // invert y
    const cmd = pathParts.length === 0 || pathParts[pathParts.length - 1] === null ? `M ${px.toFixed(2)} ${py.toFixed(2)}` : `L ${px.toFixed(2)} ${py.toFixed(2)}`;
    pathParts.push(cmd);
  }

  const path = pathParts.filter((s) => s !== null).join(" ");

  // Axis lines
  const axisX = `M ${padding} ${height - padding} L ${width - padding} ${height - padding}`;
  const axisY = `M ${padding} ${padding} L ${padding} ${height - padding}`;

  // Ticks (simple)
  function ticksFor(min, max, n = 5) {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const v = min + ((max - min) * i) / n;
      out.push(v);
    }
    return out;
  }

  const xTicks = ticksFor(minX, maxX, 4).map((v) => {
    const x = padding + _map(v, minX, maxX, 0, innerW);
    return `<line x1="${x.toFixed(2)}" y1="${height - padding}" x2="${x.toFixed(2)}" y2="${height - padding + 6}" stroke="#333" />`;
  }).join("\n");

  const yTicks = ticksFor(minY, maxY, 4).map((v) => {
    const y = padding + _map(v, maxY, minY, 0, innerH);
    return `<line x1="${padding - 6}" y1="${y.toFixed(2)}" x2="${padding}" y2="${y.toFixed(2)}" stroke="#333" />`;
  }).join("\n");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n  <rect width="100%" height="100%" fill="white"/>\n  <g stroke="#666" stroke-width="1" fill="none">\n    <path d="${axisX}" stroke="#333"/>\n    <path d="${axisY}" stroke="#333"/>\n  </g>\n  <g stroke="#333" stroke-width="1" fill="none">\n    ${xTicks}\n    ${yTicks}\n  </g>\n  <g stroke="#0074D9" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round">\n    <path d="${path}" />\n  </g>\n</svg>`;

  return svg;
}

export async function plotFromArgs(args = {}) {
  const expression = args.expression || args.expr || args.e;
  if (!expression) throw new Error('Missing --expression. Example: --expression "y=sin(x)"');
  const rangeStr = args.range || args.r;
  const range = parseRange(rangeStr);
  const points = generateSeries(expression, range);
  const svg = createSVG(points, { width: args.width || 800, height: args.height || 400, padding: args.padding || 40 });

  const outFile = args.file || args.f;
  const format = (args.format || args.type || 'svg').toLowerCase();
  if (format !== 'svg') {
    throw new Error('Only SVG output is supported in this version. Use --format svg');
  }

  if (outFile) {
    await fs.writeFile(outFile, svg, 'utf8');
    return { file: outFile, svg };
  }

  // return svg string when no file specified
  return { svg };
}
