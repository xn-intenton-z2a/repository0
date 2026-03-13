#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

const isNode = typeof process !== "undefined" && !!process.versions?.node;

// Import dependencies conditionally for browser compatibility
let mathjs, d3, sharp, fs, path;

if (isNode) {
  try {
    const mathImport = await import("mathjs");
    const d3Import = await import("d3");
    const { default: sharpImport } = await import("sharp");
    const { promises: fsImport } = await import("fs");
    const pathImport = await import("path");
    
    // mathjs doesn't use default export
    mathjs = mathImport;
    d3 = d3Import;
    sharp = sharpImport;
    fs = fsImport;
    path = pathImport;
  } catch (error) {
    console.error("Failed to load dependencies:", error.message);
  }
}

let pkg;
if (isNode) {
  const { createRequire } = await import("module");
  const requireFn = createRequire(import.meta.url);
  pkg = requireFn("../../package.json");
} else {
  try {
    const resp = await fetch(new URL("../../package.json", import.meta.url));
    pkg = await resp.json();
  } catch {
    pkg = { name: document.title, version: "0.0.0", description: "" };
  }
}

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

export function getIdentity() {
  return { name, version, description };
}

// Expression Parser Class
export class ExpressionParser {
  constructor() {
    if (!isNode || !mathjs) {
      throw new Error("ExpressionParser requires Math.js (Node.js environment)");
    }
  }

  parse(expression) {
    try {
      // Handle y=f(x) format by extracting the right side
      const cleanExpression = expression.includes('=') ? expression.split('=')[1].trim() : expression;
      
      // Create a function that evaluates the expression with given variables
      const compiledExpression = mathjs.compile(cleanExpression);
      
      return (vars) => {
        try {
          return compiledExpression.evaluate(vars);
        } catch (error) {
          throw new Error(`Expression evaluation error: ${error.message}`);
        }
      };
    } catch (error) {
      throw new Error(`Expression parsing error: ${error.message}`);
    }
  }
}

// Time Series Generator Class
export class TimeSeriesGenerator {
  parseRange(rangeStr) {
    const range = {};
    
    // Handle formats like "x=-1:1" or "x=-pi:pi,step=0.1"
    const parts = rangeStr.split(',');
    const mainPart = parts[0]; // "x=-1:1"
    
    const [variable, bounds] = mainPart.split('=');
    const [minStr, maxStr] = bounds.split(':');
    
    // Handle mathematical constants
    const evalMath = (str) => {
      return str === 'pi' ? Math.PI : 
             str === 'e' ? Math.E :
             str === '-pi' ? -Math.PI :
             str === '-e' ? -Math.E :
             parseFloat(str);
    };
    
    range[variable.trim()] = {
      min: evalMath(minStr.trim()),
      max: evalMath(maxStr.trim()),
      step: 0.1 // default step
    };
    
    // Parse step if provided
    const stepPart = parts.find(p => p.includes('step='));
    if (stepPart) {
      range[variable.trim()].step = parseFloat(stepPart.split('=')[1]);
    }
    
    return range;
  }

  generate(expressionFunc, rangeSpec) {
    const data = [];
    
    // Assume single variable for now (x)
    const varName = Object.keys(rangeSpec)[0];
    const { min, max, step } = rangeSpec[varName];
    
    for (let value = min; value <= max; value += step) {
      const vars = {};
      vars[varName] = value;
      
      try {
        const result = expressionFunc(vars);
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
          data.push({ [varName]: value, y: result });
        }
      } catch (error) {
        // Skip invalid points (e.g., division by zero, domain errors)
        continue;
      }
    }
    
    return data;
  }

  exportJSON(data) {
    return JSON.stringify(data, null, 2);
  }

  exportCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvLines = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h]).join(','))
    ];
    
    return csvLines.join('\n');
  }
}

// Plot Renderer Class
export class PlotRenderer {
  constructor() {
    if (!isNode || !d3 || !sharp) {
      throw new Error("PlotRenderer requires D3.js and Sharp (Node.js environment)");
    }
  }

  renderSVG(data, options = {}) {
    if (!isNode) {
      throw new Error("SVG rendering requires Node.js environment");
    }
    
    if (!data || data.length === 0) {
      return '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><text x="200" y="150" text-anchor="middle">No data to plot</text></svg>';
    }
    
    const {
      width = 800,
      height = 600,
      title = "",
      margins = { top: 50, right: 50, bottom: 70, left: 70 }
    } = options;
    
    const plotWidth = width - margins.left - margins.right;
    const plotHeight = height - margins.top - margins.bottom;
    
    // Extract x and y values
    const xKey = Object.keys(data[0]).find(k => k !== 'y');
    const xValues = data.map(d => d[xKey]);
    const yValues = data.map(d => d.y);
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(xValues))
      .range([0, plotWidth]);
      
    const yScale = d3.scaleLinear()
      .domain(d3.extent(yValues))
      .range([plotHeight, 0]);
    
    // Create line generator
    const line = d3.line()
      .x(d => xScale(d[xKey]))
      .y(d => yScale(d.y))
      .curve(d3.curveLinear);
    
    // Build SVG string
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add title
    if (title) {
      svg += `<text x="${width/2}" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${title}</text>`;
    }
    
    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    // Add grid lines
    svg += `<g transform="translate(${margins.left},${margins.top})">`;
    
