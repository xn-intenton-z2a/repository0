#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';

export async function main(argv = []) {
  // Simple CLI arg parser: --key value
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }

  const expression = args.expression || args.expr || args.e;
  const range = args.range || args.r || 'x=0:6.283:0.1';
  const outFile = args.file || args.o || null;
  const format = (args.format || args.f || (outFile && path.extname(outFile).slice(1)) || 'svg').toLowerCase();
  const width = parseInt(args.width || args.w || '800', 10);
  const height = parseInt(args.height || args.h || '400', 10);

  if (!expression) {
    throw new Error('Missing --expression argument (e.g. --expression "y=sin(x)")');
  }

  // Parse expression like "y=sin(x)" or "sin(x)" -> JS expression
  function normalizeExpression(expr) {
    let e = expr.trim();
    if (e.includes('=')) {
      e = e.split('=')[1];
    }
    // replace ^ with ** for power
    e = e.replace(/\^/g, '**');
    // add Math. to common functions
    const funcs = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'abs', 'log', 'exp', 'sqrt', 'min', 'max', 'pow', 'floor', 'ceil'];
    for (const f of funcs) {
      e = e.replace(new RegExp('\\b' + f + '\\s*\\(', 'g'), 'Math.' + f + '(');
    }
    return e;
  }

  const jsExpr = normalizeExpression(expression);
  let fn;
  try {
    // eslint-disable-next-line no-new-func
    fn = new Function('x', `return (${jsExpr});`);
    // quick sanity check
    fn(0);
  } catch (err) {
    throw new Error(`Invalid expression: ${err.message}`);
  }

  // parse range like x=start:end[:step]
  function parseRange(r) {
    const s = r.trim();
    if (!s.startsWith('x=')) {
      throw new Error('Range must start with "x="');
    }
    const part = s.slice(2);
    const bits = part.split(':').map((b) => b.trim()).filter(Boolean);
    if (bits.length < 2) throw new Error('Range must be x=start:end[:step]');
    const start = Number(bits[0]);
    const end = Number(bits[1]);
    let step = bits[2] ? Number(bits[2]) : (end - start) / 200;
    if (!isFinite(step) || step === 0) step = (end - start) / 200 || 1;
    return { start, end, step };
  }

  const { start, end, step } = parseRange(range);

  // generate samples
  const xs = [];
  const ys = [];
  for (let x = start; x <= end + 1e-12; x += step) {
    let y;
    try {
      y = Number(fn(x));
    } catch (err) {
      y = NaN;
    }
    if (!Number.isFinite(y)) {
      y = NaN;
    }
    xs.push(x);
    ys.push(y);
  }

  // compute y bounds
  let minY = Infinity;
  let maxY = -Infinity;
  for (const y of ys) {
    if (!Number.isNaN(y)) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (!isFinite(minY) || !isFinite(maxY)) {
    minY = -1;
    maxY = 1;
  }
  if (minY === maxY) {
    // degenerate case
    minY -= 1;
    maxY += 1;
  }

  // create SVG
  const margin = 40;
  const plotW = width - margin * 2;
  const plotH = height - margin * 2;

  function xToPx(x) {
    return margin + ((x - start) / (end - start)) * plotW;
  }
  function yToPx(y) {
    return margin + (1 - (y - minY) / (maxY - minY)) * plotH;
  }

  const points = [];
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];
    if (Number.isNaN(y)) continue;
    const px = Number(xToPx(x).toFixed(2));
    const py = Number(yToPx(y).toFixed(2));
    points.push(`${px},${py}`);
  }

  const pathD = points.length ? `M ${points.join(' L ')}` : '';

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n` +
    `<rect width="100%" height="100%" fill="white"/>\n` +
    `<!-- axes -->\n` +
    `<line x1="${margin}" y1="${height - margin}" x2="${width - margin}" y2="${height - margin}" stroke="#333" stroke-width="1"/>\n` +
    `<line x1="${margin}" y1="${margin}" x2="${margin}" y2="${height - margin}" stroke="#333" stroke-width="1"/>\n` +
    `<!-- path -->\n` +
    `<g fill="none" stroke="#1f77b4" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">\n` +
    `<path d="${pathD}"/>\n` +
    `</g>\n` +
    `</svg>\n`;

  // ensure output directory exists
  let out = outFile;
  if (!out) {
    // default to examples/plot.svg
    await fs.mkdir('examples', { recursive: true });
    out = path.resolve('examples', 'plot.svg');
  } else {
    const dir = path.dirname(out);
    await fs.mkdir(dir, { recursive: true });
    out = path.resolve(out);
  }

  if (format === 'svg') {
    await fs.writeFile(out, svg, 'utf8');
  } else {
    // For unknown formats, write SVG content but keep file extension as requested.
    await fs.writeFile(out, svg, 'utf8');
  }

  return { file: out, format, points: points.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // CLI invocation
  const args = process.argv.slice(2);
  main(args).then((r) => {
    console.log(`Wrote ${r.file} (${r.format}) with ${r.points} points`);
  }).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
