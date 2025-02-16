#!/usr/bin/env node

"use strict";

/**
 * Equation Plotter Library
 *
 * Description:
 *   A lightweight library for generating plots of mathematical equations with export options in SVG, JSON, CSV, HTML, ASCII, and text formats.
 *   It supports different mathematical functions including quadratic, sine, polar, linear, exponential, and logarithmic equations.
 *
 * Features:
 *   - Quadratic Plot: Generates data for y = ax² + bx + c, supporting both standard algebraic and prefixed formula strings. Also supports prefix alias 'quad:'
 *   - Sine Plot: Generates data for y = A*sin(B*x + C) with control over amplitude, frequency, phase, and x range.
 *   - Polar Plot: Generates data for r = scale * |sin(multiplier*θ)|, useful for polar function visualizations.
 *   - Linear Plot: Generates data for y = m*x + b with control over slope, intercept, and x range. Supports both prefixed and standard algebraic formats (e.g., "y=2x+3" or "y=2x+3:-10,10,1").
 *   - Exponential Plot: Generates data for y = a * e^(b*x) with control over coefficients and x range. Accepts formulas in the format "exponential:a,b,xMin,xMax,step" or shortened as "exp:".
 *   - Logarithmic Plot: Generates data for y = a*log_b(x) with control over coefficient, base, and x range. Accepts formulas in the format "log:a,base,xMin,xMax,step" or "ln:" (for natural logarithm with base e).
 *   - Export Options: Outputs plots as SVG for graphics, ASCII art for console visualization, plain text, JSON, CSV, or full HTML embedding the SVG.
 *   - Customization: Offers interactive features like zoom and pan, along with styling options for grid, axes, and curves.
 *   - Multiple Formulas per Plot Type: Supports multiple formulas for each plot type, each rendered with a distinct color.
 *   - Debug Option: Added a '--debug' flag to output the parsed internal representation of plots.
 *   - Grid Option: Added a '--grid' flag to overlay light grid lines on SVG plots for better visual reference.
 *   - Axes Display: When grid is enabled, axes lines are drawn to provide better plotting context.
 *   - Dealer's Choice Option: Added a '--dealers-choice' flag to apply a randomized color palette to SVG plots. (Dealers Choice: each plot series gets its own random color)
 *
 * CLI Usage Examples:
 *   $ node src/lib/main.js output.svg "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.json --json "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.csv --csv "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.html "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.txt --ascii "x^2+y-1=0" "sine:1,1,0,0,360,10"
 *   $ node src/lib/main.js output.svg "linear:1,0,-10,10,1" "x^2+y-1=0" "sine:1,1,0,0,360,10" "polar:200,2,5"
 *   $ node src/lib/main.js output.svg "exp:1,0.1,-10,10,1" "quad:x^2+y-1=0"
 *   $ node src/lib/main.js output.svg "log:1,10,1,100,1" "quad:x^2+y-1=0"
 *
 * API Usage Example:
 *   import { plotToSvg, plotToJson, plotToCsv, plotToHtml } from './main.js';
 *   const svg = plotToSvg({ formulas: ["x^2+y-1=0", "sine:1,1,0,0,360,10"] });
 *
 * Installation:
 *   Install via npm with the required dependencies. See package.json for more details.
 *
 * License: MIT
 *
 * Updated:
 *   Version flag updated to 0.1.1-72 and documentation improved per issue-123 and issue-126. Generic quadratic and exponential parsing functions are now exported for extended usage.
 *   Added dealer's choice option to randomize SVG color palettes per '--dealers-choice' flag.
 */

import { fileURLToPath } from "url";
import fs from "fs";

// Helper function to format numbers to two decimals and avoid negative zero
function formatNumber(n) {
  let s = n.toFixed(2);
  return s === "-0.00" ? "0.00" : s;
}

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

function plotExponentialParam({ a = 1, b = 1, xMin = -10, xMax = 10, step = 1 } = {}) {
  const points = [];
  for (let x = xMin; x <= xMax; x += step) {
    points.push({ x, y: a * Math.exp(b * x) });
  }
  return points;
}

