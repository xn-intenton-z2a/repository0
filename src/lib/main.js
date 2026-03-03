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
import sharp from "sharp";

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
    
    try {
      const start = evaluate(startStr);
      const end = evaluate(endStr);
      const step = stepStr ? evaluate(stepStr) : (end - start) / 100; // Default 100 points
      
      return { variable, start, end, step };
    } catch (error) {
      throw new Error(`Invalid range values in "${rangeSpec}": ${error.message}`);
    }
  }

  /**
   * Generate coordinate data from expression and range
   * @param {string} expression - Mathematical expression
   * @param {string} rangeSpec - Range specification
   * @returns {Object} - GeoJSON LineString feature
   */
  generate(expression, rangeSpec) {
    const range = this.parseRange(rangeSpec);
    const func = this.parser.parse(expression);
    const coordinates = [];
    
    for (let value = range.start; value <= range.end; value += range.step) {
      try {
        const variables = {};
        variables[range.variable] = value;
        const result = func(variables);
        
        // Handle complex numbers and invalid results
        if (typeof result === 'object' && result.im !== undefined) {
          // Skip complex numbers for now
          continue;
        }
        
        if (isFinite(result)) {
          coordinates.push([value, result]);
        }
      } catch (error) {
        // Skip invalid points
        continue;
      }
    }
    
    if (coordinates.length === 0) {
      throw new Error('No valid data points generated from expression');
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

  /**
   * Generate parametric curve data
   * @param {string} xExpression - X coordinate expression
   * @param {string} yExpression - Y coordinate expression  
   * @param {string} rangeSpec - Parameter range specification
   * @returns {Object} - GeoJSON LineString feature
   */
  generateParametric(xExpression, yExpression, rangeSpec) {
    const range = this.parseRange(rangeSpec);
    const xFunc = this.parser.parse(xExpression);
    const yFunc = this.parser.parse(yExpression);
    const coordinates = [];
    
    for (let value = range.start; value <= range.end; value += range.step) {
      try {
        const variables = {};
        variables[range.variable] = value;
        
        const x = xFunc(variables);
        const y = yFunc(variables);
        
        if (isFinite(x) && isFinite(y)) {
          coordinates.push([x, y]);
        }
      } catch (error) {
        // Skip invalid points
        continue;
      }
    }
    
    if (coordinates.length === 0) {
      throw new Error('No valid data points generated from parametric expressions');
    }
    
    return {
      type: "Feature",
      properties: {
        xExpression: xExpression,
        yExpression: yExpression,
        range: rangeSpec,
        mode: "parametric"
      },
      geometry: {
        type: "LineString",
        coordinates: coordinates
      }
    };
  }
}

/**
 * Plot generator that creates SVG and PNG visualizations
 */
class PlotGenerator {
  constructor() {
    this.width = 800;
    this.height = 600;
    this.margins = { top: 40, right: 40, bottom: 60, left: 80 };
  }

  /**
   * Set plot dimensions
   * @param {number} width - Plot width
   * @param {number} height - Plot height
   */
  setDimensions(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   * Generate SVG plot from GeoJSON data
   * @param {Object} geoJsonData - GeoJSON feature or feature collection
   * @param {Object} options - Plot options
   * @returns {string} - SVG string
   */
  generateSVG(geoJsonData, options = {}) {
    const dom = new JSDOM();
    global.document = dom.window.document;
    
    const svg = select(dom.window.document.body)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("xmlns", "http://www.w3.org/2000/svg");
      
    const plotWidth = this.width - this.margins.left - this.margins.right;
    const plotHeight = this.height - this.margins.top - this.margins.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${this.margins.left},${this.margins.top})`);
    
    // Extract coordinates from GeoJSON
    let allCoordinates = [];
    const features = geoJsonData.type === "FeatureCollection" ? geoJsonData.features : [geoJsonData];
    
    features.forEach(feature => {
      if (feature.geometry.type === "LineString") {
        allCoordinates = allCoordinates.concat(feature.geometry.coordinates);
      }
    });
    
    if (allCoordinates.length === 0) {
      throw new Error('No coordinate data found in GeoJSON');
    }
    
    // Calculate scales
    const xExtent = [
      Math.min(...allCoordinates.map(d => d[0])),
      Math.max(...allCoordinates.map(d => d[0]))
    ];
    const yExtent = [
      Math.min(...allCoordinates.map(d => d[1])),
      Math.max(...allCoordinates.map(d => d[1]))
    ];
    
    const xScale = scaleLinear()
      .domain(xExtent)
      .range([0, plotWidth]);
      
    const yScale = scaleLinear()
      .domain(yExtent)
      .range([plotHeight, 0]);
    
    // Add axes
    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale);
    
    g.append("g")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(xAxis);
      
    g.append("g")
      .call(yAxis);
    
    // Add axis labels
    g.append("text")
      .attr("transform", `translate(${plotWidth / 2}, ${plotHeight + 40})`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(options.xLabel || "x");
      
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margins.left + 20)
      .attr("x", 0 - (plotHeight / 2))
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(options.yLabel || "y");
    
    // Add title
    if (options.title) {
      svg.append("text")
        .attr("x", this.width / 2)
        .attr("y", 25)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(options.title);
    }
    
    // Draw lines for each feature
    const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"];
    features.forEach((feature, i) => {
      const lineGenerator = line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));
      
      g.append("path")
        .datum(feature.geometry.coordinates)
        .attr("fill", "none")
        .attr("stroke", colors[i % colors.length])
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);
    });
    
    return dom.window.document.body.innerHTML;
  }

  /**
   * Generate PNG from SVG
   * @param {string} svgString - SVG string
   * @returns {Buffer} - PNG buffer
   */
  async generatePNG(svgString) {
    try {
      return await sharp(Buffer.from(svgString))
        .png()
        .toBuffer();
    } catch (error) {
      throw new Error(`Failed to convert SVG to PNG: ${error.message}`);
    }
  }
}

/**
 * Main CLI application
 */
class PlotCodeLib {
  constructor() {
    this.parser = new ExpressionParser();
    this.generator = new TimeSeriesGenerator(this.parser);
    this.plotter = new PlotGenerator();
  }

  /**
   * Run the CLI application
   */
  async run() {
    const program = new Command();
    
    program
      .name('plot-code-lib')
      .description('Generate mathematical plots from expressions')
      .version('0.1.0');

    program
      .command('plot')
      .description('Generate a plot from a mathematical expression')
      .requiredOption('-e, --expression <expr>', 'Mathematical expression (e.g., "sin(x)", "x^2")')
      .requiredOption('-r, --range <range>', 'Variable range (e.g., "x=-1:1", "x=0:2*pi:0.1")')
      .requiredOption('-o, --output <file>', 'Output file (SVG or PNG)')
      .option('-t, --title <title>', 'Plot title')
      .option('-w, --width <width>', 'Plot width', '800')
      .option('-h, --height <height>', 'Plot height', '600')
      .option('--xlabel <label>', 'X-axis label', 'x')
      .option('--ylabel <label>', 'Y-axis label', 'y')
      .action(async (options) => {
        try {
          await this.generatePlot(options);
        } catch (error) {
          console.error('Error:', error.message);
          process.exit(1);
        }
      });

    program
      .command('parametric')
      .description('Generate a parametric plot')
      .requiredOption('-x, --xexpr <expr>', 'X coordinate expression (e.g., "cos(t)")')
      .requiredOption('-y, --yexpr <expr>', 'Y coordinate expression (e.g., "sin(t)")')
      .requiredOption('-r, --range <range>', 'Parameter range (e.g., "t=0:2*pi")')
      .requiredOption('-o, --output <file>', 'Output file (SVG or PNG)')
      .option('-t, --title <title>', 'Plot title')
      .option('-w, --width <width>', 'Plot width', '800')
      .option('-h, --height <height>', 'Plot height', '600')
      .option('--xlabel <label>', 'X-axis label', 'x')
      .option('--ylabel <label>', 'Y-axis label', 'y')
      .action(async (options) => {
        try {
          await this.generateParametricPlot(options);
        } catch (error) {
          console.error('Error:', error.message);
          process.exit(1);
        }
      });

    program
      .command('export')
      .description('Export coordinate data without visualization')
      .requiredOption('-e, --expression <expr>', 'Mathematical expression (e.g., "sin(x)", "x^2")')
      .requiredOption('-r, --range <range>', 'Variable range (e.g., "x=-1:1", "x=0:2*pi:0.1")')
      .requiredOption('-o, --output <file>', 'Output file (JSON)')
      .option('--format <format>', 'Output format (geojson, csv, json)', 'geojson')
      .action(async (options) => {
        try {
          await this.exportData(options);
        } catch (error) {
          console.error('Error:', error.message);
          process.exit(1);
        }
      });

    await program.parseAsync();
  }

  /**
   * Generate a standard plot
   * @param {Object} options - CLI options
   */
  async generatePlot(options) {
    this.plotter.setDimensions(parseInt(options.width), parseInt(options.height));
    
    // Generate time series data
    const geoJsonData = this.generator.generate(options.expression, options.range);
    
    // Create plot options
    const plotOptions = {
      title: options.title,
      xLabel: options.xlabel,
      yLabel: options.ylabel
    };
    
    // Generate SVG
    const svgString = this.plotter.generateSVG(geoJsonData, plotOptions);
    
    // Determine output format and write file
    const outputExt = extname(options.output).toLowerCase();
    
    if (outputExt === '.svg') {
      writeFileSync(options.output, svgString);
      console.log(`SVG plot saved to ${options.output}`);
    } else if (outputExt === '.png') {
      const pngBuffer = await this.plotter.generatePNG(svgString);
      writeFileSync(options.output, pngBuffer);
      console.log(`PNG plot saved to ${options.output}`);
    } else {
      throw new Error('Output file must have .svg or .png extension');
    }
  }

  /**
   * Generate a parametric plot
   * @param {Object} options - CLI options
   */
  async generateParametricPlot(options) {
    this.plotter.setDimensions(parseInt(options.width), parseInt(options.height));
    
    // Generate parametric time series data
    const geoJsonData = this.generator.generateParametric(options.xexpr, options.yexpr, options.range);
    
    // Create plot options
    const plotOptions = {
      title: options.title,
      xLabel: options.xlabel,
      yLabel: options.ylabel
    };
    
    // Generate SVG
    const svgString = this.plotter.generateSVG(geoJsonData, plotOptions);
    
    // Determine output format and write file
    const outputExt = extname(options.output).toLowerCase();
    
    if (outputExt === '.svg') {
      writeFileSync(options.output, svgString);
      console.log(`Parametric SVG plot saved to ${options.output}`);
    } else if (outputExt === '.png') {
      const pngBuffer = await this.plotter.generatePNG(svgString);
      writeFileSync(options.output, pngBuffer);
      console.log(`Parametric PNG plot saved to ${options.output}`);
    } else {
      throw new Error('Output file must have .svg or .png extension');
    }
  }

  /**
   * Export coordinate data in specified format
   * @param {Object} options - CLI options
   */
  async exportData(options) {
    // Generate time series data
    const geoJsonData = this.generator.generate(options.expression, options.range);
    
    let outputData;
    let outputString;
    
    switch (options.format.toLowerCase()) {
      case 'geojson':
        outputData = geoJsonData;
        outputString = JSON.stringify(outputData, null, 2);
        break;
        
      case 'csv':
        const coordinates = geoJsonData.geometry.coordinates;
        const csvLines = ['x,y'];
        coordinates.forEach(([x, y]) => {
          csvLines.push(`${x},${y}`);
        });
        outputString = csvLines.join('\n');
        break;
        
      case 'json':
        outputData = {
          expression: options.expression,
          range: options.range,
          data: geoJsonData.geometry.coordinates
        };
        outputString = JSON.stringify(outputData, null, 2);
        break;
        
      default:
        throw new Error('Unsupported format. Use: geojson, csv, or json');
    }
    
    writeFileSync(options.output, outputString);
    console.log(`${options.format.toUpperCase()} data exported to ${options.output}`);
  }
}

// Run the application if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = new PlotCodeLib();
  app.run().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

export { ExpressionParser, TimeSeriesGenerator, PlotGenerator, PlotCodeLib };