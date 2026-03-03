#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, extname } from "path";
import { Command } from "commander";
import { evaluate, parser } from "mathjs";
import sharp from "sharp";

/**
 * Parse range string like "x=-10:10,y=-5:5" into range object
 * @param {string} rangeStr - Range specification string
 * @returns {Object} Parsed range object with x and y ranges
 */
export function parseRange(rangeStr) {
  const ranges = {};
  const parts = rangeStr.split(',');
  
  for (const part of parts) {
    const [variable, range] = part.split('=');
    const [min, max] = range.split(':').map(Number);
    ranges[variable.trim()] = { min, max };
  }
  
  return ranges;
}

/**
 * Generate time series data from a mathematical expression
 * @param {string} expression - Mathematical expression like "y=sin(x)"
 * @param {Object} ranges - Range object with variable ranges
 * @param {number} steps - Number of steps to generate (default: 100)
 * @returns {Array} Array of {x, y} points
 */
export function generateTimeSeries(expression, ranges, steps = 100) {
  // Parse expression to extract dependent and independent variables
  let dependentVar = 'y';
  let independentVar = 'x';
  let formula = expression;
  
  // Handle expressions like "y=sin(x)" or just "sin(x)"
  if (expression.includes('=')) {
    const [left, right] = expression.split('=');
    dependentVar = left.trim();
    formula = right.trim();
  }
  
  // Get the independent variable from ranges (should be x by default)
  const independentRange = ranges[independentVar] || ranges.x || { min: -10, max: 10 };
  
  const points = [];
  const step = (independentRange.max - independentRange.min) / steps;
  
  try {
    // Test the expression with a sample value to catch parse errors early
    const testScope = {};
    testScope[independentVar] = 0;
    evaluate(formula, testScope);
    
    for (let i = 0; i <= steps; i++) {
      const xValue = independentRange.min + (i * step);
      const scope = {};
      scope[independentVar] = xValue;
      
      try {
        const yValue = evaluate(formula, scope);
        if (typeof yValue === 'number' && !isNaN(yValue)) {
          points.push({ x: xValue, y: yValue });
        }
      } catch (evalError) {
        // Skip points that can't be evaluated (e.g., division by zero, domain errors)
        // But re-throw if it's a fundamental parse error like undefined function
        if (evalError.message.includes('Undefined function')) {
          throw evalError;
        }
        continue;
      }
    }
  } catch (parseError) {
    throw new Error(`Failed to parse expression "${formula}": ${parseError.message}`);
  }
  
  return points;
}

/**
 * Generate SVG plot from time series data
 * @param {Array} points - Array of {x, y} points
 * @param {Object} options - Plot options
 * @returns {string} SVG content as string
 */
