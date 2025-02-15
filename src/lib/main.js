#!/usr/bin/env node

/**
 * Equation Plotter Library (SVG)
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
 *   - Export: Outputs the generated plot as an SVG file, ASCII art, or textual data, and also allows writing output to a file.
 *
 * --- SDK API ---
 *
 * Exported Functions:
 *   plotToSvg(options)   -> Returns SVG string from given formula strings.
 *   plotToAscii(options) -> Returns ASCII art string for sine plot from given formula strings.
 *   plotToText(options)  -> Returns text representation of plot points for all plots.
 *   plotToFile(options)  -> Saves the output (SVG, ASCII, or text) to a file and returns the file path.
 *
 * Additional Functions:
 *   plotQuadraticParam(params)  -> Returns an array of points for quadratic function.
 *   plotSineParam(params)       -> Returns an array of points for sine function.
 *   plotPolarParam(params)      -> Returns an array of points for polar function.
 *   plotQuadratic()             -> Quadratic plot using default parameters.
 *   plotSine()                  -> Sine plot using default parameters.
 *   plotPolar()                 -> Polar plot using default parameters.
 *   plotFromString(formulaStr)  -> Returns points from a formula string. (Formats: quadratic, sine, polar)
 *   generateSvg(quadraticPoints, sinePoints, polarPoints) -> Returns SVG string based on plot points.
 *   displayPlot(plotName, points)  -> Logs plot data as text to the console.
 *   displaySineAscii(points)       -> Logs ASCII art representation of sine wave to the console.
 *
 * Examples:
 *   1) Command Line Execution:
 *      $ node src/lib/main.js output.svg "quadratic:1,0,0,-10,10,1" "sine:1,1,0,0,360,10"
 *      Expected Output: SVG file generated with Quadratic, Sine and Polar plots, and demos of raw formula parsing.
 *
 *   2) Using the API:
 *      import { plotToSvg, plotToAscii, plotToText, plotToFile } from './main.js';
 *      const svg = plotToSvg({ formulas: ["quadratic:1,0,0,-10,10,1", "sine:1,1,0,0,360,10", "polar:200,2,5"] });
 *      console.log(svg);
 *
 *      const asciiArt = plotToAscii({ formulas: ["sine:1,1,0,0,360,10"] });
 *      console.log(asciiArt);
 *
 *      const textData = plotToText({ formulas: ["quadratic:1,0,0,-10,10,1", "sine:1,1,0,0,360,10", "polar:200,2,5"] });
 *      console.log(textData);
 *
 *      // Save SVG to a file
 *      const filePath = plotToFile({ formulas: ["quadratic:1,0,0,-10,10,1", "sine:1,1,0,0,360,10", "polar:200,2,5"], outputFileName: 'myplot.svg', type: 'svg' });
 *      console.log(`File saved at: ${filePath}`);
 *
 * License: MIT
 */

import { fileURLToPath } from 'url';
import fs from 'fs';

// ------------------------------------------------------------------------------
// Plotting Functions
// ------------------------------------------------------------------------------

function plotQuadraticParam({ a = 1, b = 0, c = 0, xMin = -10, xMax = 10, step = 1 } = {}) {
  const points = [];
  for (let x = xMin; x <= xMax; x += step) {
    points.push({ x, y: a * x * x + b * x + c });
  }
  return points;
}

function plotSineParam({ amplitude = 1, frequency = 1, phase = 0, xMin = 0, xMax = 360, step = 10 } = {}) {
  const points = [];
  for (let deg = xMin; deg <= xMax; deg += step) {
    const rad = deg * (Math.PI / 180);
    points.push({ x: deg, y: amplitude * Math.sin(frequency * rad + phase) });
  }
  return points;
}

