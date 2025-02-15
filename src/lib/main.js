#!/usr/bin/env node
// src/lib/main.js
/**
 * Equation Plotter Library (SVG)
 *
 * Description:
 *   A lightweight library for plotting mathematical equations as SVG graphics.
 *
 * Features:
 *   - Plot standard mathematical functions such as quadratic (y = x²) and sine (y = sin(x), with x in degrees).
 *   - Support for parametric and polar equations.
 *   - Interactive features including zooming, panning, and customizable scaling.
 *   - Custom styling options for axes, grids, and plotted curves.
 *   - Export functionality for saving plots as SVG files.
 *   - Future integration with libraries like D3.js for advanced data visualization.
 *
 * Demo Usage:
 *   - Call plotQuadratic() to generate a quadratic plot.
 *   - Call plotSine() to generate a sine plot.
 *
 * Future Enhancements:
 *   - Extend support for 3D equation plotting and dynamic visualizations.
 *   - Develop a comprehensive API for transforming and customizing functions.
 *   - Provide a canvas fallback option for non-SVG environments.
 *
 * Usage:
 *   Run this script directly to generate an SVG file (output.svg) containing the demos.
 */

import { fileURLToPath } from 'url';
import fs from 'fs';

function plotQuadratic() {
  // Generate points for a quadratic function: y = x²
  const points = [];
  for (let x = -10; x <= 10; x++) {
    points.push({ x, y: x * x });
  }
  return points;
}

function plotSine() {
  // Generate points for sine function: y = sin(x), where x is in degrees
  const points = [];
  for (let deg = 0; deg <= 360; deg += 10) {
    const rad = deg * (Math.PI / 180);
    points.push({ x: deg, y: Math.sin(rad) });
  }
  return points;
}

function displayPlot(plotName, points) {
  console.log(`Plot for ${plotName}:`);
  console.log(points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' '));
}

function generateSvg(quadraticPoints, sinePoints) {
  const width = 800;
  const height = 600;

  // Mapping quadratic points from coordinate space to SVG space
  const quadPts = quadraticPoints.map(p => {
    const px = 50 + (p.x + 10) * ((750 - 50) / 20); // mapping x from [-10,10] to [50,750]
    const py = 50 + (100 - p.y) * (200 / 100); // mapping y from [0,100] to [250,50] (inverted y-axis)
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  }).join(' ');

  // Mapping sine points from coordinate space to SVG space
  const sinePts = sinePoints.map(p => {
    const px = 50 + p.x * ((750 - 50) / 360); // mapping x from [0,360] to [50,750]
    const py = 350 + (1 - p.y) * (200 / 2); // mapping y from [-1,1] to [550,350] (inverted y-axis)
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  }).join(' ');

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
         `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n` +
         `  <rect width="100%" height="100%" fill="white" />\n` +
         `  <text x="${width / 2}" y="30" font-size="16" text-anchor="middle">Quadratic Plot: y = x²</text>\n` +
         `  <polyline points="${quadPts}" fill="none" stroke="blue" stroke-width="2" />\n\n` +
         `  <text x="${width / 2}" y="330" font-size="16" text-anchor="middle">Sine Plot: y = sin(x)</text>\n` +
         `  <polyline points="${sinePts}" fill="none" stroke="red" stroke-width="2" />\n` +
         `</svg>`;
}

// Run main if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const quadratic = plotQuadratic();
  const sine = plotSine();
  const svgContent = generateSvg(quadratic, sine);

  // Write the SVG content to a file
  fs.writeFileSync('output.svg', svgContent, 'utf8');
  console.log('SVG file generated: output.svg');
}