function plotLogarithmicParam({ a = 1, base = Math.E, xMin = 1, xMax = 10, step = 1 } = {}) {
  const points = [];
  for (let x = xMin; x <= xMax; x += step) {
    // Ensure x is positive for logarithm
    if (x > 0) {
      points.push({ x, y: a * (Math.log(x) / Math.log(base)) });
    }
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

function plotExponential() {
  return plotExponentialParam();
}

function plotLogarithmic() {
  return plotLogarithmicParam();
}

// ----------------------------------
// Formula Parsing Functions
// ----------------------------------

function parseQuadratic(formulaStr) {
  const parts = formulaStr.split(":" );
  if (parts.length < 2) throw new Error("Invalid quadratic formula string");
  const params = parts[1].split(",").map(Number);
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
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid sine formula string");
  const params = parts[1].split(",").map(Number);
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
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid polar formula string");
  const params = parts[1].split(",").map(Number);
  const scale = isNaN(params[0]) ? 200 : params[0];
  const multiplier = isNaN(params[1]) ? 2 : params[1];
  let step = 5;
  let degMin = 0;
  let degMax = 360;
  if (params.length >= 3) {
    step = isNaN(params[2]) ? 5 : params[2];
  }
  if (params.length >= 5) {
    degMin = isNaN(params[3]) ? 0 : params[3];
    degMax = isNaN(params[4]) ? 360 : params[4];
  }
  return plotPolarParam({ scale, multiplier, step, degMin, degMax });
}

function parseLinear(formulaStr) {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid linear formula string");
  const params = parts[1].split(",").map(Number);
  const [m, b, xMin, xMax, step] = params;
  return plotLinearParam({
    m: isNaN(m) ? 1 : m,
    b: isNaN(b) ? 0 : b,
    xMin: isNaN(xMin) ? -10 : xMin,
    xMax: isNaN(xMax) ? 10 : xMax,
    step: isNaN(step) ? 1 : step
  });
}

// New: Parse a generic linear formula in standard algebraic form, e.g., "y=2x+3" with optional range parameters (e.g., "y=2x+3:-10,10,1")
function parseGenericLinear(formulaStr) {
  let parts = formulaStr.split(":");
  let exprPart = parts[0].replace(/\s+/g, "");
  let rangePart = parts.length > 1 ? parts[1].trim() : "";
  if (!exprPart.toLowerCase().startsWith("y=")) {
    throw new Error("Linear formula must start with 'y='");
  }
  let expr = exprPart.substring(2);
  // Ensure it's linear by checking absence of x^2
  if (expr.includes("x^2")) {
    throw new Error("Detected quadratic term in what should be a linear formula");
  }
  let m = 1, b = 0;
  const mMatch = expr.match(/^([+-]?\d*\.?\d+)?\*?x/);
  if (mMatch) {
    m = (mMatch[1] === "" || mMatch[1] === undefined) ? 1 : parseFloat(mMatch[1]);
  }
  const bMatch = expr.match(/([+-]\d*\.?\d+)(?!\*?x)/);
  if (bMatch) {
    b = parseFloat(bMatch[1]);
  }
  let xMin = -10, xMax = 10, step = 1;
  if (rangePart) {
    const rangeParams = rangePart.split(",").map(Number);
    if (rangeParams.length > 0 && !isNaN(rangeParams[0])) xMin = rangeParams[0];
    if (rangeParams.length > 1 && !isNaN(rangeParams[1])) xMax = rangeParams[1];
    if (rangeParams.length > 2 && !isNaN(rangeParams[2])) step = rangeParams[2];
  }
  return plotLinearParam({ m, b, xMin, xMax, step });
}

// New: Parse a generic quadratic formula in standard algebraic form with optional range, e.g., "y=x^2+2*x+1" or "y=x^2+2*x+1:-10,10,1"
function parseGenericQuadratic(formulaStr) {
  let parts = formulaStr.split(":");
  let mainPart = parts[0].replace(/\s+/g, "");
  let rangePart = parts.length > 1 ? parts[1].trim() : "";
  let xMin = -10, xMax = 10, step = 1;
  if (rangePart) {
    const rangeParams = rangePart.split(",").map(Number);
    if (rangeParams.length > 0 && !isNaN(rangeParams[0])) xMin = rangeParams[0];
    if (rangeParams.length > 1 && !isNaN(rangeParams[1])) xMax = rangeParams[1];
    if (rangeParams.length > 2 && !isNaN(rangeParams[2])) step = rangeParams[2];
  }

  if (mainPart.toLowerCase().startsWith("y=")) {
    const yExpr = mainPart.substring(2);
    const coeffs = extractQuadraticCoefficients(yExpr);
    return plotQuadraticParam({ ...coeffs, xMin, xMax, step });
  } else if (mainPart.endsWith("=0")) {
    const left = mainPart.split("=")[0];
    const yRegex = /([+-]?(?:\d*\.?\d*)?)y/;
    const yMatch = left.match(yRegex);
    if (!yMatch) throw new Error("No y term found in equation");
    const coeffStr = yMatch[1];
    const yCoeff = (coeffStr === "" || coeffStr === "+") ? 1 : (coeffStr === "-") ? -1 : parseFloat(coeffStr);
    const remaining = left.replace(yRegex, "");
    const cleanedRemaining = remaining.replace(/^\+/, "");
    const coeffs = extractQuadraticCoefficients(cleanedRemaining);
    return plotQuadraticParam({
      a: -coeffs.a / yCoeff,
      b: -coeffs.b / yCoeff,
      c: -coeffs.c / yCoeff,
      xMin,
      xMax,
      step
    });
  } else {
    const partsEq = mainPart.split("=");
    if (partsEq.length !== 2) throw new Error("Unsupported formula format for quadratic parsing");
    const left = partsEq[0];
    const right = partsEq[1] || "0";
    if (left.includes("y")) {
      const yMatch = left.match(/([+-]?\d*\.?\d*)y/);
      let yCoeff = 1;
      if (yMatch) {
        const coeffStr = yMatch[1];
        if (coeffStr === "" || coeffStr === "+") yCoeff = 1;
        else if (coeffStr === "-") yCoeff = -1;
        else yCoeff = parseFloat(coeffStr);
      }
      const remaining = left.replace(/([+-]?\d*\.?\d*)y/, "");
      const constantRight = parseFloat(right) || 0;
      const coeffs = extractQuadraticCoefficients(remaining);
      return plotQuadraticParam({
        a: -coeffs.a / yCoeff,
        b: -coeffs.b / yCoeff,
        c: (constantRight - coeffs.c) / yCoeff,
        xMin,
        xMax,
        step
      });
    } else if (right.includes("y")) {
      const yMatch = right.match(/([+-]?\d*\.?\d*)y/);
      let yCoeff = 1;
      if (yMatch) {
        const coeffStr = yMatch[1];
        if (coeffStr === "" || coeffStr === "+") yCoeff = 1;
        else if (coeffStr === "-") yCoeff = -1;
        else yCoeff = parseFloat(coeffStr);
      }
      const remaining = right.replace(/([+-]?\d*\.?\d*)y/, "");
      const constantLeft = parseFloat(left) || 0;
      const coeffs = extractQuadraticCoefficients(remaining);
      return plotQuadraticParam({
        a: -coeffs.a / yCoeff,
        b: -coeffs.b / yCoeff,
        c: (constantLeft - coeffs.c) / yCoeff,
        xMin,
        xMax,
        step
      });
    } else {
      const nonYPart = left;
      const newExpr = (right || "0") + invertExpression(nonYPart);
      return plotQuadraticParam({ ...extractQuadraticCoefficients(newExpr), xMin, xMax, step });
    }
  }
}

// New: Parse exponential formula string in the format "exponential:a,b,xMin,xMax,step" or "exp:a,b,xMin,xMax,step" or in algebraic form
function parseExponential(formulaStr) {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid exponential formula string");
  const params = parts[1].split(",").map(Number);
  const [a, b, xMin, xMax, step] = params;
  return plotExponentialParam({
    a: isNaN(a) ? 1 : a,
    b: isNaN(b) ? 1 : b,
    xMin: isNaN(xMin) ? -10 : xMin,
    xMax: isNaN(xMax) ? 10 : xMax,
    step: isNaN(step) ? 1 : step
  });
}

// New: Parse a generic exponential formula in algebraic form, e.g., "y=2*e^(0.5x)" optionally with range e.g., "y=2*e^(0.5x):-10,10,1"
function parseGenericExponential(formulaStr) {
  let parts = formulaStr.split(":");
  let exprPart = parts[0].replace(/\s+/g, "");
  let rangePart = parts.length > 1 ? parts[1].trim() : "";
  let xMin = -10, xMax = 10, step = 1;
  if (rangePart) {
    const rangeParams = rangePart.split(",").map(Number);
    if (rangeParams.length > 0 && !isNaN(rangeParams[0])) xMin = rangeParams[0];
    if (rangeParams.length > 1 && !isNaN(rangeParams[1])) xMax = rangeParams[1];
    if (rangeParams.length > 2 && !isNaN(rangeParams[2])) step = rangeParams[2];
  }
  // Improved regex to allow optional multiplication symbol before x
  let regex = /^y=([+-]?\d*\.?\d+)?\*?e\^\(?([+-]?\d*\.?\d+)(?:\*?x)\)?/i;
  let match = exprPart.match(regex);
  if (match) {
    let a = match[1] ? parseFloat(match[1]) : 1;
    let b = parseFloat(match[2]);
    return plotExponentialParam({ a, b, xMin, xMax, step });
  } else {
    throw new Error("Invalid generic exponential formula string");
  }
}

// New: Parse logarithmic formula string in the format "log:a,base,xMin,xMax,step" or "ln:a,base,xMin,xMax,step"
function parseLogarithmic(formulaStr) {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid logarithmic formula string");
  const params = parts[1].split(",").map(Number);
  const [a, base, xMin, xMax, step] = params;
  return plotLogarithmicParam({
    a: isNaN(a) ? 1 : a,
    base: isNaN(base) ? Math.E : base,
    xMin: isNaN(xMin) ? 1 : xMin,
    xMax: isNaN(xMax) ? 10 : xMax,
    step: isNaN(step) ? 1 : step
  });
}

// Extract quadratic coefficients from an expression of form ax^2+bx+c
function extractQuadraticCoefficients(expr) {
  expr = expr.replace(/\s+/g, "");
  // New improvement: normalize expression by replacing '+-' with '-'
  expr = expr.replace(/\+\-/g, "-");
  let a = 0;
  let b = 0;
  let c = 0;

  const aMatch = expr.match(/([+-]?\d*\.?\d*)x\^2/);
  if (aMatch) {
    const coeff = aMatch[1];
    if (coeff === "" || coeff === "+") a = 1;
    else if (coeff === "-") a = -1;
    else a = parseFloat(coeff);
    expr = expr.replace(aMatch[0], "");
  }

  const bMatch = expr.match(/([+-]?\d*\.?\d+)x(?!\^)/);
  if (bMatch) {
    const coeff = bMatch[1];
    if (coeff === "" || coeff === "+") b = 1;
    else if (coeff === "-") b = -1;
    else b = parseFloat(coeff);
    expr = expr.replace(bMatch[0], "");
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
  const inverted = tokens
    .map((token) => {
      token = token.trim();
      if (token.startsWith("-")) return "+" + token.slice(1);
      else return "-" + token;
    })
    .join("");
  return inverted[0] === "+" ? inverted.slice(1) : inverted;
}

// Delegate plotting based on formula string content
function plotFromString(formulaStr) {
  const lowerStr = formulaStr.toLowerCase();
  if (lowerStr.startsWith("log:") || lowerStr.startsWith("ln:")) return parseLogarithmic(formulaStr);
  if (formulaStr.includes(":")) {
    if (lowerStr.startsWith("quadratic:") || lowerStr.startsWith("quad:")) return parseQuadratic(formulaStr);
    if (lowerStr.startsWith("sine:")) return parseSine(formulaStr);
    if (lowerStr.startsWith("polar:")) return parsePolar(formulaStr);
    if (lowerStr.startsWith("linear:")) return parseLinear(formulaStr);
    if (lowerStr.startsWith("exponential:") || lowerStr.startsWith("exp:")) return parseExponential(formulaStr);
    console.error("Unknown prefixed formula type.");
    return [];
  } else if (formulaStr.includes("=")) {
    if (lowerStr.startsWith("y=")) {
      if (formulaStr.toLowerCase().includes("e^")) {
        try {
          return parseGenericExponential(formulaStr);
        } catch (e) {
          console.error("Error parsing exponential formula:", e.message);
          return [];
        }
      } else if (formulaStr.toLowerCase().includes("log(")) {
        try {
          return parseLogarithmic(formulaStr);
        } catch (e) {
          console.error("Error parsing logarithmic formula:", e.message);
          return [];
        }
      } else if (!formulaStr.includes("x^2")) {
        try {
          return parseGenericLinear(formulaStr);
        } catch (e) {
          console.error("Error parsing linear formula:", e.message);
          return [];
        }
      } else {
        try {
          return parseGenericQuadratic(formulaStr);
        } catch (e) {
          console.error("Error parsing generic quadratic formula:", e.message);
          return [];
        }
      }
    } else {
      try {
        return parseGenericQuadratic(formulaStr);
      } catch (e) {
        console.error("Error parsing generic quadratic formula:", e.message);
        return [];
      }
    }
  } else {
    console.error("Formula string is not in a recognized format.");
    return [];
  }
}

// Helper function to parse formulas and return plots grouped by type
function getPlotsFromFormulas(formulas = []) {
  const quadratic = [];
  const sine = [];
  const polar = [];
  const linear = [];
  const exponential = [];
  const logarithmic = [];
  formulas.forEach((formula) => {
    const lower = formula.toLowerCase();
    try {
      if (lower.startsWith("quad:") || lower.startsWith("quadratic:") || (formula.includes("x^2") && formula.includes("="))) {
        quadratic.push(plotFromString(formula));
      } else if (lower.startsWith("sine:")) {
        sine.push(plotFromString(formula));
      } else if (lower.startsWith("polar:")) {
        polar.push(plotFromString(formula));
      } else if (lower.startsWith("linear:") || (lower.startsWith("y=") && !formula.includes("x^2") && !formula.toLowerCase().includes("e^") && !formula.toLowerCase().includes("log("))) {
        linear.push(plotFromString(formula));
      } else if (lower.startsWith("exponential:") || lower.startsWith("exp:") || (lower.startsWith("y=") && formula.toLowerCase().includes("e^"))) {
        exponential.push(plotFromString(formula));
      } else if (lower.startsWith("log:") || lower.startsWith("ln:") || (lower.startsWith("y=") && formula.toLowerCase().includes("log("))) {
        logarithmic.push(plotFromString(formula));
      } else {
        console.error("Unrecognized formula: " + formula);
      }
    } catch (e) {
      console.error("Error parsing formula:", formula, e.message);
    }
  });
  if (quadratic.length === 0) quadratic.push(plotQuadratic());
  if (linear.length === 0) linear.push(plotLinear());
  if (sine.length === 0) sine.push(plotSine());
  if (polar.length === 0) polar.push(plotPolar());
  if (exponential.length === 0) exponential.push(plotExponential());
  if (logarithmic.length === 0) logarithmic.push(plotLogarithmic());
  return { quadratic, linear, sine, polar, exponential, logarithmic };
}

// ----------------------------------
// Display Functions
// ----------------------------------

function displayPlot(plotName, points) {
  console.log(`Plot for ${plotName}:`);
  console.log(points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" "));
}

// ----------------------------------
// SVG Generation Function
// ----------------------------------

function generateSvg(quadraticPlots, linearPlots, sinePlots, polarPlots, exponentialPlots, logarithmicPlots, gridEnabled = false, dealersChoice = false) {
  // New SVG with 6 plots arranged in separate slots
  const width = 800;
  const height = 1500;
  let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  // Added preserveAspectRatio attribute for better SVG scaling
  svg += `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <rect width="100%" height="100%" fill="white" />\n`;

  // Dealers Choice Implementation: if dealersChoice is true, assign a unique random color for each plot series
  function randomColor() {
    // Updated to use 16777216 to include full spectrum up to #ffffff
    return '#' + Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  }

  // Define color palettes for each plot type
  let quadraticColors, linearColors, sineColors, polarColors, exponentialColors, logarithmicColors;
  if (dealersChoice) {
    // For dealers choice, assign a random color to each individual plot series
    quadraticColors = quadraticPlots.map(() => randomColor());
    linearColors = linearPlots.map(() => randomColor());
    sineColors = sinePlots.map(() => randomColor());
    polarColors = polarPlots.map(() => randomColor());
    exponentialColors = exponentialPlots.map(() => randomColor());
    logarithmicColors = logarithmicPlots.map(() => randomColor());
  } else {
    quadraticColors = ["blue", "darkblue", "purple", "royalblue", "deepskyblue"];
    linearColors = ["orange", "darkorange", "gold", "chocolate", "peru"];
    sineColors = ["red", "darkred", "crimson", "firebrick", "tomato"];
    polarColors = ["green", "darkgreen", "limegreen", "seagreen", "forestgreen"];
    exponentialColors = ["magenta", "darkmagenta", "violet", "indigo", "purple"];
    logarithmicColors = ["brown", "saddlebrown", "peru", "chocolate", "tan"];
  }

  // Helper to draw grid for rectangular slots
  function drawRectGrid(x, y, w, h, vCount, hCount) {
    let grid = "";
    for (let i = 0; i <= vCount; i++) {
      let gx = x + i * (w / vCount);
      grid += `  <line x1="${formatNumber(gx)}" y1="${formatNumber(y)}" x2="${formatNumber(gx)}" y2="${formatNumber(y + h)}" stroke="#eee" stroke-width="1" />\n`;
    }
    for (let i = 0; i <= hCount; i++) {
      let gy = y + i * (h / hCount);
      grid += `  <line x1="${formatNumber(x)}" y1="${formatNumber(gy)}" x2="${formatNumber(x + w)}" y2="${formatNumber(gy)}" stroke="#eee" stroke-width="1" />\n`;
    }
    return grid;
  }

  // Helper to draw axes lines for rectangular slots
  function drawRectAxes(x, y, w, h, minX, maxX, minY, maxY) {
    let axes = "";
    // Draw horizontal axis if 0 is within y range
    if (0 >= minY && 0 <= maxY) {
      let zeroY = y + h - ((0 - minY) / (maxY - minY)) * h;
      axes += `  <line x1="${formatNumber(x)}" y1="${formatNumber(zeroY)}" x2="${formatNumber(x + w)}" y2="${formatNumber(zeroY)}" stroke="black" stroke-width="1" />\n`;
    }
    // Draw vertical axis if 0 is within x range
    if (0 >= minX && 0 <= maxX) {
      let zeroX = x + ((0 - minX) / (maxX - minX)) * w;
      axes += `  <line x1="${formatNumber(zeroX)}" y1="${formatNumber(y)}" x2="${formatNumber(zeroX)}" y2="${formatNumber(y + h)}" stroke="black" stroke-width="1" />\n`;
    }
    return axes;
  }

  // Slot 1: Quadratic Plot (Area: y=50 to 230)
  svg += `  <text x="${width / 2}" y="30" font-size="16" text-anchor="middle">Quadratic Plot: y = ax² + bx + c</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 50, 700, 180, 10, 5);
    svg += drawRectAxes(50, 50, 700, 180, Math.min(...quadraticPlots.flat().map(p => p.x)), Math.max(...quadraticPlots.flat().map(p => p.x)), Math.min(...quadraticPlots.flat().map(p => p.y)), Math.max(...quadraticPlots.flat().map(p => p.y)));
  }
  const qAllPoints = quadraticPlots.flat();
  const qValues = qAllPoints.map((p) => p.y);
  let qMinY = Math.min(...qValues);
  let qMaxY = Math.max(...qValues);
  if (qMinY === qMaxY) {
    qMinY -= 10;
    qMaxY += 10;
  }
  const qAllX = qAllPoints.map((p) => p.x);
  let qMinX = Math.min(...qAllX);
  let qMaxX = Math.max(...qAllX);
  if (qMinX === qMaxX) {
    qMinX -= 10;
    qMaxX += 10;
  }
  quadraticPlots.forEach((points, idx) => {
    const color = quadraticColors[idx % quadraticColors.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - qMinX) / (qMaxX - qMinX)) * 700;
        const py = 230 - ((p.y - qMinY) / (qMaxY - qMinY)) * 180;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += `\n`;

  // Slot 2: Linear Plot (Area: y=270 to 450)
  svg += `  <text x="${width / 2}" y="250" font-size="16" text-anchor="middle">Linear Plot: y = m*x + b</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 270, 700, 180, 10, 5);
    svg += drawRectAxes(50, 270, 700, 180, Math.min(...linearPlots.flat().map(p => p.x)), Math.max(...linearPlots.flat().map(p => p.x)), Math.min(...linearPlots.flat().map(p => p.y)), Math.max(...linearPlots.flat().map(p => p.y)));
  }
  const lAllPoints = linearPlots.flat();
  const lValues = lAllPoints.map((p) => p.y);
  let lMinY = Math.min(...lValues);
  let lMaxY = Math.max(...lValues);
  if (lMinY === lMaxY) {
    lMinY -= 10;
    lMaxY += 10;
  }
  const lAllX = linearPlots.flat().map((p) => p.x);
  let lMinX = Math.min(...lAllX);
  let lMaxX = Math.max(...lAllX);
  if (lMinX === lMaxX) {
    lMinX -= 10;
    lMaxX += 10;
  }
  linearPlots.forEach((points, idx) => {
    const color = linearColors[idx % linearColors.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - lMinX) / (lMaxX - lMinX)) * 700;
        const py = 450 - ((p.y - lMinY) / (lMaxY - lMinY)) * 180;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += `\n`;

  // Slot 3: Sine Plot (Area: y=490 to 670)
  svg += `  <text x="${width / 2}" y="470" font-size="16" text-anchor="middle">Sine Plot: y = A*sin(B*x + C)</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 490, 700, 180, 10, 5);
    svg += drawRectAxes(50, 490, 700, 180, Math.min(...sinePlots.flat().map(p => p.x)), Math.max(...sinePlots.flat().map(p => p.x)), Math.min(...sinePlots.flat().map(p => p.y)), Math.max(...sinePlots.flat().map(p => p.y)));
  }
  const sAllPoints = sinePlots.flat();
  const sValues = sAllPoints.map((p) => p.y);
  let sMinY = Math.min(...sValues);
  let sMaxY = Math.max(...sValues);
  if (sMinY === sMaxY) {
    sMinY -= 1;
    sMaxY += 1;
  }
  const sAllX = sinePlots.flat().map((p) => p.x);
  let sMinX = Math.min(...sAllX);
  let sMaxX = Math.max(...sAllX);
  if (sMinX === sMaxX) {
    sMinX -= 10;
    sMaxX += 10;
  }
  sinePlots.forEach((points, idx) => {
    const color = sineColors[idx % sineColors.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - sMinX) / (sMaxX - sMinX)) * 700;
        const py = 670 - ((p.y - sMinY) / (sMaxY - sMinY)) * 180;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += `\n`;

  // Slot 4: Polar Plot (centered in slot, use center at (400,750))
  svg += `  <text x="${width / 2}" y="690" font-size="16" text-anchor="middle">Polar Plot: r = scale * |sin(multiplier * θ)|</text>\n`;
  const centerX = width / 2;
  const centerY = 750;
  if (gridEnabled) {
    // Draw concentric circles as grid
    [50, 100, 150].forEach(r => {
      svg += `  <circle cx="${formatNumber(centerX)}" cy="${formatNumber(centerY)}" r="${r}" stroke="#eee" stroke-width="1" fill="none" />\n`;
    });
    // Draw cross axes for polar plot
    svg += `  <line x1="${formatNumber(centerX - 150)}" y1="${formatNumber(centerY)}" x2="${formatNumber(centerX + 150)}" y2="${formatNumber(centerY)}" stroke="black" stroke-width="1" />\n`;
    svg += `  <line x1="${formatNumber(centerX)}" y1="${formatNumber(centerY - 150)}" x2="${formatNumber(centerX)}" y2="${formatNumber(centerY + 150)}" stroke="black" stroke-width="1" />\n`;
  }
  polarPlots.forEach((points, idx) => {
    const color = polarColors[idx % polarColors.length];
    const pts = points
      .map((p) => {
        const px = centerX + p.x;
        const py = centerY - p.y;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += `\n`;

  // Slot 5: Exponential Plot (Area: y=1020 to 1200)
  svg += `  <text x="${width / 2}" y="1000" font-size="16" text-anchor="middle">Exponential Plot: y = a * e^(b*x)</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 1020, 700, 180, 10, 5);
    svg += drawRectAxes(50, 1020, 700, 180, Math.min(...exponentialPlots.flat().map(p => p.x)), Math.max(...exponentialPlots.flat().map(p => p.x)), Math.min(...exponentialPlots.flat().map(p => p.y)), Math.max(...exponentialPlots.flat().map(p => p.y)));
  }
  const expAllPoints = exponentialPlots.flat();
  const expValues = expAllPoints.map((p) => p.y);
  let expMinY = Math.min(...expValues);
  let expMaxY = Math.max(...expValues);
  if (expMinY === expMaxY) {
    expMinY -= 10;
    expMaxY += 10;
  }
  const expAllX = exponentialPlots.flat().map((p) => p.x);
  let expMinX = Math.min(...expAllX);
  let expMaxX = Math.max(...expAllX);
  if (expMinX === expMaxX) {
    expMinX -= 10;
    expMaxX += 10;
  }
  exponentialPlots.forEach((points, idx) => {
    const color = exponentialColors[idx % exponentialColors.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - expMinX) / (expMaxX - expMinX)) * 700;
        const py = 1200 - ((p.y - expMinY) / (expMaxY - expMinY)) * 180;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += `\n`;

  // Slot 6: Logarithmic Plot (Area: y=1230 to 1410)
  svg += `  <text x="${width / 2}" y="1210" font-size="16" text-anchor="middle">Logarithmic Plot: y = a * log_b(x)</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 1230, 700, 180, 10, 5);
    svg += drawRectAxes(50, 1230, 700, 180, Math.min(...logarithmicPlots.flat().map(p => p.x)), Math.max(...logarithmicPlots.flat().map(p => p.x)), Math.min(...logarithmicPlots.flat().map(p => p.y)), Math.max(...logarithmicPlots.flat().map(p => p.y)));
  }
  const logAllPoints = logarithmicPlots.flat();
  const logValues = logAllPoints.map((p) => p.y);
  let logMinY = Math.min(...logValues);
  let logMaxY = Math.max(...logValues);
  if (logMinY === logMaxY) {
    logMinY -= 10;
    logMaxY += 10;
  }
  const logAllX = logAllPoints.map((p) => p.x);
  let logMinX = Math.min(...logAllX);
  let logMaxX = Math.max(...logAllX);
  if (logMinX === logMaxX) {
    logMinX -= 10;
    logMaxX += 10;
  }
  logarithmicPlots.forEach((points, idx) => {
    const color = logarithmicColors[idx % logarithmicColors.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - logMinX) / (logMaxX - logMinX)) * 700;
        const py = 1410 - ((p.y - logMinY) / (logMaxY - logMinY)) * 180;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });

  svg += "</svg>";
  return svg;
}

// ----------------------------------
// HTML Generation Function
// ----------------------------------

function plotToHtml({ formulas = [], grid = false, dealersChoice = false } = {}) {
  const svgContent = plotToSvg({ formulas, grid, dealersChoice });
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Equation Plot</title>\n  <style>\n    body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8f8f8; }\n  </style>\n</head>\n<body>\n\ndefault\n${svgContent}\n</body>\n</html>`;
}

