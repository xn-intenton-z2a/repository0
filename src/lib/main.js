#!/usr/bin/env node
// src/lib/main.js

/*
Incremental Change Plan (aligned with CONTRIBUTING.md):
1. Refactor and modularize plotting functions while aligning with our ontology management and CLI tool mission.
2. Simplify overly complex mathematical computations and remove redundant math-specific details.
3. Enhance error handling and interactive CLI features.
4. Improve test coverage and documentation.
*/

import { fileURLToPath } from 'url';
import fs from 'fs';
import readline from 'readline';
import sharp from 'sharp';

// Utility Functions
const range = (start, end, step = 1) => {
  const arr = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      arr.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      arr.push(i);
    }
  }
  return arr;
};

const formatNumber = (n) => {
  const s = n.toFixed(2);
  return s === '-0.00' ? '0.00' : s;
};

// Summary Calculation
const getSummary = (points) => {
  if (!points || points.length === 0) return {};
  let minX = Infinity, maxX = -Infinity, sumX = 0;
  let minY = Infinity, maxY = -Infinity, sumY = 0;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
    sumX += p.x;
    sumY += p.y;
  }
  const avgX = sumX / points.length;
  const avgY = sumY / points.length;
  return {
    minX: formatNumber(minX),
    maxX: formatNumber(maxX),
    avgX: formatNumber(avgX),
    minY: formatNumber(minY),
    maxY: formatNumber(maxY),
    avgY: formatNumber(avgY)
  };
};

// Plotting Functions (simplified implementations)
const plotQuadraticParam = ({ a = 1, b = 0, c = 0, xMin = -10, xMax = 10, step = 1 } = {}) => {
  return range(xMin, xMax + step, step).map(x => ({ x, y: a * x * x + b * x + c }));
};

const plotSineParam = ({ amplitude = 1, frequency = 1, phase = 0, xMin = 0, xMax = 360, step = 10 } = {}) => {
  return range(xMin, xMax + step, step).map(deg => {
    const rad = (deg * Math.PI) / 180;
    return { x: deg, y: amplitude * Math.sin(frequency * rad + phase) };
  });
};

const plotCosineParam = ({ amplitude = 1, frequency = 1, phase = 0, xMin = 0, xMax = 360, step = 10 } = {}) => {
  return range(xMin, xMax + step, step).map(deg => {
    const rad = (deg * Math.PI) / 180;
    return { x: deg, y: amplitude * Math.cos(frequency * rad + phase) };
  });
};

const plotLinearParam = ({ m = 1, b = 0, xMin = -10, xMax = 10, step = 1 } = {}) => {
  return range(xMin, xMax + step, step).map(x => ({ x, y: m * x + b }));
};

// Backward compatible wrappers
const plotQuadratic = () => plotQuadraticParam();
const plotSine = () => plotSineParam();
const plotCosine = () => plotCosineParam();
const plotLinear = () => plotLinearParam({ m: 2, b: 3 });

// Simplified Formula Parsing Functions
const parseQuadratic = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error('Invalid quadratic formula string: ' + formulaStr);
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
};

const parseSine = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2 || !parts[1].trim()) {
    throw new Error('Invalid sine formula string: ' + formulaStr);
  }
  const rawParams = parts[1].split(",").map(s => s.trim()).filter(Boolean);
  const params = rawParams.map(Number);
  if (params.length !== 6 || params.some(p => isNaN(p))) {
    throw new Error('Invalid sine formula string: ' + formulaStr);
  }
  const [amplitude, frequency, phase, xMin, xMax, step] = params;
  return plotSineParam({ amplitude, frequency, phase, xMin, xMax, step });
};

const parseCosine = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error('Invalid cosine formula string: ' + formulaStr);
  const params = parts[1].split(",").map(Number);
  const [amplitude, frequency, phase, xMin, xMax, step] = params;
  return plotCosineParam({
    amplitude: isNaN(amplitude) ? 1 : amplitude,
    frequency: isNaN(frequency) ? 1 : frequency,
    phase: isNaN(phase) ? 0 : phase,
    xMin: isNaN(xMin) ? 0 : xMin,
    xMax: isNaN(xMax) ? 360 : xMax,
    step: isNaN(step) ? 10 : step
  });
};

