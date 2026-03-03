#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";

// Token types for mathematical expressions
const TokenType = {
  NUMBER: 'NUMBER',
  VARIABLE: 'VARIABLE',
  FUNCTION: 'FUNCTION',
  OPERATOR: 'OPERATOR',
  LEFT_PAREN: 'LEFT_PAREN',
  RIGHT_PAREN: 'RIGHT_PAREN',
  EOF: 'EOF'
};

// Mathematical functions supported
const MATH_FUNCTIONS = {
  'sin': Math.sin,
  'cos': Math.cos,
  'tan': Math.tan,
  'log': Math.log,
  'ln': Math.log,
  'exp': Math.exp,
  'sqrt': Math.sqrt,
  'abs': Math.abs,
  'floor': Math.floor,
  'ceil': Math.ceil,
  'round': Math.round
};

class Token {
  constructor(type, value, position = 0) {
    this.type = type;
    this.value = value;
    this.position = position;
  }
}

class Tokenizer {
  constructor(expression) {
    this.expression = expression.replace(/\s+/g, ''); // Remove whitespace
    this.position = 0;
  }

  peek() {
    return this.position < this.expression.length ? this.expression[this.position] : null;
  }

  advance() {
    return this.position < this.expression.length ? this.expression[this.position++] : null;
  }

  tokenize() {
    const tokens = [];
    
    while (this.position < this.expression.length) {
      const char = this.peek();
      
      if (this.isDigit(char)) {
        tokens.push(this.readNumber());
      } else if (this.isAlpha(char)) {
        tokens.push(this.readIdentifier());
      } else if (this.isOperator(char)) {
        tokens.push(this.readOperator());
      } else if (char === '(') {
        tokens.push(new Token(TokenType.LEFT_PAREN, char, this.position));
        this.advance();
      } else if (char === ')') {
        tokens.push(new Token(TokenType.RIGHT_PAREN, char, this.position));
        this.advance();
      } else {
        throw new Error(`Unexpected character '${char}' at position ${this.position}`);
      }
    }
    
    tokens.push(new Token(TokenType.EOF, null, this.position));
    return tokens;
  }

  isDigit(char) {
    return char && /[0-9.]/.test(char);
  }

  isAlpha(char) {
    return char && /[a-zA-Z_]/.test(char);
  }

  isOperator(char) {
    return char && /[+\-*/^]/.test(char);
  }

  readNumber() {
    const start = this.position;
    let value = '';
    let hasDot = false;
    
    while (this.peek() && this.isDigit(this.peek())) {
      const char = this.peek();
      if (char === '.') {
        if (hasDot) break;
        hasDot = true;
      }
      value += this.advance();
    }
    
    return new Token(TokenType.NUMBER, parseFloat(value), start);
  }

  readIdentifier() {
    const start = this.position;
    let value = '';
    
    while (this.peek() && (this.isAlpha(this.peek()) || this.isDigit(this.peek()))) {
      value += this.advance();
    }
    
    const type = MATH_FUNCTIONS.hasOwnProperty(value) ? TokenType.FUNCTION : TokenType.VARIABLE;
    return new Token(type, value, start);
  }

  readOperator() {
    const start = this.position;
    const value = this.advance();
    return new Token(TokenType.OPERATOR, value, start);
  }
}

// AST Node types
class NumberNode {
  constructor(value) {
    this.value = value;
  }

  evaluate(variables = {}) {
    return this.value;
  }
}

class VariableNode {
  constructor(name) {
    this.name = name;
  }

  evaluate(variables = {}) {
    if (!(this.name in variables)) {
      throw new Error(`Undefined variable: ${this.name}`);
    }
    return variables[this.name];
  }
}

class BinaryOpNode {
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  evaluate(variables = {}) {
    const leftVal = this.left.evaluate(variables);
    const rightVal = this.right.evaluate(variables);
    
    switch (this.operator) {
      case '+': return leftVal + rightVal;
      case '-': return leftVal - rightVal;
      case '*': return leftVal * rightVal;
      case '/': 
        if (rightVal === 0) throw new Error('Division by zero');
        return leftVal / rightVal;
      case '^': return Math.pow(leftVal, rightVal);
      default:
        throw new Error(`Unknown operator: ${this.operator}`);
    }
  }
}

