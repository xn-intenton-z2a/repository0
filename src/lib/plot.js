// SPDX-License-Identifier: MIT
// src/lib/plot.js

import fs from "fs/promises";
import { create, all } from "mathjs";

const math = create(all);

export function parseRange(rangeStr) {
  // Accept format: x=start:end[:count]
  // Example: x=-3.14:3.14:200 or x=0:6.283:100
  if (!rangeStr) return { start: -1, end: 1, count: 200 };
  const m = rangeStr.match(/x=([^:]+):([^:]+)(?::([^:]+))?/);
  if (!m) throw new Error("Invalid range format. Use x=start:end[:count]");
  const start = Number(m[1]);
  const end = Number(m[2]);
  const count = m[3] ? Number(m[3]) : 200;
  if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(count)) throw new Error("Range values must be numbers");
  return { start, end, count };
}

export function prepareExpression(expr) {
  if (!expr) throw new Error("No expression provided");
  const cleaned = expr.trim();
  // allow "y=sin(x)" or "sin(x)"
  const rhs = cleaned.includes("=") ? cleaned.split("=").slice(1).join("=") : cleaned;
  return rhs;
}

export function generateSeries(expression, range) {
  const rhs = prepareExpression(expression);
  const node = math.parse(rhs);
  const code = node.compile();
  const { start, end, count } = range;
  const pts = [];
  const step = (end - start) / Math.max(1, count - 1);
  for (let i = 0; i < count; i++) {
    const x = start + step * i;
    let y;
    try {
      y = code.evaluate({ x });
      if (!Number.isFinite(y)) y = NaN;
    } catch (e) {
      y = NaN;
    }
    pts.push({ x, y });
  }
  return pts;
}

export function createSVG(points, opts = {}) {
  const width = opts.width || 800;
  const height = opts.height || 400;
  const padding = opts.padding || 40;

  const xs = points.map((p) => p.x).filter((v) => Number.isFinite(v));
  const ys = points.map((p) => p.y).filter((v) => Number.isFinite(v));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const dx = maxX - minX || 1;
  const dy = maxY - minY || 1;

  const scaleX = (width - 2 * padding) / dx;
  const scaleY = (height - 2 * padding) / dy;

  const project = (p) => {
    const x = padding + (p.x - minX) * scaleX;
    const y = padding + (maxY - p.y) * scaleY; // invert y
    return { x, y };
  };

  const path = points
    .map((p, i) => {
      if (!Number.isFinite(p.y)) return null;
      const pt = project(p);
      return `${i === 0 ? "M" : "L"}${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
    })
    .filter(Boolean)
    .join(" ");

  const axisX = `M ${padding} ${height - padding} L ${width - padding} ${height - padding}`;
  const axisY = `M ${padding} ${padding} L ${padding} ${height - padding}`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n` +
    `<rect width="100%" height="100%" fill="white"/>\n` +
    `<g stroke="#888" stroke-width="1" fill="none">\n` +
    `<path d="${axisX}"/>\n` +
    `<path d="${axisY}"/>\n` +
    `</g>\n` +
    `<g stroke="black" stroke-width="2" fill="none">\n` +
    `<path d="${path}" />\n` +
    `</g>\n` +
    `</svg>`;

  return svg;
}

export async function plotFromArgs(args) {
  const expr = args.expression || args.expr || args.e;
  const rangeStr = args.range || "x=-1:1:200";
  const file = args.file || null;
  const format = (args.format || "svg").toLowerCase();
  const points = args.points ? Number(args.points) : undefined;

  if (!expr) throw new Error("--expression is required, e.g. --expression 'y=sin(x)'");

  const range = parseRange(rangeStr);
  if (points && Number.isFinite(points)) range.count = points;

  const series = generateSeries(expr, range);
  const svg = createSVG(series);

  if (!file) {
    // print to stdout
    console.log(svg);
    return svg;
  }

  if (format === "svg") {
    await fs.mkdir(new URL("../../examples/", import.meta.url).pathname, { recursive: true }).catch(()=>{});
    await fs.writeFile(file, svg, "utf8");
    return file;
  }

  throw new Error("Only SVG output is supported in this runtime (format png not implemented)");
}