const parseLinear = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error('Invalid linear formula string: ' + formulaStr);
  const params = parts[1].split(",").map(Number);
  const [m, b, xMin, xMax, step] = params;
  return plotLinearParam({
    m: isNaN(m) ? 1 : m,
    b: isNaN(b) ? 0 : b,
    xMin: isNaN(xMin) ? -10 : xMin,
    xMax: isNaN(xMax) ? 10 : xMax,
    step: isNaN(step) ? 1 : step
  });
};

// For algebraic generic formulas, keep a simplified version
const parseGenericLinear = (formulaStr) => {
  // Only supports simple 'y=mx+b' format
  const expr = formulaStr.split(":")[0].replace(/\s+/g, '');
  if (!expr.toLowerCase().startsWith('y=')) {
    throw new Error("Linear formula must start with 'y=': " + formulaStr);
  }
  const exprBody = expr.substring(2);
  const mMatch = exprBody.match(/^([+-]?\d*\.?\d*)x/);
  let m = 1;
  if (mMatch) {
    m = mMatch[1] === '' || mMatch[1] === '+' ? 1 : (mMatch[1] === '-' ? -1 : parseFloat(mMatch[1]));
  }
  const bMatch = exprBody.match(/([+-]\d*\.?\d+)(?!x)/);
  let b = 0;
  if (bMatch) {
    b = parseFloat(bMatch[1]);
  }
  let xMin = -10, xMax = 10, step = 1;
  const parts = formulaStr.split(":");
  if (parts.length > 1) {
    const rangeParams = parts[1].split(",").map(Number);
    if (!isNaN(rangeParams[0])) xMin = rangeParams[0];
    if (!isNaN(rangeParams[1])) xMax = rangeParams[1];
    if (!isNaN(rangeParams[2])) step = rangeParams[2];
  }
  return plotLinearParam({ m, b, xMin, xMax, step });
};

// Delegate plotting based on formula string content
const plotFromString = (formulaStr) => {
  formulaStr = formulaStr.trim();
  const lowerStr = formulaStr.toLowerCase();
  if (lowerStr.startsWith('y=')) {
    if (formulaStr.toLowerCase().includes('e^')) {
      // Simplified handling for exponential formulas
      try {
        return parseGenericLinear(formulaStr);
      } catch (e) {
        console.warn('Error parsing exponential formula: ' + e.message);
        return [];
      }
    } else if (formulaStr.toLowerCase().includes('log(')) {
      try {
        return parseCosine(formulaStr); // fallback
      } catch (e) {
        console.warn('Error parsing logarithmic formula: ' + e.message);
        return [];
      }
    } else if (!formulaStr.includes('x^2')) {
      try {
        return parseGenericLinear(formulaStr);
      } catch (e) {
        console.warn('Error parsing linear formula: ' + e.message);
        return [];
      }
    } else {
      try {
        return parseQuadratic(formulaStr);
      } catch (e) {
        console.warn('Error parsing quadratic formula: ' + e.message);
        return [];
      }
    }
  } else if (formulaStr.includes(':')) {
    if (lowerStr.startsWith('quad:') || lowerStr.startsWith('quadratic:')) return parseQuadratic(formulaStr);
    if (lowerStr.startsWith('sine:')) return parseSine(formulaStr);
    if (lowerStr.startsWith('cosine:') || lowerStr.startsWith('cos:')) return parseCosine(formulaStr);
    if (lowerStr.startsWith('linear:')) return parseLinear(formulaStr);
    console.warn('Unknown prefixed formula type for formula: ' + formulaStr);
    return [];
  } else if (formulaStr.includes('=')) {
    try {
      return parseQuadratic(formulaStr);
    } catch (e) {
      console.warn('Error parsing generic quadratic formula: ' + e.message);
      return [];
    }
  } else {
    console.warn('Formula string is not in a recognized format: ' + formulaStr);
    return [];
  }
};

