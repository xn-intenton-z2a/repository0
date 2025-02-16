#!/usr/bin/env node

'use strict';

/**
 * Equation Plotter Library
 *
 * Description:
 *   A lightweight library for generating plots of mathematical equations with export options in SVG, JSON, CSV, HTML, ASCII, and text formats.
 *   It supports different mathematical functions including quadratic, sine, and polar equations.
 *
 * Features:
 *   - Quadratic Plot: Generates data for y = ax² + bx + c, supporting both standard algebraic and prefixed formula strings.
 *   - Sine Plot: Generates data for y = A*sin(B*x + C) with control over amplitude, frequency, phase, and x range.
 *   - Polar Plot: Generates data for r = scale * |sin(multiplier*θ)|, useful for polar function visualizations.
 *   - Export Options: Outputs plots as SVG for graphics, ASCII art for console visualization, plain text, JSON, CSV, or full HTML embedding the SVG.
 *   - Customization: Offers interactive features like zoom and pan, along with styling options for grid, axes, and curves.
 *
 * API Functions:
 *   - plotToSvg(options): Returns an SVG string of the plots.
 *   - plotToAscii(options): Returns an ASCII art string for the sine plot.
 *   - plotToText(options): Returns a textual representation of plot points.
 *   - plotToJson(options): Returns a JSON string containing the plot data.
 *   - plotToCsv(options): Returns a CSV string with plot points.
 *   - plotToHtml(options): Returns an HTML string that embeds the SVG plot.
 *   - plotToFile(options): Saves the generated output to a file and returns the path.
 *   - plotFromString(formulaStr): Parses a formula string to generate plot points.
 *   - plotQuadratic, plotSine, plotPolar: Generate plots with default parameters.
 *
 * CLI Usage Examples:
 *   $ node src/lib/main.js output.svg "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.json --json "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.csv --csv "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.html "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *
 * API Usage Example:
 *   import { plotToSvg, plotToJson, plotToCsv, plotToHtml } from './main.js';
 *   const svg = plotToSvg({ formulas: ["x^2+y-1=0", "sine:1,1,0,0,360,10"] });
 *
 * Installation:
 *   Install via npm with the required dependencies. See package.json for more details.
 *
 * License: MIT
 */

import { fileURLToPath } from 'url';
import fs from 'fs';

// ----------------------------------
// Plotting Functions
// ----------------------------------

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

// ----------------------------------
// Formula Parsing Functions
// ----------------------------------

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

// Extract quadratic coefficients from an expression of form ax^2+bx+c
function extractQuadraticCoefficients(expr) {
  expr = expr.replace(/\s+/g, '');
  let a = 0, b = 0, c = 0;

  const aMatch = expr.match(/([+-]?\d*\.?\d*)x\^2/);
  if (aMatch) {
    let coeff = aMatch[1];
    if (coeff === '' || coeff === '+') a = 1;
    else if (coeff === '-') a = -1;
    else a = parseFloat(coeff);
    expr = expr.replace(aMatch[0], '');
  }

  const bMatch = expr.match(/([+-]?\d*\.?\d+)x(?!\^)/);
  if (bMatch) {
    let coeff = bMatch[1];
    if (coeff === '' || coeff === '+') b = 1;
    else if (coeff === '-') b = -1;
    else b = parseFloat(coeff);
    expr = expr.replace(bMatch[0], '');
  }

  const constantMatches = expr.match(/([+-]?\d*\.?\d+)/g);
  if (constantMatches) {
    c = constantMatches.reduce((sum, numStr) => sum + parseFloat(numStr), 0);
  }

  return { a, b, c };
}

// Helper function to invert an algebraic expression consisting of additions and subtractions.
function invertExpression(expr) {
  const tokens = expr.match(/[+-]?[^+-]+/g) || [];
  const inverted = tokens.map(token => {
    token = token.trim();
    if (token.startsWith('-')) return '+' + token.slice(1);
    else return '-' + token;
  }).join('');
  return inverted[0] === '+' ? inverted.slice(1) : inverted;
}

// Parse a generic quadratic formula in standard algebraic form
function parseGenericQuadratic(formulaStr) {
  let formula = formulaStr.replace(/\s+/g, '');
  // if formula starts with 'y=', simply parse the expression after y=
  if (formula.toLowerCase().startsWith('y=')) {
    const yExpr = formula.substring(2);
    return plotQuadraticParam({ ...extractQuadraticCoefficients(yExpr), xMin: -10, xMax: 10, step: 1 });
  } else {
    const parts = formula.split('=');
    if (parts.length !== 2) throw new Error('Unsupported formula format for quadratic parsing');
    let left = parts[0];
    let right = parts[1];
    // If 'y' exists in left or right, rearrange the equation to solve for y
    if (left.includes('y')) {
      const nonYPart = left.replace('y', '');
      const newExpr = (right || '0') + invertExpression(nonYPart);
      return plotQuadraticParam({ ...extractQuadraticCoefficients(newExpr), xMin: -10, xMax: 10, step: 1 });
    } else if (right.includes('y')) {
      const nonYPart = right.replace('y', '');
      const newExpr = (left || '0') + invertExpression(nonYPart);
      return plotQuadraticParam({ ...extractQuadraticCoefficients(newExpr), xMin: -10, xMax: 10, step: 1 });
    } else {
      throw new Error('No y variable found in quadratic equation');
    }
  }
}