// ----------------------------------
// Exported API Functions
// ----------------------------------

function plotToSvg({ formulas = [], grid = false, dealersChoice = false } = {}) {
  const { quadratic, linear, sine, polar, exponential, logarithmic } = getPlotsFromFormulas(formulas);
  return generateSvg(quadratic, linear, sine, polar, exponential, logarithmic, grid, dealersChoice);
}

function plotToAscii({ formulas = [] } = {}) {
  const { sine } = getPlotsFromFormulas(formulas);
  let result = "";
  sine.forEach((points, idx) => {
    const header = `ASCII Art of Sine Wave - Formula ${idx + 1}:\n`;
    const rows = 21;
    const cols = points.length;
    const grid = Array.from({ length: rows }, () => new Array(cols).fill(" "));

    for (let col = 0; col < cols; col++) {
      const { y } = points[col];
      const row = Math.round((1 - (y + 1) / 2) * (rows - 1));
      grid[row][col] = "*";
    }

    const xAxisRow = Math.round(0.5 * (rows - 1));
    for (let col = 0; col < cols; col++) {
      if (grid[xAxisRow][col] === " ") grid[xAxisRow][col] = "-";
    }
    result += header + grid.map((row) => row.join(" ")).join("\n") + "\n\n";
  });
  return result;
}

