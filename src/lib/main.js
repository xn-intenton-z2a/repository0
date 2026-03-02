#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { Command } from "commander";
import { create, all } from "mathjs";
import { JSDOM } from "jsdom";
import * as d3 from "d3";
import fs from "fs/promises";

const math = create(all);

export class ExpressionParser {
  constructor() {
    this.parser = math;
  }

  /**
   * Parse and validate a mathematical expression
   * @param {string} expression - Mathematical expression like "y=sin(x)" or "sin(x)"
   * @returns {Object} - Parsed expression with variable and function
   */
  parse(expression) {
    // Handle y=f(x) format or just f(x) format
    let variable = 'x';
    let formula = expression;
    
    if (expression.includes('=')) {
      const [left, right] = expression.split('=');
      variable = left.trim();
      formula = right.trim();
    }

    try {
      // Compile the expression to validate it
      const compiled = this.parser.compile(formula);
      return {
        variable,
        formula,
        compiled
      };
    } catch (error) {
      throw new Error(`Invalid expression "${expression}": ${error.message}`);
    }
  }

  /**
   * Evaluate expression at a given point
   * @param {Object} parsedExpr - Result from parse()
   * @param {number} x - Input value
   * @returns {number} - Evaluated result
   */
  evaluate(parsedExpr, x) {
    try {
      return parsedExpr.compiled.evaluate({ x });
    } catch (error) {
      throw new Error(`Error evaluating expression at x=${x}: ${error.message}`);
    }
  }
}

export class RangeParser {
  /**
   * Parse range specification like "x=-1:1,y=-1:1" or "-1:1"
   * @param {string} rangeStr - Range specification
   * @returns {Object} - Parsed range with min/max values
   */
  parse(rangeStr) {
    if (!rangeStr) {
      return { x: { min: -10, max: 10 }, y: { min: -10, max: 10 } };
    }

    const ranges = {};
    
    // Split by comma to handle multiple dimensions
    const parts = rangeStr.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      
      if (trimmed.includes('=')) {
        // Format: x=-1:1
        const [variable, range] = trimmed.split('=');
        const [min, max] = this.parseRange(range);
        ranges[variable.trim()] = { min, max };
      } else {
        // Format: -1:1 (assume x)
        const [min, max] = this.parseRange(trimmed);
        ranges.x = { min, max };
      }
    }

    // Ensure we have at least x range
    if (!ranges.x) {
      ranges.x = { min: -10, max: 10 };
    }

    return ranges;
  }

  parseRange(rangeStr) {
    const [minStr, maxStr] = rangeStr.split(':');
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);
    
    if (isNaN(min) || isNaN(max)) {
      throw new Error(`Invalid range format: ${rangeStr}`);
    }
    
    if (min >= max) {
      throw new Error(`Invalid range: min (${min}) must be less than max (${max})`);
    }
    
    return [min, max];
  }
}

export class TimeSeriesGenerator {
  /**
   * Generate time series data from expression and range
   * @param {Object} parsedExpr - Parsed expression
   * @param {Object} ranges - Parsed ranges
   * @param {number} points - Number of data points (default: 100)
   * @returns {Array} - Array of {x, y} points
   */
  generate(parsedExpr, ranges, points = 100) {
    const { min, max } = ranges.x;
    const step = (max - min) / (points - 1);
    const data = [];

    for (let i = 0; i < points; i++) {
      const x = min + i * step;
      try {
        const y = new ExpressionParser().evaluate(parsedExpr, x);
        if (isFinite(y)) {
          data.push({ x, y });
        }
      } catch (error) {
        // Skip invalid points
        continue;
      }
    }

    return data;
  }
}

export class SVGPlotter {
  /**
   * Create SVG plot from time series data
   * @param {Array} data - Time series data
   * @param {Object} ranges - Ranges for axes
   * @param {Object} options - Plot options
   * @returns {string} - SVG string
   */
  plot(data, ranges, options = {}) {
    const width = options.width || 800;
    const height = options.height || 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Create virtual DOM
    const dom = new JSDOM('<!DOCTYPE html><body></body>');
    const document = dom.window.document;
    global.document = document;

    // Create SVG container
    const svg = d3.select(document.body)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Set up scales
    const xExtent = d3.extent(data, d => d.x);
    const yExtent = d3.extent(data, d => d.y);
    
    const xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([margin.left, width - margin.right]);
    
    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([height - margin.bottom, margin.top]);

    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Add the line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add axis labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(options.yLabel || 'y');

    svg.append('text')
      .attr('transform', `translate(${width / 2}, ${height - 5})`)
      .style('text-anchor', 'middle')
      .text(options.xLabel || 'x');

    return document.body.innerHTML;
  }
}

export function main(args) {
  const program = new Command();
  
  program
    .name('plot-code-lib')
    .description('Transform mathematical expressions to plots - the jq of formulae visualisations')
    .version('0.1.0')
    .exitOverride(); // Prevent process.exit in tests

  program
    .option('-e, --expression <expr>', 'Mathematical expression (e.g., "y=sin(x)" or "sin(x)")')
    .option('-r, --range <range>', 'Range specification (e.g., "x=-1:1,y=-1:1" or "-1:1")', 'x=-10:10')
    .option('-f, --file <file>', 'Output file name', 'output.svg')
    .option('-p, --points <points>', 'Number of data points', '100')
    .action(async (options) => {
      try {
        if (!options.expression) {
          console.error('Error: --expression is required');
          process.exit(1);
        }

        const parser = new ExpressionParser();
        const rangeParser = new RangeParser();
        const generator = new TimeSeriesGenerator();
        const plotter = new SVGPlotter();

        // Parse inputs
        const expression = parser.parse(options.expression);
        const ranges = rangeParser.parse(options.range);
        const points = parseInt(options.points);

        // Generate data
        const data = generator.generate(expression, ranges, points);
        
        if (data.length === 0) {
          console.error('Error: No valid data points generated');
          process.exit(1);
        }

        // Create plot
        const svg = plotter.plot(data, ranges, {
          xLabel: 'x',
          yLabel: expression.variable
        });

        // Save to file
        await fs.writeFile(options.file, svg);
        
        console.log(`Generated plot with ${data.length} points`);
        console.log(`Expression: ${options.expression}`);
        console.log(`Range: ${options.range}`);
        console.log(`Output: ${options.file}`);

      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
    });

  try {
    program.parse(args || process.argv);
  } catch (error) {
    if (error.code === 'commander.help' || error.code === 'commander.helpDisplayed') {
      // Help was displayed, this is normal
      return;
    }
    // Re-throw other errors
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(['node', 'plot-code-lib', ...args]);
}