    // Y grid lines
    const yTicks = yScale.ticks();
    yTicks.forEach(tick => {
      const y = yScale(tick);
      svg += `<line x1="0" y1="${y}" x2="${plotWidth}" y2="${y}" stroke="#e0e0e0" stroke-width="1"/>`;
    });
    
    // X grid lines
    const xTicks = xScale.ticks();
    xTicks.forEach(tick => {
      const x = xScale(tick);
      svg += `<line x1="${x}" y1="0" x2="${x}" y2="${plotHeight}" stroke="#e0e0e0" stroke-width="1"/>`;
    });
    
    // Add data line
    const pathData = line(data);
    svg += `<path d="${pathData}" fill="none" stroke="blue" stroke-width="2"/>`;
    
    // Add axes
    svg += `<g transform="translate(0,${plotHeight})">`;
    xTicks.forEach(tick => {
      const x = xScale(tick);
      svg += `<line x1="${x}" y1="0" x2="${x}" y2="6" stroke="black"/>`;
      svg += `<text x="${x}" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">${tick.toFixed(1)}</text>`;
    });
    svg += '</g>';
    
    svg += '<g>';
    yTicks.forEach(tick => {
      const y = yScale(tick);
      svg += `<line x1="0" y1="${y}" x2="-6" y2="${y}" stroke="black"/>`;
      svg += `<text x="-10" y="${y + 4}" text-anchor="end" font-family="Arial, sans-serif" font-size="12">${tick.toFixed(1)}</text>`;
    });
    svg += '</g>';
    
    svg += '</g>'; // Close plot area
    svg += '</svg>';
    
    return svg;
  }

  async renderPNG(data, options = {}) {
    if (!isNode) {
      throw new Error("PNG rendering requires Node.js environment");
    }
    
    const svgContent = this.renderSVG(data, options);
    const pngBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();
    return pngBuffer;
  }

  async saveFile(content, filename) {
    if (!isNode) {
      throw new Error("File saving requires Node.js environment");
    }
    
    const ext = path.extname(filename).toLowerCase();
    
    if (ext === '.svg') {
      await fs.writeFile(filename, content, 'utf8');
    } else if (ext === '.png') {
      await fs.writeFile(filename, content);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
  }
}

// CLI Interface function
export async function plotCLI(args) {
  if (!isNode) {
    throw new Error("CLI interface requires Node.js environment");
  }
  
  const options = {
    expression: null,
    range: null,
    file: null,
    verbose: false,
    help: false
  };
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--expression':
        options.expression = args[++i];
        break;
      case '--range':
        options.range = args[++i];
        break;
      case '--file':
        options.file = args[++i];
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--help':
        options.help = true;
        break;
    }
  }
  
  if (options.help) {
    console.log(`
${name} v${version} - ${description}

Usage: node src/lib/main.js [OPTIONS]

Options:
  --expression EXPR    Mathematical expression (e.g., "y=sin(x)")
  --range RANGE       Variable range (e.g., "x=-pi:pi" or "x=-1:1,step=0.05")
  --file FILENAME     Output file (.svg or .png)
  --verbose           Show detailed output
  --help              Show this help message
  --version           Show version number

Examples:
  node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi" --file sine.svg
  node src/lib/main.js --expression "y=x^2+1" --range "x=-3:3,step=0.1" --file parabola.png
  node src/lib/main.js --expression "y=log(x)" --range "x=0.1:10" --file log.svg --verbose
`);
    return;
  }
  
  if (!options.expression) {
    console.error("Error: --expression is required");
    return;
  }
  
  if (!options.range) {
    console.error("Error: --range is required");
    return;
  }
  
  if (!options.file) {
    console.error("Error: --file is required");
    return;
  }
  
  try {
    if (options.verbose) {
      console.log("Parsing expression:", options.expression);
    }
    
    const parser = new ExpressionParser();
    const expressionFunc = parser.parse(options.expression);
    
    if (options.verbose) {
      console.log("Generating time series data for range:", options.range);
    }
    
    const generator = new TimeSeriesGenerator();
    const rangeSpec = generator.parseRange(options.range);
    const data = generator.generate(expressionFunc, rangeSpec);
    
    if (options.verbose) {
      console.log(`Generated ${data.length} data points`);
    }
    
    const renderer = new PlotRenderer();
    const ext = path.extname(options.file).toLowerCase();
    
    if (ext === '.svg') {
      const svgContent = renderer.renderSVG(data, { title: options.expression });
      await renderer.saveFile(svgContent, options.file);
    } else if (ext === '.png') {
      const pngBuffer = await renderer.renderPNG(data, { title: options.expression });
      await renderer.saveFile(pngBuffer, options.file);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
    
    console.log(`Plot saved to ${options.file}`);
    
  } catch (error) {
    console.error("Error:", error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
  }
}

export async function main(args = []) {
  if (args?.includes("--version")) {
    console.log(version);
    return;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  
  // Check if this is a plotting command
  if (args?.some(arg => ['--expression', '--range', '--file', '--help'].includes(arg))) {
    return await plotCLI(args);
  }
  
  console.log(`${name}@${version}`);
}

if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    await main(args);
  }
}
