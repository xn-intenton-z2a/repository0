#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { Command } from "commander";
import { evaluate, parse } from "mathjs";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { axisLeft, axisBottom } from "d3-axis";
import { JSDOM } from "jsdom";
import { writeFileSync } from "fs";
import { extname } from "path";

/**
 * Mathematical expression parser using MathJS
 */
class ExpressionParser {
  constructor() {
    this.compiledExpressions = new Map();
  }

  /**
   * Parse and compile a mathematical expression
   * @param {string} expression - Mathematical expression (e.g., "sin(x)", "x^2 + 2*x + 1")
   * @returns {Function} - Compiled function that takes variables and returns result
   */
  parse(expression) {
    if (this.compiledExpressions.has(expression)) {
      return this.compiledExpressions.get(expression);
    }

    try {
      const compiled = parse(expression).compile();
      const func = (variables) => {
        return compiled.evaluate(variables);
      };
      
      this.compiledExpressions.set(expression, func);
      return func;
    } catch (error) {
      throw new Error(`Failed to parse expression "${expression}": ${error.message}`);
    }
  }
}

/**
 * Time series data generator that outputs GeoJSON format
 */
class TimeSeriesGenerator {
  constructor(parser) {
    this.parser = parser;
  }

  /**
   * Parse range specification (e.g., "x=-1:1", "x=0:2*pi:0.1", "t=-1:1:0.01")
   * @param {string} rangeSpec - Range specification
   * @returns {Object} - {variable, start, end, step}
   */
  parseRange(rangeSpec) {
    const match = rangeSpec.match(/^(\w+)=([^:]+):([^:]+)(?::([^:]+))?$/);
    if (!match) {
      throw new Error(`Invalid range format: ${rangeSpec}. Use format: variable=start:end or variable=start:end:step`);
    }

    const [, variable, startStr, endStr, stepStr] = match;
    
    const start = evaluate(startStr);
    const end = evaluate(endStr);
    const step = stepStr ? evaluate(stepStr) : (end - start) / 100;

    return { variable, start, end, step };
  }

  /**
   * Generate coordinate data from mathematical expression and range
   * @param {string} expression - Mathematical expression 
   * @param {string} rangeSpec - Range specification
   * @returns {Object} - GeoJSON LineString feature
   */
  generate(expression, rangeSpec) {
    const range = this.parseRange(rangeSpec);
    const func = this.parser.parse(expression);
    
    const coordinates = [];
    for (let value = range.start; value <= range.end; value += range.step) {
      const variables = { [range.variable]: value };
      
      try {
        const result = func(variables);
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
          coordinates.push([value, result]);
        }
      } catch (error) {
        // Skip invalid evaluations
        continue;
      }
    }

    if (coordinates.length === 0) {
      throw new Error(`No valid data points generated for expression "${expression}" with range "${rangeSpec}"`);
    }

    return {
      type: "Feature",
      properties: {
        expression: expression,
        range: rangeSpec
      },
      geometry: {
        type: "LineString",
        coordinates: coordinates
      }
    };
  }
}

/**
 * Plot generator for SVG output using D3.js
 */
class PlotGenerator {
  constructor() {
    this.width = 800;
    this.height = 600;
    this.margin = { top: 50, right: 50, bottom: 80, left: 80 };
  }

  /**
   * Extract coordinates from GeoJSON feature
   * @param {Object} geoJson - GeoJSON feature with LineString geometry
   * @returns {Array} - Array of [x, y] coordinate pairs
   */
  extractCoordinates(geoJson) {
    if (geoJson.type === "Feature" && geoJson.geometry.type === "LineString") {
      return geoJson.geometry.coordinates;
    }
    if (geoJson.type === "FeatureCollection") {
      return geoJson.features.flatMap(feature => 
        feature.geometry.type === "LineString" ? feature.geometry.coordinates : []
      );
    }
    throw new Error("Invalid GeoJSON format. Expected Feature with LineString or FeatureCollection");
  }

  /**
   * Generate SVG plot from GeoJSON data
   * @param {Object} geoJson - GeoJSON data
   * @param {string} title - Plot title (optional)
   * @returns {string} - SVG markup
   */
  generateSVG(geoJson, title = "Mathematical Function Plot") {
    const coordinates = this.extractCoordinates(geoJson);
    
    if (coordinates.length === 0) {
      throw new Error("No coordinate data found in GeoJSON");
    }

    // Calculate data bounds
    const xExtent = [
      Math.min(...coordinates.map(d => d[0])),
      Math.max(...coordinates.map(d => d[0]))
    ];
    const yExtent = [
      Math.min(...coordinates.map(d => d[1])),
      Math.max(...coordinates.map(d => d[1]))
    ];

    // Add padding to extents
    const xPadding = (xExtent[1] - xExtent[0]) * 0.1;
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1;
    xExtent[0] -= xPadding;
    xExtent[1] += xPadding;
    yExtent[0] -= yPadding;
    yExtent[1] += yPadding;

    // Create virtual DOM
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
    const document = dom.window.document;
    
    // Create SVG
    const svg = select(document.body)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("xmlns", "http://www.w3.org/2000/svg");

    // Create scales
    const xScale = scaleLinear()
      .domain(xExtent)
      .range([this.margin.left, this.width - this.margin.right]);

    const yScale = scaleLinear()
      .domain(yExtent)
      .range([this.height - this.margin.bottom, this.margin.top]);

    // Add background
    svg.append("rect")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("fill", "white");

    // Add grid lines
    const xTicks = xScale.ticks(10);
    const yTicks = yScale.ticks(8);

    // X grid lines
    svg.selectAll(".x-grid")
      .data(xTicks)
      .enter()
      .append("line")
      .attr("class", "x-grid")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", this.margin.top)
      .attr("y2", this.height - this.margin.bottom)
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 1);

