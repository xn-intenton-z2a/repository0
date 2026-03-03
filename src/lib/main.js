#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

// Mathematical expression parser
class ExpressionParser {
  constructor() {
    this.functions = {
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      log: Math.log,
      sqrt: Math.sqrt,
      abs: Math.abs,
      exp: Math.exp,
    };
    this.constants = {
      pi: Math.PI,
      e: Math.E,
    };
  }

  parse(expression) {
    // Simple parser for expressions like "y=sin(x)", "r=cos(theta)"
    const parts = expression.split('=');
    if (parts.length !== 2) {
      throw new Error(`Invalid expression format: ${expression}. Expected format: y=f(x)`);
    }
    
    const [leftSide, rightSide] = parts;
    const variable = leftSide.trim();
    const formula = rightSide.trim();
    
    return { variable, formula, evaluate: this.createEvaluator(formula) };
  }

  createEvaluator(formula) {
    return (variables) => {
      let expr = formula;
      
      // Replace constants
      for (const [name, value] of Object.entries(this.constants)) {
        expr = expr.replace(new RegExp(`\\b${name}\\b`, 'g'), value.toString());
      }
      
      // Replace variables
      for (const [name, value] of Object.entries(variables)) {
        expr = expr.replace(new RegExp(`\\b${name}\\b`, 'g'), `(${value})`);
      }
      
      // Replace functions
      for (const [name, func] of Object.entries(this.functions)) {
        expr = expr.replace(new RegExp(`\\b${name}\\(`, 'g'), `Math.${name}(`);
      }
      
      // Handle power operator
      expr = expr.replace(/\^/g, '**');
      
      try {
        return eval(expr);
      } catch (error) {
        throw new Error(`Error evaluating expression "${formula}": ${error.message}`);
      }
    };
  }
}

// Range parser
class RangeParser {
  parse(rangeStr) {
    const ranges = {};
    const parts = rangeStr.split(',');
    
    for (const part of parts) {
      const [variable, range] = part.split('=');
      if (!variable || !range) {
        throw new Error(`Invalid range format: ${part}. Expected format: x=start:end or x=start:step:end`);
      }
      
      const rangeParts = range.split(':');
      let start, step, end;
      
      if (rangeParts.length === 2) {
        [start, end] = rangeParts.map(p => this.evaluateConstant(p));
        step = (end - start) / 100; // Default 100 steps
      } else if (rangeParts.length === 3) {
        [start, step, end] = rangeParts.map(p => this.evaluateConstant(p));
      } else {
        throw new Error(`Invalid range format: ${range}. Expected format: start:end or start:step:end`);
      }
      
      ranges[variable.trim()] = { start, step, end };
    }
    
    return ranges;
  }
  
  evaluateConstant(expr) {
    // Handle constants like -pi, 2*pi, etc.
    expr = expr.replace(/pi/g, Math.PI.toString());
    expr = expr.replace(/e/g, Math.E.toString());
    return eval(expr);
  }
}

// Time series generator
class TimeSeriesGenerator {
  generate(expression, ranges) {
    const parser = new ExpressionParser();
    const expr = parser.parse(expression);
    const points = [];
    
    // Handle single variable case (most common)
    const rangeKeys = Object.keys(ranges);
    if (rangeKeys.length === 1) {
      const independentVar = rangeKeys[0];
      const range = ranges[independentVar];
      
      for (let value = range.start; value <= range.end; value += range.step) {
        try {
          const variables = { [independentVar]: value };
          const result = expr.evaluate(variables);
          
          if (typeof result === 'number' && !isNaN(result)) {
            points.push({ [independentVar]: value, [expr.variable]: result });
          }
        } catch (error) {
          // Skip invalid points
          console.warn(`Skipping point at ${independentVar}=${value}: ${error.message}`);
        }
      }
    }
    
    return points;
  }
}

// SVG renderer
class SVGRenderer {
  constructor(width = 800, height = 600) {
    this.width = width;
    this.height = height;
    this.margin = { top: 50, right: 50, bottom: 80, left: 80 };
    this.plotWidth = width - this.margin.left - this.margin.right;
    this.plotHeight = height - this.margin.top - this.margin.bottom;
  }

  render(points, options = {}) {
    if (points.length === 0) {
      throw new Error('No data points to render');
    }
    
    // Determine x and y variables
    const firstPoint = points[0];
    const keys = Object.keys(firstPoint);
    const xVar = keys.find(k => k === 'x') || keys[0];
    const yVar = keys.find(k => k !== xVar);
    
    // Find data bounds
    const xValues = points.map(p => p[xVar]);
    const yValues = points.map(p => p[yVar]);
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    // Add some padding
    const xPadding = (xMax - xMin) * 0.1;
    const yPadding = (yMax - yMin) * 0.1;
    
    const xRange = [xMin - xPadding, xMax + xPadding];
    const yRange = [yMin - yPadding, yMax + yPadding];
    
    // Create SVG
    let svg = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Background
    svg += `<rect width="${this.width}" height="${this.height}" fill="white"/>`;
    
    // Grid
    svg += this.drawGrid(xRange, yRange);
    
    // Axes
    svg += this.drawAxes(xRange, yRange);
    
    // Data
    svg += this.drawData(points, xVar, yVar, xRange, yRange);
    
    // Labels
    svg += this.drawLabels(xVar, yVar);
    
    svg += '</svg>';
    
    return svg;
  }
  