function plotToText({ formulas = [] } = {}) {
  const { quadratic, linear, sine, polar, exponential, logarithmic } = getPlotsFromFormulas(formulas);
  let output = "";
  output +=
    "Quadratic Plot:\n" +
    quadratic
      .map((points, i) => `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" "))
      .join("\n") +
    "\n\n";
  output +=
    "Linear Plot:\n" +
    linear
      .map((points, i) => `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" "))
      .join("\n") +
    "\n\n";
  output +=
    "Sine Plot:\n" +
    sine
      .map((points, i) => `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" "))
      .join("\n") +
    "\n\n";
  output +=
    "Polar Plot:\n" +
    polar
      .map((points, i) => `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" "))
      .join("\n") +
    "\n\n";
  output +=
    "Exponential Plot:\n" +
    exponential
      .map((points, i) => `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" "))
      .join("\n") +
    "\n\n";
  output +=
    "Logarithmic Plot:\n" +
    logarithmic
      .map((points, i) => `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" "))
      .join("\n") +
    "\n";
  return output;
}

function plotToJson({ formulas = [] } = {}) {
  const { quadratic, linear, sine, polar, exponential, logarithmic } = getPlotsFromFormulas(formulas);
  return {
    quadratic,
    linear,
    sine,
    polar,
    exponential,
    logarithmic
  };
}