export function generateSVGPlot(points, options = {}) {
  const {
    width = 800,
    height = 600,
    margin = { top: 40, right: 40, bottom: 60, left: 60 },
    title = 'Mathematical Plot',
    strokeColor = '#2563eb',
    strokeWidth = 2,
    backgroundColor = '#ffffff'
  } = options;
  
  if (points.length === 0) {
    throw new Error('No valid points to plot');
  }
  
  // Calculate data bounds
  const xValues = points.map(p => p.x);
  const yValues = points.map(p => p.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  // Add some padding to the ranges
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const xPadding = xRange * 0.05;
  const yPadding = yRange * 0.05;
  
  const plotXMin = xMin - xPadding;
  const plotXMax = xMax + xPadding;
  const plotYMin = yMin - yPadding;
  const plotYMax = yMax + yPadding;
  
  // Calculate plot area dimensions
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // Transform data coordinates to SVG coordinates
  const scaleX = (x) => margin.left + ((x - plotXMin) / (plotXMax - plotXMin)) * plotWidth;
  const scaleY = (y) => margin.top + plotHeight - ((y - plotYMin) / (plotYMax - plotYMin)) * plotHeight;
  
  // Generate path string for the plot line
  const pathData = points
    .map((point, index) => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
  
  // Generate axis lines
  const xAxisY = scaleY(0);
  const yAxisX = scaleX(0);
  
  // Generate tick marks and labels
  const xTicks = [];
  const yTicks = [];
  const numTicks = 5;
  
  for (let i = 0; i <= numTicks; i++) {
    const xVal = plotXMin + (plotXMax - plotXMin) * (i / numTicks);
    const yVal = plotYMin + (plotYMax - plotYMin) * (i / numTicks);
    
    xTicks.push({
      value: xVal,
      x: scaleX(xVal),
      y: height - margin.bottom + 20
    });
    
    yTicks.push({
      value: yVal,
      x: margin.left - 10,
      y: scaleY(yVal) + 5
    });
  }
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .plot-line { fill: none; stroke: ${strokeColor}; stroke-width: ${strokeWidth}px; }
      .axis { stroke: #666; stroke-width: 1px; }
      .grid { stroke: #e5e7eb; stroke-width: 0.5px; }
      .axis-label { font-family: Arial, sans-serif; font-size: 12px; fill: #374151; text-anchor: middle; }
      .title { font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #1f2937; text-anchor: middle; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
  
  <!-- Grid lines -->
  ${xTicks.map(tick => `<line x1="${tick.x}" y1="${margin.top}" x2="${tick.x}" y2="${height - margin.bottom}" class="grid"/>`).join('\n  ')}
  ${yTicks.map(tick => `<line x1="${margin.left}" y1="${scaleY(tick.value)}" x2="${width - margin.right}" y2="${scaleY(tick.value)}" class="grid"/>`).join('\n  ')}
  
  <!-- Axes -->
  <line x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}" class="axis"/>
  <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height - margin.bottom}" class="axis"/>
  
  <!-- Axis labels -->
  ${xTicks.map(tick => `<text x="${tick.x}" y="${tick.y}" class="axis-label">${tick.value.toFixed(1)}</text>`).join('\n  ')}
  ${yTicks.map(tick => `<text x="${tick.x}" y="${tick.y}" class="axis-label" text-anchor="end">${tick.value.toFixed(1)}</text>`).join('\n  ')}
  
  <!-- Plot line -->
  <path d="${pathData}" class="plot-line"/>
  
  <!-- Title -->
  <text x="${width / 2}" y="25" class="title">${title}</text>
</svg>`;
  
  return svg;
}

/**
 * Generate PNG plot from time series data
 * @param {Array} points - Array of {x, y} points
 * @param {Object} options - Plot options
 * @returns {Buffer} PNG image buffer
 */
export async function generatePNGPlot(points, options = {}) {
  // Generate SVG first
  const svg = generateSVGPlot(points, options);
  
  // Convert SVG to PNG using sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();
    
  return pngBuffer;
}

/**
 * Main function to handle CLI commands
 * @param {Array} args - Command line arguments
 */
export function main(args) {
  const program = new Command();
  
  program
    .name('plot-code-lib')
    .description('Transform mathematical expressions into plots - the jq of formula visualizations')
    .version('0.1.0');
  
  program
    .command('plot')
    .description('Generate a plot from a mathematical expression')
    .option('-e, --expression <expr>', 'Mathematical expression (e.g., "y=sin(x)", "cos(x)")', 'y=sin(x)')
    .option('-r, --range <range>', 'Variable ranges (e.g., "x=-10:10,y=-5:5")', 'x=-10:10,y=-5:5')
    .option('-f, --file <path>', 'Output file path', 'output.svg')
    .option('-s, --steps <number>', 'Number of calculation steps', '100')
    .option('-t, --title <title>', 'Plot title')
    .action(async (options) => {
      try {
        console.log(`Generating plot for expression: ${options.expression}`);
        console.log(`Range: ${options.range}`);
        console.log(`Output file: ${options.file}`);
        
        // Parse inputs
        const ranges = parseRange(options.range);
        const steps = parseInt(options.steps, 10);
        
        // Generate time series data
        const points = generateTimeSeries(options.expression, ranges, steps);
        console.log(`Generated ${points.length} data points`);
        
        // Generate plot title
        const title = options.title || `Plot: ${options.expression}`;
        
        // Determine output format based on file extension
        const fileExt = extname(options.file).toLowerCase();
        
        // Ensure output directory exists
        const outputDir = dirname(options.file);
        mkdirSync(outputDir, { recursive: true });
        
        if (fileExt === '.png') {
          // Generate PNG
          const pngBuffer = await generatePNGPlot(points, { title });
          writeFileSync(options.file, pngBuffer);
        } else {
          // Default to SVG
          const svg = generateSVGPlot(points, { title });
          writeFileSync(options.file, svg, 'utf8');
        }
        
        console.log(`Plot saved to: ${options.file}`);
        
      } catch (error) {
        console.error('Error generating plot:', error.message);
        process.exit(1);
      }
    });
  
  // Add examples command
  program
    .command('examples')
    .description('Show example usage commands')
    .action(() => {
      console.log('Example commands:');
      console.log('');
      console.log('  # Basic sine wave (SVG)');
      console.log('  plot-code-lib plot --expression "y=sin(x)" --range "x=-10:10" --file sine.svg');
      console.log('');
      console.log('  # Cosine with custom range (PNG)');  
      console.log('  plot-code-lib plot --expression "cos(x)" --range "x=-6.28:6.28" --file cosine.png');
      console.log('');
      console.log('  # Quadratic function with title');
      console.log('  plot-code-lib plot --expression "x^2" --range "x=-5:5" --file quadratic.svg --title "Parabola"');
      console.log('');
      console.log('  # Complex expression');
      console.log('  plot-code-lib plot --expression "sin(x) * cos(x/2)" --range "x=-12:12" --file complex.png');
      console.log('');
      console.log('  # High resolution plot');
      console.log('  plot-code-lib plot --expression "exp(-x^2/4)*sin(3*x)" --range "x=-4:4" --steps 200 --file detailed.svg');
    });
  
  // If no args provided, show help
  if (args.length === 0) {
    program.help();
    return;
  }
  
  program.parse(['node', 'plot-code-lib', ...args]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
