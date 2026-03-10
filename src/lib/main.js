#!/usr/bin/env node
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { writeFileSync } from "fs";
import zlib from "zlib";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name || "plot-code-lib";
export const version = pkg.version || "0.0.0";
export const description = pkg.description || "A small plotting library";

export function getIdentity() {
  return { name, version, description };
}

// Parse a simple expression like "y=sin(x)" and return a function f(x)
export function parseExpression(expression) {
  if (!expression || typeof expression !== "string") {
    throw new TypeError("expression must be a non-empty string");
  }
  const eq = expression.indexOf("=");
  const rhs = eq >= 0 ? expression.slice(eq + 1).trim() : expression.trim();
  if (!rhs) throw new Error("no expression provided");
  // Replace ^ with ** for exponentiation
  let expr = rhs.replace(/\^/g, "**");
  // Allow Math functions: sin, cos, tan, exp, log, sqrt, abs
  const funcs = ["sin", "cos", "tan", "exp", "log", "sqrt", "abs", "max", "min", "pow"];
  for (const f of funcs) {
    const re = new RegExp(`\\b${f}\\b`, "g");
    expr = expr.replace(re, `Math.${f}`);
  }
  // safe-ish function construction
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", `return (${expr});`);
    // test
    fn(0);
    return fn;
  } catch (e) {
    throw new Error(`failed to parse expression: ${e.message}`);
  }
}

export function parseRange(rangeStr) {
  // expected format: "x=min:max" or "min:max"
  if (!rangeStr) throw new TypeError("range required");
  const raw = rangeStr.trim();
  const part = raw.includes("=") ? raw.split("=")[1] : raw;
  const [a, b] = part.split(":").map((s) => parseFloat(s));
  if (Number.isFinite(a) && Number.isFinite(b)) return { min: a, max: b };
  throw new Error("invalid range");
}

export function generateSeries({ expression, range, points = 100 }) {
  const f = typeof expression === "function" ? expression : parseExpression(expression);
  const { min, max } = typeof range === "string" ? parseRange(range) : range || { min: 0, max: 1 };
  if (!Number.isFinite(min) || !Number.isFinite(max)) throw new Error("invalid range values");
  if (points <= 1) throw new Error("points must be > 1");
  const out = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const x = min + t * (max - min);
    let y;
    try {
      y = f(x);
      if (!Number.isFinite(y)) y = NaN;
    } catch (e) {
      y = NaN;
    }
    out.push({ x, y });
  }
  return out;
}

export function produceSVG(series, { width = 600, height = 300, stroke = "#0074d9", strokeWidth = 2, fill = "none" } = {}) {
  if (!Array.isArray(series)) throw new TypeError("series must be an array");
  const xs = series.map((p) => p.x);
  const ys = series.map((p) => p.y).filter((v) => Number.isFinite(v));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = ys.length ? Math.min(...ys) : -1;
  const maxY = ys.length ? Math.max(...ys) : 1;
  const pad = 10;
  const scaleX = (x) => {
    if (maxX === minX) return width / 2;
    return pad + ((x - minX) / (maxX - minX)) * (width - pad * 2);
  };
  const scaleY = (y) => {
    if (maxY === minY) return height / 2;
    // flip y axis
    return pad + (1 - (y - minY) / (maxY - minY)) * (height - pad * 2);
  };
  const points = series
    .map((p) => {
      if (!Number.isFinite(p.y)) return null;
      return `${scaleX(p.x)},${scaleY(p.y)}`;
    })
    .filter(Boolean);
  const pathD = points.length ? `M ${points.join(" L ")}` : "";
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${width}\" height=\"${height}\" viewBox=\"0 0 ${width} ${height}\">\n  <rect width=\"100%\" height=\"100%\" fill=\"#fff\"/>\n  <path d=\"${pathD}\" fill=\"${fill}\" stroke=\"${stroke}\" stroke-width=\"${strokeWidth}\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>\n</svg>`;
  return svg;
}

// minimal CRC32 implementation for PNG chunks
function crc32(buf) {
  const table = crc32.table || (crc32.table = makeTable());
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}
function makeTable() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
}

function writeChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const chunk = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(chunk), 0);
  return Buffer.concat([len, chunk, crc]);
}

export function producePNG(series, { width = 600, height = 300 } = {}) {
  // Render the series to a simple RGB bitmap: white background with black line
  // For simplicity produce a PNG that contains a rendering approximating the SVG path by plotting points
  const w = Math.max(1, Math.floor(width));
  const h = Math.max(1, Math.floor(height));
  // create empty RGB array
  const rgb = Buffer.alloc(w * h * 3, 0xff); // white background
  // plot points
  const xs = series.map((p) => p.x);
  const ys = series.map((p) => p.y).filter((v) => Number.isFinite(v));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = ys.length ? Math.min(...ys) : -1;
  const maxY = ys.length ? Math.max(...ys) : 1;
  const toPixel = (x, y) => {
    const px = Math.round(((x - minX) / (maxX - minX || 1)) * (w - 1));
    const py = Math.round((1 - (y - minY) / (maxY - minY || 1)) * (h - 1));
    return { px, py };
  };
  for (const p of series) {
    if (!Number.isFinite(p.y)) continue;
    const { px, py } = toPixel(p.x, p.y);
    const idx = (py * w + px) * 3;
    // black pixel
    rgb[idx] = 0x00;
    rgb[idx + 1] = 0x00;
    rgb[idx + 2] = 0x00;
  }
  // build scanlines with filter 0
  const scanlines = Buffer.alloc((1 + w * 3) * h);
  for (let y = 0; y < h; y++) {
    const rowStart = y * (1 + w * 3);
    scanlines[rowStart] = 0; // no filter
    const srcStart = y * w * 3;
    rgb.copy(scanlines, rowStart + 1, srcStart, srcStart + w * 3);
  }
  const compressed = zlib.deflateSync(scanlines);
  const parts = [];
  parts.push(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type truecolor
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  parts.push(writeChunk("IHDR", ihdr));
  // IDAT
  parts.push(writeChunk("IDAT", compressed));
  // IEND
  parts.push(writeChunk("IEND", Buffer.alloc(0)));
  return Buffer.concat(parts);
}

export function writeOutput({ svg, pngBuffer, file }) {
  if (!file) throw new Error("file required");
  if (file.endsWith(".svg")) writeFileSync(file, svg, "utf8");
  else if (file.endsWith(".png")) writeFileSync(file, pngBuffer);
  else writeFileSync(file, svg, "utf8");
}

export function main(argv) {
  const args = Array.isArray(argv) ? argv.slice() : process.argv.slice(2);
  if (args.includes("--version")) {
    console.log(version);
    return;
  }
  if (args.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  // parse flags
  let expression = null;
  let range = null;
  let points = 200;
  let file = null;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--expression") expression = args[++i];
    else if (a === "--range") range = args[++i];
    else if (a === "--points") points = parseInt(args[++i], 10) || points;
    else if (a === "--file") file = args[++i];
  }
  if (!expression) {
    console.log("No expression provided. Use --expression 'y=sin(x)'");
    console.log(`${name}@${version}`);
    return;
  }
  const series = generateSeries({ expression, range: range || "x=-1:1", points });
  const svg = produceSVG(series);
  const pngBuf = producePNG(series, { width: 800, height: 400 });
  if (file) {
    writeOutput({ svg, pngBuffer: pngBuf, file });
    console.log(`Wrote ${file}`);
  } else {
    console.log(svg);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