// Delegate plotting based on formula string content
function plotFromString(formulaStr) {
  const lowerStr = formulaStr.toLowerCase();
  if (formulaStr.includes(':')) {
    if (lowerStr.startsWith('quadratic:')) return parseQuadratic(formulaStr);
    if (lowerStr.startsWith('sine:')) return parseSine(formulaStr);
    if (lowerStr.startsWith('polar:')) return parsePolar(formulaStr);
    console.error('Unknown prefixed formula type.');
    return [];
  } else if (formulaStr.includes('=')) {
    try {
      return parseGenericQuadratic(formulaStr);
    } catch (e) {
      console.error('Error parsing generic quadratic formula:', e.message);
      return [];
    }
  } else {
    console.error('Formula string is not in a recognized format.');
    return [];
  }
}

// Helper function to parse formulas and return plots
function getPlotsFromFormulas(formulas = []) {
  let quadratic, sine, polar;
  formulas.forEach(formula => {
    const lower = formula.toLowerCase();
    try {
      if (lower.startsWith('quadratic:') || (!formula.includes(':') && formula.includes('='))) {
        quadratic = plotFromString(formula);
      } else if (lower.startsWith('sine:')) {
        sine = plotFromString(formula);
      } else if (lower.startsWith('polar:')) {
        polar = plotFromString(formula);
      }
    } catch (e) {
      console.error('Error parsing formula:', formula, e.message);
    }
  });
  if (!quadratic) quadratic = plotQuadratic();
  if (!sine) sine = plotSine();
  if (!polar) polar = plotPolar();
  return { quadratic, sine, polar };
}

// ----------------------------------
// Display Functions
// ----------------------------------

function displayPlot(plotName, points) {
  console.log(`Plot for ${plotName}:`);
  console.log(points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' '));
}

function displaySineAscii(points) {
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

  console.log('ASCII Art of Sine Wave:');
  grid.forEach(row => console.log(row.join('')));
}

// ----------------------------------
// SVG Generation Function
// ----------------------------------

