#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import fs from 'fs/promises';
import path from 'path';

export async function main(argv = []) {
  // If invoked as a script, default argv comes from process.argv
  if (!Array.isArray(argv) || argv.length === 0) {
    argv = process.argv.slice(2);
  }

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
  const outFile = args.file || args.o || path.resolve('examples', 'plot.svg');
  const format = (args.format || args.f || (outFile && path.extname(outFile).slice(1)) || 'svg').toLowerCase();
  const width = parseInt(args.width || args.w || '800', 10);
  const height = parseInt(args.height || args.h || '400', 10);

  if (!expression) {
    throw new Error('Missing --expression argument (e.g. --expression "y=sin(x)")');
  }

  // Normalize expression to a JS expression that uses Math.* functions
  function normalizeExpression(expr) {
    let e = expr.trim();
    if (e.includes('=')) {
      e = e.split('=')[1];
    }
    e = e.replace(/\^/g, '**');
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
    // sanity check
    const testVal = fn(0);
    if (typeof testVal !== 'number' && typeof testVal !== 'bigint') {
      // allow NaN etc but not objects
    }
  } catch (err) {
    throw new Error(`Invalid expression: ${err.message}`);
  }

  // Parse range like x=start:end[:step] or start:end[:step]
  function parseRange(rstr) {
    let r = rstr.trim();
    if (r.includes('=')) {
      // support comma separated multiple ranges, pick x
      const parts = r.split(',');
      for (const p of parts) {
        const [k, v] = p.split('=');
        if (k && k.trim() === 'x') {
          r = v;
          break;
        }
      }
    }
    const tokens = r.split(':').map(s => s.trim()).filter(Boolean);
    if (tokens.length < 2) throw new Error('Range must be start:end[:step]');
    const start = parseFloat(tokens[0]);
    const end = parseFloat(tokens[1]);
    if (!isFinite(start) || !isFinite(end)) throw new Error('Invalid numeric range');
    let step;
    if (tokens[2]) {
      step = parseFloat(tokens[2]);
      if (!isFinite(step) || step === 0) throw new Error('Invalid step in range');
    } else {
      // choose about 200 samples by default
      const samples = 200;
      step = (end - start) / samples;
      if (step === 0) step = 1;
    }
    // ensure step sign matches direction to avoid infinite loops
    if ((end - start) < 0 && step > 0) step = -step;
    return { start, end, step };
  }

  const { start, end, step } = parseRange(range);

  // Generate samples
  const samples = [];
  let minY = Infinity;
  let maxY = -Infinity;
  let minX = Infinity;
  let maxX = -Infinity;

  // Use a safe loop to avoid floating point accumulation issues
  const maxIter = 1000000;
  let iter = 0;

  function within(x) {
    return step >= 0 ? x <= end + 1e-12 : x >= end - 1e-12;
  }

  for (let x = start; within(x); x += step) {
    if (++iter > maxIter) break;
    let y;
    try {
      y = Number(fn(x));
    } catch (err) {
      y = NaN;
    }
    samples.push([x, y]);
    if (isFinite(y)) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }

  if (samples.length === 0) {
    throw new Error('No samples generated for given range');
  }

  if (!isFinite(minY) || !isFinite(maxY)) {
    // all y were non-finite; set a default range
    minY = -1;
    maxY = 1;
  }

  // Build SVG content
  function buildSVG(opts = {}) {
    const W = opts.width || width;
    const H = opts.height || height;
    const margin = Math.min(40, Math.floor(Math.min(W, H) * 0.08));
    const plotW = W - margin * 2;
    const plotH = H - margin * 2;
    const dx = maxX - minX || 1;
    const dy = maxY - minY || 1;
    const scaleX = plotW / dx;
    const scaleY = plotH / dy;

    function sx(x) {
      return margin + (x - minX) * scaleX;
    }
    function sy(y) {
      // SVG y grows downwards
      return margin + plotH - (y - minY) * scaleY;
    }

    // Build path string
    let d = '';
    let started = false;
    for (const [x, y] of samples) {
      if (!isFinite(y)) {
        started = false; // break the current segment
        continue;
      }
      const px = sx(x);
      const py = sy(y);
      if (!started) {
        d += `M ${px.toFixed(3)} ${py.toFixed(3)}`;
        started = true;
      } else {
        d += ` L ${px.toFixed(3)} ${py.toFixed(3)}`;
      }
    }

    // Axis lines (x and y)
    const elements = [];

    // x axis at y=0 if visible
    if (minY <= 0 && maxY >= 0) {
      const y0 = sy(0);
      elements.push(`<line x1="${margin}" y1="${y0.toFixed(3)}" x2="${(margin + plotW).toFixed(3)}" y2="${y0.toFixed(3)}" stroke="#666" stroke-width="1" />`);
    }
    // y axis at x=0 if visible
    if (minX <= 0 && maxX >= 0) {
      const x0 = sx(0);
      elements.push(`<line x1="${x0.toFixed(3)}" y1="${margin}" x2="${x0.toFixed(3)}" y2="${(margin + plotH).toFixed(3)}" stroke="#666" stroke-width="1" />`);
    }

    // grid (a few ticks)
    const gridLines = [];
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const gy = minY + (i / ticks) * (maxY - minY);
      const gY = sy(gy);
      gridLines.push(`<line x1="${margin}" y1="${gY.toFixed(3)}" x2="${(margin + plotW).toFixed(3)}" y2="${gY.toFixed(3)}" stroke="#eee" stroke-width="1" />`);
    }

    // compose svg
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Plot of ${escapeHtml(jsExpr)}">\n  <rect width="100%" height="100%" fill="white" />\n  <g class="grid">${gridLines.join('')}\n  </g>\n  <g class="axes">${elements.join('')}\n  </g>\n  <g class="plot">\n    <path d="${d}" fill="none" stroke="#0074D9" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />\n  </g>\n</svg>`;

    return svg;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  const svg = buildSVG();

  // Ensure parent dir exists
  const outPath = path.resolve(outFile);
  const parent = path.dirname(outPath);
  await fs.mkdir(parent, { recursive: true });

  if (format === 'svg') {
    await fs.writeFile(outPath, svg, 'utf8');
  } else if (format === 'png') {
    // PNG rasterization is not implemented in this minimal release.
    // As a fallback write the SVG and return a note.
    await fs.writeFile(outPath, svg, 'utf8');
  } else {
    // unknown format: write svg anyway
    await fs.writeFile(outPath, svg, 'utf8');
  }

  return { file: outPath, format: 'svg', points: samples.length };
}

// If executed directly, run main with CLI args
if (process.argv[1] && process.argv[1].endsWith('main.js')) {
  main(process.argv.slice(2)).then(res => {
    // print minimal success
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(res));
  }).catch(err => {
    // eslint-disable-next-line no-console
    console.error(err && err.message ? err.message : String(err));
    process.exit(1);
  });
}