class UnaryOpNode {
  constructor(operator, operand) {
    this.operator = operator;
    this.operand = operand;
  }

  evaluate(variables = {}) {
    const val = this.operand.evaluate(variables);
    
    switch (this.operator) {
      case '+': return +val;
      case '-': return -val;
      default:
        throw new Error(`Unknown unary operator: ${this.operator}`);
    }
  }
}

class FunctionNode {
  constructor(name, argument) {
    this.name = name;
    this.argument = argument;
  }

  evaluate(variables = {}) {
    const func = MATH_FUNCTIONS[this.name];
    if (!func) {
      throw new Error(`Unknown function: ${this.name}`);
    }
    
    const argVal = this.argument.evaluate(variables);
    return func(argVal);
  }
}

class ExpressionParser {
  constructor(expression) {
    this.tokens = new Tokenizer(expression).tokenize();
    this.position = 0;
  }

  peek() {
    return this.position < this.tokens.length ? this.tokens[this.position] : null;
  }

  advance() {
    return this.position < this.tokens.length ? this.tokens[this.position++] : null;
  }

  parse() {
    const result = this.parseExpression();
    if (this.peek().type !== TokenType.EOF) {
      throw new Error('Unexpected tokens after expression');
    }
    return result;
  }

  parseExpression() {
    return this.parseAddSubtract();
  }

  parseAddSubtract() {
    let left = this.parseMultiplyDivide();
    
    while (this.peek() && this.peek().type === TokenType.OPERATOR && 
           (this.peek().value === '+' || this.peek().value === '-')) {
      const operator = this.advance().value;
      const right = this.parseMultiplyDivide();
      left = new BinaryOpNode(left, operator, right);
    }
    
    return left;
  }

  parseMultiplyDivide() {
    let left = this.parseExponent();
    
    while (this.peek() && this.peek().type === TokenType.OPERATOR && 
           (this.peek().value === '*' || this.peek().value === '/')) {
      const operator = this.advance().value;
      const right = this.parseExponent();
      left = new BinaryOpNode(left, operator, right);
    }
    
    return left;
  }

  parseExponent() {
    let left = this.parseUnary();
    
    if (this.peek() && this.peek().type === TokenType.OPERATOR && this.peek().value === '^') {
      const operator = this.advance().value;
      const right = this.parseExponent(); // Right associative
      left = new BinaryOpNode(left, operator, right);
    }
    
    return left;
  }

  parseUnary() {
    if (this.peek() && this.peek().type === TokenType.OPERATOR && 
        (this.peek().value === '+' || this.peek().value === '-')) {
      const operator = this.advance().value;
      const operand = this.parseUnary();
      return new UnaryOpNode(operator, operand);
    }
    
    return this.parsePrimary();
  }

  parsePrimary() {
    const token = this.peek();
    
    if (!token) {
      throw new Error('Unexpected end of expression');
    }
    
    if (token.type === TokenType.NUMBER) {
      this.advance();
      return new NumberNode(token.value);
    }
    
    if (token.type === TokenType.VARIABLE) {
      this.advance();
      return new VariableNode(token.value);
    }
    
    if (token.type === TokenType.FUNCTION) {
      const funcName = this.advance().value;
      if (this.peek().type !== TokenType.LEFT_PAREN) {
        throw new Error(`Expected '(' after function ${funcName}`);
      }
      this.advance(); // consume '('
      const argument = this.parseExpression();
      if (this.peek().type !== TokenType.RIGHT_PAREN) {
        throw new Error(`Expected ')' after function ${funcName} argument`);
      }
      this.advance(); // consume ')'
      return new FunctionNode(funcName, argument);
    }
    
    if (token.type === TokenType.LEFT_PAREN) {
      this.advance(); // consume '('
      const expression = this.parseExpression();
      if (this.peek().type !== TokenType.RIGHT_PAREN) {
        throw new Error("Expected ')'");
      }
      this.advance(); // consume ')'
      return expression;
    }
    
    throw new Error(`Unexpected token: ${token.type} '${token.value}'`);
  }
}

// Main API functions
export function parseExpression(expression) {
  const parser = new ExpressionParser(expression);
  return parser.parse();
}

export function evaluateExpression(expression, variables = {}) {
  const ast = parseExpression(expression);
  return ast.evaluate(variables);
}