  scaleX(value, range) {
    return this.margin.left + ((value - range[0]) / (range[1] - range[0])) * this.plotWidth;
  }
  
  scaleY(value, range) {
    return this.margin.top + this.plotHeight - ((value - range[0]) / (range[1] - range[0])) * this.plotHeight;
  }
  
  drawGrid(xRange, yRange) {
    let grid = '<g stroke="#f0f0f0" stroke-width="1">';
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = this.margin.left + (i / 10) * this.plotWidth;
      grid += `<line x1="${x}" y1="${this.margin.top}" x2="${x}" y2="${this.margin.top + this.plotHeight}"/>`;
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = this.margin.top + (i / 10) * this.plotHeight;
      grid += `<line x1="${this.margin.left}" y1="${y}" x2="${this.margin.left + this.plotWidth}" y2="${y}"/>`;
    }
    
    grid += '</g>';
    return grid;
  }
  
  drawAxes(xRange, yRange) {
    let axes = '<g stroke="black" stroke-width="2">';
    
    // X-axis
    const xAxisY = this.scaleY(0, yRange);
    if (xAxisY >= this.margin.top && xAxisY <= this.margin.top + this.plotHeight) {
      axes += `<line x1="${this.margin.left}" y1="${xAxisY}" x2="${this.margin.left + this.plotWidth}" y2="${xAxisY}"/>`;
    }
    
    // Y-axis
    const yAxisX = this.scaleX(0, xRange);
    if (yAxisX >= this.margin.left && yAxisX <= this.margin.left + this.plotWidth) {
      axes += `<line x1="${yAxisX}" y1="${this.margin.top}" x2="${yAxisX}" y2="${this.margin.top + this.plotHeight}"/>`;
    }
    
    axes += '</g>';
    return axes;
  }
  
  drawData(points, xVar, yVar, xRange, yRange) {
    let data = '<g fill="none" stroke="blue" stroke-width="2">';
    
    // Create path
    let pathData = '';
    
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const x = this.scaleX(point[xVar], xRange);
      const y = this.scaleY(point[yVar], yRange);
      
      if (i === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    }
    
    data += `<path d="${pathData}"/>`;
    data += '</g>';
    
    return data;
  }
  
  drawLabels(xVar, yVar) {
    let labels = '<g fill="black" font-family="Arial" font-size="14">';
    
    // X-axis label
    labels += `<text x="${this.width / 2}" y="${this.height - 20}" text-anchor="middle">${xVar}</text>`;
    
    // Y-axis label
    labels += `<text x="20" y="${this.height / 2}" text-anchor="middle" transform="rotate(-90, 20, ${this.height / 2})">${yVar}</text>`;
    
    labels += '</g>';
    return labels;
  }
}

// CLI handler
export function main(args) {
  try {
    const options = parseArgs(args);
    
    if (options.help) {
      showHelp();
      return;
    }
    
    if (options.version) {
      console.log('plot-code-lib version 0.1.0');
      return;
    }
    
    if (!options.expression) {
      console.error('Error: --expression is required');
      showHelp();
      process.exit(1);
    }
    
    if (!options.range) {
      console.error('Error: --range is required');
      showHelp();
      process.exit(1);
    }
    
    // Parse range
    const rangeParser = new RangeParser();
    const ranges = rangeParser.parse(options.range);
    
    // Generate time series
    const generator = new TimeSeriesGenerator();
    const points = generator.generate(options.expression, ranges);
    
    if (points.length === 0) {
      console.error('Error: No valid data points generated');
      process.exit(1);
    }
    
    console.log(`Generated ${points.length} data points`);
    
    // Render SVG
    const renderer = new SVGRenderer();
    const svg = renderer.render(points);
    
    // Output
    if (options.output) {
      fs.writeFileSync(options.output, svg);
      console.log(`Plot saved to ${options.output}`);
    } else {
      console.log(svg);
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function parseArgs(args) {
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--version' || arg === '-v') {
      options.version = true;
    } else if (arg === '--expression' || arg === '-e') {
      options.expression = args[++i];
    } else if (arg === '--range' || arg === '-r') {
      options.range = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--file' || arg === '-f') {
      // Alias for --output
      options.output = args[++i];
    }
  }
  
  return options;
}

function showHelp() {
  console.log(`
plot-code-lib - The jq of formulae visualisations

USAGE:
  plot-code [OPTIONS]

OPTIONS:
  -e, --expression <EXPR>    Mathematical expression (e.g., "y=sin(x)")
  -r, --range <RANGE>        Variable range (e.g., "x=-pi:pi")
  -o, --output <FILE>        Output file path (defaults to stdout)
  -f, --file <FILE>          Alias for --output
  -h, --help                 Show this help message
  -v, --version              Show version information

EXAMPLES:
  # Basic sine wave
  plot-code --expression "y=sin(x)" --range "x=-pi:pi" --output sine.svg
  
  # Cosine with custom range
  plot-code --expression "y=cos(x)" --range "x=-2*pi:2*pi" --output cosine.svg
  
  # Quadratic function
  plot-code --expression "y=x^2" --range "x=-5:5" --output quadratic.svg
  
  # Logarithmic function
  plot-code --expression "y=log(x)" --range "x=0.1:0.1:10" --output log.svg

SUPPORTED FUNCTIONS:
  sin, cos, tan, log, sqrt, abs, exp

SUPPORTED CONSTANTS:
  pi, e

RANGE FORMATS:
  x=start:end           (100 steps between start and end)
  x=start:step:end      (custom step size)
`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