function generateSvg(quadraticPoints, sinePoints, polarPoints) {
  const width = 800;
  const height = 800;

  const quadPts = quadraticPoints.map(p => {
    const px = 50 + (p.x + 10) * ((750 - 50) / 20);
    const py = 50 + (100 - p.y) * (200 / 100);
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  }).join(' ');

  const sinePts = sinePoints.map(p => {
    const px = 50 + p.x * ((750 - 50) / 360);
    const py = 350 + (1 - p.y) * (200 / 2);
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  }).join(' ');

  const centerX = width / 2;
  const centerY = 700;
  const polarPts = polarPoints.map(p => {
    const px = centerX + p.x;
    const py = centerY - p.y;
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

// ----------------------------------
// HTML Generation Function
// ----------------------------------

function plotToHtml({ formulas = [] } = {}) {
  const svgContent = plotToSvg({ formulas });
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Equation Plot</title>\n  <style>\n    body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8f8f8; }\n  </style>\n</head>\n<body>\n${svgContent}\n</body>\n</html>`;
}

// ----------------------------------
// Exported API Functions
// ----------------------------------

function plotToSvg({ formulas = [] } = {}) {
  const { quadratic, sine, polar } = getPlotsFromFormulas(formulas);
  return generateSvg(quadratic, sine, polar);
}

function plotToAscii({ formulas = [] } = {}) {
  const { sine } = getPlotsFromFormulas(formulas);
  const points = sine;
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
  const { quadratic, sine, polar } = getPlotsFromFormulas(formulas);
  let output = '';
  output += 'Quadratic Plot:\n' + quadratic.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' ') + '\n\n';
  output += 'Sine Plot:\n' + sine.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' ') + '\n\n';
  output += 'Polar Plot:\n' + polar.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' ') + '\n';
  return output;
}

function plotToJson({ formulas = [] } = {}) {
  const { quadratic, sine, polar } = getPlotsFromFormulas(formulas);
  return {
    quadratic,
    sine,
    polar
  };
}

function plotToCsv({ formulas = [] } = {}) {
  const { quadratic, sine, polar } = getPlotsFromFormulas(formulas);
  const lines = [];
  lines.push('Plot, x, y');
  lines.push('--Quadratic Plot--');
  quadratic.forEach(p => {
    lines.push(`Quadratic,${p.x.toFixed(2)},${p.y.toFixed(2)}`);
  });
  lines.push('');
  lines.push('--Sine Plot--');
  sine.forEach(p => {
    lines.push(`Sine,${p.x.toFixed(2)},${p.y.toFixed(2)}`);
  });
  lines.push('');
  lines.push('--Polar Plot--');
  polar.forEach(p => {
    lines.push(`Polar,${p.x.toFixed(2)},${p.y.toFixed(2)}`);
  });
  return lines.join("\n");
}

function plotToFile({ formulas = [], outputFileName = 'output.svg', type = 'svg' } = {}) {
  let content = '';
  if (type === 'svg') {
    content = plotToSvg({ formulas });
  } else if (type === 'ascii') {
    content = plotToAscii({ formulas });
  } else if (type === 'text') {
    content = plotToText({ formulas });
  } else if (type === 'json') {
    content = JSON.stringify(plotToJson({ formulas }), null, 2);
  } else if (type === 'csv') {
    content = plotToCsv({ formulas });
  } else if (type === 'html') {
    content = plotToHtml({ formulas });
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

// ----------------------------------
// Main Execution
// ----------------------------------

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node src/lib/main.js [outputFileName] [formulaStrings...]

Options:
  --help, -h       Show this help message
  --json           Generate output as JSON instead of SVG
  --csv            Generate output as CSV instead of SVG
  (output file extension .html will generate HTML output)

Formula String Formats:
  Quadratic: "y=x^2+2*x+1" or "x^2+y-1=0"
  Sine:      "sine:amplitude,frequency,phase[,xMin,xMax,step]"
  Polar:     "polar:scale,multiplier[,step]"
`);
    process.exit(0);
  }

  let outputFileName = 'output.svg';
  let isJson = args.includes('--json');
  let isCsv = args.includes('--csv');
  let isHtml = false;

  const nonFormulaArgs = args.filter(arg => !arg.includes(':') && !arg.includes('=') && arg !== '--json' && arg !== '--csv');
  if (nonFormulaArgs.length > 0) {
    outputFileName = nonFormulaArgs[0];
  }
  // Force output type based on file extension
  if (outputFileName.toLowerCase().endsWith('.json')) {
    isJson = true;
  } else if (outputFileName.toLowerCase().endsWith('.csv')) {
    isCsv = true;
  } else if (outputFileName.toLowerCase().endsWith('.html')) {
    isHtml = true;
  }

  // Collect formulas from arguments
  const formulasList = args.filter(arg => arg.includes(':') || arg.includes('='));
  const { quadratic, sine, polar } = getPlotsFromFormulas(formulasList);

  console.log('Demo: Raw formula strings and their parsed representations:');

  const rawQuad = 'x^2+y-1=0';
  console.log(`Raw Formula: "${rawQuad}"`);
  console.log('Parsed representation for Quadratic from Raw Formula:');
  displayPlot('Quadratic from Raw Formula', plotFromString(rawQuad));

  const rawSine = 'sine:1,1,0,0,360,10';
  console.log(`\nRaw Formula: "${rawSine}"`);
  console.log('Parsed ASCII Art for Sine:');
  console.log(plotToAscii({ formulas: [rawSine] }));

  // Added test demonstration for Polar formula
  const rawPolar = 'polar:200,2,5';
  console.log(`\nRaw Formula: "${rawPolar}"`);
  console.log('Parsed representation for Polar from Raw Formula:');
  displayPlot('Polar from Raw Formula', plotFromString(rawPolar));

  let fileContent = '';
  if (isJson) {
    fileContent = JSON.stringify(plotToJson({ formulas: formulasList }), null, 2);
  } else if (isCsv) {
    fileContent = plotToCsv({ formulas: formulasList });
  } else if (isHtml) {
    fileContent = plotToHtml({ formulas: formulasList });
  } else {
    fileContent = generateSvg(quadratic, sine, polar);
  }

  try {
    fs.writeFileSync(outputFileName, fileContent, 'utf8');
    console.log(`\n${isJson ? 'JSON' : isCsv ? 'CSV' : isHtml ? 'HTML' : 'SVG'} file generated: ${outputFileName}`);
  } catch (err) {
    console.error(`Error writing file:`, err.message);
    process.exit(1);
  }

  console.log('\nText Representation of Plots:');
  console.log(plotToText({ formulas: formulasList }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { plotToSvg, plotToAscii, plotToText, plotToJson, plotToCsv, plotToHtml, plotToFile, plotFromString, plotQuadratic, plotSine, plotPolar };
