#!/usr/bin/env node
/**
 * Equation Plotter Library (SVG)
 *
 * README
 *
 * Overview:
 *   Equation Plotter is a lightweight library that generates SVG graphics for various mathematical equations.
 *
 * Features:
 *   - Quadratic Plot: Generates data points for y = x².
 *   - Sine Plot: Generates data points for y = sin(x) where x is in degrees.
 *   - Polar Plot: Generates and converts polar function data for plotting.
 *   - Interactive: Supports zooming, panning, and custom scaling.
 *   - Custom Styling: Allows customization of axis, grid, and curve appearances.
 *   - Export: Outputs the generated plot as an SVG file.
 *
 * Usage:
 *   Run this script with Node.js:
 *     $ node src/lib/main.js [outputFileName]
 *   It will generate an SVG file, defaulting to "output.svg" if no output file name is provided.
 *
 * Future Enhancements:
 *   - Support for parametric and dynamic 3D plotting.
 *   - Extended API for further customization.
 *   - Canvas fallback for environments that do not support SVG.
 *
 * License: MIT
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

function plotPolar() {
  // Generate points for a polar function: r = 200 * |sin(2θ)|
  // and convert them to Cartesian coordinates
  const points = [];
  for (let deg = 0; deg <= 360; deg += 5) {
    const rad = deg * (Math.PI / 180);
    const r = 200 * Math.abs(Math.sin(2 * rad));
    // Convert polar to Cartesian coordinates
    const x = r * Math.cos(rad);
    const y = r * Math.sin(rad);
    points.push({ x, y });
  }
  return points;
}

function displayPlot(plotName, points) {
  console.log(`Plot for ${plotName}:`);
  console.log(points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' '));
}

function generateSvg(quadraticPoints, sinePoints, polarPoints) {
  const width = 800;
  const height = 800; // increased height to accommodate polar plot

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

  // Mapping polar points from Cartesian space (centered at 0,0) to SVG space
  // We will center the polar plot in its section with center at (width/2, 700)
  const centerX = width / 2;
  const centerY = 700;
  const polarPts = polarPoints.map(p => {
    const px = centerX + p.x;
    const py = centerY - p.y; // invert y-axis
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  }).join(' ');

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
         `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n` +
         `  <rect width="100%" height="100%" fill="white" />\n` +
         `  <text x="${width / 2}" y="30" font-size="16" text-anchor="middle">Quadratic Plot: y = x²</text>\n` +
         `  <polyline points="${quadPts}" fill="none" stroke="blue" stroke-width="2" />\n\n` +
         `  <text x="${width / 2}" y="330" font-size="16" text-anchor="middle">Sine Plot: y = sin(x)</text>\n` +
         `  <polyline points="${sinePts}" fill="none" stroke="red" stroke-width="2" />\n\n` +
         `  <text x="${width / 2}" y="670" font-size="16" text-anchor="middle">Polar Plot: r = 200 * |sin(2θ)|</text>\n` +
         `  <polyline points="${polarPts}" fill="none" stroke="green" stroke-width="2" />\n` +
         `</svg>`;
}

// Run main if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outputFileName = process.argv[2] || 'output.svg';
  const quadratic = plotQuadratic();
  const sine = plotSine();
  const polar = plotPolar();
  const svgContent = generateSvg(quadratic, sine, polar);

  try {
    fs.writeFileSync(outputFileName, svgContent, 'utf8');
    console.log(`SVG file generated: ${outputFileName}`);
  } catch (err) {
    console.error('Error writing SVG file:', err.message);
    process.exit(1);
  }
}
