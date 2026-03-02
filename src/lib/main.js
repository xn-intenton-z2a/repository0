#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { ExpressionParser } from "./expression-parser.js";
import { SVGPlotter } from "./plotter.js";

/**
 * Parse command line arguments into options object
 */
function parseArgs(args) {
  const options = {
    expression: null,
    range: null,
    file: null,
    format: 'svg',
    width: 800,
    height: 600,
    steps: 100,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--expression':
      case '-e':
        options.expression = args[++i];
        break;
      case '--range':
      case '-r':
        options.range = args[++i];
        break;
      case '--file':
      case '-f':
        options.file = args[++i];
        break;
      case '--format':
        options.format = args[++i];
        break;
      case '--width':
        options.width = parseInt(args[++i]);
        break;
      case '--height':
        options.height = parseInt(args[++i]);
        break;
      case '--steps':
      case '-s':
        options.steps = parseInt(args[++i]);
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        // Handle positional expression argument
        if (!options.expression && !arg.startsWith('-')) {
          options.expression = arg;
        }
        break;
    }
  }

  return options;
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
plot-code-lib - Generate plots from mathematical expressions

USAGE:
  node src/lib/main.js [OPTIONS] [EXPRESSION]

OPTIONS:
  -e, --expression EXPR    Mathematical expression (e.g., "sin(x)", "y=cos(x)")
  -r, --range RANGE       Range for variable (e.g., "-10:10", "x=-5:5") 
  -f, --file FILE         Output file path (default: output.svg)
  -s, --steps STEPS       Number of steps/points (default: 100)
  --format FORMAT         Output format: svg (default: svg)
  --width WIDTH           Plot width in pixels (default: 800)
  --height HEIGHT         Plot height in pixels (default: 600)
  -h, --help             Show this help

EXAMPLES:
  node src/lib/main.js --expression "sin(x)" --range "-10:10" --file sine.svg
  node src/lib/main.js "y=cos(x)" -r "x=-5:5" -f cosine.svg
  node src/lib/main.js "x^2" --range "-3:3" --steps 50
  node src/lib/main.js "sin(x) + cos(x)" -r "-2*pi:2*pi"
`);
}

/**
 * Main entry point
 */
export function main(args = []) {
  const options = parseArgs(args);

  if (options.help) {
    showHelp();
    return;
  }

  if (!options.expression) {
    console.error('Error: No expression provided');
    console.error('Use --help for usage information');
    if (typeof process !== 'undefined' && process.exit) {
      process.exit(1);
    }
    return;
  }

  try {
    // Parse expression
    const parser = new ExpressionParser();
    const parsed = parser.parse(options.expression);
    
    if (!parsed.isValid) {
      console.error(`Error parsing expression: ${parsed.error}`);
      if (typeof process !== 'undefined' && process.exit) {
        process.exit(1);
      }
      return;
    }

    console.log(`Parsing expression: ${parsed.original}`);
    console.log(`Variable: ${parsed.variable}`);

    // Parse range
    const range = parser.parseRange(options.range, options.steps);
    console.log(`Range: ${range.min} to ${range.max} (${range.steps} steps)`);

    // Generate time series data
    const data = parser.generateTimeSeries(parsed, range);
    console.log(`Generated ${data.length} data points`);

    if (data.length === 0) {
      console.error('Error: No valid data points generated');
      if (typeof process !== 'undefined' && process.exit) {
        process.exit(1);
      }
      return;
    }

    // Create plot
    const plotter = new SVGPlotter({
      width: options.width,
      height: options.height
    });

    const svgContent = plotter.plot(data, {
      title: `Plot of ${parsed.original}`,
      xLabel: parsed.variable,
      yLabel: 'f(' + parsed.variable + ')'
    });

    // Save or output
    const outputFile = options.file || 'output.svg';
    plotter.saveSVG(svgContent, outputFile);
    
    console.log(`Plot saved to: ${outputFile}`);
    
    // Also output some sample data points
    const samplePoints = Math.min(5, data.length);
    console.log(`\nSample data points:`);
    for (let i = 0; i < samplePoints; i++) {
      const point = data[Math.floor(i * data.length / samplePoints)];
      console.log(`  ${parsed.variable}=${point.x.toFixed(3)}, f(${parsed.variable})=${point.y.toFixed(3)}`);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (typeof process !== 'undefined' && process.exit) {
      process.exit(1);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
