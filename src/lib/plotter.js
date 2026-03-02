// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/plotter.js

import { createCanvas } from "canvas";
import * as d3 from "d3";
import { JSDOM } from "jsdom";
import fs from "fs/promises";
import path from "path";

/**
 * Main plotting class that generates SVG and PNG plots from mathematical expressions
 */
export class ExpressionPlotter {
  constructor(options = {}) {
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.title = options.title;
    this.margin = { top: 60, right: 50, bottom: 60, left: 70 };
    this.plotWidth = this.width - this.margin.left - this.margin.right;
    this.plotHeight = this.height - this.margin.top - this.margin.bottom;
  }

  /**
   * Generate data points from the expression
   */
  generateData(expression, ranges, pointCount = 1000) {
    const data = [];
    const { type, independentVariable, evaluate } = expression;

    if (type === 'parametric') {
      const tRange = ranges.t || ranges[independentVariable];
      if (!tRange) {
        throw new Error('Parametric plots require a range for the parameter variable');
      }

      const step = (tRange.max - tRange.min) / pointCount;
      for (let i = 0; i <= pointCount; i++) {
        const t = tRange.min + i * step;
        try {
          const result = evaluate({ [independentVariable]: t, t });
          if (result.x !== undefined && result.y !== undefined && 
              isFinite(result.x) && isFinite(result.y)) {
            data.push({ x: result.x, y: result.y, t });
          }
        } catch (error) {
          // Skip invalid points
          continue;
        }
      }
    } else if (type === 'polar') {
      const angleVar = independentVariable;
      const angleRange = ranges[angleVar];
      if (!angleRange) {
        throw new Error('Polar plots require a range for the angle variable');
      }

      const step = (angleRange.max - angleRange.min) / pointCount;
      for (let i = 0; i <= pointCount; i++) {
        const angle = angleRange.min + i * step;
        try {
          const result = evaluate({ [angleVar]: angle });
          if (result.r !== undefined && isFinite(result.r)) {
            const x = result.r * Math.cos(angle);
            const y = result.r * Math.sin(angle);
            data.push({ x, y, [angleVar]: angle, r: result.r });
          }
        } catch (error) {
          continue;
        }
      }
    } else {
      // Cartesian (default)
      const xRange = ranges.x || { min: -10, max: 10 };
      const step = (xRange.max - xRange.min) / pointCount;
      
      for (let i = 0; i <= pointCount; i++) {
        const x = xRange.min + i * step;
        try {
          const result = evaluate({ x });
          if (result.y !== undefined && isFinite(result.y)) {
            data.push({ x, y: result.y });
          }
        } catch (error) {
          continue;
        }
      }
    }

    if (data.length === 0) {
      throw new Error('No valid data points generated. Check your expression and ranges.');
    }

    return data;
  }

  /**
   * Create SVG plot
   */
  createSVGPlot(data, expression, ranges) {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    const document = dom.window.document;
    global.document = document;
    global.window = dom.window;

    // Create SVG
    const svg = d3.create("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .style("background", "white");

    // Create plot area
    const g = svg.append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    // Calculate scales
    const xExtent = d3.extent(data, d => d.x);
    const yExtent = d3.extent(data, d => d.y);
    
    const xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([0, this.plotWidth]);
    
    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([this.plotHeight, 0]);

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format(".2f"));
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format(".2f"));

    g.append("g")
      .attr("transform", `translate(0,${this.plotHeight})`)
      .call(xAxis)
      .append("text")
      .attr("x", this.plotWidth / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .text("x");

    g.append("g")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -this.plotHeight / 2)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .text("y");

    // Add grid lines
    g.selectAll(".grid-x")
      .data(xScale.ticks())
      .enter()
      .append("line")
      .attr("class", "grid-x")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", 0)
      .attr("y2", this.plotHeight)
      .style("stroke", "#e0e0e0")
      .style("stroke-width", 0.5);