export function generateTimeSeries(expression, xMin, xMax, steps = 100) {
  const ast = parseExpression(expression);
  const points = [];
  const step = (xMax - xMin) / (steps - 1);
  
  for (let i = 0; i < steps; i++) {
    const x = xMin + i * step;
    try {
      const y = ast.evaluate({ x });
      points.push({ x, y });
    } catch (error) {
      // Skip invalid points (e.g., division by zero, domain errors)
      continue;
    }
  }
  
  return points;
}

// SVG Plot Renderer
export function createSVGPlot(points, options = {}) {
  const {
    width = 800,
    height = 600, 
    margin = { top: 40, right: 40, bottom: 60, left: 60 },
    title = 'Mathematical Plot',
    xLabel = 'x',
    yLabel = 'y',
    strokeColor = '#0066cc',
    strokeWidth = 2,
    gridColor = '#e0e0e0'
  } = options;

  if (points.length === 0) {
    throw new Error('No valid data points to plot');
  }

  // Calculate plot area dimensions
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // Find data bounds
  const xValues = points.map(p => p.x);
  const yValues = points.map(p => p.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  // Add padding to y-axis
  const yPadding = (yMax - yMin) * 0.1;
  const yMinPadded = yMin - yPadding;
  const yMaxPadded = yMax + yPadding;
  
  // Create scaling functions
  const xScale = (x) => margin.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const yScale = (y) => margin.top + plotHeight - ((y - yMinPadded) / (yMaxPadded - yMinPadded)) * plotHeight;
  
  // Generate SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="white"/>
  
  <!-- Grid lines -->
  <g stroke="${gridColor}" stroke-width="1" fill="none">`;

  // Vertical grid lines
  const xTicks = 10;
  for (let i = 0; i <= xTicks; i++) {
    const x = xMin + (xMax - xMin) * (i / xTicks);
    const screenX = xScale(x);
    svg += `\n    <line x1="${screenX}" y1="${margin.top}" x2="${screenX}" y2="${height - margin.bottom}"/>`;
  }
  
  // Horizontal grid lines
  const yTicks = 8;
  for (let i = 0; i <= yTicks; i++) {
    const y = yMinPadded + (yMaxPadded - yMinPadded) * (i / yTicks);
    const screenY = yScale(y);
    svg += `\n    <line x1="${margin.left}" y1="${screenY}" x2="${width - margin.right}" y2="${screenY}"/>`;
  }
  
  svg += `\n  </g>
  
  <!-- Axes -->
  <g stroke="black" stroke-width="2" fill="none">
    <!-- X-axis -->
    <line x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}"/>
    <!-- Y-axis -->
    <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height - margin.bottom}"/>
  </g>
  
  <!-- Axis labels -->
  <g fill="black" font-family="Arial, sans-serif" font-size="14" text-anchor="middle">`;
  
  // X-axis labels
  for (let i = 0; i <= xTicks; i++) {
    const x = xMin + (xMax - xMin) * (i / xTicks);
    const screenX = xScale(x);
    const label = x.toFixed(1);
    svg += `\n    <text x="${screenX}" y="${height - margin.bottom + 20}">${label}</text>`;
  }
  
  svg += '\n  </g>\n  \n  <g fill="black" font-family="Arial, sans-serif" font-size="14" text-anchor="end">';
  
  // Y-axis labels  
  for (let i = 0; i <= yTicks; i++) {
    const y = yMinPadded + (yMaxPadded - yMinPadded) * (i / yTicks);
    const screenY = yScale(y);
    const label = y.toFixed(1);
    svg += `\n    <text x="${margin.left - 10}" y="${screenY + 5}">${label}</text>`;
  }
  
  svg += `\n  </g>
  
  <!-- Axis titles -->
  <g fill="black" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">
    <!-- X-axis title -->
    <text x="${width / 2}" y="${height - 10}">${xLabel}</text>
    <!-- Y-axis title -->
    <text x="20" y="${height / 2}" transform="rotate(-90, 20, ${height / 2})">${yLabel}</text>
    <!-- Plot title -->
    <text x="${width / 2}" y="25" font-size="18" font-weight="bold">${title}</text>
  </g>
  
  <!-- Plot line -->
  <path d="`;
  
  // Generate path data
  points.forEach((point, index) => {
    const x = xScale(point.x);
    const y = yScale(point.y);
    svg += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });
  
  svg += `" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="none"/>
  
</svg>`;

  return svg;
}

