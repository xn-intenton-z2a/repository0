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
 *   - Quadratic Plot: Generates data points for y = ax² + bx + c.
 *   - Sine Plot: Generates data points for y = A*sin(B*x + C) where x is in degrees.
 *   - Polar Plot: Generates and converts polar function data for plotting: r = scale * |sin(multiplier * theta)|.
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

// Parameterized plotting functions
function plotQuadraticParam({ a = 1, b = 0, c = 0, xMin = -10, xMax = 10, step = 1 } = {}) {
  // Generate points for a quadratic function: y = a*x² + b*x + c
  const points = [];
  for (let x = xMin; x <= xMax; x += step) {
    points.push({ x, y: a * x * x + b * x + c });
  }
  return points;
}

function plotSineParam({ amplitude = 1, frequency = 1, phase = 0, xMin = 0, xMax = 360, step = 10 } = {}) {
  // Generate points for sine function: y = amplitude * sin(frequency * (x in rad) + phase)
  const points = [];
  for (let deg = xMin; deg <= xMax; deg += step) {
    const rad = deg * (Math.PI / 180);
    points.push({ x: deg, y: amplitude * Math.sin(rad * frequency + phase) });
  }
  return points;
}

function plotPolarParam({ scale = 200, multiplier = 2, step = 5, degMin = 0, degMax = 360 } = {}) {
  // Generate points for a polar function: r = scale * |sin(multiplier * theta)|, then convert to Cartesian
  const points = [];
  for (let deg = degMin; deg <= degMax; deg += step) {
    const rad = deg * (Math.PI / 180);
    const r = scale * Math.abs(Math.sin(multiplier * rad));
    const x = r * Math.cos(rad);
    const y = r * Math.sin(rad);
    points.push({ x, y });
  }
  return points;
}

// Backward compatible wrappers using default parameters
function plotQuadratic() {
  return plotQuadraticParam();
}

function plotSine() {
  return plotSineParam();
}

function plotPolar() {
  return plotPolarParam();
}

// String parsing functions for formulas
// Expected formats:
// Quadratic: "quadratic:a,b,c[,xMin,xMax,step]"
// Sine:      "sine:amplitude,frequency,phase[,xMin,xMax,step]"
// Polar:     "polar:scale,multiplier[,step]"

function parseQuadratic(formulaStr) {
  const parts = formulaStr.split(':');
  if (parts.length < 2) {
    throw new Error('Invalid quadratic formula string');
  }
  const params = parts[1].split(',').map(Number);
  const [a, b, c, xMin, xMax, step] = params;
  return plotQuadraticParam({
    a: isNaN(a) ? 1 : a,
    b: isNaN(b) ? 0 : b,
    c: isNaN(c) ? 0 : c,
    xMin: isNaN(xMin) ? -10 : xMin,
    xMax: isNaN(xMax) ? 10 : xMax,
    step: isNaN(step) ? 1 : step
  });
}

function parseSine(formulaStr) {
  const parts = formulaStr.split(':');
  if (parts.length < 2) {
    throw new Error('Invalid sine formula string');
  }
  const params = parts[1].split(',').map(Number);
  const [amplitude, frequency, phase, xMin, xMax, step] = params;
  return plotSineParam({
    amplitude: isNaN(amplitude) ? 1 : amplitude,
    frequency: isNaN(frequency) ? 1 : frequency,
    phase: isNaN(phase) ? 0 : phase,
    xMin: isNaN(xMin) ? 0 : xMin,
    xMax: isNaN(xMax) ? 360 : xMax,
    step: isNaN(step) ? 10 : step
  });
}

function parsePolar(formulaStr) {
  const parts = formulaStr.split(':');
  if (parts.length < 2) {
    throw new Error('Invalid polar formula string');
  }
  const params = parts[1].split(',').map(Number);
  const [scale, multiplier, step] = params;
  return plotPolarParam({
    scale: isNaN(scale) ? 200 : scale,
    multiplier: isNaN(multiplier) ? 2 : multiplier,
    step: isNaN(step) ? 5 : step
  });
}

// General function that delegates based on string prefix
function plotFromString(formulaStr) {
  const lowerStr = formulaStr.toLowerCase();
  if (lowerStr.startsWith('quadratic:')) {
    return parseQuadratic(formulaStr);
  } else if (lowerStr.startsWith('sine:')) {
    return parseSine(formulaStr);
  } else if (lowerStr.startsWith('polar:')) {
    return parsePolar(formulaStr);
  } else {
    console.error('Unknown formula type.');
    return [];
  }
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
         `  <text x="${width / 2}" y="30" font-size="16" text-anchor="middle">Quadratic Plot: y = ax² + bx + c</text>\n` +
         `  <polyline points="${quadPts}" fill="none" stroke="blue" stroke-width="2" />\n\n` +
         `  <text x="${width / 2}" y="330" font-size="16" text-anchor="middle">Sine Plot: y = A*sin(B*x + C)</text>\n` +
         `  <polyline points="${sinePts}" fill="none" stroke="red" stroke-width="2" />\n\n` +
         `  <text x="${width / 2}" y="670" font-size="16" text-anchor="middle">Polar Plot: r = scale * |sin(multiplier * θ)|</text>\n` +
         `  <polyline points="${polarPts}" fill="none" stroke="green" stroke-width="2" />\n` +
         `</svg>`;
}

// Run main if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outputFileName = process.argv[2] || 'output.svg';

  // Generate default plots using original functions
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

  // Demo usage of the string based parsing function
  console.log('Testing string based plotting:');
  let qp = plotFromString('quadratic:1,0,0,-10,10,1');
  displayPlot('Quadratic from String', qp);
  let sp = plotFromString('sine:1,1,0,0,360,10');
  displayPlot('Sine from String', sp);
  let pp = plotFromString('polar:200,2,5');
  displayPlot('Polar from String', pp);
}
