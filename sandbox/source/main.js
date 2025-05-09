#!/usr/bin/env node
// sandbox/source/main.js

import dotenv from "dotenv";
import minimist from "minimist";
import { z } from "zod";
import { fileURLToPath } from "url";
import fs from "fs";
import pkg from "../../package.json" assert { type: "json" };

dotenv.config();

/**
 * Generate an SVG plot for a given function type.
 * @param {string} type - 'quadratic' or 'sine'.
 * @param {number} [width=500] - SVG width in pixels.
 * @param {number} [height=300] - SVG height in pixels.
 * @returns {string} - SVG string.
 */
export function plotFunction(type, width = 500, height = 300) {
  const from = -10;
  const to = 10;
  const step = 1;
  let points = [];
  let minY, maxY;

  if (type === "quadratic") {
    minY = from * from;
    maxY = to * to;
    for (let x = from; x <= to; x += step) {
      const y = x * x;
      points.push({ x, y });
    }
  } else if (type === "sine") {
    minY = -1;
    maxY = 1;
    for (let x = from; x <= to; x += step) {
      const y = Math.sin(x);
      points.push({ x, y });
    }
  } else {
    throw new Error(`Invalid function type: ${type}`);
  }

  const svgPoints = points
    .map(({ x, y }) => {
      const svgX = ((x - from) / (to - from)) * width;
      const svgY = height - ((y - minY) / (maxY - minY)) * height;
      return `${svgX},${svgY}`;
    })
    .join(" ");

  const svg =
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
    `<polyline points="${svgPoints}" fill="none" stroke="black"/>` +
    `</svg>`;
  return svg;
}

/**
 * Main entry point: handles conversion rate or SVG plotting.
 * @param {string[]} inputArgs
 */
export function main(inputArgs = process.argv.slice(2)) {
  const argv = minimist(inputArgs, {
    alias: {
      "conversion-rate": "conversionRate",
      f: "function",
      o: "output"
    },
    string: ["conversion-rate", "function", "output"]
  });

  // Handle SVG plotting if function flag is provided
  if (argv.function !== undefined) {
    const type = argv.function;
    if (type !== "quadratic" && type !== "sine") {
      console.error(
        `Invalid function type: ${type}. Supported values: quadratic, sine.`
      );
      process.exit(1);
    }
    const outputFile = argv.output || `${type}.svg`;
    const svg = plotFunction(type, 500, 300);
    fs.writeFileSync(outputFile, svg);
    console.log(`SVG written to ${outputFile}`);
    return;
  }

  // Conversion rate logic
  const defaultRate =
    typeof pkg.config?.issueToCodeConversionRate === "number"
      ? pkg.config.issueToCodeConversionRate
      : 0.5;

  let rateValue;
  if (argv["conversion-rate"] !== undefined) {
    rateValue = parseFloat(argv["conversion-rate"]);
  } else if (process.env.ISSUE_TO_CODE_CONVERSION_RATE !== undefined) {
    rateValue = parseFloat(process.env.ISSUE_TO_CODE_CONVERSION_RATE);
  } else {
    rateValue = defaultRate;
  }

  const rateSchema = z.number().min(0).max(1);
  try {
    rateSchema.parse(rateValue);
  } catch (err) {
    console.error(
      `Invalid conversion rate: ${rateValue}. Must be a number between 0 and 1.`
    );
    throw new Error(
      `Invalid conversion rate: ${rateValue}. Must be a number between 0 and 1.`
    );
  }

  console.log(`Effective conversion rate: ${rateValue}`);
  return { args: inputArgs, conversionRate: rateValue };
}

// Invoke if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