export async function main(args) {
  if (args.length === 0) {
    console.log('plot-code-lib - Mathematical Expression Plotter');
    console.log('');
    console.log('Usage:');
    console.log('  node src/lib/main.js --expr "sin(x)" --range "-1:1" --output plot.svg');
    console.log('');
    console.log('Options:');
    console.log('  --expr     Mathematical expression (e.g., "sin(x)", "x^2 + 2*x + 1")');
    console.log('  --range    Range for x values (e.g., "-1:1", "0:10:0.1")');
    console.log('  --output   Output file name (default: plot.svg)');
    console.log('  --format   Output format: svg or png (default: svg)');
    console.log('  --steps    Number of data points to generate (default: 200)');
    console.log('');
    console.log('Examples:');
    console.log('  node src/lib/main.js --expr "sin(x)" --range "-3.14:3.14"');
    console.log('  node src/lib/main.js --expr "x^2" --range "-2:2" --output parabola.svg');
    console.log('  node src/lib/main.js --expr "log(x)" --range "0.1:10" --output log_plot.svg');
    return;
  }

  // Simple argument parsing for now
  const options = parseArgs(args);
  
  if (!options.expr) {
    console.error('Error: --expr option is required');
    console.log('Run without arguments to see usage information.');
    return;
  }
  
  try {
    // Parse expression to validate it
    const ast = parseExpression(options.expr);
    console.log(`✓ Successfully parsed expression: ${options.expr}`);
    
    // Parse range and generate data points
    const range = parseRange(options.range || '-5:5');
    const steps = options.steps || 200;
    const points = generateTimeSeries(options.expr, range.min, range.max, steps);
    
    if (points.length === 0) {
      throw new Error('No valid data points generated - check your expression and range');
    }
    
    console.log(`✓ Generated ${points.length} data points over range [${range.min}, ${range.max}]`);
    
    // Determine output filename and format
    const output = options.output || 'plot.svg';
    const format = options.format || (output.endsWith('.png') ? 'png' : 'svg');
    
    // Create plot
    const plotOptions = {
      title: `y = ${options.expr}`,
      xLabel: 'x',
      yLabel: 'y'
    };
    
    if (format === 'svg' || format === 'SVG') {
      const svg = createSVGPlot(points, plotOptions);
      
      // Write SVG file
      const fs = await import('fs');
      await fs.promises.writeFile(output, svg, 'utf8');
      
      console.log(`✓ SVG plot saved to: ${output}`);
      console.log(`  Data points: ${points.length}`);
      console.log(`  X range: [${range.min.toFixed(2)}, ${range.max.toFixed(2)}]`);
      
      // Show Y range from actual data
      const yValues = points.map(p => p.y);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      console.log(`  Y range: [${yMin.toFixed(2)}, ${yMax.toFixed(2)}]`);
      
    } else if (format === 'png' || format === 'PNG') {
      console.error('PNG format not yet implemented. Use SVG format for now.');
      console.log('Tip: Use --format svg or use .svg file extension');
    } else {
      throw new Error(`Unsupported format: ${format}. Use 'svg' or 'png'.`);
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function parseArgs(args) {
  const options = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--expr':
      case '--expression':
        options.expr = value;
        break;
      case '--range':
        options.range = value;
        break;
      case '--output':
        options.output = value;
        break;
      case '--format':
        options.format = value;
        break;
      case '--steps':
        options.steps = parseInt(value, 10);
        if (isNaN(options.steps) || options.steps < 2) {
          throw new Error('Steps must be a number >= 2');
        }
        break;
    }
  }
  
  return options;
}

function parseRange(rangeStr) {
  const parts = rangeStr.split(':');
  if (parts.length < 2) {
    throw new Error('Range must be in format "min:max" or "min:max:step"');
  }
  
  const min = parseFloat(parts[0]);
  const max = parseFloat(parts[1]);
  const step = parts.length > 2 ? parseFloat(parts[2]) : (max - min) / 100;
  
  if (isNaN(min) || isNaN(max) || isNaN(step)) {
    throw new Error('Invalid range values');
  }
  
  if (min >= max) {
    throw new Error('Range minimum must be less than maximum');
  }
  
  return { min, max, step };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}