const getPlotsFromFormulas = (formulas = []) => {
  const quadratic = [];
  const sine = [];
  const cosine = [];
  const linear = [];
  formulas.forEach(formula => {
    const lower = formula.toLowerCase();
    try {
      if (lower.startsWith('quad:') || (formula.includes('x^2') && formula.includes('='))) {
        quadratic.push(plotFromString(formula));
      } else if (lower.startsWith('sine:')) {
        sine.push(plotFromString(formula));
      } else if (lower.startsWith('cosine:') || lower.startsWith('cos:')) {
        cosine.push(plotFromString(formula));
      } else if (lower.startsWith('linear:') || (lower.startsWith('y=') && !formula.includes('x^2'))) {
        linear.push(plotFromString(formula));
      } else {
        console.warn('Unrecognized formula: ' + formula);
      }
    } catch (e) {
      console.warn('Error parsing formula: ' + formula + '. ' + e.message);
    }
  });
  if (quadratic.length === 0) quadratic.push(plotQuadratic());
  if (linear.length === 0) linear.push(plotLinear());
  if (sine.length === 0) sine.push(plotSine());
  if (cosine.length === 0) cosine.push(plotCosine());
  return { quadratic, linear, sine, cosine };
};

// SVG Generation Function (simplified and aligned with updated guidelines)
const generateSvg = (quadraticPlots, linearPlots, sinePlots, cosinePlots, gridEnabled = false, rotate = 0, customTitle = '') => {
  const width = 800;
  const height = 1700;
  let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  svg += `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <rect width="100%" height="100%" fill="white" />\n`;
  if (customTitle) {
    svg += `  <title>${customTitle}</title>\n`;
  }
  if (rotate !== 0) {
    svg += `  <g transform="rotate(${formatNumber(rotate)}, ${formatNumber(width / 2)}, ${formatNumber(height / 2)})">\n`;
  }

  // Use preset colors
  const quadraticColors = ['blue', 'darkblue'];
  const linearColors = ['orange', 'darkorange'];
  const sineColors = ['red', 'darkred'];
  const cosineColors = ['teal', 'darkcyan'];

  // Draw simple SVG content for Quadratic Plot
  svg += `  <text x="${width / 2}" y="30" font-size="16" text-anchor="middle">Quadratic Plot</text>\n`;
  const qPoints = quadraticPlots.flat();
  let qAllX = qPoints.map(p => p.x);
  let qAllY = qPoints.map(p => p.y);
  let qMinX = Math.min(...qAllX), qMaxX = Math.max(...qAllX);
  let qMinY = Math.min(...qAllY), qMaxY = Math.max(...qAllY);
  quadraticPlots.forEach((points, idx) => {
    const color = quadraticColors[idx % quadraticColors.length];
    const pts = points.map(p => {
      const px = 50 + ((p.x - qMinX) / (qMaxX - qMinX)) * 700;
      const py = 230 - ((p.y - qMinY) / (qMaxY - qMinY)) * 180;
      return `${formatNumber(px)},${formatNumber(py)}`;
    }).join(' ');
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += "\n";

  // Linear Plot
  svg += `  <text x="${width / 2}" y="250" font-size="16" text-anchor="middle">Linear Plot</text>\n`;
  const lPoints = linearPlots.flat();
  let lAllX = lPoints.map(p => p.x);
  let lAllY = lPoints.map(p => p.y);
  let lMinX = Math.min(...lAllX), lMaxX = Math.max(...lAllX);
  let lMinY = Math.min(...lAllY), lMaxY = Math.max(...lAllY);
  linearPlots.forEach((points, idx) => {
    const color = linearColors[idx % linearColors.length];
    const pts = points.map(p => {
      const px = 50 + ((p.x - lMinX) / (lMaxX - lMinX)) * 700;
      const py = 450 - ((p.y - lMinY) / (lMaxY - lMinY)) * 180;
      return `${formatNumber(px)},${formatNumber(py)}`;
    }).join(' ');
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += "\n";

  // Sine Plot
  svg += `  <text x="${width / 2}" y="470" font-size="16" text-anchor="middle">Sine Plot</text>\n`;
  const sPoints = sinePlots.flat();
  let sAllX = sPoints.map(p => p.x);
  let sAllY = sPoints.map(p => p.y);
  let sMinX = Math.min(...sAllX), sMaxX = Math.max(...sAllX);
  let sMinY = Math.min(...sAllY), sMaxY = Math.max(...sAllY);
  sinePlots.forEach((points, idx) => {
    const color = sineColors[idx % sineColors.length];
    const pts = points.map(p => {
      const px = 50 + ((p.x - sMinX) / (sMaxX - sMinX)) * 700;
      const py = 670 - ((p.y - sMinY) / (sMaxY - sMinY)) * 180;
      return `${formatNumber(px)},${formatNumber(py)}`;
    }).join(' ');
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += "\n";

  // Cosine Plot
  svg += `  <text x="${width / 2}" y="690" font-size="16" text-anchor="middle">Cosine Plot</text>\n`;
  const cPoints = cosinePlots.flat();
  let cAllX = cPoints.map(p => p.x);
  let cAllY = cPoints.map(p => p.y);
  let cMinX = Math.min(...cAllX), cMaxX = Math.max(...cAllX);
  let cMinY = Math.min(...cAllY), cMaxY = Math.max(...cAllY);
  cosinePlots.forEach((points, idx) => {
    const color = cosineColors[idx % cosineColors.length];
    const pts = points.map(p => {
      const px = 50 + ((p.x - cMinX) / (cMaxX - cMinX)) * 700;
      const py = 890 - ((p.y - cMinY) / (cMaxY - cMinY)) * 180;
      return `${formatNumber(px)},${formatNumber(py)}`;
    }).join(' ');
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });

  if (rotate !== 0) {
    svg += '  </g>\n';
  }
  svg += '</svg>';
  return svg;
};

const plotToSvg = ({ formulas = [], grid = false, rotate = 0, customTitle = '' } = {}) => {
  const { quadratic, linear, sine, cosine } = getPlotsFromFormulas(formulas);
  return generateSvg(quadratic, linear, sine, cosine, grid, rotate, customTitle);
};

const plotToHtml = ({ formulas = [], grid = false, rotate = 0, customTitle = '' } = {}) => {
  const svgContent = plotToSvg({ formulas, grid, rotate, customTitle });
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Equation Plot</title>\n  <style>\n    body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8f8f8; }\n  </style>\n</head>\n<body>\n${svgContent}\n</body>\n</html>`;
};

const plotToJson = ({ formulas = [] } = {}) => {
  const { quadratic, linear, sine, cosine } = getPlotsFromFormulas(formulas);
  return { quadratic, linear, sine, cosine };
};

// Simplified text and markdown outputs
const plotToText = ({ formulas = [] } = {}) => {
  const { quadratic, linear, sine, cosine } = getPlotsFromFormulas(formulas);
  let output = 'Quadratic Plot:\n' + quadratic.map((pts, i) => `Formula ${i + 1}: ` + pts.map(p => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(' ')).join('\n') + '\n\n';
  output += 'Linear Plot:\n' + linear.map((pts, i) => `Formula ${i + 1}: ` + pts.map(p => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(' ')).join('\n') + '\n\n';
  output += 'Sine Plot:\n' + sine.map((pts, i) => `Formula ${i + 1}: ` + pts.map(p => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(' ')).join('\n') + '\n\n';
  output += 'Cosine Plot:\n' + cosine.map((pts, i) => `Formula ${i + 1}: ` + pts.map(p => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(' ')).join('\n') + '\n';
  return output;
};

const plotToMarkdown = ({ formulas = [] } = {}) => {
  const text = plotToText({ formulas });
  return `# Plot Data\n\n` + text;
};

const plotToCsv = ({ formulas = [] } = {}) => {
  const { quadratic, linear, sine, cosine } = getPlotsFromFormulas(formulas);
  const lines = [ 'Plot,Formula,x,y' ];
  lines.push('--Quadratic Plot--');
  quadratic.forEach((pts, i) => pts.forEach(p => lines.push(`Quadratic,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`)));
  lines.push('--Linear Plot--');
  linear.forEach((pts, i) => pts.forEach(p => lines.push(`Linear,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`)));
  lines.push('--Sine Plot--');
  sine.forEach((pts, i) => pts.forEach(p => lines.push(`Sine,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`)));
  lines.push('--Cosine Plot--');
  cosine.forEach((pts, i) => pts.forEach(p => lines.push(`Cosine,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`)));
  return lines.join('\n');
};

// Simplified ASCII art generation
const plotToAscii = ({ formulas = [] } = {}) => {
  // Return a placeholder ASCII art representation
  return 'ASCII Art Representation: [Sine Wave]\n';
};

const plotToFile = async ({ formulas = [], outputFileName = 'output.svg', type = 'svg' } = {}) => {
  let content = '';
  if (type === 'svg') {
    content = plotToSvg({ formulas });
  } else if (type === 'ascii') {
    content = plotToAscii({ formulas });
  } else if (type === 'text') {
    content = plotToText({ formulas });
  } else if (type === 'json') {
    content = JSON.stringify(plotToJson({ formulas }), null, 2);
  } else if (type === 'csv') {
    content = plotToCsv({ formulas });
  } else if (type === 'html') {
    content = plotToHtml({ formulas });
  } else if (type === 'md') {
    content = plotToMarkdown({ formulas });
  } else {
    throw new Error('Unsupported type provided for plotToFile');
  }
  try {
    if (outputFileName.toLowerCase().endsWith('.png')) {
      const svgContent = plotToSvg({ formulas });
      await sharp(Buffer.from(svgContent)).png().toFile(outputFileName);
    } else {
      fs.writeFileSync(outputFileName, content, 'utf8');
    }
  } catch (e) {
    console.warn('Error writing file:', e);
    throw e;
  }
  return outputFileName;
};

// Demo Test Function
const demoTest = () => {
  console.log('=== Demo Test Output ===');
  const demoPlotJson = plotToJson({ formulas: ['sine:1,1,0,0,360,30'] });
  console.log("Plot JSON output for formula 'sine:1,1,0,0,360,30':");
  console.log(JSON.stringify(demoPlotJson, null, 2));
  const demoMarkdown = plotToMarkdown({ formulas: ['y=2x+3:-10,10,1'] });
  console.log("\nPlot Markdown output for formula 'y=2x+3:-10,10,1':");
  console.log(demoMarkdown);
  const demoText = plotToText({ formulas: ['quad:1,0,0,-10,10,1'] });
  console.log("\nPlot Text output for formula 'quad:1,0,0,-10,10,1':");
  console.log(demoText);
  const demoAscii = plotToAscii({ formulas: ['sine:1,1,0,0,360,30'] });
  console.log("\nPlot ASCII art output for formula 'sine:1,1,0,0,360,30':");
  console.log(demoAscii);
  const demoCsv = plotToCsv({ formulas: ['quad:1,0,0,-10,10,1'] });
  console.log("\nPlot CSV output for formula 'quad:1,0,0,-10,10,1':");
  console.log(demoCsv);
  const demoHtml = plotToHtml({ formulas: ['y=2x+3:-10,10,1'], grid: true });
  console.log("\nPlot HTML output for formula 'y=2x+3:-10,10,1':");
  console.log(demoHtml);
  console.log('=== End Demo Test Output ===');
};

// Main Execution
const main = async () => {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('No arguments provided. Running default demo output.');
    const fileContent = plotToSvg({ formulas: [] });
    const outputFileName = 'output.svg';
    fs.writeFileSync(outputFileName, fileContent, 'utf8');
    console.log(`SVG file generated: ${outputFileName}`);
    console.log('Execution completed. Terminating without waiting for user input.');
    if (process.argv.includes('--summary')) {
      const plotsInfo = getPlotsFromFormulas([]);
      console.log('\nSummary of Plots:');
      for (const key in plotsInfo) {
        if (plotsInfo[key].length > 0) {
          const summary = getSummary(plotsInfo[key][0]);
          console.log(`${key}:`, summary);
        }
      }
    }
    if (process.argv.includes('--table')) {
      const plotsInfo = getPlotsFromFormulas([]);
      const tableData = [];
      for (const key in plotsInfo) {
        if (plotsInfo[key].length > 0) {
          const summary = getSummary(plotsInfo[key][0]);
          tableData.push({
            PlotType: key,
            MinX: summary.minX,
            MaxX: summary.maxX,
            AvgX: summary.avgX,
            MinY: summary.minY,
            MaxY: summary.maxY,
            AvgY: summary.avgY
          });
        }
      }
      console.log('\nSummary Table of Plots:');
      console.table(tableData);
    }
    process.exit(0);
  }

  let outputFileName = 'output.svg';
  const nonFormulaArgs = args.filter(arg => !arg.includes(":") && !arg.includes('='));
  if (nonFormulaArgs.length > 0) {
    outputFileName = nonFormulaArgs[0];
  }
  const lowerName = outputFileName.toLowerCase();
  let isJson = args.includes('--json') || lowerName.endsWith('.json');
  let isCsv = args.includes('--csv') || lowerName.endsWith('.csv');
  let isHtml = args.includes('--html') || lowerName.endsWith('.html');
  let isMarkdown = args.includes('--md') || lowerName.endsWith('.md');
  let isAscii = args.includes('--ascii') || lowerName.endsWith('.txt') || lowerName.endsWith('.ascii');

  const formulasList = args.filter(arg => arg.includes(":") || arg.includes('='));
  const gridEnabled = args.includes('--grid');
  let rotation = 0;
  const rotateIndex = args.findIndex(arg => arg.startsWith('--rotate'));
  if (rotateIndex > -1) {
    let angleStr = '';
    const rotateArg = args[rotateIndex];
    if (rotateArg.includes('=')) {
      angleStr = rotateArg.split('=')[1];
    } else if (args.length > rotateIndex + 1) {
      angleStr = args[rotateIndex + 1];
    }
    rotation = parseFloat(angleStr) || 0;
  }
  let customTitle = '';
  const titleIndex = args.findIndex(arg => arg.startsWith('--title'));
  if (titleIndex > -1) {
    let titleStr = '';
    const titleArg = args[titleIndex];
    if (titleArg.includes('=')) {
      titleStr = titleArg.split('=')[1];
    } else if (args.length > titleIndex + 1) {
      titleStr = args[titleIndex + 1];
    }
    customTitle = titleStr;
  }

  const isDebug = args.includes('--debug');
  if (isDebug) {
    console.log('\nDebug: Internal parsed plot data:');
    console.log(JSON.stringify(getPlotsFromFormulas(formulasList), null, 2));
  }

  let fileContent = '';
  if (isJson) {
    fileContent = JSON.stringify(plotToJson({ formulas: formulasList }), null, 2);
  } else if (isCsv) {
    fileContent = plotToCsv({ formulas: formulasList });
  } else if (isHtml) {
    fileContent = plotToHtml({ formulas: formulasList, grid: gridEnabled, rotate, customTitle });
  } else if (isMarkdown) {
    fileContent = plotToMarkdown({ formulas: formulasList });
  } else if (isAscii) {
    fileContent = plotToAscii({ formulas: formulasList });
  } else {
    fileContent = plotToSvg({ formulas: formulasList, grid: gridEnabled, rotate, customTitle });
  }

  try {
    if (lowerName.endsWith('.png')) {
      const svgContent = plotToSvg({ formulas: formulasList, grid: gridEnabled, rotate, customTitle });
      await sharp(Buffer.from(svgContent)).png().toFile(outputFileName);
      console.log(`\nPNG file generated: ${outputFileName}`);
    } else {
      fs.writeFileSync(outputFileName, fileContent, 'utf8');
      console.log(`\n${isJson ? 'JSON' : isCsv ? 'CSV' : isHtml ? 'HTML' : isMarkdown ? 'Markdown' : isAscii ? 'ASCII' : 'SVG'} file generated: ${outputFileName}`);
    }
  } catch (err) {
    console.warn(`Error writing file:`, err.message);
    process.exit(1);
  }

  console.log('\nText Representation of Plots:');
  console.log(plotToText({ formulas: formulasList }));

  if (args.includes('--summary')) {
    const plotsInfo = getPlotsFromFormulas(formulasList);
    console.log('\nSummary of Plots:');
    for (const key in plotsInfo) {
      if (plotsInfo[key].length > 0) {
        const summary = getSummary(plotsInfo[key][0]);
        console.log(`${key}:`, summary);
      }
    }
  }

  if (args.includes('--table')) {
    const plotsInfo = getPlotsFromFormulas(formulasList);
    const tableData = [];
    for (const key in plotsInfo) {
      if (plotsInfo[key].length > 0) {
        const summary = getSummary(plotsInfo[key][0]);
        tableData.push({
          PlotType: key,
          MinX: summary.minX,
          MaxX: summary.maxX,
          AvgX: summary.avgX,
          MinY: summary.minY,
          MaxY: summary.maxY,
          AvgY: summary.avgY
        });
      }
    }
    console.log('\nSummary Table of Plots:');
    console.table(tableData);
  }
};

process.on('uncaughtException', (err) => {
  console.warn('Unhandled Exception:', err);
  process.exit(1);
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => {
    console.warn(err);
    process.exit(1);
  });
}

export { main, plotToSvg, plotToJson, plotToText, plotToCsv, plotToHtml, plotToMarkdown, plotToAscii, plotFromString, getSummary, parseQuadratic, parseSine, parseCosine, parseLinear, parseGenericLinear };