    // Y grid lines  
    svg.selectAll(".y-grid")
      .data(yTicks)
      .enter()
      .append("line")
      .attr("class", "y-grid")
      .attr("x1", this.margin.left)
      .attr("x2", this.width - this.margin.right)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 1);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(${this.margin.left}, 0)`)
      .call(axisLeft(yScale))
      .selectAll("text")
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "12px");

    svg.append("g")
      .attr("transform", `translate(0, ${this.height - this.margin.bottom})`)
      .call(axisBottom(xScale))
      .selectAll("text")
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "12px");

    // Add axis labels
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 + 20)
      .attr("x", 0 - (this.height / 2))
      .style("text-anchor", "middle")
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "14px")
      .text("y");

    svg.append("text")             
      .attr("transform", `translate(${this.width/2}, ${this.height - 10})`)
      .style("text-anchor", "middle")
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "14px")
      .text("x");

    // Add title
    svg.append("text")
      .attr("x", this.width / 2)             
      .attr("y", 30)
      .attr("text-anchor", "middle")  
      .style("font-size", "18px")
      .style("font-family", "Arial, sans-serif")
      .style("font-weight", "bold")
      .text(title);

    // Create line generator
    const lineGenerator = line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    // Add the line
    svg.append("path")
      .datum(coordinates)
      .attr("fill", "none")
      .attr("stroke", "#2563eb")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    // Add expression label if available
    if (geoJson.type === "Feature" && geoJson.properties?.expression) {
      svg.append("text")
        .attr("x", this.width - this.margin.right - 10)
        .attr("y", this.margin.top + 20)
        .attr("text-anchor", "end")
        .style("font-family", "monospace")
        .style("font-size", "14px")
        .style("fill", "#2563eb")
        .text(geoJson.properties.expression);
    }

    return document.body.innerHTML;
  }
}

/**
 * Command Line Interface
 */
class CLI {
  constructor() {
    this.parser = new ExpressionParser();
    this.generator = new TimeSeriesGenerator(this.parser);
    this.plotter = new PlotGenerator();
    this.program = new Command();
    this.setupCommands();
  }

  setupCommands() {
    this.program
      .name('plot-code-lib')
      .description('Generate mathematical plots from expressions')
      .version('0.1.0');

    this.program
      .command('plot')
      .description('Generate a plot from a mathematical expression')
      .option('-e, --expression <expr>', 'Mathematical expression (e.g., "sin(x)", "x^2")')
      .option('-r, --range <range>', 'Variable range (e.g., "x=-1:1", "x=0:2*pi:0.1")')
      .option('-o, --output <file>', 'Output file path (SVG format)', 'output.svg')
      .option('-t, --title [title]', 'Plot title')
      .action(async (options) => {
        await this.handlePlotCommand(options);
      });

    // Default action for backward compatibility
    this.program
      .option('-e, --expression <expr>', 'Mathematical expression (e.g., "sin(x)", "x^2")')
      .option('-r, --range <range>', 'Variable range (e.g., "x=-1:1", "x=0:2*pi:0.1")')  
      .option('-o, --output <file>', 'Output file path (SVG format)', 'output.svg')
      .option('-t, --title [title]', 'Plot title')
      .action(async (options) => {
        if (options.expression && options.range) {
          await this.handlePlotCommand(options);
        } else {
          this.program.help();
        }
      });
  }

  async handlePlotCommand(options) {
    try {
      const { expression, range, output, title } = options;

      if (!expression) {
        throw new Error('Expression is required. Use --expression "sin(x)" or -e "sin(x)"');
      }

      if (!range) {
        throw new Error('Range is required. Use --range "x=-1:1" or -r "x=-1:1"');
      }

      console.log(`Generating plot for expression: ${expression}`);
      console.log(`Range: ${range}`);
      
      // Generate time series data
      const geoJsonData = this.generator.generate(expression, range);
      console.log(`Generated ${geoJsonData.geometry.coordinates.length} data points`);
      
      // Generate plot
      const plotTitle = title || `${expression}`;
      const svgContent = this.plotter.generateSVG(geoJsonData, plotTitle);
      
      // Save to file
      if (extname(output) !== '.svg') {
        throw new Error('Only SVG output is currently supported. Use .svg file extension.');
      }
      
      writeFileSync(output, svgContent);
      console.log(`Plot saved to: ${output}`);
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }

  async run(args) {
    if (args.length === 0) {
      this.program.outputHelp();
      return;
    }
    
    await this.program.parseAsync(['node', 'plot-code-lib', ...args]);
  }
}

/**
 * Main function for programmatic use
 */
export function main(args) {
  const cli = new CLI();
  return cli.run(args);
}

/**
 * CLI entry point
 */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

// Export classes for library use
export { ExpressionParser, TimeSeriesGenerator, PlotGenerator };