function plotToCsv({ formulas = [] } = {}) {
  const { quadratic, linear, sine, polar, exponential, logarithmic } = getPlotsFromFormulas(formulas);
  const lines = [];
  lines.push("Plot, Formula, x, y");
  lines.push("--Quadratic Plot--");
  quadratic.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Quadratic,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Linear Plot--");
  linear.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Linear,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Sine Plot--");
  sine.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Sine,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Polar Plot--");
  polar.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Polar,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Exponential Plot--");
  exponential.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Exponential,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Logarithmic Plot--");
  logarithmic.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Logarithmic,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  return lines.join("\n");
}

function plotToFile({ formulas = [], outputFileName = "output.svg", type = "svg" } = {}) {
  let content = "";
  if (type === "svg") {
    content = plotToSvg({ formulas });
  } else if (type === "ascii") {
    content = plotToAscii({ formulas });
  } else if (type === "text") {
    content = plotToText({ formulas });
  } else if (type === "json") {
    content = JSON.stringify(plotToJson({ formulas }), null, 2);
  } else if (type === "csv") {
    content = plotToCsv({ formulas });
  } else if (type === "html") {
    content = plotToHtml({ formulas });
  } else {
    throw new Error("Unsupported type provided for plotToFile");
  }
  try {
    fs.writeFileSync(outputFileName, content, "utf8");
  } catch (e) {
    console.error("Error writing file:", e);
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
  if (args.includes("--version")) {
    console.log("Equation Plotter Library version 0.1.1-72");
    process.exit(0);
  }

  if (args.includes("--help") || args.includes("-h")) {
    console.log(
      `Usage: node src/lib/main.js [outputFileName] [formulaStrings...]

Options:
  --help, -h       Show this help message
  --json           Generate output as JSON instead of SVG
  --csv            Generate output as CSV instead of SVG
  --ascii          Generate output as ASCII art instead of SVG
  --grid           Overlay grid lines on SVG plots
  --debug          Output internal parsed plot data for debugging
  --dealers-choice Use randomized color palette for SVG plots
  --version        Show version information
  (output file extension .html will generate HTML output)

Formula String Formats:
  Quadratic: "quad:y=x^2+2*x+1" or "quadratic:y=x^2+2*x+1" or "x^2+y-1=0" (or with range e.g., "y=x^2+2*x+1:-10,10,1")
  Linear:    "linear:m,b[,xMin,xMax,step]" or algebraic form like "y=2x+3" (or "y=2x+3:-10,10,1")
  Sine:      "sine:amplitude,frequency,phase[,xMin,xMax,step]"
  Polar:     "polar:scale,multiplier,step[,degMin,degMax]"
  Exponential: "exponential:a,b,xMin,xMax,step" or "exp:a,b,xMin,xMax,step" or in algebraic form like "y=2*e^(0.5x)" (optionally with range e.g., "y=2*e^(0.5x):-10,10,1")
  Logarithmic: "log:a,base,xMin,xMax,step" or "ln:a,base,xMin,xMax,step" (for natural log, use base as e or omit value to default to e)
`
    );
    process.exit(0);
  }

  let outputFileName = "output.svg";
  let isJson = args.includes("--json");
  let isCsv = args.includes("--csv");
  let isHtml = false;
  let isAscii = args.includes("--ascii");
  let isDebug = args.includes("--debug");
  let gridEnabled = args.includes("--grid");
  let isDealersChoice = args.includes("--dealers-choice");

  const nonFormulaArgs = args.filter(
    (arg) =>
      !arg.includes(":") &&
      !arg.includes("=") &&
      arg !== "--json" &&
      arg !== "--csv" &&
      arg !== "--version" &&
      arg !== "--ascii" &&
      arg !== "--debug" &&
      arg !== "--grid" &&
      arg !== "--dealers-choice"
  );
  if (nonFormulaArgs.length > 0) {
    outputFileName = nonFormulaArgs[0];
  }
  // Force output type based on file extension
  if (outputFileName.toLowerCase().endsWith(".json")) {
    isJson = true;
  } else if (outputFileName.toLowerCase().endsWith(".csv")) {
    isCsv = true;
  } else if (outputFileName.toLowerCase().endsWith(".html")) {
    isHtml = true;
  } else if (outputFileName.toLowerCase().endsWith(".txt") || outputFileName.toLowerCase().endsWith(".ascii")) {
    isAscii = true;
  }

  // Collect formulas from arguments
  const formulasList = args.filter((arg) => arg.includes(":") || arg.includes("="));

  // NEW: Warn if no formulas are provided
  if (formulasList.length === 0) {
    console.log("No formulas provided. Using default plot functions for quadratic, linear, sine, polar, exponential, and logarithmic plots.");
  }

  // NEW: If debug flag is present, output the internal parsed plot data
  if (isDebug) {
    console.log("\nDebug: Internal parsed plot data:");
    console.log(JSON.stringify(getPlotsFromFormulas(formulasList), null, 2));
  }

  let fileContent = "";
  if (isJson) {
    fileContent = JSON.stringify(plotToJson({ formulas: formulasList }), null, 2);
  } else if (isCsv) {
    fileContent = plotToCsv({ formulas: formulasList });
  } else if (isHtml) {
    fileContent = plotToHtml({ formulas: formulasList, grid: gridEnabled, dealersChoice: isDealersChoice });
  } else if (isAscii) {
    fileContent = plotToAscii({ formulas: formulasList });
  } else {
    fileContent = plotToSvg({ formulas: formulasList, grid: gridEnabled, dealersChoice: isDealersChoice });
  }

  try {
    fs.writeFileSync(outputFileName, fileContent, "utf8");
    console.log(`\n${isJson ? "JSON" : isCsv ? "CSV" : isHtml ? "HTML" : isAscii ? "ASCII" : "SVG"} file generated: ${outputFileName}`);
  } catch (err) {
    console.error(`Error writing file:`, err.message);
    process.exit(1);
  }

  console.log("\nText Representation of Plots:");
  console.log(plotToText({ formulas: formulasList }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export {
  plotToSvg,
  plotToAscii,
  plotToText,
  plotToJson,
  plotToCsv,
  plotToHtml,
  plotToFile,
  plotFromString,
  plotQuadratic,
  plotSine,
  plotPolar,
  plotLinear,
  plotExponential,
  plotLogarithmic,
  parseGenericQuadratic,
  parseGenericExponential
};
