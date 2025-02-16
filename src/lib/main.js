#!/usr/bin/env node

'use strict';

/**
 * Equation Plotter Library
 *
 * Description:
 *   A lightweight library for generating plots of mathematical equations with export options in SVG, JSON, CSV, HTML, ASCII, and text formats.
 *   It supports different mathematical functions including quadratic, sine, polar, and now linear equations.
 *
 * Features:
 *   - Quadratic Plot: Generates data for y = ax² + bx + c, supporting both standard algebraic and prefixed formula strings.
 *   - Sine Plot: Generates data for y = A*sin(B*x + C) with control over amplitude, frequency, phase, and x range.
 *   - Polar Plot: Generates data for r = scale * |sin(multiplier*θ)|, useful for polar function visualizations.
 *   - Linear Plot: Generates data for y = m*x + b with control over slope, intercept, and x range.
 *   - Export Options: Outputs plots as SVG for graphics, ASCII art for console visualization, plain text, JSON, CSV, or full HTML embedding the SVG.
 *   - Customization: Offers interactive features like zoom and pan, along with styling options for grid, axes, and curves.
 *   - Multiple Formulas per Plot Type: Now supports multiple formulas for each plot type, each rendered with a distinct color.
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
 *   - plotQuadratic, plotSine, plotPolar, plotLinear: Generate plots with default parameters.
 *
 * CLI Usage Examples:
 *   $ node src/lib/main.js output.svg "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.json --json "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.csv --csv "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.html "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.txt --ascii "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.svg "linear:1,0,-10,10,1" "x^2+y-1=0" "sine:1,1,0,0,360,10" "polar:200,2,5"
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

function plotLinearParam({ m = 1, b = 0, xMin = -10, xMax = 10, step = 1 } = {}) {
  const points = [];
  for (let x = xMin; x <= xMax; x += step) {
    points.push({ x, y: m * x + b });
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

function plotLinear() {
  return plotLinearParam();
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

function parseLinear(formulaStr) {
  const parts = formulaStr.split(':');
  if (parts.length < 2) throw new Error('Invalid linear formula string');
  const params = parts[1].split(',').map(Number);
  const [m, b, xMin, xMax, step] = params;
  return plotLinearParam({
    m: isNaN(m) ? 1 : m,
    b: isNaN(b) ? 0 : b,
    xMin: isNaN(xMin) ? -10 : xMin,
    xMax: isNaN(xMax) ? 10 : xMax,
    step: isNaN(step) ? 1 : step
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
  if (formula.toLowerCase().startsWith('y=')) {
    const yExpr = formula.substring(2);
    return plotQuadraticParam({ ...extractQuadraticCoefficients(yExpr), xMin: -10, xMax: 10, step: 1 });
  } else if (formula.endsWith('=0')) { // Handle equations ending with =0
    const left = formula.split('=')[0];
    const yMatch = left.match(/([+-]?\d*\.?\d*)y/);
    if (!yMatch) throw new Error('No y term found in equation');
    let yCoeff = (yMatch[1] === '' || yMatch[1] === '+') ? 1 : (yMatch[1] === '-' ? -1 : parseFloat(yMatch[1]));
    let remaining = left.replace(/([+-]?\d*\.?\d*)y/, '');
    const coeffs = extractQuadraticCoefficients(remaining);
    return plotQuadraticParam({
      a: -coeffs.a / yCoeff,
      b: -coeffs.b / yCoeff,
      c: -coeffs.c / yCoeff,
      xMin: -10,
      xMax: 10,
      step: 1
    });
  } else {
    const parts = formula.split('=');
    if (parts.length !== 2) throw new Error('Unsupported formula format for quadratic parsing');
    let left = parts[0];
    let right = parts[1];
    if (left.includes('y')) {
      const yMatch = left.match(/([+-]?\d*\.?\d*)y/);
      let yCoeff = 1;
      if (yMatch) {
        const coeffStr = yMatch[1];
        if (coeffStr === '' || coeffStr === '+') yCoeff = 1;
        else if (coeffStr === '-') yCoeff = -1;
        else yCoeff = parseFloat(coeffStr);
      }
      let remaining = left.replace(/([+-]?\d*\.?\d*)y/, '');
      const constantRight = parseFloat(right) || 0;
      const coeffs = extractQuadraticCoefficients(remaining);
      return plotQuadraticParam({ a: -coeffs.a / yCoeff, b: -coeffs.b / yCoeff, c: (constantRight - coeffs.c) / yCoeff, xMin: -10, xMax: 10, step: 1 });
    } else if (right.includes('y')) {
      const yMatch = right.match(/([+-]?\d*\.?\d*)y/);
      let yCoeff = 1;
      if (yMatch) {
        const coeffStr = yMatch[1];
        if (coeffStr === '' || coeffStr === '+') yCoeff = 1;
        else if (coeffStr === '-') yCoeff = -1;
        else yCoeff = parseFloat(coeffStr);
      }
      let remaining = right.replace(/([+-]?\d*\.?\d*)y/, '');
      const constantLeft = parseFloat(left) || 0;
      const coeffs = extractQuadraticCoefficients(remaining);
      return plotQuadraticParam({ a: -coeffs.a / yCoeff, b: -coeffs.b / yCoeff, c: (constantLeft - coeffs.c) / yCoeff, xMin: -10, xMax: 10, step: 1 });
    } else {
      let nonYPart = left;
      const newExpr = (right || '0') + invertExpression(nonYPart);
      return plotQuadraticParam({ ...extractQuadraticCoefficients(newExpr), xMin: -10, xMax: 10, step: 1 });
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
    if (lowerStr.startsWith('linear:')) return parseLinear(formulaStr);
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

// Helper function to parse formulas and return plots grouped by type
function getPlotsFromFormulas(formulas = []) {
  const quadratic = [];
  const sine = [];
  const polar = [];
  const linear = [];
  formulas.forEach(formula => {
    const lower = formula.toLowerCase();
    try {
      if ((lower.startsWith('quadratic:') || (!formula.includes(':') && formula.includes('=')))) {
        quadratic.push(plotFromString(formula));
      } else if (lower.startsWith('sine:')) {
        sine.push(plotFromString(formula));
      } else if (lower.startsWith('polar:')) {
        polar.push(plotFromString(formula));
      } else if (lower.startsWith('linear:')) {
        linear.push(plotFromString(formula));
      }
    } catch (e) {
      console.error('Error parsing formula:', formula, e.message);
    }
  });
  if (quadratic.length === 0) quadratic.push(plotQuadratic());
  if (linear.length === 0) linear.push(plotLinear());
  if (sine.length === 0) sine.push(plotSine());
  if (polar.length === 0) polar.push(plotPolar());
  return { quadratic, linear, sine, polar };
}

// ----------------------------------
// Display Functions
// ----------------------------------

function displayPlot(plotName, points) {
  console.log(`Plot for ${plotName}:`);
  console.log(points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' '));
}

// ----------------------------------
// SVG Generation Function
// ----------------------------------

function generateSvg(quadraticPlots, linearPlots, sinePlots, polarPlots) {
  // New SVG with 4 plots arranged in separate slots
  const width = 800;
  const height = 1000;
  let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  svg += `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <rect width="100%" height="100%" fill="white" />\n`;

  // Define color palettes for each plot type
  const quadraticColors = ["blue", "darkblue", "purple", "royalblue", "deepskyblue"];
  const linearColors = ["orange", "darkorange", "gold", "chocolate", "peru"];
  const sineColors = ["red", "darkred", "crimson", "firebrick", "tomato"];
  const polarColors = ["green", "darkgreen", "limegreen", "seagreen", "forestgreen"];

  // Quadratic Plot (Slot 1)
  svg += `  <text x="${width / 2}" y="30" font-size="16" text-anchor="middle">Quadratic Plot: y = ax² + bx + c</text>\n`;
  let qPoints = quadraticPlots.flat();
  let qValues = qPoints.map(p => p.y);
  let qMinY = Math.min(...qValues);
  let qMaxY = Math.max(...qValues);
  if(qMinY === qMaxY) { qMinY -= 10; qMaxY += 10; }
  // Slot for quadratic: y range mapped from 50 to 250
  quadraticPlots.forEach((points, idx) => {
    const color = quadraticColors[idx % quadraticColors.length];
    const pts = points.map(p => {
      const px = 50 + ((p.x + 10) / 20) * 700;
      const py = 250 - ((p.y - qMinY) / (qMaxY - qMinY)) * 200;
      return `${px.toFixed(2)},${py.toFixed(2)}`;
    }).join(' ');
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += `\n`;

  // Linear Plot (Slot 2)
  svg += `  <text x="${width / 2}" y="260" font-size="16" text-anchor="middle">Linear Plot: y = m*x + b</text>\n`;
  let lPoints = linearPlots.flat();
  let lValues = lPoints.map(p => p.y);
  let lMinY = Math.min(...lValues);
  let lMaxY = Math.max(...lValues);
  if(lMinY === lMaxY) { lMinY -= 10; lMaxY += 10; }
  linearPlots.forEach((points, idx) => {
    const color = linearColors[idx % linearColors.length];
    const pts = points.map(p => {
      const px = 50 + ((p.x + 10) / 20) * 700;
      const py = 480 - ((p.y - lMinY) / (lMaxY - lMinY)) * 200;
      return `${px.toFixed(2)},${py.toFixed(2)}`;
    }).join(' ');
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += `\n`;

  // Sine Plot (Slot 3)
  svg += `  <text x="${width / 2}" y="490" font-size="16" text-anchor="middle">Sine Plot: y = A*sin(B*x + C)</text>\n`;
  let sPoints = sinePlots.flat();
  let sValues = sPoints.map(p => p.y);
  let sMinY = Math.min(...sValues);
  let sMaxY = Math.max(...sValues);
  if(sMinY === sMaxY) { sMinY -= 1; sMaxY += 1; }
  sinePlots.forEach((points, idx) => {
    const color = sineColors[idx % sineColors.length];
    const pts = points.map(p => {
      const px = 50 + (p.x / 360) * 700;
      const py = 710 - ((p.y - sMinY) / (sMaxY - sMinY)) * 200;
      return `${px.toFixed(2)},${py.toFixed(2)}`;
    }).join(' ');
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += `\n`;

  // Polar Plot (Slot 4: centered)
  svg += `  <text x="${width / 2}" y="730" font-size="16" text-anchor="middle">Polar Plot: r = scale * |sin(multiplier * θ)|</text>\n`;
  const centerX = width / 2;
  const centerY = 850;
  polarPlots.forEach((points, idx) => {
    const color = polarColors[idx % polarColors.length];
    const pts = points.map(p => {
      const px = centerX + p.x;
      const py = centerY - p.y;
      return `${px.toFixed(2)},${py.toFixed(2)}`;
    }).join(' ');
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += '</svg>';
  return svg;
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
  const { quadratic, linear, sine, polar } = getPlotsFromFormulas(formulas);
  return generateSvg(quadratic, linear, sine, polar);
}

function plotToAscii({ formulas = [] } = {}) {
  const { sine } = getPlotsFromFormulas(formulas);
  let result = '';
  sine.forEach((points, idx) => {
    const header = `ASCII Art of Sine Wave - Formula ${idx + 1}:\n`;
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
    result += header + grid.map(row => row.join('')).join('\n') + '\n\n';
  });
  return result;
}

function plotToText({ formulas = [] } = {}) {
  const { quadratic, linear, sine, polar } = getPlotsFromFormulas(formulas);
  let output = '';
  output += 'Quadratic Plot:\n' + quadratic.map((points, i) => `Formula ${i+1}: ` + points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' ')).join('\n') + '\n\n';
  output += 'Linear Plot:\n' + linear.map((points, i) => `Formula ${i+1}: ` + points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' ')).join('\n') + '\n\n';
  output += 'Sine Plot:\n' + sine.map((points, i) => `Formula ${i+1}: ` + points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' ')).join('\n') + '\n\n';
  output += 'Polar Plot:\n' + polar.map((points, i) => `Formula ${i+1}: ` + points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(' ')).join('\n') + '\n';
  return output;
}

function plotToJson({ formulas = [] } = {}) {
  const { quadratic, linear, sine, polar } = getPlotsFromFormulas(formulas);
  return {
    quadratic,
    linear,
    sine,
    polar
  };
}

function plotToCsv({ formulas = [] } = {}) {
  const { quadratic, linear, sine, polar } = getPlotsFromFormulas(formulas);
  const lines = [];
  lines.push('Plot, Formula, x, y');
  lines.push('--Quadratic Plot--');
  quadratic.forEach((points, i) => {
    points.forEach(p => {
      lines.push(`Quadratic,Formula ${i+1},${p.x.toFixed(2)},${p.y.toFixed(2)}`);
    });
  });
  lines.push('');
  lines.push('--Linear Plot--');
  linear.forEach((points, i) => {
    points.forEach(p => {
      lines.push(`Linear,Formula ${i+1},${p.x.toFixed(2)},${p.y.toFixed(2)}`);
    });
  });
  lines.push('');
  lines.push('--Sine Plot--');
  sine.forEach((points, i) => {
    points.forEach(p => {
      lines.push(`Sine,Formula ${i+1},${p.x.toFixed(2)},${p.y.toFixed(2)}`);
    });
  });
  lines.push('');
  lines.push('--Polar Plot--');
  polar.forEach((points, i) => {
    points.forEach(p => {
      lines.push(`Polar,Formula ${i+1},${p.x.toFixed(2)},${p.y.toFixed(2)}`);
    });
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

  // Added version flag support - version updated to match package version
  if (args.includes('--version')) {
    console.log('Equation Plotter Library version 0.1.1-38');
    process.exit(0);
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node src/lib/main.js [outputFileName] [formulaStrings...]\n\nOptions:\n  --help, -h       Show this help message\n  --json           Generate output as JSON instead of SVG\n  --csv            Generate output as CSV instead of SVG\n  --ascii          Generate output as ASCII art instead of SVG\n  --version        Show version information\n  (output file extension .html will generate HTML output)\n\nFormula String Formats:\n  Quadratic: "y=x^2+2*x+1" or "x^2+y-1=0"\n  Linear:    "linear:m,b[,xMin,xMax,step]"\n  Sine:      "sine:amplitude,frequency,phase[,xMin,xMax,step]"\n  Polar:     "polar:scale,multiplier[,step]"\n`);
    process.exit(0);
  }

  let outputFileName = 'output.svg';
  let isJson = args.includes('--json');
  let isCsv = args.includes('--csv');
  let isHtml = false;
  let isAscii = args.includes('--ascii');

  const nonFormulaArgs = args.filter(arg => !arg.includes(':') && !arg.includes('=') && arg !== '--json' && arg !== '--csv' && arg !== '--version' && arg !== '--ascii');
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
  } else if (outputFileName.toLowerCase().endsWith('.txt') || outputFileName.toLowerCase().endsWith('.ascii')) {
    isAscii = true;
  }

  // Collect formulas from arguments
  const formulasList = args.filter(arg => arg.includes(':') || arg.includes('='));
  const { quadratic, linear, sine, polar } = getPlotsFromFormulas(formulasList);

  console.log('Demo: Raw formula strings and their parsed representations:');

  const rawQuad = 'x^2+y-1=0';
  console.log(`Raw Formula: "${rawQuad}"`);
  console.log('Parsed representation for Quadratic from Raw Formula:');
  displayPlot('Quadratic from Raw Formula', plotFromString(rawQuad));

  const rawLinear = 'linear:1,0,-10,10,1';
  console.log(`\nRaw Formula: "${rawLinear}"`);
  console.log('Parsed representation for Linear from Raw Formula:');
  displayPlot('Linear from Raw Formula', plotFromString(rawLinear));

  const rawSine = 'sine:1,1,0,0,360,10';
  console.log(`\nRaw Formula: "${rawSine}"`);
  console.log('Parsed ASCII Art for Sine:');
  console.log(plotToAscii({ formulas: [rawSine] }));

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
  } else if (isAscii) {
    fileContent = plotToAscii({ formulas: formulasList });
  } else {
    fileContent = plotToSvg({ formulas: formulasList });
  }

  try {
    fs.writeFileSync(outputFileName, fileContent, 'utf8');
    console.log(`\n${isJson ? 'JSON' : isCsv ? 'CSV' : isHtml ? 'HTML' : isAscii ? 'ASCII' : 'SVG'} file generated: ${outputFileName}`);
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

export { plotToSvg, plotToAscii, plotToText, plotToJson, plotToCsv, plotToHtml, plotToFile, plotFromString, plotQuadratic, plotSine, plotPolar, plotLinear };
