#!/usr/bin/env node
// sandbox/source/main.js

import minimist from "minimist";
import fs from "fs";
import { main as libMain } from "../../src/lib/main.js";
import process from "process";

// Parse CLI arguments
const rawArgs = process.argv.slice(2);
const argv = minimist(rawArgs, {
  string: ["xmin", "xmax", "output"],
  default: { xmin: -10, xmax: 10, samples: 100 }
});

const [command, functionName] = argv._;

if (command === "plot") {
  if (!functionName) {
    console.error("Function name is required for plot subcommand.");
    process.exit(1);
  }

  const supported = ["quadratic", "sine"];
  if (!supported.includes(functionName)) {
    console.error(`Unsupported function: ${functionName}`);
    process.exit(1);
  }

  const xMin = Number(argv.xmin);
  const xMax = Number(argv.xmax);
  const samples = Number(argv.samples);
  const output = argv.output;

  // Generate data points
  const raw = [];
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
      const xSvg =
        ((p.x - xMin) / (xMax - xMin)) * (width - 2 * margin) + margin;
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

  if (output) {
    try {
      fs.writeFileSync(output, svg, "utf8");
      process.exit(0);
    } catch (err) {
      console.error(`Error writing file: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.log(svg);
  }
} else {
  libMain(rawArgs);
}