function plotPolarParam({ scale = 200, multiplier = 2, step = 5, degMin = 0, degMax = 360 } = {}) {
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

// Backward compatible wrappers
function plotQuadratic() {
  return plotQuadraticParam();
}

function plotSine() {
  return plotSineParam();
}

function plotPolar() {
  return plotPolarParam();
}

// ------------------------------------------------------------------------------
// Formula Parsing Functions
// Expected formats:
//   Quadratic: "quadratic:a,b,c[,xMin,xMax,step]"
//   Sine:      "sine:amplitude,frequency,phase[,xMin,xMax,step]"
//   Polar:     "polar:scale,multiplier[,step]"
// ------------------------------------------------------------------------------

function parseQuadratic(formulaStr) {
  const parts = formulaStr.split(':');
  if (parts.length < 2) throw new Error('Invalid quadratic formula string');
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
  if (parts.length < 2) throw new Error('Invalid sine formula string');
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
  if (parts.length < 2) throw new Error('Invalid polar formula string');
  const params = parts[1].split(',').map(Number);
  const [scale, multiplier, step] = params;
  return plotPolarParam({
    scale: isNaN(scale) ? 200 : scale,
    multiplier: isNaN(multiplier) ? 2 : multiplier,
    step: isNaN(step) ? 5 : step
  });
}

// Delegate plotting based on formula string prefix
function plotFromString(formulaStr) {
  const lowerStr = formulaStr.toLowerCase();
  if (lowerStr.startsWith('quadratic:')) return parseQuadratic(formulaStr);
  if (lowerStr.startsWith('sine:')) return parseSine(formulaStr);
  if (lowerStr.startsWith('polar:')) return parsePolar(formulaStr);
  console.error('Unknown formula type.');
  return [];
}

// ------------------------------------------------------------------------------
// Display Functions
// ------------------------------------------------------------------------------

function displayPlot(plotName, points) {
  console.log(`Plot for ${plotName}:`);
  console.log(points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' '));
}

function displaySineAscii(points) {
  const rows = 21;
  const cols = points.length;
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(' '));

  // Map sine point's y value (range [-1,1]) to a row index
  for (let col = 0; col < cols; col++) {
    const { y } = points[col];
    const row = Math.round((1 - ((y + 1) / 2)) * (rows - 1));
    grid[row][col] = '*';
  }

  // Draw x-axis at y=0
  const xAxisRow = Math.round(0.5 * (rows - 1));
  for (let col = 0; col < cols; col++) {
    if (grid[xAxisRow][col] === ' ') grid[xAxisRow][col] = '-';
  }
  console.log('ASCII Art of Sine Wave:');
  grid.forEach(row => console.log(row.join('')));
}

// ------------------------------------------------------------------------------
// SVG Generation
// ------------------------------------------------------------------------------

function generateSvg(quadraticPoints, sinePoints, polarPoints) {
  const width = 800;
  const height = 800; // Increased height to accommodate polar plot

  // Map quadratic points to SVG space
  const quadPts = quadraticPoints.map(p => {
    const px = 50 + (p.x + 10) * ((750 - 50) / 20); // mapping x from [-10,10] to [50,750]
    const py = 50 + (100 - p.y) * (200 / 100);      // mapping y from [0,100] to [250,50] (inverted y-axis)
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  }).join(' ');

  // Map sine points to SVG space
  const sinePts = sinePoints.map(p => {
    const px = 50 + p.x * ((750 - 50) / 360);       // mapping x from [0,360] to [50,750]
    const py = 350 + (1 - p.y) * (200 / 2);           // mapping y from [-1,1] to [550,350] (inverted y-axis)
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  }).join(' ');

  // Map polar points to SVG space; center at (width/2, 700)
  const centerX = width / 2;
  const centerY = 700;
  const polarPts = polarPoints.map(p => {
    const px = centerX + p.x;
    const py = centerY - p.y;  // Invert y-axis
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

// ------------------------------------------------------------------------------
// Exported API Functions
// ------------------------------------------------------------------------------

function plotToSvg({ formulas = [] } = {}) {
  let quadraticPlot = null;
  let sinePlot = null;
  let polarPlot = null;
  formulas.forEach(formula => {
    const lower = formula.toLowerCase();
    try {
      if (lower.startsWith('quadratic:')) {
        quadraticPlot = plotFromString(formula);
      } else if (lower.startsWith('sine:')) {
        sinePlot = plotFromString(formula);
      } else if (lower.startsWith('polar:')) {
        polarPlot = plotFromString(formula);
      }
    } catch (e) {
      console.error(e);
    }
  });
  if (!quadraticPlot) quadraticPlot = plotQuadratic();
  if (!sinePlot) sinePlot = plotSine();
  if (!polarPlot) polarPlot = plotPolar();
  return generateSvg(quadraticPlot, sinePlot, polarPlot);
}

function plotToAscii({ formulas = [] } = {}) {
  let points = [];
  formulas.forEach(formula => {
    if (formula.toLowerCase().startsWith('sine:')) {
      points = plotFromString(formula);
    }
  });
  if (points.length === 0) {
    points = plotSine();
  }
  const rows = 21;
  const cols = points.length;
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(' '));
  for (let col = 0; col < cols; col++) {
    const { y } = points[col];
    const row = Math.round((1 - ((y + 1) / 2)) * (rows - 1));
    grid[row][col] = '*';
  }
  const xAxisRow = Math.round(0.5 * (rows - 1));
  for (let col = 0; col < cols; col++) {
    if (grid[xAxisRow][col] === ' ') grid[xAxisRow][col] = '-';
  }
  let asciiArt = 'ASCII Art of Sine Wave:\n';
  asciiArt += grid.map(row => row.join('')).join('\n');
  return asciiArt;
}

function plotToText({ formulas = [] } = {}) {
  let output = '';
  let quadraticPlot = null;
  let sinePlot = null;
  let polarPlot = null;
  formulas.forEach(formula => {
    const lower = formula.toLowerCase();
    try {
      if (lower.startsWith('quadratic:')) {
        quadraticPlot = plotFromString(formula);
      } else if (lower.startsWith('sine:')) {
        sinePlot = plotFromString(formula);
      } else if (lower.startsWith('polar:')) {
        polarPlot = plotFromString(formula);
      }
    } catch (err) {
      console.error(err);
    }
  });
  if (!quadraticPlot) quadraticPlot = plotQuadratic();
  if (!sinePlot) sinePlot = plotSine();
  if (!polarPlot) polarPlot = plotPolar();
  output += "Quadratic Plot:\n" + quadraticPlot.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' ') + "\n\n";
  output += "Sine Plot:\n" + sinePlot.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' ') + "\n\n";
  output += "Polar Plot:\n" + polarPlot.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' ') + "\n";
  return output;
}

