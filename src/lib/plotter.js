// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/plotter.js

import fs from 'fs';
import path from 'path';
import * as d3 from 'd3';

/**
 * Generates SVG plots from time series data
 */
export class SVGPlotter {
  constructor(options = {}) {
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.margin = options.margin || { top: 20, right: 20, bottom: 40, left: 50 };
    this.plotWidth = this.width - this.margin.left - this.margin.right;
    this.plotHeight = this.height - this.margin.top - this.margin.bottom;
  }

  /**
   * Create SVG plot from time series data
   * @param {Array} data - Array of {x, y} points
   * @param {object} options - Plot options
   * @returns {string} SVG content as string
   */
  plot(data, options = {}) {
    if (!data || data.length === 0) {
      throw new Error('No data provided for plotting');
    }

    const {
      title = 'Mathematical Function Plot',
      xLabel = 'x',
      yLabel = 'y',
      strokeColor = '#2563eb',
      strokeWidth = 2,
      showGrid = true,
      showAxes = true
    } = options;

    // Create scales
    const xExtent = d3.extent(data, d => d.x);
    const yExtent = d3.extent(data, d => d.y);
    
    // Add 5% padding to ranges
    const xPadding = (xExtent[1] - xExtent[0]) * 0.05;
    const yPadding = (yExtent[1] - yExtent[0]) * 0.05;
    
    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
      .range([0, this.plotWidth]);
      
    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([this.plotHeight, 0]);

    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCardinal);

    // Generate SVG content
    let svg = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles
    svg += `
      <style>
        .grid line { stroke: #e0e0e0; stroke-width: 1; }
        .axis { stroke: #333; stroke-width: 1; }
        .axis text { fill: #333; font-family: Arial, sans-serif; font-size: 12px; }
        .title { fill: #333; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; }
        .label { fill: #666; font-family: Arial, sans-serif; font-size: 14px; }
        .plot-line { fill: none; stroke: ${strokeColor}; stroke-width: ${strokeWidth}; }
      </style>`;

    // Create main group with margins
    svg += `<g transform="translate(${this.margin.left}, ${this.margin.top})">`;

    // Draw grid
    if (showGrid) {
      const xTicks = xScale.ticks(10);
      const yTicks = yScale.ticks(8);

      svg += '<g class="grid">';
      // Vertical grid lines
      xTicks.forEach(tick => {
        const x = xScale(tick);
        svg += `<line x1="${x}" y1="0" x2="${x}" y2="${this.plotHeight}"/>`;
      });
      // Horizontal grid lines
      yTicks.forEach(tick => {
        const y = yScale(tick);
        svg += `<line x1="0" y1="${y}" x2="${this.plotWidth}" y2="${y}"/>`;
      });
      svg += '</g>';
    }

    // Draw axes
    if (showAxes) {
      svg += '<g class="axis">';
      // X axis
      svg += `<line x1="0" y1="${this.plotHeight}" x2="${this.plotWidth}" y2="${this.plotHeight}"/>`;
      // Y axis
      svg += `<line x1="0" y1="0" x2="0" y2="${this.plotHeight}"/>`;
      
      // X axis ticks and labels
      const xTicks = xScale.ticks(10);
      xTicks.forEach(tick => {
        const x = xScale(tick);
        svg += `<line x1="${x}" y1="${this.plotHeight}" x2="${x}" y2="${this.plotHeight + 5}"/>`;
        svg += `<text x="${x}" y="${this.plotHeight + 18}" text-anchor="middle" class="axis">${tick.toFixed(1)}</text>`;
      });
      
      // Y axis ticks and labels
      const yTicks = yScale.ticks(8);
      yTicks.forEach(tick => {
        const y = yScale(tick);
        svg += `<line x1="0" y1="${y}" x2="-5" y2="${y}"/>`;
        svg += `<text x="-8" y="${y + 4}" text-anchor="end" class="axis">${tick.toFixed(1)}</text>`;
      });
      svg += '</g>';
    }

    // Draw the main line
    const pathData = line(data);
    svg += `<path d="${pathData}" class="plot-line"/>`;

    svg += '</g>'; // Close main group

    // Add title
    svg += `<text x="${this.width / 2}" y="16" text-anchor="middle" class="title">${title}</text>`;
    
    // Add axis labels
    svg += `<text x="${this.width / 2}" y="${this.height - 5}" text-anchor="middle" class="label">${xLabel}</text>`;
    svg += `<text x="15" y="${this.height / 2}" text-anchor="middle" transform="rotate(-90, 15, ${this.height / 2})" class="label">${yLabel}</text>`;

    svg += '</svg>';

    return svg;
  }

  /**
   * Save SVG content to file
   * @param {string} svgContent - SVG content string
   * @param {string} filename - Output filename
   */
  async saveSVG(svgContent, filename) {
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filename, svgContent, 'utf8');
  }
}

export default SVGPlotter;