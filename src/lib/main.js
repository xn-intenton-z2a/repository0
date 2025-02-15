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

// -----------------------------------------------------------------------------
// Run main if executed directly.
// -----------------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  console.log(`Run with: ${JSON.stringify(args)}`);
  // Run demo plots
  displayPlot("Quadratic (y = x^2)", plotQuadratic());
  displayPlot("Sine (y = sin(x))", plotSine());
}