    g.selectAll(".grid-y")
      .data(yScale.ticks())
      .enter()
      .append("line")
      .attr("class", "grid-y")
      .attr("x1", 0)
      .attr("x2", this.plotWidth)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .style("stroke", "#e0e0e0")
      .style("stroke-width", 0.5);

    // Add the plot line
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCardinal);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3498db")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add title
    if (this.title) {
      svg.append("text")
        .attr("x", this.width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(this.title);
    }

    // Add expression as subtitle
    svg.append("text")
      .attr("x", this.width / 2)
      .attr("y", this.title ? 50 : 30)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#666")
      .text(expression.formula);

    return svg.node().outerHTML;
  }

  /**
   * Create PNG plot using Canvas
   */
  async createPNGPlot(data, expression, ranges) {
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.width, this.height);

    // Calculate scales
    const xExtent = d3.extent(data, d => d.x);
    const yExtent = d3.extent(data, d => d.y);
    
    const xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([this.margin.left, this.width - this.margin.right]);
    
    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([this.height - this.margin.bottom, this.margin.top]);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    const xTicks = xScale.ticks ? xScale.ticks() : d3.range(xExtent[0], xExtent[1], (xExtent[1] - xExtent[0]) / 10);
    const yTicks = yScale.ticks ? yScale.ticks() : d3.range(yExtent[0], yExtent[1], (yExtent[1] - yExtent[0]) / 10);
    
    // Vertical grid lines
    xTicks.forEach(tick => {
      const x = xScale(tick);
      ctx.beginPath();
      ctx.moveTo(x, this.margin.top);
      ctx.lineTo(x, this.height - this.margin.bottom);
      ctx.stroke();
    });

    // Horizontal grid lines
    yTicks.forEach(tick => {
      const y = yScale(tick);
      ctx.beginPath();
      ctx.moveTo(this.margin.left, y);
      ctx.lineTo(this.width - this.margin.right, y);
      ctx.stroke();
    });

    // Draw axes
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(this.margin.left, this.height - this.margin.bottom);
    ctx.lineTo(this.width - this.margin.right, this.height - this.margin.bottom);
    ctx.stroke();
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(this.margin.left, this.margin.top);
    ctx.lineTo(this.margin.left, this.height - this.margin.bottom);
    ctx.stroke();

    // Draw the plot line
    if (data.length > 0) {
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const firstPoint = data[0];
      ctx.moveTo(xScale(firstPoint.x), yScale(firstPoint.y));
      
      for (let i = 1; i < data.length; i++) {
        const point = data[i];
        ctx.lineTo(xScale(point.x), yScale(point.y));
      }
      
      ctx.stroke();
    }

    // Add title and expression
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    
    if (this.title) {
      ctx.fillText(this.title, this.width / 2, 30);
    }
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(expression.formula, this.width / 2, this.title ? 50 : 30);

    return canvas.toBuffer('image/png');
  }

  /**
   * Main plot function
   */
  async plot(expression, ranges, options = {}) {
    const pointCount = options.points || 1000;
    const format = options.format || 'svg';
    const outputFile = options.outputFile || `output.${format}`;

    console.log(`📊 Generating ${pointCount} data points...`);
    const data = this.generateData(expression, ranges, pointCount);
    console.log(`✅ Generated ${data.length} valid points`);

    // Ensure output directory exists
    const dir = path.dirname(outputFile);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    if (format === 'png' || outputFile.endsWith('.png')) {
      console.log('🎨 Creating PNG plot...');
      const pngBuffer = await this.createPNGPlot(data, expression, ranges);
      await fs.writeFile(outputFile, pngBuffer);
    } else {
      console.log('🎨 Creating SVG plot...');
      const svgContent = this.createSVGPlot(data, expression, ranges);
      await fs.writeFile(outputFile, svgContent, 'utf8');
    }

    return {
      dataPoints: data.length,
      outputFile,
      format: outputFile.endsWith('.png') ? 'png' : 'svg'
    };
  }
}