function plotToFile({ formulas = [], outputFileName = 'output.svg', type = 'svg' } = {}) {
  let content = '';
  if (type === 'svg') {
    content = plotToSvg({ formulas });
  } else if (type === 'ascii') {
    content = plotToAscii({ formulas });
  } else if (type === 'text') {
    content = plotToText({ formulas });
  } else {
    throw new Error('Unsupported type provided for plotToFile');
  }
  try {
    fs.writeFileSync(outputFileName, content, 'utf8');
  } catch (e) {
    console.error('Error writing file:', e);
    throw e;
  }
  return outputFileName;
}

// ------------------------------------------------------------------------------
// Main Execution
// ------------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node src/lib/main.js [outputFileName] [formulaStrings...]

Options:
  --help, -h       Show this help message

Formula String Formats:
  Quadratic: "quadratic:a,b,c[,xMin,xMax,step]"
  Sine:      "sine:amplitude,frequency,phase[,xMin,xMax,step]"
  Polar:     "polar:scale,multiplier[,step]"
`);
    process.exit(0);
  }

  let outputFileName = 'output.svg';
  let quadraticPlot = null;
  let sinePlot = null;
  let polarPlot = null;

  // Determine output file name from non-formula arguments
  const nonFormulaArgs = args.filter(arg => !arg.includes(':'));
  if (nonFormulaArgs.length > 0) {
    outputFileName = nonFormulaArgs[0];
  }

  // Process formula strings
  args.filter(arg => arg.includes(':')).forEach(arg => {
    const lowerArg = arg.toLowerCase();
    try {
      if (lowerArg.startsWith('quadratic:')) {
        quadraticPlot = plotFromString(arg);
      } else if (lowerArg.startsWith('sine:')) {
        sinePlot = plotFromString(arg);
      } else if (lowerArg.startsWith('polar:')) {
        polarPlot = plotFromString(arg);
      } else {
        console.error('Unknown formula type in argument:', arg);
      }
    } catch (err) {
      console.error(`Error parsing formula '${arg}':`, err.message);
    }
  });

  // Use default plots if not provided
  if (!quadraticPlot) quadraticPlot = plotQuadratic();
  if (!sinePlot) sinePlot = plotSine();
  if (!polarPlot) polarPlot = plotPolar();

  // Demo: Show raw formula and its parsed representation
  console.log('Demo: Raw formula strings and their parsed representations:');
  const rawQuad = 'quadratic:1,0,0,-10,10,1';
  console.log(`Raw Formula: "${rawQuad}"`);
  displayPlot('Quadratic from Raw Formula', plotFromString(rawQuad));

  const rawSine = 'sine:1,1,0,0,360,10';
  console.log(`\nRaw Formula: "${rawSine}"`);
  console.log('Parsed ASCII Art for Sine:');
  console.log(plotToAscii({ formulas: [rawSine] }));

  // Generate SVG content
  const svgContent = generateSvg(quadraticPlot, sinePlot, polarPlot);
  try {
    fs.writeFileSync(outputFileName, svgContent, 'utf8');
    console.log(`\nSVG file generated: ${outputFileName}`);
  } catch (err) {
    console.error('Error writing SVG file:', err.message);
    process.exit(1);
  }

  // Additional demo outputs
  console.log('\nText Representation of Plots:');
  console.log(plotToText({ formulas: [] }));
}

// Execute main if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

// Exporting API functions
export { plotToSvg, plotToAscii, plotToText, plotToFile, plotFromString, plotQuadratic, plotSine, plotPolar };
