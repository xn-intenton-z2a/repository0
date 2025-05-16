#!/usr/bin/env node
// sandbox/source/main.js

import { main as libMain } from "../../src/lib/main.js";
import process from "process";

// Execute CLI with arguments
default: no lint warnings
const args = process.argv.slice(2);

if (args[0] === "plot") {
  const functionName = args[1];
  const supported = ["quadratic", "sine"];
  if (!supported.includes(functionName)) {
    console.error(`Unsupported function: ${functionName}`);
    process.exit(1);
  }

  // Generate data points
  const raw = [];
  const samples = 100;
  const xMin = -10;
  const xMax = 10;
  for (let i = 0; i <= samples; i++) {
    const x = xMin + (i * (xMax - xMin)) / samples;
    let y;
    if (functionName === "quadratic") {
      y = x * x;
    } else {
      y = Math.sin(x);
    }
    raw.push({ x, y });
  }

  // Determine y range
  const yValues = raw.map((p) => p.y);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  // SVG parameters
  const width = 400;
  const height = 200;
  const margin = 20;

  // Map points to SVG coordinates
  const svgPoints = raw
    .map((p) => {
      const xSvg = ((p.x - xMin) / (xMax - xMin)) * (width - 2 * margin) + margin;
      const ySvg =
        height -
        margin -
        ((p.y - yMin) / (yMax - yMin || 1)) * (height - 2 * margin);
      return `${xSvg},${ySvg}`;
    })
    .join(" ");

  // Build SVG markup
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<polyline id="${functionName}" fill="none" stroke="black" points="${svgPoints}" />` +
    `</svg>`;

  console.log(svg);
} else {
  libMain(args);
}
