#!/usr/bin/env node
// src/lib/main.js
/**
 * # Equation Plotter Library (SVG)
 *
 * A lightweight library for plotting mathematical equations in SVG format.
 *
 * ## Features
 * - Plotting of standard mathematical functions (linear, quadratic, trigonometric, exponential).
 * - Support for parametric and polar equations.
 * - Interactive features such as zooming, panning, and custom scaling.
 * - Customizable styling for axes, grid, and plotted curves.
 * - Export functionality for saving plots as SVG files.
 * - Integration with libraries like D3.js for advanced data visualization.
 *
 * ## Demo Usage
 * - Plotting a quadratic function: y = x^2.
 * - Plotting a sine function: y = sin(x) (with x in degrees).
 *
 * ## Future Development
 * - Extend support for 3D equation plotting.
 * - Introduce animation for dynamic visualizations.
 * - Provide an API for transforming and customizing user-defined functions.
 * - Offer a canvas fallback option for environments without SVG support.
 * - Optimize performance for large datasets.
 */

import { fileURLToPath } from "url";
import fs from "fs";

function plotQuadratic() {
  // Demo with a quadratic function: y = x^2
  const points = [];
  for (let x = -10; x <= 10; x++) {
    points.push({ x, y: x * x });
  }
  return points;
}

function plotSine() {
  // Demo with sine function: y = sin(x) (x in degrees)
  const points = [];
  for (let i = 0; i <= 360; i += 10) {
    const rad = i * (Math.PI / 180);
    points.push({ x: i, y: Math.sin(rad) });
  }
  return points;
}

function displayPlot(plotName, points) {
  console.log(`Plot for ${plotName}:`);
  console.log(points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(" "));
}

function generateSvg(quadraticPoints, sinePoints) {
  const width = 800;
  const height = 600;
  
  // Generate polyline for quadratic plot:
  // Map x from [-10, 10] to [50, 750] and y from [0,100] to [250, 50] (inverted y-axis)
  const quadPts = quadraticPoints.map(p => {
    const px = 50 + (p.x + 10) * ((750 - 50) / 20); // scale factor 35
    const py = 50 + (100 - p.y) * (200 / 100); // scale factor 2
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  }).join(" ");

  // Generate polyline for sine plot:
  // Map x from [0, 360] to [50, 750] and y from [-1, 1] to [550, 350] (inverted y-axis)
  const sinePts = sinePoints.map(p => {
    const px = 50 + p.x * ((750 - 50) / 360);
    const py = 350 + (1 - p.y) * (200 / 2); // scale factor 100
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  }).join(" ");

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
         `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n` +
         `  <rect width="100%" height="100%" fill="white" />\n` +
         `  <text x="${width / 2}" y="30" font-size="16" text-anchor="middle">Quadratic Plot: y = x²</text>\n` +
         `  <polyline points="${quadPts}" fill="none" stroke="blue" stroke-width="2" />\n\n` +
         `  <text x="${width / 2}" y="330" font-size="16" text-anchor="middle">Sine Plot: y = sin(x)</text>\n` +
         `  <polyline points="${sinePts}" fill="none" stroke="red" stroke-width="2" />\n` +
         `</svg>`;
}

// -----------------------------------------------------------------------------
// Run main if executed directly.
// -----------------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const quadratic = plotQuadratic();
  const sine = plotSine();
  const svgContent = generateSvg(quadratic, sine);

  // Write the SVG content to a file
  fs.writeFileSync("output.svg", svgContent, "utf8");
  console.log("SVG file generated: output.svg");
}
